'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PATH_B_PRIVACY_LANGUAGE, PROFESSIONAL_HIPAA_NOTE } from '@/lib/disclosures';
import {
  ADVOCATE_FEATURES,
  ANNUAL_SAVINGS_PERCENT,
  CAREGIVER_FEATURES,
  FREE_FEATURES,
  PLANS,
  PROFESSIONAL_FEATURES,
} from '@/lib/pricing-config';
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
  advocateConfigured,
  professionalConfigured,
}: Props) {
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('yearly');
  const yearlySavingsLabel = useMemo(() => `Save ~${ANNUAL_SAVINGS_PERCENT}%`, []);

  const caregiverPrice =
    billingInterval === 'yearly'
      ? { amount: PLANS.caregiver.yearlyLabel, cadence: PLANS.caregiver.cadenceYearly }
      : { amount: PLANS.caregiver.monthlyLabel, cadence: PLANS.caregiver.cadenceMonthly };
  const advocatePrice =
    billingInterval === 'yearly'
      ? { amount: PLANS.advocate.yearlyLabel, cadence: PLANS.advocate.cadenceYearly }
      : { amount: PLANS.advocate.monthlyLabel, cadence: PLANS.advocate.cadenceMonthly };

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

      <div className="mt-16 grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-4">
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
            {CAREGIVER_FEATURES.map((feature) => (
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
        </div>

        <div className="hover-lift-card flex h-full flex-col rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-white p-7 shadow-[var(--shadow-md)]">
          <span className="inline-flex w-fit rounded-full bg-[#FAEEDA] px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-widest text-[#8b5e2a]">
            {PLANS.advocate.badge}
          </span>
          <h2 className="mt-3 font-display text-xl font-semibold text-[var(--color-text-primary)]">
            {PLANS.advocate.name}
          </h2>
          <p className="mt-5 font-display text-4xl font-semibold text-[var(--color-text-primary)]">
            {advocatePrice.amount}
          </p>
          <p className="text-sm text-[var(--color-text-muted)]">{advocatePrice.cadence}</p>
          <ul className="mt-7 flex-1 space-y-3">
            {ADVOCATE_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm text-[var(--color-text-secondary)]">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-primary)]" aria-hidden />
                {feature}
              </li>
            ))}
          </ul>
          {isSignedIn && advocateConfigured ? (
            <div className="mt-8">
              <CheckoutForm plan="advocate" billingInterval={billingInterval} cta={PLANS.advocate.cta} />
            </div>
          ) : (
            <Button asChild className="mt-8 w-full">
              <Link href={PLANS.advocate.signupHref}>{PLANS.advocate.cta}</Link>
            </Button>
          )}
        </div>

        <div
          id="enterprise"
          className="hover-lift-card flex h-full scroll-mt-24 flex-col rounded-[var(--radius-xl)] border-2 border-[var(--color-primary-800)] bg-white p-7 shadow-[var(--shadow-md)]"
        >
          <span className="inline-flex w-fit rounded-full bg-[var(--color-primary-900)] px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-widest text-white">
            Care Teams
          </span>
          <h2 className="mt-3 font-display text-xl font-semibold text-[var(--color-text-primary)]">
            {PLANS.professional.name}
          </h2>
          <p className="mt-5 font-display text-4xl font-semibold text-[var(--color-text-primary)]">
            {PLANS.professional.monthlyLabel}
          </p>
          <p className="text-sm text-[var(--color-text-muted)]">{PLANS.professional.cadenceMonthly}</p>
          <ul className="mt-7 flex-1 space-y-3">
            {PROFESSIONAL_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm text-[var(--color-text-secondary)]">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-primary)]" aria-hidden />
                {feature}
              </li>
            ))}
          </ul>
          <div className="mt-8 space-y-3">
            {isSignedIn && professionalConfigured ? (
              <CheckoutForm plan="professional" billingInterval="monthly" cta={PLANS.professional.cta} />
            ) : (
              <Button asChild className="w-full">
                <Link href={PLANS.professional.signupHref}>{PLANS.professional.cta}</Link>
              </Button>
            )}
            <Button asChild variant="outline" className="w-full">
              <a
                href="https://calendly.com/oncokind-support"
                target="_blank"
                rel="noreferrer"
                onClick={() => track('demo_booked_click', { plan: 'professional' })}
              >
                Book a Demo
              </a>
            </Button>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-[var(--color-text-muted)]">{PROFESSIONAL_HIPAA_NOTE}</p>
          <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)]">{PATH_B_PRIVACY_LANGUAGE}</p>
        </div>
      </div>

      <section className="mt-10 rounded-[var(--radius-xl)] border border-[var(--color-primary-800)] bg-[var(--color-primary-900)] p-8 text-white shadow-[var(--shadow-md)]">
        <p className="text-[0.7rem] font-bold uppercase tracking-widest text-[var(--brand-gold)]">
          Health Systems and Oncology Networks
        </p>
        <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-semibold">Custom Enterprise Pricing</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/75">
              Streamline prior authorization appeals, custom workflows, and EHR integration (Epic/Cerner) at
              scale.
            </p>
          </div>
          <Button asChild className="shrink-0 bg-[var(--brand-gold)] text-[var(--color-primary-900)] hover:opacity-90">
            <a
              href="https://calendly.com/oncokind-support"
              target="_blank"
              rel="noreferrer"
              onClick={() => track('demo_booked_click', { plan: 'enterprise' })}
            >
              Talk to sales
            </a>
          </Button>
        </div>
      </section>
    </>
  );
}
