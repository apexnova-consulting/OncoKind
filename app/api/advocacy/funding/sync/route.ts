import { NextRequest, NextResponse } from 'next/server';
import { liveFinancialAidProvider } from '@/lib/advocacy/financial-aid/live-provider';
import { keywordFallbackMatcher } from '@/lib/advocacy/financial-aid/matcher';
import { mockFinancialAidProvider } from '@/lib/advocacy/financial-aid/mock-provider';
import { syncFinancialAidFunds } from '@/lib/advocacy/financial-aid/service';

export const maxDuration = 60;

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

  try {
    const provider =
      process.env.FINANCIAL_AID_SCRAPER_MODE === 'mock'
        ? mockFinancialAidProvider
        : liveFinancialAidProvider;

    const summary = await syncFinancialAidFunds({
      provider,
      matcher: keywordFallbackMatcher,
    });

    return NextResponse.json({
      ok: true,
      summary,
    });
  } catch (error) {
    console.error('[financial-aid-sync]', error);
    return NextResponse.json(
      {
        error: 'Financial aid sync failed',
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
