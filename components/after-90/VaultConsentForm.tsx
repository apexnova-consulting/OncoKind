'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function VaultConsentForm({ consentText }: { consentText: string }) {
  const [accepted, setAccepted] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <form
      className="mt-6 space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        const response = await fetch('/api/vault/consent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accepted, textShown: consentText }),
        });
        const json = await response.json();
        setMessage(json.message ?? json.error ?? 'Saved.');
      }}
    >
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="mt-1" />
        I agree to the Records vault terms shown on this page.
      </label>
      <Button type="submit" disabled={!accepted}>
        Save consent
      </Button>
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
    </form>
  );
}
