import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getStripeClient } from '@/lib/stripe';
import { Check, Minus } from 'lucide-react';
import { hasEnterprisePrices, stripePrices } from '@/lib/stripe-prices';
import { cn } from '@/lib/utils';
import { PricingPlans } from '@/components/marketing/PricingPlans';

export const metadata = {
  title: 'Pricing | OncoKind',
  description: 'Free, Advocate, and Professional plans — simple pricing for caregivers, advocates, and care teams.',
};

const comparisonRows: [string, string, string, string][] = [
  ['Report processing', '1/month', 'Unlimited', 'Unlimited + batch'],
  ['Trial matches', 'Limited', 'Full (50mi)', 'Full + custom'],
  ['Insurance Denial Defense', '—', '✓', '✓'],
  ['Live Financial Aid Tracker', '—', '✓', '✓'],
  ['NCCN-Aligned Advocate Sheets', '—', '✓', '✓'],
  ['Care Timeline', 'Basic', '✓', '✓'],
  ['Doctor Prep Sheet (PDF)', '—', '✓', '✓ Branded'],
  ['Appointment Check-In', '—', '✓', '✓'],
  ['Community Access', 'Read only', '✓', '✓'],
  ['Multi-patient dashboard', '—', '—', '✓'],
  ['Batch document analysis', '—', '—', '✓'],
  ['Branded portal', '—', '—', '✓'],
  ['HIPAA BAA flow', '—', '—', '✓'],
  ['Clinic integrations', '—', '—', '✓'],
  ['Support', 'Community', 'Email', 'Dedicated'],
];

function ComparisonCell({ value }: { value: string }) {
  if (value === '—' || value === '') {
    return <Minus className="mx-auto h-4 w-4 text-[var(--color-text-muted)]" aria-hidden />;
  }
  if (value.includes('✓')) {
    const rest = value.replace(/✓/g, '').trim();
    return (
      <span className="inline-flex items-center justify-center gap-1 font-medium text-[var(--color-accent-600)]">
        <Check className="h-4 w-4 shrink-0" aria-hidden />
        {rest ? <span>{rest}</span> : null}
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

async function getPriceDisplay(priceId: string, fallbackAmount: string, fallbackCadenceLabel: string): Promise<PriceDisplay> {
  if (!priceId) {
    return {
      amount: fallbackAmount,
      cadenceLabel: fallbackCadenceLabel,
      configured: false,
    };
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

    return {
      amount,
      cadenceLabel,
      configured: true,
    };
  } catch {
    return {
      amount: fallbackAmount,
      cadenceLabel: fallbackCadenceLabel,
      configured: true,
    };
  }
}

export default async function PricingPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [advocateMonthly, advocateYearly] = await Promise.all([
    getPriceDisplay(stripePrices.advocateMonthly, '$49', '/month'),
    getPriceDisplay(stripePrices.advocateYearly, '$490', '/year'),
  ]);

  return (
    <main className="bg-[var(--color-bg-page)] px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-[var(--max-width-full)]">
        <div className="text-center">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--color-primary-900)] sm:text-4xl lg:text-5xl">
            Simple,{' '}
            <em className="font-display not-italic text-[var(--color-accent-500)]">Transparent</em> Pricing
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[var(--color-text-secondary)]">
            Start free. Upgrade when you need more. Stripe-secured checkout.
          </p>
          <p className="mt-3 text-sm font-medium tracking-[var(--tracking-wide)] text-[var(--color-text-muted)]">
            Stripe-secured · Cancel anytime · No contracts
          </p>
        </div>
        <PricingPlans
          isSignedIn={!!user}
          advocatePricing={{
            monthly: { ...advocateMonthly, configured: !!stripePrices.advocateMonthly },
            yearly: { ...advocateYearly, configured: !!stripePrices.advocateYearly },
          }}
          enterpriseUnlimitedPriceId={hasEnterprisePrices ? stripePrices.enterpriseUnlimited : undefined}
          enterprisePerSeatPriceId={hasEnterprisePrices ? stripePrices.enterprisePerSeat : undefined}
          highlightAdvocate
        />

        <section className="mt-24" id="comparison">
          <h2 className="text-center font-display text-2xl font-semibold text-[var(--color-primary-900)]">
            Feature Comparison
          </h2>
          <div className="mt-8 overflow-x-auto rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] shadow-[var(--shadow-sm)]">
            <table className="w-full min-w-[600px] border-collapse bg-white text-left text-sm">
              <thead className="sticky top-16 z-20 lg:top-[4.25rem]">
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-200)] shadow-[var(--shadow-sm)]">
                  <th className="px-6 py-4 font-sans font-semibold text-[var(--color-primary-900)]">
                    Feature
                  </th>
                  {(['Free', 'Advocate Plan', 'Professional'] as const).map((h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-center font-sans font-semibold text-[var(--color-primary-900)]"
                    >
                      <span className="inline-block rounded-full bg-white px-3 py-1 text-xs uppercase tracking-[var(--tracking-widest)] text-[var(--color-primary-700)] shadow-sm">
                        {h}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map(([feature, free, pro, prof], row) => (
                  <tr
                    key={feature}
                    className={cn(
                      'border-b border-[var(--color-border-subtle)] transition-colors hover:bg-[var(--color-surface-100)]',
                      row % 2 === 1 && 'bg-[var(--color-surface-100)]/50'
                    )}
                  >
                    <td className="px-6 py-4 font-medium text-[var(--color-primary-900)]">{feature}</td>
                    <td className="px-6 py-4 text-center text-[var(--color-text-secondary)]">
                      <ComparisonCell value={free} />
                    </td>
                    <td className="px-6 py-4 text-center text-[var(--color-text-secondary)]">
                      <ComparisonCell value={pro} />
                    </td>
                    <td className="px-6 py-4 text-center text-[var(--color-text-secondary)]">
                      <ComparisonCell value={prof} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <p className="mt-12 text-center text-sm text-[var(--color-text-muted)]">
          All plans include HIPAA-conscious design, zero raw PHI retention, and Stripe-secured payments.
          Prices may vary by region (Stripe Tax).
        </p>
      </div>
    </main>
  );
}
