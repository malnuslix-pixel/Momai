// ==============================================================================
// MWALIMU FAMILY - SUPABASE CLIENT & DATA LAYER
// ==============================================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { FeedItem, Submission, Subscriber, SiteFlags, SiteConfig, AuditLogEntry, VerificationCheck } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mcavjbrvtqxokecpiqln.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  '';
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project'));

// Public client for client-side and read operations
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

// Admin client for backend operations requiring service role privileges
export const getAdminClient = (): SupabaseClient => {
  if (supabaseServiceKey && supabaseServiceKey.length > 10) {
    return createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });
  }
  return supabase;
};

// Default seed data for resilient fallback
export const SEED_ITEMS: FeedItem[] = [
  {
    id: 1,
    k: 'job',
    t: 'Grade 7 Mathematics teacher',
    who: 'Sample school',
    loc: 'Nairobi',
    cat: 'Teaching',
    body: 'Example listing showing the layout. Real vacancies appear here after review.',
    st: 'published',
    exp: '2027-01-31',
  },
  {
    id: 2,
    k: 'job',
    t: 'Evening KCSE maths tutor',
    who: 'Sample tutoring centre',
    loc: 'Mombasa',
    cat: 'Tutoring',
    body: 'Example listing. Employers can post using the form below.',
    st: 'published',
    exp: '2027-01-31',
  },
  {
    id: 3,
    k: 'notice',
    t: 'Results release windows',
    who: 'Ministry of Education',
    loc: '',
    cat: 'Exams',
    body: 'KJSEA results expected in December 2026. KCSE and KPSEA targeted for January 2027.',
    st: 'published',
    exp: '2027-01-31',
  },
  {
    id: 4,
    k: 'notice',
    t: 'Results scam alert',
    who: 'Mwalimu Family',
    loc: '',
    cat: 'Safety',
    body: 'Never pay to see results early. Use official channels only.',
    st: 'published',
    exp: '2027-01-31',
  },
];

export const SEED_SUBMISSIONS: Submission[] = [
  {
    id: 1,
    ref: 'JOB-261119-4821',
    type: 'job',
    label: 'Job listing',
    from_name: 'Hillcrest Academy',
    title: 'Science teacher, Grade 8',
    fields: [
      ['School', 'Hillcrest Academy'],
      ['Role', 'Science teacher, Grade 8'],
      ['Location', 'Nairobi'],
      ['Contact', 'info@hillcrest.ac.ke'],
    ],
    st: 'new',
    checks: [false, false, false],
    hrs: 52,
  },
  {
    id: 2,
    ref: 'NTC-261120-3317',
    type: 'note',
    label: 'Notice',
    from_name: 'Kisumu Girls Parents Assoc.',
    title: 'Grade 10 reporting dates meeting',
    fields: [
      ['Organizer', 'Kisumu Girls Parents Assoc.'],
      ['Topic', 'Grade 10 reporting dates meeting'],
      ['Location', 'Kisumu'],
      ['Contact', 'kgpa@gmail.com'],
    ],
    st: 'new',
    checks: [false, false, false],
    hrs: 20,
  },
  {
    id: 3,
    ref: 'ADV-261120-7702',
    type: 'ad',
    label: 'Advertising quote',
    from_name: 'BrightPath Tutors',
    title: 'Newsletter and WhatsApp mention',
    fields: [
      ['Client', 'BrightPath Tutors'],
      ['Package', 'Newsletter and WhatsApp mention'],
      ['Budget', 'KES 15,000'],
      ['Contact', '0712345678'],
    ],
    st: 'new',
    checks: [false, false, false],
    hrs: 18,
  },
  {
    id: 4,
    ref: 'TUT-261121-1190',
    type: 'find',
    label: 'Tutor request',
    from_name: 'Parent, Nakuru',
    title: 'Grade 9 Mathematics, online',
    fields: [
      ['Parent', 'Parent, Nakuru'],
      ['Subject', 'Grade 9 Mathematics, online'],
      ['Level', 'Junior Secondary'],
      ['Contact', '0723456789'],
    ],
    st: 'new',
    checks: [false, false, false],
    hrs: 3,
  },
  {
    id: 5,
    ref: 'TTR-261118-5521',
    type: 'tut',
    label: 'Tutor application',
    from_name: 'J. Wanjiru',
    title: 'English and Kiswahili, Grades 4–8',
    fields: [
      ['Tutor', 'J. Wanjiru'],
      ['Subjects', 'English and Kiswahili, Grades 4–8'],
      ['TSC No', 'TSC/789102'],
      ['Contact', 'wanjiru.tutor@gmail.com'],
    ],
    st: 'new',
    checks: [false, false, false],
    hrs: 75,
  },
  {
    id: 6,
    ref: 'JOB-261117-6004',
    type: 'job',
    label: 'Job listing',
    from_name: 'Quick Cash Recruiters',
    title: 'Teacher, pay KES 2,000 application fee',
    fields: [
      ['School', 'Quick Cash Recruiters'],
      ['Role', 'Teacher'],
      ['Note', 'Demanded registration fee upfront'],
    ],
    st: 'rejected',
    checks: [true, false, true],
    hrs: 98,
  },
];

export const SEED_CONFIG: SiteConfig = {
  flags: {
    maint: false,
    scam: true,
    lite: false,
    ai: true,
    forms: true,
    sw: true,
  },
  banner: {
    text: 'KNEC Official Alert: Results checking is free via official Ministry and KNEC SMS/web portals. Never send money to individuals claiming early access.',
    active: true,
  },
  stats: {
    visitors: 2480,
    subscribers: 1284,
    installs: 342,
    toolCompletions: 6120,
  },
};

export const SEED_CHECKS: VerificationCheck[] = [
  { n: 'KJSEA performance bands', last: '2026-11-21', status: 'verified' },
  { n: 'KCSE points and mean grades', last: '2026-11-21', status: 'verified' },
  { n: 'KUCCPS cluster formula', last: '2026-11-21', status: 'verified' },
  { n: 'Lead story figures', last: '2026-11-21', status: 'verified' },
  { n: 'Grade 10 pathway text', last: null, status: 'verified' },
  { n: 'Glossary definitions', last: null, status: 'verified' },
  { n: 'Quiz answers', last: null, status: 'verified' },
  { n: 'Fees planner arithmetic', last: null, status: 'verified' },
  { n: 'Official links resolve', last: null, status: 'verified' },
];

export const SEED_AUDIT: AuditLogEntry[] = [
  { t: '2026-11-21 16:30', m: 'System initialized with Supabase backend' },
  { t: '2026-11-21 14:15', m: 'Verified KJSEA points formula and performance bands' },
  { t: '2026-11-21 11:00', m: 'Published notice: Results scam alert' },
];
