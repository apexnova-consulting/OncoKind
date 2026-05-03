import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceRoleSupabaseClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Please sign in to react.' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const threadId = typeof body?.threadId === 'string' ? body.threadId : null;
  const replyId = typeof body?.replyId === 'string' ? body.replyId : null;

  if ((!threadId && !replyId) || (threadId && replyId)) {
    return NextResponse.json({ error: 'Choose a single post to react to.' }, { status: 400 });
  }

  const service = createServiceRoleSupabaseClient();
  const existingQuery = service
    .from('community_reactions')
    .select('id')
    .eq('user_id', user.id);

  const { data: existing } = threadId
    ? await existingQuery.eq('thread_id', threadId).maybeSingle()
    : await existingQuery.eq('reply_id', replyId as string).maybeSingle();

  let reacted = false;

  if (existing?.id) {
    await service.from('community_reactions').delete().eq('id', existing.id);
    reacted = false;
  } else {
    await service.from('community_reactions').insert({
      user_id: user.id,
      thread_id: threadId,
      reply_id: replyId,
      reaction_type: 'heart',
    });
    reacted = true;
  }

  if (replyId) {
    const { count } = await service
      .from('community_reactions')
      .select('id', { count: 'exact', head: true })
      .eq('reply_id', replyId);
    await service.from('community_replies').update({ heart_count: count ?? 0 }).eq('id', replyId);
    return NextResponse.json({ reacted, heartCount: count ?? 0 });
  }

  const { count } = await service
    .from('community_reactions')
    .select('id', { count: 'exact', head: true })
    .eq('thread_id', threadId as string);

  return NextResponse.json({ reacted, heartCount: count ?? 0 });
}
