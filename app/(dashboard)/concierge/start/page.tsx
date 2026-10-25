import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { getProfile } from '@/lib/auth';
import { ConciergeIntake } from '@/components/concierge/ConciergeIntake';

export const metadata: Metadata = {
  title: 'Start a Concierge case',
  robots: { index: false, follow: false },
};

export default async function ConciergeStartPage() {
  if (!isFeatureEnabled('concierge_public_pages')) notFound();
  const { user } = await getProfile();
  if (!user) redirect('/login?redirect=/concierge/start');
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-sm font-semibold uppercase tracking-widest text-[#0F6E56]">Get Me There</p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-[#1e2d2b]">Start a Concierge case</h1>
      <p className="mt-3 text-slate-600">
        About 10 minutes. You can save progress and skip anything you are not sure about. We do not require diagnosis or stage.
      </p>
      <ConciergeIntake />
    </main>
  );
}
