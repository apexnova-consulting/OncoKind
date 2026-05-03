import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createServerSupabaseClient, createServiceRoleSupabaseClient } from '@/lib/supabase-server';
import { getProfile } from '@/lib/auth';
import { getCommunityCategory } from '@/lib/community';
import { CommunityAvatar } from '@/components/community/CommunityAvatar';
import { CommunityPostActions } from '@/components/community/CommunityPostActions';
import { CommunityReplyComposer } from '@/components/community/CommunityReplyComposer';
import { Button } from '@/components/ui/button';
import { formatReadableDate, formatRelativeTime } from '@/lib/time';

type PageProps = {
  params: Promise<{ category: string; thread: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, thread } = await params;
  return {
    title: `${thread.replace(/-/g, ' ')} | ${getCommunityCategory(category)?.title ?? 'Community'}`,
  };
}

export default async function CommunityThreadPage({ params }: PageProps) {
  const { category, thread } = await params;
  const current = getCommunityCategory(category);
  if (!current) notFound();

  const supabase = await createServerSupabaseClient();
  const { user, hasAdvocateAccess } = await getProfile();

  const { data: threadRecord } = await supabase
    .from('community_threads')
    .select(
      'id, title, body, author_id, author_display_name, created_at, reply_count, view_count, is_locked'
    )
    .eq('category_slug', category)
    .eq('slug', thread)
    .maybeSingle();

  if (!threadRecord) notFound();

  await createServiceRoleSupabaseClient()
    .from('community_threads')
    .update({ view_count: (threadRecord.view_count ?? 0) + 1 })
    .eq('id', threadRecord.id);

  const [{ data: replies }, { data: threadReaction }] = await Promise.all([
    supabase
      .from('community_replies')
      .select('id, body, author_display_name, created_at, heart_count')
      .eq('thread_id', threadRecord.id)
      .order('created_at', { ascending: true }),
    user
      ? supabase
          .from('community_reactions')
          .select('thread_id')
          .eq('user_id', user.id)
          .eq('thread_id', threadRecord.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const replyIds = (replies ?? []).map((reply) => reply.id);
  const { data: replyReactions } =
    user && replyIds.length > 0
      ? await supabase
          .from('community_reactions')
          .select('reply_id')
          .eq('user_id', user.id)
          .in('reply_id', replyIds)
      : { data: [] };

  const currentUserThreadReacted = Boolean(threadReaction?.thread_id);
  const reactedReplyIds = new Set((replyReactions ?? []).map((reaction) => reaction.reply_id));

  const { count: threadHeartCount } = await supabase
    .from('community_reactions')
    .select('id', { count: 'exact', head: true })
    .eq('thread_id', threadRecord.id);

  return (
    <main className="bg-[var(--color-bg-page)] px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-[var(--max-width-wide)] space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button asChild variant="outline">
            <Link href={`/community/${category}`}>← Back to {current.title}</Link>
          </Button>
          <p className="text-sm text-[var(--color-text-muted)]">
            {threadRecord.view_count + 1} views · {threadRecord.reply_count} replies
          </p>
        </div>

        <article className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-md)]">
          <div className="flex items-start gap-4">
            <CommunityAvatar name={threadRecord.author_display_name} />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-[var(--color-text-muted)]">
                {threadRecord.author_display_name} · {formatRelativeTime(threadRecord.created_at)} ·{' '}
                {formatReadableDate(threadRecord.created_at)}
              </p>
              <h1 className="mt-3 font-display text-4xl font-semibold text-[var(--color-primary-900)]">
                {threadRecord.title}
              </h1>
              <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-[var(--color-text-secondary)]">
                {threadRecord.body}
              </p>
              <div className="mt-5">
                <CommunityPostActions
                  targetType="thread"
                  targetId={threadRecord.id}
                  initialHeartCount={threadHeartCount ?? 0}
                  initiallyReacted={currentUserThreadReacted}
                  canPost={hasAdvocateAccess}
                />
              </div>
            </div>
          </div>
        </article>

        {user ? (
          <CommunityReplyComposer
            threadId={threadRecord.id}
            canPost={hasAdvocateAccess}
            isLocked={threadRecord.is_locked}
          />
        ) : (
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)]">
            <p className="text-sm text-[var(--color-text-secondary)]">
              Sign in to reply to this thread, or upgrade to Advocate to post and send support.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/pricing?plan=advocate">See Advocate Plan</Link>
              </Button>
            </div>
          </div>
        )}

        <section className="space-y-4">
          {(replies ?? []).map((reply) => (
            <article
              key={reply.id}
              className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)]"
            >
              <div className="flex items-start gap-4">
                <CommunityAvatar name={reply.author_display_name} />
                <div className="flex-1">
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {reply.author_display_name} · {formatRelativeTime(reply.created_at)}
                  </p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {reply.body}
                  </p>
                  <div className="mt-4">
                    <CommunityPostActions
                      targetType="reply"
                      targetId={reply.id}
                      initialHeartCount={reply.heart_count ?? 0}
                      initiallyReacted={reactedReplyIds.has(reply.id)}
                      canPost={hasAdvocateAccess}
                    />
                  </div>
                </div>
              </div>
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
