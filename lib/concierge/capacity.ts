import { conciergeCapacityCap } from '@/lib/concierge/config';

export function weekStartUtc(now = new Date()): Date {
  const utc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const day = new Date(utc).getUTCDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  return new Date(utc + mondayOffset * 24 * 60 * 60 * 1000);
}

export function isConciergeAtWeeklyCap(openOrPurchasedThisWeek: number, cap = conciergeCapacityCap()): boolean {
  return openOrPurchasedThisWeek >= cap;
}

export function conciergeWaitlistMessage(cap = conciergeCapacityCap()): string {
  return `We are at this week's cap of ${cap} Concierge cases. Join the waitlist and we will share an expected start date.`;
}
