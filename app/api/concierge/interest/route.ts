import { NextRequest, NextResponse } from 'next/server';
import { sendInternalEmail } from '@/lib/internal-email';
import { containsCrisisLanguage } from '@/lib/agents/safety';

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { email?: string; details?: string; surface?: string };
  const email = (body.email ?? '').trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
  }
  if (containsCrisisLanguage(`${body.details ?? ''}`)) {
    return NextResponse.json({
      ok: true,
      crisis: true,
      message: 'If you are in crisis, call or text 988. Cancer Support Community: 1-888-793-9355.',
    });
  }
  await sendInternalEmail({
    subject: body.surface === 'hardship' ? 'Concierge hardship request' : 'Concierge interest',
    text: `Email: ${email}\nSurface: ${body.surface ?? ''}\nDetails: ${body.details ?? ''}`,
    html: `<p>Email: ${email}</p><p>Surface: ${body.surface ?? ''}</p>`,
  });
  return NextResponse.json({ ok: true });
}
