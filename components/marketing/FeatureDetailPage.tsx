import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MedicalDisclaimer } from '@/components/disclosures/OutputDisclosures';

type ExampleCard = {
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
};

export function FeatureDetailPage({
  headline,
  intro,
  sections,
  example,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
}: {
  headline: string;
  intro: string;
  sections: Array<{ title: string; paragraphs: string[]; bullets?: string[] }>;
  example?: ExampleCard;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
}) {
  return (
    <main className="bg-[var(--color-bg-page)] px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-[var(--max-width-wide)] space-y-10">
        <section className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-md)] sm:p-10">
          <h1 className="font-display text-4xl font-semibold text-[var(--color-primary-900)] sm:text-5xl">
            {headline}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[var(--color-text-secondary)]">{intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href={primaryCtaHref}>{primaryCtaLabel}</Link>
            </Button>
            {secondaryCtaLabel && secondaryCtaHref ? (
              <Button asChild variant="outline">
                <Link href={secondaryCtaHref}>{secondaryCtaLabel}</Link>
              </Button>
            ) : null}
          </div>
        </section>

        {example ? (
          <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-100)] p-8 shadow-[var(--shadow-sm)]">
            <p className="text-sm font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-accent-600)]">
              {example.eyebrow}
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-[var(--color-primary-900)]">
              {example.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-text-secondary)]">{example.body}</p>
            <ul className="mt-5 list-disc space-y-2 pl-5 text-base leading-relaxed text-[var(--color-text-secondary)]">
              {example.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-3">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-sm)]"
            >
              <h2 className="font-display text-2xl font-semibold text-[var(--color-primary-900)]">
                {section.title}
              </h2>
              <div className="mt-4 space-y-4 text-base leading-relaxed text-[var(--color-text-secondary)]">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets?.length ? (
                  <ul className="list-disc space-y-2 pl-5">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-[var(--radius-xl)] bg-[var(--color-primary-900)] p-8 text-white shadow-[var(--shadow-md)]">
          <p className="font-display text-3xl font-semibold">Ready to put this into action?</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href={primaryCtaHref}>{primaryCtaLabel}</Link>
            </Button>
            {secondaryCtaLabel && secondaryCtaHref ? (
              <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-[var(--color-primary-900)]">
                <Link href={secondaryCtaHref}>{secondaryCtaLabel}</Link>
              </Button>
            ) : null}
          </div>
          <MedicalDisclaimer className="mt-6 text-[var(--color-surface-300)]" />
        </section>
      </div>
    </main>
  );
}
