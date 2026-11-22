import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const callback = body?.Body?.stkCallback;

    if (!callback) {
      return NextResponse.json({ ok: false, message: 'Invalid payload' }, { status: 400 });
    }

    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = callback;
    const db = getAdminClient();

    if (ResultCode === 0 && CallbackMetadata) {
      const items = CallbackMetadata.Item || [];
      const mpesaReceipt = items.find((i: any) => i.Name === 'MpesaReceiptNumber')?.Value || '';
      const paidAmount = items.find((i: any) => i.Name === 'Amount')?.Value || 0;
      const phone = items.find((i: any) => i.Name === 'PhoneNumber')?.Value?.toString() || '';

      try {
        const { data: payment } = await db
          .from('payments')
          .update({
            status: 'completed',
            mpesa_receipt: mpesaReceipt,
            result_code: ResultCode,
            result_desc: ResultDesc,
          })
          .eq('checkout_request_id', CheckoutRequestID)
          .select()
          .single();

        if (payment) {
          const expiresAt = new Date();
          expiresAt.setMonth(expiresAt.getMonth() + 1);

          await db.from('subscriptions').upsert({
            user_id: payment.user_id,
            plan: payment.plan,
            status: 'active',
            mpesa_receipt: mpesaReceipt,
            phone,
            amount: paidAmount,
            started_at: new Date().toISOString(),
            expires_at: expiresAt.toISOString(),
          }, { onConflict: 'user_id' });
        }

        await db.from('audit_log').insert({
          action: 'M-Pesa payment completed',
          details: { receipt: mpesaReceipt, amount: paidAmount, plan: payment?.plan || 'subscription' },
        });
      } catch (err) {
        console.warn('DB update note on callback:', err);
      }
    } else {
      try {
        await db
          .from('payments')
          .update({
            status: 'failed',
            result_code: ResultCode,
            result_desc: ResultDesc,
          })
          .eq('checkout_request_id', CheckoutRequestID);
      } catch {}
    }

    return NextResponse.json({ ok: true, ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (error) {
    console.error('M-Pesa callback handling error:', error);
    return NextResponse.json({ ok: true }); // Acknowledge Safaricom to prevent retries
  }
}
