'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function HardshipForm() {
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [done, setDone] = useState(false);
  return (
    <main className="mx-auto max-w-xl px-4 py-16">
      <h1 className="font-display text-4xl font-semibold">Can&apos;t afford this?</h1>
      <p className="mt-4 text-slate-600">
        Request a reduced price or a sponsored case. A person reviews every request. Do not include diagnosis or other medical details.
      </p>
      {done ? (
        <p className="mt-6 text-sm text-emerald-700">Received. We will reply by email.</p>
      ) : (
        <form
          className="mt-8 space-y-3"
          onSubmit={async (event) => {
            event.preventDefault();
            await fetch('/api/concierge/interest', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, details: note, surface: 'hardship' }),
            });
            setDone(true);
          }}
        >
          <label className="block text-sm font-medium">
            Email
            <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border p-3" />
          </label>
          <label className="block text-sm font-medium">
            Why this would help (no medical details)
            <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={4} className="mt-2 w-full rounded-xl border p-3" />
          </label>
          <Button type="submit">Submit request</Button>
        </form>
      )}
    </main>
  );
}
