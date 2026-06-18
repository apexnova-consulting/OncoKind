import type { Metadata } from 'next';
import Link from 'next/link';
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

        {/* KindAuth Prior Auth Engine — flagship Professional feature */}
        <section className="rounded-[var(--radius-xl)] bg-[#1C2B2D] p-8 sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#6B8F71]/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#6B8F71]">
                New — Included in Professional
              </p>
              <h2 className="font-display text-3xl font-semibold text-white">
                Prior Auth Engine
              </h2>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-300">
                Stop losing 3 hours per prior authorization. Generate complete prior auth requests,
                step therapy exception letters (with state law citations), and continued stay
                defenses in under 2 minutes — from a dedicated workspace built for Directors of
                Nursing, Social Workers, and Care Coordinators.
              </p>
              <ul className="mt-4 space-y-1.5 text-sm text-slate-300">
                {[
                  'Prior Authorization Request generator',
                  'Step Therapy Exception — cites your state\'s reform law by statute',
                  'Continued Stay / Medical Necessity Defense',
                  'Denial Letter Analyzer — plain-English breakdown + appeal strategy',
                  'Outcome tracking: approved / denied / on appeal',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-0.5 text-[#6B8F71]">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex shrink-0 flex-col gap-3">
              <Button asChild className="bg-[#6B8F71] text-white hover:bg-[#5a7a60]">
                <Link href="/prior-auth-pro">See Full Details →</Link>
              </Button>
              <Button asChild className="border border-slate-600 bg-transparent text-white hover:bg-white/10">
                <a href="https://calendly.com/oncokind-support" target="_blank" rel="noreferrer">
                  Book a Demo
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: 'What the Professional tier provides',
              bullets: [
                'Prior Authorization Engine (KindAuth) — all three document types',
                'Multi-patient workflow support for advocates and care teams',
                'Insurance denial defense and structured appeal packets',
                'Branded outputs and batch-oriented document review',
                'Enterprise security review available upon request',
              ],
            },
            {
              title: 'Who it is for',
              bullets: [
                'Directors of Nursing and Care Coordinators at SNFs and group homes',
                'Independent patient advocates supporting multiple clients',
                'Concierge and navigation teams preparing families for oncology visits',
                'Organizations that need a guided, caregiver-facing education layer',
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
