import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'About Mwalimu Family & Contact Desk',
  description: 'Learn about Mwalimu Family’s independent Kenyan education news desk, KICD-aligned curriculum writers, and WhatsApp/email alerts.',
  path: '/about',
  keywords: ['about Mwalimu Family', 'Kenya education platform', 'contact Mwalimu Family'],
  ogSubtitle: 'About & Contact',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
