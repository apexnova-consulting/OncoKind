export type SponsoredCode = {
  code: string;
  partnerId: string;
  remaining: number;
  active: boolean;
};

export function canCoverConciergeFee(code: SponsoredCode | null): boolean {
  return Boolean(code && code.active && code.remaining > 0);
}

export function partnerReportRow(input: { partnerId: string; used: number; remaining: number }) {
  return {
    partnerId: input.partnerId,
    used: input.used,
    remaining: input.remaining,
  };
}

export function partnerCannotReadPhi(): true {
  return true;
}
