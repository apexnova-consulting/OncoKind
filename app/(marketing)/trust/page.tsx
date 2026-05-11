import Link from 'next/link';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { MEDICAL_DISCLAIMER_TEXT, PATH_B_PRIVACY_LANGUAGE, PROFESSIONAL_HIPAA_NOTE } from '@/lib/disclosures';

const lastReviewed = 'May 11, 2026';

const collectedData = [
  {
    type: 'Report content',
    what: 'The text of your uploaded pathology report',
    why: 'To generate your plain-English summary and prep sheet',
  },
  {
    type: 'Account information',
    what: 'Email address and first name',
    why: 'To save your reports and send account-related communications',
  },
  {
    type: 'Usage data',
    what: 'Pages visited and features used',
    why: 'To improve product performance, reliability, and usability',
  },
  {
    type: 'Appointment dates',
    what: 'Dates you optionally enter',
    why: 'To trigger your post-appointment check-in',
  },
];

const subprocessors = [
  {
    service: 'Anthropic',
    purpose: 'Report analysis and plain-English generation',
    data: 'De-identified report text during processing',
  },
  {
    service: 'Vercel',
    purpose: 'Application hosting and server runtime',
    data: 'Encrypted application and request data needed to operate the service',
  },
  {
    service: 'Supabase',
    purpose: 'Database, authentication, and secure storage',
    data: 'Encrypted user records, generated summaries, and account data',
  },
  {
    service: 'Resend',
    purpose: 'Transactional email delivery',
    data: 'Email address and account-related messaging content',
  },
  {
    service: 'Stripe',
    purpose: 'Subscription billing and payment processing',
    data: 'Payment information handled within Stripe checkout flows',
  },
];

export const metadata: Metadata = {
  title: 'Trust & Privacy',
  description:
    'Learn how OncoKind handles report uploads, protects your data, limits retention, and supports privacy requests.',
};

export default function TrustPage() {
  return (
    <main className="bg-[var(--color-bg-page)] px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-[var(--max-width-full)] space-y-10">
        <section className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-md)] sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-accent-600)]">
            Trust Center
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-[var(--color-primary-900)] sm:text-5xl">
            Your Privacy Is Not an Afterthought
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
            At OncoKind, every product decision starts with one question: what would a caregiver need
            to feel safe sharing something this personal? Here is exactly how we handle your data.
          </p>
        </section>

        <section className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-sm)]">
          <h2 className="font-display text-3xl font-semibold text-[var(--color-primary-900)]">
            1. What We Collect
          </h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-100)]">
                  <th className="px-4 py-3 font-semibold text-[var(--color-primary-900)]">Data Type</th>
                  <th className="px-4 py-3 font-semibold text-[var(--color-primary-900)]">What It Is</th>
                  <th className="px-4 py-3 font-semibold text-[var(--color-primary-900)]">Why We Collect It</th>
                </tr>
              </thead>
              <tbody>
                {collectedData.map((row) => (
                  <tr key={row.type} className="border-b border-[var(--color-border-subtle)]">
                    <td className="px-4 py-4 font-medium text-[var(--color-primary-900)]">{row.type}</td>
                    <td className="px-4 py-4 text-[var(--color-text-secondary)]">{row.what}</td>
                    <td className="px-4 py-4 text-[var(--color-text-secondary)]">{row.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-sm)]">
          <h2 className="font-display text-3xl font-semibold text-[var(--color-primary-900)]">
            2. What We Do Not Do
          </h2>
          <ul className="mt-6 space-y-4 text-base leading-relaxed text-[var(--color-text-secondary)]">
            <li>✗ We do not sell your data to any third party — ever.</li>
            <li>✗ We do not share your report content with advertisers.</li>
            <li>✗ We do not store raw report text after your summary is generated.</li>
            <li>✗ We do not use your personal health information to train AI models.</li>
            <li>✗ OncoKind.com is ad-free. No advertiser has ever paid to influence what you see here.</li>
          </ul>
        </section>

        <section className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-sm)]">
          <h2 className="font-display text-3xl font-semibold text-[var(--color-primary-900)]">
            3. How Your Data Is Protected
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {[
              {
                title: 'Encryption in transit',
                body: 'All data transmitted between your device and OncoKind is encrypted using TLS 1.2 or higher.',
              },
              {
                title: 'Encryption at rest',
                body: 'All stored data is encrypted at rest using AES-256.',
              },
              {
                title: 'Access controls',
                body: 'Only essential personnel have access to backend systems, with audit logging and role-based controls.',
              },
              {
                title: 'Data retention',
                body: 'Raw report content is processed to generate your summary and is not retained after processing. Your generated summaries and prep sheets are stored securely and can be deleted by you at any time from your account settings.',
              },
              {
                title: 'Breach notification',
                body: 'In the event of a data breach, affected users will be notified within 72 hours.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-100)] p-5"
              >
                <h3 className="font-semibold text-[var(--color-primary-900)]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-sm)]">
          <h2 className="font-display text-3xl font-semibold text-[var(--color-primary-900)]">
            4. Our Subprocessors
          </h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-100)]">
                  <th className="px-4 py-3 font-semibold text-[var(--color-primary-900)]">Service</th>
                  <th className="px-4 py-3 font-semibold text-[var(--color-primary-900)]">Purpose</th>
                  <th className="px-4 py-3 font-semibold text-[var(--color-primary-900)]">Data Shared</th>
                </tr>
              </thead>
              <tbody>
                {subprocessors.map((row) => (
                  <tr key={row.service} className="border-b border-[var(--color-border-subtle)]">
                    <td className="px-4 py-4 font-medium text-[var(--color-primary-900)]">{row.service}</td>
                    <td className="px-4 py-4 text-[var(--color-text-secondary)]">{row.purpose}</td>
                    <td className="px-4 py-4 text-[var(--color-text-secondary)]">{row.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-sm)]">
          <h2 className="font-display text-3xl font-semibold text-[var(--color-primary-900)]">
            5. Your Rights
          </h2>
          <ul className="mt-6 space-y-4 text-base leading-relaxed text-[var(--color-text-secondary)]">
            <li><strong>Access:</strong> You can request a copy of all data OncoKind holds about you at any time.</li>
            <li><strong>Deletion:</strong> You can request permanent deletion of your account and associated data.</li>
            <li><strong>Portability:</strong> You can request your data in a portable format.</li>
            <li><strong>Contact:</strong> For privacy or data requests, email <a className="underline" href="mailto:support@oncokind.com">support@oncokind.com</a>.</li>
          </ul>
        </section>

        <section className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-sm)]">
          <h2 className="font-display text-3xl font-semibold text-[var(--color-primary-900)]">6. HIPAA</h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-[var(--color-text-secondary)]">
            <p>{PATH_B_PRIVACY_LANGUAGE}</p>
            <p>{PROFESSIONAL_HIPAA_NOTE}</p>
            <p>
              Using OncoKind does not create a Business Associate Agreement by default. If your
              organization needs a formal compliance review, contact us before onboarding.
            </p>
          </div>
        </section>

        <section className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-sm)]">
          <h2 className="font-display text-3xl font-semibold text-[var(--color-primary-900)]">
            7. Last Updated
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-text-secondary)]">
            This page was last reviewed on {lastReviewed}.
          </p>
        </section>

        <section className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-sm)]">
          <h2 className="font-display text-3xl font-semibold text-[var(--color-primary-900)]">
            Cookies and Consent
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-[var(--color-text-secondary)]">
            <p>
              OncoKind uses essential cookies for authentication, session security, and language
              preferences. These cookies are required for the site to function properly.
            </p>
            <p>
              If analytics is enabled in the future, those scripts will only run after you choose
              Accept All or explicitly allow analytics from the cookie preferences banner.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li><strong>Essential:</strong> session, authentication, language preference</li>
              <li><strong>Analytics:</strong> optional site-usage measurement after consent only</li>
              <li><strong>Opt out:</strong> choose Essential Only or update your preferences when the banner appears</li>
            </ul>
          </div>
        </section>

        <section className="rounded-[var(--radius-xl)] bg-[var(--color-primary-900)] p-8 text-white shadow-[var(--shadow-md)]">
          <p className="font-display text-3xl font-semibold">Questions about your privacy? We&apos;ll answer them directly.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="secondary">
              <Link href="/support">Contact Us</Link>
            </Button>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-[var(--color-primary-900)]">
              <Link href="/signup">Create an account</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-[var(--color-surface-300)]">
            {MEDICAL_DISCLAIMER_TEXT}
          </p>
        </section>
      </div>
    </main>
  );
}
