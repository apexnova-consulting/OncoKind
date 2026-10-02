'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { parseSignupPlan, SIGNUP_PLANS } from '@/lib/plans';
import { captureUtmFromLocation, identifyAnalyticsUser, track } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function SignupForm() {
  const searchParams = useSearchParams();
  const selectedPlan = useMemo(() => parseSignupPlan(searchParams.get('plan')), [searchParams]);
  const planDetails = selectedPlan ? SIGNUP_PLANS[selectedPlan] : null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    captureUtmFromLocation();
    track('signup_started', { plan: selectedPlan ?? 'none' });
  }, [selectedPlan]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName || undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || 'Sign-up failed. Please try again.');
        setLoading(false);
        return;
      }

      track('signup_completed', { plan: selectedPlan ?? 'none' });
      if (typeof data.userId === 'string') {
        identifyAnalyticsUser(data.userId);
      }

      if (selectedPlan === 'professional') {
        window.location.href = '/api/checkout?plan=professional&billingInterval=monthly';
      } else if (selectedPlan === 'pro' || selectedPlan === 'advocate') {
        router.push(`/pricing?plan=${selectedPlan}`);
      } else {
        router.push('/journey');
      }
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const isNetworkError =
        message === 'Failed to fetch' ||
        message.toLowerCase().includes('network') ||
        (err instanceof TypeError && message.includes('fetch'));
      setError(
        isNetworkError
          ? 'Unable to reach the server. Check your connection and try again.'
          : message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>
            {planDetails
              ? `Create your OncoKind account to start the ${planDetails.name}.`
              : 'Sign up for OncoKind.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {planDetails ? (
            <div
              className="mb-4 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--bg-subtle)] p-3"
              data-selected-plan={selectedPlan}
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--brand-primary)]">
                Selected plan
              </p>
              <p className="mt-1 font-medium text-slate-900">
                {planDetails.name} — {planDetails.priceLabel}
              </p>
            </div>
          ) : null}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="rounded-md bg-red-50 p-2 text-sm text-red-600">{error}</p>
            )}
            <div className="space-y-2">
              <label htmlFor="signup-full-name" className="text-sm font-medium text-slate-700">
                Full name
              </label>
              <Input
                id="signup-full-name"
                type="text"
                placeholder="Full name"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="signup-email" className="text-sm font-medium text-slate-700">
                Email
              </label>
              <Input
                id="signup-email"
                type="email"
                placeholder="Email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="signup-password" className="text-sm font-medium text-slate-700">
                Password
              </label>
              <Input
                id="signup-password"
                type="password"
                placeholder="Password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account…' : 'Sign up'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-600">
            <Link href="/trust" className="text-slate-800 underline underline-offset-4">
              How we protect your data →
            </Link>
          </p>
          <p className="mt-4 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link href="/login" className="text-slate-800 underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[80vh] items-center justify-center px-4">
          <p className="text-sm text-slate-600">Loading signup…</p>
        </main>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
