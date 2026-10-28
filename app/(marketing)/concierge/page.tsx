import { pageMetadata } from '@/lib/seo';
import { ConciergeMarketing } from '@/components/concierge/ConciergeMarketing';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { notFound } from 'next/navigation';
import { CONCIERGE_BRAND } from '@/lib/concierge/config';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = pageMetadata({
  title: 'OncoKind Concierge',
  description: `${CONCIERGE_BRAND.headline} Educational support, not medical advice.`,
  path: '/concierge',
  imageAlt: 'OncoKind Concierge',
});

export default function ConciergePage() {
  if (!isFeatureEnabled('concierge_public_pages')) notFound();
  return <ConciergeMarketing />;
}
