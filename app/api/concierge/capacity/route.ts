import { NextResponse } from 'next/server';
import { createServiceRoleSupabaseClient } from '@/lib/supabase-server';
import { conciergeWaitlistMessage, isConciergeAtWeeklyCap, weekStartUtc } from '@/lib/concierge/capacity';

export async function GET() {
  try {
    const admin = createServiceRoleSupabaseClient();
    const { count } = await admin
      .from('concierge_cases')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', weekStartUtc().toISOString())
      .not('state', 'in', '(cancelled,refunded)');
    const atCap = isConciergeAtWeeklyCap(count ?? 0);
    return NextResponse.json({
      atCap,
      message: atCap ? conciergeWaitlistMessage() : null,
    });
  } catch {
    return NextResponse.json({ atCap: false, message: null });
  }
}
