import { containsTypographicDash } from '@/lib/typography';
import { findUnsafeClinicalLanguage } from '@/lib/safety-language';

const BANNED: Array<{ id: string; pattern: RegExp }> = [
  { id: 'you_should', pattern: /\byou should\b/i },
  { id: 'you_need_to', pattern: /\byou need to\b/i },
  { id: 'this_means_you_will', pattern: /\bthis means you will\b/i },
  { id: 'your_prognosis', pattern: /\byour prognosis\b/i },
  { id: 'we_recommend_this_center', pattern: /\bwe recommend this (center|trial|treatment|doctor)\b/i },
  { id: 'this_treatment', pattern: /\bthis treatment\b/i },
  { id: 'you_are_missing', pattern: /\byou are missing\b/i },
  { id: 'ains', pattern: /\bains\b/i },
];

export function lintOutboundMessage(text: string): string[] {
  const hits: string[] = [];
  for (const rule of BANNED) {
    if (rule.pattern.test(text)) hits.push(rule.id);
  }
  hits.push(...findUnsafeClinicalLanguage(text));
  if (containsTypographicDash(text)) hits.push('typographic_dash');
  return Array.from(new Set(hits));
}

export function assertOutboundSafe(text: string) {
  const hits = lintOutboundMessage(text);
  if (hits.length) {
    throw new Error(`Outbound message blocked: ${hits.join(', ')}`);
  }
}

const CLINICAL_QUESTION =
  /\b(what does (this|that) mean|is this (bad|serious|curable)|should (we|i) (do|start|stop)|prognosis|survival|stage meaning|interpret( this)? result)\b/i;

export function isClinicalQuestion(text: string): boolean {
  return CLINICAL_QUESTION.test(text);
}

export const CLINICAL_BOUNDARY_MACRO =
  "We can't answer medical questions, but your care team can. Here is a question you can bring to them.";
