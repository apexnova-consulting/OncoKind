import { FIRST_72_CONTENT_META } from '@/content/first-72-hours/v1';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { hasCaregiverAccess } from '@/lib/pricing-config';
import { personalizeTasks, tasksByBucket, todaysTopThree, type First72Intake } from '@/lib/first-72-hours';
import { First72Checklist } from '@/components/first-72/First72Checklist';
import { redirect } from 'next/navigation';
import { getProfile } from '@/lib/auth';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { Metadata } from 'next';
import { SITE_ORIGIN } from '@/lib/pricing-config';

export const metadata: Metadata = {
  title: 'First 72 Hours',
  description: 'A calm, sequenced checklist for the first days after a cancer diagnosis.',
  alternates: { canonical: `${SITE_ORIGIN}/first-72-hours` },
  openGraph: {
    title: 'First 72 Hours',
    description: 'A calm, sequenced checklist for the first days after a cancer diagnosis.',
    url: `${SITE_ORIGIN}/first-72-hours`,
    images: [{ url: `${SITE_ORIGIN}/og-home.png`, width: 1200, height: 630, alt: 'First 72 Hours' }],
  },
};

export default async function First72HoursPage() {
  if (!isFeatureEnabled('feature_first_72_hours')) {
    redirect('/pricing');
  }

  const { user, profile, isPro } = await getProfile();
  if (!user) redirect('/login?redirect=/first-72-hours');

  const supabase = await createServerSupabaseClient();
  const { data: latest } = await supabase
    .from('patient_reports')
    .select('id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const intake: First72Intake = {};
  const tasks = personalizeTasks(intake);
  const paid = hasCaregiverAccess(profile?.subscription_tier) || isPro;

  return (
    <main className="mx-auto max-w-3xl space-y-8 px-4 py-10">
      <header>
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--brand-primary)]">
          First 72 Hours
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-[var(--color-text-primary)]">
          A calm plan for the first days
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          The core checklist is free on every plan. Calendar sync, reminders, and PDF export are
          included with Caregiver Pro.
        </p>
      </header>
      <First72Checklist
        tasks={tasks}
        buckets={tasksByBucket(tasks)}
        topThree={todaysTopThree(tasks)}
        paidEnhancements={paid}
        hasReport={Boolean(latest?.id)}
        contentMeta={FIRST_72_CONTENT_META}
      />
      <footer className="rounded-xl border border-[var(--color-border-subtle)] bg-white p-4 text-sm text-[var(--color-text-secondary)]">
        If you or someone you love needs immediate support, call the Cancer Support Community helpline at{' '}
        <a className="underline" href="tel:18887939355">
          1-888-793-9355
        </a>
        . For a mental health crisis in the United States, call or text 988.
      </footer>
    </main>
  );
}
