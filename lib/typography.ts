const EM_DASH = /\u2014/g;
const EN_DASH = /\u2013/g;

/** Replace em and en dashes used as punctuation. Numeric ranges become "to". */
export function stripTypographicDashes(input: string): string {
  return input
    .replace(/(\d)\s*\u2013\s*(\d)/g, '$1 to $2')
    .replace(/(\d)\s*\u2014\s*(\d)/g, '$1 to $2')
    .replace(EM_DASH, '. ')
    .replace(EN_DASH, ', ')
    .replace(/[ \t]+\./g, '.')
    .replace(/\.\s+\./g, '.')
    .replace(/  +/g, ' ')
    .trim();
}

export function containsTypographicDash(input: string): boolean {
  return /[\u2013\u2014]/.test(input);
}

export const LLM_DASH_RULE =
  'Do not use em dashes or en dashes. For ranges write the word "to" (example: 1 to 3 days). Use commas or periods instead of dash punctuation.';
