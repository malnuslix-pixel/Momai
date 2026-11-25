import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Study Pass Pricing — M-Pesa Plans for Families & Teachers',
  description: 'Compare free community access and affordable M-Pesa Study Pass plans on Mwalimu Family.',
  path: '/pricing',
  keywords: ['Mwalimu Family pricing', 'M-Pesa study pass', 'Kenya education subscription'],
  ogSubtitle: 'Plans & Pricing',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
