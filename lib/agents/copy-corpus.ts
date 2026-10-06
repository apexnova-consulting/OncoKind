import { collectCtpCopy } from '@/content/agents/ctp-rules/v1';
import { collectProgramCopy } from '@/content/agents/programs/v1';
import { BRING_CHECKLIST, coverageQuestionScript, recordsRequestLetter } from '@/lib/agents/ctp/letters';
import { PEDIATRIC_MESSAGE } from '@/lib/agents/ctp/pediatric';
import { REDACTION_USER_NOTE, EDUCATIONAL_DISCLAIMER, APPROVED_QUESTION_PREFIX } from '@/lib/agents/safety';
import { VOICE_SCRIPTS } from '@/lib/agents/voice/provider';

export function collectAgentCopy(): string {
  return [
    collectCtpCopy(),
    collectProgramCopy(),
    BRING_CHECKLIST.join('\n'),
    coverageQuestionScript(),
    recordsRequestLetter({ caregiverName: 'Alex', patientRelationship: 'child', facilityName: 'Clinic', today: 'October 6, 2026' }),
    PEDIATRIC_MESSAGE,
    REDACTION_USER_NOTE,
    EDUCATIONAL_DISCLAIMER,
    APPROVED_QUESTION_PREFIX,
    VOICE_SCRIPTS.assistance_program.disclosure,
    VOICE_SCRIPTS.assistance_program.opener,
    VOICE_SCRIPTS.assistance_program.questions.join('\n'),
    VOICE_SCRIPTS.assistance_program.phiRefusal,
    VOICE_SCRIPTS.medical_records.disclosure,
  ].join('\n');
}
