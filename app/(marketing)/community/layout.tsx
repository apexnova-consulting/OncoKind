import { redirect } from 'next/navigation';
import { isCommunityEnabled } from '@/lib/feature-flags';

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  if (!isCommunityEnabled()) redirect('/support');
  return children;
}
