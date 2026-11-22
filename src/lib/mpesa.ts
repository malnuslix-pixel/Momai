// ==============================================================================
// MWALIMU FAMILY - M-PESA DARAJA API CLIENT
// Safaricom M-Pesa STK Push integration for subscription payments
// ==============================================================================

const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || 'SANDBOX_KEY';
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || 'SANDBOX_SECRET';
const MPESA_PASSKEY = process.env.MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE || '174379';
const MPESA_ENV = process.env.MPESA_ENV || 'sandbox';

const BASE_URL = MPESA_ENV === 'production'
  ? 'https://api.safaricom.co.ke'
  : 'https://sandbox.safaricom.co.ke';

export async function getMpesaToken(): Promise<string> {
  const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
  const res = await fetch(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
  });
  const data = await res.json();
  return data.access_token;
}

export function formatPhone(phone: string): string {
  let clean = phone.replace(/[^0-9]/g, '');
  if (clean.startsWith('0')) clean = '254' + clean.slice(1);
  if (clean.startsWith('+')) clean = clean.slice(1);
  if (!clean.startsWith('254')) clean = '254' + clean;
  return clean;
}

export async function initiateSTKPush(params: {
  phone: string;
  amount: number;
  accountRef: string;
  description?: string;
  callbackUrl: string;
}): Promise<{
  ok: boolean;
  CheckoutRequestID?: string;
  MerchantRequestID?: string;
  ResponseDescription?: string;
  error?: string;
}> {
  try {
    const token = await getMpesaToken();
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);
    const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');
    const phone = formatPhone(params.phone);

    const res = await fetch(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: params.amount,
        PartyA: phone,
        PartyB: MPESA_SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: params.callbackUrl,
        AccountReference: params.accountRef,
        TransactionDesc: params.description || 'Mwalimu Family Subscription',
      }),
    });

    const data = await res.json();

    if (data.ResponseCode === '0') {
      return {
        ok: true,
        CheckoutRequestID: data.CheckoutRequestID,
        MerchantRequestID: data.MerchantRequestID,
        ResponseDescription: data.ResponseDescription,
      };
    }
    return { ok: false, error: data.errorMessage || data.ResponseDescription || 'STK Push failed' };
  } catch (error: any) {
    return { ok: false, error: error.message || 'Network error' };
  }
}

export async function querySTKStatus(checkoutRequestId: string): Promise<{
  ok: boolean;
  ResultCode?: number;
  ResultDesc?: string;
}> {
  try {
    const token = await getMpesaToken();
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);
    const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');

    const res = await fetch(`${BASE_URL}/mpesa/stkpushquery/v1/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      }),
    });

    const data = await res.json();
    return { ok: true, ResultCode: data.ResultCode, ResultDesc: data.ResultDesc };
  } catch {
    return { ok: false };
  }
}
