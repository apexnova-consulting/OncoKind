import { NextRequest, NextResponse } from 'next/server';
import { getProfile } from '@/lib/auth';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { isAfter90FlagOn } from '@/lib/after-90/config';

export async function POST(request: NextRequest) {
  if (!isAfter90FlagOn('after90Phase')) {
    return NextResponse.json({ error: 'Not available.' }, { status: 404 });
  }
  const { user } = await getProfile();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  const body = (await request.json()) as { visitOn?: string };
  if (!body.visitOn) return NextResponse.json({ error: 'A care-team date is required.' }, { status: 400 });
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('follow_up_visits').insert({
    user_id: user.id,
    visit_on: body.visitOn,
    kind: 'visit',
  });
  if (error) return NextResponse.json({ error: 'Could not save that date yet.' }, { status: 500 });
  await supabase.from('product_events').insert({
    user_id: user.id,
    event: 'follow_up_prep_used',
    source: 'after90',
  });
  return NextResponse.json({ ok: true });
}
