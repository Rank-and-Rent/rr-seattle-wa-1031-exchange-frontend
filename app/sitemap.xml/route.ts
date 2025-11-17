import { NextRequest } from 'next/server';
import { CANONICAL_URL } from '@/lib/config';
import { servicesData } from '@/data/services';
import { locationsData } from '@/data/locations';

export async function GET(request: NextRequest) {
  const urls = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/services', priority: '0.9', changefreq: 'weekly' },
    { url: '/locations', priority: '0.9', changefreq: 'weekly' },
    { url: '/blog', priority: '0.8', changefreq: 'daily' },
    { url: '/contact', priority: '0.9', changefreq: 'monthly' },
    { url: '/privacy', priority: '0.5', changefreq: 'yearly' },
    { url: '/terms', priority: '0.5', changefreq: 'yearly' },
    ...servicesData.map(service => ({
      url: service.route,
      priority: '0.7',
      changefreq: 'monthly' as const
    })),
    ...locationsData.map(location => ({
      url: location.route,
      priority: '0.7',
      changefreq: 'monthly' as const
    })),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ url, priority, changefreq }) => `  <url>
    <loc>${CANONICAL_URL}${url}</loc>
    <priority>${priority}</priority>
    <changefreq>${changefreq}</changefreq>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    }
  });
}

