'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function VoiceBetaClient() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [useCase, setUseCase] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <main className="mx-auto max-w-xl px-4 py-16">
      <p className="text-sm font-semibold uppercase tracking-widest text-[#0F6E56]">Invite only</p>
      <h1 className="mt-3 font-display text-4xl font-semibold">Request Call for me beta access</h1>
      <p className="mt-4 text-slate-600">
        Call for me is a scoped, user-approved phone tool for process questions. No patient information is spoken. Production
        calling stays off until counsel approves a vendor. We capture only name, email, and use case.
      </p>
      <form
        className="mt-8 space-y-3"
        onSubmit={async (event) => {
          event.preventDefault();
          setError(null);
          const response = await fetch('/api/agents/intake', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, useCase, surface: 'voice-beta' }),
          });
          const json = await response.json();
          if (!response.ok) {
            setError(json.error || 'Unable to send.');
            return;
          }
          setDone(true);
        }}
      >
        <label className="block text-sm font-medium text-slate-700">
          Name
          <input required value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-xl border p-3" />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border p-3" />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Use case
          <textarea required value={useCase} onChange={(event) => setUseCase(event.target.value)} className="mt-2 w-full rounded-xl border p-3" rows={4} />
        </label>
        <Button type="submit">Request beta access</Button>
      </form>
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      {done ? <p className="mt-3 text-sm text-emerald-700">Request received. We will reply if a seat opens.</p> : null}
    </main>
  );
}
