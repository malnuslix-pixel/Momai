import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import '@/styles/mwalimu-site.css';
import ServiceWorkerManager from '@/components/ServiceWorkerManager';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mwalimufamily.co.ke'),
  title: {
    default: 'Mwalimu Family — Kenya’s Education News & Learning Hub',
    template: '%s | Mwalimu Family',
  },
  description: 'Kenya’s school news, KCSE & KJSEA exam timelines, free CBC schemes of work, revision notes and AI tutoring for teachers and families.',
  keywords: [
    'Kenya education news',
    'CBC curriculum',
    'KJSEA results 2026',
    'KCSE 2026',
    'schemes of work Kenya',
    'lesson plans Kenya',
    'KPSEA',
    'KUCCPS cluster points',
    'M-Pesa study pass',
    'AI tutor Kenya',
  ],
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/icons/favicon-32.png',
    apple: '/icons/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Mwalimu Family — Kenya’s School News & Learning Hub',
    description: 'Exam timelines, free schemes of work, CBC revision notes & AI tutoring for Kenyan families.',
    url: 'https://mwalimufamily.co.ke',
    siteName: 'Mwalimu Family',
    locale: 'en_KE',
    type: 'website',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'Mwalimu Family — Kenya Education News and Learning Resources',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mwalimu Family — Kenya’s School News & Learning Hub',
    description: 'Exam timelines, free schemes of work, CBC revision notes & AI tutoring for Kenyan families.',
    images: ['/api/og'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#2c5f2d',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@500&family=Fraunces:opsz,wght@9..144,600;9..144,700;9..144,800&display=swap"
          rel="stylesheet"
        />
        <link rel="dns-prefetch" href="https://wa.me" />
      </head>
      <body>
        <ServiceWorkerManager />
        {children}
      </body>
    </html>
  );
}
