import { FlaskConical } from 'lucide-react';
import Link from 'next/link';

export default function TrialsPage() {
  return (
    <div className="p-6">
      <h1 className="font-heading text-2xl font-semibold text-accent">
        Clinical Trials
      </h1>
      <p className="mt-2 text-slate-600">
        Matched trials based on your diagnosis and biomarkers. Up to 5 results per patient.
      </p>
      <div className="mt-12 rounded-xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
        <FlaskConical className="mx-auto h-12 w-12 text-slate-300" />
        <p className="mt-4 font-medium text-slate-600">Clinical trial matches</p>
        <p className="mt-2 text-sm text-slate-500">
          Upload a report from the Journey Map to see trial matches based on cancer type, biomarkers, and stage.
        </p>
        <Link
          href="/journey"
          className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
        >
          Upload Report →
        </Link>
      </div>
    </div>
  );
}
