import { NextRequest, NextResponse } from 'next/server';
import { supabase, getAdminClient } from '@/lib/supabase';

const clean = (s: any, max = 254) =>
  String(s ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);

const isEmail = (s: string) =>
  s.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Honeypot check
    if (body.website) {
      return NextResponse.json({ ok: true });
    }

    const email = clean(body.email, 254).toLowerCase();
    const name = clean(body.name, 80);

    if (!isEmail(email) || body.consent !== true) {
      return NextResponse.json({ error: 'invalid' }, { status: 400 });
    }

    const record = {
      email,
      name,
      consent: true,
      channel: 'email',
      active: true,
      created_at: new Date().toISOString(),
    };

    const admin = getAdminClient();
    const { error: sbError } = await admin
      .from('subscribers')
      .upsert([record], { onConflict: 'email' });

    if (sbError) {
      console.warn('Supabase subscribe warning:', sbError.message);
    }

    // Audit log
    try {
      await admin.from('audit_log').insert([
        {
          action: `Newsletter subscription: ${email}`,
          details: { email, name },
        },
      ]);
    } catch {}

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    console.error('Subscribe API error:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
