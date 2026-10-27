import { CONCIERGE_FOLLOWUP_DAYS } from '@/lib/concierge/config';

export function businessDaysBetween(from: Date, to: Date): number {
  let days = 0;
  const cursor = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()));
  const end = new Date(Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate()));
  while (cursor < end) {
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    const day = cursor.getUTCDay();
    if (day !== 0 && day !== 6) days += 1;
  }
  return days;
}

export function followUpDue(lastOutboundAt: Date, now = new Date()): boolean {
  const elapsed = businessDaysBetween(lastOutboundAt, now);
  return CONCIERGE_FOLLOWUP_DAYS.some((day) => elapsed >= day);
}

export function staffReminderOnly(): string {
  return 'Draft a follow-up for human approval. Do not send automatically.';
}
