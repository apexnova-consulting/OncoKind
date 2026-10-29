import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleSupabaseClient } from '@/lib/supabase-server';
import { getStripeClient } from '@/lib/stripe';
import { stripePrices } from '@/lib/stripe-prices';
import { CONCIERGE_CAREGIVER_GRANT_DAYS } from '@/lib/concierge/config';
import {
  explorerAfterConciergeEmail,
  resumeReminderEmail,
  rolloverReminderEmail,
  sendUserEmail,
  sponsorshipEndingEmail,
  vaultDeletionWarningEmail,
} from '@/lib/after-90/emails';
import { shouldPurgeVault } from '@/lib/after-90/vault';
import { SITE_ORIGIN } from '@/lib/pricing-config';

function isAuthorized(request: NextRequest) {
  const expected = process.env.CHECK_IN_CRON_SECRET ?? process.env.CRON_SECRET;
  if (!expected) return false;
  const headerSecret = request.headers.get('x-cron-secret');
  const authHeader = request.headers.get('authorization') ?? '';
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  return headerSecret === expected || bearer === expected;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = createServiceRoleSupabaseClient();
  const now = new Date();
  const inSevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const { data: pauses } = await supabase
    .from('subscription_pauses')
    .select('id, user_id, resumes_at, reminder_sent_at')
    .is('reminder_sent_at', null)
    .lte('resumes_at', inSevenDays.toISOString())
    .gte('resumes_at', now.toISOString());
  for (const pause of pauses ?? []) {
    const { data: profile } = await supabase.from('profiles').select('email').eq('id', pause.user_id).maybeSingle();
    if (profile?.email) await sendUserEmail(profile.email, resumeReminderEmail(pause.resumes_at));
    await supabase.from('subscription_pauses').update({ reminder_sent_at: now.toISOString() }).eq('id', pause.id);
  }

  const { data: rollovers } = await supabase
    .from('keep_rollover_consents')
    .select('id, user_id, ticked, opted_out_at, reminder_sent_at, opt_out_token, created_at')
    .eq('ticked', true)
    .is('opted_out_at', null);
  for (const row of rollovers ?? []) {
    const chargeOn = new Date(row.created_at);
    chargeOn.setUTCDate(chargeOn.getUTCDate() + CONCIERGE_CAREGIVER_GRANT_DAYS);
    const remindOn = new Date(chargeOn.getTime() - 7 * 24 * 60 * 60 * 1000);
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, stripe_subscription_id, subscription_tier')
      .eq('id', row.user_id)
      .maybeSingle();
    if (!row.reminder_sent_at && now >= remindOn && now < chargeOn && profile?.email && row.opt_out_token) {
      await sendUserEmail(
        profile.email,
        rolloverReminderEmail(chargeOn.toISOString(), `${SITE_ORIGIN}/keep/opt-out/${row.opt_out_token}`)
      );
      await supabase.from('keep_rollover_consents').update({ reminder_sent_at: now.toISOString() }).eq('id', row.id);
    }
    if (now >= chargeOn && profile?.stripe_subscription_id && stripePrices.keepMonthly) {
      const stripe = getStripeClient();
      const sub = await stripe.subscriptions.retrieve(profile.stripe_subscription_id);
      const itemId = sub.items.data[0]?.id;
      if (itemId) {
        await stripe.subscriptions.update(profile.stripe_subscription_id, {
          items: [{ id: itemId, price: stripePrices.keepMonthly }],
          proration_behavior: 'none',
        });
      }
    } else if (now >= chargeOn && profile?.email && !row.ticked) {
      await sendUserEmail(profile.email, explorerAfterConciergeEmail());
    }
  }

  const { data: ending } = await supabase
    .from('org_sponsorship_contracts')
    .select('id, ends_on, organization_id')
    .lte('ends_on', new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
  for (const contract of ending ?? []) {
    const { data: seats } = await supabase
      .from('org_sponsored_seats')
      .select('user_id')
      .eq('contract_id', contract.id);
    for (const seat of seats ?? []) {
      const { data: profile } = await supabase.from('profiles').select('email').eq('id', seat.user_id).maybeSingle();
      if (profile?.email) await sendUserEmail(profile.email, sponsorshipEndingEmail(contract.ends_on));
    }
  }

  const { data: ended } = await supabase
    .from('profiles')
    .select('id, email, vault_consent_at, subscription_tier, plan_ended_at')
    .not('plan_ended_at', 'is', null);
  let purged = 0;
  for (const row of ended ?? []) {
    if (
      shouldPurgeVault({
        consentAt: row.vault_consent_at,
        tier: row.subscription_tier,
        planEndedAt: row.plan_ended_at,
        now,
      })
    ) {
      await supabase.from('vault_deletion_log').insert({ user_id: row.id, reason: 'plan_ended_90_days' });
      purged += 1;
    } else if (row.email && row.plan_ended_at) {
      const daysLeft = Math.ceil(
        (new Date(row.plan_ended_at).getTime() + 90 * 24 * 60 * 60 * 1000 - now.getTime()) / (24 * 60 * 60 * 1000)
      );
      if (daysLeft === 60 || daysLeft === 7) {
        await sendUserEmail(row.email, vaultDeletionWarningEmail(daysLeft));
      }
    }
  }

  return NextResponse.json({ ok: true, pauseReminders: pauses?.length ?? 0, vaultPurged: purged });
}
