'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function HardshipForm() {
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [requestType, setRequestType] = useState<'concierge' | 'caregiver_pro'>('concierge');
  const [done, setDone] = useState(false);
  return (
    <main className="mx-auto max-w-xl px-4 py-16">
      <h1 className="font-display text-4xl font-semibold">Can&apos;t afford this?</h1>
      <p className="mt-4 text-slate-600">
        Request a reduced price or sponsored Concierge case, or a 60-day Caregiver Pro code. A person
        reviews every request. Do not include diagnosis or other medical details.
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
              body: JSON.stringify({ email, details: note, surface: 'hardship', requestType }),
            });
            setDone(true);
          }}
        >
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">What are you requesting?</legend>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="requestType"
                checked={requestType === 'concierge'}
                onChange={() => setRequestType('concierge')}
              />
              Concierge case
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="requestType"
                checked={requestType === 'caregiver_pro'}
                onChange={() => setRequestType('caregiver_pro')}
              />
              Caregiver Pro code
            </label>
          </fieldset>
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
