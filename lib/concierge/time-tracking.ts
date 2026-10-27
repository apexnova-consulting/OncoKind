export const TIME_STEPS = [
  'intake_review',
  'authorization_review',
  'records_request_prep',
  'follow_up',
  'packet_assembly',
  'submission',
] as const;

export type TimeStep = (typeof TIME_STEPS)[number];

export function minutesFromRange(startedAt: Date, stoppedAt: Date): number {
  return Math.max(0, Math.round((stoppedAt.getTime() - startedAt.getTime()) / 60000));
}

export function summarizeStepMinutes(rows: Array<{ step: TimeStep; minutes: number }>): Record<TimeStep, number> {
  const summary = Object.fromEntries(TIME_STEPS.map((step) => [step, 0])) as Record<TimeStep, number>;
  for (const row of rows) {
    summary[row.step] += Math.max(0, row.minutes);
  }
  return summary;
}
