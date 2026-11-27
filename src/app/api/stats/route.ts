import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase';
import { verifyRequestAdmin } from '@/lib/auth';
import { loadCmsServer } from '@/lib/cms-server';

export const dynamic = 'force-dynamic';

function bucketTopic(text: string): string {
  const q = text.toLowerCase();
  if (/kjsea|grade 9|band|ee1|me1/.test(q)) return 'KJSEA & Grade 9 Bands';
  if (/kcse|cluster|kuccps|university/.test(q)) return 'KCSE & KUCCPS Placement';
  if (/grade 10|pathway|senior school|stem/.test(q)) return 'Grade 10 Pathways';
  if (/scam|fake|pay|mpesa/.test(q)) return 'Results Scam Safety';
  if (/tsc|teacher|scheme|lesson|tpad/.test(q)) return 'Teaching & TSC';
  if (/fee|bursary|helb|hef/.test(q)) return 'Fees, Bursary & HELB';
  return 'Curriculum & General Study';
}

export async function GET(req: NextRequest) {
  try {
    if (!(await verifyRequestAdmin(req))) {
      return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
    }

    const admin = getAdminClient();
    const todayStart = new Date().toISOString().slice(0, 10) + 'T00:00:00.000Z';

    const [
      subsRes,
      subrRes,
      itemsRes,
      logsRes,
      tutorRes,
      xpRes,
      profilesRes,
      auditRes,
      cms,
    ] = await Promise.allSettled([
      admin.from('submissions').select('id, st, label, type, created_at', { count: 'exact' }),
      admin.from('subscribers').select('id, channel, active, created_at', { count: 'exact' }),
      admin.from('items').select('id, st, k, loc', { count: 'exact' }),
      admin
        .from('assistant_logs')
        .select('id, question, reply, model, status, created_at', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(50),
      admin
        .from('tutor_sessions')
        .select('id, session_id, subject, role, content, created_at', { count: 'exact' })
        .eq('role', 'user')
        .order('created_at', { ascending: false })
        .limit(100),
      admin.from('user_xp').select('id, total_xp', { count: 'exact' }),
      admin.from('profiles').select('id, county'),
      admin.from('audit_log').select('*').order('created_at', { ascending: false }).limit(30),
      loadCmsServer(),
    ]);

    // Submissions breakdown
    const submissionsData = subsRes.status === 'fulfilled' && Array.isArray(subsRes.value.data) ? subsRes.value.data : [];
    const subsWaiting = submissionsData.filter((s: any) => s.st === 'new').length;
    const subsApproved = submissionsData.filter((s: any) => s.st === 'approved').length;
    const subsRejected = submissionsData.filter((s: any) => s.st === 'rejected').length;
    const totalSubmissions =
      subsRes.status === 'fulfilled' && subsRes.value.count !== null
        ? subsRes.value.count
        : submissionsData.length;

    const subTypeCounts = new Map<string, number>();
    for (const s of submissionsData) {
      const k = String(s.label || s.type || 'Submission');
      subTypeCounts.set(k, (subTypeCounts.get(k) || 0) + 1);
    }

    // Subscribers breakdown
    const subscribersData = subrRes.status === 'fulfilled' && Array.isArray(subrRes.value.data) ? subrRes.value.data : [];
    const subscribersCount =
      subrRes.status === 'fulfilled' && subrRes.value.count !== null
        ? subrRes.value.count
        : subscribersData.length;
    const channelCounts = new Map<string, number>();
    for (const sub of subscribersData) {
      const ch = String(sub.channel || 'email');
      channelCounts.set(ch, (channelCounts.get(ch) || 0) + 1);
    }

    // Items breakdown
    const itemsData = itemsRes.status === 'fulfilled' && Array.isArray(itemsRes.value.data) ? itemsRes.value.data : [];
    const publishedItems = itemsData.filter((i: any) => i.st === 'published').length;
    const draftItems = itemsData.filter((i: any) => i.st === 'draft').length;
    const jobsCount = itemsData.filter((i: any) => i.k === 'job' && i.st === 'published').length;
    const noticesCount = itemsData.filter((i: any) => i.k === 'notice' && i.st === 'published').length;

    // Assistant + AI Tutor logs
    const logsData = logsRes.status === 'fulfilled' && Array.isArray(logsRes.value.data) ? logsRes.value.data : [];
    const assistantTotal =
      logsRes.status === 'fulfilled' && logsRes.value.count !== null
        ? logsRes.value.count
        : logsData.length;
    const assistantTodayCount = logsData.filter((l: any) => String(l.created_at || '') >= todayStart).length;

    const tutorData = tutorRes.status === 'fulfilled' && Array.isArray(tutorRes.value.data) ? tutorRes.value.data : [];
    const tutorTotal =
      tutorRes.status === 'fulfilled' && tutorRes.value.count !== null
        ? tutorRes.value.count
        : tutorData.length;
    const tutorTodayCount = tutorData.filter((t: any) => String(t.created_at || '') >= todayStart).length;
    const uniqueTutorSessions = new Set(tutorData.map((t: any) => t.session_id).filter(Boolean)).size;

    const fallbackCount = logsData.filter((l: any) => /knowledge-engine|fallback/i.test(String(l.model || ''))).length;
    const fallbackRate = logsData.length > 0 ? Math.round((fallbackCount / logsData.length) * 100) : 0;

    // Topic distribution from real logs + tutor questions
    const topicMap = new Map<string, number>();
    for (const l of logsData) {
      const b = bucketTopic(String(l.question || ''));
      topicMap.set(b, (topicMap.get(b) || 0) + 1);
    }
    for (const t of tutorData) {
      const b = String(t.subject || bucketTopic(String(t.content || '')));
      topicMap.set(b, (topicMap.get(b) || 0) + 1);
    }
    const topTopics = Array.from(topicMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    // Learners & Counties
    const activeLearnersCount = xpRes.status === 'fulfilled' && xpRes.value.count !== null ? xpRes.value.count : 0;
    const profilesData = profilesRes.status === 'fulfilled' && Array.isArray(profilesRes.value.data) ? profilesRes.value.data : [];
    const countyMap = new Map<string, number>();
    for (const p of profilesData) {
      const c = String(p.county || '').trim();
      if (c) countyMap.set(c, (countyMap.get(c) || 0) + 1);
    }
    for (const item of itemsData) {
      const loc = String(item.loc || '').trim();
      if (loc) countyMap.set(loc, (countyMap.get(loc) || 0) + 1);
    }
    const locationsBreakdown = Array.from(countyMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8);

    // 7-day real platform activity series
    const activity7d: { date: string; label: string; submissions: number; aiQueries: number; subscribers: number }[] = [];
    for (let d = 6; d >= 0; d--) {
      const dt = new Date(Date.now() - d * 864e5);
      const isoDay = dt.toISOString().slice(0, 10);
      const label = dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      activity7d.push({
        date: isoDay,
        label,
        submissions: submissionsData.filter((s: any) => String(s.created_at || '').startsWith(isoDay)).length,
        aiQueries:
          logsData.filter((l: any) => String(l.created_at || '').startsWith(isoDay)).length +
          tutorData.filter((t: any) => String(t.created_at || '').startsWith(isoDay)).length,
        subscribers: subscribersData.filter((s: any) => String(s.created_at || '').startsWith(isoDay)).length,
      });
    }

    // Real Audit Log (no fake SEED_AUDIT injection)
    const auditLogs =
      auditRes.status === 'fulfilled' && Array.isArray(auditRes.value.data)
        ? auditRes.value.data.map((a: any) => ({
            t: new Date(a.created_at).toISOString().slice(0, 16).replace('T', ' '),
            m: a.action,
          }))
        : [];

    const cmsObj = cms.status === 'fulfilled' ? cms.value : null;

    return NextResponse.json({
      ok: true,
      subscribers: subscribersCount,
      subscribersByChannel: Array.from(channelCounts.entries()),
      submissionsWaiting: subsWaiting,
      submissionsApproved: subsApproved,
      submissionsRejected: subsRejected,
      totalSubmissions,
      submissionsByType: Array.from(subTypeCounts.entries()),
      publishedItems,
      draftItems,
      jobsCount,
      noticesCount,
      assistantTotal,
      assistantToday: assistantTodayCount,
      tutorTotal,
      tutorToday: tutorTodayCount,
      uniqueTutorSessions,
      fallbackRate,
      recentAssistantLogs: logsData.slice(0, 20),
      topTopics,
      activeLearnersCount,
      locationsBreakdown,
      activity7d,
      cmsCounts: cmsObj
        ? {
            news: cmsObj.news.articles.length,
            courses: cmsObj.courses.length,
            materials: cmsObj.learning.materials.length,
            templates: cmsObj.teaching.length,
            quizQuestions:
              cmsObj.games.quizzes.m.length +
              cmsObj.games.quizzes.s.length +
              cmsObj.games.quizzes.k.length,
          }
        : null,
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY?.trim()),
      hasAdminKey: Boolean(process.env.ADMIN_SECRET_KEY?.trim()),
      systemStatus: 'Operational',
      audit: auditLogs,
    });
  } catch (err: any) {
    console.error('Stats GET error:', err);
    return NextResponse.json({
      ok: true,
      subscribers: 0,
      subscribersByChannel: [],
      submissionsWaiting: 0,
      submissionsApproved: 0,
      submissionsRejected: 0,
      totalSubmissions: 0,
      submissionsByType: [],
      publishedItems: 0,
      draftItems: 0,
      jobsCount: 0,
      noticesCount: 0,
      assistantTotal: 0,
      assistantToday: 0,
      tutorTotal: 0,
      tutorToday: 0,
      uniqueTutorSessions: 0,
      fallbackRate: 0,
      recentAssistantLogs: [],
      topTopics: [],
      activeLearnersCount: 0,
      locationsBreakdown: [],
      activity7d: [],
      cmsCounts: null,
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY?.trim()),
      hasAdminKey: Boolean(process.env.ADMIN_SECRET_KEY?.trim()),
      systemStatus: 'Database Unavailable',
      audit: [],
    });
  }
}
