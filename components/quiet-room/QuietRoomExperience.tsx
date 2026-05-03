'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  COPING_CARDS,
  QUIET_ROOM_MESSAGES,
  QUIET_ROOM_PROMPTS,
  type QuietRoomMood,
} from '@/lib/quiet-room';
import { formatReadableDate, formatRelativeTime } from '@/lib/time';

type MoodEntry = {
  id: string;
  mood: QuietRoomMood;
  entry_date: string;
  created_at: string;
};

type JournalEntry = {
  id: string;
  content: string;
  created_at: string;
};

const moods: Array<{ id: QuietRoomMood; label: string }> = [
  { id: 'exhausted', label: 'Exhausted' },
  { id: 'anxious', label: 'Anxious' },
  { id: 'sad', label: 'Sad' },
  { id: 'numb', label: 'Numb' },
  { id: 'okay', label: 'Okay' },
  { id: 'grateful', label: 'Grateful' },
  { id: 'strong', label: 'Strong' },
];

export function QuietRoomExperience({
  moodEntries,
  journalEntries,
}: {
  moodEntries: MoodEntry[];
  journalEntries: JournalEntry[];
}) {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState<QuietRoomMood | null>(moodEntries[0]?.mood ?? null);
  const [journalText, setJournalText] = useState('');
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [savingMood, setSavingMood] = useState(false);
  const [savingJournal, setSavingJournal] = useState(false);

  const prompt = QUIET_ROOM_PROMPTS[new Date().getDate() % QUIET_ROOM_PROMPTS.length];
  const moodTrail = moodEntries.slice(0, 7).reverse();
  const cards = useMemo(() => {
    if (!selectedMood) return COPING_CARDS.slice(0, 6);
    return COPING_CARDS.filter((card) => card.moods.includes(selectedMood)).slice(0, 6);
  }, [selectedMood]);

  async function saveMood(mood: QuietRoomMood) {
    setSelectedMood(mood);
    setSavingMood(true);
    await fetch('/api/quiet-room/mood', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood }),
    });
    setSavingMood(false);
    router.refresh();
  }

  async function saveJournal() {
    if (!journalText.trim()) return;
    setSavingJournal(true);
    await fetch('/api/quiet-room/journal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: journalText }),
    });
    setJournalText('');
    setSavingJournal(false);
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <section className="rounded-[var(--radius-xl)] bg-white p-6 shadow-[var(--shadow-md)]">
          <p className="text-sm font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-accent-600)]">
            The Daily Pulse
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-[var(--color-primary-900)]">
            How are you holding up today?
          </h1>
          <div className="mt-6 flex flex-wrap gap-3">
            {moods.map((mood) => (
              <button
                key={mood.id}
                type="button"
                onClick={() => saveMood(mood.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  selectedMood === mood.id
                    ? 'bg-[var(--color-primary-900)] text-white'
                    : 'bg-[var(--color-surface-100)] text-[var(--color-primary-700)] hover:bg-[var(--color-surface-200)]'
                }`}
              >
                {mood.label}
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {selectedMood ? QUIET_ROOM_MESSAGES[selectedMood] : 'You can answer or skip. This space is here when you need it.'}
          </p>
          {savingMood ? <p className="mt-2 text-xs text-[var(--color-text-muted)]">Saving your check-in…</p> : null}
          {moodTrail.length >= 7 ? (
            <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-100)] p-4">
              <p className="text-sm font-semibold text-[var(--color-primary-900)]">Your quiet 7-day mood trail</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {moodTrail.map((entry) => (
                  <div key={entry.id} className="flex flex-col items-center gap-2">
                    <span className={`h-4 w-4 rounded-full ${moodDotTone(entry.mood)}`} />
                    <span className="text-[11px] uppercase tracking-[var(--tracking-wide)] text-[var(--color-text-muted)]">
                      {new Date(entry.entry_date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        <section className="rounded-[var(--radius-xl)] bg-white p-6 shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-accent-600)]">
                Coping cards
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-[var(--color-primary-900)]">
                Small tools for a very hard season
              </h2>
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {cards.map((card) => (
              <article key={card.id} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5">
                <p className="text-xs font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-sage-600)]">
                  {card.category}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold text-[var(--color-primary-900)]">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {card.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[var(--radius-xl)] bg-white p-6 shadow-[var(--shadow-sm)]">
          <p className="text-sm font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-accent-600)]">
            Private journal
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-[var(--color-primary-900)]">
            A place to set things down
          </h2>
          <textarea
            value={journalText}
            onChange={(event) => setJournalText(event.target.value)}
            placeholder={prompt}
            className="mt-5 min-h-[180px] w-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[linear-gradient(180deg,#fffdf9_0%,#f8f2e8_100%)] px-5 py-4 text-sm leading-relaxed"
          />
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-xs text-[var(--color-text-muted)]">
              Your journal is private. OncoKind does not read, moderate, or analyze your entries.
            </p>
            <Button type="button" onClick={saveJournal} disabled={savingJournal}>
              {savingJournal ? 'Saving…' : 'Save Entry'}
            </Button>
          </div>

          <div className="mt-6 space-y-3">
            {journalEntries.map((entry) => {
              const firstLine = entry.content.split('\n').find((line) => line.trim()) ?? entry.content;
              const open = expandedEntry === entry.id;
              return (
                <article key={entry.id} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4">
                  <button
                    type="button"
                    onClick={() => setExpandedEntry(open ? null : entry.id)}
                    className="flex w-full items-start justify-between gap-3 text-left"
                  >
                    <div>
                      <p className="font-semibold text-[var(--color-primary-900)]">
                        {formatReadableDate(entry.created_at)}
                      </p>
                      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                        {firstLine.length > 90 ? `${firstLine.slice(0, 90)}…` : firstLine}
                      </p>
                    </div>
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {formatRelativeTime(entry.created_at)}
                    </span>
                  </button>
                  {open ? (
                    <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-text-secondary)]">
                      {entry.content}
                    </p>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>
      </div>

      <aside className="space-y-6">
        <section className="rounded-[var(--radius-xl)] bg-[var(--color-primary-900)] p-6 text-white shadow-[var(--shadow-md)]">
          <p className="text-sm font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-accent-400)]">
            A soft reminder
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-surface-200)]">
            This is not therapy. It is a place to breathe, to be honest, and to remember that the
            person holding everything together still deserves care.
          </p>
        </section>
        <section className="rounded-[var(--radius-xl)] bg-white p-6 shadow-[var(--shadow-sm)]">
          <p className="text-sm font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-accent-600)]">
            Crisis resources
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            <li>If you&apos;re struggling and need to talk to someone:</li>
            <li>988 Suicide & Crisis Lifeline — call or text 988</li>
            <li>Crisis Text Line — text HOME to 741741</li>
            <li>Family Caregiver Alliance Helpline — 1-800-445-8106</li>
          </ul>
        </section>
        <section className="rounded-[var(--radius-xl)] bg-white p-6 shadow-[var(--shadow-sm)]">
          <p className="text-sm font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-accent-600)]">
            Privacy
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            Your journal stays private. It is append-only, never shared publicly, and not used for
            analytics or AI processing.
          </p>
        </section>
      </aside>
    </div>
  );
}

function moodDotTone(mood: QuietRoomMood) {
  switch (mood) {
    case 'exhausted':
      return 'bg-amber-400';
    case 'anxious':
      return 'bg-violet-400';
    case 'sad':
      return 'bg-sky-400';
    case 'numb':
      return 'bg-slate-400';
    case 'okay':
      return 'bg-emerald-400';
    case 'grateful':
      return 'bg-[var(--color-accent-400)]';
    case 'strong':
      return 'bg-[var(--color-primary-700)]';
  }
}
