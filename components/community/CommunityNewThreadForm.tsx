'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CommunityUpgradeModal } from '@/components/community/CommunityUpgradeModal';

export function CommunityNewThreadForm({
  categorySlug,
  canPost,
}: {
  categorySlug: string;
  canPost: boolean;
}) {
  const router = useRouter();
  const [title, setTitle] = useState('');
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

    setSaving(true);
    setError(null);
    try {
      const response = await fetch('/api/community/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categorySlug, title, body }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? 'Unable to create post right now.');
        return;
      }

      router.push(`/community/${categorySlug}/${data.thread.slug}`);
      router.refresh();
    } catch {
      setError('Unable to create post right now.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)]">
        <div>
          <label className="text-sm font-semibold text-[var(--color-primary-900)]" htmlFor="community-title">
            Thread title
          </label>
          <input
            id="community-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-1 w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm"
            maxLength={120}
            required
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-[var(--color-primary-900)]" htmlFor="community-body">
            Your post
          </label>
          <textarea
            id="community-body"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            className="mt-1 min-h-[180px] w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm"
            maxLength={4000}
            required
          />
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            All new posts are moderated to help keep this space safe and kind.
          </p>
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" disabled={saving}>
          {saving ? 'Posting…' : 'Create Thread'}
        </Button>
      </form>
      <CommunityUpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </>
  );
}
