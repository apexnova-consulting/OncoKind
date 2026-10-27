export function draftRecordsRequest(input: {
  facility: string;
  channel: string;
  familyConfirmed: boolean;
}): string {
  if (!input.familyConfirmed) {
    return 'Do not send. The family has not confirmed the facility.';
  }
  return `Please send complete records for the authorized patient to OncoKind Concierge for intake at ${input.facility}. Preferred channel: ${input.channel}. This is a records request only. We do not interpret results.`;
}

export function draftIntakeCoverLetter(input: { center: string; packetComplete: boolean }): string {
  if (!input.packetComplete) {
    return 'Do not send. The packet is not complete.';
  }
  return `Please find the intake packet for the authorized family, submitted to ${input.center} as requested. A person at OncoKind reviewed this packet before send.`;
}

export function requiresHumanApprovalBeforeSend(): true {
  return true;
}
