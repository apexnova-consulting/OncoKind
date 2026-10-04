const SUPPORT_INBOX = 'support@oncokind.com';

export async function sendInternalEmail(options: {
  subject: string;
  html: string;
  text?: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[email] RESEND_API_KEY is not configured; skipped', options.subject);
    return false;
  }

  const from = process.env.RESEND_FROM_EMAIL ?? 'OncoKind <hello@oncokind.com>';
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [SUPPORT_INBOX],
      subject: options.subject,
      html: options.html,
      text: options.text,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    console.error('[email] Resend failed', response.status, detail);
    return false;
  }
  return true;
}

export async function queueProfessionalBaaEmail(params: {
  userId: string;
  email?: string | null;
  customerId?: string | null;
  subscriptionId?: string | null;
}) {
  return sendInternalEmail({
    subject: 'HIPAA BAA execution required: Professional checkout',
    text: `A Professional plan checkout completed. Queue a HIPAA BAA for execution.\nUser ID: ${params.userId}\nEmail: ${params.email ?? 'unknown'}\nStripe customer: ${params.customerId ?? 'unknown'}\nSubscription: ${params.subscriptionId ?? 'unknown'}`,
    html: `
      <p>A Professional plan checkout completed. Queue a HIPAA Business Associate Agreement for execution.</p>
      <ul>
        <li><strong>User ID:</strong> ${params.userId}</li>
        <li><strong>Email:</strong> ${params.email ?? 'unknown'}</li>
        <li><strong>Stripe customer:</strong> ${params.customerId ?? 'unknown'}</li>
        <li><strong>Subscription:</strong> ${params.subscriptionId ?? 'unknown'}</li>
      </ul>
      <p>Send the BAA to the organization and track signature before activating covered-entity workflows.</p>
    `,
  });
}
