import { NextRequest, NextResponse } from 'next/server';
import { sendInternalEmail } from '@/lib/internal-email';
import { containsCrisisLanguage } from '@/lib/agents/safety';

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    name?: string;
    email?: string;
    useCase?: string;
    surface?: string;
    details?: string;
  };
  const email = (body.email ?? '').trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
  }
  const text = `${body.name ?? ''} ${body.useCase ?? ''} ${body.details ?? ''}`;
  if (containsCrisisLanguage(text)) {
    return NextResponse.json({
      ok: true,
      crisis: true,
      message: 'If you are in crisis, call or text 988. Cancer Support Community: 1-888-793-9355.',
    });
  }

  await sendInternalEmail({
    subject: body.surface === 'problem' ? 'Agent output problem report' : 'Call for me beta access request',
    text: `Name: ${body.name ?? ''}\nEmail: ${email}\nUse case: ${body.useCase ?? ''}\nDetails: ${body.details ?? ''}`,
    html: `<p>Name: ${body.name ?? ''}</p><p>Email: ${email}</p><p>Use case: ${body.useCase ?? ''}</p><p>Details: ${body.details ?? ''}</p>`,
  });

  return NextResponse.json({ ok: true });
}
