import { NextRequest, NextResponse } from 'next/server';
import { staffReminderOnly } from '@/lib/concierge/followup';

function isAuthorized(request: NextRequest) {
  const expected = process.env.CHECK_IN_CRON_SECRET ?? process.env.CRON_SECRET;
  if (!expected) return false;
  const headerSecret = request.headers.get('x-cron-secret');
  const authHeader = request.headers.get('authorization') ?? '';
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  return headerSecret === expected || bearer === expected;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    reminders: 0,
    instruction: staffReminderOnly(),
    sent: 0,
  });
}
