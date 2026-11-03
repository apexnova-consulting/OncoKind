#!/usr/bin/env node
/**
 * OK-14: banned-phrase CI on public marketing routes listed in the ticket.
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SCOPE = [
  path.join(ROOT, 'app', '(marketing)', 'page.tsx'),
  path.join(ROOT, 'app', '(marketing)', 'features'),
  path.join(ROOT, 'app', '(marketing)', 'pricing'),
  path.join(ROOT, 'app', '(marketing)', 'concierge'),
  path.join(ROOT, 'app', '(marketing)', 'partners'),
  path.join(ROOT, 'app', '(marketing)', 'about'),
  path.join(ROOT, 'app', '(marketing)', 'trust'),
  path.join(ROOT, 'app', '(marketing)', 'cancers'),
  path.join(ROOT, 'app', '(marketing)', 'professional'),
  path.join(ROOT, 'app', '(marketing)', 'prior-auth-pro'),
  path.join(ROOT, 'components', 'marketing'),
  path.join(ROOT, 'components', 'concierge', 'ConciergeMarketing.tsx'),
  path.join(ROOT, 'components', 'layout', 'SiteHeader.tsx'),
  path.join(ROOT, 'components', 'layout', 'TrustFooter.tsx'),
];

const BANNED = [
  'advocate plan',
  'caregiver plus',
  'kindauth pro',
  'call for me',
  'hipaa baa included',
  'no raw report data retained',
  '1 report/month',
  'pending written',
  'pending licensing',
  'seed records',
  'ship unverified',
  'production flag',
  'lorem',
  'guarantee',
  'nccn',
  'interqual',
  'reviewed by',
  'medically reviewed',
  'clinician-reviewed',
];

const PRICE_STRINGS = ['$39', '$299', '$390', '$399', '$499', '$649'];
const SKIP = new Set(['node_modules', '.git', '.next']);
const EXT = new Set(['.ts', '.tsx', '.js']);

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const stat = fs.statSync(dir);
  if (stat.isFile()) {
    files.push(dir);
    return files;
  }
  for (const entry of fs.readdirSync(dir)) {
    if (SKIP.has(entry)) continue;
    const full = path.join(dir, entry);
    const next = fs.statSync(full);
    if (next.isDirectory()) walk(full, files);
    else if (EXT.has(path.extname(entry))) files.push(full);
  }
  return files;
}

function copyOnly(text) {
  return text.replace(/placeholder\s*=/gi, '').replace(/placeholder:/gi, '');
}

const hits = [];
for (const root of SCOPE) {
  for (const file of walk(root)) {
    const raw = fs.readFileSync(file, 'utf8');
    const text = copyOnly(raw);
    const lower = text.toLowerCase();
    if (/\btodo\b/.test(lower) || /\btbd\b/.test(lower)) hits.push(`${file}: todo/tbd`);
    if (/\bplaceholder\b/.test(lower)) hits.push(`${file}: placeholder`);
    for (const term of BANNED) {
      if (lower.includes(term)) hits.push(`${file}: ${term}`);
    }
    for (const price of PRICE_STRINGS) {
      if (text.includes(price)) hits.push(`${file}: hardcoded ${price}`);
    }
  }
}

if (hits.length) {
  console.error('check-ok14 failed:\n' + hits.map((hit) => `  - ${hit}`).join('\n'));
  process.exit(1);
}
console.log('check-ok14: public marketing copy is clean.');
