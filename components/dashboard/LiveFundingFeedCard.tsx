import Link from 'next/link';
import { BadgeDollarSign } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type MatchRow = {
  fund_id: string;
  match_score: number;
  notification_state: string;
};

type FundRow = {
  id: string;
  fund_name: string;
  current_status: 'open' | 'closed' | 'waitlist';
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

export async function LiveFundingFeedCard() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: syncRuns, error: syncError } = await supabase
    .from('financial_aid_sync_runs')
    .select('completed_at, status')
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })
    .limit(1);

  const { data: matches, error: matchError } = await supabase
    .from('user_financial_aid_matches')
    .select('fund_id, match_score, notification_state')
    .eq('user_id', user.id)
    .order('match_score', { ascending: false })
    .limit(3);

  if (syncError || matchError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live Funding Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            Financial navigation is being provisioned. Apply the latest migration, then run the funding sync job.
          </p>
          <Button asChild className="mt-4">
            <Link href="/journey/financial-help">Open Financial Help</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const matchRows = (matches ?? []) as MatchRow[];
  const fundIds = matchRows.map((row) => row.fund_id);
  let fundsById = new Map<string, FundRow>();

  if (fundIds.length > 0) {
    const { data: funds } = await supabase
      .from('financial_aid_funds')
      .select('id, fund_name, current_status, source_slug')
      .in('id', fundIds);

    fundsById = new Map(
      ((funds ?? []) as FundRow[]).map((fund) => [fund.id, fund])
    );
  }

  const latestCompletedAt = syncRuns?.[0]?.completed_at ?? null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle>Live Funding Feed</CardTitle>
          <p className="mt-2 text-sm text-slate-600">
            Last Updated: {formatTimestamp(latestCompletedAt)}
          </p>
        </div>
        <BadgeDollarSign className="h-5 w-5 text-emerald-600" aria-hidden />
      </CardHeader>
      <CardContent>
        {matchRows.length === 0 ? (
          <p className="text-sm text-slate-600">
            No funding matches yet. Once a synced fund opens for your diagnosis, it will appear here.
          </p>
        ) : (
          <div className="space-y-3">
            {matchRows.map((match) => {
              const fund = fundsById.get(match.fund_id);
              return (
                <div key={match.fund_id} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-900">
                      {fund?.fund_name ?? 'Matched financial aid fund'}
                    </p>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      {(fund?.current_status ?? 'open').toUpperCase()}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    Source: {(fund?.source_slug ?? 'funding-feed').toUpperCase()} · Match score {Math.round(match.match_score * 100)}%
                  </p>
                </div>
              );
            })}
          </div>
        )}
        <Button asChild className="mt-4">
          <Link href="/journey/financial-help">Open Financial Help</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
