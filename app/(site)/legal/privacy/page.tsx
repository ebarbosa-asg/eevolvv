import type { Metadata } from "next";
import { contactEmail, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Privacy",
  description: "Privacy policy for eevolvv, Inc., a Delaware corporation offering short-form clipping and distribution.",
  path: "/legal/privacy",
});

export default function PrivacyPage() {
  const email = contactEmail();
  return (
    <section className="page-hero">
      <div className="wrap prose">
        <p className="eyebrow">Legal</p>
        <h1>Privacy</h1>
        <p>eevolvv, Inc. (“eevolvv”) is a Delaware corporation. This page describes the marketing site at eevolvv.com.</p>
        <h2>What we collect</h2>
        <p>
          If you request a sample cut, we collect the name, email, and episode URL you submit. If you book a call, the scheduler (when connected) collects what you enter there under its own policy.
        </p>
        <p>
          If analytics is enabled, we collect standard site measurements such as pages viewed. We do not sell personal information.
        </p>
        <h2>How we use it</h2>
        <p>To reply about a fit call or a sample, to operate the site, and to meet legal duties. We keep sample requests only as long as needed for that conversation.</p>
        <h2>Contact</h2>
        <p>
          Questions: <a href={`mailto:${email}`}>{email}</a>. This draft is pending counsel review.
        </p>
      </div>
    </section>
  );
}
