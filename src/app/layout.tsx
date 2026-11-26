import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import '@/styles/mwalimu-site.css';
import ServiceWorkerManager from '@/components/ServiceWorkerManager';
import ErrorBoundary from '@/components/ErrorBoundary';
import { CmsProvider } from '@/lib/cms-context';
import { SITE_URL, SITE_NAME } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Mwalimu Family — Kenya’s Education News & Learning Hub',
    template: '%s | Mwalimu Family',
  },
  description: 'Kenya’s school news, KCSE & KJSEA exam timelines, free CBC schemes of work, revision notes and AI tutoring for teachers and families.',
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  keywords: [
    'Kenya education news',
    'CBC curriculum',
    'KJSEA results 2026',
    'KCSE 2026',
    'schemes of work Kenya',
    'lesson plans Kenya',
    'KPSEA',
    'KUCCPS cluster points',
    'Grade 10 Senior School pathways',
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
    url: SITE_URL,
    siteName: SITE_NAME,
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
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&family=Fraunces:opsz,wght@9..144,600;9..144,700;9..144,800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="dns-prefetch" href="https://wa.me" />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: SITE_NAME,
                url: SITE_URL,
                logo: `${SITE_URL}/icons/apple-touch-icon.png`,
                areaServed: {
                  '@type': 'Country',
                  name: 'Kenya',
                },
                sameAs: [
                  'https://youtube.com/@mwalimufamily',
                  'https://facebook.com/mwalimufamily',
                  'https://instagram.com/mwalimufamily',
                  'https://x.com/mwalimufamily',
                ],
              },
              {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: SITE_NAME,
                url: SITE_URL,
                inLanguage: ['en-KE', 'sw-KE'],
                potentialAction: {
                  '@type': 'SearchAction',
                  target: `${SITE_URL}/learn?q={search_term_string}`,
                  'query-input': 'required name=search_term_string',
                },
              },
            ]),
          }}
        />
        <ServiceWorkerManager />
        <ErrorBoundary>
          <CmsProvider>
            {children}
          </CmsProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
