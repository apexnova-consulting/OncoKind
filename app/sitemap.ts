import type { MetadataRoute } from 'next';
import { LEARN_ARTICLES } from '@/lib/learn-content';
import { RESOURCE_ARTICLES } from '@/lib/resources-content';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.oncokind.com';
  const now = new Date();

  const staticRoutes = [
    '',
    '/about',
    '/pricing',
    '/privacy',
    '/terms',
    '/security',
    '/trust',
    '/professional',
    '/support',
    '/learn',
    '/community',
    '/mission',
    '/empathy-filter',
    '/resources',
    '/features/doctor-prep-sheet',
    '/features/clinical-trial-matching',
    '/features/insurance-denial-defense',
    '/signup',
    '/login',
    '/prior-auth-pro',
  ];

  const resourceRoutes = RESOURCE_ARTICLES.map((article) => `/resources/${article.slug}`);
  const learnRoutes = LEARN_ARTICLES.map((article) => `/learn/${article.slug}`);

  return [...staticRoutes, ...resourceRoutes, ...learnRoutes].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
  }));
}
