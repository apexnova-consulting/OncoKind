'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FunnelPageView } from '@/components/analytics/FunnelPageView';
import { CONCIERGE_BRAND, CONCIERGE_CAREGIVER_GRANT_DAYS, formatUsdFromCents, weeklyCohortPriceCents } from '@/lib/concierge/config';
import { CONCIERGE_REFUND_TERMS } from '@/lib/legal/refunds';
import { CONCIERGE_RETENTION_CLAIM } from '@/lib/legal/retention';
import { conciergeWaitlistMessage } from '@/lib/concierge/capacity';

const STEPS = [
  { title: 'Choose your center', body: 'Pick from our center list or enter the one your family chose. We do not rank or recommend centers.' },
  { title: 'Authorize', body: 'Sign the patient authorization, or upload personal representative documents for counsel review.' },
  { title: 'We collect and submit', body: 'We request records, assemble the intake packet, and submit it through the center\'s documented channel.' },
  { title: 'You are Case Ready', body: CONCIERGE_BRAND.caseReady },
];

export function ConciergeMarketing() {
  const price = weeklyCohortPriceCents();
  const [atCap, setAtCap] = useState(false);
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetch('/api/concierge/capacity')
      .then((res) => res.json())
      .then((json) => setAtCap(Boolean(json.atCap)))
      .catch(() => setAtCap(false));
  }, []);

  const startLabel = `Start a case, ${formatUsdFromCents(price)}`;

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
            {atCap ? null : (
              <Button asChild>
                <Link href="/concierge/start">{startLabel}</Link>
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
            Includes {CONCIERGE_CAREGIVER_GRANT_DAYS} days of Caregiver Pro. Price shown this week is recorded with each purchase. Adult patients and US facilities only.
          </p>
          <p className="mt-3 text-sm">
            <Link href="/concierge/hardship" className="font-semibold text-[#0F6E56]">
              Can&apos;t afford this?
            </Link>
          </p>
          <p className="mt-4 rounded-xl bg-[#E1F5EE] px-4 py-3 text-sm font-semibold text-[#0F6E56]">
            Full refund any time before we send the first records request, or if we do not send one within 10 business days of a complete authorization and intake.
          </p>
          <p className="mt-3 rounded-xl border border-[#cdd8d5] px-4 py-3 text-sm text-slate-700">
            Records stored with AES-256 encryption and automatically purged 90 days after Case Ready.
          </p>
          <p className="mt-3 text-xs text-slate-500">{CONCIERGE_REFUND_TERMS}</p>
          <p className="mt-2 text-xs text-slate-500">{CONCIERGE_RETENTION_CLAIM}</p>
        </section>

        <section id="interest" className="rounded-2xl border border-[#cdd8d5] bg-white p-8">
          {atCap ? (
            <>
              <h2 className="font-display text-2xl font-semibold">New cases are full this week</h2>
              <p className="mt-2 text-sm text-slate-600">
                {conciergeWaitlistMessage()} Join the list and we will email you when a spot opens.
              </p>
            </>
          ) : (
            <>
              <h2 className="font-display text-2xl font-semibold">{startLabel}</h2>
              <p className="mt-2 text-sm text-slate-600">
                Eligibility check, refund terms, payment, then authorization. Do not include diagnosis details here.
              </p>
              <Button asChild className="mt-4">
                <Link href="/concierge/start">{startLabel}</Link>
              </Button>
            </>
          )}
          {atCap ? (
            done ? (
              <p className="mt-4 text-sm text-emerald-700">You are on the list. We will email you when a spot opens.</p>
            ) : (
              <form
                className="mt-4 flex flex-col gap-3 sm:flex-row"
                onSubmit={async (event) => {
                  event.preventDefault();
                  await fetch('/api/concierge/interest', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, surface: 'concierge_waitlist' }),
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
                  Join the list
                </Button>
              </form>
            )
          ) : null}
        </section>
      </div>
    </main>
  );
}
