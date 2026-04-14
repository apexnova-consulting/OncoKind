'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Map,
  MessageCircle,
  FileText,
  Calendar,
  FlaskConical,
  FolderPlus,
  HandCoins,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type NavItem = {
  href: string;
  label: string;
  icon: typeof Map;
  upgradeHref?: string;
  advocateOnly?: boolean;
};

const navItems: NavItem[] = [
  { href: '/journey', label: 'Journey Map', icon: Map },
  { href: '/journey/ai-navigator', label: 'AI Navigator', icon: MessageCircle },
  { href: '/journey/documents', label: 'Documents', icon: FileText },
  { href: '/journey/timeline', label: 'Care Timeline', icon: Calendar },
  { href: '/journey/trials', label: 'Clinical Trial Matching', icon: FlaskConical },
  { href: '/journey/second-opinion', label: 'Second Opinion Mode', icon: FolderPlus },
  { href: '/journey/financial-help', upgradeHref: '/pricing?plan=advocate', label: 'Financial Help', icon: HandCoins, advocateOnly: true },
  { href: '/journey/insurance-support', upgradeHref: '/pricing?plan=advocate', label: 'Insurance Support', icon: ShieldCheck, advocateOnly: true },
];

export function JourneySidebar({ hasAdvocateAccess = false }: { hasAdvocateAccess?: boolean }) {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-slate-200 bg-white">
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => {
          const href = item.advocateOnly && !hasAdvocateAccess ? item.upgradeHref ?? item.href : item.href;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
              {item.advocateOnly && !hasAdvocateAccess ? (
                <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                  Upgrade
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
