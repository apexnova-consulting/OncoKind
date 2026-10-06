import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { getProfile } from '@/lib/auth';
import { CompleteThePictureExperience } from '@/components/agents/CompleteThePictureExperience';

export const metadata: Metadata = {
  title: 'Complete the Picture',
  description: 'See what your report says, what it does not mention, and the questions worth asking next.',
  robots: { index: false, follow: false },
};

export default async function CompleteThePicturePage() {
  if (!isFeatureEnabled('feature_complete_the_picture')) notFound();
  const { user, isPro } = await getProfile();
  if (!user) notFound();
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <p className="text-sm font-semibold uppercase tracking-widest text-[#0F6E56]">Tools</p>
      <h1 className="font-display text-4xl font-semibold text-[#1e2d2b]">Complete the Picture</h1>
      <p className="text-lg text-slate-600">
        Educational question preparation. OncoKind does not tell you which tests or treatments you need. Your care team decides.
      </p>
      <CompleteThePictureExperience persist showSamples paidTools={isPro} />
    </main>
  );
}
