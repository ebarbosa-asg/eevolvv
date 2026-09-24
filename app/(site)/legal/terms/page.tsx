/**
 * DRAFT for E's review. Not legal advice and not a signed agreement.
 * Unknown mailing address stays on NEXT_PUBLIC_LEGAL_ADDRESS (TODO until set).
 * Do not invent an address, a notice period, or a legal entity.
 */
import type { Metadata } from "next";
import { contactEmail, legalAddress, pageMeta } from "@/lib/seo";
import { formatUsd, packages } from "@/lib/packages";

export const metadata: Metadata = pageMeta({
  title: "Terms",
  description:
    "Terms for eevolvv clipping retainers. You keep your content. Monthly billing. The soft guarantee is extra work, not a refund. No guarantee of views.",
  path: "/legal/terms",
});

export default function TermsPage() {
  const email = contactEmail();
  const address = legalAddress();
  return (
    <section className="page-hero">
      <div className="wrap prose">
        <p className="eyebrow">Legal</p>
        <h1>Terms</h1>
        <p>
          These terms cover the marketing site and the clipping retainers sold by eevolvv, Inc., a Delaware corporation. A signed statement of work controls if it conflicts with this page.
        </p>

        <h2>The service</h2>
        <p>
          Clip & Ship is {packages.ship.clips} clips a month posted to your YouTube Shorts, TikTok, and Instagram Reels, at {formatUsd(packages.ship.price)} per month. Clip & Dominate is {packages.dominate.clips} clips a month at {formatUsd(packages.dominate.price)} per month, and adds LinkedIn, hook tests, SEO metadata, and a biweekly strategy call. You approve clips before they post.
        </p>

        <h2>Your content stays yours</h2>
        <p>
          You keep all rights in your recordings, your accounts, and the clips made from them. eevolvv, Inc. does not take ownership of your content.
        </p>

        <h2>License to edit and post</h2>
        <p>
          You grant eevolvv, Inc. a license, limited to the engagement, to edit the source you send and to post the clips you approve on the accounts you name. You are responsible for the rights to music, guests, and trademarks in that source. The license to post new clips ends when the engagement ends.
        </p>

        <h2>Monthly billing</h2>
        <p>
          Retainers are billed monthly. When a Stripe Payment Link is used, Stripe processes the card payment. We do not refund a month because a clip underperformed or because views were lower than you hoped.
        </p>

        <h2>Cancellation</h2>
        <p>
          These retainers are month to month. Email <a href={`mailto:${email}`}>{email}</a> to cancel. Cancellation stops future months. It does not refund the month already billed. A signed statement of work controls if it names a different cutoff.
        </p>

        <h2>Soft guarantee</h2>
        <p>
          Clip & Ship has no view guarantee. On Clip & Dominate only: {packages.dominate.softGuarantee} That promise is extra work, not a refund.
        </p>

        <h2>No guarantee of views</h2>
        <p>We do not guarantee views, followers, virality, listeners, revenue, or sales.</p>

        <h2>Law</h2>
        <p>
          Delaware law governs. Contact <a href={`mailto:${email}`}>{email}</a>.
          {address ? ` ${address}.` : null}
        </p>
      </div>
    </section>
  );
}
