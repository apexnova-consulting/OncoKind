'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type Trial = { id?: string; title?: string; status?: string; url?: string };

export function TrialMatchesCard() {
  const [trials, setTrials] = useState<Trial[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('oncology');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/trials?query=${encodeURIComponent(query)}&pageSize=3`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setTrials(Array.isArray(data) ? data : data?.studies ?? []);
      })
      .catch(() => {
        if (!cancelled) setTrials([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [query]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 3 Trial Matches</CardTitle>
        <CardDescription>
          From ClinicalTrials.gov. Try a condition or drug name.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          type="text"
          placeholder="e.g. oncology, breast cancer"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400"
        />
        {loading ? (
          <p className="text-sm text-slate-500">Loading trials…</p>
        ) : trials.length === 0 ? (
          <p className="text-sm text-slate-500">No trials found. Try another search.</p>
        ) : (
          <ul className="space-y-3">
            {trials.map((t, i) => (
              <li key={t.id ?? i} className="border-b border-slate-100 pb-3 last:border-0">
                <a
                  href={t.url ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-800 font-medium hover:underline"
                >
                  {t.title ?? 'Untitled study'}
                </a>
                {t.status && (
                  <span className="ml-2 text-xs text-slate-500">{t.status}</span>
                )}
                {t.id && (
                  <p className="text-xs text-slate-500 mt-0.5">NCT ID: {t.id}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
