import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Practical Courses & Skills for School & Career',
  description: 'Short, practical Kenyan courses in study skills, digital literacy, personal finance, and career readiness.',
  path: '/courses',
  keywords: ['Kenya student courses', 'digital literacy Kenya', 'study skills CBC'],
  ogSubtitle: 'Courses & Skills',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
