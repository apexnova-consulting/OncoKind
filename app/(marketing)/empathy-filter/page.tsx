import Link from 'next/link';

export const metadata = {
  title: 'Empathy Filter | OncoKind',
  description: 'How OncoKind chooses words carefully to support families with clarity and compassion.',
};

export default function EmpathyFilterPage() {
  return (
    <main className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-accent sm:text-4xl">
          The Empathy Filter: Why We Choose Our Words Carefully
        </h1>
        <p className="mt-6 text-lg text-slate-700">
          When a family member is diagnosed with cancer, the words you encounter matter enormously. We
          designed the Empathy Filter - a set of principles and technical guardrails - to make sure every
          word OncoKind outputs supports you rather than frightens you.
        </p>

        <section className="mt-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-heading text-xl font-semibold text-accent">What the Empathy Filter blocks</h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-slate-700">
            <li>Survival statistics and prognosis percentages (these are population averages, not predictions about your loved one)</li>
            <li>Fear-based language (&quot;aggressive,&quot; &quot;devastating,&quot; &quot;terminal&quot; used without clinical necessity)</li>
            <li>Deterministic framing (&quot;this means...&quot; / &quot;you will...&quot;)</li>
            <li>Medical jargon used without explanation</li>
          </ul>
        </section>

        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-heading text-xl font-semibold text-accent">What the Empathy Filter ensures</h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-slate-700">
            <li>Every diagnosis explanation ends with a next step, not a dead end</li>
            <li>Biomarker explanations focus on what they mean for treatment options, not what they predict</li>
            <li>Language is always preparatory: &quot;here&apos;s what to ask your doctor&quot; rather than &quot;here&apos;s what this means for you&quot;</li>
          </ul>
        </section>

        <blockquote className="mt-8 rounded-xl border-l-4 border-primary bg-sky-50/40 p-5 text-slate-800">
          OncoKind&apos;s Empathy Filter is not just a content policy. It is a commitment to every family who
          comes to us in one of the hardest moments of their lives.
        </blockquote>

        <section className="mt-8 text-slate-700">
          <h2 className="font-heading text-xl font-semibold text-accent">Why this matters</h2>
          <p className="mt-3">
            Research consistently shows that how medical information is framed shapes how families cope,
            communicate with their care team, and make decisions. We take that seriously.
          </p>
          <p className="mt-6">
            Want to learn more about why this is personal to us? Visit the{' '}
            <Link href="/about#founder-section" className="text-primary underline-offset-4 hover:underline">
              founder story
            </Link>.
          </p>
        </section>
      </div>
    </main>
  );
}
