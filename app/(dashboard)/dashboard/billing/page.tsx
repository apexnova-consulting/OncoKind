import { redirect } from 'next/navigation';
import { getProfile } from '@/lib/auth';
import { getStripeClient } from '@/lib/stripe';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default async function BillingPage() {
  const { user, profile, isPro } = await getProfile();
  if (!user) redirect('/login');

  const isLegacyPro = false;

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
      {!isPro && !isLegacyPro && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-700">
            Current plan: <span className="font-semibold">Free plan</span>
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Upgrade to unlock more features including Doctor Prep Sheet, Clinical Trial Matching, and more.
          </p>
          <Link href="/pricing" className="mt-3 inline-block text-sm font-medium text-primary underline underline-offset-4">
            Upgrade your plan
          </Link>
        </div>
      )}
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
          <CardTitle>Paid plans</CardTitle>
          <CardDescription>
            Caregiver Pro is $39/month or $390/year. Advocate Plan is $49/month or $490/year and adds insurance and financial tools.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isPro ? (
            <>
              <p className="text-sm text-slate-600">You have a paid OncoKind plan.</p>
              {portalUrl && (
                <Button asChild>
                  <a href={portalUrl}>Manage subscription</a>
                </Button>
              )}
            </>
          ) : (
            <Button asChild>
              <Link href="/pricing">View pricing</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
    </div>
  );
}
