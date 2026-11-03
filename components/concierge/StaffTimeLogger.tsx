'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

const STEPS = [
  'intake_review',
  'authorization',
  'records_request',
  'follow_up_call',
  'follow_up_email',
  'packet_assembly',
  'submission',
  'status_documentation',
  'estimate_assistance',
  'family_communication',
  'other',
] as const;

export function StaffTimeLogger({ orderId }: { orderId?: string }) {
  const [step, setStep] = useState<(typeof STEPS)[number]>('intake_review');
  const [minutes, setMinutes] = useState('15');
  const [message, setMessage] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const startedAt = useRef<number | null>(null);

  async function save(loggedMinutes: number) {
    const response = await fetch('/api/concierge/time', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conciergeOrderId: orderId, step, minutes: loggedMinutes }),
    });
    const json = await response.json();
    setMessage(json.message ?? json.error ?? 'Saved.');
  }

  return (
    <form
      className="space-y-3"
      onSubmit={async (event) => {
        event.preventDefault();
        await save(Number(minutes));
      }}
    >
      <label className="block text-sm font-medium">
        Step
        <select
          value={step}
          onChange={(event) => setStep(event.target.value as (typeof STEPS)[number])}
          className="mt-2 w-full rounded-xl border p-3"
        >
          {STEPS.map((item) => (
            <option key={item} value={item}>
              {item.replaceAll('_', ' ')}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-medium">
        Minutes
        <input
          type="number"
          min={1}
          value={minutes}
          onChange={(event) => setMinutes(event.target.value)}
          className="mt-2 w-full rounded-xl border p-3"
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <Button type="submit">Log time</Button>
        <Button
          type="button"
          variant="outline"
          onClick={async () => {
            if (!running) {
              startedAt.current = Date.now();
              setRunning(true);
              setMessage('Timer running.');
              return;
            }
            const elapsed = Math.max(1, Math.round((Date.now() - (startedAt.current ?? Date.now())) / 60000));
            setRunning(false);
            await save(elapsed);
          }}
        >
          {running ? 'Stop timer' : 'Start timer'}
        </Button>
        {orderId ? (
          <Button asChild variant="outline">
            <a href={`/api/concierge/time?conciergeOrderId=${orderId}`}>Download CSV</a>
          </Button>
        ) : null}
      </div>
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
    </form>
  );
}
