import { loadedCoordinatorHourlyCents } from '@/lib/concierge/config';

export type CostInputs = {
  priceCents: number;
  timedMinutes: number;
  vendorCents: number;
  paymentFeeCents: number;
  modelComputeCents: number;
};

export function humanMinutes(timedMinutes: number): number {
  return Math.max(0, Math.round(timedMinutes));
}

export function laborCostCents(timedMinutes: number, hourlyCents = loadedCoordinatorHourlyCents()): number {
  return Math.round((timedMinutes / 60) * hourlyCents);
}

export function grossMarginCents(input: CostInputs): number {
  const labor = laborCostCents(input.timedMinutes);
  return input.priceCents - (labor + input.vendorCents + input.paymentFeeCents + input.modelComputeCents);
}

export function automationRate(totalTasks: number, untouchedTasks: number): number {
  if (totalTasks <= 0) return 0;
  return untouchedTasks / totalTasks;
}
