'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(
          typeof data.error === 'string'
            ? data.error
            : 'We could not send a reset email just now. Please try again in a few minutes.'
        );
        return;
      }

      setMessage(
        typeof data.message === 'string'
          ? data.message
          : 'If an account exists for that email, we just sent a reset link. Please check your inbox and spam folder.'
      );
    } catch {
      setError('We could not reach the server. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot your password?</CardTitle>
          <CardDescription>
            Enter the email on your OncoKind account and we will send a link to choose a new password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {message ? (
            <div className="space-y-4">
              <p className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-800" role="status">
                {message}
              </p>
              <p className="text-center text-sm text-slate-600">
                <Link href="/login" className="text-slate-800 underline">
                  Back to log in
                </Link>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <p className="rounded-md bg-red-50 p-2 text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}
              <div className="space-y-2">
                <label htmlFor="reset-email" className="text-sm font-medium text-slate-700">
                  Email
                </label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending…' : 'Send reset link'}
              </Button>
              <p className="text-center text-sm text-slate-600">
                Remembered it?{' '}
                <Link href="/login" className="text-slate-800 underline">
                  Log in
                </Link>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
