import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FunnelPageView } from '@/components/analytics/FunnelPageView';
import { TrackedCalendlyLink } from '@/components/analytics/TrackedCalendlyLink';
import { pageMetadata } from '@/lib/seo';
import { professionalHipaaNote } from '@/lib/disclosures';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = pageMetadata({
  title: 'OncoKind for Advocates and Navigation Teams',
  absoluteTitle: 'OncoKind for Advocates and Navigation Teams',
  description:
    'A multi-patient workspace for independent advocates and navigation teams helping families after a cancer diagnosis.',
  path: '/professional',
});

export default function ProfessionalPage() {
  return (
    <main className="bg-[var(--color-bg-page)] px-4 py-16 sm:py-24">
      <FunnelPageView event="professional_page_view" />
      <div className="mx-auto max-w-[var(--max-width-wide)] space-y-10">
        <section className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-md)] sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-accent-600)]">
            Professional
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-[var(--color-primary-900)] sm:text-5xl">
            OncoKind for independent oncology advocates
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
            Professional is built for independent advocates and navigators who hold many families at once.
            Skilled nursing and post-acute prior authorization lives on a separate page.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <TrackedCalendlyLink>Book a Demo</TrackedCalendlyLink>
            </Button>
          </div>
          <p className="mt-4 text-sm text-[var(--color-text-muted)]">{professionalHipaaNote()}</p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-sm)]">
            <h2 className="font-display text-2xl font-semibold text-[var(--color-primary-900)]">
              What the Professional tier provides
            </h2>
            <ul className="mt-5 list-disc space-y-3 pl-5 text-base leading-relaxed text-[var(--color-text-secondary)]">
              <li>Multi-patient workspace for families you support</li>
              <li>Branded PDFs and case tracking</li>
              <li>Insurance denial defense and appeal packets</li>
              <li>Batch document processing</li>
              <li>Buy Concierge cases for your clients, or sponsor them through a partner code</li>
              <li>Security review on request</li>
              <li>KindAuth for post-acute teams</li>
            </ul>
          </article>
          <article className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-sm)]">
            <h2 className="font-display text-2xl font-semibold text-[var(--color-primary-900)]">
              Who it is for
            </h2>
            <ul className="mt-5 list-disc space-y-3 pl-5 text-base leading-relaxed text-[var(--color-text-secondary)]">
              <li>Independent patient advocates supporting several families</li>
              <li>Navigation teams preparing families for oncology visits</li>
              <li>Foundations and support programs that sponsor families</li>
            </ul>
            <p className="mt-6 text-base leading-relaxed text-[var(--color-text-secondary)]">
              Running a skilled nursing facility, group home, or rehab center?{' '}
              <Link href="/prior-auth-pro" className="font-semibold text-[#0F6E56] underline-offset-2 hover:underline">
                See KindAuth.
              </Link>
            </p>
          </article>
        </section>

        <section className="rounded-[var(--radius-xl)] bg-[#1C2B2D] p-8 sm:p-10">
          <h2 className="font-display text-3xl font-semibold text-white">KindAuth</h2>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-300">
            KindAuth: prior authorization, step therapy, and continued-stay letters for post-acute teams.
          </p>
          <div className="mt-6">
            <Button asChild className="border border-slate-600 bg-transparent text-white hover:bg-white/10">
              <Link href="/prior-auth-pro">See KindAuth</Link>
            </Button>
          </div>
        </section>

        <section className="rounded-[var(--radius-xl)] bg-white p-8 shadow-sm">
          <h2 className="font-display text-2xl font-semibold text-[var(--color-primary-900)]">Sponsor families</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)]">
            Foundations and employers can cover Concierge cases. You see case counts and status only, never medical details.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/professional/partner">Partner with us</Link>
            </Button>
            <Button asChild variant="outline">
              <TrackedCalendlyLink>Book a Demo</TrackedCalendlyLink>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
