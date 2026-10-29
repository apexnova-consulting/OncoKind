import test from 'node:test';
import assert from 'node:assert/strict';
import { BEREAVEMENT_REASON } from '../lib/after-90/config';
import { cancelClicksRequired, isBereavementReason, saveScreen1, unusedTimeRefundCents } from '../lib/after-90/save-flow';

test('Cancel is on the first screen and needs two clicks', () => {
  const screen = saveScreen1({ currentPlan: 'pro' });
  assert.equal(screen.cancelLabel, 'Cancel my plan');
  assert.equal(screen.showSwitchKeep, true);
  assert.deepEqual([...screen.pauseMonths], [1, 2, 3]);
  assert.equal(cancelClicksRequired(), 2);
});

test('Keep switch is hidden for Keep subscribers', () => {
  assert.equal(saveScreen1({ currentPlan: 'keep' }).showSwitchKeep, false);
});

test('Bereavement path shows no offers once selected', () => {
  assert.equal(isBereavementReason(BEREAVEMENT_REASON), true);
  assert.equal(isBereavementReason('Too expensive'), false);
});

test('Bereavement refunds unused time of the current period', () => {
  const refund = unusedTimeRefundCents({
    periodStart: new Date('2026-10-01T00:00:00Z'),
    periodEnd: new Date('2026-11-01T00:00:00Z'),
    amountPaidCents: 3900,
    now: new Date('2026-10-16T00:00:00Z'),
  });
  assert.ok(refund > 1500 && refund < 2500);
});
