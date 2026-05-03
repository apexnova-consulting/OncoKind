import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { QuietRoomMood } from '@/lib/quiet-room';

const moods: QuietRoomMood[] = ['exhausted', 'anxious', 'sad', 'numb', 'okay', 'grateful', 'strong'];

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const mood = typeof body?.mood === 'string' ? (body.mood as QuietRoomMood) : null;
  if (!mood || !moods.includes(mood)) {
    return NextResponse.json({ error: 'Choose a valid check-in.' }, { status: 400 });
  }

  const entryDate = new Date().toISOString().slice(0, 10);
  const { error } = await supabase.from('caregiver_mood_entries').upsert(
    {
      user_id: user.id,
      mood,
      entry_date: entryDate,
    },
    { onConflict: 'user_id,entry_date' }
  );

  if (error) {
    return NextResponse.json({ error: 'Unable to save your check-in right now.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
