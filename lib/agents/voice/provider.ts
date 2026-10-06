export type VoiceCallType = 'assistance_program' | 'medical_records';

export type VoiceScript = {
  callType: VoiceCallType;
  disclosure: string;
  opener: string;
  questions: string[];
  phiRefusal: string;
  closing: string;
};

export const VOICE_SCRIPTS: Record<VoiceCallType, VoiceScript> = {
  assistance_program: {
    callType: 'assistance_program',
    disclosure:
      'Hello, I am an AI assistant calling on behalf of a family member of a patient. I cannot share the patient name or any medical details.',
    opener: 'I am calling with process questions only. I do not need to identify a patient.',
    questions: [
      'How does a family apply?',
      'Is the current method fax, email, or an online form?',
      'Is funding currently open?',
      'What is the usual turnaround time?',
    ],
    phiRefusal:
      'I cannot share identifying information. A family member can call back if a name or date of birth is required. Thank you, I will end this call now.',
    closing: 'Thank you for the process information. A family member may follow up directly.',
  },
  medical_records: {
    callType: 'medical_records',
    disclosure:
      'Hello, I am an AI assistant calling on behalf of a family member of a patient. I cannot share the patient name or any medical details.',
    opener: 'I am calling with process questions about how a family submits a records request. I cannot verify identity on this call.',
    questions: [
      'Where should a records request be sent?',
      'Which form is required?',
      'Are there fees?',
      'What is the usual turnaround time?',
    ],
    phiRefusal:
      'I cannot share identifying information or complete identity verification. A family member can call back to complete that step. Thank you, I will end this call now.',
    closing: 'Thank you. The family will submit the request themselves.',
  },
};

export interface VoiceProvider {
  name: string;
  placeCall(input: {
    to: string;
    script: VoiceScript;
    runId: string;
  }): Promise<{ accepted: boolean; vendorCallId?: string; reason: string }>;
}

export class StubVoiceProvider implements VoiceProvider {
  name = 'stub_no_production_calls';
  async placeCall(): Promise<{ accepted: boolean; reason: string }> {
    return {
      accepted: false,
      reason:
        'Voice calling is invite-only beta. Production calling stays off until counsel approves a vendor, BAA, and scripts. No call was placed.',
    };
  }
}

export function getVoiceProvider(): VoiceProvider {
  return new StubVoiceProvider();
}

export const VOICE_BAKEOFF_CANDIDATES = ['NLPearl', 'Retell', 'Synthflow'] as const;
