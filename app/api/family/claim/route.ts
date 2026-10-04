import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceRoleSupabaseClient } from '@/lib/supabase-server';
import { isFeatureEnabled } from '@/lib/feature-flags';

export async function POST(request: NextRequest) {
  if (!isFeatureEnabled('feature_oncokind_family')) {
    return NextResponse.json({ error: 'Feature disabled' }, { status: 404 });
  }
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { token } = await request.json();

  const service = createServiceRoleSupabaseClient();
  const { data: invite } = await service.from('invites').select('*').eq('token', token).maybeSingle();
  if (!invite || new Date(invite.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Invite expired' }, { status: 400 });
  }

  if (invite.member_id) {
    await service
      .from('family_members')
      .update({ claimed_by: user.id })
      .eq('id', invite.member_id);
  }
  await service.from('consents').insert({
    family_id: invite.family_id,
    user_id: user.id,
    statement:
      'I consent to adding or editing my own relative health notes in OncoKind Family. I can hide or delete my data at any time.',
    granted: true,
  });
  await service.from('invites').update({ accepted_at: new Date().toISOString() }).eq('id', invite.id);
  return NextResponse.json({ ok: true, familyId: invite.family_id });
}
