import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Button } from '@/components/ui/button';
import { Check, Minus } from 'lucide-react';
import { stripePrices, hasProPrices, hasEnterprisePrices } from '@/lib/stripe-prices';
import { cn } from '@/lib/utils';

export const metadata = {
  title: 'Pricing | OncoKind',
  description: 'Free, Pro, and Enterprise plans — simple pricing for families and professional advocates.',
};

const FREE_FEATURES = [
  'Diagnosis explanation',
  'Basic care map',
  '1 report per month',
];

const CAREGIVER_PRO_FEATURES = [
  'Everything in Free',
  'AI Care Navigator',
  'Clinical trial matching',
  'Care timeline',
  'Unlimited reports',
  'Doctor Prep Sheet',
];

const PROFESSIONAL_FEATURES = [
  'Everything in Caregiver Pro',
  'Branded portal (white-label subdomain)',
  'HIPAA BAA acknowledgment flow',
  'Batch report queue + status tracking',
  'Exportable patient roster + prep completion flags',
  'Dedicated support channel (email/Slack placeholder)',
];

const comparisonRows: [string, string, string, string][] = [
  ['Report processing', '1/month', 'Unlimited', 'Unlimited + batch'],
  ['Trial matches', 'Limited', 'Full (50mi)', 'Full + custom'],
  ['Doctor Prep PDF', '—', '✓', '✓ Branded'],
  ['Multi-patient', '—', '—', '✓'],
  ['Branded portal', '—', '—', '✓'],
  ['HIPAA BAA onboarding', '—', '—', '✓'],
  ['Roster export + prep flags', '—', '—', '✓'],
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

export default async function PricingPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

        <div className="mt-16 grid items-stretch gap-8 lg:grid-cols-3 lg:gap-6">
          {/* Free */}
          <div className="hover-lift-card flex h-full flex-col rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-white p-8 shadow-[var(--shadow-md)]">
            <h2 className="font-display text-xl font-semibold text-[var(--color-primary-900)]">Free</h2>
            <p className="mt-2 text-[var(--color-text-secondary)]">Try OncoKind</p>
            <p className="mt-6 font-display text-4xl font-semibold text-[var(--color-primary-900)]">$0</p>
            <p className="text-sm text-[var(--color-text-muted)]">forever</p>
            <ul className="mt-8 flex-1 space-y-3">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-[var(--color-text-secondary)]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-sage-500)]" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" className="mt-8 w-full">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>

          {/* Caregiver Pro */}
          <div className="relative flex h-full flex-col rounded-[var(--radius-xl)] border-t-[3px] border-t-[var(--color-accent-400)] bg-[var(--color-primary-900)] p-8 text-[var(--color-text-inverse)] shadow-[0_0_60px_rgba(232,168,56,0.15)] lg:-mt-4 lg:mb-4 lg:scale-[1.04]">
            <span className="absolute -right-1 top-4 rotate-3 rounded-full bg-[var(--color-accent-400)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--color-primary-900)]">
              Most Popular
            </span>
            <h2 className="font-display text-xl font-semibold">Caregiver Pro</h2>
            <p className="mt-2 text-sm text-[var(--color-surface-300)]">For families</p>
            <p className="mt-6 font-display text-4xl font-semibold sm:text-5xl">$19</p>
            <p className="text-sm text-[var(--color-surface-400)]">/month</p>
            <ul className="mt-8 flex-1 space-y-3">
              {CAREGIVER_PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-[var(--color-surface-200)]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent-400)]" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
            {user ? (
              hasProPrices ? (
                <div className="mt-8 space-y-3">
                  {stripePrices.proMonthly && (
                    <form action="/api/checkout" method="POST">
                      <input type="hidden" name="priceId" value={stripePrices.proMonthly} />
                      <Button type="submit" className="w-full">
                        Caregiver Pro Monthly
                      </Button>
                    </form>
                  )}
                  {stripePrices.proYearly && (
                    <form action="/api/checkout" method="POST">
                      <input type="hidden" name="priceId" value={stripePrices.proYearly} />
                      <Button type="submit" variant="outline" className="w-full border-[var(--color-text-inverse)] text-[var(--color-text-inverse)] hover:bg-[var(--color-text-inverse)] hover:text-[var(--color-primary-900)]">
                        Caregiver Pro Yearly
                      </Button>
                    </form>
                  )}
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

          {/* Professional */}
          <div
            id="enterprise"
            className="hover-lift-card flex h-full scroll-mt-24 flex-col rounded-[var(--radius-xl)] border-[1.5px] border-[var(--color-primary-800)] bg-white p-8 shadow-[var(--shadow-md)]"
          >
            <span className="inline-flex w-fit rounded-full bg-[var(--color-primary-900)] px-3 py-1 text-[var(--text-xs)] font-bold uppercase tracking-[var(--tracking-widest)] text-[var(--color-text-inverse)]">
              For Care Teams
            </span>
            <h2 className="mt-4 font-display text-xl font-semibold text-[var(--color-primary-900)]">
              Professional
            </h2>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              For Care Teams & Concierge Health Services
            </p>
            <p className="mt-6 font-display text-4xl font-semibold text-[var(--color-primary-900)]">$999</p>
            <p className="text-sm text-[var(--color-text-muted)]">/month</p>
            <ul className="mt-8 flex-1 space-y-3">
              {PROFESSIONAL_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-[var(--color-text-secondary)]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-sage-500)]" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
            {user && hasEnterprisePrices ? (
              <div className="mt-8 space-y-3">
                {stripePrices.enterpriseUnlimited && (
                  <form action="/api/checkout" method="POST">
                    <input type="hidden" name="priceId" value={stripePrices.enterpriseUnlimited} />
                    <Button type="submit" variant="outline" className="w-full">
                      Professional — Unlimited
                    </Button>
                  </form>
                )}
                {stripePrices.enterprisePerSeat && (
                  <form action="/api/checkout" method="POST">
                    <input type="hidden" name="priceId" value={stripePrices.enterprisePerSeat} />
                    <Button type="submit" variant="outline" className="w-full">
                      Professional — Per seat
                    </Button>
                  </form>
                )}
              </div>
            ) : (
              <Button asChild variant="outline" className="mt-8 w-full border-[var(--color-primary-800)]">
                <a href="mailto:hello@oncokind.com?subject=Enterprise%20Inquiry">Contact Us</a>
              </Button>
            )}
          </div>
        </div>

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
                  {(['Free', 'Caregiver Pro', 'Professional'] as const).map((h) => (
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
