'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function FamilyClaimClient() {
  const params = useSearchParams();
  const token = params.get('token') ?? '';
  const [message, setMessage] = useState<string | null>(null);

  async function claim() {
    const res = await fetch('/api/family/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    const data = await res.json();
    setMessage(res.ok ? 'Claimed. You can hide or delete your own data anytime.' : data.error ?? 'Unable to claim');
  }

  return (
    <main className="mx-auto max-w-lg space-y-4 px-4 py-16">
      <h1 className="font-display text-2xl font-semibold">Join this family tree</h1>
      <p className="text-sm text-[var(--color-text-secondary)]">
        You can claim, edit, hide, or delete your own information. OncoKind does not calculate risk scores or
        screening ages. Ask your doctor about next steps.
      </p>
      <Button type="button" onClick={() => void claim()} disabled={!token}>
        I consent and claim my profile
      </Button>
      {message ? <p className="text-sm">{message}</p> : null}
    </main>
  );
}
