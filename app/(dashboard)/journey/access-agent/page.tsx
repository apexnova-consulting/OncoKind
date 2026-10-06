import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { getProfile } from '@/lib/auth';
import { AccessAgentExperience } from '@/components/agents/AccessAgentExperience';

export const metadata: Metadata = {
  title: 'Access Agent',
  description: 'Estimate the practical cost of reaching a trial or specialist and find assistance programs.',
  robots: { index: false, follow: false },
};

export default async function AccessAgentPage() {
  if (!isFeatureEnabled('feature_access_agent')) notFound();
  const { user } = await getProfile();
  if (!user) notFound();
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <p className="text-sm font-semibold uppercase tracking-widest text-[#0F6E56]">Tools</p>
      <h1 className="font-display text-4xl font-semibold text-[#1e2d2b]">Access Agent</h1>
      <p className="text-lg text-slate-600">
        Plan how to get there. Estimates are not financial advice. Program matches never promise funds.
      </p>
      <AccessAgentExperience />
    </main>
  );
}
