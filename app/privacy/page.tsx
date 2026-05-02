import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — eevolvv",
  description:
    "How eevolvv collects, uses, and protects information across eevolvv.com and talent.eevolvv.com.",
  robots: { index: true, follow: true },
};

const EFFECTIVE_DATE = "May 1, 2025";
const CONTACT_EMAIL = "hello@eevolvv.com";
const COMPANY = "eevolvv";
const DOMAINS = "eevolvv.com and talent.eevolvv.com";

export default function PrivacyPage() {
  return (
    <div
      style={{
        background: "var(--paper)",
        color: "var(--ink)",
        minHeight: "100vh",
        fontFamily: "var(--font-display)",
      }}
    >
      {/* minimal header */}
      <header className="border-b border-black/10">
        <div className="site-rail flex h-14 items-center justify-between">
          <Link
            href="/"
            className="font-semibold tracking-tight text-[var(--ink)] no-underline"
          >
            eevolvv
          </Link>
          <Link
            href="/"
            className="text-xs text-black/50 hover:text-black/80 transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="site-rail py-14 md:py-20">
        <div className="mx-auto max-w-2xl">
          {/* page label */}
          <p className="mono text-[11px] uppercase tracking-[0.28em] text-black/40">
            Legal
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Privacy Policy
          </h1>

          <p className="mt-2 text-sm text-black/50">
            Effective {EFFECTIVE_DATE}
          </p>

          <div className="mt-10 space-y-10 text-[15px] leading-relaxed text-black/70">

            {/* 1. SCOPE */}
            <section id="scope" className="space-y-3">
              <h2 className="text-base font-semibold text-[var(--ink)]">
                1. Scope of This Policy
              </h2>
              <p>
                This Privacy Policy applies to all websites, applications, and
                services operated by {COMPANY} ("we," "us," or "our"), including{" "}
                {DOMAINS} (collectively, the "Services"). It explains what
                personal information we collect, why we collect it, how we use
                and protect it, and what rights you have.
              </p>
              <p>
                By using any part of our Services you acknowledge this policy.
                If you do not agree, please do not use our Services.
              </p>
            </section>

            {/* 2. WHO WE ARE */}
            <section id="who-we-are" className="space-y-3">
              <h2 className="text-base font-semibold text-[var(--ink)]">
                2. Who We Are (Data Controller)
              </h2>
              <p>
                {COMPANY} is the data controller for personal information
                collected through the Services. We are an AI-native business
                transformation service helping businesses automate workflows and
                operate more efficiently.
              </p>
              <p>
                For privacy inquiries, contact us at{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-medium underline-offset-2 hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </section>

            {/* 3. INFORMATION WE COLLECT */}
            <section id="what-we-collect" className="space-y-4">
              <h2 className="text-base font-semibold text-[var(--ink)]">
                3. Information We Collect
              </h2>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-[var(--ink)]">
                  A. Information You Provide Directly
                </h3>
                <p>
                  When you interact with our Services you may provide
                  information including:
                </p>
                <ul className="ml-4 list-disc space-y-1">
                  <li>
                    <strong>Contact information</strong> — name, email address,
                    phone number (including mobile number), company name.
                  </li>
                  <li>
                    <strong>Business information</strong> — industry, company
                    size, revenue range, operational challenges, workflow
                    descriptions, and any other business context you enter into
                    our diagnostic engine or intake forms.
                  </li>
                  <li>
                    <strong>Talent platform profile data</strong> — skills,
                    availability, work history, rates, and background text
                    provided through eevolvv/talent intake and project-scoping
                    forms.
                  </li>
                  <li>
                    <strong>Communications</strong> — emails, messages, or
                    feedback you send us directly.
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-[var(--ink)]">
                  B. AI Interaction Data
                </h3>
                <p>
                  Our diagnostic engine uses a conversational AI interface. Any
                  text you enter into that interface — including business
                  challenges, process descriptions, financial context, and
                  goals — is collected and transmitted to our AI processing
                  infrastructure to generate your Evolution Report. This
                  information may be detailed and sensitive; please share only
                  what you are comfortable disclosing.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-[var(--ink)]">
                  C. Technical and Usage Data
                </h3>
                <p>
                  When you visit our Services we automatically collect:
                </p>
                <ul className="ml-4 list-disc space-y-1">
                  <li>IP address and approximate geographic location (country/region).</li>
                  <li>Browser type, version, and language settings.</li>
                  <li>Device type and operating system.</li>
                  <li>Pages and features visited, time spent, click paths, referrer URLs.</li>
                  <li>Session identifiers and rate-limiting tokens.</li>
                  <li>Error logs and performance diagnostics.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-[var(--ink)]">
                  D. Information from Third Parties
                </h3>
                <p>
                  We may receive information about you from third-party sources
                  such as partners who refer you to our Services, or from
                  publicly available sources to verify business information. We
                  handle such information in accordance with this policy.
                </p>
              </div>
            </section>

            {/* 4. HOW WE USE */}
            <section id="how-we-use" className="space-y-4">
              <h2 className="text-base font-semibold text-[var(--ink)]">
                4. How We Use Your Information
              </h2>
              <p>We use the information we collect to:</p>
              <ul className="ml-4 list-disc space-y-2">
                <li>
                  <strong>Provide and deliver the Services</strong> — run the AI
                  diagnostic engine, generate and email your Evolution Report,
                  match talent contributors with opportunities, and fulfil any
                  other feature you use.
                </li>
                <li>
                  <strong>Communicate with you</strong> — send transactional
                  emails (reports, confirmations, project invites), respond to
                  inquiries, and provide support.
                </li>
                <li>
                  <strong>Personalise and improve the Services</strong> — analyse
                  usage patterns, fix bugs, improve AI model outputs, and develop
                  new features.
                </li>
                <li>
                  <strong>Enforce rate limits and prevent abuse</strong> — we use
                  IP-based rate limiting to protect the availability of our AI
                  infrastructure.
                </li>
                <li>
                  <strong>Monitor errors and reliability</strong> — error and
                  performance data is used to detect and fix technical issues in
                  real time.
                </li>
                <li>
                  <strong>Comply with legal obligations</strong> — retain records
                  as required by applicable law, respond to lawful requests from
                  government authorities, and enforce our terms.
                </li>
                <li>
                  <strong>Protect rights and safety</strong> — detect, prevent,
                  and respond to fraud, security incidents, and other harmful
                  activity.
                </li>
              </ul>

              <div className="rounded border border-black/10 bg-black/[0.03] p-4 text-sm">
                <p className="font-semibold text-[var(--ink)]">
                  We do not sell your personal information.
                </p>
                <p className="mt-1">
                  We do not rent, sell, or trade your personal information to
                  data brokers or unrelated third parties for marketing purposes.
                </p>
              </div>
            </section>

            {/* 5. AI PROCESSING */}
            <section id="ai-processing" className="space-y-3">
              <h2 className="text-base font-semibold text-[var(--ink)]">
                5. AI-Powered Services — Special Disclosure
              </h2>
              <p>
                Our diagnostic engine and Evolution Reports are powered by
                large-language models (LLMs) operated by Anthropic, PBC ("Anthropic").
                When you use the diagnostic interface, the text you enter —
                including business information you share — is transmitted to
                Anthropic's API to generate a response.
              </p>
              <p>
                Anthropic processes this data as a data processor acting on our
                behalf. Anthropic's own API data usage policies govern how it
                handles model inputs; by default Anthropic does not use API
                inputs to train its models. You can review Anthropic's privacy
                practices at{" "}
                <span className="mono text-sm">anthropic.com/legal/privacy</span>.
              </p>
              <p>
                We store the completed Evolution Report and associated submission
                metadata in our database. We do not store raw conversational
                turn-by-turn transcripts beyond what is needed to generate the
                report.
              </p>
            </section>

            {/* 6. THIRD-PARTY PROCESSORS */}
            <section id="processors" className="space-y-3">
              <h2 className="text-base font-semibold text-[var(--ink)]">
                6. Third-Party Service Providers
              </h2>
              <p>
                We engage the following sub-processors to operate our Services.
                Each is contractually obligated to protect personal data
                consistent with this policy and applicable law.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-black/15 text-left">
                      <th className="py-2 pr-4 font-semibold text-[var(--ink)]">Provider</th>
                      <th className="py-2 pr-4 font-semibold text-[var(--ink)]">Purpose</th>
                      <th className="py-2 font-semibold text-[var(--ink)]">Data Shared</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/8">
                    <tr>
                      <td className="py-2 pr-4 align-top font-medium">Anthropic</td>
                      <td className="py-2 pr-4 align-top">AI language model API</td>
                      <td className="py-2 align-top">Diagnostic chat inputs, business context</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 align-top font-medium">Supabase</td>
                      <td className="py-2 pr-4 align-top">Database & storage</td>
                      <td className="py-2 align-top">Submission records, report content, rate-limit tokens</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 align-top font-medium">Resend</td>
                      <td className="py-2 pr-4 align-top">Transactional email delivery</td>
                      <td className="py-2 align-top">Name, email address, report content</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 align-top font-medium">Sentry</td>
                      <td className="py-2 pr-4 align-top">Error monitoring & performance</td>
                      <td className="py-2 align-top">Error traces, device/browser info (no PII by default)</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 align-top font-medium">Vercel</td>
                      <td className="py-2 pr-4 align-top">Cloud hosting & CDN</td>
                      <td className="py-2 align-top">All traffic passes through Vercel infrastructure; IP addresses in access logs</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                We will update this table when we add or remove material
                sub-processors. If a change affects data you have already
                provided, we will notify you via email or prominent notice on the
                Services.
              </p>
            </section>

            {/* 7. COOKIES */}
            <section id="cookies" className="space-y-3">
              <h2 className="text-base font-semibold text-[var(--ink)]">
                7. Cookies and Similar Technologies
              </h2>
              <p>
                We use cookies and similar technologies to operate and improve
                our Services. Specifically:
              </p>
              <ul className="ml-4 list-disc space-y-2">
                <li>
                  <strong>Strictly necessary cookies</strong> — required for the
                  Services to function (e.g., session identifiers, CSRF
                  protection). You cannot opt out of these.
                </li>
                <li>
                  <strong>Functional cookies</strong> — remember your
                  preferences and inputs within a session.
                </li>
                <li>
                  <strong>Analytics and performance</strong> — we may use
                  privacy-preserving analytics tools to understand how visitors
                  use the Services in aggregate. We do not use advertising
                  networks or behavioural retargeting cookies.
                </li>
              </ul>
              <p>
                You can control cookies through your browser settings. Disabling
                certain cookies may impair functionality. We do not honour "Do
                Not Track" headers at this time because there is no universal
                standard, but we respect opt-out signals where required by law
                (e.g., Global Privacy Control for California residents).
              </p>
            </section>

            {/* 8. SMS / PHONE OPT-IN */}
            <section id="sms-opt-in" className="space-y-3">
              <h2 className="text-base font-semibold text-[var(--ink)]">
                8. SMS and Phone Communications
              </h2>
              <p>
                We may offer you the option to receive communications from us
                via SMS text message or phone call. We will only contact you by
                phone or text if you have explicitly opted in.
              </p>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-[var(--ink)]">
                  Opt-In
                </h3>
                <p>
                  By providing your mobile phone number and checking an opt-in
                  box (or otherwise expressly indicating consent), you agree to
                  receive text messages and/or phone calls from eevolvv at the
                  number you provide. Message types may include: appointment
                  confirmations, project status updates, Evolution Report
                  delivery notifications, and informational or promotional
                  messages related to our Services.
                </p>
                <p>
                  Consent to receive SMS messages is not a condition of
                  purchasing or using any of our Services.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-[var(--ink)]">
                  Message Frequency and Costs
                </h3>
                <p>
                  Message frequency varies based on your interactions with us.
                  Message and data rates may apply. You are responsible for
                  any charges imposed by your mobile carrier.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-[var(--ink)]">
                  Opt-Out
                </h3>
                <p>
                  You may opt out of SMS communications at any time by replying{" "}
                  <span className="mono font-semibold">STOP</span> to any
                  message we send. You may also email{" "}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="font-medium underline-offset-2 hover:underline"
                  >
                    {CONTACT_EMAIL}
                  </a>{" "}
                  with "Unsubscribe SMS" in the subject line. After opting out,
                  you will receive a single confirmation message and no further
                  texts unless you re-enroll.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-[var(--ink)]">
                  Help
                </h3>
                <p>
                  Text <span className="mono font-semibold">HELP</span> to any
                  message we send for assistance, or contact us at{" "}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="font-medium underline-offset-2 hover:underline"
                  >
                    {CONTACT_EMAIL}
                  </a>
                  .
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-[var(--ink)]">
                  Phone Calls
                </h3>
                <p>
                  If you provide your phone number for the purpose of a
                  consultation or follow-up, we may call or text you from our
                  toll-free number <span className="mono font-semibold">+1 (844) 433-8658</span> using
                  Grasshopper (a VoIP telephony service). Grasshopper processes
                  call metadata on our behalf. We do not record calls without
                  notifying you at the start of the call.
                </p>
              </div>

              <div className="rounded border border-black/10 bg-black/[0.03] p-4 text-sm">
                <p>
                  <strong>TCPA Compliance Notice:</strong> By opting in to SMS
                  communications, you represent that you are the account holder
                  or have the account holder's permission for the mobile number
                  provided. We comply with the Telephone Consumer Protection
                  Act (TCPA) and applicable wireless carrier regulations. Our
                  messaging program complies with CTIA Messaging Principles and
                  Best Practices.
                </p>
              </div>
            </section>

            {/* 9. DATA SHARING */}
            <section id="data-sharing" className="space-y-3">
              <h2 className="text-base font-semibold text-[var(--ink)]">
                9. Data Sharing and Disclosure
              </h2>
              <p>
                Beyond the sub-processors listed above, we may disclose personal
                information:
              </p>
              <ul className="ml-4 list-disc space-y-2">
                <li>
                  <strong>With your consent</strong> — when you authorise us to
                  share information with a specific third party.
                </li>
                <li>
                  <strong>For legal compliance</strong> — in response to a
                  court order, subpoena, or other lawful governmental request, or
                  where we believe disclosure is necessary to protect our rights,
                  your safety, or the safety of others.
                </li>
                <li>
                  <strong>Business transfers</strong> — in connection with a
                  merger, acquisition, financing, or sale of all or a portion of
                  our assets, provided the acquiring party agrees to honour this
                  policy or provides you equivalent protections.
                </li>
                <li>
                  <strong>Aggregated or anonymised data</strong> — we may share
                  data that has been de-identified such that it cannot reasonably
                  be used to identify you, for benchmarking, research, or
                  marketing purposes.
                </li>
              </ul>
            </section>

            {/* 10. RETENTION */}
            <section id="retention" className="space-y-3">
              <h2 className="text-base font-semibold text-[var(--ink)]">
                10. Data Retention
              </h2>
              <p>
                We retain personal information for as long as necessary to
                fulfil the purposes described in this policy, unless a longer
                retention period is required by law. Specific retention windows:
              </p>
              <ul className="ml-4 list-disc space-y-2">
                <li>
                  <strong>Diagnostic submissions and Evolution Reports</strong> —
                  retained for the active life of the business relationship plus
                  up to 3 years, to support potential re-engagement and product
                  improvement.
                </li>
                <li>
                  <strong>Talent platform profiles</strong> — retained while
                  your profile is active, then up to 2 years after last activity
                  unless you request earlier deletion.
                </li>
                <li>
                  <strong>Email communication records</strong> — retained for up
                  to 5 years for legal and dispute-resolution purposes.
                </li>
                <li>
                  <strong>Server and access logs</strong> — retained for up to
                  90 days for security and performance analysis.
                </li>
                <li>
                  <strong>Error and performance data</strong> — retained for up
                  to 30 days in Sentry.
                </li>
              </ul>
              <p>
                When information is no longer needed we securely delete or
                anonymise it.
              </p>
            </section>

            {/* 11. INTERNATIONAL TRANSFERS */}
            <section id="international" className="space-y-3">
              <h2 className="text-base font-semibold text-[var(--ink)]">
                11. International Data Transfers
              </h2>
              <p>
                Our Services are operated in the United States. If you are
                located in the European Economic Area (EEA), United Kingdom, or
                another jurisdiction with data-transfer restrictions, be aware
                that your information will be transferred to, processed, and
                stored in the United States, which may not provide the same
                level of data protection as your home jurisdiction.
              </p>
              <p>
                Where required, we rely on appropriate transfer mechanisms such
                as Standard Contractual Clauses (SCCs) approved by the European
                Commission, or an equivalent mechanism, to ensure your data
                receives adequate protection.
              </p>
            </section>

            {/* 12. SECURITY */}
            <section id="security" className="space-y-3">
              <h2 className="text-base font-semibold text-[var(--ink)]">
                12. Security
              </h2>
              <p>
                We implement industry-standard technical and organisational
                measures to protect your personal information against
                unauthorised access, alteration, disclosure, or destruction.
                These measures include encrypted data transmission (TLS),
                access controls, and row-level security on our database.
              </p>
              <p>
                No method of transmission over the internet or method of
                electronic storage is completely secure. While we strive to
                protect your information, we cannot guarantee absolute security.
                If you believe your information has been compromised, contact us
                immediately at{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-medium underline-offset-2 hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </section>

            {/* 13. YOUR RIGHTS */}
            <section id="your-rights" className="space-y-4">
              <h2 className="text-base font-semibold text-[var(--ink)]">
                13. Your Privacy Rights
              </h2>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-[var(--ink)]">
                  A. EEA and UK Residents (GDPR / UK GDPR)
                </h3>
                <p>
                  If you are located in the EEA or United Kingdom, you have the
                  following rights under applicable data protection law:
                </p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong>Access</strong> — request a copy of the personal data we hold about you.</li>
                  <li><strong>Rectification</strong> — request correction of inaccurate or incomplete data.</li>
                  <li><strong>Erasure</strong> ("right to be forgotten") — request deletion of your data where there is no compelling reason for us to continue processing it.</li>
                  <li><strong>Restriction</strong> — request that we restrict processing of your data in certain circumstances.</li>
                  <li><strong>Portability</strong> — receive your data in a structured, machine-readable format and transfer it to another controller.</li>
                  <li><strong>Objection</strong> — object to processing based on our legitimate interests or for direct marketing.</li>
                  <li><strong>Withdraw consent</strong> — where processing is based on your consent, withdraw it at any time without affecting prior lawful processing.</li>
                  <li><strong>Lodge a complaint</strong> — you have the right to lodge a complaint with your local supervisory authority (e.g., the UK ICO).</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-[var(--ink)]">
                  B. California Residents (CCPA / CPRA)
                </h3>
                <p>
                  California residents have specific rights under the California
                  Consumer Privacy Act (CCPA) as amended by the California
                  Privacy Rights Act (CPRA):
                </p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong>Know</strong> — request disclosure of the categories and specific pieces of personal information we have collected about you, the sources, the business purpose, and the third parties we share it with.</li>
                  <li><strong>Delete</strong> — request deletion of personal information we have collected, subject to certain exceptions.</li>
                  <li><strong>Correct</strong> — request correction of inaccurate personal information.</li>
                  <li><strong>Opt out of sale/sharing</strong> — we do not sell or share your personal information for cross-context behavioural advertising. If this ever changes, we will provide an opt-out mechanism.</li>
                  <li><strong>Limit use of sensitive personal information</strong> — you may direct us to limit our use of sensitive personal information to what is necessary to provide the Services.</li>
                  <li><strong>Non-discrimination</strong> — we will not discriminate against you for exercising your CCPA rights.</li>
                </ul>
                <p>
                  To submit a California privacy request, email us at{" "}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="font-medium underline-offset-2 hover:underline"
                  >
                    {CONTACT_EMAIL}
                  </a>{" "}
                  with "California Privacy Request" in the subject line. We will
                  respond within 45 days as required by law.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-[var(--ink)]">
                  C. All Other Residents
                </h3>
                <p>
                  Regardless of your location, you may contact us at any time to
                  access, correct, or request deletion of your personal
                  information. We will honour reasonable requests to the extent
                  practicable and required by applicable law.
                </p>
              </div>

              <p>
                To exercise any right, email{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-medium underline-offset-2 hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
                . We may need to verify your identity before processing a
                request. We will respond within 30 days (or 45 days for CCPA
                requests).
              </p>
            </section>

            {/* 14. CHILDREN */}
            <section id="children" className="space-y-3">
              <h2 className="text-base font-semibold text-[var(--ink)]">
                14. Children's Privacy
              </h2>
              <p>
                Our Services are not directed to individuals under 18 years of
                age. We do not knowingly collect personal information from
                anyone under 18. If we learn that we have collected personal
                information from a minor, we will delete it promptly. If you
                believe a minor has provided us personal information, please
                contact us at{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-medium underline-offset-2 hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </section>

            {/* 15. THIRD-PARTY LINKS */}
            <section id="third-party-links" className="space-y-3">
              <h2 className="text-base font-semibold text-[var(--ink)]">
                15. Links to Third-Party Sites
              </h2>
              <p>
                Our Services may contain links to third-party websites or
                services that are not operated by us. We have no control over
                and assume no responsibility for the content, privacy policies,
                or practices of any third-party site. We encourage you to review
                the privacy policy of every site you visit.
              </p>
            </section>

            {/* 16. LEGAL BASIS */}
            <section id="legal-basis" className="space-y-3">
              <h2 className="text-base font-semibold text-[var(--ink)]">
                16. Legal Basis for Processing (EEA / UK)
              </h2>
              <p>
                If you are located in the EEA or UK, we process your personal
                information under the following lawful bases:
              </p>
              <ul className="ml-4 list-disc space-y-2">
                <li><strong>Contract</strong> — processing necessary to provide the Services you have requested (e.g., running the diagnostic engine and delivering your report).</li>
                <li><strong>Legitimate interests</strong> — processing necessary for our legitimate interests (e.g., fraud prevention, service security, product improvement), where not overridden by your fundamental rights.</li>
                <li><strong>Legal obligation</strong> — processing required to comply with applicable law.</li>
                <li><strong>Consent</strong> — where we have asked for and received your explicit consent (e.g., optional marketing communications). You may withdraw consent at any time.</li>
              </ul>
            </section>

            {/* 17. CHANGES */}
            <section id="changes" className="space-y-3">
              <h2 className="text-base font-semibold text-[var(--ink)]">
                17. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. When we
                make material changes, we will update the "Effective" date at
                the top of this page and, where appropriate, notify you via
                email or a prominent notice on the Services. Your continued use
                of the Services after any update constitutes acceptance of the
                revised policy.
              </p>
              <p>
                We encourage you to review this policy periodically.
              </p>
            </section>

            {/* 18. CONTACT */}
            <section id="contact" className="space-y-3">
              <h2 className="text-base font-semibold text-[var(--ink)]">
                18. Contact Us
              </h2>
              <p>
                If you have questions, concerns, or requests regarding this
                Privacy Policy or our data practices, please contact us:
              </p>
              <p>
                <strong>{COMPANY}</strong>
                <br />
                Email:{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-medium underline-offset-2 hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
              </p>
              <p>
                We aim to respond to all privacy-related inquiries within 5
                business days.
              </p>
            </section>

          </div>

          {/* footer nav */}
          <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-black/10 pt-8">
            <Link
              href="/"
              className="text-sm font-medium text-black/50 hover:text-black/80 transition-colors"
            >
              ← Back to eevolvv
            </Link>
            <Link
              href="/talent/terms"
              className="text-sm text-black/40 hover:text-black/70 transition-colors"
            >
              Terms of Service →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
