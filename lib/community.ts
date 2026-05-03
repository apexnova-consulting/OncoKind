export type CommunityCategory = {
  slug: string;
  title: string;
  description: string;
};

export const COMMUNITY_CATEGORIES: CommunityCategory[] = [
  {
    slug: 'just-diagnosed',
    title: 'Just Diagnosed',
    description: 'Navigating the first weeks after a diagnosis.',
  },
  {
    slug: 'treatment',
    title: 'Treatment & Side Effects',
    description: "What to expect, what helped, and what didn't.",
  },
  {
    slug: 'insurance-financial',
    title: 'Insurance & Financial Help',
    description: 'Denials, appeals, financial aid wins, and practical next steps.',
  },
  {
    slug: 'caregiver-support',
    title: 'Caregiver Support',
    description: 'For the people showing up every day for someone they love.',
  },
];

const BLOCKED_TERMS = [
  'damn',
  'hell',
  'stupid',
  'idiot',
  'hate',
  'kill yourself',
  'buy now',
  'cheap meds',
  'crypto',
  'bitcoin',
  'cash app',
  'whatsapp',
  'telegram',
  'click here',
];

export function getCommunityCategory(slug: string) {
  return COMMUNITY_CATEGORIES.find((category) => category.slug === slug) ?? null;
}

export function toCommunitySlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

export function buildPublicDisplayName(fullName?: string | null, email?: string | null) {
  const source = fullName?.trim() || email?.split('@')[0] || 'OncoKind member';
  const parts = source
    .replace(/[._-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return 'OncoKind member';

  const first = capitalize(parts[0]);
  const last = parts.length > 1 ? `${parts[parts.length - 1][0]?.toUpperCase()}.` : '';
  return `${first}${last ? ` ${last}` : ''}`;
}

export function initialsForName(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function moderateCommunityText(input: string) {
  const value = input.toLowerCase();
  const matches = BLOCKED_TERMS.filter((term) => value.includes(term));
  return {
    approved: matches.length === 0,
    matches,
  };
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}
