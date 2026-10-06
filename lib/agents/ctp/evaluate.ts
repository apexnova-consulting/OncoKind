import {
  CTP_FALLBACK_QUESTION,
  CTP_NOTHING_FLAGGED,
  CTP_RULES,
  type CancerTypeKey,
  type CtpRule,
} from '@/content/agents/ctp-rules/v1';
import type { ExtractedReport } from '@/lib/agents/ctp/extract';
import { APPROVED_QUESTION_PREFIX } from '@/lib/agents/safety';

export type RuleFindingStatus = 'found' | 'not_found_in_uploaded' | 'ask_whether_recommended' | 'not_applicable';

export type RuleEvaluation = {
  rule_id: string;
  version: string;
  item: string;
  status: RuleFindingStatus;
  ask_whether_recommended: string;
  why_it_can_matter: string;
  bring_or_request?: string;
  citation: CtpRule['citation'];
};

export function normalizeCancerType(value: string | null | undefined): CancerTypeKey {
  const text = (value ?? '').toLowerCase();
  if (/\bsmall cell lung\b/.test(text) && !/non[-\s]?small/.test(text)) return 'other';
  if (/nsclc|non[-\s]?small cell lung|lung cancer|\blung\b/.test(text)) return 'nsclc';
  if (/breast/.test(text)) return 'breast';
  if (/colon|rectal|colorectal/.test(text)) return 'colorectal';
  if (/prostate/.test(text)) return 'prostate';
  if (/endometri|uterine/.test(text)) return 'endometrial';
  return 'other';
}

function mentioned(aliases: string[], reportText: string, extraction: ExtractedReport): boolean {
  const haystack = `${reportText}\n${extraction.biomarkers.map((item) => item.name).join(' ')}`.toLowerCase();
  return aliases.some((alias) => haystack.includes(alias.toLowerCase()));
}

export function evaluateCtpRules(input: {
  reportText: string;
  extraction: ExtractedReport;
  cancerType?: string | null;
}): RuleEvaluation[] {
  const cancerType = normalizeCancerType(input.cancerType || input.extraction.cancer_type);
  const applicable = CTP_RULES.filter((rule) => rule.cancer_type === cancerType);
  if (applicable.length === 0) {
    return [
      {
        rule_id: 'fallback.generic.v1',
        version: '1.0.0',
        item: 'Biomarker or genomic testing',
        status: 'ask_whether_recommended',
        ask_whether_recommended: CTP_FALLBACK_QUESTION,
        why_it_can_matter: APPROVED_QUESTION_PREFIX,
        citation: {
          title: 'Generic educational fallback',
          source: 'OncoKind CtP fallback',
          version: '1.0.0',
          date: '2026-10-06',
        },
      },
    ];
  }

  return applicable.map((rule) => {
    const found = mentioned(rule.aliases, input.reportText, input.extraction);
    return {
      rule_id: rule.rule_id,
      version: rule.version,
      item: rule.item,
      status: found ? 'found' : 'not_found_in_uploaded',
      ask_whether_recommended: found
        ? `This item is mentioned in what you uploaded. You may still ask your care team how it fits the plan.`
        : rule.ask_whether_recommended,
      why_it_can_matter: rule.why_it_can_matter,
      bring_or_request: rule.bring_or_request,
      citation: rule.citation,
    };
  });
}

export function summarizeCtp(evaluations: RuleEvaluation[]): {
  foundCount: number;
  questionCount: number;
  headline: string;
  calmEmptyState: string | null;
} {
  const foundCount = evaluations.filter((item) => item.status === 'found').length;
  const questionCount = evaluations.filter((item) => item.status === 'not_found_in_uploaded' || item.status === 'ask_whether_recommended').length;
  return {
    foundCount,
    questionCount,
    headline: `${foundCount} pieces found, ${questionCount} questions to ask`,
    calmEmptyState: questionCount === 0 ? CTP_NOTHING_FLAGGED : null,
  };
}

export const QUESTION_STATUSES = [
  'Not asked',
  'Asked',
  'Answered',
  'Ordered',
  'Care team said not needed',
  'Not sure',
] as const;

export type QuestionStatus = (typeof QUESTION_STATUSES)[number];
