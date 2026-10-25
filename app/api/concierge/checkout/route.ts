import { NextRequest, NextResponse } from 'next/server';
import { getProfile } from '@/lib/auth';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { createOneTimeCheckoutSession } from '@/lib/stripe';
import { weeklyCohortPriceCents } from '@/lib/concierge/config';

export async function POST(request: NextRequest) {
  if (!isFeatureEnabled('concierge_purchase')) {
    return NextResponse.json({ error: 'Concierge purchase is not enabled.' }, { status: 404 });
  }
  const { user } = await getProfile();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  const priceId = process.env.STRIPE_PRICE_ID_CONCIERGE ?? '';
  if (!priceId) return NextResponse.json({ error: 'Concierge price is not configured.' }, { status: 503 });
  const base = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin;
  const shown = String(weeklyCohortPriceCents());
  const session = await createOneTimeCheckoutSession({
    customerEmail: user.email ?? undefined,
    successUrl: `${base}/journey/concierge?checkout=success`,
    cancelUrl: `${base}/concierge`,
    priceId,
    userId: user.id,
    metadata: { price_shown_cents: shown },
  });
  if (session.url) return NextResponse.json({ url: session.url, priceShown: shown });
  return NextResponse.json({ error: 'Unable to start checkout.' }, { status: 500 });
}
