import Link from 'next/link';
import { FileUp, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { JourneyUploadCard } from '@/components/care/JourneyUploadCard';

export default function JourneyPage() {
  return (
    <div className="p-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-heading text-2xl font-semibold text-accent">
          Your Cancer Care Journey
        </h1>
        <p className="mt-2 text-slate-600">
          Upload a medical report to get started. We&apos;ll help you understand
          your diagnosis and navigate next steps.
        </p>
        <div className="mt-8">
          <JourneyUploadCard />
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <Map className="h-8 w-8 text-primary" />
            <h2 className="mt-4 font-heading font-semibold text-accent">
              Journey Map
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              See where you are: Diagnosis → Treatment Planning → Active Treatment → Monitoring
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/journey">View Map</Link>
            </Button>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <FileUp className="h-8 w-8 text-primary" />
            <h2 className="mt-4 font-heading font-semibold text-accent">
              Upload Report
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Pathology reports, imaging notes — we extract key information and explain it clearly.
            </p>
            <Button asChild className="mt-4">
              <Link href="/journey">Upload Document</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
