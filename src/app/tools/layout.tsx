import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'KCSE, KUCCPS & KJSEA Calculators & Classroom Tools',
  description: 'Free KCSE 84-point grade calculator, KUCCPS weighted cluster points calculator, KJSEA 72-point converter, and AI CBC report remark generator.',
  path: '/tools',
  keywords: ['KCSE points calculator', 'KUCCPS cluster points', 'KJSEA calculator', 'CBC report remarks'],
  ogSubtitle: 'Calculators & Teacher Tools',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
