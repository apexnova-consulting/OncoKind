export const metadata = {
  title: 'Privacy Policy | OncoKind',
  description: 'OncoKind Privacy Policy — how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
  return (
    <main className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Privacy Policy
        </h1>
        <p className="mt-6 text-slate-600">
          This page is a placeholder. Add your full Privacy Policy before launch.
          Include sections on: data we collect (pathology reports, account info),
          zero raw PHI retention, how we use data (AI processing via Anthropic),
          encryption and storage (Supabase, RLS), payment data (Stripe), third
          parties, your rights, and contact information.
        </p>
        <p className="mt-4 text-sm text-slate-500">
          Last updated: [Date]. Contact: hello@oncokind.com
        </p>
      </div>
    </main>
  );
}
