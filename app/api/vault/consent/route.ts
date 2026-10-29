import { NextRequest, NextResponse } from 'next/server';
import { getProfile } from '@/lib/auth';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { isAfter90FlagOn } from '@/lib/after-90/config';
import { VAULT_CONSENT_TEXT } from '@/lib/after-90/vault';

export async function POST(request: NextRequest) {
  if (!isAfter90FlagOn('recordsVault')) {
    return NextResponse.json({ error: 'Not available.' }, { status: 404 });
  }
  const { user } = await getProfile();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  const body = (await request.json()) as { accepted?: boolean; textShown?: string };
  if (body.accepted !== true) {
    return NextResponse.json({ error: 'Consent is required before vault storage starts.' }, { status: 400 });
  }
  const supabase = await createServerSupabaseClient();
  await supabase
    .from('profiles')
    .update({
      vault_consent_at: new Date().toISOString(),
      vault_consent_text: body.textShown || VAULT_CONSENT_TEXT,
    })
    .eq('id', user.id);
  await supabase.from('product_events').insert({
    user_id: user.id,
    event: 'vault_consent_given',
    source: 'vault_screen',
  });
  return NextResponse.json({ message: 'Records vault consent saved.' });
}
