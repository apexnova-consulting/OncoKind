import { NextRequest, NextResponse } from 'next/server';
import { CTP_RULES } from '@/content/agents/ctp-rules/v1';
import { ASSISTANCE_PROGRAMS } from '@/content/agents/programs/v1';
import { sendInternalEmail } from '@/lib/internal-email';

function isAuthorized(request: NextRequest) {
  const expected = process.env.CHECK_IN_CRON_SECRET ?? process.env.CRON_SECRET;
  if (!expected) return false;
  const headerSecret = request.headers.get('x-cron-secret');
  const authHeader = request.headers.get('authorization') ?? '';
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  return headerSecret === expected || bearer === expected;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const today = new Date().toISOString().slice(0, 10);
  const staleRules = CTP_RULES.filter((rule) => rule.next_review_due <= today);
  const stalePrograms = ASSISTANCE_PROGRAMS.filter((program) => program.next_verification_due <= today);
  if (staleRules.length || stalePrograms.length) {
    await sendInternalEmail({
      subject: 'Agent content review due',
      text: `Rules: ${staleRules.map((item) => item.rule_id).join(', ')}\nPrograms: ${stalePrograms.map((item) => item.program_id).join(', ')}`,
      html: `<p>Rules due: ${staleRules.length}</p><p>Programs due: ${stalePrograms.length}</p>`,
    });
  }
  return NextResponse.json({ staleRules: staleRules.length, stalePrograms: stalePrograms.length });
}
