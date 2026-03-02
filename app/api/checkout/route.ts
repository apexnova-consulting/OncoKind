import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { createCheckoutSession } from '@/lib/stripe';

const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID;

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!STRIPE_PRICE_ID) {
    return NextResponse.json({ error: 'Checkout not configured' }, { status: 503 });
  }

  const formData = await request.formData().catch(() => new FormData());
  const priceId = (formData.get('priceId') as string) || STRIPE_PRICE_ID;
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
