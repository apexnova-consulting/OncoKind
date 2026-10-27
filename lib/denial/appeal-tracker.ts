export type AppealOutcome = 'pending' | 'overturned' | 'upheld' | 'withdrawn';

export type AppealCase = {
  insurer: string;
  denialType: string;
  submittedOn: string;
  deadlineOn: string;
  outcome: AppealOutcome;
};

export function reminderDaysBeforeDeadline(deadlineOn: string, now = new Date()): number {
  const deadline = new Date(deadlineOn);
  return Math.ceil((deadline.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
}

export function shouldRemind(deadlineOn: string, now = new Date()): boolean {
  const days = reminderDaysBeforeDeadline(deadlineOn, now);
  return days >= 0 && days <= 7;
}
