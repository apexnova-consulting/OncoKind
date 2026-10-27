export type FacilityPlaybook = {
  facilityKey: string;
  recordsChannel: 'fax' | 'email' | 'portal' | 'mail';
  acceptedFormat: string;
  typicalTurnaroundDays: number | null;
  intakeChannel: string;
  notes: string;
};

export function prefillRecordsRequest(playbook: FacilityPlaybook, familyConfirmedFacility: string): {
  channel: FacilityPlaybook['recordsChannel'];
  format: string;
  facility: string;
  notes: string;
} {
  return {
    channel: playbook.recordsChannel,
    format: playbook.acceptedFormat,
    facility: familyConfirmedFacility,
    notes: playbook.notes,
  };
}
