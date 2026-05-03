'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Cloud, MoonStar } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/layout/LanguageSelector';

export function DashboardNav({
  brand,
  isAdmin = false,
}: {
  brand: { displayName: string; logoUrl: string | null };
  isAdmin?: boolean;
}) {
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
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
            {brand.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={brand.logoUrl} alt={brand.displayName} className="h-8 w-auto max-w-[8.5rem] object-contain" />
            ) : (
              <>
                <Cloud className="h-6 w-6 text-primary" aria-hidden />
                {brand.displayName}
              </>
            )}
          </Link>
          <Link href="/dashboard" className="hidden text-sm text-slate-600 hover:text-slate-900 sm:inline-block">
            Home
          </Link>
          <Link href="/journey/timeline" className="hidden text-sm text-slate-600 hover:text-slate-900 sm:inline-block">
            Timeline
          </Link>
          <Link href="/reports" className="hidden text-sm text-slate-600 hover:text-slate-900 sm:inline-block">
            Reports
          </Link>
          <Link href="/journey/second-opinion" className="hidden text-sm text-slate-600 hover:text-slate-900 sm:inline-block">
            Prep Sheet
          </Link>
          <Link href="/dashboard/billing" className="hidden text-sm text-slate-600 hover:text-slate-900 sm:inline-block">
            Billing
          </Link>
          <Link href="/community" className="hidden text-sm text-slate-600 hover:text-slate-900 sm:inline-block">
            Community
          </Link>
          <Link href="/quiet-room" className="hidden items-center gap-1 text-sm text-slate-600 hover:text-slate-900 sm:inline-flex">
            <MoonStar className="h-4 w-4" />
            Quiet Room
          </Link>
          {isAdmin ? (
            <Link href="/admin/organizations" className="hidden text-sm text-slate-600 hover:text-slate-900 sm:inline-block">
              Admin
            </Link>
          ) : null}
          <Link href="/dashboard/security" className="hidden text-sm text-slate-600 hover:text-slate-900 sm:inline-block">
            Security
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
