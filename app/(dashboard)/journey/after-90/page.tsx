import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getProfile } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import {
  AFTER_90_PHASE_NAME,
  ASK_CARE_TEAM,
  FAMILY_RISK_NAME,
  FAMILY_RISK_REMINDER,
  FOLLOW_UP_SCHEDULE_PROMPT,
  FOLLOW_UP_VISIT_PREP_NAME,
  RECORDS_VAULT_NAME,
  isAfter90FlagOn,
} from '@/lib/after-90/config';
import { shouldShowAfter90Phase } from '@/lib/after-90/eligibility';
import { After90Workspace } from '@/components/after-90/After90Workspace';

export default async function After90Page() {
  if (!isAfter90FlagOn('after90Phase')) notFound();
  const { user, hasVaultAccess } = await getProfile();
  if (!user) notFound();
  const supabase = await createServerSupabaseClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('created_at, treatment_finished_at, vault_consent_at')
    .eq('id', user.id)
    .maybeSingle();
  const { data: caseReady } = await supabase
    .from('concierge_cases')
    .select('case_ready_at')
    .eq('user_id', user.id)
    .not('case_ready_at', 'is', null)
    .limit(1)
    .maybeSingle();
  const visible = shouldShowAfter90Phase({
    accountCreatedAt: profile?.created_at ?? user.created_at ?? null,
    treatmentFinishedAt: profile?.treatment_finished_at ?? null,
    conciergeCaseReadyAt: caseReady?.case_ready_at ?? null,
  });
  if (!visible) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-display text-3xl font-semibold">{AFTER_90_PHASE_NAME}</h1>
        <p className="mt-4 text-slate-600">
          This section appears after 90 days, after you mark active treatment finished, or after a Concierge case is Case Ready.
        </p>
        <form action="/api/after-90/mark-treatment-finished" method="post" className="mt-6">
          <Button type="submit">Mark active treatment finished</Button>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-[#0F6E56]">Plan ahead</p>
        <h1 className="mt-2 font-display text-3xl font-semibold">{AFTER_90_PHASE_NAME}</h1>
        <p className="mt-3 text-slate-600">
          Three parts you already have, gathered here: {RECORDS_VAULT_NAME.toLowerCase()}, {FOLLOW_UP_VISIT_PREP_NAME.toLowerCase()}, and {FAMILY_RISK_NAME.toLowerCase()}.
        </p>
      </div>
      <After90Workspace
        vaultConsented={Boolean(profile?.vault_consent_at)}
        hasVaultAccess={Boolean(hasVaultAccess)}
        schedulePrompt={FOLLOW_UP_SCHEDULE_PROMPT}
        askLine={ASK_CARE_TEAM}
        familyReminder={FAMILY_RISK_REMINDER}
        vaultHref="/dashboard/vault-consent"
        familyHref="/features/oncokind-family"
        timelineHref="/journey/timeline"
        prepHref="/journey"
      />
      <p>
        <Link href="/journey" className="text-sm font-semibold text-[#0F6E56]">
          Back to Journey
        </Link>
      </p>
    </main>
  );
}
