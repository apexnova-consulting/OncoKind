import {
  FAMILY_RISK_REMINDER,
  KEEP_MONTHLY_LABEL,
  KEEP_PLAN_NAME,
  RECORDS_VAULT_NAME,
} from '@/lib/after-90/config';

const FROM_SAFE_SUBJECT = true;

export type After90Email = {
  key: string;
  subject: string;
  text: string;
};

function assertNoPhi(subject: string) {
  if (!FROM_SAFE_SUBJECT) return;
  const banned = /\b(cancer|tumor|diagnosis|pathology|stage|BRCA|report)\b/i;
  if (banned.test(subject)) {
    throw new Error('Email subject must not include clinical terms');
  }
}

export function keepWelcomeEmail(): After90Email {
  const subject = `Welcome to ${KEEP_PLAN_NAME}`;
  assertNoPhi(subject);
  return {
    key: 'keep_welcome',
    subject,
    text: `${KEEP_PLAN_NAME} is on. You have the ${RECORDS_VAULT_NAME.toLowerCase()}, follow-up visit prep, and family risk tools. Cancel anytime from account settings.`,
  };
}

export function pauseNoticeEmail(resumeDateIso: string): After90Email {
  const subject = 'Your OncoKind plan is paused';
  assertNoPhi(subject);
  return {
    key: 'pause_notice',
    subject,
    text: `Billing is paused. Your data stays. Your plan resumes on ${resumeDateIso.slice(0, 10)}. We will email you 7 days before it resumes.`,
  };
}

export function resumeReminderEmail(resumeDateIso: string): After90Email {
  const subject = 'Your OncoKind plan resumes in 7 days';
  assertNoPhi(subject);
  return {
    key: 'resume_reminder',
    subject,
    text: `Your paused plan resumes on ${resumeDateIso.slice(0, 10)}. You can cancel or stay paused from account settings.`,
  };
}

export function rolloverReminderEmail(chargeDateIso: string, optOutUrl: string): After90Email {
  const subject = `${KEEP_PLAN_NAME} starts in 7 days`;
  assertNoPhi(subject);
  return {
    key: 'rollover_reminder',
    subject,
    text: `Your Concierge Caregiver Pro days end soon. ${KEEP_PLAN_NAME} at ${KEEP_MONTHLY_LABEL}/month starts on ${chargeDateIso.slice(0, 10)} unless you opt out. Opt out: ${optOutUrl}`,
  };
}

export function explorerAfterConciergeEmail(): After90Email {
  const subject = 'Your Concierge Caregiver Pro days have ended';
  assertNoPhi(subject);
  return {
    key: 'concierge_to_explorer',
    subject,
    text: `You are back on Explorer. Concierge records follow the Concierge retention rule unless you add them to the ${RECORDS_VAULT_NAME.toLowerCase()} with ${KEEP_PLAN_NAME}.`,
  };
}

export function sponsorshipEndingEmail(endDateIso: string): After90Email {
  const subject = 'Your sponsored OncoKind access is ending';
  assertNoPhi(subject);
  return {
    key: 'sponsorship_ending',
    subject,
    text: `Sponsored access ends on ${endDateIso.slice(0, 10)}. You can continue with ${KEEP_PLAN_NAME} at ${KEEP_MONTHLY_LABEL}/month if you want the records vault and follow-up tools.`,
  };
}

export function familyRiskYearlyReminderEmail(): After90Email {
  const subject = 'A reminder for your next doctor visit';
  assertNoPhi(subject);
  return {
    key: 'family_risk_yearly',
    subject,
    text: FAMILY_RISK_REMINDER,
  };
}

export function vaultDeletionWarningEmail(daysLeft: number): After90Email {
  const subject = 'Your saved records will be deleted soon';
  assertNoPhi(subject);
  return {
    key: 'vault_deletion_warning',
    subject,
    text: `Your ${RECORDS_VAULT_NAME.toLowerCase()} will be deleted in ${daysLeft} days unless you keep an active Caregiver Pro or ${KEEP_PLAN_NAME} plan.`,
  };
}

export async function sendUserEmail(to: string, email: After90Email): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  const from = process.env.RESEND_FROM_EMAIL ?? 'OncoKind <hello@oncokind.com>';
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: email.subject,
      text: email.text,
    }),
  });
  return response.ok;
}
