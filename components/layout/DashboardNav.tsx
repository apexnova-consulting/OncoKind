'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Cloud } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/layout/LanguageSelector';

export function DashboardNav() {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
            <Cloud className="h-6 w-6 text-primary" aria-hidden />
            OncoKind
          </Link>
          <Link href="/journey" className="text-sm text-slate-600 hover:text-slate-900">
            Journey
          </Link>
          <Link href="/dashboard" className="text-sm text-slate-600 hover:text-slate-900">
            Dashboard
          </Link>
          <Link href="/reports" className="text-sm text-slate-600 hover:text-slate-900">
            Reports
          </Link>
          <Link href="/dashboard/billing" className="text-sm text-slate-600 hover:text-slate-900">
            Billing
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSelector />
          <Button variant="ghost" size="sm" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </nav>
    </header>
  );
}
