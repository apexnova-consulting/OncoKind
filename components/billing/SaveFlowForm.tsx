'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BEREAVEMENT_MESSAGE, CANCEL_REASONS, BEREAVEMENT_REASON } from '@/lib/after-90/config';

export function SaveFlowForm({
  pauseMonths,
  showSwitchKeep,
  switchKeepLabel,
  cancelLabel,
}: {
  pauseMonths: number[];
  showSwitchKeep: boolean;
  switchKeepLabel: string;
  cancelLabel: string;
}) {
  const [screen, setScreen] = useState<'choose' | 'confirm'>('choose');
  const [months, setMonths] = useState(pauseMonths[0] ?? 1);
  const [reason, setReason] = useState<string>(CANCEL_REASONS[CANCEL_REASONS.length - 1]);
  const [message, setMessage] = useState<string | null>(null);
  const bereavement = reason === BEREAVEMENT_REASON;

  async function submit(choice: 'pause' | 'switch_keep' | 'cancel', confirmed = false) {
    const response = await fetch('/api/billing/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ choice, months, reason, confirmed }),
    });
    const json = await response.json();
    setMessage(json.message ?? json.error ?? 'Saved.');
  }

  if (message) {
    return <p className="mt-6 text-sm text-slate-700">{message}</p>;
  }

  if (screen === 'confirm') {
    return (
      <div className="mt-6 space-y-4">
        {bereavement ? (
          <p className="text-sm text-slate-700">{BEREAVEMENT_MESSAGE}</p>
        ) : (
          <fieldset>
            <legend className="text-sm font-medium">Optional reason</legend>
            {CANCEL_REASONS.map((item) => (
              <label key={item} className="mt-2 flex items-start gap-2 text-sm">
                <input
                  type="radio"
                  name="reason"
                  checked={reason === item}
                  onChange={() => setReason(item)}
                />
                {item}
              </label>
            ))}
          </fieldset>
        )}
        <Button type="button" onClick={() => submit('cancel', true)}>
          Confirm cancellation
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-4">
      <div className="rounded-2xl border p-4">
        <p className="font-semibold">Pause for 1, 2 or 3 months</p>
        <select
          className="mt-3 w-full rounded-xl border p-3"
          value={months}
          onChange={(event) => setMonths(Number(event.target.value))}
        >
          {pauseMonths.map((value) => (
            <option key={value} value={value}>
              {value} month{value === 1 ? '' : 's'}
            </option>
          ))}
        </select>
        <Button type="button" className="mt-3 w-full" onClick={() => submit('pause')}>
          Pause
        </Button>
      </div>
      {showSwitchKeep ? (
        <Button type="button" variant="outline" className="h-auto whitespace-normal py-4" onClick={() => submit('switch_keep')}>
          {switchKeepLabel}
        </Button>
      ) : null}
      <Button type="button" variant="outline" onClick={() => setScreen('confirm')}>
        {cancelLabel}
      </Button>
    </div>
  );
}
