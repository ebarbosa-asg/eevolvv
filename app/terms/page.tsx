import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — eevolvv",
  description:
    "Terms governing use of eevolvv.com, the AI diagnostic engine, Evolution Reports, and eevolvv/talent.",
  robots: { index: true, follow: true },
};

const EFFECTIVE_DATE = "May 1, 2025";
const CONTACT_EMAIL = "hello@eevolvv.com";
const COMPANY = "eevolvv, Inc.";

export default function TermsPage() {
  return (
    <div
      style={{
        background: "var(--paper)",
        color: "var(--ink)",
        minHeight: "100vh",
        fontFamily: "var(--font-display)",
      }}
    >
      <header className="border-b border-black/10">
        <div className="site-rail flex h-14 items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight text-[var(--ink)] no-underline">
            eevolvv
          </Link>
          <Link href="/" className="text-xs text-black/50 hover:text-black/80 transition-colors">
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="site-rail py-14 md:py-20">
        <div className="mx-auto max-w-2xl">
          <p className="mono text-[11px] uppercase tracking-[0.28em] text-black/40">Legal</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Terms of Service</h1>
          <p className="mt-2 text-sm text-black/50">Effective {EFFECTIVE_DATE}</p>

          <div className="mt-10 space-y-10 text-[15px] leading-relaxed text-black/70">

            <section id="acceptance" className="space-y-3">
              <h2 className="text-base font-semibold text-[var(--ink)]">1. Acceptance of Terms</h2>
              <p>
                These Terms of Service ("Terms") are a binding legal agreement between you and{" "}
                {COMPANY} ("we," "us," or "our"). By accessing or using any part of our websites,
                applications, or services — including eevolvv.com, talent.eevolvv.com, the AI
                diagnostic engine, Evolution Reports, and eevolvv/talent (collectively, the
                "Services") — you agree to be bound by these Terms.
              </p>
              <p>
                If you are using the Services on behalf of a business or other legal entity, you
                represent that you have authority to bind that entity to these Terms, and
                "you" refers to that entity.
              </p>
              <p>
                If you do not agree to these Terms, do not use the Services.
              </p>
            </section>

            <section id="eligibility" className="space-y-3">
              <h2 className="text-base font-semibold text-[var(--ink)]">2. Eligibility</h2>
              <p>
                You must be at least 18 years of age to use the Services. By using the Services
                you represent and warrant that you meet this requirement and that your use does
                not violate any applicable law or regulation.
              </p>
            </section>

            <section id="description" className="space-y-4">
              <h2 className="text-base font-semibold text-[var(--ink)]">3. Description of Services</h2>
              <p>
                {COMPANY} provides AI-powered business transformation services, including:
              </p>
              <ul className="ml-4 list-disc space-y-2">
                <li>
                  <strong>AI Diagnostic Engine</strong> — a conversational AI interface that
                  analyses information about your business and generates a customised Evolution
                  Report identifying automation opportunities and operational improvements.
                </li>
                <li>
                  <strong>Evolution Reports</strong> — AI-generated business analysis documents
                  delivered via email based on your diagnostic session.
                </li>
                <li>
                  <strong>eevolvv/talent</strong> — a platform connecting skilled contributors
                  with scoped business projects and engagements.
                </li>
                <li>
                  <strong>Consulting and Implementation Services</strong> — hands-on AI
                  automation deployment, workflow redesign, and ongoing operational support
                  provided under separate service agreements.
                </li>
              </ul>
              <p>
                We reserve the right to modify, suspend, or discontinue any part of the Services
                at any time with reasonable notice where practicable.
              </p>
            </section>

            <section id="ai-disclaimer" className="space-y-3">
              <h2 className="text-base font-semibold text-[var(--ink)]">4. AI-Generated Content — Important Disclaimer</h2>
              <div className="rounded border border-black/10 bg-black/[0.03] p-4 text-sm space-y-2">
                <p>
                  <strong>Evolution Reports and other AI-generated outputs are provided for
                  informational and strategic planning purposes only.</strong>
                </p>
                <p>
                  They do not constitute and should not be relied upon as legal, financial,
                  accounting, tax, medical, or any other form of professional advice. Always
                  consult qualified professionals before making significant business decisions.
                </p>
              </div>
              <p>
                AI-generated content may contain inaccuracies, omissions, or errors. The quality
                of outputs depends in part on the accuracy and completeness of the information
                you provide. You are responsible for independently verifying any recommendations
                before acting on them.
              </p>
              <p>
                By using the diagnostic engine you acknowledge that you are sharing business
                information with an AI system and accept the inherent limitations of AI-generated
                analysis.
              </p>
            </section>

            <section id="user-obligations" className="space-y-3">
              <h2 className="text-base font-semibold text-[var(--ink)]">5. Your Obligations</h2>
              <p>You agree to:</p>
              <ul className="ml-4 list-disc space-y-2">
                <li>Provide accurate, current, and complete information when using the Services.</li>
                <li>Use the Services only for lawful purposes and in compliance with applicable law.</li>
                <li>Not attempt to reverse-engineer, scrape, or otherwise extract data from the Services through automated means without our written consent.</li>
                <li>Not use the Services to transmit spam, malware, or any content that is unlawful, harassing, defamatory, or fraudulent.</li>
                <li>Not attempt to gain unauthorised access to any part of the Services or our infrastructure.</li>
                <li>Not impersonate any person or entity or misrepresent your affiliation with any person or entity.</li>
                <li>Not use the Services in a way that could damage, disable, or impair them or interfere with other users' access.</li>
              </ul>
              <p>
                We may suspend or terminate your access if we determine, in our sole discretion,
                that you have violated these obligations.
              </p>
            </section>

            <section id="intellectual-property" className="space-y-3">
              <h2 className="text-base font-semibold text-[var(--ink)]">6. Intellectual Property</h2>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-[var(--ink)]">Our IP</h3>
                <p>
                  The Services, including all software, design, text, graphics, logos, and
                  underlying technology, are owned by {COMPANY} or its licensors and are
                  protected by copyright, trademark, and other intellectual property laws. You
                  may not copy, reproduce, distribute, or create derivative works without our
                  express written permission.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-[var(--ink)]">Your Content</h3>
                <p>
                  You retain ownership of the information and content you submit to the Services
                  ("Your Content"). By submitting Your Content, you grant {COMPANY} a
                  non-exclusive, worldwide, royalty-free licence to use, process, and store Your
                  Content solely to provide the Services to you and to improve our AI models and
                  service quality in aggregated, anonymised form.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-[var(--ink)]">Evolution Reports</h3>
                <p>
                  Upon delivery of your Evolution Report, you receive a non-exclusive licence to
                  use the report for your internal business purposes. {COMPANY} retains the
                  underlying methodology, prompts, and system architecture used to generate it.
                </p>
              </div>
            </section>

            <section id="payments" className="space-y-3">
              <h2 className="text-base font-semibold text-[var(--ink)]">7. Payments and Fees</h2>
              <p>
                Certain Services require payment. All fees are stated at the time of purchase.
                Unless otherwise specified:
              </p>
              <ul className="ml-4 list-disc space-y-2">
                <li>Fees are in US dollars and are non-refundable except as required by law or as expressly stated in a separate service agreement.</li>
                <li>You authorise us to charge your payment method on file for applicable fees.</li>
                <li>We may change our pricing with reasonable notice. Continued use after a price change constitutes acceptance of the new pricing.</li>
                <li>You are responsible for all applicable taxes associated with your purchases.</li>
              </ul>
              <p>
                For consulting and implementation engagements, payment terms are governed by the
                applicable statement of work or service agreement, which supplements and may
                modify these Terms.
              </p>
            </section>

            <section id="talent-platform" className="space-y-3">
              <h2 className="text-base font-semibold text-[var(--ink)]">8. eevolvv/talent — Additional Terms</h2>
              <p>
                If you use eevolvv/talent as a contributor or client:
              </p>
              <ul className="ml-4 list-disc space-y-2">
                <li>
                  <strong>Not an employment relationship.</strong> eevolvv/talent is a matching
                  and facilitation platform. {COMPANY} is not your employer, staffing agency, or
                  professional employer organisation. Contributors are independent contractors
                  unless a separate written agreement states otherwise.
                </li>
                <li>
                  <strong>Accurate profiles.</strong> Contributors must provide accurate
                  information about their skills, experience, and availability. Misrepresentation
                  may result in immediate removal from the platform.
                </li>
                <li>
                  <strong>Engagement terms.</strong> Specific work engagements are governed by
                  separate agreements between the parties. {COMPANY} is not responsible for
                  disputes arising from those engagements.
                </li>
                <li>
                  <strong>Non-circumvention.</strong> You agree not to bypass the platform to
                  engage directly with a match introduced through {COMPANY} for a period of 12
                  months following the introduction, without our written consent.
                </li>
              </ul>
            </section>

            <section id="third-party" className="space-y-3">
              <h2 className="text-base font-semibold text-[var(--ink)]">9. Third-Party Services</h2>
              <p>
                The Services integrate or link to third-party services (including Anthropic's
                Claude API, Supabase, Resend, Sentry, Vercel, and Grasshopper). These services
                are governed by their own terms and privacy policies. We are not responsible for
                the practices or content of third-party services.
              </p>
            </section>

            <section id="disclaimer" className="space-y-3">
              <h2 className="text-base font-semibold text-[var(--ink)]">10. Disclaimer of Warranties</h2>
              <p className="font-medium uppercase text-sm tracking-wide text-[var(--ink)]">
                The Services are provided "as is" and "as available" without warranties of any
                kind, express or implied.
              </p>
              <p>
                To the fullest extent permitted by law, {COMPANY} disclaims all warranties,
                including but not limited to implied warranties of merchantability, fitness for a
                particular purpose, non-infringement, and accuracy of AI-generated content. We do
                not warrant that the Services will be uninterrupted, error-free, or free of
                viruses or other harmful components.
              </p>
            </section>

            <section id="liability" className="space-y-3">
              <h2 className="text-base font-semibold text-[var(--ink)]">11. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by applicable law, {COMPANY} and its officers,
                directors, employees, agents, and affiliates shall not be liable for any
                indirect, incidental, special, consequential, or punitive damages — including
                loss of profits, revenue, data, goodwill, or business interruption — arising out
                of or relating to your use of the Services, even if advised of the possibility of
                such damages.
              </p>
              <p>
                Our total aggregate liability to you for any claims arising under or related to
                these Terms or the Services shall not exceed the greater of (a) the total fees
                you paid to {COMPANY} in the 12 months preceding the claim or (b) one hundred
                US dollars ($100).
              </p>
              <p>
                Some jurisdictions do not allow the exclusion of certain warranties or the
                limitation of liability for certain types of damages. In such jurisdictions, our
                liability is limited to the maximum extent permitted by law.
              </p>
            </section>

            <section id="indemnification" className="space-y-3">
              <h2 className="text-base font-semibold text-[var(--ink)]">12. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless {COMPANY} and its officers,
                directors, employees, and agents from and against any claims, liabilities,
                damages, losses, and expenses (including reasonable attorneys' fees) arising out
                of or related to: (a) your use of the Services; (b) Your Content; (c) your
                violation of these Terms; or (d) your violation of any third-party rights.
              </p>
            </section>

            <section id="sms-terms" className="space-y-3">
              <h2 className="text-base font-semibold text-[var(--ink)]">13. SMS and Phone Communications</h2>
              <p>
                SMS and phone communications from {COMPANY} are subject to our{" "}
                <Link href="/privacy#sms-opt-in" className="font-medium underline-offset-2 hover:underline">
                  Privacy Policy and Messaging Terms
                </Link>
                . By opting in to SMS communications you agree to those terms, including that
                consent is not a condition of purchase and that you may opt out at any time by
                replying STOP.
              </p>
            </section>

            <section id="governing-law" className="space-y-3">
              <h2 className="text-base font-semibold text-[var(--ink)]">14. Governing Law and Disputes</h2>
              <p>
                These Terms are governed by the laws of the State of Delaware and the United
                States, without regard to conflict-of-law principles.
              </p>
              <p>
                Any dispute, claim, or controversy arising out of or relating to these Terms or
                the Services that cannot be resolved informally shall be settled by binding
                arbitration in accordance with the rules of the American Arbitration Association,
                except that either party may seek injunctive or other equitable relief in any
                court of competent jurisdiction to prevent irreparable harm.
              </p>
              <p>
                <strong>Class action waiver:</strong> you agree that any arbitration or
                proceeding shall be limited to the dispute between you and {COMPANY} individually.
                To the fullest extent permitted by law, you waive the right to participate in
                class action litigation or class-wide arbitration.
              </p>
              <p>
                You and {COMPANY} agree to attempt to resolve any dispute informally by
                contacting{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium underline-offset-2 hover:underline">
                  {CONTACT_EMAIL}
                </a>{" "}
                before initiating formal proceedings.
              </p>
            </section>

            <section id="termination" className="space-y-3">
              <h2 className="text-base font-semibold text-[var(--ink)]">15. Termination</h2>
              <p>
                We may suspend or terminate your access to the Services at any time, with or
                without notice, for any reason — including violation of these Terms. Upon
                termination, your right to use the Services ceases immediately. Sections 4, 6,
                10, 11, 12, and 14 survive termination.
              </p>
            </section>

            <section id="changes" className="space-y-3">
              <h2 className="text-base font-semibold text-[var(--ink)]">16. Changes to These Terms</h2>
              <p>
                We may update these Terms from time to time. When we make material changes, we
                will update the "Effective" date and, where appropriate, notify you via email or
                a prominent notice on the Services. Your continued use of the Services after any
                update constitutes acceptance of the revised Terms.
              </p>
            </section>

            <section id="general" className="space-y-3">
              <h2 className="text-base font-semibold text-[var(--ink)]">17. General</h2>
              <ul className="ml-4 list-disc space-y-2">
                <li><strong>Entire agreement.</strong> These Terms, together with our Privacy Policy and any applicable service agreement, constitute the entire agreement between you and {COMPANY} regarding the Services.</li>
                <li><strong>Severability.</strong> If any provision of these Terms is found unenforceable, the remaining provisions remain in full force and effect.</li>
                <li><strong>Waiver.</strong> Our failure to enforce any provision of these Terms is not a waiver of that provision.</li>
                <li><strong>Assignment.</strong> You may not assign your rights or obligations under these Terms without our prior written consent. We may assign our rights freely.</li>
                <li><strong>Force majeure.</strong> We are not liable for any failure or delay in performance caused by circumstances beyond our reasonable control.</li>
              </ul>
            </section>

            <section id="contact" className="space-y-3">
              <h2 className="text-base font-semibold text-[var(--ink)]">18. Contact</h2>
              <p>
                Questions about these Terms:{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium underline-offset-2 hover:underline">
                  {CONTACT_EMAIL}
                </a>
              </p>
            </section>

          </div>

          <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-black/10 pt-8">
            <Link href="/" className="text-sm font-medium text-black/50 hover:text-black/80 transition-colors">
              ← Back to eevolvv
            </Link>
            <Link href="/privacy" className="text-sm text-black/40 hover:text-black/70 transition-colors">
              Privacy Policy →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
