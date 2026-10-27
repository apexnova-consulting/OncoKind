import { PUBLIC_RESULTS_MIN_N } from '@/lib/board-run2';

export type PublicStat = {
  id: string;
  label: string;
  method: string;
  n: number;
  valueLabel: string;
};

export function canPublishPublicStat(n: number, minN = PUBLIC_RESULTS_MIN_N): boolean {
  return n >= minN;
}

export function publicResultsBlock(stats: PublicStat[], minN = PUBLIC_RESULTS_MIN_N): PublicStat[] {
  return stats.filter((stat) => canPublishPublicStat(stat.n, minN));
}
