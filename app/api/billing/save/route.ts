import { NextRequest, NextResponse } from 'next/server';
import { getProfile } from '@/lib/auth';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getStripeClient } from '@/lib/stripe';
import { stripePrices } from '@/lib/stripe-prices';
import { isAfter90FlagOn } from '@/lib/after-90/config';
import { isBereavementReason, resumeAtFromMonths, unusedTimeRefundCents } from '@/lib/after-90/save-flow';
import { isKeepEligible } from '@/lib/after-90/eligibility';
import { keepWelcomeEmail, pauseNoticeEmail, sendUserEmail } from '@/lib/after-90/emails';

export async function POST(request: NextRequest) {
  if (!isAfter90FlagOn('saveFlow')) {
    return NextResponse.json({ error: 'Not available.' }, { status: 404 });
  }
  const { user, profile, isPro, hasKeepAccess } = await getProfile();
  if (!user || (!isPro && !hasKeepAccess)) {
    return NextResponse.json({ error: 'Paid plan required.' }, { status: 401 });
  }
  const body = (await request.json()) as {
    choice?: 'pause' | 'switch_keep' | 'cancel';
    months?: number;
    reason?: string;
    confirmed?: boolean;
  };
  const supabase = await createServerSupabaseClient();
  const stripe = profile?.stripe_customer_id ? getStripeClient() : null;
  const subscriptionId = (profile as { stripe_subscription_id?: string } | null)?.stripe_subscription_id;

  if (body.choice === 'pause') {
    const months = body.months === 2 || body.months === 3 ? body.months : 1;
    const resumesAt = resumeAtFromMonths(months);
    if (stripe && subscriptionId) {
      await stripe.subscriptions.update(subscriptionId, {
        pause_collection: { behavior: 'void', resumes_at: Math.floor(resumesAt.getTime() / 1000) },
      });
    }
    await supabase.from('subscription_pauses').insert({
      user_id: user.id,
      months,
      resumes_at: resumesAt.toISOString(),
    });
    await supabase.from('profiles').update({ pause_resumes_at: resumesAt.toISOString() }).eq('id', user.id);
    await supabase.from('billing_save_events').insert({ user_id: user.id, choice: 'pause' });
    await supabase.from('product_events').insert({ user_id: user.id, event: 'pause_chosen', source: 'save_flow' });
    if (user.email) await sendUserEmail(user.email, pauseNoticeEmail(resumesAt.toISOString()));
    return NextResponse.json({ message: `Billing is paused until ${resumesAt.toISOString().slice(0, 10)}.` });
  }

  if (body.choice === 'switch_keep') {
    if (!isAfter90FlagOn('keepPlan')) {
      return NextResponse.json({ error: 'Keep is not available yet.' }, { status: 404 });
    }
    const eligible = isKeepEligible({
      accountCreatedAt: user.created_at ?? null,
      fromSaveFlow: true,
    });
    if (!eligible.eligible) {
      return NextResponse.json({ error: 'Keep is not available for this account.' }, { status: 403 });
    }
    await supabase.from('profiles').update({ pending_plan: 'keep' }).eq('id', user.id);
    await supabase.from('billing_save_events').insert({ user_id: user.id, choice: 'switch_keep' });
    await supabase.from('product_events').insert({
      user_id: user.id,
      event: 'keep_chosen',
      source: 'save_flow',
    });
    if (stripe && subscriptionId && stripePrices.keepMonthly) {
      const sub = await stripe.subscriptions.retrieve(subscriptionId);
      const itemId = sub.items.data[0]?.id;
      if (itemId) {
        await stripe.subscriptions.update(subscriptionId, {
          items: [{ id: itemId, price: stripePrices.keepMonthly }],
          proration_behavior: 'none',
          billing_cycle_anchor: 'unchanged',
          cancel_at_period_end: false,
        });
      }
    }
    if (user.email) await sendUserEmail(user.email, keepWelcomeEmail());
    return NextResponse.json({ message: 'You will move to Keep at the end of the current period.' });
  }

  if (body.choice === 'cancel') {
    if (!body.confirmed) {
      return NextResponse.json({ error: 'Confirm cancellation on the second screen.' }, { status: 400 });
    }
    const bereavement = isBereavementReason(body.reason);
    if (stripe && subscriptionId) {
      const sub = await stripe.subscriptions.retrieve(subscriptionId);
      if (bereavement && isAfter90FlagOn('saveFlow')) {
        const start = new Date(sub.current_period_start * 1000);
        const end = new Date(sub.current_period_end * 1000);
        const latestInvoice =
          typeof sub.latest_invoice === 'string'
            ? await stripe.invoices.retrieve(sub.latest_invoice)
            : sub.latest_invoice;
        const paid = latestInvoice && 'amount_paid' in latestInvoice ? latestInvoice.amount_paid : 0;
        const refund = unusedTimeRefundCents({ periodStart: start, periodEnd: end, amountPaidCents: paid });
        if (refund > 0 && latestInvoice && 'id' in latestInvoice && latestInvoice.charge) {
          const chargeId = typeof latestInvoice.charge === 'string' ? latestInvoice.charge : latestInvoice.charge.id;
          await stripe.refunds.create({ charge: chargeId, amount: refund });
        }
      }
      await stripe.subscriptions.cancel(subscriptionId);
    }
    await supabase
      .from('profiles')
      .update({
        subscription_status: 'cancelled',
        subscription_tier: 'free',
        bereavement_at: bereavement ? new Date().toISOString() : null,
        plan_ended_at: new Date().toISOString(),
      })
      .eq('id', user.id);
    await supabase.from('billing_save_events').insert({
      user_id: user.id,
      choice: 'cancel',
      reason: bereavement ? 'bereavement' : 'selected',
    });
    await supabase.from('product_events').insert({
      user_id: user.id,
      event: 'cancel_completed',
      source: bereavement ? 'bereavement' : 'save_flow',
    });
    if (bereavement) {
      return NextResponse.json({
        message:
          'We are sorry for your loss. Your plan is canceled. You can download or delete records from settings. We will not send marketing email.',
      });
    }
    return NextResponse.json({ message: 'Your plan is canceled.' });
  }

  return NextResponse.json({ error: 'Choose pause, Keep, or cancel.' }, { status: 400 });
}
