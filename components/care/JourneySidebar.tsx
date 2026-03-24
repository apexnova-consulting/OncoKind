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
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/journey', label: 'Journey Map', icon: Map },
  { href: '/journey/ai-navigator', label: 'AI Navigator', icon: MessageCircle },
  { href: '/journey/documents', label: 'Documents', icon: FileText },
  { href: '/journey/timeline', label: 'Care Timeline', icon: Calendar },
  { href: '/journey/trials', label: 'Clinical Trials', icon: FlaskConical },
  { href: '/journey/second-opinion', label: 'Second Opinion', icon: FolderPlus },
];

export function JourneySidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-slate-200 bg-white">
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
