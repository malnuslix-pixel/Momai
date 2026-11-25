import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'National Exams Hub — KPSEA, KJSEA & KCSE 2026/2027',
  description: 'Official KPSEA, KJSEA, and KCSE exam timelines, marking center updates, scoring guides, and results scam protection for Kenyan families.',
  path: '/exams',
  keywords: ['KPSEA timelines', 'KJSEA results 2026', 'KCSE 2026 results', 'KNEC official portals'],
  ogSubtitle: 'National Exams Hub',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
