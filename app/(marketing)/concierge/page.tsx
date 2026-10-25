import { pageMetadata } from '@/lib/seo';
import { ConciergeMarketing } from '@/components/concierge/ConciergeMarketing';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { notFound } from 'next/navigation';

export const metadata = pageMetadata({
  title: 'OncoKind Concierge',
  description:
    'We handle the records, forms, and phone calls, so your family can focus on what matters. Educational support, not medical advice.',
  path: '/concierge',
  imageAlt: 'OncoKind Concierge',
});

export default function ConciergePage() {
  if (!isFeatureEnabled('concierge_public_pages')) notFound();
  return <ConciergeMarketing />;
}
