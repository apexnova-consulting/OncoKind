'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { PREP_LIBRARY_CARE_PLAN_NOTE } from '@/lib/ok01';

const TYPES = [
  {
    id: 'goals-of-care',
    label: 'Goals of Care',
    body: 'Questions that help you talk with the care team about what matters most.',
    href: '/journey/goals-of-care',
  },
  {
    id: 'genetic-counseling',
    label: 'Genetic Counseling',
    body: 'Questions to bring to a genetic counseling visit. Each relative consents for themselves.',
    href: '/features/oncokind-family',
  },
  {
    id: 'care-plan',
    label: 'Care Plan Questions',
    body: PREP_LIBRARY_CARE_PLAN_NOTE,
    href: '/features/doctor-prep-sheet',
  },
] as const;

export function PrepSheetLibrary({ initialType }: { initialType?: string }) {
  const initial = TYPES.some((item) => item.id === initialType) ? initialType : TYPES[0].id;
  const [type, setType] = useState(initial ?? TYPES[0].id);
  const selected = useMemo(() => TYPES.find((item) => item.id === type) ?? TYPES[0], [type]);

  return (
    <div className="mt-8 space-y-6">
      <fieldset>
        <legend className="text-sm font-medium">Choose a sheet</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {TYPES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setType(item.id)}
              className={`rounded-2xl border p-4 text-left text-sm font-semibold ${
                type === item.id ? 'border-[#0F6E56] bg-[#E1F5EE] text-[#0F6E56]' : 'border-[#cdd8d5] bg-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </fieldset>
      <article className="rounded-2xl border bg-white p-6">
        <h2 className="font-display text-2xl font-semibold">{selected.label}</h2>
        <p className="mt-3 text-slate-600">{selected.body}</p>
        <Link href={selected.href} className="mt-5 inline-block font-semibold text-[#0F6E56]">
          Open this sheet
        </Link>
      </article>
    </div>
  );
}
