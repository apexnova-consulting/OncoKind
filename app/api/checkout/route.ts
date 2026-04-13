import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { createCheckoutSession } from '@/lib/stripe';
import {
  isBillingInterval,
  isCheckoutPlanKey,
  isKnownStripePriceId,
  resolveCheckoutPriceId,
  stripePrices,
} from '@/lib/stripe-prices';

const defaultPriceId = stripePrices.proMonthly;

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData().catch(() => new FormData());
  const requestedPlan = formData.get('plan');
  const requestedBillingInterval = formData.get('billingInterval');
  const requestedPriceId = formData.get('priceId');

  let priceId = defaultPriceId;

  if (
    typeof requestedPlan === 'string' &&
    typeof requestedBillingInterval === 'string' &&
    isCheckoutPlanKey(requestedPlan) &&
    isBillingInterval(requestedBillingInterval)
  ) {
    priceId = resolveCheckoutPriceId(requestedPlan, requestedBillingInterval);
    if (!priceId) {
      return NextResponse.json({ error: 'Selected billing option is not configured' }, { status: 503 });
    }
  } else if (typeof requestedPriceId === 'string' && isKnownStripePriceId(requestedPriceId)) {
    priceId = requestedPriceId;
  }

  if (!priceId) {
    return NextResponse.json({ error: 'Checkout not configured' }, { status: 503 });
  }
  const base = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin;

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single();

  const session = await createCheckoutSession({
    customerId: profile?.stripe_customer_id ?? undefined,
    customerEmail: profile?.stripe_customer_id ? undefined : user.email ?? undefined,
    successUrl: `${base}/dashboard?checkout=success`,
    cancelUrl: `${base}/dashboard/billing`,
    priceId,
    userId: user.id,
  });

  if (session.url) {
    return NextResponse.redirect(session.url);
  }
  return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
}
