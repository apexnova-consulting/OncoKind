import { redirect } from 'next/navigation';
import { getProfile } from '@/lib/auth';
import { GoalsOfCarePrepSheet } from '@/components/care/GoalsOfCarePrepSheet';

export const metadata = {
  title: 'Goals of Care Prep Sheet',
  description:
    'A gentle guide to goals-of-care conversations with your oncology team — organized questions, plain language, no survival statistics.',
};

export default async function GoalsOfCarePage() {
  const { user } = await getProfile();
  if (!user) redirect('/login');

  if (process.env.NEXT_PUBLIC_GOALS_OF_CARE_ENABLED !== 'true') {
    redirect('/journey');
  }

  return <GoalsOfCarePrepSheet userId={user.id} />;
}
