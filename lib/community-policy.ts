import { isFeatureEnabled } from '@/lib/feature-flags';

export const COMMUNITY_POSTING_PAUSED_MESSAGE =
  'Community posting is paused until a moderator is in place. You can still read approved threads.';

export function isCommunityPostingEnabled(): boolean {
  return isFeatureEnabled('community_posting');
}
