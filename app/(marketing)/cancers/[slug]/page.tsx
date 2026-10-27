import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CANCER_LANDINGS, cancerLandingBySlug } from '@/lib/cancers/landings';
import { pageMetadata } from '@/lib/seo';
import { EMPATHY_FILTER_POLICY } from '@/lib/legal/empathy';
import { Button } from '@/components/ui/button';

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
          <h2 className="font-semibold">Questions families often bring to the care team</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
            {landing.questions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </section>
        <Button asChild>
          <Link href={landing.conciergeHref}>Ask Concierge to handle the paperwork</Link>
        </Button>
      </div>
    </main>
  );
}
