import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Academic Leaderboard — Study Points & Streaks',
  description: 'Track top learners and study streaks across Kenyan CBC and KCSE revision quizzes on Mwalimu Family.',
  path: '/leaderboard',
  keywords: ['Kenya student leaderboard', 'CBC study points', 'revision challenge'],
  ogSubtitle: 'Academic Leaderboard',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
