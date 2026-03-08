import { PathologyTranslationCard } from '@/components/dashboard/PathologyTranslationCard';
import { TrialMatchesCard } from '@/components/dashboard/TrialMatchesCard';
import { AppointmentQuestionGenerator } from '@/components/dashboard/AppointmentQuestionGenerator';

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="space-y-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <PathologyTranslationCard />
          <TrialMatchesCard />
          <AppointmentQuestionGenerator />
        </div>
      </div>
    </div>
  );
}
