import { NextResponse } from 'next/server';
import { createServiceRoleSupabaseClient } from '@/lib/supabase-server';

/** ISO date string — update this if the waitlist period needs extending. */
const WAITLIST_END_DATE = process.env.WAITLIST_END_DATE ?? '2026-06-30T23:59:59Z';

function isWaitlistActive(): boolean {
  // Allow env-var kill-switch: NEXT_PUBLIC_WAITLIST_ENABLED=false closes immediately
  if (process.env.NEXT_PUBLIC_WAITLIST_ENABLED === 'false') return false;
  return new Date() < new Date(WAITLIST_END_DATE);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

async function sendConfirmationEmail(email: string, name?: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return; // Resend not configured — skip silently

  const firstName = name?.trim().split(' ')[0] ?? 'there';

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'OncoKind <hello@oncokind.com>',
      to: [email],
      reply_to: 'support@oncokind.com',
      subject: "You're on the OncoKind waitlist 💚",
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family: 'DM Sans', system-ui, sans-serif; background:#FAFAF8; margin:0; padding:0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAF8; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#FFFFFF; border-radius:16px; border:1px solid #E8E6E0; padding:40px 40px 32px; box-shadow:0 2px 8px rgba(26,35,50,0.06);">
          <tr>
            <td>
              <p style="font-family:Georgia,serif; font-style:italic; font-size:24px; color:#1A2332; margin:0 0 8px;">OncoKind</p>
              <p style="font-size:12px; color:#8896A4; margin:0 0 32px; letter-spacing:0.06em; text-transform:uppercase; font-weight:600;">Clarity for families navigating cancer</p>

              <p style="font-size:18px; color:#1A2332; font-weight:600; margin:0 0 16px;">Hi ${firstName} — you&rsquo;re in.</p>

              <p style="font-size:16px; color:#4A5568; line-height:1.7; margin:0 0 16px;">
                Thank you for joining the OncoKind waitlist. We&rsquo;re building something that matters — a platform designed specifically for the family beside the patient. Not for the hospital. Not for the insurance company. For you.
              </p>

              <p style="font-size:16px; color:#4A5568; line-height:1.7; margin:0 0 24px;">
                When we launch, you&rsquo;ll be among the first to know — with early access and founding member pricing.
              </p>

              <div style="background:#F4F3EF; border-radius:12px; padding:20px 24px; margin:0 0 28px;">
                <p style="font-size:14px; color:#4A5568; margin:0 0 8px; font-weight:600;">What OncoKind does:</p>
                <ul style="font-size:14px; color:#4A5568; margin:0; padding:0 0 0 20px; line-height:1.8;">
                  <li>Translates pathology reports into plain English</li>
                  <li>Generates personalized Doctor Prep Sheets before every appointment</li>
                  <li>Matches your family to clinical trials in plain language</li>
                  <li>Helps fight insurance denials with structured appeal packets</li>
                  <li>Every word passes through the Empathy Filter — no survival stats</li>
                </ul>
              </div>

              <p style="font-size:14px; color:#8896A4; line-height:1.7; margin:0 0 24px;">
                In the meantime, if you have questions or just want to talk about what you&rsquo;re navigating, you can reply to this email. We&rsquo;re here.
              </p>

              <p style="font-size:14px; color:#1A2332; font-style:italic; margin:0;">
                — Mike Nielson, Founder<br />
                <span style="font-size:13px; color:#8896A4; font-style:normal;">OncoKind &middot; <a href="https://www.oncokind.com" style="color:#2E6B5E;">oncokind.com</a></span>
              </p>
            </td>
          </tr>
        </table>
        <p style="font-size:11px; color:#8896A4; margin:20px 0 0; text-align:center;">
          OncoKind is an educational support tool — not a substitute for professional medical advice.<br />
          You received this because you signed up at oncokind.com. <a href="mailto:support@oncokind.com" style="color:#8896A4;">Unsubscribe</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`,
    }),
  }).catch((err) => {
    // Non-fatal — signup is still recorded in DB
    console.error('[waitlist] Resend failed:', err);
  });
}

export async function POST(request: Request) {
  try {
    if (!isWaitlistActive()) {
      return NextResponse.json(
        { error: 'The waitlist is no longer accepting new signups.' },
        { status: 410 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const name = typeof body?.name === 'string' ? body.name.trim().slice(0, 120) : undefined;
    const source = typeof body?.source === 'string' ? body.source.slice(0, 40) : 'banner';

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }

    const supabase = createServiceRoleSupabaseClient();

    const { error: dbError } = await supabase
      .from('waitlist')
      .insert({ email, name: name || null, source })
      .select('id')
      .single();

    if (dbError) {
      // Unique constraint violation → already on the list
      if (dbError.code === '23505') {
        return NextResponse.json({ ok: true, already: true });
      }
      console.error('[waitlist] DB error:', dbError);
      return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
    }

    // Best-effort confirmation email (fire and forget)
    void sendConfirmationEmail(email, name);

    return NextResponse.json({ ok: true, already: false });
  } catch (err) {
    console.error('[waitlist]', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
