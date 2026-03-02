import { redirect } from 'next/navigation';
import { getProfile } from '@/lib/auth';
import { getStripeClient } from '@/lib/stripe';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID;

export default async function BillingPage() {
  const { user, profile, isPro } = await getProfile();
  if (!user) redirect('/login');

  let portalUrl = '';
  if (profile?.stripe_customer_id && isPro) {
    const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    portalUrl = await getStripeClient().billingPortal.sessions
      .create({
        customer: profile.stripe_customer_id as string,
        return_url: `${base}/dashboard`,
      })
      .then((s) => s.url ?? '');
  }

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-2xl font-bold text-slate-900">Billing</h1>
      <Card>
        <CardHeader>
          <CardTitle>Pro</CardTitle>
          <CardDescription>
            Unlock the Doctor Prep Sheet and support OncoKind.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isPro ? (
            <>
              <p className="text-sm text-slate-600">You have an active Pro subscription.</p>
              {portalUrl && (
                <Button asChild>
                  <a href={portalUrl}>Manage subscription</a>
                </Button>
              )}
            </>
          ) : STRIPE_PRICE_ID ? (
            <form action="/api/checkout" method="POST">
              <input type="hidden" name="priceId" value={STRIPE_PRICE_ID} />
              <Button type="submit">Upgrade to Pro</Button>
            </form>
          ) : (
            <>
              <p className="text-sm text-slate-600">
                Set STRIPE_PRICE_ID in your environment to enable checkout.
              </p>
              <Button asChild variant="secondary">
                <Link href="/dashboard">Back to Dashboard</Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
