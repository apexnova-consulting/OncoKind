import { redirect } from 'next/navigation';
import { getProfile } from '@/lib/auth';
import { getStripeClient } from '@/lib/stripe';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { stripePrices, hasProPrices } from '@/lib/stripe-prices';

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
    <div className="mx-auto max-w-6xl px-4 py-6">
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Billing</h1>
      <Card>
        <CardHeader>
          <CardTitle>Pro</CardTitle>
          <CardDescription>
            Unlock the Doctor Prep Sheet and support OncoKind. Choose monthly or yearly.
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
          ) : hasProPrices ? (
            <div className="space-y-3">
              {stripePrices.proMonthly && (
                <form action="/api/checkout" method="POST">
                  <input type="hidden" name="priceId" value={stripePrices.proMonthly} />
                  <Button type="submit" className="w-full">Pro Monthly</Button>
                </form>
              )}
              {stripePrices.proYearly && (
                <form action="/api/checkout" method="POST">
                  <input type="hidden" name="priceId" value={stripePrices.proYearly} />
                  <Button type="submit" variant="outline" className="w-full">Pro Yearly</Button>
                </form>
              )}
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-600">
                Set Stripe price IDs in your environment to enable checkout.
              </p>
              <Button asChild variant="secondary">
                <Link href="/dashboard">Back to Dashboard</Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
    </div>
  );
}
