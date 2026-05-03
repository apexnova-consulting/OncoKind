import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { encryptJson, toSupabaseBytea } from '@/lib/encryption';

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const content = typeof body?.content === 'string' ? body.content.trim() : '';

  if (!content) {
    return NextResponse.json({ error: 'Write something before saving.' }, { status: 400 });
  }

  const encrypted = toSupabaseBytea(
    encryptJson({
      content,
    })
  );

  const { error } = await supabase.from('quiet_room_journal_entries').insert({
    user_id: user.id,
    entry_encrypted: encrypted,
  });

  if (error) {
    return NextResponse.json({ error: 'Unable to save your journal entry right now.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
