'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Map,
  ScanSearch,
  Calendar,
  FolderPlus,
  FileText,
  ShieldCheck,
  HandCoins,
  MapPin,
  FlaskConical,
  Heart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { isFeatureEnabled } from '@/lib/feature-flags';

type NavItem = {
  href: string;
  label: string;
  icon: typeof Map;
  upgradeHref?: string;
  paidOnly?: 'caregiver' | 'plus';
  agent?: 'feature_complete_the_picture' | 'feature_access_agent';
};

const stages: Array<{ name: string; items: NavItem[] }> = [
  {
    name: 'Understand',
    items: [
      { href: '/journey', label: 'Journey Map', icon: Map },
      { href: '/journey/complete-the-picture', label: 'Complete the Picture', icon: ScanSearch, agent: 'feature_complete_the_picture' },
    ],
  },
  {
    name: 'Prepare',
    items: [
      { href: '/journey/timeline', label: 'Care Timeline', icon: Calendar },
      { href: '/journey/documents', label: 'Documents', icon: FileText },
      { href: '/journey/second-opinion', label: 'Second Opinion Mode', icon: FolderPlus },
    ],
  },
  {
    name: 'Fight',
    items: [
      { href: '/journey/insurance-support', upgradeHref: '/pricing?plan=pro', label: 'Insurance Support', icon: ShieldCheck, paidOnly: 'caregiver' },
      { href: '/journey/financial-help', upgradeHref: '/pricing?plan=advocate', label: 'Financial Help', icon: HandCoins, paidOnly: 'plus' },
      { href: '/journey/access-agent', label: 'Access Agent', icon: MapPin, agent: 'feature_access_agent' },
    ],
  },
  {
    name: 'Plan ahead',
    items: [
      { href: '/journey/trials', label: 'Clinical Trial Matching', icon: FlaskConical },
      { href: '/journey/concierge', label: 'Concierge case', icon: Heart },
    ],
  },
];

export function JourneySidebar({
  hasCaregiverAccess = false,
  hasAdvocateAccess = false,
}: {
  hasCaregiverAccess?: boolean;
  hasAdvocateAccess?: boolean;
}) {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-slate-200 bg-white">
      <nav className="flex flex-col gap-4 p-4">
        {stages.map((stage) => (
          <div key={stage.name}>
            <p className="px-3 text-[0.65rem] font-bold uppercase tracking-widest text-[#0F6E56]">{stage.name}</p>
            <div className="mt-1 flex flex-col gap-1">
              {stage.items
                .filter((item) => !item.agent || isFeatureEnabled(item.agent))
                .map((item) => {
                  const locked =
                    (item.paidOnly === 'caregiver' && !hasCaregiverAccess) ||
                    (item.paidOnly === 'plus' && !hasAdvocateAccess);
                  const href = locked ? item.upgradeHref ?? item.href : item.href;
                  const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {item.label}
                      {locked ? (
                        <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                          Pro
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
