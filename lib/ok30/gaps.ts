export type GapItem = {
  id: string;
  label: string;
  status: string;
};

export type RecordsTask = {
  type: 'records_request';
  sourceGapId: string;
  facilityName?: string;
  status: 'todo';
};

export function gapsToRecordsTasks(gaps: GapItem[]): RecordsTask[] {
  return gaps
    .filter((gap) => gap.status !== 'found')
    .map((gap) => ({
      type: 'records_request' as const,
      sourceGapId: gap.id,
      status: 'todo' as const,
    }));
}
