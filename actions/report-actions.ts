'use server';

import { scrubPII, scrubPIIFromReportPayload } from '@/lib/medical-utils';

/**
 * Scrub PII from text before it is sent to the LLM or stored.
 * Call this from any Server Action that handles report text.
 */
export async function scrubReportText(text: string): Promise<string> {
  return scrubPII(text ?? '');
}

/**
 * Scrub PII from a structured report payload (e.g. JSON from Claude) before storing or returning.
 */
export async function scrubReportPayload(
  payload: Record<string, unknown>
): Promise<Record<string, unknown>> {
  return scrubPIIFromReportPayload(payload);
}
