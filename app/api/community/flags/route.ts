import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceRoleSupabaseClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Please sign in to flag a post.' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const threadId = typeof body?.threadId === 'string' ? body.threadId : null;
  const replyId = typeof body?.replyId === 'string' ? body.replyId : null;

  if ((!threadId && !replyId) || (threadId && replyId)) {
    return NextResponse.json({ error: 'Choose a single post to flag.' }, { status: 400 });
  }

  const service = createServiceRoleSupabaseClient();
  const { error } = await service.from('community_flags').insert({
    reporter_id: user.id,
    thread_id: threadId,
    reply_id: replyId,
  });

  if (error) {
    return NextResponse.json({ error: 'Unable to flag that post right now.' }, { status: 500 });
  }

  if (threadId) {
    await service.from('community_threads').update({ is_flagged: true }).eq('id', threadId);
  }
  if (replyId) {
    await service.from('community_replies').update({ is_flagged: true }).eq('id', replyId);
  }

  return NextResponse.json({ ok: true });
}
