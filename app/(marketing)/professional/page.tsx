import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'OncoKind for Care Navigators & Patient Advocates',
  description:
    'Explore how OncoKind Professional supports patient advocates, care navigators, and clinical teams with shared workflows and guided support.',
};

const useCases = [
  'Independent advocates',
  'Concierge clinics',
  'Care navigation organizations',
  'Support programs and oncology-adjacent teams',
];

export default function ProfessionalPage() {
  return (
    <main className="bg-[var(--color-bg-page)] px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-[var(--max-width-wide)] space-y-10">
        <section className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-md)] sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-accent-600)]">
            Professional
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-[var(--color-primary-900)] sm:text-5xl">
            OncoKind for Care Navigators &amp; Patient Advocates
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
            OncoKind Professional is built for teams who support many patients at once and need a
            more organized way to prepare families, decode complexity, and keep advocacy work moving.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <a href="https://calendly.com/oncokind-support" target="_blank" rel="noreferrer">
                Book a Demo
              </a>
            </Button>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: 'What the Professional tier provides',
              bullets: [
                'Multi-patient workflow support for advocates and care teams',
                'Branded outputs and batch-oriented document review',
                'Insurance denial support and structured caregiver prep tools',
                'Enterprise security review available upon request',
              ],
            },
            {
              title: 'Who it is for',
              bullets: [
                'Independent patient advocates supporting multiple clients',
                'Concierge and navigation teams preparing families for oncology visits',
                'Organizations that need a guided, caregiver-facing education layer',
                'Teams evaluating custom onboarding and compliance requirements',
              ],
            },
          ].map((section) => (
            <article
              key={section.title}
              className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-sm)]"
            >
              <h2 className="font-display text-2xl font-semibold text-[var(--color-primary-900)]">
                {section.title}
              </h2>
              <ul className="mt-5 list-disc space-y-3 pl-5 text-base leading-relaxed text-[var(--color-text-secondary)]">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="rounded-[var(--radius-xl)] bg-[var(--color-surface-100)] p-8 shadow-[var(--shadow-sm)]">
          <h2 className="font-display text-2xl font-semibold text-[var(--color-primary-900)]">
            Common use cases
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {useCases.map((useCase) => (
              <div
                key={useCase}
                className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white px-5 py-6 text-center text-sm font-medium text-[var(--color-primary-800)]"
              >
                {useCase}
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Button asChild>
              <a href="https://calendly.com/oncokind-support" target="_blank" rel="noreferrer">
                Book a Demo
              </a>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
