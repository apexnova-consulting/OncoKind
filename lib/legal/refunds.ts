import {
  CONCIERGE_CAREGIVER_GRANT_DAYS,
  CONCIERGE_DEFAULT_PRICE_CENTS,
  CONCIERGE_SUBMISSION_READY_TARGET_BUSINESS_DAYS,
  formatUsdFromCents,
} from '@/lib/concierge/config';

export const CONCIERGE_REFUND_TERMS = [
  `OncoKind Concierge is a one-time fee of ${formatUsdFromCents(CONCIERGE_DEFAULT_PRICE_CENTS)} per case.`,
  'You may request a full refund any time before we send the first records request.',
  `If we do not send a records request within ${CONCIERGE_SUBMISSION_READY_TARGET_BUSINESS_DAYS} business days of a complete authorization and intake, you may request a full refund.`,
  'After the first records request is sent, the fee is earned, except where a refund is required by law.',
  `A paid Concierge case includes ${CONCIERGE_CAREGIVER_GRANT_DAYS} days of Caregiver Pro. That included time is not separately refundable once records work has started.`,
  'Tools subscriptions (Free, Caregiver Pro, and Caregiver Plus) can be canceled at any time. Unused subscription time is not refunded except where required by law.',
  'To request a refund, email support@oncokind.com from the account used to pay.',
].join(' ');

export const CONCIERGE_REFUND_CHECKBOX_LABEL =
  'I have read the Concierge refund terms and I understand when a refund is available.';

export const TOOLS_CANCEL_COPY =
  'You can cancel a Tools subscription at any time from account settings. There is no cancellation fee.';
