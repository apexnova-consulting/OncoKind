export const CASE_STATES = [
  'draft',
  'purchased',
  'intake_incomplete',
  'authorization_pending',
  'authorized',
  'in_progress',
  'case_ready',
  'closed',
  'refunded',
  'paused',
  'cancelled',
  'escalated',
] as const;

export type CaseState = (typeof CASE_STATES)[number];

export const CASE_SUBSTATES = [
  'records_requested',
  'records_partial',
  'packet_assembly',
  'submitted_to_center',
  'awaiting_center_confirmation',
] as const;

export type CaseSubstate = (typeof CASE_SUBSTATES)[number];

const ALLOWED: Record<CaseState, CaseState[]> = {
  draft: ['purchased', 'cancelled'],
  purchased: ['intake_incomplete', 'authorization_pending', 'refunded', 'cancelled'],
  intake_incomplete: ['authorization_pending', 'paused', 'cancelled', 'refunded'],
  authorization_pending: ['authorized', 'paused', 'cancelled', 'refunded'],
  authorized: ['in_progress', 'paused', 'cancelled', 'escalated'],
  in_progress: ['case_ready', 'paused', 'cancelled', 'escalated', 'refunded'],
  case_ready: ['closed', 'escalated'],
  closed: [],
  refunded: ['closed'],
  paused: ['in_progress', 'authorization_pending', 'cancelled', 'refunded'],
  cancelled: ['refunded', 'closed'],
  escalated: ['in_progress', 'paused', 'cancelled'],
};

export function canTransitionCase(from: CaseState, to: CaseState): boolean {
  return ALLOWED[from]?.includes(to) ?? false;
}

export type CaseReadyEvidence = {
  recordsAccountedFor: boolean;
  packetSubmitted: boolean;
  appointmentStatusDocumented: boolean;
  costEstimateDelivered: boolean;
  assistancePrepared: boolean;
  familyConfirmedOrQuietPeriodPassed: boolean;
};

export function isCaseReady(evidence: CaseReadyEvidence): boolean {
  return Object.values(evidence).every(Boolean);
}

export const REQUEST_STATUSES = [
  'not_sent',
  'sent',
  'acknowledged',
  'partial',
  'received',
  'unavailable',
  'refused',
] as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const COORDINATOR_ROLES = ['coordinator', 'lead', 'admin', 'auditor'] as const;
export type CoordinatorRole = (typeof COORDINATOR_ROLES)[number];
