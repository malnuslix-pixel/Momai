import { NextRequest, NextResponse } from 'next/server';
import { supabase, getAdminClient, SEED_SUBMISSIONS } from '@/lib/supabase';
import { SubmissionType } from '@/lib/types';

const TYPES: Record<SubmissionType, string> = {
  job: 'Job listing',
  ad: 'Advertising quote',
  find: 'Tutor request',
  tut: 'Tutor application',
  note: 'Notice',
};

const clean = (s: any, max = 2000) =>
  String(s ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Honeypot check
    if (body.website) {
      return NextResponse.json({ ok: true, ref: 'OK' });
    }

    const type = body.type as SubmissionType;
    if (!TYPES[type] || body.consent !== true) {
      return NextResponse.json({ error: 'invalid' }, { status: 400 });
    }

    if (!Array.isArray(body.fields) || body.fields.length === 0 || body.fields.length > 15) {
      return NextResponse.json({ error: 'invalid' }, { status: 400 });
    }

    const fields: [string, string][] = body.fields.map((f: any) => [
      clean(f?.[0], 80),
      clean(f?.[1], 2000),
    ]);

    if (fields.some(([label, value]) => !label || !value)) {
      return NextResponse.json({ error: 'invalid' }, { status: 400 });
    }

    // Generate unique reference ID
    const ref = /^[A-Z]{3}-\d{6}-\d{4}$/.test(body.ref || '')
      ? body.ref
      : `${type.toUpperCase().slice(0, 3)}-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${1000 + Math.floor(Math.random() * 9000)}`;

    const fromName = fields.find(([l]) =>
      /from|name|school|organization|client|tutor|parent|organizer/i.test(l)
    )?.[1] || 'Anonymous';

    const title = fields.find(([l]) =>
      /title|role|subject|topic|package|position/i.test(l)
    )?.[1] || `${TYPES[type]} submission`;

    const record = {
      ref,
      type,
      label: TYPES[type],
      from_name: fromName,
      title,
      fields,
      st: 'new',
      checks: [false, false, false],
      consent: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Attempt Supabase insert
    const admin = getAdminClient();
    const { error: sbError } = await admin.from('submissions').insert([record]);

    if (sbError) {
      console.warn('Supabase insert warning, persisting in memory/fallback:', sbError.message);
      SEED_SUBMISSIONS.unshift({ ...record, hrs: 0 });
    }

    // Audit log
    try {
      await admin.from('audit_log').insert([
        {
          action: `New ${TYPES[type]} submitted (${ref})`,
          details: { ref, title, from: fromName },
        },
      ]);
    } catch {}

    return NextResponse.json({ ok: true, ref }, { status: 200 });
  } catch (err: any) {
    console.error('Submit API error:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
