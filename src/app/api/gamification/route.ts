import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getAdminClient } from '@/lib/supabase';
import { getLevel, XP_VALUES, checkStreakBadges, checkXPBadges } from '@/lib/gamification';
import { loadLeaderboardSettingsServer } from '@/lib/site-controls-server';

// GET - Fetch user XP, badges, or leaderboard
export async function GET(req: NextRequest) {
  const action = req.nextUrl.searchParams.get('action') || 'leaderboard';
  const userId = req.nextUrl.searchParams.get('user_id');
  const db = getAdminClient();

  if (action === 'profile' && userId) {
    try {
      const [xpRes, badgesRes] = await Promise.allSettled([
        db.from('user_xp').select('*').eq('id', userId).single(),
        db.from('user_badges').select('*, badges(*)').eq('user_id', userId),
      ]);

      const xpData = xpRes.status === 'fulfilled' ? xpRes.value.data : null;
      const badgesData = badgesRes.status === 'fulfilled' ? badgesRes.value.data : [];

      return NextResponse.json({
        ok: true,
        xp: xpData || { total_xp: 120, level: 2, current_streak: 3 },
        badges: badgesData || [],
      });
    } catch {
      return NextResponse.json({
        ok: true,
        xp: { total_xp: 120, level: 2, current_streak: 3 },
        badges: [],
      });
    }
  }

  if (action === 'leaderboard') {
    const lbSettings = await loadLeaderboardSettingsServer();
    if (!lbSettings.leaderboardEnabled) {
      return NextResponse.json({
        ok: true,
        disabled: true,
        pausedMessage: lbSettings.pausedMessage,
        leaderboard: [],
        period: lbSettings.defaultPeriod,
        settings: lbSettings,
      });
    }

    const period = req.nextUrl.searchParams.get('period') || lbSettings.defaultPeriod || 'weekly';
    const requestedLimit = parseInt(req.nextUrl.searchParams.get('limit') || String(lbSettings.maxEntries), 10);
    const limit = Math.min(lbSettings.maxEntries, Math.max(1, Number.isFinite(requestedLimit) ? requestedLimit : lbSettings.maxEntries));

    try {
      let query = db
        .from('user_xp')
        .select('id, total_xp, level, current_streak, updated_at')
        .order('total_xp', { ascending: false })
        .limit(limit);

      if (period === 'weekly') {
        const weekAgo = new Date(Date.now() - 7 * 864e5).toISOString();
        query = query.gte('updated_at', weekAgo);
      } else if (period === 'monthly') {
        const monthAgo = new Date(Date.now() - 30 * 864e5).toISOString();
        query = query.gte('updated_at', monthAgo);
      }

      const { data: leaders } = await query;

      if (leaders && leaders.length > 0) {
        const userIds = leaders.map((l) => l.id);
        const { data: profiles } = await db
          .from('profiles')
          .select('id, display_name, county, school')
          .in('id', userIds);

        const profileMap = new Map((profiles || []).map((p) => [p.id, p]));

        const leaderboard = leaders.map((l, i) => {
          const profile = profileMap.get(l.id);
          return {
            rank: i + 1,
            user_id: l.id,
            display_name: profile?.display_name || `Learner ${l.id.slice(0, 4)}`,
            county: profile?.county || 'Kenya',
            school: profile?.school || '',
            total_xp: l.total_xp,
            level: l.level,
            streak: l.current_streak,
          };
        });

        return NextResponse.json({ ok: true, leaderboard, period, settings: lbSettings });
      }
    } catch {}

    if (!lbSettings.showSampleLeaders) {
      return NextResponse.json({ ok: true, leaderboard: [], period, settings: lbSettings });
    }

    // Period-aware optional starter rankings when explicitly enabled in Admin
    const mult = period === 'weekly' ? 0.35 : period === 'monthly' ? 0.65 : 1;
    const baseLeaders = [
      { display_name: 'Wanjiku M.', county: 'Nairobi', total_xp: 4850, level: 10, streak: 21 },
      { display_name: 'Brian K.', county: 'Kiambu', total_xp: 4200, level: 9, streak: 14 },
      { display_name: 'Aisha H.', county: 'Mombasa', total_xp: 3750, level: 9, streak: 18 },
      { display_name: 'David O.', county: 'Kisumu', total_xp: 3100, level: 8, streak: 7 },
      { display_name: 'Faith N.', county: 'Nakuru', total_xp: 2800, level: 8, streak: 12 },
      { display_name: 'John W.', county: 'Uasin Gishu', total_xp: 2500, level: 7, streak: 9 },
      { display_name: 'Grace A.', county: 'Machakos', total_xp: 2200, level: 7, streak: 5 },
      { display_name: 'Peter M.', county: 'Nyeri', total_xp: 1900, level: 6, streak: 11 },
      { display_name: 'Linda W.', county: 'Kajiado', total_xp: 1500, level: 5, streak: 3 },
      { display_name: 'Samuel K.', county: 'Nairobi', total_xp: 1200, level: 5, streak: 8 },
    ].map((e, i) => {
      const xp = Math.round((e.total_xp * mult) / 5) * 5;
      return {
        rank: i + 1,
        display_name: e.display_name,
        county: e.county,
        total_xp: xp,
        level: getLevel(xp),
        streak: period === 'weekly' ? Math.min(7, e.streak) : e.streak,
      };
    });

    return NextResponse.json({ ok: true, leaderboard: baseLeaders, period, settings: lbSettings });
  }

  if (action === 'badges') {
    try {
      const { data: badges } = await db.from('badges').select('*').order('xp_required');
      if (badges && badges.length > 0) {
        return NextResponse.json({ ok: true, badges });
      }
    } catch {}
  }

  return NextResponse.json({ ok: false, error: 'Invalid action parameter' }, { status: 400 });
}

// POST - Award XP, calculate streak, award badges
export async function POST(req: NextRequest) {
  try {
    const { user_id, action, display_name, county } = await req.json();

    if (!user_id || !action) {
      return NextResponse.json({ ok: false, error: 'user_id and action required' }, { status: 400 });
    }

    const db = getAdminClient();
    const today = new Date().toISOString().slice(0, 10);

    // Sync profile metadata when provided
    if (display_name || county) {
      try {
        await db.from('profiles').upsert({
          id: user_id,
          display_name: String(display_name || 'Mwalimu Learner').slice(0, 50),
          county: String(county || 'Kenya').slice(0, 40),
          updated_at: new Date().toISOString(),
        });
      } catch {}
    }

    let { data: userXP } = await db.from('user_xp').select('*').eq('id', user_id).single();

    if (!userXP) {
      userXP = {
        id: user_id,
        total_xp: 0,
        level: 1,
        current_streak: 0,
        longest_streak: 0,
        last_activity_date: null,
        questions_answered: 0,
        correct_answers: 0,
        tools_used: 0,
        sessions_completed: 0,
      };
      try {
        await db.from('user_xp').insert(userXP);
      } catch {}
    }

    let xpEarned = 0;
    const updates: any = {};
    const newBadges: string[] = [];

    // Streak logic
    const lastDate = userXP.last_activity_date;
    if (lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);

      if (lastDate === yesterdayStr) {
        updates.current_streak = (userXP.current_streak || 0) + 1;
      } else if (!lastDate || lastDate < yesterdayStr) {
        updates.current_streak = 1;
      }

      updates.last_activity_date = today;
      updates.longest_streak = Math.max(
        userXP.longest_streak || 0,
        updates.current_streak || userXP.current_streak || 0
      );

      const streak = updates.current_streak || userXP.current_streak;
      if (streak === 3) xpEarned += XP_VALUES.STREAK_3_BONUS;
      if (streak === 7) xpEarned += XP_VALUES.STREAK_7_BONUS;
      if (streak === 30) xpEarned += XP_VALUES.STREAK_30_BONUS;
    }

    switch (action) {
      case 'login':
        xpEarned += XP_VALUES.LOGIN;
        break;
      case 'question_answered':
        xpEarned += XP_VALUES.QUESTION_ANSWERED;
        updates.questions_answered = (userXP.questions_answered || 0) + 1;
        break;
      case 'correct_answer':
        xpEarned += XP_VALUES.CORRECT_ANSWER;
        updates.correct_answers = (userXP.correct_answers || 0) + 1;
        break;
      case 'tool_used':
        xpEarned += XP_VALUES.TOOL_USED;
        updates.tools_used = (userXP.tools_used || 0) + 1;
        break;
      case 'session_completed':
        xpEarned += XP_VALUES.SESSION_COMPLETED;
        updates.sessions_completed = (userXP.sessions_completed || 0) + 1;
        break;
      case 'lesson_completed':
        xpEarned += 12;
        updates.sessions_completed = (userXP.sessions_completed || 0) + 1;
        break;
      case 'quiz_completed':
        xpEarned += 20;
        updates.sessions_completed = (userXP.sessions_completed || 0) + 1;
        break;
      default:
        xpEarned += 5;
    }

    const newTotalXP = (userXP.total_xp || 0) + xpEarned;
    updates.total_xp = newTotalXP;
    updates.level = getLevel(newTotalXP);
    updates.updated_at = new Date().toISOString();

    try {
      await db.from('user_xp').update(updates).eq('id', user_id);
    } catch {}

    const earnedBadgeIds = [
      ...checkXPBadges(newTotalXP),
      ...checkStreakBadges(updates.current_streak || userXP.current_streak || 0),
    ];

    for (const badgeId of earnedBadgeIds) {
      try {
        const { error } = await db.from('user_badges').insert({ user_id, badge_id: badgeId });
        if (!error) newBadges.push(badgeId);
      } catch {}
    }

    return NextResponse.json({
      ok: true,
      xp_earned: xpEarned,
      total_xp: newTotalXP,
      level: updates.level,
      streak: updates.current_streak || userXP.current_streak,
      new_badges: newBadges,
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
