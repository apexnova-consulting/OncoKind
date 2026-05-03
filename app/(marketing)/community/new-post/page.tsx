import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getProfile } from '@/lib/auth';
import { COMMUNITY_CATEGORIES, getCommunityCategory } from '@/lib/community';
import { CommunityNewThreadForm } from '@/components/community/CommunityNewThreadForm';

export const metadata: Metadata = {
  title: 'New Community Post',
  description: 'Start a new thread in the OncoKind community.',
};

export default async function CommunityNewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const { user, hasAdvocateAccess } = await getProfile();

  if (!user) {
    redirect('/login');
  }

  const selected = getCommunityCategory(category ?? '') ?? COMMUNITY_CATEGORIES[0];

  return (
    <main className="bg-[var(--color-bg-page)] px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl space-y-6">
        <section className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-md)]">
          <p className="text-sm font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-accent-600)]">
            New thread
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-[var(--color-primary-900)]">
            Start a conversation in {selected.title}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            Write like you&apos;re talking to another family who is carrying a lot right now. Be
            specific, be kind, and avoid medical advice you are not qualified to give.
          </p>
        </section>
        <CommunityNewThreadForm categorySlug={selected.slug} canPost={hasAdvocateAccess} />
        <p className="text-center text-sm text-[var(--color-text-muted)]">
          This community is for peer support only and is not a substitute for medical advice.
          Always consult your care team.
        </p>
      </div>
    </main>
  );
}
