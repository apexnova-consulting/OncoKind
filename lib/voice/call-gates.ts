export type CallStartInput = {
  inviteOnlyEnabled: boolean;
  productionCallsEnabled: boolean;
  signedAuthorizationOnFile: boolean;
  humanApprovedScript: boolean;
  recordingConsentGiven: boolean;
  attemptProduction?: boolean;
};

export type CallStartDecision =
  | { ok: true; record: boolean }
  | { ok: false; reason: 'invite_only' | 'missing_authorization' | 'missing_approval' | 'kill_switch' };

export function canStartCallForMe(input: CallStartInput): CallStartDecision {
  if (!input.inviteOnlyEnabled) return { ok: false, reason: 'invite_only' };
  if (!input.signedAuthorizationOnFile) return { ok: false, reason: 'missing_authorization' };
  if (!input.humanApprovedScript) return { ok: false, reason: 'missing_approval' };
  if (input.attemptProduction && !input.productionCallsEnabled) {
    return { ok: false, reason: 'kill_switch' };
  }
  return { ok: true, record: input.recordingConsentGiven };
}

export const CALL_FOR_ME_IDENTITY =
  'This is OncoKind calling on behalf of the family. We are not the patient and we do not give medical opinions.';
