// ==============================================================================
// MWALIMU FAMILY - TYPE DEFINITIONS
// ==============================================================================

export type ItemKind = 'job' | 'notice';
export type ItemStatus = 'draft' | 'published' | 'rejected';

export interface FeedItem {
  id?: number | string;
  k: ItemKind;
  t: string;           // Title
  who?: string;        // Employer / Organization / Author
  loc?: string;        // Location (e.g., Nairobi, Mombasa)
  cat?: string;        // Category (e.g., Teaching, Tutoring, Exams, Safety)
  body: string;       // Details
  st: ItemStatus;      // Status
  exp?: string;        // Expiry date (YYYY-MM-DD)
  featured?: boolean;  // Sponsored or pinned
  created_at?: string;
  updated_at?: string;
}

export type SubmissionType = 'job' | 'ad' | 'find' | 'tut' | 'note';
export type SubmissionStatus = 'new' | 'approved' | 'rejected';

export interface Submission {
  id?: number | string;
  ref: string;
  type: SubmissionType;
  label: string;
  from_name: string;
  title: string;
  fields: [string, string][];
  st: SubmissionStatus;
  checks: [boolean, boolean, boolean]; // 3-point editorial checklist
  hrs?: number; // hours old for dashboard calculation
  consent?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Subscriber {
  id?: number | string;
  email: string;
  name?: string;
  consent: boolean;
  channel?: string;
  active?: boolean;
  created_at?: string;
}

export interface AssistantLog {
  id?: number | string;
  question: string;
  reply?: string;
  model?: string;
  status?: string;
  created_at?: string;
}

export interface SiteFlags {
  maint: boolean;   // Maintenance mode
  scam: boolean;    // Scam warning banner
  lite: boolean;    // Data-saver lite mode
  ai: boolean;      // Ask Mwalimu assistant enabled
  forms: boolean;   // Forms submission active
  sw: boolean;      // Service worker PWA enabled
}

export interface SiteConfig {
  flags: SiteFlags;
  banner: {
    text: string;
    active: boolean;
  };
  stats?: {
    visitors: number;
    subscribers: number;
    installs: number;
    toolCompletions: number;
  };
}

export interface AuditLogEntry {
  id?: number | string;
  t?: string;
  m?: string;
  action?: string;
  details?: Record<string, any>;
  created_at?: string;
}

export interface VerificationCheck {
  id?: number | string;
  n: string;          // Name of check
  name?: string;
  last: string | null; // Last verified date
  last_verified?: string | null;
  status?: string;
}
