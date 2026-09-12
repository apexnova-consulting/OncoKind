'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function friendlyResetError(raw: string): string {
  const lower = raw.toLowerCase();
  if (lower.includes('expired') || lower.includes('otp') || lower.includes('invalid')) {
    return 'This reset link has expired or is no longer valid. Please request a new one.';
  }
  if (lower.includes('least') || lower.includes('weak') || lower.includes('short')) {
    return 'Please choose a password with at least 6 characters.';
  }
  return 'We could not update your password. Please request a new reset link and try again.';
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryError = params.get('error');
    if (queryError === 'expired' || queryError === 'missing_code') {
      setError('This reset link has expired or is no longer valid. Please request a new one.');
      setReady(true);
      return;
    }

    const supabase = createClient();
    let cancelled = false;

    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      setHasRecoverySession(Boolean(data.session));
      if (!data.session) {
        setError('This reset link has expired or is no longer valid. Please request a new one.');
      }
      setReady(true);
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) {
        setHasRecoverySession(true);
        setError(null);
        setReady(true);
      }
    });

    void checkSession();
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Please choose a password with at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Those passwords do not match. Please try again.');
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError(friendlyResetError(updateError.message));
        setLoading(false);
        return;
      }
      await supabase.auth.signOut();
      router.push('/login?reset=success');
      router.refresh();
    } catch {
      setError('We could not reach the server. Check your connection and try again.');
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Choose a new password</CardTitle>
          <CardDescription>
            Pick a new password for your OncoKind account. You will use it the next time you log in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!ready ? (
            <p className="text-sm text-slate-600">Checking your reset link…</p>
          ) : hasRecoverySession ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <p className="rounded-md bg-red-50 p-2 text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}
              <div className="space-y-2">
                <label htmlFor="new-password" className="text-sm font-medium text-slate-700">
                  New password
                </label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="New password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirm-password" className="text-sm font-medium text-slate-700">
                  Confirm new password
                </label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Saving…' : 'Save new password'}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="rounded-md bg-red-50 p-2 text-sm text-red-600" role="alert">
                {error || 'This reset link has expired or is no longer valid. Please request a new one.'}
              </p>
              <Button asChild className="w-full">
                <Link href="/forgot-password">Request a new reset link</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
