// ==============================================================================
// MWALIMU FAMILY - GAMIFICATION ENGINE
// XP, Streaks, Badges, Leaderboard logic
// ==============================================================================

export const XP_VALUES = {
  LOGIN: 5,
  QUESTION_ANSWERED: 10,
  CORRECT_ANSWER: 15,
  TOOL_USED: 8,
  SESSION_COMPLETED: 25,
  STREAK_3_BONUS: 50,
  STREAK_7_BONUS: 100,
  STREAK_30_BONUS: 500,
  PERFECT_10_BONUS: 200,
} as const;

export const LEVEL_THRESHOLDS = [
  0, 50, 150, 300, 500, 800, 1200, 1800, 2500, 3500, 5000, 7000, 10000, 15000, 20000
];

export const LEVEL_NAMES = [
  'Mwanafunzi', 'Starter', 'Curious', 'Learner', 'Explorer',
  'Scholar', 'Achiever', 'Expert', 'Master', 'Champion',
  'Legend', 'Genius', 'Professor', 'Elite', 'Grandmaster',
];

export function getLevel(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

export function getLevelName(level: number): string {
  return LEVEL_NAMES[Math.min(level - 1, LEVEL_NAMES.length - 1)] || 'Mwanafunzi';
}

export function getXPProgress(xp: number): { current: number; needed: number; progress: number } {
  const level = getLevel(xp);
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] || currentThreshold + 2000;
  const current = xp - currentThreshold;
  const needed = nextThreshold - currentThreshold;
  return { current, needed, progress: Math.min(100, Math.round((current / needed) * 100)) };
}

export function checkStreakBadges(streak: number): string[] {
  const earned: string[] = [];
  if (streak >= 3) earned.push('streak-3');
  if (streak >= 7) earned.push('streak-7');
  if (streak >= 30) earned.push('streak-30');
  return earned;
}

export function checkXPBadges(xp: number): string[] {
  const earned: string[] = [];
  if (xp >= 100) earned.push('xp-100');
  if (xp >= 500) earned.push('xp-500');
  if (xp >= 1000) earned.push('xp-1000');
  if (xp >= 5000) earned.push('xp-5000');
  return earned;
}

export function getStreakEmoji(streak: number): string {
  if (streak >= 30) return '👑';
  if (streak >= 14) return '💎';
  if (streak >= 7) return '⚔️';
  if (streak >= 3) return '🔥';
  if (streak >= 1) return '✨';
  return '💤';
}

export const ALL_BADGES = [
  { id: 'first-login', name: 'Welcome!', description: 'First time logging in', icon: '👋', category: 'milestone' },
  { id: 'streak-3', name: 'On Fire!', description: '3-day study streak', icon: '🔥', category: 'streak' },
  { id: 'streak-7', name: 'Week Warrior', description: '7-day study streak', icon: '⚔️', category: 'streak' },
  { id: 'streak-30', name: 'Monthly Master', description: '30-day study streak', icon: '👑', category: 'streak' },
  { id: 'xp-100', name: 'Rising Star', description: 'Earned 100 XP', icon: '⭐', category: 'xp' },
  { id: 'xp-500', name: 'Knowledge Seeker', description: 'Earned 500 XP', icon: '📚', category: 'xp' },
  { id: 'xp-1000', name: 'Scholar', description: 'Earned 1,000 XP', icon: '🎓', category: 'xp' },
  { id: 'xp-5000', name: 'Academic Elite', description: 'Earned 5,000 XP', icon: '🏆', category: 'xp' },
  { id: 'quiz-10', name: 'Quiz Enthusiast', description: 'Answered 10 practice questions', icon: '🧠', category: 'quiz' },
  { id: 'quiz-100', name: 'Quiz Master', description: 'Answered 100 practice questions', icon: '💡', category: 'quiz' },
  { id: 'perfect-10', name: 'Perfect Score', description: '10 correct answers in a row', icon: '💯', category: 'quiz' },
  { id: 'tutor-5', name: 'Curious Mind', description: 'Asked the AI tutor 5 questions', icon: '🤔', category: 'engagement' },
  { id: 'calculator-pro', name: 'Calculator Pro', description: 'Used all 5 calculators', icon: '🔢', category: 'engagement' },
];
