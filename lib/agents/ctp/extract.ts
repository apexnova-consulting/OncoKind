export type BiomarkerExtraction = {
  name: string;
  result: string;
  method: 'IHC' | 'FISH' | 'NGS' | 'PCR' | 'other' | 'unknown';
  status: 'found';
  source_span: [number, number];
  confidence: number;
  user_confirmed: boolean;
};

export type ExtractedReport = {
  document_type: 'pathology' | 'molecular' | 'imaging' | 'other';
  report_date: string | null;
  specimen: { type: 'biopsy' | 'resection' | 'cytology' | 'other' | null; site: string | null };
  cancer_type: string | null;
  histology: string | null;
  grade: string | null;
  stage: { t: string | null; n: string | null; m: string | null; group: string | null };
  margins: string | null;
  biomarkers: BiomarkerExtraction[];
  germline_or_somatic: 'germline' | 'somatic' | 'unknown';
  lab: string | null;
  warnings: string[];
};

export const CONFIDENCE_THRESHOLD = 0.8;

const CANCER_HINTS: Array<{ key: string; pattern: RegExp }> = [
  { key: 'non-small cell lung cancer', pattern: /non[-\s]?small cell lung|nsclc/i },
  { key: 'breast cancer', pattern: /\bbreast cancer\b|\binvasive ductal\b|\binvasive lobular\b/i },
  { key: 'colorectal cancer', pattern: /\bcolorectal\b|\bcolon cancer\b|\brectal cancer\b/i },
  { key: 'prostate cancer', pattern: /\bprostate adenocarcinoma\b|\bprostate cancer\b/i },
  { key: 'endometrial cancer', pattern: /\bendometrial\b|\buterine (endometrioid|serous|carcinoma)\b/i },
];

function spanFor(haystack: string, needle: string): [number, number] {
  const index = haystack.toLowerCase().indexOf(needle.toLowerCase());
  if (index < 0) return [0, 0];
  return [index, index + needle.length];
}

export function extractReportFields(text: string): ExtractedReport {
  const biomarkers: BiomarkerExtraction[] = [];
  const names = [
    'EGFR',
    'ALK',
    'ROS1',
    'KRAS',
    'NRAS',
    'BRAF',
    'PD-L1',
    'HER2',
    'ER',
    'PR',
    'BRCA1',
    'BRCA2',
    'MSI',
    'MMR',
    'p53',
    'NGS',
  ];

  for (const name of names) {
    const pattern = new RegExp(`\\b${name.replace('-', '[-\\s]?')}\\b.{0,48}`, 'i');
    const match = text.match(pattern);
    if (!match) continue;
    const snippet = match[0];
    const resultMatch = snippet.match(
      /\b(positive|negative|mutated|wild[-\s]?type|not detected|detected|high|low|\d+\s*%|cps\s*[≥>=]?\s*\d+)\b/i
    );
    biomarkers.push({
      name,
      result: resultMatch ? resultMatch[0] : 'mentioned',
      method: /ngs/i.test(text) ? 'NGS' : /ihc/i.test(text) ? 'IHC' : 'unknown',
      status: 'found',
      source_span: spanFor(text, snippet.slice(0, 12)),
      confidence: resultMatch ? 0.86 : 0.62,
      user_confirmed: false,
    });
  }

  const cancer = CANCER_HINTS.find((hint) => hint.pattern.test(text));
  const stageGroup = text.match(/\bstage\s*([ivx0-9]+[a-c]?)\b/i);
  const warnings: string[] = [];
  if (biomarkers.some((item) => item.confidence < CONFIDENCE_THRESHOLD)) {
    warnings.push('Some findings are below the confirmation threshold and need a human check before rules run.');
  }

  return {
    document_type: /imaging|mri|ct chest|pet/i.test(text)
      ? 'imaging'
      : /ngs|molecular|sequenc/i.test(text)
        ? 'molecular'
        : /patholog|biopsy|carcinoma/i.test(text)
          ? 'pathology'
          : 'other',
    report_date: null,
    specimen: { type: /biopsy/i.test(text) ? 'biopsy' : /resection/i.test(text) ? 'resection' : null, site: null },
    cancer_type: cancer?.key ?? null,
    histology: null,
    grade: null,
    stage: { t: null, n: null, m: null, group: stageGroup ? stageGroup[1].toUpperCase() : null },
    margins: /margin/i.test(text) ? 'mentioned' : null,
    biomarkers,
    germline_or_somatic: /germline/i.test(text) ? 'germline' : /somatic/i.test(text) ? 'somatic' : 'unknown',
    lab: null,
    warnings,
  };
}

export function fieldsNeedingConfirmation(extraction: ExtractedReport): string[] {
  const fields: string[] = [];
  if (!extraction.cancer_type) fields.push('cancer_type');
  for (const biomarker of extraction.biomarkers) {
    if (biomarker.confidence < CONFIDENCE_THRESHOLD && !biomarker.user_confirmed) {
      fields.push(biomarker.name);
    }
  }
  return fields;
}
