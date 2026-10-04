'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FAMILY_STARTERS, insightForCancerType, NSGC_DIRECTORY_URL } from '@/content/family-insights/v1';
import { hasCaregiverAccess } from '@/lib/pricing-config';

type Member = {
  id: string;
  relationship: string | null;
  lineage: string | null;
  living_status: string | null;
  cancer_type: string | null;
  diagnosis_age: string | null;
  approx_age: string | null;
  genetic_testing_status: string | null;
  hidden: boolean;
};

export function FamilyTab({
  reportId,
  cancerType,
  tier,
}: {
  reportId: string;
  cancerType?: string | null;
  tier?: string | null;
}) {
  const [members, setMembers] = useState<Member[]>([]);
  const [form, setForm] = useState({ relationship: '', lineage: 'maternal', living_status: 'living', cancer_type: '' });
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const paid = hasCaregiverAccess(tier);

  async function load() {
    const res = await fetch('/api/family');
    const data = await res.json();
    setMembers(data.members ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function addMember() {
    await fetch('/api/family', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, reportId, cancer_type: form.cancer_type || 'I do not know' }),
    });
    setForm({ relationship: '', lineage: 'maternal', living_status: 'living', cancer_type: '' });
    await load();
  }

  async function invite() {
    const res = await fetch('/api/family/invites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel: 'link' }),
    });
    const data = await res.json();
    setInviteUrl(data.url ?? null);
    if (data.url && navigator.share) {
      await navigator.share({ title: 'OncoKind Family invite', url: data.url }).catch(() => undefined);
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm leading-relaxed text-slate-600">
        Building the family tree and sending invites is free. Genetic Counseling Prep Sheet PDF export is on
        Caregiver Pro. Every field can be &quot;I do not know.&quot; No genetic report uploads in this version.
      </p>
      <p className="rounded-lg bg-slate-50 p-3 text-sm">{insightForCancerType(cancerType)}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        <input className="rounded-md border px-3 py-2 text-sm" placeholder="Relationship (or I do not know)" value={form.relationship} onChange={(e) => setForm({ ...form, relationship: e.target.value })} />
        <select className="rounded-md border px-3 py-2 text-sm" value={form.lineage} onChange={(e) => setForm({ ...form, lineage: e.target.value })}>
          <option value="maternal">Maternal</option>
          <option value="paternal">Paternal</option>
          <option value="unknown">I do not know</option>
        </select>
        <select className="rounded-md border px-3 py-2 text-sm" value={form.living_status} onChange={(e) => setForm({ ...form, living_status: e.target.value })}>
          <option value="living">Living</option>
          <option value="deceased">Deceased</option>
          <option value="unknown">I do not know</option>
        </select>
        <input className="rounded-md border px-3 py-2 text-sm" placeholder="Cancer type if known" value={form.cancer_type} onChange={(e) => setForm({ ...form, cancer_type: e.target.value })} />
      </div>
      <Button type="button" onClick={() => void addMember()}>Add relative</Button>

      <svg viewBox="0 0 400 160" className="w-full rounded-lg border bg-white" role="img" aria-label={pedigreeText(members)}>
        {members.slice(0, 8).map((member, index) => {
          const x = 30 + (index % 8) * 46;
          const isMale = (member.relationship ?? '').toLowerCase().includes('father') || (member.relationship ?? '').toLowerCase().includes('brother');
          return isMale ? (
            <rect key={member.id} x={x} y={40} width={28} height={28} fill="#E1F5EE" stroke="#0F6E56" />
          ) : (
            <circle key={member.id} cx={x + 14} cy={54} r={14} fill="#FAEEDA" stroke="#8b5e2a" />
          );
        })}
      </svg>
      <p className="sr-only">{pedigreeText(members)}</p>
      <ul className="space-y-2 text-sm">
        {members.map((member) => (
          <li key={member.id} className="rounded-md border p-3">
            {member.relationship || 'Relative'} ({member.lineage || 'lineage unknown'}). Living status:{' '}
            {member.living_status}. Cancer: {member.cancer_type}.
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="outline" onClick={() => void invite()}>
          Invite via link, SMS, or share sheet
        </Button>
        {inviteUrl ? (
          <a className="text-sm underline" href={`sms:?body=${encodeURIComponent(inviteUrl)}`}>
            SMS fallback
          </a>
        ) : null}
      </div>

      <section className="rounded-lg border p-4 text-sm">
        <h3 className="font-semibold">Conversation starters</h3>
        <p className="mt-2">{FAMILY_STARTERS.sibling}</p>
        <p className="mt-2">{FAMILY_STARTERS.adultChild}</p>
      </section>

      {paid ? (
        <section className="rounded-lg border p-4">
          <h3 className="font-semibold">Genetic Counseling Prep Sheet</h3>
          <p className="mt-2 text-sm">Bring this family summary, the pedigree, and these questions to genetics.</p>
          <ul className="mt-2 list-disc pl-5 text-sm">
            <li>Ask your doctor whether a genetics visit is useful.</li>
            <li>Bring pathology reports and relative health notes you are allowed to share.</li>
            <li>
              Find a counselor:{' '}
              <a className="underline" href={NSGC_DIRECTORY_URL} target="_blank" rel="noreferrer">
                NSGC Find a Genetic Counselor
              </a>
            </li>
          </ul>
          <Button className="mt-3" type="button" onClick={() => window.print()}>
            Export PDF
          </Button>
        </section>
      ) : (
        <p className="text-sm">
          PDF export of the Genetic Counseling Prep Sheet is on Caregiver Pro.{' '}
          <Link className="underline" href="/pricing?plan=pro">
            View Caregiver Pro
          </Link>
        </p>
      )}
    </div>
  );
}

function pedigreeText(members: Member[]): string {
  if (members.length === 0) return 'Empty three-generation pedigree.';
  return members
    .map(
      (member) =>
        `${member.relationship || 'Relative'}, ${member.lineage || 'unknown side'}, ${member.living_status || 'living status unknown'}`
    )
    .join('. ');
}
