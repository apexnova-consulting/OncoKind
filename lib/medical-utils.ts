/**
 * Scrub PII from text before sending to LLM or logging.
 * Delegates to the comprehensive HIPAA scrubber.
 * @deprecated Prefer scrubPHI from @/lib/pii-scrubber for new code.
 */

import { scrubPHI } from './pii-scrubber';

export function scrubPII(text: string): string {
  return scrubPHI(text);
}

export function scrubPIIFromReportPayload(payload: Record<string, unknown>): Record<string, unknown> {
  const result = { ...payload };
  for (const key of Object.keys(result)) {
    if (typeof result[key] === 'string') {
      result[key] = scrubPII(result[key] as string);
    }
    if (result[key] !== null && typeof result[key] === 'object' && !Array.isArray(result[key])) {
      result[key] = scrubPIIFromReportPayload(result[key] as Record<string, unknown>);
    }
  }
  return result;
}
