// ==============================================================================
// MWALIMU FAMILY - CLIENT LEARNER PROFILE & XP SYNC ENGINE
// Persistent local progress + seamless sync to /api/gamification (offline queue)
// ==============================================================================

import {
  XP_VALUES,
  getLevel,
  checkXPBadges,
  checkStreakBadges,
} from './gamification';

export type LearnerXPAction =
  | 'login'
  | 'question_answered'
  | 'correct_answer'
  | 'tool_used'
  | 'session_completed'
  | 'lesson_completed'
  | 'quiz_completed';

export interface LearnerProfile {
  id: string;
  displayName: string;
  county: string;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string | null;
  unlockedBadges: string[];
  stats: {
    questionsAnswered: number;
    correctAnswers: number;
    quizzesCompleted: number;
    lessonsCompleted: number;
    toolsUsed: number;
    tutorQuestions: number;
  };
}

const PROFILE_KEY = 'mf_learner_profile_v1';
const QUEUE_KEY = 'mf_xp_sync_queue_v1';

function createDefaultProfile(): LearnerProfile {
  const randomId =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `mf-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  return {
    id: randomId,
    displayName: 'Mwalimu Learner',
    county: 'Nairobi',
    xp: 0,
    level: 1,
    streak: 1,
    lastActiveDate: null,
    unlockedBadges: ['first-login'],
    stats: {
      questionsAnswered: 0,
      correctAnswers: 0,
      quizzesCompleted: 0,
      lessonsCompleted: 0,
      toolsUsed: 0,
      tutorQuestions: 0,
    },
  };
}

export function getLearnerProfile(): LearnerProfile {
  if (typeof window === 'undefined') return createDefaultProfile();
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<LearnerProfile>;
      const def = createDefaultProfile();
      return {
        ...def,
        ...parsed,
        stats: { ...def.stats, ...(parsed.stats || {}) },
        unlockedBadges: Array.isArray(parsed.unlockedBadges) && parsed.unlockedBadges.length > 0
          ? parsed.unlockedBadges
          : def.unlockedBadges,
      };
    }
  } catch {}
  const fresh = createDefaultProfile();
  saveLearnerProfile(fresh);
  return fresh;
}

export function saveLearnerProfile(profile: LearnerProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {}
}

export function updateLearnerIdentity(displayName: string, county: string): LearnerProfile {
  const current = getLearnerProfile();
  const updated: LearnerProfile = {
    ...current,
    displayName: displayName.trim().slice(0, 50) || current.displayName,
    county: county.trim().slice(0, 40) || current.county,
  };
  saveLearnerProfile(updated);

  if (typeof navigator !== 'undefined' && navigator.onLine) {
    fetch('/api/gamification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: updated.id,
        action: 'login',
        display_name: updated.displayName,
        county: updated.county,
      }),
    }).catch(() => {});
  }

  return updated;
}

function getActionXP(action: LearnerXPAction): number {
  switch (action) {
    case 'login':
      return XP_VALUES.LOGIN;
    case 'question_answered':
      return XP_VALUES.QUESTION_ANSWERED;
    case 'correct_answer':
      return XP_VALUES.CORRECT_ANSWER;
    case 'tool_used':
      return XP_VALUES.TOOL_USED;
    case 'session_completed':
      return XP_VALUES.SESSION_COMPLETED;
    case 'lesson_completed':
      return 12;
    case 'quiz_completed':
      return 20;
    default:
      return 5;
  }
}

export function awardLearnerXP(
  action: LearnerXPAction,
  source: 'tutor' | 'quiz' | 'lesson' | 'tool' | 'maths' | 'offline' = 'quiz'
): { profile: LearnerProfile; xpEarned: number; newBadges: string[] } {
  const profile = getLearnerProfile();
  const today = new Date().toISOString().slice(0, 10);

  let xpEarned = getActionXP(action);
  let nextStreak = profile.streak;

  if (profile.lastActiveDate !== today) {
    const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    if (profile.lastActiveDate === yesterday) {
      nextStreak = profile.streak + 1;
    } else if (!profile.lastActiveDate || profile.lastActiveDate < yesterday) {
      nextStreak = 1;
    }
    if (nextStreak === 3) xpEarned += XP_VALUES.STREAK_3_BONUS;
    if (nextStreak === 7) xpEarned += XP_VALUES.STREAK_7_BONUS;
    if (nextStreak === 30) xpEarned += XP_VALUES.STREAK_30_BONUS;
  }

  const nextStats = { ...profile.stats };
  if (action === 'question_answered') {
    nextStats.questionsAnswered += 1;
    if (source === 'tutor') nextStats.tutorQuestions += 1;
  } else if (action === 'correct_answer') {
    nextStats.correctAnswers += 1;
    nextStats.questionsAnswered += 1;
  } else if (action === 'lesson_completed') {
    nextStats.lessonsCompleted += 1;
  } else if (action === 'quiz_completed' || action === 'session_completed') {
    nextStats.quizzesCompleted += 1;
  } else if (action === 'tool_used') {
    nextStats.toolsUsed += 1;
  }

  const nextXP = profile.xp + xpEarned;
  const candidateBadges = new Set<string>([
    ...profile.unlockedBadges,
    'first-login',
    ...checkXPBadges(nextXP),
    ...checkStreakBadges(nextStreak),
  ]);

  if (nextStats.questionsAnswered >= 10) candidateBadges.add('quiz-10');
  if (nextStats.questionsAnswered >= 100) candidateBadges.add('quiz-100');
  if (nextStats.correctAnswers >= 10) candidateBadges.add('perfect-10');
  if (nextStats.tutorQuestions >= 5) candidateBadges.add('tutor-5');
  if (nextStats.toolsUsed >= 5) candidateBadges.add('calculator-pro');

  const newBadges = Array.from(candidateBadges).filter((b) => !profile.unlockedBadges.includes(b));

  const updated: LearnerProfile = {
    ...profile,
    xp: nextXP,
    level: getLevel(nextXP),
    streak: nextStreak,
    lastActiveDate: today,
    unlockedBadges: Array.from(candidateBadges),
    stats: nextStats,
  };

  saveLearnerProfile(updated);

  if (typeof window !== 'undefined') {
    const payload = {
      user_id: updated.id,
      action,
      display_name: updated.displayName,
      county: updated.county,
    };

    if (typeof navigator !== 'undefined' && navigator.onLine) {
      fetch('/api/gamification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => queueOfflineXP(payload));
    } else {
      queueOfflineXP(payload);
    }
  }

  return { profile: updated, xpEarned, newBadges };
}

function queueOfflineXP(item: { user_id: string; action: LearnerXPAction; display_name: string; county: string }) {
  try {
    const raw = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
    const arr = Array.isArray(raw) ? raw : [];
    arr.push(item);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(arr.slice(-50)));
  } catch {}
}

export async function flushPendingXP(): Promise<number> {
  if (typeof window === 'undefined' || !navigator.onLine) return 0;
  try {
    const raw = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
    if (!Array.isArray(raw) || raw.length === 0) return 0;
    localStorage.removeItem(QUEUE_KEY);
    let synced = 0;
    for (const item of raw) {
      try {
        const res = await fetch('/api/gamification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
        if (res.ok) synced++;
      } catch {}
    }
    return synced;
  } catch {
    return 0;
  }
}
