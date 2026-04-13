import { ShieldCheck } from 'lucide-react';

export default function InsuranceSupportPage() {
  return (
    <div className="p-6">
      <div className="mx-auto max-w-4xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-primary" aria-hidden />
          <h1 className="text-2xl font-semibold text-slate-900">Insurance Support</h1>
        </div>
        <p className="mt-4 text-slate-600">
          This page is reserved for the Appeals Engine: denial decoding, draft appeal generation, and the Letter of
          Medical Necessity workflow. The financial-aid architecture is live first so the data and audit patterns can
          be reused here next.
        </p>
      </div>
    </div>
  );
}
