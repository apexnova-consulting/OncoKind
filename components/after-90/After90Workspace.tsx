'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  FAMILY_RISK_NAME,
  FOLLOW_UP_VISIT_PREP_NAME,
  RECORDS_VAULT_NAME,
} from '@/lib/after-90/config';

export function After90Workspace({
  vaultConsented,
  hasVaultAccess,
  schedulePrompt,
  askLine,
  familyReminder,
  vaultHref,
  familyHref,
  timelineHref,
  prepHref,
}: {
  vaultConsented: boolean;
  hasVaultAccess: boolean;
  schedulePrompt: string;
  askLine: string;
  familyReminder: string;
  vaultHref: string;
  familyHref: string;
  timelineHref: string;
  prepHref: string;
}) {
  const [diff, setDiff] = useState<string | null>(null);
  const [crisis, setCrisis] = useState(false);
  const [visitOn, setVisitOn] = useState('');

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-[#cdd8d5] bg-white p-6">
        <h2 className="font-semibold text-[#1e2d2b]">{RECORDS_VAULT_NAME}</h2>
        <p className="mt-2 text-sm text-slate-600">
          {vaultConsented
            ? hasVaultAccess
              ? 'Vault storage is on for this account.'
              : 'Vault consent is on file. Storage follows the 90-day rule after a plan ends.'
            : 'Vault storage starts only after you consent on a dedicated screen.'}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href={vaultHref}>Vault consent</Link>
          </Button>
          <Button
            type="button"
            onClick={async () => {
              const response = await fetch('/api/after-90/ready-packet', { method: 'POST' });
              const json = await response.json();
              setDiff(json.message ?? json.error ?? 'Packet requested.');
            }}
          >
            Ready packet
          </Button>
        </div>
      </section>

      <section className="rounded-2xl border border-[#cdd8d5] bg-white p-6">
        <h2 className="font-semibold text-[#1e2d2b]">{FOLLOW_UP_VISIT_PREP_NAME}</h2>
        <p className="mt-2 text-sm text-slate-600">{schedulePrompt}</p>
        <form
          className="mt-4 flex flex-col gap-3 sm:flex-row"
          onSubmit={async (event) => {
            event.preventDefault();
            await fetch('/api/after-90/visits', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ visitOn }),
            });
          }}
        >
          <label className="text-sm font-medium">
            Follow-up date from your care team
            <input
              type="date"
              required
              value={visitOn}
              onChange={(event) => setVisitOn(event.target.value)}
              className="mt-2 w-full rounded-xl border p-3"
            />
          </label>
          <Button type="submit" className="self-end">
            Save date
          </Button>
        </form>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href={prepHref}>Doctor Prep Sheet</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/journey/check-in">After-visit check-in</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={timelineHref}>Care Timeline</Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={async () => {
              const response = await fetch('/api/after-90/compare', { method: 'POST' });
              const json = await response.json();
              setCrisis(Boolean(json.crisis));
              setDiff(json.summary ?? json.error ?? 'No comparison yet.');
            }}
          >
            What changed since last time
          </Button>
        </div>
        {crisis ? (
          <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm">
            If you are in crisis, call or text 988. Cancer Support Community: 1-888-793-9355.
          </p>
        ) : null}
        {diff ? <p className="mt-4 text-sm text-slate-700">{diff}</p> : null}
        <p className="mt-3 text-xs text-slate-500">{askLine}</p>
      </section>

      <section className="rounded-2xl border border-[#cdd8d5] bg-white p-6">
        <h2 className="font-semibold text-[#1e2d2b]">{FAMILY_RISK_NAME}</h2>
        <p className="mt-2 text-sm text-slate-600">
          Invite relatives. Each person creates their own account and gives their own consent. {familyReminder}
        </p>
        <Button asChild className="mt-4">
          <Link href={familyHref}>Open family tree</Link>
        </Button>
      </section>
    </div>
  );
}
