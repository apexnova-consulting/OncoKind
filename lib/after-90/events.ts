export const AFTER90_EVENTS = [
  'after90_phase_shown',
  'vault_consent_given',
  'relative_invited',
  'relative_joined',
  'follow_up_prep_used',
  'keep_chosen',
  'pause_chosen',
  'cancel_completed',
  'sponsorship_seat_activated',
] as const;

export type After90Event = (typeof AFTER90_EVENTS)[number];
export type KeepChosenFrom = 'pricing' | 'save_flow' | 'rollover';

export type ProductEventRow = {
  event: After90Event;
  source?: KeepChosenFrom | string | null;
  reason?: string | null;
};

const PHI = /\b(cancer|tumor|diagnosis|pathology|stage|BRCA|name|email)\b/i;

export function assertEventHasNoPhi(row: ProductEventRow): ProductEventRow {
  const blob = `${row.event} ${row.source ?? ''} ${row.reason ?? ''}`;
  if (PHI.test(blob) && row.event !== 'cancel_completed') {
    return { event: row.event, source: row.source ?? null, reason: null };
  }
  if (row.reason && /[A-Z][a-z]+ [A-Z]/.test(row.reason)) {
    return { event: row.event, source: row.source ?? null, reason: 'redacted' };
  }
  return row;
}
