import Anthropic from '@anthropic-ai/sdk';
import { encryptJson, toSupabaseBytea } from '@/lib/encryption';
import { scrubPHI, verifyNoPHIRemaining } from '@/lib/pii-scrubber';
import type { PatientReportData } from '@/lib/patient-reports';

const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_EXTRACTED_CHARS = 100_000;
const DEFAULT_MODEL_ID = 'claude-3-5-sonnet-20241022';

export type InsuranceAppealPayload = {
  denialReasonCode: string;
  insuranceName: string;
  memberServicesPhone: string;
  appealDeadlineText: string;
  plainEnglishBullets: string[];
  letterOfMedicalNecessity: string;
  nextStepChecklist: string[];
  physicianSignatureLine: string;
};

export type DecodedInsurancePayload = {
  denialReasonCode: string;
  insuranceName: string;
  memberServicesPhone: string;
  appealDeadlineText: string;
  plainEnglishBullets: string[];
};

type ParsedInsuranceSignals = {
  denialReasonCode: string;
  insuranceName: string;
  memberServicesPhone: string;
  appealDeadlineText: string;
};

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

export async function extractTextFromPdfFile(file: File) {
  if (!(file instanceof File)) {
    throw new Error('Missing PDF file');
  }
  if (file.type !== 'application/pdf') {
    throw new Error('Please upload a PDF file');
  }
  if (file.size > MAX_PDF_SIZE_BYTES) {
    throw new Error('File too large');
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const pdfParse = (await import('pdf-parse')).default;
  const data = await pdfParse(buffer);
  const rawText = typeof data?.text === 'string' ? data.text.slice(0, MAX_EXTRACTED_CHARS) : '';
  if (!rawText.trim()) {
    throw new Error('Could not extract text from PDF');
  }
  return rawText;
}

function extractInsuranceSignals(text: string): ParsedInsuranceSignals {
  const denialPatterns: RegExp[] = [
    /(prior auth(?:orization)? required)/i,
    /(not medically necessary)/i,
    /(out of network)/i,
    /(coverage terminated)/i,
    /(missing documentation)/i,
    /(step therapy required)/i,
    /(experimental\/investigational)/i,
  ];

  const denialCodeMatch =
    text.match(/\b(?:Reason Code|Denial Code|Claim Adjustment Reason Code|CARC)\s*[:#-]?\s*([A-Z]{1,4}-?\d{2,4}|[A-Za-z][A-Za-z\s]{3,40})/i) ??
    denialPatterns.map((pattern) => text.match(pattern)).find(Boolean);

  const insurerMatch =
    text.match(/\b(?:Insurance|Payer|Health Plan|Carrier)\s*[:#-]?\s*([A-Z][A-Za-z0-9&.,' -]{2,80})/i) ??
    text.match(/\b(?:Aetna|Cigna|Humana|UnitedHealthcare|Blue Cross|Blue Shield|Anthem|Kaiser Permanente|Medicare|Medicaid|TRICARE)\b/i);

  const phoneMatch =
    text.match(/(?:member services|customer service|appeals department|provider services)\D{0,20}(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/i) ??
    text.match(/(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/);

  const deadlineMatch =
    text.match(/\b(?:appeal|reconsideration).{0,60}?(?:within|by)\s+(\d{1,3}\s+days?)/i) ??
    text.match(/\b(?:deadline|submit by)\s*[:#-]?\s*([A-Za-z0-9, ]{3,40})/i);

  return {
    denialReasonCode: normalizeWhitespace(denialCodeMatch?.[1] ?? 'Prior Auth Required'),
    insuranceName: normalizeWhitespace(insurerMatch?.[1] ?? insurerMatch?.[0] ?? 'Insurance Plan'),
    memberServicesPhone: normalizeWhitespace(phoneMatch?.[1] ?? 'Call the number on the back of your insurance card'),
    appealDeadlineText: normalizeWhitespace(deadlineMatch?.[1] ?? 'Review your denial letter for the formal appeal deadline'),
  };
}

function buildMockNccnContext(report: PatientReportData | null) {
  const cancerType = report?.biomarkers?.cancer_type_inferred?.toLowerCase() ?? '';
  const stage = report?.biomarkers?.tnm_stage ?? 'advanced-stage disease';
  const biomarkers = (report?.biomarkers?.names ?? []).join(', ') || 'documented tumor biomarkers';

  if (cancerType.includes('lung')) {
    return `Mock NCCN 2026 context: for lung cancer with stage ${stage}, treatment planning should consider biomarker-driven therapy, systemic treatment sequencing, and documented pathology findings including ${biomarkers}.`;
  }

  return `Mock NCCN 2026 context: use the member's oncology pathology, current stage ${stage}, and biomarker profile (${biomarkers}) to justify medically necessary treatment access.`;
}

async function generateWithAnthropic({
  scrubbedText,
  parsedSignals,
  report,
}: {
  scrubbedText: string;
  parsedSignals: ParsedInsuranceSignals;
  report: PatientReportData | null;
}): Promise<{ plainEnglishBullets: string[]; letterOfMedicalNecessity: string; nextStepChecklist: string[] }> {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const prompt = `You are a health-tech insurance appeals assistant. Return ONLY valid JSON with this exact structure:

{
  "plainEnglishBullets": ["...", "...", "..."],
  "letterOfMedicalNecessity": "...",
  "nextStepChecklist": ["...", "...", "...", "..."]
}

Requirements:
- plainEnglishBullets must be exactly 3 bullets and explain the denial in plain English.
- letterOfMedicalNecessity must be formal, concise, and include placeholders for physician signature and date.
- nextStepChecklist should be actionable and specific.
- Use this denial reason code: ${parsedSignals.denialReasonCode}
- Use this insurance name: ${parsedSignals.insuranceName}
- Use this member services phone: ${parsedSignals.memberServicesPhone}
- Use this appeal deadline text: ${parsedSignals.appealDeadlineText}
- Use this mock NCCN 2026 guidance: ${buildMockNccnContext(report)}
- Use these pathology facts when relevant: cancer type=${report?.biomarkers?.cancer_type_inferred ?? 'unknown'}, stage=${report?.biomarkers?.tnm_stage ?? 'unknown'}, histology=${report?.biomarkers?.histology ?? 'unknown'}, biomarkers=${(report?.biomarkers?.names ?? []).join(', ') || 'none listed'}

EOB text:
${scrubbedText}`;

  const message = await anthropic.messages.create({
    model: DEFAULT_MODEL_ID,
    max_tokens: 2500,
    messages: [{ role: 'user', content: prompt }],
  });

  const textBlock = message.content.find((b) => b.type === 'text');
  const responseText = textBlock && 'text' in textBlock ? textBlock.text : '';
  const extracted = responseText.replace(/```json\s?/g, '').replace(/```\s?/g, '').trim();
  const parsed = JSON.parse(extracted) as {
    plainEnglishBullets?: string[];
    letterOfMedicalNecessity?: string;
    nextStepChecklist?: string[];
  };

  return {
    plainEnglishBullets: (parsed.plainEnglishBullets ?? []).slice(0, 3),
    letterOfMedicalNecessity: parsed.letterOfMedicalNecessity ?? '',
    nextStepChecklist: parsed.nextStepChecklist ?? [],
  };
}

function buildFallbackPayload(
  parsedSignals: ParsedInsuranceSignals,
  report: PatientReportData | null
): InsuranceAppealPayload {
  const cancerType = report?.biomarkers?.cancer_type_inferred ?? 'the documented cancer diagnosis';
  const stage = report?.biomarkers?.tnm_stage ?? 'the current disease stage';
  const biomarkers = (report?.biomarkers?.names ?? []).join(', ') || 'documented biomarkers';

  return {
    denialReasonCode: parsedSignals.denialReasonCode,
    insuranceName: parsedSignals.insuranceName,
    memberServicesPhone: parsedSignals.memberServicesPhone,
    appealDeadlineText: parsedSignals.appealDeadlineText,
    plainEnglishBullets: [
      `Your insurer marked this request as "${parsedSignals.denialReasonCode}", which usually means it believes an authorization or supporting records were missing.`,
      `The denial may not reflect the full oncology context, including ${cancerType}, ${stage}, and the pathology findings already documented in your report.`,
      `A focused appeal should connect the requested treatment to your cancer biology, current treatment plan, and guideline-based medical necessity.`,
    ],
    letterOfMedicalNecessity: `Re: Request for coverage reconsideration\n\nTo ${parsedSignals.insuranceName} Appeals Department,\n\nI am writing to support medical necessity for this patient's oncology treatment after a denial labeled "${parsedSignals.denialReasonCode}". The patient has ${cancerType} with ${stage}. Available pathology findings document ${biomarkers}. Based on mock NCCN 2026 guidance for this diagnosis, the requested therapy is clinically appropriate, guideline-aligned, and necessary to avoid treatment delay.\n\nPlease reconsider this denial promptly and authorize coverage without further delay.\n\nSincerely,\n\nTreating Oncologist, MD\n${'Physician Signature: ____________________    Date: ____________________'}`,
    nextStepChecklist: [
      `Step 1: Call ${parsedSignals.insuranceName} at ${parsedSignals.memberServicesPhone} and ask for the formal appeal submission channel.`,
      `Step 2: Share this denial code (${parsedSignals.denialReasonCode}) with your oncologist's office and request a signed Letter of Medical Necessity.`,
      `Step 3: Submit the appeal before ${parsedSignals.appealDeadlineText}.`,
      'Step 4: Keep copies of the denial letter, pathology report, and every fax or portal confirmation.',
    ],
    physicianSignatureLine: 'Physician Signature: ____________________    Date: ____________________',
  };
}

export async function decodeInsuranceDenial(file: File): Promise<{
  payload: DecodedInsurancePayload;
  scrubbedText: string;
  modelId: string;
  denialSummaryEncrypted: string;
}> {
  const rawText = await extractTextFromPdfFile(file);
  const scrubbedText = scrubPHI(rawText);

  if (!verifyNoPHIRemaining(scrubbedText)) {
    throw new Error('Unable to fully de-identify the insurance document');
  }

  const parsedSignals = extractInsuranceSignals(scrubbedText);
  let plainEnglishBullets = buildFallbackPayload(parsedSignals, null).plainEnglishBullets;
  let modelId = 'fallback-rules';

  try {
    const generated = await generateWithAnthropic({
      scrubbedText,
      parsedSignals,
      report: null,
    });
    if (generated.plainEnglishBullets.length > 0) {
      plainEnglishBullets = generated.plainEnglishBullets.slice(0, 3);
      modelId = DEFAULT_MODEL_ID;
    }
  } catch {
    modelId = 'fallback-rules';
  }

  const payload: DecodedInsurancePayload = {
    denialReasonCode: parsedSignals.denialReasonCode,
    insuranceName: parsedSignals.insuranceName,
    memberServicesPhone: parsedSignals.memberServicesPhone,
    appealDeadlineText: parsedSignals.appealDeadlineText,
    plainEnglishBullets,
  };

  return {
    payload,
    scrubbedText,
    modelId,
    denialSummaryEncrypted: toSupabaseBytea(encryptJson(payload)),
  };
}

export async function draftAppealFromDecodedCase({
  decoded,
  report,
}: {
  decoded: DecodedInsurancePayload;
  report: PatientReportData | null;
}): Promise<{ payload: InsuranceAppealPayload; modelId: string; appealLetterEncrypted: string; checklistEncrypted: string }> {
  const parsedSignals: ParsedInsuranceSignals = {
    denialReasonCode: decoded.denialReasonCode,
    insuranceName: decoded.insuranceName,
    memberServicesPhone: decoded.memberServicesPhone,
    appealDeadlineText: decoded.appealDeadlineText,
  };

  let payload = buildFallbackPayload(parsedSignals, report);
  let modelId = 'fallback-rules';

  try {
    const generated = await generateWithAnthropic({
      scrubbedText: [
        `Denial reason: ${decoded.denialReasonCode}`,
        `Insurance: ${decoded.insuranceName}`,
        `Phone: ${decoded.memberServicesPhone}`,
        `Deadline: ${decoded.appealDeadlineText}`,
        ...decoded.plainEnglishBullets,
      ].join('\n'),
      parsedSignals,
      report,
    });

    if (generated.letterOfMedicalNecessity) {
      payload = {
        ...payload,
        plainEnglishBullets: generated.plainEnglishBullets.length > 0 ? generated.plainEnglishBullets : payload.plainEnglishBullets,
        letterOfMedicalNecessity: generated.letterOfMedicalNecessity,
        nextStepChecklist: generated.nextStepChecklist.length > 0 ? generated.nextStepChecklist : payload.nextStepChecklist,
      };
      modelId = DEFAULT_MODEL_ID;
    }
  } catch {
    modelId = 'fallback-rules';
  }

  return {
    payload,
    modelId,
    appealLetterEncrypted: toSupabaseBytea(
      encryptJson({
        letterOfMedicalNecessity: payload.letterOfMedicalNecessity,
        physicianSignatureLine: payload.physicianSignatureLine,
      })
    ),
    checklistEncrypted: toSupabaseBytea(
      encryptJson({
        nextStepChecklist: payload.nextStepChecklist,
      })
    ),
  };
}

export async function decodeAndDraftAppeal({
  file,
  report,
}: {
  file: File;
  report: PatientReportData | null;
}): Promise<{ payload: InsuranceAppealPayload; modelId: string; denialSummaryEncrypted: string; appealLetterEncrypted: string; checklistEncrypted: string }> {
  const decoded = await decodeInsuranceDenial(file);
  const drafted = await draftAppealFromDecodedCase({
    decoded: decoded.payload,
    report,
  });
  return {
    payload: drafted.payload,
    modelId: drafted.modelId,
    denialSummaryEncrypted: decoded.denialSummaryEncrypted,
    appealLetterEncrypted: drafted.appealLetterEncrypted,
    checklistEncrypted: drafted.checklistEncrypted,
  };
}
