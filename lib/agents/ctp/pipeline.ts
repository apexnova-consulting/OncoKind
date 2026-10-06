import { neutralizeInstructionLikeContent, redactDocument } from '@/lib/agents/redaction';
import { extractReportFields, fieldsNeedingConfirmation } from '@/lib/agents/ctp/extract';
import { evaluateCtpRules, summarizeCtp } from '@/lib/agents/ctp/evaluate';
import { assertSafeAgentOutput, containsCrisisLanguage, REDACTION_USER_NOTE } from '@/lib/agents/safety';
import { isPediatricProfile, PEDIATRIC_MESSAGE } from '@/lib/agents/ctp/pediatric';
import { createIdempotencyKey } from '@/lib/agents/runtime';

export type CtpPipelineInput = {
  reportText: string;
  cancerType?: string | null;
  stage?: string | null;
  ageYears?: number | null;
  userId?: string;
};

export function runCompleteThePicture(input: CtpPipelineInput) {
  if (containsCrisisLanguage(input.reportText)) {
    return {
      kind: 'crisis' as const,
      message: 'If you are in crisis, call or text 988. Cancer Support Community: 1-888-793-9355.',
    };
  }
  if (isPediatricProfile({ cancerType: input.cancerType, notes: input.reportText, ageYears: input.ageYears })) {
    return { kind: 'pediatric' as const, message: PEDIATRIC_MESSAGE };
  }

  const neutralized = neutralizeInstructionLikeContent(input.reportText);
  const redaction = redactDocument(neutralized);
  const extraction = extractReportFields(redaction.redactedText);
  const needsConfirmation = fieldsNeedingConfirmation(extraction);
  const evaluations = evaluateCtpRules({
    reportText: redaction.redactedText,
    extraction,
    cancerType: input.cancerType || extraction.cancer_type,
  });
  const summary = summarizeCtp(evaluations);

  for (const item of evaluations) {
    assertSafeAgentOutput(
      `${item.ask_whether_recommended} ${item.why_it_can_matter} ${item.bring_or_request ?? ''}`,
      item.rule_id
    );
  }

  return {
    kind: 'ok' as const,
    redactionNote: REDACTION_USER_NOTE,
    identifierCount: redaction.identifierCount,
    extraction,
    needsConfirmation,
    evaluations,
    summary,
    idempotencyKey: createIdempotencyKey(['ctp', input.userId, extraction.cancer_type, summary.headline]),
  };
}
