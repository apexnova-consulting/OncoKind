'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FunnelPageView } from '@/components/analytics/FunnelPageView';
import { CONCIERGE_BRAND, formatUsdFromCents, weeklyCohortPriceCents } from '@/lib/concierge/config';
import { isFeatureEnabled } from '@/lib/feature-flags';

const STEPS = [
  { title: 'Choose your center', body: 'Pick from our center list or enter the one your family chose. We do not rank or recommend centers.' },
  { title: 'Authorize', body: 'Sign the patient authorization, or upload personal representative documents for counsel review.' },
  { title: 'We collect and submit', body: 'We request records, assemble the intake packet, and submit it through the center\'s documented channel.' },
  { title: 'You are Case Ready', body: CONCIERGE_BRAND.caseReady },
];

export function ConciergeMarketing() {
  const price = weeklyCohortPriceCents();
  const purchaseOn = isFeatureEnabled('concierge_purchase');
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  return (
    <main className="bg-[var(--color-bg-page)] px-4 py-16 sm:py-24">
      <FunnelPageView event="concierge_page_viewed" />
      <div className="mx-auto max-w-[var(--max-width-wide)] space-y-10">
        <section className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-md)] sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#0F6E56]">{CONCIERGE_BRAND.tagline}</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-[#1e2d2b] sm:text-5xl">{CONCIERGE_BRAND.headline}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">{CONCIERGE_BRAND.subhead}</p>
          <p className="mt-4 text-sm text-slate-500">{CONCIERGE_BRAND.delayHonesty}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {purchaseOn ? (
              <Button asChild>
                <Link href="/concierge/start">Start a case</Link>
              </Button>
            ) : (
              <Button asChild>
                <a href="#interest">Request a case</a>
              </Button>
            )}
            <Button asChild variant="outline">
              <Link href="/features">See Tools</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <article key={step.title} className="rounded-2xl border border-[#cdd8d5] bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#0F6E56]">Step {index + 1}</p>
              <h2 className="mt-2 font-semibold text-[#1e2d2b]">{step.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{step.body}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="font-display text-2xl font-semibold">What we do</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
              <li>Collect records with the patient authorization</li>
              <li>Prepare and submit the intake packet to the center you chose</li>
              <li>Document appointment status with the intake office</li>
              <li>Deliver a travel estimate and prepare assistance applications you select</li>
            </ul>
          </article>
          <article className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="font-display text-2xl font-semibold">What we never do</h2>
            <p className="mt-4 text-sm text-slate-700">{CONCIERGE_BRAND.boundary}</p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
              <li>We do not interpret results or comment on prognosis</li>
              <li>We do not recommend a center, trial, treatment, test, or doctor</li>
              <li>We do not promise dates, acceptance, or funding</li>
            </ul>
          </article>
        </section>

        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="font-display text-2xl font-semibold">Pricing</h2>
          <p className="mt-3 text-3xl font-semibold text-[#0F6E56]">{formatUsdFromCents(price)} per case</p>
          <p className="mt-2 text-sm text-slate-600">
            Includes 60 days of Caregiver Pro. Price shown this week is recorded with each purchase. Adult patients and US facilities only.
          </p>
          <p className="mt-3 text-sm">
            <Link href="/concierge/hardship" className="font-semibold text-[#0F6E56]">
              Can&apos;t afford this?
            </Link>
          </p>
          <p className="mt-3 text-xs text-slate-500">
            Refund terms are supplied by counsel and shown before purchase. If we cannot send a records request within the stated window, a full refund path applies.
          </p>
        </section>

        <section id="interest" className="rounded-2xl border border-[#cdd8d5] bg-white p-8">
          <h2 className="font-display text-2xl font-semibold">Request a case</h2>
          <p className="mt-2 text-sm text-slate-600">
            Tell us how to reach you. Do not include diagnosis or other medical details in this form.
          </p>
          {done ? (
            <p className="mt-4 text-sm text-emerald-700">Request received. We will reply when a slot can open.</p>
          ) : (
            <form
              className="mt-4 flex flex-col gap-3 sm:flex-row"
              onSubmit={async (event) => {
                event.preventDefault();
                await fetch('/api/concierge/interest', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email, surface: 'concierge_page' }),
                });
                setDone(true);
              }}
            >
              <label className="block flex-1 text-sm font-medium">
                Email
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 w-full rounded-xl border p-3"
                />
              </label>
              <Button className="self-end" type="submit">
                Send
              </Button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
