import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleSupabaseClient } from '@/lib/supabase-server';
import { CONCIERGE_RECORD_RETENTION_DAYS } from '@/lib/legal/retention';

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

  const cutoff = new Date();
  cutoff.setUTCDate(cutoff.getUTCDate() - CONCIERGE_RECORD_RETENTION_DAYS);
  const supabase = createServiceRoleSupabaseClient();
  const { data, error } = await supabase
    .from('concierge_cases')
    .update({
      intake_encrypted: null,
      purged_at: new Date().toISOString(),
    })
    .eq('state', 'case_ready')
    .is('purged_at', null)
    .lt('case_ready_at', cutoff.toISOString())
    .select('id');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    purged: data?.length ?? 0,
    retentionDays: CONCIERGE_RECORD_RETENTION_DAYS,
  });
}
