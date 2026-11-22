import { NextRequest, NextResponse } from 'next/server';
import { supabase, getAdminClient, SEED_SUBMISSIONS, SEED_ITEMS } from '@/lib/supabase';
import { Submission } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter') || 'all';

    const admin = getAdminClient();
    let query = admin.from('submissions').select('*').order('created_at', { ascending: false });

    if (filter !== 'all') {
      query = query.eq('st', filter);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      const list = filter === 'all'
        ? SEED_SUBMISSIONS
        : SEED_SUBMISSIONS.filter((s) => s.st === filter);
      return NextResponse.json({ ok: true, submissions: list });
    }

    // Calculate hours since creation
    const calculated = data.map((s: any) => {
      const diff = Math.max(0, Math.floor((Date.now() - new Date(s.created_at).getTime()) / 36e5));
      return { ...s, hrs: s.hrs ?? diff };
    });

    return NextResponse.json({ ok: true, submissions: calculated });
  } catch (err: any) {
    console.error('Submissions GET error:', err);
    return NextResponse.json({ ok: true, submissions: SEED_SUBMISSIONS });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { ref, action, checkIndex, checkValue } = body;

    if (!ref) {
      return NextResponse.json({ error: 'ref required' }, { status: 400 });
    }

    const admin = getAdminClient();

    // Checkbox toggle
    if (typeof checkIndex === 'number') {
      const { data: current } = await admin
        .from('submissions')
        .select('checks')
        .eq('ref', ref)
        .single();

      const checks = (current?.checks || [false, false, false]) as [boolean, boolean, boolean];
      checks[checkIndex] = Boolean(checkValue);

      await admin.from('submissions').update({ checks }).eq('ref', ref);

      // In-memory fallback
      const mem = SEED_SUBMISSIONS.find((s) => s.ref === ref);
      if (mem) mem.checks[checkIndex] = Boolean(checkValue);

      return NextResponse.json({ ok: true, checks });
    }

    // Approve or Reject action
    if (action === 'approve' || action === 'reject') {
      const newStatus = action === 'approve' ? 'approved' : 'rejected';

      const { data: sub } = await admin
        .from('submissions')
        .update({ st: newStatus, updated_at: new Date().toISOString() })
        .eq('ref', ref)
        .select()
        .single();

      // If approved, create a draft item in items table
      if (action === 'approve') {
        const submissionData = sub || SEED_SUBMISSIONS.find((s) => s.ref === ref);
        if (submissionData) {
          const kind = submissionData.type === 'job' ? 'job' : 'notice';
          const who = submissionData.from_name || 'Contributor';
          const loc = submissionData.fields.find(([k]) => /location|town|county/i.test(k))?.[1] || '';
          const cat = submissionData.fields.find(([k]) => /subject|category|level/i.test(k))?.[1] || 'General';

          await admin.from('items').insert([
            {
              k: kind,
              t: submissionData.title,
              who,
              loc,
              cat,
              body: submissionData.fields.map(([k, v]) => `${k}: ${v}`).join('\n'),
              st: 'draft',
              exp: new Date(Date.now() + 60 * 864e5).toISOString().slice(0, 10),
            },
          ]);
        }
      }

      // In-memory fallback
      const mem = SEED_SUBMISSIONS.find((s) => s.ref === ref);
      if (mem) mem.st = newStatus;

      // Audit log
      try {
        await admin.from('audit_log').insert([
          {
            action: `${action === 'approve' ? 'Approved' : 'Rejected'} submission ${ref}`,
            details: { ref, action },
          },
        ]);
      } catch {}

      return NextResponse.json({ ok: true, status: newStatus });
    }

    return NextResponse.json({ error: 'unknown_action' }, { status: 400 });
  } catch (err: any) {
    console.error('Submissions PATCH error:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
