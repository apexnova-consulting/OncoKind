/**
 * Owned redaction service. Pattern rules tokenize identifiers before any
 * model provider sees the text. Token maps stay in caller-scoped memory or
 * encrypted user storage. Never log raw text or token maps.
 */

export type RedactionTokenMap = Record<string, string>;

export type RedactionResult = {
  redactedText: string;
  tokenMap: RedactionTokenMap;
  identifierCount: number;
};

const RULES: Array<{ name: string; pattern: RegExp }> = [
  { name: 'SSN', pattern: /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g },
  { name: 'EMAIL', pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g },
  { name: 'PHONE', pattern: /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g },
  { name: 'MRN', pattern: /\b(?:MRN|medical record number|patient id)\s*:?\s*[\w-]+\b/gi },
  {
    name: 'DOB',
    pattern: /\b(?:0?[1-9]|1[0-2])[\/\-](?:0?[1-9]|[12]\d|3[01])[\/\-](?:19|20)\d{2}\b/g,
  },
  {
    name: 'ADDRESS',
    pattern:
      /\b\d+\s+[\w\s]+(?:street|st|avenue|ave|road|rd|drive|dr|lane|ln|boulevard|blvd|court|ct|place|pl|suite|ste|apt)\b\.?/gi,
  },
  {
    name: 'NAME',
    pattern:
      /(?:patient|name|pt\.?)\s*:?\s*[A-Z][A-Za-z'’-]+(?:\s+[A-Z][A-Za-z'’-]+){0,3}/gi,
  },
];

export function redactDocument(text: string): RedactionResult {
  const tokenMap: RedactionTokenMap = {};
  let redactedText = text ?? '';
  let identifierCount = 0;

  for (const rule of RULES) {
    redactedText = redactedText.replace(rule.pattern, (match) => {
      identifierCount += 1;
      const token = `{{T${identifierCount}}}`;
      tokenMap[token] = match;
      return token;
    });
  }

  return { redactedText, tokenMap, identifierCount };
}

export function reinsertTokens(text: string, tokenMap: RedactionTokenMap): string {
  let result = text;
  for (const [token, value] of Object.entries(tokenMap)) {
    result = result.split(token).join(value);
  }
  return result;
}

export function findDirectIdentifiers(text: string): string[] {
  const hits: string[] = [];
  for (const rule of RULES) {
    const cloned = new RegExp(rule.pattern.source, rule.pattern.flags);
    if (cloned.test(text) && rule.name !== 'NAME') {
      hits.push(rule.name);
    }
  }
  return hits;
}

export function neutralizeInstructionLikeContent(text: string): string {
  return text
    .replace(/\bignore (all|previous|above) instructions\b/gi, '[removed instruction-like text]')
    .replace(/\bsystem prompt\b/gi, '[removed instruction-like text]')
    .replace(/\byou are now\b/gi, '[removed instruction-like text]')
    .replace(/\btool call\b/gi, '[removed instruction-like text]')
    .replace(/\bplace_voice_call\b/gi, '[removed instruction-like text]');
}
