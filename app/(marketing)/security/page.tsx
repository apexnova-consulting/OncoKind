import {
  Shield,
  Lock,
  Database,
  Cpu,
  Ban,
  FileCheck,
} from 'lucide-react';

export const metadata = {
  title: 'Security | OncoKind',
  description: 'How OncoKind protects your data — zero raw PHI retention, encryption, and secure AI.',
};

export default function SecurityPage() {
  return (
    <main className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Security &amp; Data Protection
        </h1>
        <p className="mt-6 text-lg text-slate-600">
          OncoKind is built with privacy and security at its core. This page
          explains how we handle your pathology reports and personal data.
        </p>

        <div className="mt-12 space-y-12">
          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              Zero Raw PHI Retention Pipeline
            </h2>
            <p className="mt-3 text-slate-600">
              When you upload a pathology report, we extract text and immediately
              scrub all personally identifiable information (names, dates of
              birth, medical record numbers, phone numbers, emails, addresses).
              Only de-identified, structured data is sent to our AI. The raw
              extracted text is never stored — not in our database, logs,
              storage, or error reporting tools. We retain only the structured
              insights (biomarkers, stage, histology) that help you understand
              your report.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              AES-256 Encrypted Storage
            </h2>
            <p className="mt-3 text-slate-600">
              All structured data we store (biomarkers, trial matches, summaries)
              is encrypted at rest using AES-256-GCM. Encryption keys are managed
              in application-level environment variables and never logged. Data
              is stored in Supabase with Row-Level Security (RLS) ensuring each
              user can only access their own records.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              Row-Level Security (RLS) Data Isolation
            </h2>
            <p className="mt-3 text-slate-600">
              Every table in our database has RLS enabled. Users can only read,
              update, or delete their own records. Enterprise advocates with
              multi-patient access are restricted to explicitly assigned
              patients. The service role key is never exposed to the client;
              it is used only for server-side operations such as webhooks.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              Secure AI Architecture
            </h2>
            <p className="mt-3 text-slate-600">
              We use Anthropic&apos;s Claude API for processing. Only
              de-identified, scrubbed text is sent. We never log prompts or
              responses that could contain PHI. Our pipelines are designed so
              that even in error conditions, raw pathology content does not
              appear in logs or monitoring tools.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              No Data Sold
            </h2>
            <p className="mt-3 text-slate-600">
              We do not sell, rent, or share your data with third parties for
              marketing or advertising. Data is used only to provide OncoKind
              services to you. Payment processing is handled by Stripe; we do
              not store credit card numbers.
            </p>
          </section>
        </div>

        {/* Visual summary */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {[
            { icon: FileCheck, title: 'Zero raw retention', desc: 'Raw pathology text is never stored.' },
            { icon: Lock, title: 'AES-256 encryption', desc: 'All sensitive data encrypted at rest.' },
            { icon: Database, title: 'RLS isolation', desc: 'You only access your own data.' },
            { icon: Cpu, title: 'Secure AI', desc: 'De-identified input only; no PHI to third parties.' },
            { icon: Ban, title: 'No data sold', desc: 'Never sold, shared, or used for advertising.' },
            { icon: Shield, title: 'HIPAA-conscious', desc: 'Built with healthcare privacy in mind.' },
          ].map((item) => (
            <div
              key={item.title}
              className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-6"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-500">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
