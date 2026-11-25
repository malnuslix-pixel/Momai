import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Help & Kenyan Education Glossary (CBC, KJSEA, KUCCPS)',
  description: 'Plain-language glossary and help guide explaining CBC, KPSEA, KJSEA, KCSE, KUCCPS, and TSC terms in Kenya.',
  path: '/help',
  keywords: ['CBC glossary', 'KJSEA meaning', 'KUCCPS guide Kenya'],
  ogSubtitle: 'Help & Glossary',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
