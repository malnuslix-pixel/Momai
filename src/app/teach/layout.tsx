import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Teacher Preparation Desk — Schemes, Timetables & TPAD',
  description: 'Generate KICD CBC schemes of work with AI, build school timetables, and download editable TPAD-aligned classroom record templates.',
  path: '/teach',
  keywords: ['Kenya teacher preparation', 'TPAD templates', 'timetable generator Kenya', 'CBC scheme builder'],
  ogSubtitle: 'Teacher Preparation Desk',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
