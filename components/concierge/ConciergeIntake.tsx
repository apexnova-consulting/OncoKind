'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CENTER_SEEDS } from '@/content/concierge/centers/v1';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { track } from '@/lib/analytics';
import { CONCIERGE_BRAND } from '@/lib/concierge/config';
import { CONCIERGE_REFUND_CHECKBOX_LABEL, CONCIERGE_REFUND_TERMS } from '@/lib/legal/refunds';

export function ConciergeIntake() {
  const [patientFirst, setPatientFirst] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [centerId, setCenterId] = useState(CENTER_SEEDS[0]?.center_id ?? '');
  const [customCenter, setCustomCenter] = useState('');
  const [providers, setProviders] = useState('');
  const [dobKnown, setDobKnown] = useState('not_sure');
  const [message, setMessage] = useState<string | null>(null);
  const [adultPatient, setAdultPatient] = useState(false);
  const [usFacility, setUsFacility] = useState(false);
  const [refundAccepted, setRefundAccepted] = useState(false);
  const [sponsorCode, setSponsorCode] = useState('');
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
        if (!adultPatient || !usFacility) {
          setMessage('Concierge is for adult patients at US facilities.');
          return;
        }
        if (!refundAccepted) {
          setMessage('Please accept the refund terms before continuing.');
          return;
        }
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
            adultPatient,
            usFacility,
            refundAccepted,
            sponsorCode,
          }),
        });
        const json = await response.json();
        if (!response.ok) {
          setMessage(json.error || 'Unable to save intake.');
          return;
        }
        track('intake_completed');
        if (purchaseOn && !json.waitlist) {
          const checkout = await fetch('/api/concierge/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refundAccepted: true, sponsorCode }),
          });
          const paid = await checkout.json();
          if (checkout.ok && paid.url) {
            window.location.href = paid.url;
            return;
          }
          if (paid.waitlist) {
            setMessage(paid.error || 'New cases are full this week. Join the list and we will email you when a spot opens.');
            return;
          }
        }
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
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" checked={adultPatient} onChange={(event) => setAdultPatient(event.target.checked)} className="mt-1" />
        The patient is 18 or older.
      </label>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" checked={usFacility} onChange={(event) => setUsFacility(event.target.checked)} className="mt-1" />
        The destination facility is in the United States.
      </label>
      <p className="text-xs text-slate-500">{CONCIERGE_REFUND_TERMS}</p>
      <label className="block text-sm font-medium">
        Have a foundation sponsor code? (e.g., STAAR-2026)
        <input
          value={sponsorCode}
          onChange={(event) => setSponsorCode(event.target.value)}
          className="mt-2 w-full rounded-xl border p-3"
          autoComplete="off"
        />
      </label>
      <p className="rounded-xl bg-[#E1F5EE] px-4 py-3 text-sm font-semibold text-[#0F6E56]">
        Full refund any time before we send the first records request, or if we do not send one within 10 business days of a complete authorization and intake.
      </p>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" checked={refundAccepted} onChange={(event) => setRefundAccepted(event.target.checked)} className="mt-1" />
        {CONCIERGE_REFUND_CHECKBOX_LABEL}
      </label>
      <Button type="submit">{purchaseOn ? 'Continue to payment' : 'Save intake and request a case'}</Button>
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
    </form>
  );
}
