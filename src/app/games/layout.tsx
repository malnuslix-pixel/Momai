import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'CBC Revision Quizzes, Flashcards & Learning Games',
  description: 'Interactive subject quizzes, CBC flashcards, and memory games to help Kenyan learners revise and earn study points.',
  path: '/games',
  keywords: ['CBC quizzes Kenya', 'Kenya revision games', 'KCSE flashcards'],
  ogSubtitle: 'Quizzes & Games',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
