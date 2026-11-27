import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { verifyRequestAdmin } from '@/lib/auth';
import { getAdminClient } from '@/lib/supabase';
import { getLevel } from '@/lib/gamification';

export async function GET(req: NextRequest) {
  if (!(await verifyRequestAdmin(req))) {
    return NextResponse.json({ ok: false, error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  const scope = req.nextUrl.searchParams.get('scope') || 'all';
  const db = getAdminClient();

  try {
    if (scope === 'pricing') {
      let payments: any[] = [];
      try {
        const { data } = await db
          .from('payments')
          .select('id, phone, amount, plan, status, mpesa_receipt, result_desc, checkout_request_id, created_at')
          .order('created_at', { ascending: false })
          .limit(50);
        payments = Array.isArray(data) ? data : [];
      } catch {}

      const completed = payments.filter((p) => p.status === 'completed');
      const pending = payments.filter((p) => p.status === 'pending');
      const failed = payments.filter((p) => p.status === 'failed');
      const totalRevenueKes = completed.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);

      return NextResponse.json(
        {
          ok: true,
          summary: {
            totalPayments: payments.length,
            completedCount: completed.length,
            pendingCount: pending.length,
            failedCount: failed.length,
            totalRevenueKes,
          },
          payments,
        },
        { headers: { 'Cache-Control': 'no-store, max-age=0' } }
      );
    }

    if (scope === 'leaderboard') {
      let rows: any[] = [];
      try {
        const { data: xpRows } = await db
          .from('user_xp')
          .select('id, total_xp, level, current_streak, updated_at')
          .order('total_xp', { ascending: false })
          .limit(100);

        if (Array.isArray(xpRows) && xpRows.length > 0) {
          const ids = xpRows.map((x) => x.id);
          const { data: profiles } = await db
            .from('profiles')
            .select('id, display_name, county, school')
            .in('id', ids);
          const profileMap = new Map((profiles || []).map((p: any) => [p.id, p]));

          rows = xpRows.map((x: any, idx: number) => {
            const prof = profileMap.get(x.id);
            return {
              rank: idx + 1,
              user_id: x.id,
              display_name: prof?.display_name || `Learner ${String(x.id).slice(0, 6)}`,
              county: prof?.county || 'Kenya',
              school: prof?.school || '',
              total_xp: Number(x.total_xp) || 0,
              level: Number(x.level) || getLevel(Number(x.total_xp) || 0),
              streak: Number(x.current_streak) || 0,
              updated_at: x.updated_at || null,
            };
          });
        }
      } catch {}

      return NextResponse.json(
        { ok: true, learners: rows, totalLearners: rows.length },
        { headers: { 'Cache-Control': 'no-store, max-age=0' } }
      );
    }

    return NextResponse.json({ ok: false, error: 'Unsupported scope' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to load admin controls data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await verifyRequestAdmin(req))) {
    return NextResponse.json({ ok: false, error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const action = String(body.action || '');
    const db = getAdminClient();

    if (action === 'update_learner_xp') {
      const userId = String(body.user_id || '').trim();
      if (!userId) {
        return NextResponse.json({ ok: false, error: 'user_id is required' }, { status: 400 });
      }
      const totalXp = Math.max(0, Math.round(Number(body.total_xp) || 0));
      const streak = Math.max(0, Math.round(Number(body.streak) || 0));
      const level = getLevel(totalXp);

      await db.from('user_xp').upsert({
        id: userId,
        total_xp: totalXp,
        level,
        current_streak: streak,
        updated_at: new Date().toISOString(),
      });

      if (body.display_name || body.county) {
        await db.from('profiles').upsert({
          id: userId,
          ...(body.display_name ? { display_name: String(body.display_name).trim().slice(0, 60) } : {}),
          ...(body.county ? { county: String(body.county).trim().slice(0, 40) } : {}),
          updated_at: new Date().toISOString(),
        });
      }

      try {
        await db.from('audit_log').insert([
          { action: `Updated learner XP (${userId}) to ${totalXp} XP / streak ${streak}`, details: { userId, totalXp, streak } },
        ]);
      } catch {}

      return NextResponse.json({ ok: true, user_id: userId, total_xp: totalXp, level, streak });
    }

    if (action === 'remove_learner') {
      const userId = String(body.user_id || '').trim();
      if (!userId) {
        return NextResponse.json({ ok: false, error: 'user_id is required' }, { status: 400 });
      }
      await db.from('user_xp').delete().eq('id', userId);
      try {
        await db.from('audit_log').insert([
          { action: `Removed learner from leaderboard (${userId})`, details: { userId } },
        ]);
      } catch {}
      return NextResponse.json({ ok: true, removed: userId });
    }

    if (action === 'reset_all_xp') {
      await db.from('user_xp').delete().neq('id', '__none__');
      try {
        await db.from('audit_log').insert([
          { action: 'Reset all leaderboard XP entries', details: { scope: 'leaderboard' } },
        ]);
      } catch {}
      return NextResponse.json({ ok: true, reset: true });
    }

    return NextResponse.json({ ok: false, error: 'Unsupported action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Admin moderation failed' }, { status: 500 });
  }
}
