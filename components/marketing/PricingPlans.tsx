'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PATH_B_PRIVACY_LANGUAGE, PROFESSIONAL_HIPAA_NOTE, PROFESSIONAL_SECURITY_REVIEW_TEXT } from '@/lib/disclosures';
import { ANNUAL_SAVINGS_PERCENT } from '@/lib/stripe-prices';
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
  professionalConfigured?: boolean;
  highlightCare?: boolean;
  showBillingToggle?: boolean;
};

const FREE_FEATURES = [
  '1 total scan trial — AI Cancer Profile',
  'Basic care map',
  'Empathy Filter Engine',
  'Community Access',
];

const CARE_ADVOCACY_FEATURES = [
  'Unlimited patient scans',
  'Doctor Prep Sheets (PDF)',
  'Clinical Trial Matching',
  'Standard KindAuth appeals (single-patient)',
  'Insurance Denial Defense',
  'Care Timeline and appointment prep',
  'Priority email support',
];

const PROFESSIONAL_FEATURES = [
  'Everything in Care & Advocacy Pro',
  'KindAuth Pro engine (multi-patient)',
  'Multi-patient dashboard',
  'Batch document analysis',
  'Co-branded Doctor Prep Sheets',
  PROFESSIONAL_SECURITY_REVIEW_TEXT,
  'Standard HIPAA BAA',
  'Dedicated support channel',
];

function CheckoutForm({
  plan,
  billingInterval,
  cta,
  className,
}: {
  plan: 'advocate' | 'professional';
  billingInterval: BillingInterval;
  cta: string;
  className?: string;
}) {
  const href = `/api/checkout?plan=${plan}&billingInterval=${billingInterval}`;
  return (
    <Button asChild className={cn('w-full', className)}>
      <a
        href={href}
        onClick={() =>
          track('checkout_started', {
            plan: plan === 'professional' ? 'professional' : 'care_advocacy_pro',
          })
        }
      >
        {cta} →
      </a>
    </Button>
  );
}

export function PricingPlans({
  isSignedIn,
  carePricing,
  professionalConfigured = false,
  highlightCare = false,
  showBillingToggle = false,
}: Props) {
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('yearly');
  const activeBillingInterval = showBillingToggle ? billingInterval : 'yearly';
  const careActivePrice = carePricing[activeBillingInterval];
  const yearlySavingsLabel = useMemo(() => `Save ~${ANNUAL_SAVINGS_PERCENT}%`, []);

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
      ) : null}

      {showBillingToggle && activeBillingInterval === 'yearly' ? (
        <p className="mt-3 text-center text-sm font-medium text-[var(--brand-primary)]">
          {yearlySavingsLabel} versus monthly billing
        </p>
      ) : null}

      <div className="mt-16 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        <div className="hover-lift-card flex h-full flex-col rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-white p-7 shadow-[var(--shadow-md)]">
          <span className="inline-flex w-fit rounded-full bg-[var(--bg-subtle)] px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
            Diagnostic Clarity
          </span>
          <h2 className="mt-3 font-display text-xl font-semibold text-[var(--color-text-primary)]">Free</h2>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            First steps — one pathology scan without recurring abuse.
          </p>
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
            Most Popular for Families
          </span>
          <span className="inline-flex w-fit rounded-full bg-white/10 px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-widest text-[var(--brand-gold)]">
            For Families Under Active Care
          </span>
          <h2 className="mt-3 font-display text-xl font-semibold text-white">Care &amp; Advocacy Pro</h2>
          <p className="mt-1 text-sm text-white/70">Full navigation suite plus standard KindAuth appeals.</p>
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
                  plan="advocate"
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
            Care Teams &amp; Clinics
          </span>
          <h2 className="mt-3 font-display text-xl font-semibold text-[var(--color-text-primary)]">
            Professional
          </h2>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            KindAuth Pro for advocates, navigators, and outpatient clinics.
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
          {isSignedIn && professionalConfigured ? (
            <div className="mt-8 space-y-3">
              <CheckoutForm plan="professional" billingInterval="monthly" cta="Start Professional" />
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
          ) : (
            <div className="mt-8 space-y-3">
              <Button asChild className="w-full">
                <Link href="/signup?plan=professional">Start Professional →</Link>
              </Button>
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
          )}
          <p className="mt-4 text-xs leading-relaxed text-[var(--color-text-muted)]">
            {PROFESSIONAL_HIPAA_NOTE}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
            {PATH_B_PRIVACY_LANGUAGE}
          </p>
        </div>
      </div>

      <section className="mt-10 rounded-[var(--radius-xl)] border border-[var(--color-primary-800)] bg-[var(--color-primary-900)] p-8 text-white shadow-[var(--shadow-md)]">
        <p className="text-[0.7rem] font-bold uppercase tracking-widest text-[var(--brand-gold)]">
          Health Systems &amp; Oncology Networks
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
              Talk to sales →
            </a>
          </Button>
        </div>
      </section>
    </>
  );
}
