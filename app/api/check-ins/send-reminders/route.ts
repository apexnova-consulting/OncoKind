import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleSupabaseClient } from '@/lib/supabase-server';

function isAuthorized(request: NextRequest) {
  const expected = process.env.CHECK_IN_CRON_SECRET ?? process.env.CRON_SECRET;
  if (!expected) return false;
  const authHeader = request.headers.get('authorization') ?? '';
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  return bearer === expected;
}

async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    throw new Error('Resend is not configured');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    throw new Error('Email send failed');
  }
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const service = createServiceRoleSupabaseClient();
  const now = new Date().toISOString();
  const { data: appointments } = await service
    .from('prep_sheet_appointments')
    .select('id, appointment_at, report_title, user_id, profiles(email, full_name)')
    .lte('check_in_due_at', now)
    .is('check_in_email_sent_at', null)
    .limit(25);

  let sent = 0;
  let skipped = 0;

  for (const appointment of appointments ?? []) {
    const profile = Array.isArray(appointment.profiles) ? appointment.profiles[0] : appointment.profiles;
    const email = profile?.email;
    if (!email) {
      skipped += 1;
      continue;
    }

    const firstName = (profile?.full_name ?? 'there').split(' ')[0] || 'there';
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.oncokind.com';
    const checkInUrl = `${baseUrl}/journey/check-in/${appointment.id}`;

    try {
      await sendEmail({
        to: email,
        subject: `How did your appointment go, ${firstName}?`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #0d1b2a; line-height: 1.6;">
            <p>Hi ${firstName},</p>
            <p>We hope you are catching your breath after your appointment.</p>
            <p>When you have a minute, we'd love to hear how it went. The check-in takes less than a minute and helps us make OncoKind better for every family that comes after you.</p>
            <p><a href="${checkInUrl}" style="display: inline-block; background: #e8a838; color: #0d1b2a; text-decoration: none; padding: 12px 20px; border-radius: 9999px; font-weight: 700;">Take the 60-second check-in</a></p>
            <p style="font-size: 14px; color: #475569;">This reminder is about your ${new Date(appointment.appointment_at).toLocaleDateString()} appointment${appointment.report_title ? ` for ${appointment.report_title}` : ''}. We only send one reminder. If you no longer want emails like this, reply and let us know.</p>
          </div>
        `,
      });

      await service
        .from('prep_sheet_appointments')
        .update({ check_in_email_sent_at: new Date().toISOString() })
        .eq('id', appointment.id);
      sent += 1;
    } catch {
      skipped += 1;
    }
  }

  return NextResponse.json({ sent, skipped });
}

export const POST = GET;
