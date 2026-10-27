import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { BANNED_PLACEHOLDER_STRINGS } from '../lib/legal/placeholders';
import { BANNED_UNSCOPED_RETENTION } from '../lib/legal/retention';
import { nextJourneyStep } from '../lib/journey/next-step';
import { hasReachedFreeReportLimit } from '../lib/report-limits';
import { CATALOG_FEATURES, CONCIERGE_LIST_PRICE_LABEL, PLANS, publicCatalogFeatures } from '../lib/pricing-config';
import { weeklyCohortPriceCents, CONCIERGE_DEFAULT_PRICE_CENTS } from '../lib/concierge/config';
import { isBaaReady, isFeatureEnabled } from '../lib/feature-flags';
import { hasInsuranceAdvocacyAccess } from '../lib/entitlements';
import { SUBPROCESSORS } from '../lib/legal/subprocessors';
import { CONCIERGE_REFUND_TERMS } from '../lib/legal/refunds';
import { EMPATHY_FILTER_POLICY } from '../lib/legal/empathy';

const ROOT = join(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.git', '.next', 'coverage', 'playwright-report', 'test-results']);

function walk(dir: string, files: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, files);
    else if (/\.(ts|tsx|md|js)$/.test(entry) && !full.includes('/docs/CONCIERGE_ASSUMPTIONS.md')) {
      files.push(full);
    }
  }
  return files;
}

test('CI grep blocks placeholder legal copy in app surfaces', () => {
  const files = walk(join(ROOT, 'app')).concat(walk(join(ROOT, 'components')), walk(join(ROOT, 'lib')));
  for (const file of files) {
    if (file.endsWith('lib/legal/placeholders.ts')) continue;
    const text = readFileSync(file, 'utf8').toLowerCase();
    for (const banned of BANNED_PLACEHOLDER_STRINGS) {
      assert.equal(text.includes(banned), false, `${file} contains ${banned}`);
    }
  }
});

test('No unscoped raw-data retention claim remains in app or components', () => {
  const files = walk(join(ROOT, 'app')).concat(walk(join(ROOT, 'components')), walk(join(ROOT, 'lib')));
  for (const file of files) {
    if (file.endsWith('lib/legal/retention.ts') || file.endsWith('lib/legal/placeholders.ts')) continue;
    const text = readFileSync(file, 'utf8');
    for (const banned of BANNED_UNSCOPED_RETENTION) {
      assert.equal(text.includes(banned), false, `${file} contains unscoped claim: ${banned}`);
    }
  }
});

test('Public Concierge price is $299 unless a lock or price test is set', () => {
  assert.equal(weeklyCohortPriceCents(new Date('2026-10-25T12:00:00Z')), CONCIERGE_DEFAULT_PRICE_CENTS);
  assert.equal(CONCIERGE_LIST_PRICE_LABEL, '$299');
  const concierge = CATALOG_FEATURES.find((feature) => feature.id === 'concierge');
  assert.ok(concierge?.cells.free.includes('$299'));
});

test('Denial Defense is included from Caregiver Pro on every catalog cell', () => {
  const insurance = CATALOG_FEATURES.find((feature) => feature.id === 'insurance');
  assert.equal(insurance?.homepage?.tag, 'Caregiver Pro');
  assert.equal(insurance?.cells.caregiver, 'Included');
  assert.equal(insurance?.cells.advocate, 'Included');
  assert.equal(hasInsuranceAdvocacyAccess('pro'), true);
  assert.equal(hasInsuranceAdvocacyAccess('free'), false);
});

test('HIPAA BAA stays off the public catalog until baa_ready', () => {
  assert.equal(isBaaReady(), false);
  assert.equal(publicCatalogFeatures().some((feature) => feature.id === 'hipaa_baa'), false);
});

test('Professional self-serve checkout stays off', () => {
  assert.equal(isFeatureEnabled('professional_self_serve'), false);
  assert.equal(PLANS.professional.cta, 'Book a Demo');
  assert.ok(PLANS.professional.signupHref.includes('calendly'));
});

test('Next-step engine always returns one primary and at most two secondary actions', () => {
  const states = [
    { hasReport: false, hasAppointment: false, hasDenial: false, trialInterest: false, conciergeCase: false },
    { hasReport: true, hasAppointment: false, hasDenial: false, trialInterest: false, conciergeCase: false },
    { hasReport: true, hasAppointment: true, hasDenial: false, trialInterest: false, conciergeCase: false },
    { hasReport: true, hasAppointment: true, hasDenial: true, trialInterest: false, conciergeCase: false },
    { hasReport: true, hasAppointment: true, hasDenial: false, trialInterest: true, conciergeCase: false },
    { hasReport: true, hasAppointment: true, hasDenial: false, trialInterest: false, conciergeCase: true },
  ];
  for (const state of states) {
    const result = nextJourneyStep(state);
    assert.ok(result.primary.label);
    assert.ok(result.secondary.length <= 2);
  }
});

test('Free report window is three reports in 30 days', () => {
  assert.equal(hasReachedFreeReportLimit('free', 2), false);
  assert.equal(hasReachedFreeReportLimit('free', 3), true);
  assert.equal(hasReachedFreeReportLimit('pro', 9), false);
});

test('Trust subprocessors include Calendly, analytics, and status page', () => {
  const names = SUBPROCESSORS.map((item) => item.service);
  assert.ok(names.includes('Calendly'));
  assert.ok(names.includes('Google Analytics'));
  assert.ok(names.includes('Statuspage (status.oncokind.com)'));
});

test('Refund terms and Empathy Filter policy are specific, not placeholder', () => {
  assert.ok(CONCIERGE_REFUND_TERMS.includes('full refund'));
  assert.ok(EMPATHY_FILTER_POLICY.summary.includes('Never volunteer') || EMPATHY_FILTER_POLICY.summary.includes('never volunteer'));
});
