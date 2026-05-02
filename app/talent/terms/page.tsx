import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell } from "@/components/talent/LegalShell";
import { BRAND } from "@/lib/talent/brand";

export const metadata: Metadata = {
  title: `Terms of Service — ${BRAND.talentName}`,
  description: `Terms governing use of ${BRAND.talentName} — matching, engagements, and conduct.`,
};

const EFFECTIVE_DATE = "May 1, 2025";
const COMPANY = "eevolvv, Inc.";

export default function TermsPage() {
  const contactEmail = BRAND.contactEmail || "hello@eevolvv.com";

  return (
    <LegalShell>
      <div className="mx-auto max-w-2xl px-4 py-12 md:px-6 md:py-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-700">Legal</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-slate-500">Effective {EFFECTIVE_DATE}</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-slate-600 md:text-base">

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">1. Acceptance</h2>
            <p>
              By accessing or using {BRAND.talentName} and related services on{" "}
              {BRAND.talentDomain} (the "Services"), you agree to these Terms of Service. If
              you are acting on behalf of an organisation, you represent you have authority to
              bind it to these Terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">2. Eligibility</h2>
            <p>You must be at least 18 years old to use the Services.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">3. The Platform</h2>
            <p>
              {BRAND.talentName} is a matching and facilitation platform. eevolvv, Inc. connects
              skilled contributors with scoped business engagements. eevolvv, Inc. is not an employer,
              staffing agency, or professional employer organisation. Contributors are independent
              contractors unless a separate written agreement states otherwise.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">4. Your Obligations</h2>
            <ul className="ml-4 list-disc space-y-2">
              <li>Provide accurate, complete, and current information in all forms and profiles.</li>
              <li>Use the Services lawfully and not for harassment, fraud, or illegal activity.</li>
              <li>Not misrepresent your skills, availability, or identity.</li>
              <li>Not circumvent the platform to engage directly with a match introduced through eevolvv, Inc. for 12 months following the introduction, without our written consent.</li>
              <li>Not attempt to scrape, reverse-engineer, or gain unauthorised access to the Services.</li>
            </ul>
            <p>We may remove access for violations at our sole discretion.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">5. Engagements</h2>
            <p>
              Specific work engagements are governed by separate agreements between the
              contracting parties. eevolvv, Inc. is not responsible for disputes arising from those
              engagements. Use appropriate contracts, NDAs, and insurance for your work.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">6. Intellectual Property</h2>
            <p>
              The Services and all underlying technology are owned by eevolvv, Inc. You retain
              ownership of content you submit. By submitting content you grant eevolvv, Inc. a
              non-exclusive licence to use it to provide and improve the Services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">7. SMS Communications</h2>
            <p>
              SMS communications are subject to our{" "}
              <Link href="/privacy#sms-opt-in" className="font-medium text-cyan-700 underline-offset-2 hover:underline">
                Privacy Policy and Messaging Terms
              </Link>
              . Consent to receive texts is not a condition of using the Services. Reply STOP
              to opt out at any time.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">8. Disclaimer of Warranties</h2>
            <p>
              The Services are provided "as is" and "as available" without warranties of any
              kind. eevolvv, Inc. disclaims all implied warranties including merchantability,
              fitness for a particular purpose, and non-infringement.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">9. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, eevolvv, Inc.'s total liability for any claims
              arising under these Terms shall not exceed the greater of fees you paid to eevolvv, Inc.
              in the preceding 12 months or $100. eevolvv, Inc. is not liable for indirect,
              incidental, or consequential damages.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">10. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the State of Delaware and the United States. Disputes not resolved
              informally shall be settled by binding arbitration. Class action waiver applies.
              Contact{" "}
              <a href={`mailto:${contactEmail}`} className="font-medium text-cyan-700 underline-offset-2 hover:underline">
                {contactEmail}
              </a>{" "}
              before initiating formal proceedings.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">11. Changes</h2>
            <p>
              We may update these Terms at any time. Material changes will be communicated via
              email or prominent notice. Continued use after an update constitutes acceptance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">12. Contact</h2>
            <p>
              <a href={`mailto:${contactEmail}`} className="font-medium text-cyan-700 underline-offset-2 hover:underline">
                {contactEmail}
              </a>
            </p>
          </section>

        </div>

        <p className="mt-12 border-t border-cyan-100/80 pt-8 text-xs text-slate-500">
          <Link href="/" className="font-medium text-cyan-700 hover:underline">
            ← Back to {BRAND.talentName}
          </Link>
        </p>
      </div>
    </LegalShell>
  );
}
