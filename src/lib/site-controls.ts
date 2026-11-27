import type { LeaderboardSettings, PricingPlanConfig, PricingSettings } from './types';

export const DEFAULT_PRICING_PLANS: PricingPlanConfig[] = [
  {
    id: 'free',
    name: 'Mwanafunzi',
    subtitle: 'Foundation access for every learner',
    price: 0,
    period: '',
    features: [
      'Daily Kenya education news & advisories',
      'KCSE & KJSEA performance calculators',
      'Official jobs & notices board',
      'Ask Mwalimu assistant (5 questions/day)',
      'Daily revision quizzes',
    ],
    cta: 'Get Started Free',
    disabled: true,
    enabled: true,
  },
  {
    id: 'premium',
    name: 'Msomi',
    subtitle: 'The ultimate study companion',
    price: 199,
    period: '/month',
    popular: true,
    features: [
      'Everything in Mwanafunzi',
      'AI Tutor — unlimited CBC & 8-4-4 questions',
      'Subject-by-subject practice tests with solutions',
      'KUCCPS cluster calculator & course advisor',
      'Personalized study plans & exam countdown',
      'WhatsApp exam alerts & revision drops',
      'Completely ad-free experience',
    ],
    cta: 'Subscribe with M-Pesa',
    disabled: false,
    enabled: true,
  },
  {
    id: 'pro',
    name: 'Profesa',
    subtitle: 'Complete academic acceleration',
    price: 499,
    period: '/month',
    features: [
      'Everything in Msomi',
      'Photo-solve homework with step-by-step guidance',
      'Weekly live group masterclasses with top teachers',
      'Priority verification for tutoring requests',
      'School & county mean-score performance analytics',
      'Downloadable revision notes & marking schemes',
      'Verified Certificate of Completion',
    ],
    cta: 'Subscribe with M-Pesa',
    disabled: false,
    enabled: true,
  },
];

export const DEFAULT_PRICING_SETTINGS: PricingSettings = {
  pricingEnabled: true,
  mpesaEnabled: true,
  heroTitle: 'Invest in Academic Excellence',
  heroSubtitle:
    'Unlock unlimited AI tutoring, CBC practice questions, and KCSE/KUCCPS course advisors. Pay effortlessly and securely with M-Pesa.',
  pausedMessage: 'Study Pass subscriptions are currently paused for maintenance. Please check back shortly.',
  plans: DEFAULT_PRICING_PLANS,
};

export const DEFAULT_LEADERBOARD_SETTINGS: LeaderboardSettings = {
  leaderboardEnabled: true,
  showBadgesTab: true,
  defaultPeriod: 'weekly',
  maxEntries: 20,
  showSampleLeaders: false,
  heroTitle: 'Academic Leaderboard',
  heroSubtitle: 'Earn XP by completing CBC lessons, taking quizzes, and keeping your daily study streak alive.',
  pausedMessage: 'The public leaderboard is currently paused by administration.',
};
