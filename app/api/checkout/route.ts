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
import { isFeatureEnabled } from '@/lib/feature-flags';
import { isKeepEligible } from '@/lib/after-90/eligibility';

const defaultPriceId = stripePrices.caregiverMonthly;

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
    if (requestedPlan === 'professional' && !isFeatureEnabled('professional_self_serve')) {
      return NextResponse.json(
        { error: 'Professional plans are sold by demo and invoice. Book a demo to get started.' },
        { status: 400 }
      );
    }
    if (requestedPlan === 'keep') {
      if (!isFeatureEnabled('keepPlan')) {
        return NextResponse.json({ error: 'Keep is not available yet.' }, { status: 404 });
      }
      const { data: profileRow } = await supabase
        .from('profiles')
        .select('created_at, treatment_finished_at')
        .eq('id', user.id)
        .maybeSingle();
      const { data: caseReady } = await supabase
        .from('concierge_cases')
        .select('case_ready_at')
        .eq('user_id', user.id)
        .not('case_ready_at', 'is', null)
        .limit(1)
        .maybeSingle();
      const fromSaveFlow = request.nextUrl.searchParams.get('from') === 'save_flow';
      const eligibility = isKeepEligible({
        accountCreatedAt: profileRow?.created_at ?? user.created_at ?? null,
        treatmentFinishedAt: profileRow?.treatment_finished_at ?? null,
        conciergeCaseReadyAt: caseReady?.case_ready_at ?? null,
        fromSaveFlow,
      });
      if (!eligibility.eligible) {
        return NextResponse.json(
          { error: 'Keep is available after your first 90 days, after treatment finishes, or from the save flow.' },
          { status: 403 }
        );
      }
    }
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
  const successPlan =
    planKey === 'keep'
      ? 'keep'
      : planKey === 'professional'
        ? 'professional'
        : planKey === 'advocate'
          ? 'advocate'
          : 'caregiver_pro';

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
    trialPeriodDays: planKey === 'professional' || planKey === 'advocate' || planKey === 'keep' ? undefined : 14,
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
