'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CENTER_SEEDS } from '@/content/concierge/centers/v1';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { track } from '@/lib/analytics';
import { CONCIERGE_BRAND } from '@/lib/concierge/config';

export function ConciergeIntake() {
  const [patientFirst, setPatientFirst] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [centerId, setCenterId] = useState(CENTER_SEEDS[0]?.center_id ?? '');
  const [customCenter, setCustomCenter] = useState('');
  const [providers, setProviders] = useState('');
  const [dobKnown, setDobKnown] = useState('not_sure');
  const [message, setMessage] = useState<string | null>(null);
  const purchaseOn = isFeatureEnabled('concierge_purchase');

  const selected = useMemo(
    () => CENTER_SEEDS.find((center) => center.center_id === centerId),
    [centerId]
  );

  return (
    <form
      className="mt-8 space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        track('intake_started');
        const response = await fetch('/api/concierge/intake', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            patientFirst,
            contactName,
            contactEmail,
            centerId: customCenter ? 'custom' : centerId,
            customCenter,
            providers,
            dobKnown,
          }),
        });
        const json = await response.json();
        if (!response.ok) {
          setMessage(json.error || 'Unable to save intake.');
          return;
        }
        track('intake_completed');
        setMessage(json.message);
      }}
    >
      <label className="block text-sm font-medium">
        Patient first name
        <input value={patientFirst} onChange={(event) => setPatientFirst(event.target.value)} className="mt-2 w-full rounded-xl border p-3" />
      </label>
      <label className="block text-sm font-medium">
        Your name (family contact)
        <input required value={contactName} onChange={(event) => setContactName(event.target.value)} className="mt-2 w-full rounded-xl border p-3" />
      </label>
      <label className="block text-sm font-medium">
        Your email
        <input required type="email" value={contactEmail} onChange={(event) => setContactEmail(event.target.value)} className="mt-2 w-full rounded-xl border p-3" />
      </label>
      <label className="block text-sm font-medium">
        Date of birth
        <select value={dobKnown} onChange={(event) => setDobKnown(event.target.value)} className="mt-2 w-full rounded-xl border p-3">
          <option value="not_sure">I am not sure yet</option>
          <option value="will_provide">I will provide it after I check</option>
        </select>
      </label>
      <label className="block text-sm font-medium">
        Destination center
        <select value={centerId} onChange={(event) => setCenterId(event.target.value)} className="mt-2 w-full rounded-xl border p-3">
          {CENTER_SEEDS.map((center) => (
            <option key={center.center_id} value={center.center_id}>
              {center.name} ({center.city}, {center.state}) {center.last_verified_on ? '' : '(unverified)'}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-medium">
        Or enter a custom center
        <input value={customCenter} onChange={(event) => setCustomCenter(event.target.value)} className="mt-2 w-full rounded-xl border p-3" />
      </label>
      {selected ? (
        <p className="text-xs text-slate-500">
          Last verified: {selected.last_verified_on ?? 'not yet verified'}. We do not rank centers.
        </p>
      ) : null}
      <label className="block text-sm font-medium">
        Providers and facilities that hold records (names and cities are enough)
        <textarea value={providers} onChange={(event) => setProviders(event.target.value)} rows={4} className="mt-2 w-full rounded-xl border p-3" />
      </label>
      <p className="text-sm text-slate-600">{CONCIERGE_BRAND.boundary}</p>
      <Button type="submit">{purchaseOn ? 'Save intake and continue' : 'Save intake request'}</Button>
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
    </form>
  );
}
