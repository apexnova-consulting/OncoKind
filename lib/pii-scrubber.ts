/**
 * HIPAA Zero-Retention PII Scrubber
 * Removes all identifiable PHI before any LLM call or storage.
 * NEVER log scrubbed or raw text—logs must remain PHI-free.
 */

const PII_PLACEHOLDER = '[REDACTED]';

/**
 * Regex patterns for comprehensive PHI removal.
 * Order matters: more specific patterns first.
 */
const PHI_PATTERNS: Array<{ pattern: RegExp; name: string }> = [
  // SSN: 123-45-6789, 123 45 6789, 123456789
  {
    pattern: /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g,
    name: 'SSN',
  },
  // MRN (Medical Record Number): alphanumeric, common formats
  {
    pattern: /\b(?:MRN|medical record number|patient id|patient ID)\s*:?\s*[\w-]+\b/gi,
    name: 'MRN_labeled',
  },
  // DOB: MM/DD/YYYY, DD-MM-YYYY, etc.
  {
    pattern:
      /\b(?:0?[1-9]|1[0-2])[\/\-](?:0?[1-9]|[12]\d|3[01])[\/\-](?:19|20)\d{2}\b/g,
    name: 'DOB_slash',
  },
  {
    pattern:
      /\b(?:0?[1-9]|[12]\d|3[01])[\/\-](?:0?[1-9]|1[0-2])[\/\-](?:19|20)\d{2}\b/g,
    name: 'DOB_dmy',
  },
  {
    pattern: /\b(?:19|20)\d{2}[\/\-](?:0?[1-9]|1[0-2])[\/\-](?:0?[1-9]|[12]\d|3[01])\b/g,
    name: 'DOB_iso',
  },
  // Phone: (123) 456-7890, 123-456-7890, +1 123 456 7890
  {
    pattern: /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
    name: 'phone',
  },
  {
    pattern: /\b\d{3}[-.\s]\d{4}\b/g,
    name: 'phone_partial',
  },
  // Email
  {
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    name: 'email',
  },
  // Street addresses: 123 Main St, 456 Oak Ave Suite 100
  {
    pattern:
      /\b\d+\s+[\w\s]+(?:street|st|avenue|ave|road|rd|drive|dr|lane|ln|way|boulevard|blvd|court|ct|place|pl|suite|ste|apt|unit|#)\b\.?/gi,
    name: 'street_address',
  },
  // ZIP codes (US) — scrub when context suggests identity linkage
  {
    pattern: /\b(?:zip|postal)\s*code?\s*:?\s*\d{5}(?:-\d{4})?\b/gi,
    name: 'zip_labeled',
  },
  {
    pattern: /\b\d{5}(?:-\d{4})?\s+(?:[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*,?\s*[A-Z]{2}\b/g,
    name: 'zip_city_state',
  },
  // Full names: Patient: Jane Doe, Name: John Smith, Dr. Jane Smith
  {
    pattern:
      /(?:patient|name|pt\.?|dob|ssn|mrn|attending|surgeon|physician)\s*:?\s*[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/gi,
    name: 'name_labeled',
  },
  {
    pattern: /\b(?:Mr\.?|Mrs\.?|Ms\.?|Dr\.?)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\b/g,
    name: 'name_titled',
  },
];

/**
 * Patterns to verify scrubbed output contains NO remaining PHI.
 * If any match, scrubbing is insufficient—do NOT send to LLM.
 */
const PHI_VERIFICATION_PATTERNS: RegExp[] = [
  /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/, // SSN
  /(?:MRN|medical record number)\s*:?\s*[\w-]+/i,
  /\b(?:0?[1-9]|1[0-2])[\/\-](?:0?[1-9]|[12]\d|3[01])[\/\-](?:19|20)\d{2}\b/, // DOB
  /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/, // Phone
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
];

/**
 * Scrub all identifiable PHI from text. Returns scrubbed string.
 * Raw text must be discarded immediately after use—never stored or logged.
 */
export function scrubPHI(text: string): string {
  if (!text || typeof text !== 'string') return '';

  let result = text;
  for (const { pattern } of PHI_PATTERNS) {
    result = result.replace(pattern, PII_PLACEHOLDER);
  }

  return result;
}

/**
 * Verify scrubbed text contains NO detectable PHI.
 * Returns true if safe to send to LLM; false otherwise.
 */
export function verifyNoPHIRemaining(scrubbedText: string): boolean {
  if (!scrubbedText || typeof scrubbedText !== 'string') return true;

  for (const pattern of PHI_VERIFICATION_PATTERNS) {
    if (pattern.test(scrubbedText)) {
      return false;
    }
  }
  return true;
}
