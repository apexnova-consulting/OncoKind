import { pageMetadata } from '@/lib/seo';
import { PrepSheetLibrary } from '@/components/prep/PrepSheetLibrary';
import { PREP_LIBRARY_CARE_PLAN_NOTE } from '@/lib/ok01';

export const metadata = pageMetadata({
  title: 'Prep Sheet library',
  description:
    'Goals of Care, Genetic Counseling, and Care Plan Questions in one library. Questions for your care team, not clinical guidelines.',
  path: '/features/prep-sheets',
});

export default function PrepSheetsPage({
  searchParams,
}: {
  searchParams: { type?: string };
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-sm font-semibold uppercase tracking-widest text-[#0F6E56]">Prepare</p>
      <h1 className="mt-3 font-display text-4xl font-semibold">Prep Sheet library</h1>
      <p className="mt-4 text-lg text-slate-600">
        One place for Goals of Care, Genetic Counseling, and Care Plan Questions. {PREP_LIBRARY_CARE_PLAN_NOTE}
      </p>
      <PrepSheetLibrary initialType={searchParams.type} />
    </main>
  );
}
