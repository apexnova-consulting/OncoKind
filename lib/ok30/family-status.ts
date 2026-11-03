export const FAMILY_VISIBLE_STATUSES = [
  'Open',
  'Records requested',
  'Records pending',
  'Packet submitted',
  'Waiting on the center',
  'Case Ready',
] as const;

export const TASK_STATUSES = ['todo', 'requested', 'waiting', 'received', 'not_available', 'done'] as const;

export function familyStatusFromEvents(events: Array<{ event_type: string; family_visible: boolean }>): string {
  const visible = events.filter((event) => event.family_visible);
  const last = visible[visible.length - 1];
  if (!last) return 'Open';
  if (last.event_type === 'case_ready') return 'Case Ready';
  if (last.event_type === 'submitted') return 'Packet submitted';
  if (last.event_type === 'records_requested') return 'Records requested';
  return 'Records pending';
}
