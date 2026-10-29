import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { KEEP_MONTHLY_LABEL, KEEP_PLAN_NAME, KEEP_YEARLY_LABEL, keepRolloverCheckboxLabel } from '../lib/after-90/config';
import { isKeepEligible, shouldShowAfter90Phase } from '../lib/after-90/eligibility';
import { assertSafeCompareSummary, compareSameKindReports } from '../lib/after-90/compare-reports';
import { canActivateSeat } from '../lib/after-90/sponsorship';
import { shouldPurgeVault, vaultAllowed } from '../lib/after-90/vault';
import { keepCatalogCell, PLANS, publicPricingHeaders, showKeepPlan } from '../lib/pricing-config';
import { FROZEN_TOOL_ROUTES } from '../lib/board-run2';
import { expectedPublicPrices } from '../lib/crawler/public-copy';
import { hasReachedFreeReportLimit } from '../lib/report-limits';
import { nextJourneyStep } from '../lib/journey/next-step';
import { keepWelcomeEmail, rolloverReminderEmail } from '../lib/after-90/emails';

function withFlags(flags: Record<string, string>, fn: () => void) {
  const previous: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(flags)) {
    previous[key] = process.env[key];
    process.env[key] = value;
  }
  try {
    fn();
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

test('Keep prices and names live in config', () => {
  assert.equal(PLANS.keep.name, KEEP_PLAN_NAME);
  assert.equal(PLANS.keep.monthlyLabel, KEEP_MONTHLY_LABEL);
  assert.equal(PLANS.keep.yearlyLabel, KEEP_YEARLY_LABEL);
  assert.equal(PLANS.keep.yearlyCents, 9900);
});

test('Keep is hidden until the keepPlan flag is on', () => {
  assert.equal(showKeepPlan(), false);
  assert.deepEqual(publicPricingHeaders(), [PLANS.free.name, PLANS.caregiver.name]);
  assert.equal('keepMonthly' in expectedPublicPrices(), false);
});

test('Keep eligibility matches founder defaults', () => {
  withFlags({ FEATURE_KEEP_PLAN: '1', FEATURE_KEEP_ELIGIBILITY: '1' }, () => {
    const now = new Date('2026-10-29T00:00:00Z');
    assert.equal(
      isKeepEligible({ accountCreatedAt: '2026-10-01T00:00:00Z', now }).eligible,
      false
    );
    assert.equal(
      isKeepEligible({ accountCreatedAt: '2026-07-01T00:00:00Z', now }).reason,
      'account_age'
    );
    assert.equal(
      isKeepEligible({ accountCreatedAt: now, treatmentFinishedAt: now, now }).reason,
      'treatment_finished'
    );
    assert.equal(
      isKeepEligible({ accountCreatedAt: now, conciergeCaseReadyAt: now, now }).reason,
      'case_ready'
    );
    assert.equal(isKeepEligible({ accountCreatedAt: now, fromSaveFlow: true, now }).reason, 'save_flow');
  });
});

test('After 90 phase next step only when eligible', () => {
  withFlags({ FEATURE_AFTER_90_PHASE: '1' }, () => {
    const now = new Date('2026-10-29T00:00:00Z');
    assert.equal(shouldShowAfter90Phase({ accountCreatedAt: '2026-07-01T00:00:00Z', now }), true);
    const step = nextJourneyStep({
      hasReport: true,
      hasAppointment: true,
      hasDenial: false,
      trialInterest: false,
      conciergeCase: false,
      after90Eligible: true,
    });
    assert.equal(step.primary.href, '/journey/after-90');
  });
});

test('What changed since last time stays question-shaped', () => {
  const diff = compareSameKindReports(
    'The specimen is a biopsy from the cervix. HPV is not stated.',
    'The specimen is a biopsy from the cervix. p16 is positive. HPV is not stated.'
  );
  assert.ok(diff.summary.includes('Ask your care team what this means.'));
  assert.equal(/\brecurrence\b/i.test(diff.summary), false);
  assert.equal(/\b%/.test(diff.summary), false);
  assert.ok(diff.newerOnly.some((line) => /p16/i.test(line)));
  const unsafe = assertSafeCompareSummary('This suggests recurrence and 80% survival.');
  assert.equal(/\brecurrence\b/i.test(unsafe), false);
  assert.ok(unsafe.includes('Ask your care team what this means.'));
});

test('Vault stores nothing without consent', () => {
  assert.equal(vaultAllowed({ consentAt: null, tier: 'keep' }), false);
  assert.equal(vaultAllowed({ consentAt: '2026-10-01', tier: 'keep' }), true);
  assert.equal(
    shouldPurgeVault({
      consentAt: '2026-01-01',
      tier: 'free',
      planEndedAt: '2026-01-01',
      now: new Date('2026-05-01'),
    }),
    true
  );
});

test('Keep report cap is 3 per month and Pro stays unlimited', () => {
  assert.equal(hasReachedFreeReportLimit('keep', 2), false);
  assert.equal(hasReachedFreeReportLimit('keep', 3), true);
  assert.equal(hasReachedFreeReportLimit('pro', 9), false);
});

test('Keep comparison cells are never blank', () => {
  const ids = ['report_processing', 'second_opinion', 'insurance', 'empathy_filter', 'trials'];
  for (const id of ids) {
    assert.ok(keepCatalogCell(id, '').length > 0);
  }
});

test('After 90 days is not a new public tool card', () => {
  const featureDir = join(__dirname, '..', 'app', '(marketing)', 'features');
  const routes = readdirSync(featureDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  assert.equal(routes.includes('after-90'), false);
  assert.equal(routes.includes('keep'), false);
  assert.ok(FROZEN_TOOL_ROUTES.length >= 8);
});

test('Sponsorship seats cannot exceed the contract', () => {
  assert.equal(canActivateSeat({ seatsPurchased: 2, seatsUsed: 2, conciergeCasesPurchased: 0, conciergeCasesUsed: 0, seatPlan: 'keep' }), false);
  assert.equal(canActivateSeat({ seatsPurchased: 2, seatsUsed: 1, conciergeCasesPurchased: 0, conciergeCasesUsed: 0, seatPlan: 'keep' }), true);
});

test('Rollover checkbox starts unticked and emails have no PHI subjects', () => {
  assert.match(keepRolloverCheckboxLabel(), /I can cancel anytime before then/);
  assert.equal(/\bcancer\b/i.test(keepWelcomeEmail().subject), false);
  assert.equal(/\bcancer\b/i.test(rolloverReminderEmail('2026-12-01', 'https://www.oncokind.com/keep/opt-out/x').subject), false);
});
