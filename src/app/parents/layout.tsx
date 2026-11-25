import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Parents Guidance Hub — Grade 10 Pathways & Fee Guides',
  description: 'Grade 10 Senior School pathway decider (STEM, Social Sciences, Arts & Sports), MoE fee guidance, and school calendar sync for Kenyan parents.',
  path: '/parents',
  keywords: ['Grade 10 pathways Kenya', 'Senior School CBC', 'Kenya school calendar 2026', 'parents guidance'],
  ogSubtitle: 'Parents Guidance Hub',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
