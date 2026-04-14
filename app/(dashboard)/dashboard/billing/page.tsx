import { redirect } from 'next/navigation';
import { getProfile } from '@/lib/auth';
import { getStripeClient } from '@/lib/stripe';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { stripePrices, hasAdvocatePrices } from '@/lib/stripe-prices';

export default async function BillingPage() {
  const { user, profile, isPro, hasAdvocateAccess } = await getProfile();
  if (!user) redirect('/login');

  const isLegacyPro = profile?.subscription_status === 'pro' && !hasAdvocateAccess;

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
      {isLegacyPro ? (
        <Card>
          <CardHeader>
            <CardTitle>Legacy Pro</CardTitle>
            <CardDescription>
              You are on the earlier Pro plan. Advocate Plan now includes insurance support and financial navigation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">You have an active legacy Pro subscription.</p>
            {portalUrl && (
              <Button asChild>
                <a href={portalUrl}>Manage subscription</a>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Advocate Plan</CardTitle>
          <CardDescription>
            Insurance denial defense, live financial aid tracking, and NCCN-aligned advocate sheets for caregivers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasAdvocateAccess ? (
            <>
              <p className="text-sm text-slate-600">You have Advocate-level access.</p>
              {portalUrl && (
                <Button asChild>
                  <a href={portalUrl}>Manage subscription</a>
                </Button>
              )}
            </>
          ) : hasAdvocatePrices ? (
            <div className="space-y-3">
              {stripePrices.advocateMonthly && (
                <form action="/api/checkout" method="POST">
                  <input type="hidden" name="plan" value="advocate" />
                  <input type="hidden" name="billingInterval" value="monthly" />
                  <Button type="submit" className="w-full">Advocate Monthly</Button>
                </form>
              )}
              {stripePrices.advocateYearly && (
                <form action="/api/checkout" method="POST">
                  <input type="hidden" name="plan" value="advocate" />
                  <input type="hidden" name="billingInterval" value="yearly" />
                  <Button type="submit" variant="outline" className="w-full">Advocate Yearly</Button>
                </form>
              )}
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-600">
                Set `STRIPE_PRICE_ID_ADVOCATE_MONTHLY` and optionally `STRIPE_PRICE_ID_ADVOCATE_YEARLY` to enable Advocate checkout.
              </p>
              <Button asChild variant="secondary">
                <Link href="/pricing?plan=advocate">View pricing</Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
    </div>
  );
}
