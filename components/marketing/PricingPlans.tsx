'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PATH_B_PRIVACY_LANGUAGE, PROFESSIONAL_HIPAA_NOTE, PROFESSIONAL_SECURITY_REVIEW_TEXT } from '@/lib/disclosures';
import { track } from '@/lib/analytics';
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
  carePricing: PlanPricing;
  highlightCare?: boolean;
  showBillingToggle?: boolean;
};

const FREE_FEATURES = [
  '1 report/month — AI Cancer Profile',
  'Basic care map',
  'Empathy Filter on all outputs',
  'Read-only Community Access',
];

const CARE_ADVOCACY_FEATURES = [
  'Everything in Free',
  'Unlimited reports and Doctor Prep Sheets',
  'Clinical Trial Matching and Care Timeline',
  'Insurance Denial Defense',
  'Full KindAuth Pro appeal generation engine',
  'Denial analysis & medical necessity mapping',
  'Automated records & document intake',
  'Unlimited appeal letter exports',
  'Priority email support',
];

const PROFESSIONAL_FEATURES = [
  'Everything in Care & Advocacy Pro',
  'KindAuth Pro for care teams',
  'Multi-patient dashboard',
  'Batch document processing',
  'Branded portal (white-label ready)',
  PROFESSIONAL_SECURITY_REVIEW_TEXT,
  'HIPAA BAA available for qualified organizations',
  'Clinic integrations',
  'Dedicated support channel',
];

function CheckoutForm({
  billingInterval,
  cta,
  className,
}: {
  billingInterval: BillingInterval;
  cta: string;
  className?: string;
}) {
  const href = `/api/checkout?plan=advocate&billingInterval=${billingInterval}`;
  return (
    <Button asChild className={cn('w-full', className)}>
      <a
        href={href}
        onClick={() => track('checkout_started', { plan: 'care_advocacy_pro' })}
      >
        {cta} →
      </a>
    </Button>
  );
}

export function PricingPlans({
  isSignedIn,
  carePricing,
  highlightCare = false,
  showBillingToggle = false,
}: Props) {
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('yearly');
  const activeBillingInterval = showBillingToggle ? billingInterval : 'yearly';
  const careActivePrice = carePricing[activeBillingInterval];

  const yearlySavingsLabel = useMemo(() => 'Save ~20%', []);

  return (
    <>
      {showBillingToggle ? (
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
              Monthly
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
              Annual
              <span className="ml-1.5 rounded-full bg-[#f0f7f5] px-1.5 py-0.5 text-[0.65rem] font-bold text-[var(--brand-primary)]">
                {yearlySavingsLabel}
              </span>
            </button>
          </div>
        </div>
      ) : null}

      {showBillingToggle && activeBillingInterval === 'yearly' ? (
        <p className="mt-3 text-center text-sm font-medium text-[var(--brand-primary)]">
          {yearlySavingsLabel} on annual billing
        </p>
      ) : null}

      <div className="mt-16 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        <div className="hover-lift-card flex h-full flex-col rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-white p-7 shadow-[var(--shadow-md)]">
          <span className="inline-flex w-fit rounded-full bg-[var(--bg-subtle)] px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
            For First Steps
          </span>
          <h2 className="mt-3 font-display text-xl font-semibold text-[var(--color-text-primary)]">Free</h2>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Understand your first report.</p>
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
            <Link href="/signup">Get Started Free</Link>
          </Button>
        </div>

        <div
          id="advocate"
          className={cn(
            'relative flex h-full flex-col rounded-[var(--radius-xl)] border-t-4 border-t-[var(--brand-gold)] bg-[var(--color-primary-900)] p-7 text-white shadow-[0_0_60px_rgba(46,107,94,0.18)]',
            highlightCare && 'ring-4 ring-[var(--brand-primary)] ring-offset-4 ring-offset-[var(--bg-subtle)]',
            'lg:-mt-3 lg:mb-3 lg:scale-[1.04]'
          )}
        >
          <span className="absolute -right-1 top-4 rotate-3 rounded-full bg-[var(--brand-gold)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--color-primary-900)]">
            Best for insurance issues
          </span>
          <span className="inline-flex w-fit rounded-full bg-white/10 px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-widest text-[var(--brand-gold)]">
            For Families Navigating Care
          </span>
          <h2 className="mt-3 font-display text-xl font-semibold text-white">Care &amp; Advocacy Pro</h2>
          <p className="mt-1 text-sm text-white/70">Clarity, appeals, and KindAuth Pro in one plan.</p>
          <p className="mt-5 font-display text-4xl font-semibold text-white sm:text-5xl">
            {careActivePrice.amount}
          </p>
          <p className="text-sm text-white/60">{careActivePrice.cadenceLabel}</p>
          <ul className="mt-7 flex-1 space-y-3">
            {CARE_ADVOCACY_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm text-white/80">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-gold)]" aria-hidden />
                {feature}
              </li>
            ))}
          </ul>
          {isSignedIn ? (
            careActivePrice.configured ? (
              <div className="mt-8">
                <CheckoutForm
                  billingInterval={activeBillingInterval}
                  cta="Start Care & Advocacy Pro"
                  className="bg-[var(--brand-gold)] text-[var(--color-primary-900)] hover:opacity-90 hover:shadow-none"
                />
              </div>
            ) : (
              <Button asChild className="mt-8 w-full bg-[var(--brand-gold)] text-[var(--color-primary-900)] hover:opacity-90 hover:shadow-none">
                <Link href="/dashboard/billing">Manage in Dashboard</Link>
              </Button>
            )
          ) : (
            <Button asChild className="mt-8 w-full bg-[var(--brand-gold)] text-[var(--color-primary-900)] hover:opacity-90 hover:shadow-none">
              <Link href="/signup?plan=advocate">Start Care &amp; Advocacy Pro →</Link>
            </Button>
          )}
        </div>

        <div
          id="enterprise"
          className="hover-lift-card flex h-full scroll-mt-24 flex-col rounded-[var(--radius-xl)] border-2 border-[var(--color-primary-800)] bg-white p-7 shadow-[var(--shadow-md)]"
        >
          <span className="inline-flex w-fit rounded-full bg-[var(--color-primary-900)] px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-widest text-white">
            For Care Teams
          </span>
          <h2 className="mt-3 font-display text-xl font-semibold text-[var(--color-text-primary)]">
            Professional
          </h2>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            KindAuth Pro for facilities and navigation teams.
          </p>
          <p className="mt-5 font-display text-4xl font-semibold text-[var(--color-text-primary)]">$999</p>
          <p className="text-sm text-[var(--color-text-muted)]">/month</p>
          <ul className="mt-7 flex-1 space-y-3">
            {PROFESSIONAL_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm text-[var(--color-text-secondary)]">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-primary)]" aria-hidden />
                {feature}
              </li>
            ))}
          </ul>
          <Button asChild variant="outline" className="mt-8 w-full">
            <a
              href="https://calendly.com/oncokind-support"
              target="_blank"
              rel="noreferrer"
              onClick={() => track('demo_booked_click', { plan: 'professional' })}
            >
              Book a Demo →
            </a>
          </Button>
          <p className="mt-4 text-xs leading-relaxed text-[var(--color-text-muted)]">
            {PROFESSIONAL_HIPAA_NOTE}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
            {PATH_B_PRIVACY_LANGUAGE}
          </p>
        </div>
      </div>
    </>
  );
}
