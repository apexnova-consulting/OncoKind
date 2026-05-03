'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CommunityUpgradeModal } from '@/components/community/CommunityUpgradeModal';

export function CommunityPostActions({
  targetType,
  targetId,
  initialHeartCount,
  initiallyReacted,
  canPost,
}: {
  targetType: 'thread' | 'reply';
  targetId: string;
  initialHeartCount: number;
  initiallyReacted: boolean;
  canPost: boolean;
}) {
  const [heartCount, setHeartCount] = useState(initialHeartCount);
  const [reacted, setReacted] = useState(initiallyReacted);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [flagged, setFlagged] = useState(false);

  async function toggleReaction() {
    if (!canPost) {
      setShowUpgrade(true);
      return;
    }

    const response = await fetch('/api/community/reactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        targetType === 'thread'
          ? { threadId: targetId }
          : { replyId: targetId }
      ),
    });
    const data = await response.json();
    if (!response.ok) return;
    setHeartCount(data.heartCount ?? heartCount);
    setReacted(Boolean(data.reacted));
  }

  async function flagPost() {
    const response = await fetch('/api/community/flags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        targetType === 'thread'
          ? { threadId: targetId }
          : { replyId: targetId }
      ),
    });

    if (response.ok) {
      setFlagged(true);
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button type="button" variant={reacted ? 'default' : 'outline'} size="sm" onClick={toggleReaction}>
          Support {heartCount > 0 ? `(${heartCount})` : ''}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={flagPost} disabled={flagged}>
          {flagged ? 'Flagged' : 'Flag'}
        </Button>
      </div>
      <CommunityUpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </>
  );
}
