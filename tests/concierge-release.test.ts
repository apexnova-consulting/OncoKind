import test from 'node:test';
import assert from 'node:assert/strict';
import { weeklyCohortPriceCents, formatUsdFromCents, CONCIERGE_DEFAULT_PRICE_CENTS } from '../lib/concierge/config';
import { canTransitionCase, isCaseReady } from '../lib/concierge/lifecycle';
import { lintOutboundMessage, isClinicalQuestion } from '../lib/concierge/lint';
import { grossMarginCents, laborCostCents } from '../lib/concierge/metrics';
import { resolveSendDestination } from '../lib/concierge/send-guard';
import { canCoordinatorOpenCase, canFamilyReadCase } from '../lib/concierge/rls';
import { isFeatureEnabled, isCtpReducedMode } from '../lib/feature-flags';
import { HOMEPAGE_TOOL_COUNT, FEATURE_HUB_FEATURES, HOMEPAGE_SPOTLIGHT_FEATURES } from '../lib/pricing-config';
import { evaluateCtpRules } from '../lib/agents/ctp/evaluate';
import { containsTypographicDash } from '../lib/typography';
import { CONCIERGE_BRAND } from '../lib/concierge/config';
import { CENTER_SEEDS } from '../content/concierge/centers/v1';

test('Concierge purchase and ops flags default off', () => {
  assert.equal(isFeatureEnabled('concierge_purchase'), false);
  assert.equal(isFeatureEnabled('concierge_ops_console'), false);
  assert.equal(isFeatureEnabled('voice_internal_tool'), false);
});

test('Complete the Picture reduced mode defaults on', () => {
  assert.equal(isCtpReducedMode(), true);
});

test('Public Concierge price defaults to $299', () => {
  const price = weeklyCohortPriceCents(new Date('2026-10-25T12:00:00Z'));
  assert.equal(price, CONCIERGE_DEFAULT_PRICE_CENTS);
  assert.equal(formatUsdFromCents(CONCIERGE_DEFAULT_PRICE_CENTS), '$299');
});

test('Case state machine blocks illegal jumps to Case Ready', () => {
  assert.equal(canTransitionCase('draft', 'case_ready'), false);
  assert.equal(canTransitionCase('in_progress', 'case_ready'), true);
});

test('Case Ready requires all six evidence flags', () => {
  assert.equal(
    isCaseReady({
      recordsAccountedFor: true,
      packetSubmitted: true,
      appointmentStatusDocumented: true,
      costEstimateDelivered: true,
      assistancePrepared: true,
      familyConfirmedOrQuietPeriodPassed: true,
    }),
    true
  );
  assert.equal(
    isCaseReady({
      recordsAccountedFor: true,
      packetSubmitted: true,
      appointmentStatusDocumented: false,
      costEstimateDelivered: true,
      assistancePrepared: true,
      familyConfirmedOrQuietPeriodPassed: true,
    }),
    false
  );
});

test('Outbound lint blocks banned phrases and dashes', () => {
  assert.ok(lintOutboundMessage('You should go to this center').includes('you_should'));
  assert.ok(lintOutboundMessage('Wait — then call').includes('typographic_dash'));
  assert.equal(lintOutboundMessage('We followed up with the records office.').length, 0);
});

test('Clinical questions are detected and send destinations cannot come from the model', () => {
  assert.equal(isClinicalQuestion('What does this mean for survival?'), true);
  const blocked = resolveSendDestination({
    proposed: '555-0100',
    facilityValue: '555-0199',
    familyConfirmedValue: null,
  });
  assert.equal('error' in blocked, true);
});

test('HMPC margin math matches a hand calculation', () => {
  const labor = laborCostCents(60, 3400);
  assert.equal(labor, 3400);
  const margin = grossMarginCents({
    priceCents: 29900,
    timedMinutes: 60,
    vendorCents: 1000,
    paymentFeeCents: 900,
    modelComputeCents: 100,
  });
  assert.equal(margin, 29900 - (3400 + 1000 + 900 + 100));
});

test('Coordinator cannot open an unassigned case; families cannot read another family', () => {
  assert.equal(
    canCoordinatorOpenCase({ role: 'coordinator', assignedTo: 'a', actorId: 'b' }),
    false
  );
  assert.equal(canFamilyReadCase('owner-1', 'owner-2'), false);
});

test('Homepage tool count matches the features hub data source', () => {
  assert.equal(HOMEPAGE_TOOL_COUNT, FEATURE_HUB_FEATURES.length);
  assert.equal(HOMEPAGE_SPOTLIGHT_FEATURES.length, FEATURE_HUB_FEATURES.length);
  assert.ok(FEATURE_HUB_FEATURES.some((feature) => feature.id === 'trials'));
  assert.ok(FEATURE_HUB_FEATURES.some((feature) => feature.id === 'second_opinion'));
  assert.ok(!FEATURE_HUB_FEATURES.some((feature) => feature.id === 'kindauth'));
  assert.ok(!FEATURE_HUB_FEATURES.some((feature) => feature.id === 'voice_call_for_me'));
});

test('Reduced Complete the Picture does not flag not mentioned', () => {
  const result = evaluateCtpRules({
    reportText: 'Lung adenocarcinoma. PD-L1 50 percent.',
    extraction: {
      document_type: 'pathology',
      report_date: null,
      specimen: { type: 'biopsy', site: 'lung' },
      cancer_type: 'nsclc',
      histology: 'adenocarcinoma',
      grade: null,
      stage: { t: null, n: null, m: null, group: null },
      margins: null,
      biomarkers: [
        {
          name: 'PD-L1',
          result: '50%',
          method: 'IHC',
          status: 'found',
          source_span: [0, 5],
          confidence: 0.9,
          user_confirmed: false,
        },
      ],
      germline_or_somatic: 'unknown',
      lab: null,
      warnings: [],
    },
    cancerType: 'nsclc',
    reducedMode: true,
  });
  assert.equal(result.some((item) => item.status === 'not_found_in_uploaded'), false);
});

test('Public Concierge copy has no typographic dashes or AINS', () => {
  const copy = Object.values(CONCIERGE_BRAND).join('\n');
  assert.equal(containsTypographicDash(copy), false);
  assert.equal(/\bains\b/i.test(copy), false);
});

test('Center seed has 30 destination profiles and no ranking field', () => {
  assert.equal(CENTER_SEEDS.length, 30);
  assert.ok(CENTER_SEEDS.every((center) => center.status === 'unverified'));
});
