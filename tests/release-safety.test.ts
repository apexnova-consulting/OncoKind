import test from 'node:test';
import assert from 'node:assert/strict';
import { first72SafetyHits } from '../lib/first-72-hours';
import { collectFamilyCopy } from '../content/family-insights/v1';
import { findUnsafeClinicalLanguage } from '../lib/safety-language';
import { HOMEPAGE_TOOL_COUNT, PLANS, YEARLY_MONTHS_INCLUDED, yearlyAmountCents } from '../lib/pricing-config';
import { canSeeHiddenMember } from '../lib/family-access';

test('First 72 Hours copy has no survival or mortality framing', () => {
  assert.deepEqual(first72SafetyHits(), []);
});

test('Family insight copy has no risk scores or mortality framing', () => {
  assert.deepEqual(findUnsafeClinicalLanguage(collectFamilyCopy()), []);
});

test('Yearly billing is 10x monthly', () => {
  assert.equal(YEARLY_MONTHS_INCLUDED, 10);
  assert.equal(yearlyAmountCents(PLANS.caregiver.monthlyCents), PLANS.caregiver.yearlyCents);
  assert.equal(yearlyAmountCents(PLANS.advocate.monthlyCents), PLANS.advocate.yearlyCents);
});

test('Homepage tool count is driven by catalog data', () => {
  assert.ok(HOMEPAGE_TOOL_COUNT >= 8);
});

test('RLS helper: relative A cannot read relative B hidden row', () => {
  const hiddenB = { hidden: true, claimed_by: 'user-b', created_by: 'owner', family_owner: 'owner' };
  assert.equal(canSeeHiddenMember(hiddenB, 'user-a'), false);
  assert.equal(canSeeHiddenMember(hiddenB, 'user-b'), true);
  assert.equal(canSeeHiddenMember(hiddenB, 'owner'), false);
});
