import { pageMetadata } from '@/lib/seo';
import { HardshipForm } from '@/components/concierge/HardshipForm';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { notFound } from 'next/navigation';

export const metadata = pageMetadata({
  title: 'Concierge hardship request',
  description: 'Request a reduced price or sponsored OncoKind Concierge case. Do not include medical details.',
  path: '/concierge/hardship',
});

export default function HardshipPage() {
  if (!isFeatureEnabled('concierge_public_pages')) notFound();
  return <HardshipForm />;
}
