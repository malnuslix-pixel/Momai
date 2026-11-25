import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Offline Mode',
  description: 'You are currently offline. Cached Mwalimu Family resources remain available.',
  path: '/offline',
  noIndex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
