import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Privacy Notice',
  description: 'How Mwalimu Family handles learner, parent, and teacher data safely and transparently.',
  path: '/privacy',
  keywords: ['Mwalimu Family privacy policy', 'Kenya education data protection'],
  ogSubtitle: 'Privacy Notice',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
