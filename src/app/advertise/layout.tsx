import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Advertise Your School, Books or Education Event',
  description: 'Reach Kenyan teachers, parents, and students across all 47 counties with verified educational promotions on Mwalimu Family.',
  path: '/advertise',
  keywords: ['advertise schools Kenya', 'education marketing Kenya', 'Mwalimu Family rates'],
  ogSubtitle: 'Advertise With Us',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
