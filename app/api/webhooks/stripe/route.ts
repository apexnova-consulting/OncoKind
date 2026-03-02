import type Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient } from '@/lib/stripe';
import { createServiceRoleSupabaseClient } from '@/lib/supabase-server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripeClient();
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createServiceRoleSupabaseClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
      const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;
      let userId = session.metadata?.supabase_user_id as string | undefined;
      if (!userId && subscriptionId) {
        const sub = await getStripeClient().subscriptions.retrieve(subscriptionId);
        userId = sub.metadata?.supabase_user_id as string | undefined;
      }
      if (userId && (customerId || subscriptionId)) {
        await supabase
          .from('profiles')
          .update({
            stripe_customer_id: customerId ?? undefined,
            stripe_subscription_id: subscriptionId ?? undefined,
            subscription_status: 'pro',
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);
      }
      break;
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      if (sub.id) {
        await supabase
          .from('profiles')
          .update({
            subscription_status: 'cancelled',
            stripe_subscription_id: null,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', sub.id);
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
