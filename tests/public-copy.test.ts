import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { BANNED_PUBLIC_NAV_LABELS, PUBLIC_NAV_LINKS } from '../lib/public-nav';
import { FAMILY_GUIDELINE_SHEET_NAME } from '../lib/board-run2';
import { FREE_FEATURES, PLANS, publicCatalogFeatures } from '../lib/pricing-config';
import { professionalHipaaNote } from '../lib/disclosures';

const ROOT = join(__dirname, '..');
const SKIP = new Set(['node_modules', '.git', '.next', 'coverage', 'playwright-report', 'test-results']);

function walk(dir: string, files: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, files);
    else if (/\.(ts|tsx)$/.test(entry)) files.push(full);
  }
  return files;
}

test('Public nav is the homepage menu', () => {
  assert.deepEqual(
    PUBLIC_NAV_LINKS.map((link) => link.label),
    ['How It Works (4-Stage)', 'Tools ($0-$39)', 'Concierge ($299)', 'About & Niche Focus']
  );
});

test('Public marketing copy has no NCCN and no family Advocate Plan', () => {
  const files = walk(join(ROOT, 'app', '(marketing)')).concat(walk(join(ROOT, 'components', 'marketing')), walk(join(ROOT, 'components', 'layout')));
  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    assert.equal(/\bNCCN\b/.test(text), false, `${file} mentions NCCN`);
    assert.equal(text.includes('Advocate Plan'), false, `${file} still says Advocate Plan`);
    assert.equal(text.includes('Join Waitlist'), false, `${file} still has Join Waitlist`);
    assert.equal(text.includes('HIPAA BAA included'), false, `${file} claims BAA included`);
    assert.equal(text.includes('FundFinder'), false, `${file} still says FundFinder`);
    assert.equal(text.includes('Live Financial Aid Tracker'), false, `${file} still says Live Financial Aid Tracker`);
    assert.equal(text.includes('Prior Auth Engine'), false, `${file} still says Prior Auth Engine`);
  }
});

test('Free card copy matches the 3-report window', () => {
  assert.equal(FREE_FEATURES[0], '3 reports in first 30 days');
  assert.ok(FREE_FEATURES.includes('Denial letter decode free'));
});

test('Public catalog uses Explorer, Advocate Sheets, and no KindAuth row', () => {
  assert.equal(PLANS.free.name, 'Explorer');
  assert.equal(FAMILY_GUIDELINE_SHEET_NAME, 'Advocate Sheets');
  assert.ok(publicCatalogFeatures().some((feature) => feature.name === FAMILY_GUIDELINE_SHEET_NAME));
  assert.equal(publicCatalogFeatures().some((feature) => feature.name === 'KindAuth'), false);
});

test('BAA note is the withdrawn offer', () => {
  assert.match(professionalHipaaNote(), /not offered on self-serve plans yet/);
});

test('Banned old nav labels stay out of the public nav source', () => {
  const header = readFileSync(join(ROOT, 'components', 'layout', 'SiteHeader.tsx'), 'utf8');
  for (const label of BANNED_PUBLIC_NAV_LABELS) {
    assert.equal(header.includes(`'${label}'`), false);
  }
});
