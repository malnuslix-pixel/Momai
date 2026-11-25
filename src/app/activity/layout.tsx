import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'My Activity & Saved Materials',
  description: 'Device-local saved materials and submission history.',
  path: '/activity',
  noIndex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
