import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'CBC Curriculum Library — Schemes, Notes & Lesson Plans',
  description: 'Download free editable CBC & 8-4-4 schemes of work, lesson plans, revision notes, and Word templates from PP1 to Form 4.',
  path: '/learn',
  keywords: ['CBC schemes of work', 'Kenya lesson plans', 'PP1 to Form 4 notes', 'KICD curriculum library'],
  ogSubtitle: 'Curriculum Library',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
