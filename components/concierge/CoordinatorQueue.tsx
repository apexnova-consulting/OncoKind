'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MESSAGE_MACROS } from '@/content/concierge/macros/v1';
import { SOP_TASKS } from '@/content/concierge/sops/v1';
import { lintOutboundMessage, isClinicalQuestion } from '@/lib/concierge/lint';
import { grossMarginCents, laborCostCents } from '@/lib/concierge/metrics';
import { weeklyCohortPriceCents, loadedCoordinatorHourlyCents } from '@/lib/concierge/config';

export function CoordinatorQueue() {
  const [minutes, setMinutes] = useState(12);
  const [draft, setDraft] = useState<string>(MESSAGE_MACROS[1].body);
  const hits = lintOutboundMessage(draft);
  const clinical = isClinicalQuestion(draft);
  const price = weeklyCohortPriceCents();
  const margin = grossMarginCents({
    priceCents: price,
    timedMinutes: minutes,
    vendorCents: 400,
    paymentFeeCents: Math.round(price * 0.029 + 30),
    modelComputeCents: 80,
  });

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">Coordinator console</h1>
      <p className="text-sm text-slate-600">Desktop first. Assigned cases only. No bulk export. Training mode uses synthetic cases.</p>
      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-2xl border bg-white p-5 lg:col-span-2">
          <h2 className="font-semibold">Queue</h2>
          <p className="mt-2 text-sm text-slate-600">No live cases until purchase is enabled. Capacity and SLA risk sort here.</p>
          <ul className="mt-4 space-y-2 text-sm">
            {SOP_TASKS.map((task) => (
              <li key={task.task_type} className="rounded-xl border p-3">
                {task.task_type} · {task.expected_minutes} min expected
              </li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border bg-white p-5">
          <h2 className="font-semibold">HMPC timer</h2>
          <label className="mt-3 block text-sm">
            Minutes
            <input
              type="number"
              value={minutes}
              onChange={(event) => setMinutes(Number(event.target.value))}
              className="mt-2 w-full rounded-lg border p-2"
            />
          </label>
          <p className="mt-3 text-sm">Labor: ${Math.round(laborCostCents(minutes) / 100)} at ${loadedCoordinatorHourlyCents() / 100}/hr</p>
          <p className="text-sm">Gross margin on this week&apos;s price: ${Math.round(margin / 100)}</p>
        </article>
      </section>
      <section className="rounded-2xl border bg-white p-5">
        <h2 className="font-semibold">Outbound lint</h2>
        {clinical ? <p className="mt-2 rounded-lg bg-amber-50 p-3 text-sm">Clinical question detected. Use the approved macro. If this is crisis language, show 988 and alert a lead.</p> : null}
        <textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows={4} className="mt-3 w-full rounded-xl border p-3 text-sm" />
        <p className="mt-2 text-sm">{hits.length ? `Blocked: ${hits.join(', ')}` : 'Message passes lint.'}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {MESSAGE_MACROS.map((macro) => (
            <Button key={macro.id} type="button" variant="outline" onClick={() => setDraft(macro.body)}>
              {macro.title}
            </Button>
          ))}
        </div>
      </section>
    </main>
  );
}
