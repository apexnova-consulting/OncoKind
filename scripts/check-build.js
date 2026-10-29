#!/usr/bin/env node
/**
 * Fail production builds if deprecated public terms leak back into product source.
 * The list is assembled at runtime so this file does not contain the banned phrases.
 */
const fs = require('fs');
const path = require('path');

const FORBIDDEN_TERMS = [
  ['Advocate', ' Plan'].join(''),
  ['HIPAA BAA ', 'included'].join(''),
  ['HIPAA BAA ', 'available'].join(''),
  ['1 report', '/month'].join(''),
  ['NCCN-Aligned ', 'Advocate Sheets'].join(''),
  ['InterQual', '-adjacent'].join(''),
];

const ROOTS = ['app', 'components', 'lib', 'locales', 'content'];
const SKIP_DIRS = new Set(['node_modules', '.git', '.next', 'coverage', 'playwright-report', 'test-results']);
const EXT = new Set(['.ts', '.tsx', '.js', '.json']);

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, files);
    else if (EXT.has(path.extname(entry))) files.push(full);
  }
  return files;
}

const hits = [];
for (const root of ROOTS) {
  for (const file of walk(path.join(process.cwd(), root))) {
    const text = fs.readFileSync(file, 'utf8');
    for (const term of FORBIDDEN_TERMS) {
      if (text.includes(term)) hits.push(`${file}: ${term}`);
    }
  }
}

if (hits.length) {
  console.error('check-build: forbidden legacy terms found:\n' + hits.map((hit) => `  - ${hit}`).join('\n'));
  process.exit(1);
}

console.log('check-build: no forbidden legacy terms.');
