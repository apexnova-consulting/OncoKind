import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FileText, Shield } from 'lucide-react';
import { FEATURE_HUB_FEATURES } from '@/lib/pricing-config';
import { FEATURE_CATALOG_ICONS } from '@/components/marketing/FeatureCatalogIcons';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'OncoKind Features',
  description:
    'Explore the full OncoKind toolkit: Cancer Profile, First 72 Hours, Doctor Prep Sheets, trial matching, insurance defense, Family tree, Empathy Filter, and more.',
};

export default function FeaturesHubPage() {
  return (
    <main className="bg-[var(--color-bg-page)] px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-[var(--max-width-full)]">
        <section className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-accent-600)]">
            Product
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-[var(--color-primary-900)] sm:text-5xl">
            Every tool, built for the family beside the patient.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-[var(--color-text-secondary)]">
            Start with the Cancer Profile and First 72 Hours checklist. Then use the rest of the
            toolkit as appointments, trials, insurance, and family conversations come up.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/signup">Get Started Free</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/pricing">Compare plans</Link>
            </Button>
          </div>
        </section>

        <section className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURE_HUB_FEATURES.map((feature) => {
            const Icon = FEATURE_CATALOG_ICONS[feature.id as keyof typeof FEATURE_CATALOG_ICONS] ?? FileText;
            return (
              <article
                key={feature.id}
                className="flex flex-col rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm"
              >
                <Icon className="h-8 w-8 text-[var(--color-primary-700)]" strokeWidth={1.5} aria-hidden />
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold text-[var(--color-primary-900)]">{feature.name}</h2>
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
        </section>

        <section className="mt-10 rounded-2xl bg-[var(--color-primary-900)] p-8 text-white sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[#9FE1CB]">
                <Shield className="h-4 w-4" aria-hidden />
                Professional
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold">KindAuth for care teams</h2>
              <p className="mt-3 text-base leading-relaxed text-white/80">
                Draft prior authorization requests, step-therapy exceptions, and continued-stay
                letters. KindAuth is included on the Professional plan.
              </p>
            </div>
            <Button asChild className="shrink-0">
              <Link href="/professional">
                Explore Professional
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
