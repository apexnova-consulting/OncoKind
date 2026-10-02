import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Check, Minus } from 'lucide-react';
import { PATH_B_PRIVACY_LANGUAGE, PROFESSIONAL_HIPAA_NOTE } from '@/lib/disclosures';
import { cn } from '@/lib/utils';
import { PricingPlans } from '@/components/marketing/PricingPlans';
import { hasProfessionalPrice } from '@/lib/stripe-prices';

const PRICING_DESCRIPTION =
  'Free, Care & Advocacy Pro at $29/month or $199/year, and Professional at $999/month. No credit card required to start.';

export const metadata = {
  title: 'OncoKind Pricing — Start Free, Upgrade When Ready',
  description: PRICING_DESCRIPTION,
  openGraph: {
    title: 'OncoKind Pricing — Start Free, Upgrade When Ready',
    description: PRICING_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OncoKind Pricing — Start Free, Upgrade When Ready',
    description: PRICING_DESCRIPTION,
  },
};

const comparisonRows: [string, string, string, string, string][] = [
  ['Report processing', '1 total scan', 'Unlimited', 'Batch intake', 'EHR auto-sync'],
  ['AI Cancer Profile & Care Map', '✓ Basic', '✓ Full', '✓ Advanced', '✓ Custom UI'],
  ['Doctor Prep Sheets (PDF)', '—', '✓ Standard', '✓ Co-branded', '✓ Clinic template'],
  ['KindAuth insurance appeals', '—', '✓ Self-serve', '✓ Multi-patient', '✓ Automated rules'],
  ['Multi-patient admin panel', '—', '—', '✓', '✓'],
  ['HIPAA BAA & SLA', '—', '—', '✓ Standard BAA', '✓ Dedicated SLA'],
  ['Clinical Trial Matching', 'Limited', '✓', '✓', '✓ Custom'],
  ['Community Access', 'Read only', '✓', '✓', '✓'],
  ['Support', 'Community', 'Priority email', 'Dedicated', 'Named CSM'],
];

function ComparisonCell({ value }: { value: string }) {
  if (value === '—' || value === '') {
    return (
      <span className="inline-flex items-center justify-center">
        <Minus className="h-4 w-4 text-[var(--color-text-muted)]" aria-hidden />
        <span className="sr-only">Not included</span>
      </span>
    );
  }
  if (value.includes('✓')) {
    const rest = value.replace(/✓/g, '').trim();
    return (
      <span className="inline-flex items-center justify-center gap-1 font-medium text-[var(--brand-primary)]">
        <Check className="h-4 w-4 shrink-0" aria-hidden />
        <span className="sr-only">Included</span>
        {rest ? <span className="text-[var(--color-text-secondary)]">{rest}</span> : null}
      </span>
    );
  }
  return <>{value}</>;
}

const TIER_HEADERS = ['Free Trial', 'Care & Advocacy Pro', 'Professional', 'Enterprise'] as const;

const CARE_DISPLAY_PRICING = {
  monthly: { amount: '$29', cadenceLabel: '/month', configured: true },
  yearly: { amount: '$199', cadenceLabel: '/year', configured: true },
};

export default async function PricingPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="bg-[var(--bg-base)] px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-[var(--max-width-full)]">
        <div className="text-center">
          <p className="eyebrow">Simple, transparent pricing</p>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-4xl lg:text-5xl">
            Simple, transparent pricing for the hardest journey.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--color-text-secondary)]">
            Clear, compassionate support for families — backed by enterprise-grade advocacy tools for
            oncology care teams.
          </p>
          <p className="mt-2 text-sm font-medium text-[var(--color-text-muted)]">
            No surprise billing · Cancel anytime · No contracts
          </p>
        </div>

        <PricingPlans
          isSignedIn={!!user}
          carePricing={CARE_DISPLAY_PRICING}
          professionalConfigured={hasProfessionalPrice}
          highlightCare
          showBillingToggle
        />

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

        <section className="mt-20" id="comparison">
          <h2 className="text-center font-display text-2xl font-semibold text-[var(--color-text-primary)]">
            Feature entitlement matrix
          </h2>
          <div className="mt-8 overflow-x-auto rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] shadow-[var(--shadow-sm)]">
            <table className="w-full min-w-[720px] border-collapse bg-white text-left text-sm">
              <thead className="sticky top-16 z-20 lg:top-[4.25rem]">
                <tr className="border-b border-[var(--color-border)] bg-[var(--bg-subtle)] shadow-[var(--shadow-sm)]">
                  <th className="px-5 py-4 font-sans font-semibold text-[var(--color-text-primary)]">
                    Platform feature
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
                {comparisonRows.map(([feature, free, care, prof, enterprise], row) => (
                  <tr
                    key={feature}
                    className={cn(
                      'border-b border-[var(--color-border-subtle)] transition-colors hover:bg-[var(--bg-subtle)]',
                      row % 2 === 1 && 'bg-[var(--bg-subtle)]/50'
                    )}
                  >
                    <th scope="row" className="px-5 py-3.5 font-medium text-[var(--color-text-primary)]">
                      {feature}
                    </th>
                    <td className="px-5 py-3.5 text-center text-[var(--color-text-secondary)]">
                      <ComparisonCell value={free} />
                    </td>
                    <td className="px-5 py-3.5 text-center text-[var(--color-text-secondary)]">
                      <ComparisonCell value={care} />
                    </td>
                    <td className="px-5 py-3.5 text-center text-[var(--color-text-secondary)]">
                      <ComparisonCell value={prof} />
                    </td>
                    <td className="px-5 py-3.5 text-center text-[var(--color-text-secondary)]">
                      <ComparisonCell value={enterprise} />
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
