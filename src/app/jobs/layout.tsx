import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Teaching & Education Jobs in Kenya (0% Placement Fee)',
  description: 'Browse verified teaching, tutoring, and school administration vacancies across Kenya’s 47 counties with strict zero-fee employer rules.',
  path: '/jobs',
  keywords: ['teaching jobs Kenya', 'TSC teacher vacancies', 'school jobs Nairobi'],
  ogSubtitle: 'Education Jobs Board',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
