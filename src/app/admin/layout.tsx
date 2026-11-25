import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Admin Control Room',
  description: 'Mwalimu Family editorial and operations control room.',
  path: '/admin',
  noIndex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
