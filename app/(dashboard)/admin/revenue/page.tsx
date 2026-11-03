import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/admin';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { ECONOMICS, caseReadyPriceLabel } from '@/lib/ok01';
import { belowMinRevenue, netRevenuePerStaffHourCents, shouldFireCheckpoint, type RevenueCase } from '@/lib/ok30/revenue';

export const metadata = {
  title: 'Revenue per staff hour',
  description: 'Staff-only Concierge economics.',
};

const SAMPLES: RevenueCase[] = [
  {
    id: 'sample-a',
    priceVariant: 'A',
    stripeAmountCents: 49900,
    stripeFeeCents: 1747,
    refundCents: 0,
    passThroughCents: 0,
    staffMinutes: 180,
    daysToCaseReady: 8,
  },
  {
    id: 'sample-b',
    priceVariant: 'A',
    stripeAmountCents: 49900,
    stripeFeeCents: 1747,
    refundCents: 0,
    passThroughCents: 650,
    staffMinutes: 240,
    daysToCaseReady: 12,
  },
  {
    id: 'sample-c',
    priceVariant: 'B',
    stripeAmountCents: 64900,
    stripeFeeCents: 2182,
    refundCents: 0,
    passThroughCents: 0,
    staffMinutes: 200,
    daysToCaseReady: 9,
  },
];

export default async function RevenueDashboardPage() {
  await requireAdmin();
  if (!isFeatureEnabled('revenue_dashboard')) redirect('/admin/organizations');
  const checkpoint = shouldFireCheckpoint(0, 0, false);
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">Revenue per staff hour</h1>
      <p className="text-sm text-slate-600">
        Minimum {ECONOMICS.min_net_rev_per_hour} dollars per staff hour. Active list price {caseReadyPriceLabel()}.
      </p>
      {checkpoint ? (
        <p className="rounded-xl bg-amber-50 p-4 text-sm">Checkpoint: 10 completed cases or 60 days after launch.</p>
      ) : null}
      <ul className="space-y-3">
        {SAMPLES.map((row) => (
          <li key={row.id} className={`rounded-xl border p-4 ${belowMinRevenue(row) ? 'border-amber-400' : ''}`}>
            <p className="font-medium">
              {row.id} variant {row.priceVariant}
            </p>
            <p className="text-sm text-slate-600">
              Net per hour: {Math.round(netRevenuePerStaffHourCents(row) / 100)} dollars. Minutes: {row.staffMinutes}.
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
