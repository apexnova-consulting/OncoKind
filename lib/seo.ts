import type { Metadata } from 'next';
import { SITE_ORIGIN } from '@/lib/pricing-config';

export function pageMetadata({
  title,
  description,
  path,
  imageAlt,
  noindex,
  absoluteTitle,
}: {
  title: string;
  description: string;
  path: string;
  imageAlt?: string;
  noindex?: boolean;
  absoluteTitle?: string;
}): Metadata {
  const url = `${SITE_ORIGIN}${path}`;
  const image = {
    url: `${SITE_ORIGIN}/og-home.png`,
    width: 1200,
    height: 630,
    alt: imageAlt ?? title,
  };
  return {
    title: absoluteTitle ? { absolute: absoluteTitle } : title,
    description,
    alternates: noindex ? undefined : { canonical: url },
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: 'OncoKind',
      type: 'website',
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image.url],
    },
  };
}
