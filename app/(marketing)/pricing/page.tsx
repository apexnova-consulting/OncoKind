import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getStripeClient } from '@/lib/stripe';
import { Check, Minus } from 'lucide-react';
import { hasEnterprisePrices, stripePrices } from '@/lib/stripe-prices';
import { PATH_B_PRIVACY_LANGUAGE, PROFESSIONAL_HIPAA_NOTE } from '@/lib/disclosures';
import { cn } from '@/lib/utils';
import { PricingPlans } from '@/components/marketing/PricingPlans';

export const metadata = {
  title: 'OncoKind Pricing — Start Free, Upgrade When Ready',
  description:
    'Free, $19/month, $49/month, and $999/month plans for families and care professionals navigating cancer. No credit card required to start.',
  openGraph: {
    title: 'OncoKind Pricing — Start Free, Upgrade When Ready',
    description:
      'Free, $19/month, $49/month, and $999/month plans for families and care professionals navigating cancer. No credit card required to start.',
  },
};

const comparisonRows: [string, string, string, string, string][] = [
  ['Report processing', '1/month', 'Unlimited', 'Unlimited', 'Unlimited + batch'],
  ['AI Cancer Profile', '✓', '✓', '✓', '✓'],
  ['Doctor Prep Sheet (PDF)', '—', '✓', '✓', '✓ Branded'],
  ['Clinical Trial Matching', 'Limited', 'Full (50mi)', 'Full (50mi)', 'Full + custom'],
  ['Care Timeline', 'Basic', '✓', '✓', '✓'],
  ['Second Opinion Mode', '—', '✓', '✓', '✓'],
  ['Appointment Check-In', '—', '✓', '✓', '✓'],
  ['Insurance Denial Defense', '—', '—', '✓', '✓'],
  ['Live Financial Aid Tracker', '—', '—', '✓', '✓'],
  ['NCCN-Aligned Advocate Sheets', '—', '—', '✓', '✓'],
  ['Community Access', 'Read only', '✓', '✓', '✓'],
  ['Multi-patient dashboard', '—', '—', '—', '✓'],
  ['Batch document analysis', '—', '—', '—', '✓'],
  ['Branded portal', '—', '—', '—', '✓'],
  ['HIPAA BAA', '—', '—', '—', '✓'],
  ['Enterprise security review', '—', '—', '—', '✓'],
  ['Prior Auth Engine (KindAuth)', '—', '—', '—', '✓'],
  ['Support', 'Community', 'Email', 'Priority email', 'Dedicated'],
];

function ComparisonCell({ value }: { value: string }) {
  if (value === '—' || value === '') {
    return <Minus className="mx-auto h-4 w-4 text-[var(--color-text-muted)]" aria-hidden />;
  }
  if (value.includes('✓')) {
    const rest = value.replace(/✓/g, '').trim();
    return (
      <span className="inline-flex items-center justify-center gap-1 font-medium text-[var(--brand-primary)]">
        <Check className="h-4 w-4 shrink-0" aria-hidden />
        {rest ? <span className="text-[var(--color-text-secondary)]">{rest}</span> : null}
      </span>
    );
  }
  return <>{value}</>;
}

type PriceDisplay = {
  amount: string;
  cadenceLabel: string;
  configured: boolean;
};

async function getPriceDisplay(
  priceId: string,
  fallbackAmount: string,
  fallbackCadenceLabel: string
): Promise<PriceDisplay> {
  if (!priceId) {
    return { amount: fallbackAmount, cadenceLabel: fallbackCadenceLabel, configured: false };
  }
  try {
    const price = await getStripeClient().prices.retrieve(priceId);
    const amount =
      typeof price.unit_amount === 'number'
        ? new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: price.currency.toUpperCase(),
            maximumFractionDigits: 0,
          }).format(price.unit_amount / 100)
        : fallbackAmount;
    const cadenceLabel =
      price.recurring?.interval === 'year'
        ? '/year'
        : price.recurring?.interval === 'month'
          ? '/month'
          : fallbackCadenceLabel;
    return { amount, cadenceLabel, configured: true };
  } catch {
    return { amount: fallbackAmount, cadenceLabel: fallbackCadenceLabel, configured: true };
  }
}

const TIER_HEADERS = ['Free', 'Caregiver Pro', 'Advocate Plan', 'Professional'] as const;

export default async function PricingPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const showYearlyBilling = true;

  const [proMonthly, proYearly, advocateMonthly, advocateYearly] = await Promise.all([
    getPriceDisplay(stripePrices.proMonthly, '$19', '/month'),
    getPriceDisplay(stripePrices.proYearly, '$190', '/year'),
    getPriceDisplay(stripePrices.advocateMonthly, '$49', '/month'),
    getPriceDisplay(stripePrices.advocateYearly, '$490', '/year'),
  ]);

  return (
    <main className="bg-[var(--bg-base)] px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-[var(--max-width-full)]">

        {/* Header */}
        <div className="text-center">
          <p className="eyebrow">Simple, transparent pricing</p>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-4xl lg:text-5xl">
            Simple pricing for the hardest journey.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[var(--color-text-secondary)]">
            Start free. No credit card. Upgrade only when you&apos;re ready.
          </p>
          <p className="mt-2 text-sm font-medium text-[var(--color-text-muted)]">
            No surprise billing · Cancel anytime · No contracts
          </p>
        </div>

        <PricingPlans
          isSignedIn={!!user}
          proPricing={{
            monthly: { ...proMonthly, configured: !!stripePrices.proMonthly },
            yearly: { ...proYearly, configured: !!stripePrices.proYearly },
          }}
          advocatePricing={{
            monthly: { ...advocateMonthly, configured: !!stripePrices.advocateMonthly },
            yearly: { ...advocateYearly, configured: !!stripePrices.advocateYearly },
          }}
          enterpriseUnlimitedPriceId={hasEnterprisePrices ? stripePrices.enterpriseUnlimited : undefined}
          enterprisePerSeatPriceId={hasEnterprisePrices ? stripePrices.enterprisePerSeat : undefined}
          highlightAdvocate
          showBillingToggle={showYearlyBilling}
        />

        {/* FAQ */}
        <section className="mx-auto mt-20 max-w-3xl" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-center font-display text-2xl font-semibold text-[var(--color-text-primary)]">
            Common questions
          </h2>
          <div className="mt-8 space-y-6">
            {[
              {
                q: 'Is my loved one\'s medical report stored on OncoKind\'s servers?',
                a: 'No. OncoKind processes your report to generate the Cancer Profile and Doctor Prep Sheet, but we do not retain raw report data after processing. Your privacy is a design principle, not an afterthought.',
              },
              {
                q: 'Is OncoKind giving medical advice?',
                a: 'No. OncoKind is an educational preparation tool. We help you understand your report and prepare questions for your oncologist. Your care team makes all medical decisions. We help you show up ready to participate.',
              },
              {
                q: 'What cancers does OncoKind support?',
                a: 'All of them. Unlike some platforms that focus on specific cancer types, OncoKind is designed to process any pathology report regardless of cancer type — including rare and metastatic diagnoses.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes. No contracts, no cancellation fees. We know your situation may change. Cancel from your account settings at any time.',
              },
              {
                q: 'Is there a discount for financial hardship?',
                a: 'We never want cost to prevent a family from getting help. Email us at support@oncokind.com and we\'ll work with you.',
              },
            ].map(({ q, a }) => (
              <div
                key={q}
                className="rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-white p-6 shadow-[var(--shadow-sm)]"
              >
                <h3 className="font-sans font-semibold text-[var(--color-text-primary)]">{q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison table */}
        <section className="mt-20" id="comparison">
          <h2 className="text-center font-display text-2xl font-semibold text-[var(--color-text-primary)]">
            Full Feature Comparison
          </h2>
          <div className="mt-8 overflow-x-auto rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] shadow-[var(--shadow-sm)]">
            <table className="w-full min-w-[720px] border-collapse bg-white text-left text-sm">
              <thead className="sticky top-16 z-20 lg:top-[4.25rem]">
                <tr className="border-b border-[var(--color-border)] bg-[var(--bg-subtle)] shadow-[var(--shadow-sm)]">
                  <th className="px-5 py-4 font-sans font-semibold text-[var(--color-text-primary)]">
                    Feature
                  </th>
                  {TIER_HEADERS.map((h) => (
                    <th
                      key={h}
                      className="px-5 py-4 text-center font-sans font-semibold text-[var(--color-text-primary)]"
                    >
                      <span className="inline-block rounded-full bg-white px-3 py-1 text-xs uppercase tracking-widest text-[var(--color-text-secondary)] shadow-sm">
                        {h}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map(([feature, free, pro, advocate, prof], row) => (
                  <tr
                    key={feature}
                    className={cn(
                      'border-b border-[var(--color-border-subtle)] transition-colors hover:bg-[var(--bg-subtle)]',
                      row % 2 === 1 && 'bg-[var(--bg-subtle)]/50'
                    )}
                  >
                    <td className="px-5 py-3.5 font-medium text-[var(--color-text-primary)]">{feature}</td>
                    <td className="px-5 py-3.5 text-center text-[var(--color-text-secondary)]">
                      <ComparisonCell value={free} />
                    </td>
                    <td className="px-5 py-3.5 text-center text-[var(--color-text-secondary)]">
                      <ComparisonCell value={pro} />
                    </td>
                    <td className="px-5 py-3.5 text-center text-[var(--color-text-secondary)]">
                      <ComparisonCell value={advocate} />
                    </td>
                    <td className="px-5 py-3.5 text-center text-[var(--color-text-secondary)]">
                      <ComparisonCell value={prof} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <p className="mt-10 text-center text-sm text-[var(--color-text-muted)]">
          {PATH_B_PRIVACY_LANGUAGE} {PROFESSIONAL_HIPAA_NOTE} Prices may vary by region (Stripe Tax).
        </p>
      </div>
    </main>
  );
}
