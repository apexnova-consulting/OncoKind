import { pageMetadata } from '@/lib/seo';
import { ConciergeMarketing } from '@/components/concierge/ConciergeMarketing';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = pageMetadata({
  title: 'OncoKind Concierge',
  description:
    'Done-for-you records gathering and second opinion intake for any cancer diagnosis, built first for rare cancers. Educational support, not medical advice.',
  path: '/concierge',
  imageAlt: 'OncoKind Concierge',
});

export default function ConciergePage() {
  if (!isFeatureEnabled('concierge_public_pages')) notFound();
  return <ConciergeMarketing />;
}
