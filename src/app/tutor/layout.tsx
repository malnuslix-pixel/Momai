import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Ask Mwalimu AI Tutor — CBC & KCSE Study Assistant',
  description: 'Get instant step-by-step CBC and KCSE homework help, revision explanations, and practice questions from Mwalimu AI Tutor.',
  path: '/tutor',
  keywords: ['AI tutor Kenya', 'CBC homework help', 'KCSE revision AI'],
  ogSubtitle: 'Ask Mwalimu AI Tutor',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
