export function isPediatricProfile(input: { cancerType?: string | null; notes?: string | null; ageYears?: number | null }): boolean {
  if (typeof input.ageYears === 'number' && input.ageYears < 18) return true;
  const haystack = `${input.cancerType ?? ''} ${input.notes ?? ''}`.toLowerCase();
  return /\bpediatric\b|\bchildhood\b|\bminor patient\b|\bage 1[0-7]\b/.test(haystack);
}

export const PEDIATRIC_MESSAGE =
  'Complete the Picture is for adult cancers at launch. For a child or teen, please use pediatric resources from the care team. We do not run this tool on a minor profile.';
