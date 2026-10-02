import type Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient } from '@/lib/stripe';
import { createServiceRoleSupabaseClient } from '@/lib/supabase-server';
import { tierFromPriceId } from '@/lib/stripe-prices';
import { queueProfessionalBaaEmail } from '@/lib/internal-email';

export const runtime = 'nodejs';

function priceIdFromSubscription(sub: Stripe.Subscription): string | undefined {
  const price = sub.items.data[0]?.price;
  return typeof price === 'string' ? price : price?.id;
}

async function syncProfileFromSubscription(
  supabase: ReturnType<typeof createServiceRoleSupabaseClient>,
  sub: Stripe.Subscription,
  extra?: { userId?: string; customerId?: string; email?: string | null }
) {
  const priceId = priceIdFromSubscription(sub);
  const userId = extra?.userId ?? (sub.metadata?.supabase_user_id as string | undefined);
  const customerId =
    extra?.customerId ??
    (typeof sub.customer === 'string' ? sub.customer : sub.customer?.id);
  const status = sub.status;
  const now = new Date().toISOString();

  if (status === 'past_due' || status === 'unpaid') {
    const payload = {
      subscription_status: 'past_due' as const,
      stripe_subscription_id: sub.id,
      stripe_customer_id: customerId ?? undefined,
      updated_at: now,
    };
    if (userId) {
      await supabase.from('profiles').update(payload).eq('id', userId);
    } else if (sub.id) {
      await supabase.from('profiles').update(payload).eq('stripe_subscription_id', sub.id);
    }
    return;
  }

  if (status === 'canceled' || status === 'incomplete_expired') {
    const payload = {
      subscription_status: 'cancelled' as const,
      subscription_tier: 'free',
      stripe_subscription_id: null,
      updated_at: now,
    };
    if (userId) {
      await supabase.from('profiles').update(payload).eq('id', userId);
    } else {
      await supabase.from('profiles').update(payload).eq('stripe_subscription_id', sub.id);
    }
    return;
  }

  if (status === 'active' || status === 'trialing') {
    const tier = tierFromPriceId(priceId);
    const payload = {
      stripe_customer_id: customerId ?? undefined,
      stripe_subscription_id: sub.id,
      subscription_status: 'pro' as const,
      subscription_tier: tier,
      updated_at: now,
    };
    if (userId) {
      await supabase.from('profiles').update(payload).eq('id', userId);
    } else {
      await supabase.from('profiles').update(payload).eq('stripe_subscription_id', sub.id);
    }
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripeClient().webhooks.constructEvent(body, sig, secret);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createServiceRoleSupabaseClient();
  const stripe = getStripeClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
      const subscriptionId =
        typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;
      let userId = session.metadata?.supabase_user_id as string | undefined;
      let priceId: string | undefined;
      let email = session.customer_email ?? session.customer_details?.email ?? null;

      if (subscriptionId) {
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        userId = userId ?? (sub.metadata?.supabase_user_id as string | undefined);
        priceId = priceIdFromSubscription(sub);
        await syncProfileFromSubscription(supabase, sub, { userId, customerId, email });
      } else if (userId) {
        const tier = tierFromPriceId(priceId);
        await supabase
          .from('profiles')
          .update({
            stripe_customer_id: customerId ?? undefined,
            subscription_status: 'pro',
            subscription_tier: tier,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);
      }

      const planKey = session.metadata?.plan_key;
      const tier = tierFromPriceId(priceId);
      if (userId && (planKey === 'professional' || tier === 'professional')) {
        if (!email && userId) {
          const { data: profile } = await supabase.from('profiles').select('email').eq('id', userId).maybeSingle();
          email = profile?.email ?? null;
        }
        await queueProfessionalBaaEmail({
          userId,
          email,
          customerId,
          subscriptionId,
        });
      }
      break;
    }
    case 'invoice.paid':
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId =
        typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id;
      if (subscriptionId) {
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        await syncProfileFromSubscription(supabase, sub);
      }
      break;
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId =
        typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id;
      if (subscriptionId) {
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        await syncProfileFromSubscription(supabase, sub);
      }
      break;
    }
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      await syncProfileFromSubscription(supabase, sub);
      break;
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      await syncProfileFromSubscription(supabase, sub);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
