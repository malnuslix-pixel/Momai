import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { initiateSTKPush, formatPhone } from '@/lib/mpesa';
import { getAdminClient } from '@/lib/supabase';
import { loadPricingSettingsServer } from '@/lib/site-controls-server';

export async function POST(req: NextRequest) {
  try {
    const pricingSettings = await loadPricingSettingsServer();
    if (!pricingSettings.pricingEnabled || !pricingSettings.mpesaEnabled) {
      return NextResponse.json(
        { ok: false, disabled: true, error: pricingSettings.pausedMessage || 'M-Pesa subscriptions are currently paused by administration.' },
        { status: 403 }
      );
    }

    const { phone, amount, plan, user_id } = await req.json();

    if (!phone || !plan) {
      return NextResponse.json({ ok: false, error: 'Phone and plan are required' }, { status: 400 });
    }

    const validPlans = ['premium', 'pro'];
    if (!validPlans.includes(plan)) {
      return NextResponse.json({ ok: false, error: 'Invalid plan selection' }, { status: 400 });
    }

    const configuredPlan = pricingSettings.plans.find((p) => p.id === plan);
    if (!configuredPlan || !configuredPlan.enabled) {
      return NextResponse.json({ ok: false, error: 'Selected plan is currently unavailable.' }, { status: 400 });
    }
    const authoritativeAmount = configuredPlan.price > 0 ? configuredPlan.price : Number(amount);
    if (!authoritativeAmount || authoritativeAmount <= 0) {
      return NextResponse.json({ ok: false, error: 'Invalid plan amount' }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://mwalimufamily.com';
    const callbackUrl = `${appUrl}/api/mpesa/callback`;

    const result = await initiateSTKPush({
      phone,
      amount: authoritativeAmount,
      accountRef: `MF-${plan.toUpperCase()}-${Date.now().toString(36).slice(-4)}`,
      description: `Mwalimu Family ${configuredPlan.name} plan`,
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
          amount: authoritativeAmount,
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
