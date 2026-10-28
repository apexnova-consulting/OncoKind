'use client';

import { Shield, FileText, BedDouble, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TrackedCalendlyLink } from '@/components/analytics/TrackedCalendlyLink';
import { professionalHipaaNote } from '@/lib/disclosures';
import { showIndividualAdvocatePlan, INDIVIDUAL_ADVOCATE_PLAN } from '@/lib/pricing-config';

const IDENTIFIER_COPY =
  "Use your facility's own identifier; do not enter names or dates of birth.";

export function PriorAuthProLanding() {
  return (
    <main className="bg-[var(--color-bg-page)] px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-[var(--max-width-wide)] space-y-10">
        <section className="rounded-[var(--radius-xl)] bg-white p-8 text-center shadow-[var(--shadow-md)] sm:p-10">
          <p className="inline-flex items-center gap-2 rounded-full bg-[#E1F5EE] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#0F6E56]">
            <Shield className="h-3.5 w-3.5" />
            KindAuth, for care facilities
          </p>
          <h1 className="mt-6 font-display text-4xl font-semibold text-[var(--color-primary-900)] sm:text-5xl">
            Stop Losing 3 Hours Per Prior Authorization
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
            For care teams: draft prior authorization requests, step-therapy exception letters with
            state statute citations, and continued-stay appeals.
          </p>
          <div className="mt-8 flex justify-center">
            <Button asChild>
              <TrackedCalendlyLink>Book a Demo</TrackedCalendlyLink>
            </Button>
          </div>
          <p className="mt-4 text-sm text-[var(--color-text-muted)]">
            KindAuth is part of OncoKind Professional, $999/month, set up through a demo and invoice.
          </p>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">{professionalHipaaNote()}</p>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: FileText,
              title: 'Prior Authorization Request',
              body: 'Generate a complete, payer-specific prior auth request from a medication order. Includes clinical justification, medical necessity language, and physician attestation block.',
            },
            {
              icon: Shield,
              title: 'Step Therapy Exception',
              body: 'Have you tried other meds? We cite your state step therapy reform law by statute, document previous drug failures, and assert your patient legal right to skip the step requirement.',
            },
            {
              icon: BedDouble,
              title: 'Continued Stay Defense',
              body: 'Fight premature discharge reviews with medical necessity language. Document functional status, care goals, and discharge barriers that reviewers respond to.',
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.title} className="rounded-[var(--radius-xl)] border bg-white p-6 shadow-sm">
                <Icon className="h-8 w-8 text-[#0F6E56]" />
                <h2 className="mt-4 font-semibold text-[var(--color-primary-900)]">{card.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">{card.body}</p>
              </article>
            );
          })}
        </section>

        <section className="rounded-[var(--radius-xl)] bg-white p-8 shadow-sm">
          <h2 className="font-display text-3xl font-semibold text-[var(--color-primary-900)]">
            From denial to letter in under 2 minutes
          </h2>
          <ol className="mt-8 space-y-6">
            {[
              {
                step: '1',
                title: 'Enter the case details',
                body: `${IDENTIFIER_COPY} Add payer, medication, and diagnosis code. Takes about 60 seconds.`,
              },
              {
                step: '2',
                title: 'Add your evidence',
                body: 'For step therapy: document which drugs the patient already tried and why they failed. For continued stay: describe current functional status and care goals.',
              },
              {
                step: '3',
                title: 'Generate the document',
                body: 'The AI produces a complete submission document with the correct regulatory language for your payer and state.',
              },
              {
                step: '4',
                title: 'Review, sign, and submit',
                body: 'Fill in any bracketed placeholders, have the prescribing physician sign the attestation, and submit. Track the outcome in the platform.',
              },
            ].map((item) => (
              <li key={item.step} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-900)] text-sm font-bold text-white">
                  {item.step}
                </span>
                <div>
                  <h3 className="font-semibold text-[var(--color-primary-900)]">{item.title}</h3>
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-[var(--radius-xl)] bg-white p-8 shadow-sm">
          <h2 className="font-display text-2xl font-semibold text-[var(--color-primary-900)]">
            Everything included in the Professional plan
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              'Prior Authorization Request generator',
              'Step Therapy Exception letters with state law citations',
              'Continued Stay / Medical Necessity defense',
              'Denial Letter Analyzer (plain-English breakdown)',
              'Drug trial history documentation',
              'Outcome tracking (approved / denied / appealing)',
              'Print-ready PDF export with disclaimer footer',
              'Unlimited cases',
              IDENTIFIER_COPY,
              'AI audit log for every generation',
            ].map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#0F6E56]" />
                {feature}
              </li>
            ))}
          </ul>
        </section>

        {showIndividualAdvocatePlan() ? (
          <section className="rounded-[var(--radius-xl)] border bg-white p-8">
            <h2 className="font-display text-2xl font-semibold">
              {INDIVIDUAL_ADVOCATE_PLAN.name}, {INDIVIDUAL_ADVOCATE_PLAN.monthlyLabel}/month
            </h2>
            <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
              One advocate, several families, self-serve checkout.
            </p>
          </section>
        ) : null}

        <section className="rounded-[var(--radius-xl)] bg-[var(--color-primary-900)] p-8 text-center text-white">
          <h2 className="font-display text-3xl font-semibold">Ready to stop losing hours to prior auth paperwork?</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/80">
            OncoKind Professional includes KindAuth. Unlimited cases, all three document types, outcome tracking, and the Denial Analyzer, included at $999/month.
          </p>
          <div className="mt-8">
            <Button asChild className="bg-white text-[#0F6E56] hover:bg-white/90">
              <TrackedCalendlyLink>Book a Demo</TrackedCalendlyLink>
            </Button>
          </div>
          <p className="mt-6 text-xs text-white/70">
            KindAuth is an AI-assisted document drafting tool. All generated documents must be reviewed by a licensed healthcare professional prior to submission.{' '}
            <a href="mailto:support@oncokind.com" className="underline">
              support@oncokind.com
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
