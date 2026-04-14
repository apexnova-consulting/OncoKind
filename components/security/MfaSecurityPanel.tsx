'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  challengeOnly?: boolean;
  nextPath?: string;
  initialEnabled?: boolean;
};

type TotpFactor = {
  id: string;
  friendly_name?: string | null;
  status?: string | null;
};

type AAL = 'aal1' | 'aal2' | null;

export function MfaSecurityPanel({
  challengeOnly = false,
  nextPath = '/journey',
  initialEnabled = false,
}: Props) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [currentLevel, setCurrentLevel] = useState<AAL>(null);
  const [nextLevel, setNextLevel] = useState<AAL>(null);
  const [enrollmentFactorId, setEnrollmentFactorId] = useState<string | null>(null);
  const [qrSvg, setQrSvg] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [totpFactors, setTotpFactors] = useState<TotpFactor[]>([]);
  const [isEnabled, setIsEnabled] = useState(initialEnabled);

  const refreshState = useCallback(async () => {
    setLoading(true);
    setError(null);

    const [{ data: aalData, error: aalError }, { data: factorsData, error: factorsError }] =
      await Promise.all([
        supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
        supabase.auth.mfa.listFactors(),
      ]);

    if (aalError || factorsError) {
      setError(aalError?.message || factorsError?.message || 'Unable to load MFA status.');
      setLoading(false);
      return;
    }

    const factors = (factorsData?.totp ?? []) as TotpFactor[];
    setCurrentLevel((aalData?.currentLevel as AAL) ?? null);
    setNextLevel((aalData?.nextLevel as AAL) ?? null);
    setTotpFactors(factors);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void refreshState();
  }, [refreshState]);

  useEffect(() => {
    if (!challengeOnly || loading) return;

    if (currentLevel === 'aal2' || nextLevel !== 'aal2' || totpFactors.length === 0) {
      router.replace(nextPath);
      router.refresh();
    }
  }, [challengeOnly, currentLevel, loading, nextLevel, nextPath, router, totpFactors.length]);

  async function persistState(action: 'enabled' | 'disabled' | 'verified', factorId?: string | null) {
    const method = action === 'verified' ? 'PUT' : 'POST';
    await fetch('/api/security/mfa/state', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, factorId }),
    });
  }

  async function beginEnrollment() {
    setWorking(true);
    setError(null);
    setMessage(null);

    const { data, error: enrollError } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: 'OncoKind Authenticator',
    });

    if (enrollError) {
      setError(enrollError.message);
      setWorking(false);
      return;
    }

    setEnrollmentFactorId(data.id);
    setQrSvg(data.totp.qr_code);
    setSecret(data.totp.secret);
    setMessage('Scan the QR code in your authenticator app, then enter the 6-digit code to finish setup.');
    setWorking(false);
  }

  async function verifyEnrollment() {
    if (!enrollmentFactorId || !code.trim()) return;

    setWorking(true);
    setError(null);
    setMessage(null);

    const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
      factorId: enrollmentFactorId,
    });

    if (challengeError) {
      setError(challengeError.message);
      setWorking(false);
      return;
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId: enrollmentFactorId,
      challengeId: challengeData.id,
      code: code.trim(),
    });

    if (verifyError) {
      setError(verifyError.message);
      setWorking(false);
      return;
    }

    await persistState('enabled', enrollmentFactorId);
    setCode('');
    setEnrollmentFactorId(null);
    setQrSvg(null);
    setSecret(null);
    setIsEnabled(true);
    setMessage('Multi-factor authentication is now enabled.');
    await refreshState();
    router.refresh();
    setWorking(false);
  }

  async function verifyChallenge() {
    const factorId = totpFactors[0]?.id;
    if (!factorId || !code.trim()) return;

    setWorking(true);
    setError(null);
    setMessage(null);

    const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
      factorId,
    });

    if (challengeError) {
      setError(challengeError.message);
      setWorking(false);
      return;
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challengeData.id,
      code: code.trim(),
    });

    if (verifyError) {
      setError(verifyError.message);
      setWorking(false);
      return;
    }

    await persistState('verified', factorId);
    router.replace(nextPath);
    router.refresh();
  }

  async function disableMfa() {
    const factorId = totpFactors[0]?.id;
    if (!factorId) return;

    setWorking(true);
    setError(null);
    setMessage(null);

    const { error: unenrollError } = await supabase.auth.mfa.unenroll({
      factorId,
    });

    if (unenrollError) {
      setError(unenrollError.message);
      setWorking(false);
      return;
    }

    await persistState('disabled', factorId);
    setCode('');
    setEnrollmentFactorId(null);
    setQrSvg(null);
    setSecret(null);
    setIsEnabled(false);
    setMessage('Multi-factor authentication has been disabled.');
    await refreshState();
    router.refresh();
    setWorking(false);
  }

  const challengeTitle = challengeOnly ? 'Two-step verification' : 'Security Center';
  const challengeDescription = challengeOnly
    ? 'Enter the current code from your authenticator app to finish signing in.'
    : 'Protect your account with a time-based one-time password from an authenticator app.';

  return (
    <Card className="mx-auto w-full max-w-2xl rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-white/95 shadow-[var(--shadow-lg)]">
      <CardHeader className="space-y-2 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-100)]/70">
        <CardTitle className="font-display text-2xl text-[var(--color-primary-900)]">{challengeTitle}</CardTitle>
        <CardDescription className="text-[var(--color-text-secondary)]">{challengeDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {message && <p className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}

        {!challengeOnly && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <p>MFA status: {isEnabled ? 'Enabled' : 'Not enabled'}</p>
            <p>Session assurance: {currentLevel ?? 'unknown'} {nextLevel ? `-> ${nextLevel}` : ''}</p>
          </div>
        )}

        {loading ? (
          <p className="text-sm text-slate-600">Loading MFA status…</p>
        ) : null}

        {!challengeOnly && !loading && !isEnabled && !qrSvg ? (
          <Button onClick={beginEnrollment} disabled={working}>
            {working ? 'Preparing…' : 'Set up authenticator app'}
          </Button>
        ) : null}

        {!challengeOnly && qrSvg ? (
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="grid gap-4 md:grid-cols-[224px,1fr] md:items-start">
              <Image
                src={`data:image/svg+xml;utf8,${encodeURIComponent(qrSvg)}`}
                alt="Authenticator QR code"
                width={224}
                height={224}
                unoptimized
                className="mx-auto h-56 w-56 rounded-md border border-slate-200 bg-white p-2"
              />
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  Scan this QR code with Google Authenticator, 1Password, or another TOTP app.
                </p>
                {secret ? (
                  <p className="text-sm text-slate-600">
                    Manual key: <span className="font-mono text-slate-900">{secret}</span>
                  </p>
                ) : null}
                <div className="space-y-2">
                  <label htmlFor="mfa-enrollment-code" className="text-sm font-medium text-slate-700">
                    Verification code
                  </label>
                  <Input
                    id="mfa-enrollment-code"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="123456"
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={verifyEnrollment} disabled={working || code.trim().length < 6}>
                    {working ? 'Verifying…' : 'Enable MFA'}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setEnrollmentFactorId(null);
                      setQrSvg(null);
                      setSecret(null);
                      setCode('');
                      setMessage(null);
                    }}
                    disabled={working}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {challengeOnly && !loading ? (
          <div className="space-y-3">
            <div className="space-y-2">
              <label htmlFor="mfa-login-code" className="text-sm font-medium text-slate-700">
                Authenticator code
              </label>
              <Input
                id="mfa-login-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="123456"
                value={code}
                onChange={(event) => setCode(event.target.value)}
              />
            </div>
            <Button onClick={verifyChallenge} disabled={working || code.trim().length < 6}>
              {working ? 'Verifying…' : 'Verify and continue'}
            </Button>
          </div>
        ) : null}

        {!challengeOnly && !loading && isEnabled && !qrSvg ? (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              Your account requires an authenticator code after password sign-in.
            </p>
            <Button variant="outline" onClick={disableMfa} disabled={working}>
              {working ? 'Disabling…' : 'Disable MFA'}
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
