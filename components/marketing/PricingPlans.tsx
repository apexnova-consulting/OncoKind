'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type BillingInterval = 'monthly' | 'yearly';

type PriceOption = {
  amount: string;
  cadenceLabel: string;
  configured: boolean;
};

type PlanPricing = {
  monthly: PriceOption;
  yearly: PriceOption;
};

type Props = {
  isSignedIn: boolean;
  advocatePricing: PlanPricing;
  enterpriseUnlimitedPriceId?: string;
  enterprisePerSeatPriceId?: string;
  highlightAdvocate?: boolean;
};

const FREE_FEATURES = [
  'Diagnosis explanation',
  'Basic care map',
  '1 report per month',
];

const ADVOCATE_FEATURES = [
  'Everything in Free',
  'Insurance Denial Defense: AI-powered decode of denial letters and automated appeal generation.',
  'Live Financial Aid Tracker: Real-time matching with active grants and foundation funding.',
  'NCCN-Aligned Advocate Sheets: Advanced doctor prep sheets based on latest oncology standards.',
  'Clinical trial matching and care timeline support.',
  'Unlimited reports and document workflows.',
];

const PROFESSIONAL_FEATURES = [
  'Everything in Advocate Plan',
  'Branded portal (white-label subdomain)',
  'HIPAA BAA acknowledgment flow',
  'Batch report queue + status tracking',
  'Exportable patient roster + prep completion flags',
  'Dedicated support channel (email/Slack placeholder)',
];

function CheckoutForm({
  plan,
  billingInterval,
  cta,
  variant,
  className,
}: {
  plan: 'pro' | 'advocate';
  billingInterval: BillingInterval;
  cta: string;
  variant?: 'default' | 'outline';
  className?: string;
}) {
  return (
    <form action="/api/checkout" method="POST">
      <input type="hidden" name="plan" value={plan} />
      <input type="hidden" name="billingInterval" value={billingInterval} />
      <Button type="submit" variant={variant} className={cn('w-full', className)}>
        {cta}
      </Button>
    </form>
  );
}

export function PricingPlans({
  isSignedIn,
  advocatePricing,
  enterpriseUnlimitedPriceId,
  enterprisePerSeatPriceId,
  highlightAdvocate = false,
}: Props) {
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('monthly');

  const advocateActivePrice = advocatePricing[billingInterval];

  const yearlySavingsLabel = useMemo(() => {
    if (!advocatePricing.monthly.configured || !advocatePricing.yearly.configured) return null;
    return 'Save with annual billing';
  }, [advocatePricing.monthly.configured, advocatePricing.yearly.configured]);

  return (
    <>
      <div className="mt-8 flex justify-center">
        <div className="inline-flex items-center rounded-full border border-[var(--color-border-subtle)] bg-white p-1 shadow-[var(--shadow-sm)]">
          <button
            type="button"
            onClick={() => setBillingInterval('monthly')}
            className={cn(
              'rounded-full px-5 py-2 text-sm font-semibold transition-colors',
              billingInterval === 'monthly'
                ? 'bg-[var(--color-primary-900)] text-[var(--color-text-inverse)]'
                : 'text-[var(--color-text-secondary)]'
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingInterval('yearly')}
            className={cn(
              'rounded-full px-5 py-2 text-sm font-semibold transition-colors',
              billingInterval === 'yearly'
                ? 'bg-[var(--color-primary-900)] text-[var(--color-text-inverse)]'
                : 'text-[var(--color-text-secondary)]'
            )}
          >
            Yearly
          </button>
        </div>
      </div>

      {billingInterval === 'yearly' && yearlySavingsLabel ? (
        <p className="mt-3 text-center text-sm font-medium text-[var(--color-accent-600)]">
          {yearlySavingsLabel}
        </p>
      ) : null}

      <div className="mt-16 grid items-stretch gap-8 lg:grid-cols-3 lg:gap-6">
        <div className="hover-lift-card flex h-full flex-col rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-white p-8 shadow-[var(--shadow-md)]">
          <span className="inline-flex w-fit rounded-full bg-[var(--color-surface-200)] px-3 py-1 text-xs font-bold uppercase tracking-[var(--tracking-widest)] text-[var(--color-primary-700)]">
            For First Steps
          </span>
          <h2 className="mt-4 font-display text-xl font-semibold text-[var(--color-primary-900)]">Free</h2>
          <p className="mt-2 text-sm font-medium text-[var(--color-primary-700)]">Try OncoKind</p>
          <p className="mt-6 font-display text-4xl font-semibold text-[var(--color-primary-900)]">$0</p>
          <p className="text-sm text-[var(--color-text-muted)]">forever</p>
          <ul className="mt-8 flex-1 space-y-3">
            {FREE_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm text-[var(--color-text-secondary)]">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-sage-500)]" aria-hidden />
                {feature}
              </li>
            ))}
          </ul>
          <Button asChild variant="outline" className="mt-8 w-full">
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>

        <div
          id="advocate"
          className={cn(
            'relative flex h-full flex-col rounded-[var(--radius-xl)] border-t-[3px] border-t-[var(--color-accent-400)] bg-[var(--color-primary-900)] p-8 text-[var(--color-text-inverse)] shadow-[0_0_60px_rgba(232,168,56,0.15)] lg:-mt-4 lg:mb-4 lg:scale-[1.04]',
            highlightAdvocate && 'ring-4 ring-[var(--color-accent-300)] ring-offset-4 ring-offset-[var(--color-bg-page)]'
          )}
        >
          <span className="absolute -right-1 top-4 rotate-3 rounded-full bg-[var(--color-accent-400)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--color-primary-900)]">
            Most Popular
          </span>
          <span className="inline-flex w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[var(--tracking-widest)] text-[var(--color-accent-400)]">
            For Caregivers
          </span>
          <h2 className="mt-4 font-display text-xl font-semibold">Advocate Plan</h2>
          <p className="mt-2 text-base font-medium text-[var(--color-surface-200)]">
            Insurance defense, financial navigation, and advanced oncology prep in one plan.
          </p>
          <p className="mt-6 font-display text-4xl font-semibold sm:text-5xl">{advocateActivePrice.amount}</p>
          <p className="text-sm text-[var(--color-surface-400)]">{advocateActivePrice.cadenceLabel}</p>
          <ul className="mt-8 flex-1 space-y-3">
            {ADVOCATE_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm text-[var(--color-surface-200)]">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent-400)]" aria-hidden />
                {feature}
              </li>
            ))}
          </ul>
          {isSignedIn ? (
            advocateActivePrice.configured ? (
              <div className="mt-8 space-y-3">
                <CheckoutForm
                  plan="advocate"
                  billingInterval={billingInterval}
                  cta={`Start Advocate ${billingInterval === 'monthly' ? 'Monthly' : 'Yearly'}`}
                />
              </div>
            ) : (
              <Button asChild className="mt-8 w-full">
                <Link href="/dashboard/billing">Manage in Dashboard</Link>
              </Button>
            )
          ) : (
            <Button asChild className="mt-8 w-full">
              <Link href="/signup">Get Started → Upgrade</Link>
            </Button>
          )}
        </div>

        <div
          id="enterprise"
          className="hover-lift-card flex h-full scroll-mt-24 flex-col rounded-[var(--radius-xl)] border-[1.5px] border-[var(--color-primary-800)] bg-white p-8 shadow-[var(--shadow-md)]"
        >
          <span className="inline-flex w-fit rounded-full border border-[var(--color-primary-300)] bg-[var(--color-surface-200)] px-3 py-1 text-[var(--text-xs)] font-bold uppercase tracking-[var(--tracking-widest)] text-[var(--color-primary-800)]">
            For Care Teams
          </span>
          <h2 className="mt-4 font-display text-xl font-semibold text-[var(--color-primary-900)]">
            Professional
          </h2>
          <p className="mt-2 text-base font-medium text-[var(--color-primary-700)]">
            For care teams and concierge health services.
          </p>
          <p className="mt-6 font-display text-4xl font-semibold text-[var(--color-primary-900)]">$999</p>
          <p className="text-sm text-[var(--color-text-muted)]">/month</p>
          <ul className="mt-8 flex-1 space-y-3">
            {PROFESSIONAL_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm text-[var(--color-text-secondary)]">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-sage-500)]" aria-hidden />
                {feature}
              </li>
            ))}
          </ul>
          {isSignedIn && (enterpriseUnlimitedPriceId || enterprisePerSeatPriceId) ? (
            <div className="mt-8 space-y-3">
              {enterpriseUnlimitedPriceId ? (
                <form action="/api/checkout" method="POST">
                  <input type="hidden" name="priceId" value={enterpriseUnlimitedPriceId} />
                  <Button type="submit" variant="outline" className="w-full">
                    Professional — Unlimited
                  </Button>
                </form>
              ) : null}
              {enterprisePerSeatPriceId ? (
                <form action="/api/checkout" method="POST">
                  <input type="hidden" name="priceId" value={enterprisePerSeatPriceId} />
                  <Button type="submit" variant="outline" className="w-full">
                    Professional — Per seat
                  </Button>
                </form>
              ) : null}
            </div>
          ) : (
            <Button asChild variant="outline" className="mt-8 w-full border-[var(--color-primary-800)]">
              <a href="mailto:hello@oncokind.com?subject=Enterprise%20Inquiry">Contact Us</a>
            </Button>
          )}
        </div>
      </div>

    </>
  );
}
