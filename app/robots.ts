import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.oncokind.com';

  return {
    rules: {
      userAgent: '*',
      // Explicit allow must appear so crawlers that prefix-match
      // `Disallow: /prior-auth` do not block the public KindAuth landing page.
      allow: ['/', '/prior-auth-pro', '/prior-auth-pro/'],
      disallow: ['/api/', '/dashboard/', '/journey/', '/admin/', '/prior-auth/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
