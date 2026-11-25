import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/og'],
        disallow: ['/admin', '/activity', '/offline', '/api/admin/', '/api/mpesa/', '/api/submit', '/api/subscribe'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
