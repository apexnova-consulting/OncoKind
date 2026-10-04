import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { newInviteToken } from '@/lib/family-invites';
import { sendInternalEmail } from '@/lib/internal-email';

export async function POST(request: NextRequest) {
  if (!isFeatureEnabled('feature_oncokind_family')) {
    return NextResponse.json({ error: 'Feature disabled' }, { status: 404 });
  }
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json().catch(() => ({}));

  const { data: family } = await supabase
    .from('families')
    .select('id')
    .eq('owner_user_id', user.id)
    .maybeSingle();
  if (!family) return NextResponse.json({ error: 'Create a family first' }, { status: 400 });

  const token = newInviteToken();
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin;
  const url = `${origin}/family/claim?token=${token}`;

  await supabase.from('invites').insert({
    family_id: family.id,
    member_id: body.memberId ?? null,
    token,
    channel: body.channel ?? 'link',
    created_by: user.id,
  });

  if (body.email) {
    await sendInternalEmail({
      subject: 'OncoKind Family invite (copy for support)',
      text: `Invite created for ${body.email}: ${url}`,
      html: `<p>Invite for ${body.email}: <a href="${url}">${url}</a></p>`,
    });
  }

  return NextResponse.json({ url, smsHref: `sms:?body=${encodeURIComponent(url)}` });
}
