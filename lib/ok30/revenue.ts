import { ECONOMICS } from '@/lib/ok01';

export type RevenueCase = {
  id: string;
  priceVariant: 'A' | 'B';
  stripeAmountCents: number;
  stripeFeeCents: number;
  refundCents: number;
  passThroughCents: number;
  staffMinutes: number;
  daysToCaseReady: number;
  haveUsDoThisSource?: string;
};

export function netRevenueCents(row: RevenueCase): number {
  return row.stripeAmountCents - row.stripeFeeCents - row.refundCents - row.passThroughCents;
}

export function netRevenuePerStaffHourCents(row: RevenueCase): number {
  const hours = row.staffMinutes / 60;
  if (hours <= 0) return 0;
  return Math.round(netRevenueCents(row) / hours);
}

export function belowMinRevenue(row: RevenueCase): boolean {
  return netRevenuePerStaffHourCents(row) < ECONOMICS.min_net_rev_per_hour * 100;
}

export function variantSummary(rows: RevenueCase[], variant: 'A' | 'B') {
  const subset = rows.filter((row) => row.priceVariant === variant);
  const hours = subset.reduce((sum, row) => sum + row.staffMinutes / 60, 0);
  const net = subset.reduce((sum, row) => sum + netRevenueCents(row), 0);
  return {
    cases: subset.length,
    averageHours: subset.length ? hours / subset.length : 0,
    netRevenuePerHourCents: hours ? Math.round(net / hours) : 0,
    conversionFromHaveUsDoThis: subset.filter((row) => row.haveUsDoThisSource).length,
  };
}

export function shouldFireCheckpoint(completedCases: number, daysSinceLaunch: number, alreadyFired: boolean) {
  if (alreadyFired) return false;
  return completedCases >= ECONOMICS.checkpoint_cases || daysSinceLaunch >= ECONOMICS.checkpoint_days;
}
