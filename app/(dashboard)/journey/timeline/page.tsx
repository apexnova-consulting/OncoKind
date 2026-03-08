import { Calendar } from 'lucide-react';

export default function TimelinePage() {
  return (
    <div className="p-6">
      <h1 className="font-heading text-2xl font-semibold text-accent">
        Care Timeline
      </h1>
      <p className="mt-2 text-slate-600">
        Track appointments, medications, symptom notes, and documents.
      </p>
      <div className="mt-12 rounded-xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
        <Calendar className="mx-auto h-12 w-12 text-slate-300" />
        <p className="mt-4 font-medium text-slate-600">Care Timeline coming soon</p>
        <p className="mt-2 text-sm text-slate-500">
          Add appointments and track your care journey over time.
        </p>
      </div>
    </div>
  );
}
