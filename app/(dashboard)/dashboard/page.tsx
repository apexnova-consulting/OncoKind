import { PathologyTranslationCard } from '@/components/dashboard/PathologyTranslationCard';
import { TrialMatchesCard } from '@/components/dashboard/TrialMatchesCard';
import { AppointmentQuestionGenerator } from '@/components/dashboard/AppointmentQuestionGenerator';
import { CaregiverWellbeingCheckin } from '@/components/dashboard/CaregiverWellbeingCheckin';
import { LiveFundingFeedCard } from '@/components/dashboard/LiveFundingFeedCard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ExternalLink } from 'lucide-react';
import { getProfile } from '@/lib/auth';

export default async function DashboardPage() {
  const { isPro, isProfessional } = await getProfile();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="space-y-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>

        {/* Prior Auth Engine — Professional tier feature card */}
        {isProfessional && (
          <a
            href="/prior-auth"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-4 rounded-xl bg-[#1C2B2D] p-5 text-white transition-colors hover:bg-[#2d4042]"
          >
            <div className="rounded-lg bg-white/10 p-2.5">
              <FileText className="h-5 w-5 text-[#E8C37A]" />
            </div>
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className="font-semibold text-sm">Prior Auth Engine</span>
                <span className="rounded-full bg-[#6B8F71] px-2 py-0.5 text-xs text-white">New</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-300">
                Generate prior auth requests, step therapy exceptions, and continued stay letters — opens in a dedicated workspace
              </p>
            </div>
            <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-white" />
          </a>
        )}

        {!isPro && (
          <Card className="border-amber-300 bg-amber-50/40">
            <CardHeader>
              <CardTitle>Upgrade to Advocate Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700">
                Unlock Second Opinion packet export, expanded trial matching, and advanced prep tools.
              </p>
              <Button asChild className="mt-4">
                <Link href="/pricing?plan=advocate">Upgrade to Advocate Plan</Link>
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
        <LiveFundingFeedCard />
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
