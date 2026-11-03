import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CONCIERGE,
  ECONOMICS,
  PLANS,
  activeCaseReadyVariant,
  caseReadyPriceCents,
  caseReadyPriceLabel,
  explorerName,
  includedProDays,
} from '../lib/ok01';
import { weeklyCohortPriceCents } from '../lib/concierge/config';
import { isCommunityEnabled, isFeatureEnabled } from '../lib/feature-flags';
import { PARKED_PUBLIC_PATHS } from '../lib/product-v34';
import { FEATURE_HUB_FEATURES, CONCIERGE_LIST_PRICE_LABEL, PLANS as PUBLIC_PLANS } from '../lib/pricing-config';
import { canTransitionCase } from '../lib/concierge/lifecycle';
import { gapsToRecordsTasks } from '../lib/ok30/gaps';
import { netRevenueCents, netRevenuePerStaffHourCents, shouldFireCheckpoint } from '../lib/ok30/revenue';
import { familyStatusFromEvents } from '../lib/ok30/family-status';
import { TRIAL_TERMS } from '../lib/trials/trial-terms';
import { JOURNEY_STAGES } from '../lib/journey/stages';

test('OK-01 Explorer, Case Ready A, 60 included days', () => {
  assert.equal(explorerName(), 'Explorer');
  assert.equal(PUBLIC_PLANS.free.name, 'Explorer');
  assert.equal(PLANS.caregiver_pro.monthly, 39);
  assert.equal(includedProDays(), 60);
  assert.equal(activeCaseReadyVariant(), 'A');
  assert.equal(caseReadyPriceCents(), 49900);
  assert.equal(caseReadyPriceLabel(), '$499');
  assert.equal(CONCIERGE_LIST_PRICE_LABEL, '$499');
  assert.equal(weeklyCohortPriceCents(), 49900);
  assert.equal(ECONOMICS.min_net_rev_per_hour, 100);
  assert.equal(CONCIERGE.case_ready.price_variants.B.amountCents, 64900);
});

test('R1 flags stay off except public Concierge pages', () => {
  assert.equal(isCommunityEnabled(), false);
  assert.equal(isFeatureEnabled('case_model_v2'), false);
  assert.equal(isFeatureEnabled('have_us_do_this'), false);
  assert.equal(isFeatureEnabled('staff_back_office'), false);
  assert.equal(isFeatureEnabled('revenue_dashboard'), false);
  assert.equal(isFeatureEnabled('keepPlan'), false);
});

test('Parked paths no longer include professional or prior-auth-pro', () => {
  assert.deepEqual([...PARKED_PUBLIC_PATHS], ['/kindauth', '/snf']);
});

test('Features hub has no Community, Empathy, or Concierge tiles', () => {
  const ids = FEATURE_HUB_FEATURES.map((feature) => feature.id);
  assert.equal(ids.includes('community'), false);
  assert.equal(ids.includes('empathy_filter'), false);
  assert.equal(ids.includes('concierge'), false);
  assert.equal(ids.includes('goals_of_care'), false);
  assert.ok(ids.includes('prep_sheets'));
});

test('Four stages are Understand, Prepare, Fight, Plan Ahead', () => {
  assert.deepEqual(
    JOURNEY_STAGES.map((stage) => stage.name),
    ['Understand', 'Prepare', 'Fight', 'Plan Ahead']
  );
});

test('Time logging blocks Case Ready without an entry', () => {
  assert.equal(canTransitionCase('in_progress', 'case_ready'), true);
  assert.equal(canTransitionCase('in_progress', 'case_ready', { hasTimeEntry: false }), false);
  assert.equal(canTransitionCase('in_progress', 'case_ready', { hasTimeEntry: true }), true);
});

test('OK-07 gaps become records tasks', () => {
  const tasks = gapsToRecordsTasks([
    { id: 'pathology', label: 'Pathology', status: 'missing' },
    { id: 'imaging', label: 'Imaging', status: 'found' },
  ]);
  assert.equal(tasks.length, 1);
  assert.equal(tasks[0].sourceGapId, 'pathology');
});

test('OK-13 revenue math matches a hand calculation', () => {
  const row = {
    id: 'hand',
    priceVariant: 'A' as const,
    stripeAmountCents: 49900,
    stripeFeeCents: 1747,
    refundCents: 0,
    passThroughCents: 650,
    staffMinutes: 180,
    daysToCaseReady: 8,
  };
  assert.equal(netRevenueCents(row), 49900 - 1747 - 650);
  assert.equal(netRevenuePerStaffHourCents(row), Math.round((49900 - 1747 - 650) / 3));
  assert.equal(shouldFireCheckpoint(10, 1, false), true);
  assert.equal(shouldFireCheckpoint(1, 60, false), true);
  assert.equal(shouldFireCheckpoint(1, 1, true), false);
});

test('OK-09 family status never exposes staff notes', () => {
  assert.equal(
    familyStatusFromEvents([
      { event_type: 'staff_note', family_visible: false },
      { event_type: 'records_requested', family_visible: true },
    ]),
    'Records requested'
  );
});

test('OK-12 trial terms keep quoted ovarian germ cell term', () => {
  assert.ok(TRIAL_TERMS.rare_ovarian.primary.includes('"ovarian germ cell tumor"'));
  assert.ok(TRIAL_TERMS.uterine_sarcoma.broader.includes('leiomyosarcoma'));
});
