import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
    _stripe = new Stripe(key, {
      apiVersion: '2025-02-24.acacia',
      typescript: true,
    });
  }
  return _stripe;
}

export async function getStripeCustomerPortalUrl(
  customerId: string,
  returnUrl: string
): Promise<string> {
  const session = await getStripeClient().billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
  return session.url ?? '';
}

export function createCheckoutSession(params: {
  customerId?: string;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
  priceId: string;
  userId?: string;
  planKey?: string;
}) {
  const metadata = {
    ...(params.userId ? { supabase_user_id: params.userId } : {}),
    ...(params.planKey ? { plan_key: params.planKey } : {}),
  };
  return getStripeClient().checkout.sessions.create({
    mode: 'subscription',
    ...(params.customerId ? { customer: params.customerId } : { customer_email: params.customerEmail }),
    line_items: [{ price: params.priceId, quantity: 1 }],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    subscription_data: {
      metadata: Object.keys(metadata).length ? metadata : undefined,
    },
    metadata: Object.keys(metadata).length ? metadata : undefined,
  });
}
