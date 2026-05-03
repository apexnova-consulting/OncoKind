import Link from 'next/link';
import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { COMMUNITY_CATEGORIES } from '@/lib/community';
import { getProfile } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { formatRelativeTime } from '@/lib/time';

export const metadata: Metadata = {
  title: 'Community',
  description:
    'A moderated OncoKind community for caregivers and patients to ask questions, share experience, and support one another.',
};

export default async function CommunityLandingPage() {
  const supabase = await createServerSupabaseClient();
  const { data: approvedThreads } = await supabase
    .from('community_threads')
    .select('category_slug, created_at')
    .eq('moderation_status', 'approved');

  const { user, hasAdvocateAccess } = await getProfile();

  const categories = COMMUNITY_CATEGORIES.map((category) => {
    const matches = (approvedThreads ?? []).filter((thread) => thread.category_slug === category.slug);
    const latest = matches
      .map((thread) => thread.created_at)
      .sort((left, right) => new Date(right).getTime() - new Date(left).getTime())[0];

    return {
      ...category,
      count: matches.length,
      latest,
    };
  });

  return (
    <main className="bg-[var(--color-bg-page)] px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-[var(--max-width-wide)] space-y-8">
        <section className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-md)]">
          <p className="text-sm font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-accent-600)]">
            Community
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-[var(--color-primary-900)]">
            You are not alone in this.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--color-text-secondary)]">
            OncoKind&apos;s community is a place for caregivers and patients to share their
            experiences, ask questions, and support each other. All conversations are moderated
            to keep this space safe and kind.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href={user ? '/community/new-post' : '/signup'}>
                {user ? hasAdvocateAccess ? 'Start a New Thread' : 'Upgrade to Post' : 'Sign In to Join'}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/pricing?plan=advocate">See Advocate Plan</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {categories.map((category) => (
            <article
              key={category.slug}
              className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-[var(--color-primary-900)]">
                    {category.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {category.description}
                  </p>
                </div>
                <span className="rounded-full bg-[var(--color-surface-100)] px-3 py-1 text-xs font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-primary-700)]">
                  {category.count} posts
                </span>
              </div>
              <p className="mt-5 text-xs text-[var(--color-text-muted)]">
                {category.latest ? `Most recent activity ${formatRelativeTime(category.latest)}` : 'No posts yet'}
              </p>
              <Button asChild variant="outline" className="mt-5">
                <Link href={`/community/${category.slug}`}>Browse category</Link>
              </Button>
            </article>
          ))}
        </section>

        <p className="text-center text-sm text-[var(--color-text-muted)]">
          This community is for peer support only and is not a substitute for medical advice.
          Always consult your care team.
        </p>
      </div>
    </main>
  );
}
