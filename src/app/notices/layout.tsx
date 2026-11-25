import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Official Education Notice Board & MoE Circulars',
  description: 'Ministry of Education term dates, Grade 10 Senior School checklists, KNEC circulars, and official scam alerts.',
  path: '/notices',
  keywords: ['Kenya school term dates', 'Ministry of Education circulars', 'KNEC notices'],
  ogSubtitle: 'Education Notice Board',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
