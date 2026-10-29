import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  CANCER_LANDINGS,
  TYPICAL_RECORDS_NOTE,
  TYPICAL_SECOND_OPINION_RECORDS,
  cancerLandingBySlug,
} from '@/lib/cancers/landings';
import { pageMetadata } from '@/lib/seo';
import { EMPATHY_FILTER_POLICY } from '@/lib/legal/empathy';
import { Button } from '@/components/ui/button';
import { CONCIERGE_LIST_PRICE_LABEL } from '@/lib/pricing-config';

export function generateStaticParams() {
  return CANCER_LANDINGS.map((landing) => ({ slug: landing.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const landing = cancerLandingBySlug(params.slug);
  if (!landing) return {};
  return pageMetadata({
    title: `${landing.name} family questions`,
    description: landing.summary,
    path: `/cancers/${landing.slug}`,
  });
}

export default function CancerLandingPage({ params }: { params: { slug: string } }) {
  const landing = cancerLandingBySlug(params.slug);
  if (!landing) notFound();

  return (
    <main className="bg-[var(--color-bg-page)] px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl space-y-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#0F6E56]">Fictional sample</p>
        <h1 className="font-display text-4xl font-semibold text-[var(--color-primary-900)]">{landing.name}</h1>
        <p className="text-lg text-[var(--color-text-secondary)]">{landing.summary}</p>
        <section className="rounded-2xl border bg-white p-6">
          <h2 className="font-semibold">Sample family: {landing.sampleName}</h2>
          <p className="mt-2 text-sm text-slate-600">
            This is an illustration, not a real patient. {EMPATHY_FILTER_POLICY.summary}
          </p>
        </section>
        <section>
          <h2 className="font-semibold">Questions to ask the care team</h2>
          <p className="mt-2 text-sm text-slate-600">
            These are questions for your oncology team. They are not medical advice and do not tell you which test or treatment to choose.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
            {landing.questions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl border bg-white p-6">
          <h2 className="font-semibold">Records a second-opinion center usually asks for</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
            {TYPICAL_SECOND_OPINION_RECORDS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-slate-600">{TYPICAL_RECORDS_NOTE}</p>
        </section>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/signup">Start free with Explorer</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/concierge">Have Concierge do it, {CONCIERGE_LIST_PRICE_LABEL}</Link>
          </Button>
        </div>
        <p className="text-xs text-slate-500">
          Plain-language source:{' '}
          <a className="font-semibold text-[#0F6E56] underline-offset-2 hover:underline" href={landing.nciUrl} target="_blank" rel="noreferrer">
            {landing.nciLabel}
          </a>
          . Accessed {landing.accessedOn}.
        </p>
      </div>
    </main>
  );
}
