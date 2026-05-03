import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceRoleSupabaseClient } from '@/lib/supabase-server';
import { buildPublicDisplayName, moderateCommunityText } from '@/lib/community';

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Please sign in to reply.' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const threadId = typeof body?.threadId === 'string' ? body.threadId : '';
  const content = typeof body?.body === 'string' ? body.body.trim() : '';

  if (!threadId || content.length < 5) {
    return NextResponse.json({ error: 'Please add a little more detail to your reply.' }, { status: 400 });
  }

  const [{ data: profile }, { data: thread }] = await Promise.all([
    supabase
      .from('profiles')
      .select('full_name, email, subscription_tier')
      .eq('id', user.id)
      .maybeSingle(),
    supabase
      .from('community_threads')
      .select('id, is_locked')
      .eq('id', threadId)
      .maybeSingle(),
  ]);

  const canPost =
    profile?.subscription_tier === 'advocate' || profile?.subscription_tier === 'enterprise';

  if (!canPost) {
    return NextResponse.json({ error: 'Posting requires the Advocate Plan.' }, { status: 402 });
  }
  if (!thread) {
    return NextResponse.json({ error: 'That thread could not be found.' }, { status: 404 });
  }
  if (thread.is_locked) {
    return NextResponse.json({ error: 'That thread is currently locked.' }, { status: 409 });
  }

  const moderation = moderateCommunityText(content);
  const service = createServiceRoleSupabaseClient();
  const { error } = await service.from('community_replies').insert({
    thread_id: threadId,
    body: content,
    author_id: user.id,
    author_display_name: buildPublicDisplayName(profile?.full_name, profile?.email ?? user.email),
    moderation_status: moderation.approved ? 'approved' : 'pending',
    is_moderated: moderation.approved,
  });

  if (error) {
    return NextResponse.json({ error: 'Unable to post your reply right now.' }, { status: 500 });
  }

  const { count } = await service
    .from('community_replies')
    .select('id', { count: 'exact', head: true })
    .eq('thread_id', threadId)
    .eq('moderation_status', 'approved');

  await service
    .from('community_threads')
    .update({ reply_count: count ?? 0, updated_at: new Date().toISOString() })
    .eq('id', threadId);

  return NextResponse.json({ ok: true });
}
