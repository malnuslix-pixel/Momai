import type { Metadata } from 'next';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mwalimufamily.com').replace(/\/+$/, '');
export const SITE_NAME = 'Mwalimu Family';

export interface PageSeoOptions {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
  ogSubtitle?: string;
}

export function buildPageMetadata(opts: PageSeoOptions): Metadata {
  const cleanPath = opts.path.startsWith('/') ? opts.path : `/${opts.path}`;
  const canonicalUrl = cleanPath === '/' ? SITE_URL : `${SITE_URL}${cleanPath}`;
  const ogParams = new URLSearchParams({
    title: opts.title,
    desc: opts.description,
    tag: opts.ogSubtitle || 'Kenya CBC & 8-4-4 Education Hub',
  });
  const ogImageUrl = `${SITE_URL}/api/og?${ogParams.toString()}`;

  return {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: opts.noIndex
      ? {
          index: false,
          follow: false,
          googleBot: { index: false, follow: false },
        }
      : {
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
    openGraph: {
      title: `${opts.title} | ${SITE_NAME}`,
      description: opts.description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: 'en_KE',
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${opts.title} — ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${opts.title} | ${SITE_NAME}`,
      description: opts.description,
      images: [ogImageUrl],
    },
  };
}
