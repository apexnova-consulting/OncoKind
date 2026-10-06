import { NextRequest, NextResponse } from 'next/server';
import { isFeatureEnabled, isVoiceProductionCallingEnabled } from '@/lib/feature-flags';
import { getProfile } from '@/lib/auth';
import { isVoiceInviteAccount, voiceEntitled } from '@/lib/agents/entitlements';
import { ASSISTANCE_PROGRAMS } from '@/content/agents/programs/v1';
import { isUsPhoneAllowlisted } from '@/lib/agents/access/match';
import { getVoiceProvider, VOICE_SCRIPTS, type VoiceCallType } from '@/lib/agents/voice/provider';

export async function POST(request: NextRequest) {
  if (!isFeatureEnabled('feature_voice_call_for_me')) {
    return NextResponse.json({ error: 'Call for me is not enabled.' }, { status: 404 });
  }
  const { user, profile } = await getProfile();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  if (!voiceEntitled(profile?.subscription_tier) || !isVoiceInviteAccount(user.id)) {
    return NextResponse.json({ error: 'Call for me is invite-only on Advocate Plan and Professional.' }, { status: 403 });
  }

  const body = (await request.json()) as {
    programId?: string;
    phone?: string;
    callType?: VoiceCallType;
    approved?: boolean;
    approvedScript?: string;
  };

  if (!body.approved) {
    return NextResponse.json({ error: 'Explicit per-call approval is required.' }, { status: 400 });
  }

  const program = ASSISTANCE_PROGRAMS.find((item) => item.program_id === body.programId);
  if (!program || !body.phone || !isUsPhoneAllowlisted(body.phone, program)) {
    return NextResponse.json({ error: 'Phone numbers must match a verified program record.' }, { status: 400 });
  }

  const script = VOICE_SCRIPTS[body.callType === 'medical_records' ? 'medical_records' : 'assistance_program'];
  if (isVoiceProductionCallingEnabled()) {
    const vendor = getVoiceProvider();
    const placed = await vendor.placeCall({ to: body.phone, script, runId: `voice-${user.id}` });
    return NextResponse.json({ kind: 'blocked', placed });
  }

  return NextResponse.json({
    kind: 'queued_preview',
    script,
    to: body.phone,
    message:
      'No call was placed. Production calling stays off until counsel approves a vendor, BAA, and scripts. Your approval was logged locally in this response only.',
  });
}
