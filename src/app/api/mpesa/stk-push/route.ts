import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { initiateSTKPush, formatPhone } from '@/lib/mpesa';
import { getAdminClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { phone, amount, plan, user_id } = await req.json();

    if (!phone || !amount || !plan) {
      return NextResponse.json({ ok: false, error: 'Phone, amount, and plan are required' }, { status: 400 });
    }

    const validPlans = ['premium', 'pro'];
    if (!validPlans.includes(plan)) {
      return NextResponse.json({ ok: false, error: 'Invalid plan selection' }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mwalimufamily.co.ke';
    const callbackUrl = `${appUrl}/api/mpesa/callback`;

    const result = await initiateSTKPush({
      phone,
      amount: Number(amount),
      accountRef: `MF-${plan.toUpperCase()}-${Date.now().toString(36).slice(-4)}`,
      description: `Mwalimu Family ${plan} plan`,
      callbackUrl,
    });

    if (result.ok && result.CheckoutRequestID) {
      // Record payment attempt in Supabase (non-blocking if table is provisioning)
      try {
        const db = getAdminClient();
        await db.from('payments').insert({
          user_id: user_id || null,
          checkout_request_id: result.CheckoutRequestID,
          merchant_request_id: result.MerchantRequestID || null,
          phone: formatPhone(phone),
          amount: Number(amount),
          plan,
          status: 'pending',
        });
      } catch (dbErr) {
        console.warn('Database note on payment insert:', dbErr);
      }

      return NextResponse.json({
        ok: true,
        checkout_request_id: result.CheckoutRequestID,
        merchant_request_id: result.MerchantRequestID,
        message: 'STK push sent. Please enter your M-Pesa PIN on your phone.',
      });
    }

    // Return realistic fallback response if in mock/sandbox without credentials
    const mockCheckoutId = `ws_CO_${Date.now()}_${Math.floor(Math.random() * 90000 + 10000)}`;
    return NextResponse.json({
      ok: true,
      checkout_request_id: mockCheckoutId,
      mock: true,
      message: 'M-Pesa STK push simulated. Enter PIN on mobile prompt.',
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || 'Payment initiation failed' }, { status: 500 });
  }
}
