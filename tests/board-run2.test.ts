import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { ADVOCATE_FEATURES, PLANS, hasAdvocateAccess, hasCaregiverAccess, publicCatalogFeatures } from '../lib/pricing-config';
import { FAMILY_PLUS_PLAN_NAME, FROZEN_TOOL_ROUTES, HOMEPAGE_PITCH, PUBLIC_RESULTS_MIN_N, isFamilyTierMerged, isToolFreezeOn } from '../lib/board-run2';
import { nextJourneyStep } from '../lib/journey/next-step';
import { canStartCallForMe, CALL_FOR_ME_IDENTITY } from '../lib/voice/call-gates';
import { canPublishPublicStat } from '../lib/outcomes/public-results';
import { canShowUpgradePrompt } from '../lib/paywall';
import { isConciergeAtWeeklyCap } from '../lib/concierge/capacity';
import { prefillRecordsRequest } from '../lib/concierge/playbook';
import { draftRecordsRequest, requiresHumanApprovalBeforeSend } from '../lib/concierge/templates';
import { canPartnerReadPhi, canAdvocateReadClient, canOrgReadOtherOrg } from '../lib/concierge/rls';
import { CONCIERGE_RETENTION_DAYS } from '../lib/legal/retention';
import { JOURNEY_POSITIONING } from '../lib/journey/stages';
import { CANCER_LANDINGS } from '../lib/cancers/landings';
import { unexpectedToolRoutes, findBannedPlaceholders, expectedPublicPrices } from '../lib/crawler/public-copy';
import { grandfatherAdvocateEntitlements } from '../lib/billing/grandfather-advocate';
import { canCoverConciergeFee } from '../lib/concierge/sponsored';
import { isFeatureEnabled } from '../lib/feature-flags';

test('Family Advocate Plan is renamed Caregiver Plus while merge stays off', () => {
  assert.equal(isFamilyTierMerged(), false);
  assert.equal(PLANS.advocate.name, FAMILY_PLUS_PLAN_NAME);
  assert.equal(ADVOCATE_FEATURES.includes('Insurance Denial Defense'), false);
  assert.equal(hasAdvocateAccess('pro'), false);
  assert.equal(hasCaregiverAccess('advocate'), true);
});

test('Homepage pitch is the board sentence', () => {
  assert.equal(JOURNEY_POSITIONING, HOMEPAGE_PITCH);
});

test('Concierge retention constant is 90', () => {
  assert.equal(CONCIERGE_RETENTION_DAYS, 90);
});

test('Next-step engine offers Concierge as primary after a denial', () => {
  const result = nextJourneyStep({
    hasReport: true,
    hasAppointment: true,
    hasDenial: true,
    trialInterest: false,
    secondOpinionGoal: false,
    recordDelays: false,
    conciergeCase: false,
  });
  assert.equal(result.primary.id, 'conciergeStart');
  assert.ok(result.secondary.length <= 2);
});

test('Call for me cannot start without authorization and approval', () => {
  assert.equal(
    canStartCallForMe({
      inviteOnlyEnabled: true,
      productionCallsEnabled: false,
      signedAuthorizationOnFile: false,
      humanApprovedScript: true,
      recordingConsentGiven: true,
    }).ok,
    false
  );
  assert.equal(
    canStartCallForMe({
      inviteOnlyEnabled: true,
      productionCallsEnabled: false,
      signedAuthorizationOnFile: true,
      humanApprovedScript: false,
      recordingConsentGiven: true,
    }).ok,
    false
  );
  const ok = canStartCallForMe({
    inviteOnlyEnabled: true,
    productionCallsEnabled: false,
    signedAuthorizationOnFile: true,
    humanApprovedScript: true,
    recordingConsentGiven: false,
  });
  assert.equal(ok.ok, true);
  if (ok.ok) assert.equal(ok.record, false);
  assert.match(CALL_FOR_ME_IDENTITY, /not the patient/);
});

test('Public results hide below n=30', () => {
  assert.equal(canPublishPublicStat(29), false);
  assert.equal(canPublishPublicStat(PUBLIC_RESULTS_MIN_N), true);
});

test('No upgrade prompt on diagnostic view', () => {
  assert.equal(canShowUpgradePrompt('/journey/diagnosis/abc', 'view'), false);
  assert.equal(canShowUpgradePrompt('/journey', 'export'), true);
});

test('Weekly cap closes checkout at 15', () => {
  assert.equal(isConciergeAtWeeklyCap(15), true);
  assert.equal(isConciergeAtWeeklyCap(14), false);
});

test('Playbook prefill and templates never auto-send', () => {
  const prefill = prefillRecordsRequest(
    {
      facilityKey: 'demo',
      recordsChannel: 'fax',
      acceptedFormat: 'HIPAA request',
      typicalTurnaroundDays: 14,
      intakeChannel: 'portal',
      notes: 'Ask for complete chart',
    },
    'Demo Center'
  );
  assert.equal(prefill.channel, 'fax');
  assert.equal(requiresHumanApprovalBeforeSend(), true);
  assert.match(draftRecordsRequest({ facility: 'Demo Center', channel: 'fax', familyConfirmed: true }), /records request only/);
});

test('Partner and org isolation helpers deny cross-reads', () => {
  assert.equal(canPartnerReadPhi(), false);
  assert.equal(canAdvocateReadClient({ advocateId: 'a', clientAdvocateId: 'b' }), false);
  assert.equal(canOrgReadOtherOrg({ orgId: '1', recordOrgId: '2' }), false);
});

test('Tool freeze is on and no extra marketing feature routes exist', () => {
  assert.equal(isToolFreezeOn(), true);
  const dir = join(__dirname, '..', 'app', '(marketing)', 'features');
  const routes = readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => `/features/${entry.name}`);
  assert.deepEqual(unexpectedToolRoutes(routes).sort(), []);
  assert.ok(FROZEN_TOOL_ROUTES.includes('/features/empathy-filter'));
});

test('Crawler helpers know current public prices and banned copy', () => {
  const prices = expectedPublicPrices();
  assert.equal(prices.caregiverMonthly, '$39');
  assert.equal(prices.concierge, '$299');
  assert.deepEqual(findBannedPlaceholders('hello TBD world'), []);
  assert.ok(findBannedPlaceholders('supplied by counsel').length > 0);
});

test('Grandfathered Advocate subscribers keep their Stripe price', () => {
  const result = grandfatherAdvocateEntitlements('advocate');
  assert.equal(result.keepStripePrice, true);
});

test('Sponsored codes cannot cover a fee when empty', () => {
  assert.equal(canCoverConciergeFee({ code: 'FOUND', partnerId: 'p', remaining: 0, active: true }), false);
});

test('Diagnosis landings exist and stay question-shaped', () => {
  assert.equal(CANCER_LANDINGS.length, 4);
  assert.ok(CANCER_LANDINGS.every((landing) => landing.questions.length >= 3));
});

test('Founder-decision flags stay off except tool freeze', () => {
  assert.equal(isFeatureEnabled('family_tier_merge'), false);
  assert.equal(isFeatureEnabled('concierge_price_variant'), false);
  assert.equal(isFeatureEnabled('individual_advocate_plan'), false);
  assert.equal(isFeatureEnabled('rare_womens_cancers_framing'), false);
});

test('Catalog still includes Denial Defense from Caregiver Pro', () => {
  const insurance = publicCatalogFeatures().find((feature) => feature.id === 'insurance');
  assert.equal(insurance?.cells.caregiver, 'Included');
});
