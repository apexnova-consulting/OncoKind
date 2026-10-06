import { findUnsafeClinicalLanguage } from '@/lib/safety-language';
import { containsTypographicDash, stripTypographicDashes } from '@/lib/typography';

export const BANNED_AGENT_PHRASES = [
  { id: 'you_need', pattern: /\byou need\b/i },
  { id: 'you_should_get', pattern: /\byou should get\b/i },
  { id: 'you_are_missing', pattern: /\byou are missing\b/i },
  { id: 'missing_a_test', pattern: /\bmissing a test\b/i },
  { id: 'this_means_you_will', pattern: /\bthis means you will\b/i },
  { id: 'autonomous', pattern: /\bautonomous\b/i },
  { id: 'ai_doctor', pattern: /\bai doctor\b/i },
  { id: 'nccn_aligned', pattern: /\bnccn[-\s]?aligned\b/i },
] as const;

export const CRISIS_PATTERNS = [
  /\bkill myself\b/i,
  /\bsuicide\b/i,
  /\bend my life\b/i,
  /\bwant to die\b/i,
  /\bself[-\s]?harm\b/i,
];

export function findBannedAgentPhrases(text: string): string[] {
  return BANNED_AGENT_PHRASES.filter(({ pattern }) => pattern.test(text)).map(({ id }) => id);
}

export function containsCrisisLanguage(text: string): boolean {
  return CRISIS_PATTERNS.some((pattern) => pattern.test(text));
}

export function scanAgentOutput(text: string): string[] {
  return [
    ...findUnsafeClinicalLanguage(text),
    ...findBannedAgentPhrases(text),
    ...(containsTypographicDash(text) ? ['typographic_dash'] : []),
  ];
}

export function assertSafeAgentOutput(text: string, context: string): string {
  const cleaned = stripTypographicDashes(text);
  const hits = scanAgentOutput(cleaned);
  if (hits.length > 0) {
    throw new Error(`Unsafe agent output in ${context}: ${hits.join(', ')}`);
  }
  return cleaned;
}

export const APPROVED_QUESTION_PREFIX =
  'Your report does not mention this item. You may want to ask your care team whether it is recommended for your situation.';

export const EDUCATIONAL_DISCLAIMER = 'Educational support, not medical advice.';

export const REDACTION_USER_NOTE =
  'We remove names and other identifying details before analysis.';
