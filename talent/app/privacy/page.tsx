import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell } from "@/components/LegalShell";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Privacy — ${BRAND.talentName}`,
  description: `How ${BRAND.talentName} handles information from contributors and customers.`,
};

export default function PrivacyPage() {
  return (
    <LegalShell>
      <div className="mx-auto max-w-2xl px-4 py-12 md:px-6 md:py-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-700">
          Legal
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Privacy
        </h1>
        <p className="mt-2 text-sm text-slate-500">Summary stub — review with counsel before production.</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-slate-600 md:text-base">
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">
              What this is
            </h2>
            <p>
              {BRAND.talentName} runs a matching surface for scoped work. This
              page describes, at a high level, what we may collect and why—so
              you know the shape before your counsel fills in the rest.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">
              Information you give us
            </h2>
            <p>
              Join and scope forms may include name, email, skills, availability,
              and short background text you choose to provide. We use this to
              evaluate fit and to contact you about specific opportunities.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">
              How we use it
            </h2>
            <p>
              We use submissions to run matching, send operational email (e.g.
              confirmations, thread invites), and improve the product. We do not
              sell your data to brokers or run a public directory from this
              intake.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">Retention</h2>
            <p>
              We keep what we need to operate, meet legal duties, and resolve
              disputes. Exact periods belong in your final policy; treat this
              section as a placeholder.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">Contact</h2>
            <p>
              Questions:{" "}
              {BRAND.contactEmail ? (
                <a
                  href={`mailto:${BRAND.contactEmail}`}
                  className="font-medium text-cyan-700 underline-offset-2 hover:underline"
                >
                  {BRAND.contactEmail}
                </a>
              ) : (
                <span className="text-slate-500">
                  set <span className="font-mono">NEXT_PUBLIC_CONTACT_EMAIL</span>
                </span>
              )}
              .
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
