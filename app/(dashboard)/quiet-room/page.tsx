import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { decryptJson } from '@/lib/encryption';
import { QuietRoomExperience } from '@/components/quiet-room/QuietRoomExperience';

export const metadata = {
  title: 'Quiet Room',
  description: 'A private space for caregivers to pause, journal, and find small coping tools.',
};

export default async function QuietRoomPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const [{ data: moodEntries }, { data: journalRows }] = await Promise.all([
    supabase
      .from('caregiver_mood_entries')
      .select('id, mood, entry_date, created_at')
      .eq('user_id', user.id)
      .order('entry_date', { ascending: false })
      .limit(7),
    supabase
      .from('quiet_room_journal_entries')
      .select('id, entry_encrypted, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(12),
  ]);

  const journalEntries = (journalRows ?? [])
    .map((row) => {
      try {
        const decrypted = decryptJson<{ content?: string }>(row.entry_encrypted as string);
        return {
          id: row.id,
          content: decrypted.content ?? '',
          created_at: row.created_at,
        };
      } catch {
        return null;
      }
    })
    .filter(Boolean) as Array<{ id: string; content: string; created_at: string }>;

  return (
    <main className="bg-[var(--color-bg-page)] px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-[var(--max-width-full)]">
        <QuietRoomExperience moodEntries={moodEntries ?? []} journalEntries={journalEntries} />
      </div>
    </main>
  );
}
