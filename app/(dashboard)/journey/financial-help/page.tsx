import Link from 'next/link';
import { BadgeDollarSign, Clock3 } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Button } from '@/components/ui/button';

type MatchRow = {
  fund_id: string;
  diagnosis_text: string | null;
  match_score: number;
  notification_state: string;
  matched_at: string;
};

type FundRow = {
  id: string;
  fund_name: string;
  current_status: 'open' | 'closed' | 'waitlist';
  eligibility_criteria: string;
  deep_link: string;
  source_slug: string;
};

function formatTimestamp(value?: string | null) {
  if (!value) return 'Awaiting first sync';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return 'Awaiting first sync';
  }
}

export default async function FinancialHelpPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: latestRun, error: runError } = await supabase
    .from('financial_aid_sync_runs')
    .select('completed_at')
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: matches, error: matchError } = await supabase
    .from('user_financial_aid_matches')
    .select('fund_id, diagnosis_text, match_score, notification_state, matched_at')
    .eq('user_id', user.id)
    .order('match_score', { ascending: false })
    .limit(12);

  if (runError || matchError) {
    return (
      <div className="p-6">
        <div className="mx-auto max-w-5xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Financial Help</h1>
          <p className="mt-3 text-slate-600">
            The financial aid feed is being provisioned. Apply the latest migration, then trigger the funding sync job.
          </p>
        </div>
      </div>
    );
  }

  const matchRows = (matches ?? []) as MatchRow[];
  const fundIds = matchRows.map((row) => row.fund_id);
  let fundsById = new Map<string, FundRow>();

  if (fundIds.length > 0) {
    const { data: funds } = await supabase
      .from('financial_aid_funds')
      .select('id, fund_name, current_status, eligibility_criteria, deep_link, source_slug')
      .in('id', fundIds);

    fundsById = new Map(((funds ?? []) as FundRow[]).map((fund) => [fund.id, fund]));
  }

  return (
    <div className="p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Financial Help</h1>
            <p className="mt-2 text-slate-600">
              Live Funding Feed for diagnosis-aware grants and support programs from PAF, HealthWell, and CancerCare.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
            <Clock3 className="h-4 w-4" aria-hidden />
            Last Updated: {formatTimestamp(latestRun?.completed_at)}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <BadgeDollarSign className="h-5 w-5 text-emerald-600" aria-hidden />
            <h2 className="text-lg font-semibold text-slate-900">Matched funds</h2>
          </div>

          {matchRows.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">
              We have not found a diagnosis-specific fund match yet. As soon as a synced fund opens for your condition,
              it will appear here and be marked for notification.
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {matchRows.map((match) => {
                const fund = fundsById.get(match.fund_id);
                return (
                  <article key={match.fund_id} className="rounded-lg border border-slate-200 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-medium text-slate-900">
                          {fund?.fund_name ?? 'Matched financial aid fund'}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          Diagnosis match: {match.diagnosis_text ?? 'Diagnosis-aware match'} · Score {Math.round(match.match_score * 100)}%
                        </p>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                        {(fund?.current_status ?? 'open').toUpperCase()}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-slate-700">
                      {fund?.eligibility_criteria ?? 'Eligibility details will appear after the next sync.'}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Button asChild size="sm">
                        <a href={fund?.deep_link ?? '#'} target="_blank" rel="noopener noreferrer">
                          Open fund details
                        </a>
                      </Button>
                      <span className="text-sm text-slate-500">
                        Source: {(fund?.source_slug ?? 'feed').toUpperCase()} · Notification {match.notification_state}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">What happens next</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>Funds are refreshed every 6 hours via the sync service.</li>
            <li>When a matched fund changes to Open, the match is marked for notification.</li>
            <li>Insurance support and appeal drafting will appear alongside this module in the next phase.</li>
          </ul>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/journey/insurance-support">Open Insurance Support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
