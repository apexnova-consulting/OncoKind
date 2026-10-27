'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function PartnerInterestForm() {
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [note, setNote] = useState('');
  const [done, setDone] = useState(false);

  return (
    <main className="mx-auto max-w-xl px-4 py-16">
      <h1 className="font-display text-4xl font-semibold">Partner with us</h1>
      <p className="mt-4 text-slate-600">
        Foundations and employers can sponsor Concierge cases. Partner reporting shows case counts and status only, never PHI.
        Do not include patient names or medical details on this form.
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
              body: JSON.stringify({
                email,
                details: `${organization}\n${note}`,
                surface: 'partner',
              }),
            });
            setDone(true);
          }}
        >
          <label className="block text-sm font-medium">
            Work email
            <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border p-3" />
          </label>
          <label className="block text-sm font-medium">
            Organization
            <input required value={organization} onChange={(event) => setOrganization(event.target.value)} className="mt-2 w-full rounded-xl border p-3" />
          </label>
          <label className="block text-sm font-medium">
            How you would like to partner (no medical details)
            <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={4} className="mt-2 w-full rounded-xl border p-3" />
          </label>
          <Button type="submit">Submit partner request</Button>
        </form>
      )}
    </main>
  );
}
