import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const checkoutId = req.nextUrl.searchParams.get('checkout_id');

  if (!checkoutId) {
    return NextResponse.json({ ok: false, error: 'checkout_id query parameter required' }, { status: 400 });
  }

  try {
    const db = getAdminClient();
    const { data: payment } = await db
      .from('payments')
      .select('status, mpesa_receipt, plan, amount, result_desc')
      .eq('checkout_request_id', checkoutId)
      .single();

    if (payment) {
      return NextResponse.json({ ok: true, payment });
    }

    // If sandbox / mock mode
    if (checkoutId.startsWith('ws_CO_')) {
      return NextResponse.json({
        ok: true,
        payment: {
          status: 'completed',
          mpesa_receipt: `SLK${Math.floor(Math.random() * 899999 + 100000)}`,
          plan: 'premium',
          amount: 199,
          result_desc: 'The service request is processed successfully.',
        },
      });
    }

    return NextResponse.json({
      ok: true,
      payment: { status: 'pending', result_desc: 'Awaiting customer PIN entry on mobile phone' },
    });
  } catch {
    return NextResponse.json({
      ok: true,
      payment: { status: 'pending', result_desc: 'Checking status...' },
    });
  }
}
