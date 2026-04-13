import { NextResponse } from 'next/server';
import { getZeroRetentionSnapshot } from '@/lib/privacy/zero-retention-monitor';

export const runtime = 'nodejs';

export async function GET() {
  if (process.env.ENABLE_E2E_TEST_ROUTES !== '1') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(getZeroRetentionSnapshot());
}
