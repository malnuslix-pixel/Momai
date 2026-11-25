import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'YouTube Classroom — Mini Lessons & Family Vlogs',
  description: 'Watch concise 10-minute CBC curriculum mini-lessons, parent guidance discussions, and school celebration documentaries.',
  path: '/videos',
  keywords: ['Mwalimu Family YouTube', 'CBC video lessons', 'Kenya education videos'],
  ogSubtitle: 'YouTube Classroom',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
