import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell } from "@/components/talent/LegalShell";
import { BRAND } from "@/lib/talent/brand";

export const metadata: Metadata = {
  title: `Terms — ${BRAND.talentName}`,
  description: `Terms of use for ${BRAND.talentName}—matching, scopes, and conduct (stub).`,
};

export default function TermsPage() {
  return (
    <LegalShell>
      <div className="mx-auto max-w-2xl px-4 py-12 md:px-6 md:py-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-700">
          Legal
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Terms of use
        </h1>
        <p className="mt-2 text-sm text-slate-500">Summary stub — review with counsel before production.</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-slate-600 md:text-base">
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">Agreement</h2>
            <p>
              By using {BRAND.talentName} (forms, email, and related channels),
              you agree to these terms at a high level. Final, binding language
              comes from a full agreement your lawyers approve.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">
              The service
            </h2>
            <p>
              We help match skilled people to scoped work and help buyers
              describe work clearly. We are not a law firm, employer, or
              government representative unless separately contracted.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">Conduct</h2>
            <p>
              You give accurate information, keep credentials and commitments
              you make, and do not use the platform for harassment, fraud, or
              illegal activity. We may remove access for abuse.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">
              No warranty
            </h2>
            <p>
              The site and matches are provided as-is. Specific engagements are
              between the parties; use separate contracts and insurance where
              appropriate.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">Contact</h2>
            <p>
              {BRAND.contactEmail ? (
                <a
                  href={`mailto:${BRAND.contactEmail}`}
                  className="font-medium text-cyan-700 underline-offset-2 hover:underline"
                >
                  {BRAND.contactEmail}
                </a>
              ) : (
                <span className="text-slate-500">
                  <span className="font-mono">NEXT_PUBLIC_CONTACT_EMAIL</span>
                </span>
              )}
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
