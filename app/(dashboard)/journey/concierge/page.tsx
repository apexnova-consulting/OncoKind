import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { getProfile } from '@/lib/auth';
import { ConciergeCaseDashboard } from '@/components/concierge/ConciergeCaseDashboard';

export const metadata: Metadata = {
  title: 'Your Concierge case',
  robots: { index: false, follow: false },
};

export default async function ConciergeJourneyPage() {
  if (!isFeatureEnabled('concierge_public_pages')) notFound();
  const { user } = await getProfile();
  if (!user) redirect('/login?redirect=/journey/concierge');
  return <ConciergeCaseDashboard />;
}
