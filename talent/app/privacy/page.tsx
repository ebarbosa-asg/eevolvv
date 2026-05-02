import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell } from "@/components/LegalShell";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Privacy Policy — ${BRAND.talentName}`,
  description: `How ${BRAND.talentName} collects, uses, and protects your information.`,
};

const EFFECTIVE_DATE = "May 1, 2025";

export default function PrivacyPage() {
  const contactEmail = BRAND.contactEmail || "hello@eevolvv.com";

  return (
    <LegalShell>
      <div className="mx-auto max-w-2xl px-4 py-12 md:px-6 md:py-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-700">
          Legal
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Effective {EFFECTIVE_DATE}
        </p>

        <div className="mt-10 space-y-10 text-sm leading-relaxed text-slate-600 md:text-base">

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">1. Scope</h2>
            <p>
              This Privacy Policy applies to {BRAND.talentName} and all related
              services operated on {BRAND.talentDomain} (the "Services"). By
              using the Services you acknowledge this policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">2. Who We Are</h2>
            <p>
              eevolvv operates {BRAND.talentName}, a platform that connects
              skilled contributors with scoped business opportunities. Contact
              us at{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="font-medium text-cyan-700 underline-offset-2 hover:underline"
              >
                {contactEmail}
              </a>
              .
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-semibold text-slate-900">3. Information We Collect</h2>
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-800">A. You provide directly</h3>
              <ul className="ml-4 list-disc space-y-1">
                <li>Name, email address, mobile phone number, and company affiliation.</li>
                <li>Skills, availability, rates, work history, and background text in intake or scoping forms.</li>
                <li>Communications you send us.</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-800">B. Automatically collected</h3>
              <ul className="ml-4 list-disc space-y-1">
                <li>IP address and approximate location (country/region).</li>
                <li>Browser type, device type, and operating system.</li>
                <li>Pages visited, referrer URLs, and session identifiers.</li>
                <li>Error logs and performance data.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">4. How We Use Your Information</h2>
            <ul className="ml-4 list-disc space-y-2">
              <li><strong>Provide the Services</strong> — run matching, send project invites, and facilitate work engagements.</li>
              <li><strong>Communicate</strong> — send confirmations, project updates, and operational email via Resend.</li>
              <li><strong>Improve the product</strong> — analyse usage patterns and fix bugs.</li>
              <li><strong>Prevent abuse</strong> — enforce rate limits and detect fraud.</li>
              <li><strong>Legal compliance</strong> — retain records as required by law and respond to lawful requests.</li>
            </ul>
            <div className="rounded border border-cyan-100 bg-cyan-50/50 p-3 text-sm">
              <strong>We do not sell your personal information</strong> to data
              brokers or unrelated third parties for marketing.
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">5. SMS and Phone Communications</h2>
            <p>
              We may contact you by SMS or phone only if you have explicitly
              opted in by providing your mobile number and checking the
              relevant opt-in field.
            </p>
            <ul className="ml-4 list-disc space-y-2">
              <li><strong>Opt-out:</strong> Reply <span className="font-mono font-semibold">STOP</span> to any text to unsubscribe. You will receive one confirmation then no further messages.</li>
              <li><strong>Help:</strong> Reply <span className="font-mono font-semibold">HELP</span> or email us.</li>
              <li><strong>Rates:</strong> Message and data rates from your carrier may apply.</li>
              <li><strong>Consent is not required</strong> to use or purchase the Services.</li>
            </ul>
            <p>We comply with the TCPA and CTIA Messaging Principles.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">6. Third-Party Service Providers</h2>
            <p>We use the following processors, each bound by data-protection obligations:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li><strong>Supabase</strong> — database and storage.</li>
              <li><strong>Resend</strong> — transactional email delivery.</li>
              <li><strong>Sentry</strong> — error monitoring (no PII by default).</li>
              <li><strong>Vercel</strong> — cloud hosting; all traffic passes through Vercel infrastructure.</li>
              <li><strong>Grasshopper / VoIP carrier</strong> — call/SMS delivery from <span className="font-mono">+1 (844) 433-8658</span> when phone contact is used.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">7. Cookies</h2>
            <p>
              We use strictly necessary cookies (session, CSRF) and may use
              privacy-preserving analytics. We do not use advertising or
              behavioural retargeting cookies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">8. Data Retention</h2>
            <ul className="ml-4 list-disc space-y-1">
              <li>Talent profiles — retained while active, plus up to 2 years after last activity.</li>
              <li>Email records — up to 5 years.</li>
              <li>Server and access logs — up to 90 days.</li>
              <li>Error/performance data (Sentry) — up to 30 days.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">9. International Transfers</h2>
            <p>
              Our Services are operated in the United States. If you are in the
              EEA, UK, or a jurisdiction with transfer restrictions, your data
              will be processed in the US. Where required, we rely on Standard
              Contractual Clauses or equivalent mechanisms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">10. Security</h2>
            <p>
              We use TLS encryption, access controls, and row-level database
              security. No transmission method is 100% secure; contact us
              immediately if you suspect a compromise.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-semibold text-slate-900">11. Your Rights</h2>
            <p>
              Depending on your location you may have rights to access, correct,
              delete, restrict, or port your personal data, and to object to
              processing. California residents have additional rights under
              CCPA/CPRA including the right to know, delete, correct, and opt
              out of sale (we do not sell data).
            </p>
            <p>
              To exercise any right, email{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="font-medium text-cyan-700 underline-offset-2 hover:underline"
              >
                {contactEmail}
              </a>{" "}
              with "Privacy Request" in the subject line. We respond within 30
              days (45 days for CCPA requests).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">12. Children</h2>
            <p>
              The Services are not directed to anyone under 18. We do not
              knowingly collect data from minors. Contact us if you believe a
              minor has submitted information.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">13. Changes</h2>
            <p>
              We will update the "Effective" date when we make material changes
              and notify you by email or prominent notice where appropriate.
              Continued use after an update constitutes acceptance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">14. Contact</h2>
            <p>
              Questions or requests:{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="font-medium text-cyan-700 underline-offset-2 hover:underline"
              >
                {contactEmail}
              </a>
              . We aim to respond within 5 business days.
            </p>
          </section>

        </div>

        <p className="mt-12 border-t border-cyan-100/80 pt-8 text-xs text-slate-500">
          <Link
            href="/"
            className="font-medium text-cyan-700 hover:underline"
          >
            ← Back to {BRAND.talentName}
          </Link>
        </p>
      </div>
    </LegalShell>
  );
}
