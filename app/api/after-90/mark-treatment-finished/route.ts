import { NextResponse } from 'next/server';
import { getProfile } from '@/lib/auth';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { isAfter90FlagOn } from '@/lib/after-90/config';

export async function POST() {
  if (!isAfter90FlagOn('after90Phase') && !isAfter90FlagOn('keepEligibility')) {
    return NextResponse.json({ error: 'Not available.' }, { status: 404 });
  }
  const { user } = await getProfile();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  const supabase = await createServerSupabaseClient();
  await supabase
    .from('profiles')
    .update({ treatment_finished_at: new Date().toISOString() })
    .eq('id', user.id);
  return NextResponse.redirect(new URL('/journey/after-90', process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.oncokind.com'));
}
