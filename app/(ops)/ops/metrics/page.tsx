import { weeklyCohortPriceCents, loadedCoordinatorHourlyCents } from '@/lib/concierge/config';
import { grossMarginCents } from '@/lib/concierge/metrics';

export default function OpsMetricsPage() {
  const price = weeklyCohortPriceCents();
  const sample = grossMarginCents({
    priceCents: price,
    timedMinutes: 94,
    vendorCents: 650,
    paymentFeeCents: Math.round(price * 0.029 + 30),
    modelComputeCents: 120,
  });
  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">Concierge metrics</h1>
      <p className="text-sm text-slate-600">Admin only. North star is human minutes per case. No PHI in this view.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border bg-white p-5">
          <p className="text-xs uppercase tracking-widest text-[#0F6E56]">Sample HMPC</p>
          <p className="mt-2 text-3xl font-semibold">94 min</p>
        </article>
        <article className="rounded-2xl border bg-white p-5">
          <p className="text-xs uppercase tracking-widest text-[#0F6E56]">Sample margin</p>
          <p className="mt-2 text-3xl font-semibold">${Math.round(sample / 100)}</p>
          <p className="mt-1 text-xs text-slate-500">Price {price / 100} minus labor at ${loadedCoordinatorHourlyCents() / 100}/hr plus vendor and fees.</p>
        </article>
      </div>
    </main>
  );
}
