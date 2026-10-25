import { CONCIERGE_BRAND } from '@/lib/concierge/config';
import { HandleThisPrompt } from '@/components/concierge/HandleThisPrompt';

export function ConciergeCaseDashboard() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <p className="text-sm font-semibold uppercase tracking-widest text-[#0F6E56]">Case dashboard</p>
      <h1 className="font-display text-4xl font-semibold text-[#1e2d2b]">Your Concierge case</h1>
      <p className="text-slate-600">{CONCIERGE_BRAND.delayHonesty}</p>
      <section className="rounded-2xl border bg-white p-6">
        <h2 className="font-semibold">What we&apos;re doing</h2>
        <p className="mt-2 text-sm text-slate-600">
          Cases appear here after intake is saved. Purchase, authorization, and outbound sends stay off until release gates pass.
        </p>
      </section>
      <section className="rounded-2xl border bg-white p-6">
        <h2 className="font-semibold">What we need from you</h2>
        <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
          <li>Complete intake if anything is still marked I am not sure</li>
          <li>Sign authorization when counsel templates are in place</li>
        </ul>
      </section>
      <HandleThisPrompt entryPoint="second_opinion" />
    </main>
  );
}
