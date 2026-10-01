const DOB = /\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/;
const SSN = /\b\d{3}-?\d{2}-?\d{4}\b/;
const PHONE = /\b(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}\b/;
const MEMBER_OR_MRN =
  /\b(?:mrn|member(?:\s*id)?|subscriber(?:\s*id)?|medicaid|medicare)[:#\s-]*[a-z0-9-]{5,}\b/i;

export function detectIdentifierWarning(value: string): string | null {
  const text = value.trim();
  if (!text) return null;
  if (SSN.test(text)) {
    return 'That looks like a Social Security number. Please use de-identified case details only.';
  }
  if (DOB.test(text)) {
    return 'That looks like a date of birth. Please use de-identified case details only.';
  }
  if (PHONE.test(text)) {
    return 'That looks like a phone number. Please use de-identified case details only.';
  }
  if (MEMBER_OR_MRN.test(text)) {
    return 'That looks like a member ID or medical record number. Please use de-identified case details only.';
  }
  return null;
}

export function detectIdentifierWarningInValues(values: Array<string | undefined | null>): string | null {
  for (const value of values) {
    if (!value) continue;
    const warning = detectIdentifierWarning(value);
    if (warning) return warning;
  }
  return null;
}
