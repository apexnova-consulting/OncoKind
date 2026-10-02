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

const defaultPriceId = stripePrices.careProMonthly;

async function handleCheckout(
  request: NextRequest,
  {
    requestedPlan,
    requestedBillingInterval,
    requestedPriceId,
  }: { requestedPlan: string | null; requestedBillingInterval: string | null; requestedPriceId: string | null }
): Promise<NextResponse> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    const login = new URL('/login', request.nextUrl.origin);
    login.searchParams.set('redirect', request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(login);
  }

  let priceId = defaultPriceId;
  let planKey = requestedPlan ?? 'advocate';

  if (
    typeof requestedPlan === 'string' &&
    isCheckoutPlanKey(requestedPlan)
  ) {
    const interval =
      requestedPlan === 'professional'
        ? 'monthly'
        : isBillingInterval(requestedBillingInterval)
          ? requestedBillingInterval
          : 'yearly';
    priceId = resolveCheckoutPriceId(requestedPlan, interval);
    planKey = requestedPlan;
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
  const successPlan = planKey === 'professional' ? 'professional' : 'care_advocacy_pro';

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single();

  const session = await createCheckoutSession({
    customerId: profile?.stripe_customer_id ?? undefined,
    customerEmail: profile?.stripe_customer_id ? undefined : user.email ?? undefined,
    successUrl: `${base}/dashboard?checkout=success&plan=${successPlan}`,
    cancelUrl: `${base}/dashboard/billing`,
    priceId,
    userId: user.id,
    planKey,
  });

  if (session.url) {
    return NextResponse.redirect(session.url);
  }
  return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  return handleCheckout(request, {
    requestedPlan: searchParams.get('plan'),
    requestedBillingInterval: searchParams.get('billingInterval') ?? 'yearly',
    requestedPriceId: searchParams.get('priceId'),
  });
}

export async function POST(request: NextRequest) {
  const formData = await request.formData().catch(() => new FormData());
  return handleCheckout(request, {
    requestedPlan: formData.get('plan') as string | null,
    requestedBillingInterval: formData.get('billingInterval') as string | null,
    requestedPriceId: formData.get('priceId') as string | null,
  });
}
