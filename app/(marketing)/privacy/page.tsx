const sections = [
  {
    title: '1. Scope of This Policy',
    body: [
      'This Privacy Policy explains how OncoKind collects, uses, stores, shares, and protects personal information when you use our website, applications, community features, patient-support tools, and related services (collectively, the "Services").',
      'By using the Services, you acknowledge the practices described in this Privacy Policy. If you do not agree with this Policy, please do not use the Services.',
    ],
  },
  {
    title: '2. Information We Collect',
    body: [
      'We collect information you provide directly to us, such as your name, email address, account credentials, subscription selections, support requests, uploaded documents, community posts, replies, and any information you choose to enter into forms or other tools.',
      'When you upload a report or related material, our systems may process the file contents in order to extract relevant clinical structure, create summaries, generate prep materials, or support trial matching and related features.',
      'We also collect limited technical information needed to operate the Services, such as device and browser information, IP address, usage logs, authentication events, cookie-related session data, and security records.',
    ],
  },
  {
    title: '3. Health-Related Information and Raw Report Handling',
    body: [
      'OncoKind is designed to minimize retention of raw medical content. When a pathology report or similar document is processed, we aim to extract only the structured and necessary information required to generate the user-facing outputs and support features.',
      'As part of that workflow, we use a zero raw retention approach for pathology text: raw extracted report text is not intended to be retained in our long-term database, logs, or storage after processing. Instead, we retain structured outputs and encrypted data needed to provide the Services you requested.',
      'Even with these safeguards, no technical system can eliminate all risk. You should only upload materials you are authorized to share and should avoid uploading unnecessary documents or unrelated sensitive information.',
    ],
  },
  {
    title: '4. How We Use Information',
    body: [
      'We use information to provide, operate, maintain, secure, and improve the Services. This includes creating and maintaining accounts, authenticating users, processing uploaded materials, generating summaries and prep sheets, supporting trial-matching workflows, moderating community content, providing customer support, and administering subscriptions and billing.',
      'We may also use information to monitor platform performance, investigate abuse, enforce our Terms of Service, comply with legal obligations, and protect the rights, safety, and integrity of our users, team, and Services.',
    ],
  },
  {
    title: '5. AI and Automated Processing',
    body: [
      'Some features rely on automated systems, including AI-assisted processing, to analyze de-identified or minimized content and generate educational outputs. Our workflows are designed to limit the exposure of raw personal information wherever reasonably possible.',
      'AI-assisted outputs may be incomplete or incorrect, and they are provided for educational use only. We may use trusted service providers to support these processing workflows, subject to contractual and operational controls.',
    ],
  },
  {
    title: '6. Cookies and Similar Technologies',
    body: [
      'We use cookies and similar technologies that are necessary to operate the Services, including maintaining authenticated sessions, storing security-related state, and supporting core site functionality.',
      'We may also use limited operational logging and service monitoring to keep the platform secure and reliable. If we introduce optional analytics, advertising, or non-essential tracking technologies in the future, we will update this Privacy Policy and any required consent mechanisms accordingly.',
    ],
  },
  {
    title: '7. How We Share Information',
    body: [
      'We do not sell your personal information. We do not rent your personal information to advertisers or data brokers.',
      'We may share information with service providers that help us operate the Services, such as hosting and database infrastructure providers, authentication tools, payment processors, and AI-processing vendors, but only to the extent reasonably necessary for them to provide services on our behalf.',
      'We may also disclose information if required by law, legal process, or government request; to enforce our agreements; to detect, prevent, or address fraud, abuse, or security issues; or in connection with a business transaction such as a merger, acquisition, financing, or sale of assets.',
    ],
  },
  {
    title: '8. Third-Party Service Providers',
    body: [
      'We currently rely on third-party providers to support core operations. These providers may include Supabase for database and authentication infrastructure, Stripe for payment processing and billing-related workflows, and AI or cloud vendors used to process user-requested outputs.',
      'Payment card information is processed by Stripe and is subject to Stripe’s own privacy and security practices. OncoKind does not store full payment card numbers.',
    ],
  },
  {
    title: '9. Data Security',
    body: [
      'We use administrative, technical, and organizational safeguards designed to protect personal information. These measures may include encryption at rest for sensitive structured data, controlled access, row-level database protections, server-side secrets management, and moderation or abuse-prevention controls.',
      'No system is perfectly secure. Accordingly, we cannot guarantee absolute security, and you use the Services at your own risk. If you believe your account or information has been compromised, contact us promptly at hello@oncokind.com.',
    ],
  },
  {
    title: '10. Data Retention',
    body: [
      'We retain personal information for as long as reasonably necessary to provide the Services, maintain your account, comply with legal obligations, resolve disputes, enforce our agreements, and protect the security and integrity of the platform.',
      'Retention periods vary depending on the type of information, why it was collected, whether an account remains active, and our legal or operational obligations. Community content may remain visible unless removed, moderated, or deleted in accordance with our policies and system constraints.',
    ],
  },
  {
    title: '11. Your Choices and Rights',
    body: [
      'You may access, update, or delete certain account information through the Services when those tools are available. You may also contact us to request access to, correction of, or deletion of your personal information, subject to applicable law and our legitimate legal, security, fraud-prevention, and recordkeeping obligations.',
      'Depending on where you live, you may have additional privacy rights under applicable law, such as rights to know, access, correct, delete, or restrict certain processing. We will review and respond to verified requests as required by law.',
    ],
  },
  {
    title: '12. Community Content',
    body: [
      'Information you post in the community may be visible to other users or visitors depending on how the feature is configured. Please do not post sensitive personal, medical, insurance, financial, or identifying information unless you are comfortable sharing it in that environment.',
      'We may moderate, remove, or restrict community content to help keep the platform safe, lawful, and aligned with our community standards.',
    ],
  },
  {
    title: '13. Children’s Privacy',
    body: [
      'The Services are not directed to children under 18, and we do not knowingly collect personal information directly from children under 18. If you believe a child has provided personal information to us without appropriate authorization, please contact us so we can investigate and take appropriate action.',
    ],
  },
  {
    title: '14. International Users',
    body: [
      'If you access the Services from outside the United States, you understand that your information may be transferred to, stored in, and processed in the United States or other jurisdictions where our service providers operate. Those jurisdictions may have data protection laws that differ from those in your location.',
    ],
  },
  {
    title: '15. HIPAA and Covered-Entity Status',
    body: [
      'OncoKind is designed with healthcare privacy in mind, but unless we have explicitly entered into a separate written agreement stating otherwise, this Privacy Policy does not create a Business Associate Agreement and our Services are not offered as HIPAA-covered clinical services.',
    ],
  },
  {
    title: '16. Changes to This Policy',
    body: [
      'We may update this Privacy Policy from time to time. If we make material changes, we will update the "Last updated" date and may provide additional notice where appropriate. Your continued use of the Services after an updated Policy becomes effective means you accept the revised Policy.',
    ],
  },
  {
    title: '17. Contact Us',
    body: [
      'If you have questions about this Privacy Policy or would like to submit a privacy request, please contact us at hello@oncokind.com.',
    ],
  },
] as const;

export const metadata = {
  title: 'Privacy Policy | OncoKind',
  description:
    'OncoKind Privacy Policy describing how we collect, use, protect, and disclose personal information and health-related data.',
};

export default function PrivacyPage() {
  return (
    <main className="bg-[var(--color-bg-page)] px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-[var(--max-width-content)]">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-[var(--color-primary-900)] sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
          This Privacy Policy explains what information OncoKind collects, how we use it, how we
          protect it, and the choices available to you. It is intended to reflect how the platform
          operates today, including document processing, account management, community features, and
          paid subscriptions.
        </p>
        <p className="mt-4 text-sm font-medium tracking-[var(--tracking-wide)] text-[var(--color-text-muted)]">
          Last updated: May 4, 2026
        </p>

        <div className="mt-12 space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-sans text-xl font-semibold text-[var(--color-primary-900)]">
                {section.title}
              </h2>
              <div className="mt-3 space-y-4 text-base leading-relaxed text-[var(--color-text-secondary)]">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
