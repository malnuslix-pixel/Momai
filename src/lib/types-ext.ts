// ==============================================================================
// MWALIMU FAMILY - EXTENDED TYPE DEFINITIONS
// M-Pesa Payments, AI Tutor, Gamification
// ==============================================================================

// ---- User Profiles ----
export type UserRole = 'student' | 'parent' | 'teacher' | 'admin';

export interface Profile {
  id: string;
  display_name: string;
  phone: string;
  role: UserRole;
  grade: string;
  school: string;
  county: string;
  avatar_url: string;
  created_at?: string;
  updated_at?: string;
}

// ---- M-Pesa Payments ----
export type PlanType = 'free' | 'premium' | 'pro';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'pending';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export interface Plan {
  id: PlanType;
  name: string;
  price: number;        // KES per month
  features: string[];
  popular?: boolean;
}

export interface Subscription {
  id?: number;
  user_id: string;
  plan: PlanType;
  status: SubscriptionStatus;
  mpesa_receipt?: string;
  phone?: string;
  amount: number;
  started_at?: string;
  expires_at?: string;
  created_at?: string;
}

export interface Payment {
  id?: number;
  user_id?: string;
  checkout_request_id?: string;
  merchant_request_id?: string;
  phone: string;
  amount: number;
  plan: PlanType;
  status: PaymentStatus;
  mpesa_receipt?: string;
  result_code?: number;
  result_desc?: string;
  created_at?: string;
}

export interface STKPushRequest {
  phone: string;
  amount: number;
  plan: PlanType;
  user_id?: string;
  account_reference?: string;
}

export interface STKPushResponse {
  ok: boolean;
  checkout_request_id?: string;
  merchant_request_id?: string;
  message: string;
  error?: string;
}

export interface MPesaCallbackData {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{ Name: string; Value?: string | number }>;
      };
    };
  };
}

// ---- AI Tutor ----
export type TutorMode = 'chat' | 'practice' | 'explain';

export interface TutorMessage {
  id?: number;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  subject?: string;
  grade?: string;
  mode?: TutorMode;
  created_at?: string;
}

export interface PracticeQuestion {
  id?: number;
  subject: string;
  grade: string;
  topic?: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface TutorChatRequest {
  message: string;
  session_id: string;
  subject?: string;
  grade?: string;
  mode?: TutorMode;
}

// ---- Gamification ----
export interface UserXP {
  id: string;
  total_xp: number;
  level: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  questions_answered: number;
  correct_answers: number;
  tools_used: number;
  sessions_completed: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  xp_required: number;
  condition_type: string;
  condition_value: number;
}

export interface UserBadge {
  id?: number;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badge?: Badge;
}

export interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  county: string;
  school?: string;
  total_xp: number;
  rank: number;
  level: number;
  streak?: number;
}

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Mwanafunzi',
    price: 0,
    features: [
      'Education news & updates',
      'Basic calculators (KCSE, KJSEA)',
      'Job & notice board',
      'Ask Mwalimu (5 questions/day)',
      'Daily quiz',
    ],
  },
  {
    id: 'premium',
    name: 'Msomi',
    price: 199,
    popular: true,
    features: [
      'Everything in Mwanafunzi',
      'AI Tutor — unlimited questions',
      'Practice questions (all subjects)',
      'KUCCPS course advisor',
      'Personalized study plans',
      'WhatsApp revision alerts',
      'Ad-free experience',
    ],
  },
  {
    id: 'pro',
    name: 'Profesa',
    price: 499,
    features: [
      'Everything in Msomi',
      'Photo-solve homework',
      'Live group tutoring sessions',
      'Priority support',
      'School performance analytics',
      'Downloadable revision notes',
      'Certificate of completion',
    ],
  },
];
