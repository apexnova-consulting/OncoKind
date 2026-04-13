'use server';

/**
 * HIPAA Zero-Retention Pathology Pipeline
 *
 * 1. Accept PDF upload (secure multipart)
 * 2. Extract text via pdf-parse
 * 3. Scrub ALL identifiable PHI
 * 4. Verify no PHI remains before LLM
 * 5. Send ONLY scrubbed text to Claude
 * 6. Store ONLY structured JSON (encrypted)
 * 7. Discard raw text immediately
 * 8. Logs NEVER contain PHI
 */

import { createServerSupabaseClient } from '@/lib/supabase-server';
import { scrubPHI, verifyNoPHIRemaining } from '@/lib/pii-scrubber';
import { encryptJson, toSupabaseBytea } from '@/lib/encryption';
import { trackTemporaryArtifact } from '@/lib/privacy/zero-retention-monitor';
import Anthropic from '@anthropic-ai/sdk';

const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_EXTRACTED_CHARS = 100_000;

export type PathologyResult = {
  success: true;
  reportId: string;
  confidenceScore: number;
} | {
  success: false;
  error: string;
};

const EXTRACTION_PROMPT = `You are a clinical assistant. Extract oncology-relevant data from this de-identified pathology text. Return ONLY valid JSON with this exact structure—no markdown, no explanation:

{
  "biomarkers_json": { "names": ["EGFR", "KRAS", ...], "statuses": ["positive", "negative", ...] },
  "tnm_stage": "T2N1M0" or null if not found,
  "histology": "adenocarcinoma" or null,
  "cancer_type_inferred": "lung" or null,
  "confidence_score": 0.0 to 1.0
}

Rules: Be concise. If unclear, use null. Never include patient identifiers.`;

export async function scrubAndProcessPathology(formData: FormData): Promise<PathologyResult> {
  let rawText: string | null = null;
  let releaseTemporaryArtifact: (() => void) | null = null;

  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const file = formData.get('pdf') as File | null;
    if (!file || !(file instanceof File)) {
      return { success: false, error: 'Missing PDF file' };
    }

    if (file.size > MAX_PDF_SIZE_BYTES) {
      return { success: false, error: 'File too large' };
    }

    if (file.type !== 'application/pdf') {
      return { success: false, error: 'Invalid file type' };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfParse = (await import('pdf-parse')).default;
    const data = await pdfParse(buffer);

    rawText = typeof data?.text === 'string' ? data.text : '';
    if (!rawText?.trim()) {
      return { success: false, error: 'Could not extract text from PDF' };
    }

    releaseTemporaryArtifact = trackTemporaryArtifact('pathology-pdf');

    rawText = rawText.slice(0, MAX_EXTRACTED_CHARS);
    const scrubbedText = scrubPHI(rawText);

    if (!verifyNoPHIRemaining(scrubbedText)) {
      return {
        success: false,
        error: 'Unable to fully de-identify document. Please remove personal information and try again.',
      };
    }

    rawText = null;
    (globalThis as { _tmp?: string })._tmp = undefined;

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `${EXTRACTION_PROMPT}\n\n---\n\n${scrubbedText}`,
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === 'text');
    const text = textBlock && 'text' in textBlock ? textBlock.text : '';
    const extracted = text.replace(/```json\s?/g, '').replace(/```\s?/g, '').trim();

    let parsed: {
      biomarkers_json?: { names?: string[]; statuses?: string[] };
      tnm_stage?: string | null;
      histology?: string | null;
      cancer_type_inferred?: string | null;
      confidence_score?: number;
    } = {};

    try {
      parsed = JSON.parse(extracted) as typeof parsed;
    } catch {
      parsed = {
        biomarkers_json: { names: [], statuses: [] },
        tnm_stage: null,
        histology: null,
        confidence_score: 0,
      };
    }

    const biomarkersPayload = {
      ...parsed.biomarkers_json,
      tnm_stage: parsed.tnm_stage ?? null,
      histology: parsed.histology ?? null,
      cancer_type_inferred: parsed.cancer_type_inferred ?? null,
    };

    const confidenceScore = Math.min(
      1,
      Math.max(0, Number(parsed.confidence_score) ?? 0)
    );

    const biomarkersBuf = encryptJson(biomarkersPayload);
    const trialsBuf = encryptJson({ matched_trials: [] });

    const { data: inserted, error } = await supabase
      .from('patient_reports')
      .insert({
        user_id: user.id,
        biomarkers_json_encrypted: toSupabaseBytea(biomarkersBuf),
        matched_trials_json_encrypted: toSupabaseBytea(trialsBuf),
        confidence_score: confidenceScore,
      })
      .select('id')
      .single();

    if (error) {
      return { success: false, error: 'Failed to save report' };
    }

    return {
      success: true,
      reportId: inserted?.id ?? '',
      confidenceScore,
    };
  } catch {
    return { success: false, error: 'Processing failed. Please try again.' };
  } finally {
    rawText = null;
    releaseTemporaryArtifact?.();
  }
}
