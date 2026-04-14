import { NextRequest, NextResponse } from 'next/server';
import { waitUntil } from '@vercel/functions';
import { liveFinancialAidProvider } from '@/lib/advocacy/financial-aid/live-provider';
import { keywordFallbackMatcher } from '@/lib/advocacy/financial-aid/matcher';
import { mockFinancialAidProvider } from '@/lib/advocacy/financial-aid/mock-provider';
import { syncFinancialAidFunds } from '@/lib/advocacy/financial-aid/service';

export const runtime = 'nodejs';
export const maxDuration = 300;

function isAuthorized(request: NextRequest) {
  const secret = process.env.FINANCIAL_AID_CRON_SECRET;
  if (!secret) return false;

  const authHeader = request.headers.get('authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const headerSecret = request.headers.get('x-cron-secret');
  return bearerToken === secret || headerSecret === secret;
}

async function handleSync(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const provider =
    process.env.FINANCIAL_AID_SCRAPER_MODE === 'mock'
      ? mockFinancialAidProvider
      : liveFinancialAidProvider;

  waitUntil(
    (async () => {
      try {
        const summary = await syncFinancialAidFunds({
          provider,
          matcher: keywordFallbackMatcher,
        });

        console.info('[financial-aid-sync] completed', {
          provider: provider.name,
          syncRunId: summary.syncRunId,
          fundsSeen: summary.fundsSeen,
          pendingNotifications: summary.pendingNotifications,
        });
      } catch (error) {
        console.error('[financial-aid-sync]', error);
      }
    })()
  );

  try {
    return NextResponse.json(
      {
        ok: true,
        accepted: true,
        provider: provider.name,
        mode: process.env.FINANCIAL_AID_SCRAPER_MODE === 'mock' ? 'mock' : 'live',
        message: 'Financial aid sync accepted and running in the background.',
      },
      { status: 202 }
    );
  } catch (error) {
    console.error('[financial-aid-sync-response]', error);
    return NextResponse.json(
      {
        error: 'Unable to queue financial aid sync',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return handleSync(request);
}

export async function POST(request: NextRequest) {
  return handleSync(request);
}
