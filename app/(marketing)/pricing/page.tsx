import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Minus } from 'lucide-react';
import { PATH_B_PRIVACY_LANGUAGE, PROFESSIONAL_HIPAA_NOTE } from '@/lib/disclosures';
import { cn } from '@/lib/utils';
import { PricingPlans } from '@/components/marketing/PricingPlans';
import { hasAdvocatePrices, hasProPrices, hasProfessionalPrice } from '@/lib/stripe-prices';
import { CATALOG_FEATURES, PLANS, PRICING_PAGE, SITE_ORIGIN } from '@/lib/pricing-config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing',
  description: PRICING_PAGE.description,
  alternates: { canonical: `${SITE_ORIGIN}/pricing` },
  openGraph: {
    title: 'OncoKind pricing',
    description: PRICING_PAGE.description,
    url: `${SITE_ORIGIN}/pricing`,
    images: [{ url: `${SITE_ORIGIN}/og-home.png`, width: 1200, height: 630, alt: 'OncoKind pricing' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OncoKind pricing',
    description: PRICING_PAGE.description,
  },
};

function ComparisonCell({ value }: { value: string }) {
  if (value === 'Not included' || value === '') {
    return (
      <span className="inline-flex items-center justify-center">
        <Minus className="h-4 w-4 text-[var(--color-text-muted)]" aria-hidden />
        <span className="sr-only">Not included</span>
      </span>
    );
  }
  return <>{value}</>;
}

const TIER_HEADERS = [PLANS.free.name, PLANS.caregiver.name, PLANS.advocate.name, PLANS.professional.name];

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
            {PRICING_PAGE.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--color-text-secondary)]">
            Clear, compassionate support for families, plus enterprise-grade advocacy tools for oncology care
            teams.
          </p>
          <p className="mt-2 text-sm font-medium text-[var(--color-text-muted)]">
            No surprise billing. Cancel anytime. No contracts.
          </p>
        </div>

        <PricingPlans
          isSignedIn={!!user}
          caregiverConfigured={hasProPrices}
          advocateConfigured={hasAdvocatePrices}
          professionalConfigured={hasProfessionalPrice}
        />

        <section className="mx-auto mt-20 max-w-3xl" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-center font-display text-2xl font-semibold">
            Common questions
          </h2>
          <div className="mt-8 space-y-6">
            {[
              {
                q: "Is my loved one's medical report stored on OncoKind's servers?",
                a: 'No. OncoKind processes your report to generate the Cancer Profile, but we do not retain raw report data after processing.',
              },
              {
                q: 'Is OncoKind giving medical advice?',
                a: 'No. OncoKind is an educational preparation tool. Your care team makes all medical decisions.',
              },
              {
                q: 'What cancers does OncoKind support?',
                a: 'All of them. OncoKind is designed to process any pathology report regardless of cancer type, including rare and metastatic diagnoses.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes. No contracts, no cancellation fees. Cancel from your account settings at any time.',
              },
              {
                q: 'Is there a discount for financial hardship?',
                a: "We never want cost to prevent a family from getting help. Email us at support@oncokind.com and we'll work with you.",
              },
              {
                q: 'Does OncoKind tell me which tests or treatments I need?',
                a: 'No. OncoKind helps you prepare questions for your care team. Your care team decides what is right for you.',
              },
              {
                q: 'Will anyone contact my providers for me?',
                a: 'Only if you review and approve it first. Call for me is invite-only and does not speak patient information.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-white p-6">
                <h3 className="font-semibold">{q}</h3>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{a}</p>
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
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--bg-subtle)]">
                  <th className="px-5 py-4 font-sans font-semibold text-[var(--color-text-primary)]">
                    Platform feature
                  </th>
                  {TIER_HEADERS.map((h) => (
                    <th key={h} className="px-5 py-4 text-center font-sans font-semibold">
                      <span className="inline-block rounded-full bg-white px-3 py-1 text-xs uppercase tracking-widest text-[var(--color-text-secondary)] shadow-sm">
                        {h}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CATALOG_FEATURES.map((feature, row) => (
                  <tr
                    key={feature.id}
                    className={cn(
                      'border-b border-[var(--color-border-subtle)]',
                      row % 2 === 1 && 'bg-[var(--bg-subtle)]/50'
                    )}
                  >
                    <th scope="row" className="px-5 py-3.5 font-medium text-[var(--color-text-primary)]">
                      {feature.name}
                    </th>
                    <td className="px-5 py-3.5 text-center text-[var(--color-text-secondary)]">
                      <ComparisonCell value={feature.cells.free} />
                    </td>
                    <td className="px-5 py-3.5 text-center text-[var(--color-text-secondary)]">
                      <ComparisonCell value={feature.cells.caregiver} />
                    </td>
                    <td className="px-5 py-3.5 text-center text-[var(--color-text-secondary)]">
                      <ComparisonCell value={feature.cells.advocate} />
                    </td>
                    <td className="px-5 py-3.5 text-center text-[var(--color-text-secondary)]">
                      <ComparisonCell value={feature.cells.professional} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-center text-xs text-[var(--color-text-muted)]">
            {PATH_B_PRIVACY_LANGUAGE} {PROFESSIONAL_HIPAA_NOTE}
          </p>
        </section>
      </div>
    </main>
  );
}
