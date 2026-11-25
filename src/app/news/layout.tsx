import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Kenya Education News & Exam Updates',
  description: 'Verified Kenyan education reporting on KJSEA, KCSE, KPSEA, Ministry of Education circulars, and exam scam warnings.',
  path: '/news',
  keywords: ['Kenya education news', 'KNEC updates', 'KJSEA 2026', 'KCSE 2026', 'Ministry of Education Kenya'],
  ogSubtitle: 'Education News Desk',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
