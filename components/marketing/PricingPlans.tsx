'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  ANNUAL_SAVINGS_PERCENT,
  CONCIERGE_LIST_PRICE_LABEL,
  FREE_FEATURES,
  PLANS,
  caregiverFeatureList,
} from '@/lib/pricing-config';
import { CONCIERGE_CAREGIVER_GRANT_DAYS } from '@/lib/concierge/config';
import { CAREGIVER_PRO_TRIAL_NOTE } from '@/lib/product-v34';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

type BillingInterval = 'monthly' | 'yearly';

type Props = {
  isSignedIn: boolean;
  caregiverConfigured: boolean;
  advocateConfigured: boolean;
  professionalConfigured: boolean;
};

function CheckoutForm({
  plan,
  billingInterval,
  cta,
  className,
}: {
  plan: 'pro' | 'advocate' | 'professional';
  billingInterval: BillingInterval;
  cta: string;
  className?: string;
}) {
  const href = `/api/checkout?plan=${plan}&billingInterval=${billingInterval}`;
  return (
    <Button asChild className={cn('w-full', className)}>
      <a
        href={href}
        onClick={() => track('checkout_started', { plan })}
      >
        {cta}
      </a>
    </Button>
  );
}

export function PricingPlans({
  isSignedIn,
  caregiverConfigured,
}: Props) {
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('monthly');
  const yearlySavingsLabel = useMemo(() => `Save ~${ANNUAL_SAVINGS_PERCENT}%`, []);

  const caregiverPrice =
    billingInterval === 'yearly'
      ? { amount: PLANS.caregiver.yearlyLabel, cadence: PLANS.caregiver.cadenceYearly }
      : { amount: PLANS.caregiver.monthlyLabel, cadence: PLANS.caregiver.cadenceMonthly };

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
                ? 'bg-[var(--brand-primary)] text-white'
                : 'text-[var(--color-text-secondary)]'
            )}
          >
            Monthly Billing
          </button>
          <button
            type="button"
            onClick={() => setBillingInterval('yearly')}
            className={cn(
              'rounded-full px-5 py-2 text-sm font-semibold transition-colors',
              billingInterval === 'yearly'
                ? 'bg-[var(--brand-primary)] text-white'
                : 'text-[var(--color-text-secondary)]'
            )}
          >
            Annual Billing
            <span className="ml-1.5 rounded-full bg-[#f0f7f5] px-1.5 py-0.5 text-[0.65rem] font-bold text-[var(--brand-primary)]">
              {yearlySavingsLabel}
            </span>
          </button>
        </div>
      </div>
      <p className="mt-3 text-center text-sm font-medium text-[var(--brand-primary)]">
        Yearly billing equals 10 months. {yearlySavingsLabel} versus paying monthly.
      </p>

      <div className="mt-16 grid items-stretch gap-6 md:grid-cols-3">
        <div className="hover-lift-card flex h-full flex-col rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-white p-7 shadow-[var(--shadow-md)]">
          <h2 className="mt-1 font-display text-xl font-semibold text-[var(--color-text-primary)]">
            {PLANS.free.name}
          </h2>
          <p className="mt-5 font-display text-4xl font-semibold text-[var(--color-text-primary)]">$0</p>
          <p className="text-sm text-[var(--color-text-muted)]">forever</p>
          <ul className="mt-7 flex-1 space-y-3">
            {FREE_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm text-[var(--color-text-secondary)]">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-primary)]" aria-hidden />
                {feature}
              </li>
            ))}
          </ul>
          <Button asChild variant="outline" className="mt-8 w-full">
            <Link href="/signup">{PLANS.free.cta}</Link>
          </Button>
        </div>

        <div className="relative flex h-full flex-col rounded-[var(--radius-xl)] border-t-4 border-t-[var(--brand-gold)] bg-[var(--color-primary-900)] p-7 text-white shadow-[0_0_60px_rgba(46,107,94,0.18)]">
          <span className="absolute -right-1 top-4 rotate-3 rounded-full bg-[var(--brand-gold)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--color-primary-900)]">
            {PLANS.caregiver.badge}
          </span>
          <h2 className="mt-3 font-display text-xl font-semibold text-white">{PLANS.caregiver.name}</h2>
          <p className="mt-5 font-display text-4xl font-semibold text-white">{caregiverPrice.amount}</p>
          <p className="text-sm text-white/60">{caregiverPrice.cadence}</p>
          <ul className="mt-7 flex-1 space-y-3">
            {caregiverFeatureList().map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm text-white/80">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-gold)]" aria-hidden />
                {feature}
              </li>
            ))}
          </ul>
          {isSignedIn && caregiverConfigured ? (
            <div className="mt-8">
              <CheckoutForm
                plan="pro"
                billingInterval={billingInterval}
                cta={PLANS.caregiver.cta}
                className="bg-[var(--brand-gold)] text-[var(--color-primary-900)] hover:opacity-90 hover:shadow-none"
              />
            </div>
          ) : (
            <Button asChild className="mt-8 w-full bg-[var(--brand-gold)] text-[var(--color-primary-900)] hover:opacity-90 hover:shadow-none">
              <Link href={PLANS.caregiver.signupHref}>{PLANS.caregiver.cta}</Link>
            </Button>
          )}
          <p className="mt-3 text-xs leading-relaxed text-white/70">{CAREGIVER_PRO_TRIAL_NOTE}</p>
        </div>

        <div className="hover-lift-card flex h-full flex-col rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-white p-7 shadow-[var(--shadow-md)]">
          <h2 className="mt-1 font-display text-xl font-semibold text-[var(--color-text-primary)]">Concierge</h2>
          <p className="mt-5 font-display text-4xl font-semibold text-[var(--color-text-primary)]">
            {CONCIERGE_LIST_PRICE_LABEL}
          </p>
          <p className="text-sm text-[var(--color-text-muted)]">per case</p>
          <ul className="mt-7 flex-1 space-y-3">
            {[
              'Done-for-you records collection and intake submission to Case Ready',
              `Includes ${CONCIERGE_CAREGIVER_GRANT_DAYS} days of Caregiver Pro`,
              'Full refund before we send the first records request',
            ].map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm text-[var(--color-text-secondary)]">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-primary)]" aria-hidden />
                {feature}
              </li>
            ))}
          </ul>
          <Button asChild className="mt-8 w-full">
            <Link href="/concierge">Start Case</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
