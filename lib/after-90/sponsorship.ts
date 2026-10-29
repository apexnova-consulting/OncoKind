import {
  ORG_CONCIERGE_CASE_CENTS,
  ORG_SEAT_CAREGIVER_PRO_YEARLY_CENTS,
  ORG_SEAT_KEEP_YEARLY_CENTS,
} from '@/lib/after-90/config';

export type SponsorshipContract = {
  seatsPurchased: number;
  seatsUsed: number;
  conciergeCasesPurchased: number;
  conciergeCasesUsed: number;
  seatPlan: 'caregiver' | 'keep';
};

export function orgSeatYearlyCents(plan: 'caregiver' | 'keep'): number {
  return plan === 'keep' ? ORG_SEAT_KEEP_YEARLY_CENTS : ORG_SEAT_CAREGIVER_PRO_YEARLY_CENTS;
}

export function orgConciergeCaseCents(): number {
  return ORG_CONCIERGE_CASE_CENTS;
}

export function canActivateSeat(contract: SponsorshipContract): boolean {
  return contract.seatsUsed < contract.seatsPurchased;
}

export function canActivateConciergeCase(contract: SponsorshipContract): boolean {
  return contract.conciergeCasesUsed < contract.conciergeCasesPurchased;
}

export type OrgDashboardCounts = {
  seatsUsed: number;
  seatsPurchased: number;
  activeFamilies: number;
  conciergeByStatus: Record<string, number>;
  caseReadyFamilies: number;
};

export function orgDashboardCounts(input: OrgDashboardCounts): OrgDashboardCounts {
  return {
    seatsUsed: input.seatsUsed,
    seatsPurchased: input.seatsPurchased,
    activeFamilies: input.activeFamilies,
    conciergeByStatus: input.conciergeByStatus,
    caseReadyFamilies: input.caseReadyFamilies,
  };
}
