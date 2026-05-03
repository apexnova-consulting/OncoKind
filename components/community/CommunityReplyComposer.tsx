'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CommunityUpgradeModal } from '@/components/community/CommunityUpgradeModal';

export function CommunityReplyComposer({
  threadId,
  canPost,
  isLocked,
}: {
  threadId: string;
  canPost: boolean;
  isLocked: boolean;
}) {
  const router = useRouter();
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canPost) {
      setShowUpgrade(true);
      return;
    }
    if (isLocked) {
      setError('This thread is currently locked.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const response = await fetch('/api/community/replies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId, body }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? 'Unable to post your reply right now.');
        return;
      }

      setBody('');
      router.refresh();
    } catch {
      setError('Unable to post your reply right now.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)]">
        <label htmlFor="community-reply" className="text-sm font-semibold text-[var(--color-primary-900)]">
          Add a reply
        </label>
        <textarea
          id="community-reply"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          className="mt-2 min-h-[120px] w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm"
          maxLength={2000}
          placeholder="Share what helped, what you wish you knew sooner, or a question for others who have been here."
          required
        />
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs text-[var(--color-text-muted)]">
            Replies are moderated before they appear to everyone else.
          </p>
          <Button type="submit" disabled={saving || isLocked}>
            {saving ? 'Posting…' : isLocked ? 'Thread locked' : 'Reply'}
          </Button>
        </div>
      </form>
      <CommunityUpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </>
  );
}
