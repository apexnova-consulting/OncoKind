import { requireAdmin } from '@/lib/admin';
import { createServiceRoleSupabaseClient } from '@/lib/supabase-server';
import { formatReadableDate } from '@/lib/time';

export const metadata = {
  title: 'Community Admin',
  description: 'Review pending community moderation items.',
};

export default async function CommunityAdminPage() {
  await requireAdmin();
  const service = createServiceRoleSupabaseClient();

  const [{ data: flags }, { data: pendingThreads }, { data: pendingReplies }] = await Promise.all([
    service
      .from('community_flags')
      .select('id, thread_id, reply_id, status, created_at')
      .eq('status', 'pending')
      .order('created_at', { ascending: false }),
    service
      .from('community_threads')
      .select('id, title, author_display_name, created_at')
      .eq('moderation_status', 'pending')
      .order('created_at', { ascending: false }),
    service
      .from('community_replies')
      .select('id, body, author_display_name, created_at')
      .eq('moderation_status', 'pending')
      .order('created_at', { ascending: false }),
  ]);

  return (
    <main className="bg-[var(--color-bg-page)] px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-[var(--max-width-full)] space-y-6">
        <section className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-md)]">
          <p className="text-sm font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-accent-600)]">
            Admin
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-[var(--color-primary-900)]">
            Community moderation
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            A lightweight queue for pending posts, replies, and user flags.
          </p>
        </section>

        <section className="rounded-[var(--radius-xl)] bg-white p-6 shadow-[var(--shadow-sm)]">
          <h2 className="font-display text-2xl font-semibold text-[var(--color-primary-900)]">
            Pending flags
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-[var(--color-text-muted)]">
                  <th className="px-3 py-3">Flag</th>
                  <th className="px-3 py-3">Target</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {(flags ?? []).map((flag) => (
                  <tr key={flag.id} className="border-b border-[var(--color-border-subtle)]">
                    <td className="px-3 py-4 font-medium text-[var(--color-primary-900)]">{flag.id.slice(0, 8)}</td>
                    <td className="px-3 py-4">{flag.thread_id ? `Thread ${flag.thread_id.slice(0, 8)}` : `Reply ${flag.reply_id?.slice(0, 8)}`}</td>
                    <td className="px-3 py-4">{flag.status}</td>
                    <td className="px-3 py-4">{formatReadableDate(flag.created_at)}</td>
                  </tr>
                ))}
                {!flags?.length ? (
                  <tr>
                    <td className="px-3 py-4 text-[var(--color-text-secondary)]" colSpan={4}>
                      No pending flags.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[var(--radius-xl)] bg-white p-6 shadow-[var(--shadow-sm)]">
            <h2 className="font-display text-2xl font-semibold text-[var(--color-primary-900)]">
              Pending threads
            </h2>
            <div className="mt-4 space-y-3">
              {(pendingThreads ?? []).map((thread) => (
                <article key={thread.id} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4">
                  <p className="font-semibold text-[var(--color-primary-900)]">{thread.title}</p>
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                    {thread.author_display_name} · {formatReadableDate(thread.created_at)}
                  </p>
                </article>
              ))}
              {!pendingThreads?.length ? (
                <p className="text-sm text-[var(--color-text-secondary)]">No pending threads.</p>
              ) : null}
            </div>
          </div>

          <div className="rounded-[var(--radius-xl)] bg-white p-6 shadow-[var(--shadow-sm)]">
            <h2 className="font-display text-2xl font-semibold text-[var(--color-primary-900)]">
              Pending replies
            </h2>
            <div className="mt-4 space-y-3">
              {(pendingReplies ?? []).map((reply) => (
                <article key={reply.id} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4">
                  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {reply.body.length > 140 ? `${reply.body.slice(0, 140)}…` : reply.body}
                  </p>
                  <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                    {reply.author_display_name} · {formatReadableDate(reply.created_at)}
                  </p>
                </article>
              ))}
              {!pendingReplies?.length ? (
                <p className="text-sm text-[var(--color-text-secondary)]">No pending replies.</p>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
