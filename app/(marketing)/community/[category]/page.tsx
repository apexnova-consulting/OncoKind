import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getProfile } from '@/lib/auth';
import { getCommunityCategory } from '@/lib/community';
import { CommunityAvatar } from '@/components/community/CommunityAvatar';
import { Button } from '@/components/ui/button';
import { formatRelativeTime } from '@/lib/time';

type PageProps = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const current = getCommunityCategory(category);
  return {
    title: current ? `${current.title} Community` : 'Community',
    description: current?.description,
  };
}

export default async function CommunityCategoryPage({ params }: PageProps) {
  const { category } = await params;
  const current = getCommunityCategory(category);
  if (!current) notFound();

  const supabase = await createServerSupabaseClient();
  const { user, hasAdvocateAccess } = await getProfile();

  const { data: threads } = await supabase
    .from('community_threads')
    .select('id, slug, title, body, author_display_name, created_at, is_pinned, reply_count')
    .eq('category_slug', category)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });

  return (
    <main className="bg-[var(--color-bg-page)] px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-[var(--max-width-wide)] space-y-6">
        <section className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-md)]">
          <Link href="/community" className="text-sm font-semibold text-[var(--color-primary-700)] hover:underline">
            ← All categories
          </Link>
          <h1 className="mt-4 font-display text-4xl font-semibold text-[var(--color-primary-900)]">
            {current.title}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)]">
            {current.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild>
              <Link
                href={
                  user
                    ? hasAdvocateAccess
                      ? `/community/new-post?category=${current.slug}`
                      : '/pricing?plan=advocate'
                    : '/login'
                }
              >
                {user ? hasAdvocateAccess ? 'Start a Thread' : 'Upgrade to Post' : 'Sign In to Post'}
              </Link>
            </Button>
          </div>
        </section>

        <section className="space-y-4">
          {(threads ?? []).length === 0 ? (
            <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 text-sm text-[var(--color-text-secondary)] shadow-[var(--shadow-sm)]">
              No approved threads are visible here yet. You can be the first to start one.
            </div>
          ) : (
            (threads ?? []).map((thread) => (
              <article
                key={thread.id}
                className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)]"
              >
                <div className="flex items-start gap-4">
                  <CommunityAvatar name={thread.author_display_name} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {thread.is_pinned ? (
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[var(--tracking-widest)] text-amber-700">
                          Pinned
                        </span>
                      ) : null}
                      <span className="text-xs text-[var(--color-text-muted)]">
                        {thread.author_display_name} · {formatRelativeTime(thread.created_at)}
                      </span>
                    </div>
                    <h2 className="mt-3 font-display text-2xl font-semibold text-[var(--color-primary-900)]">
                      <Link href={`/community/${category}/${thread.slug}`}>{thread.title}</Link>
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                      {thread.body.length > 120 ? `${thread.body.slice(0, 120)}…` : thread.body}
                    </p>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {thread.reply_count} {thread.reply_count === 1 ? 'reply' : 'replies'}
                      </p>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/community/${category}/${thread.slug}`}>Read thread</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>

        <p className="text-center text-sm text-[var(--color-text-muted)]">
          This community is for peer support only and is not a substitute for medical advice.
          Always consult your care team.
        </p>
      </div>
    </main>
  );
}
