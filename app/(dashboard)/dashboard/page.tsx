import { PathologyTranslationCard } from '@/components/dashboard/PathologyTranslationCard';
import { TrialMatchesCard } from '@/components/dashboard/TrialMatchesCard';
import { AppointmentQuestionGenerator } from '@/components/dashboard/AppointmentQuestionGenerator';
import { CaregiverWellbeingCheckin } from '@/components/dashboard/CaregiverWellbeingCheckin';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getProfile } from '@/lib/auth';

export default async function DashboardPage() {
  const { isPro } = await getProfile();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="space-y-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        {!isPro && (
          <Card className="border-amber-300 bg-amber-50/40">
            <CardHeader>
              <CardTitle>Upgrade to Caregiver Pro</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700">
                Unlock Second Opinion packet export, expanded trial matching, and advanced prep tools.
              </p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/billing">Upgrade to Caregiver Pro</Link>
              </Button>
            </CardContent>
          </Card>
        )}
        <CaregiverWellbeingCheckin />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <PathologyTranslationCard />
          <TrialMatchesCard />
          <AppointmentQuestionGenerator />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Prepare for Second Opinion</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              Build a structured packet from your reports, timeline, and trial matches for a new oncology consultation.
            </p>
            <Button asChild className="mt-4">
              <Link href="/journey/second-opinion">Open Second Opinion Mode</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
