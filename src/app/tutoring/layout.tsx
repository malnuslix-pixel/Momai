import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Vetted Home & Online Tutoring in Kenya',
  description: 'Connect with verified Kenyan tutors for CBC, 8-4-4, KJSEA, and KCSE revision at home or online.',
  path: '/tutoring',
  keywords: ['home tutors Kenya', 'online tutoring CBC', 'KCSE private tutor'],
  ogSubtitle: 'Tutoring & Practice',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
