import Link from 'next/link';
import { ArrowRight, FileText, HeartHandshake } from 'lucide-react';
import { FEATURE_HUB_FEATURES } from '@/lib/pricing-config';
import { JOURNEY_POSITIONING, JOURNEY_STAGES } from '@/lib/journey/stages';
import { FEATURE_CATALOG_ICONS } from '@/components/marketing/FeatureCatalogIcons';
import { Button } from '@/components/ui/button';
import { pageMetadata } from '@/lib/seo';
import { FEATURES_STAGE4_LINE, isAfter90FlagOn } from '@/lib/after-90/config';
import { EMPATHY_FILTER_POLICY } from '@/lib/legal/empathy';
import { caseReadyPriceLabel } from '@/lib/ok01';

const STAGE_FEATURE_IDS: Record<(typeof JOURNEY_STAGES)[number]['id'], string[]> = {
  understand: ['cancer_profile', 'complete_the_picture', 'first_72'],
  prepare: ['doctor_prep', 'prep_sheets', 'check_in', 'timeline'],
  fight: ['insurance', 'access_agent'],
  plan: ['second_opinion', 'trials', 'family'],
};

export const metadata = pageMetadata({
  title: 'OncoKind Tools',
  description: JOURNEY_POSITIONING,
  path: '/features',
});

export default function FeaturesHubPage() {
  return (
    <main className="bg-[var(--color-bg-page)] px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-[var(--max-width-full)]">
        <section className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-accent-600)]">
            Product
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-[var(--color-primary-900)] sm:text-5xl">
            Four stages. The tools stay ready when you need them.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-[var(--color-text-secondary)]">
            {JOURNEY_POSITIONING}
          </p>
          <p className="mt-4 text-sm font-medium text-[#0F6E56]">{EMPATHY_FILTER_POLICY.summary}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/signup">Start with Explorer</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/pricing">Compare plans</Link>
            </Button>
          </div>
        </section>

        {JOURNEY_STAGES.map((stage) => {
          const features = FEATURE_HUB_FEATURES.filter((feature) =>
            STAGE_FEATURE_IDS[stage.id].includes(feature.id)
          );
          if (!features.length) return null;
          return (
            <section key={stage.id} className="mt-14">
              <h2 className="font-display text-2xl font-semibold text-[var(--color-primary-900)]">
                {stage.name}
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-[var(--color-text-secondary)]">{stage.summary}</p>
              {stage.id === 'plan' && isAfter90FlagOn('after90Phase') ? (
                <p className="mt-3 max-w-2xl text-sm font-medium text-[#0F6E56]">{FEATURES_STAGE4_LINE}</p>
              ) : null}
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature) => {
                  const Icon = FEATURE_CATALOG_ICONS[feature.id as keyof typeof FEATURE_CATALOG_ICONS] ?? FileText;
                  return (
                    <article
                      key={feature.id}
                      className="flex flex-col rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm"
                    >
                      <Icon className="h-8 w-8 text-[var(--color-primary-700)]" strokeWidth={1.5} aria-hidden />
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-[var(--color-primary-900)]">{feature.name}</h3>
                        <span className="rounded-full bg-[#E1F5EE] px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-[#0F6E56]">
                          {feature.homepage?.tag}
                        </span>
                      </div>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                        {feature.homepage?.desc}
                      </p>
                      <Link
                        href={feature.homepage?.href ?? '/pricing'}
                        className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#0F6E56] hover:text-[#085041]"
                      >
                        Learn more
                        <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      </Link>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}

        <section className="mt-16 rounded-3xl bg-[#1C2B2D] p-8 text-white sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#d4af37]">Have it done for you</p>
          <h2 className="mt-3 font-display text-3xl font-semibold">Concierge</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-200">
            Have it done for you. {caseReadyPriceLabel()} per case. Records gathering, intake packet, and tracking until Case Ready.
          </p>
          <Button asChild className="mt-6 bg-[#d4af37] text-[#1C2B2D] hover:opacity-90">
            <Link href="/concierge">
              <HeartHandshake className="mr-2 h-4 w-4" aria-hidden />
              Start Concierge
            </Link>
          </Button>
        </section>
      </div>
    </main>
  );
}
