import type { Metadata } from "next";
import { contactEmail, pageMeta } from "@/lib/seo";
import { packages } from "@/lib/packages";

export const metadata: Metadata = pageMeta({
  title: "Terms",
  description: "Terms of service for eevolvv clipping retainers. No virality guarantee. Delaware law.",
  path: "/legal/terms",
});

export default function TermsPage() {
  const email = contactEmail();
  return (
    <section className="page-hero">
      <div className="wrap prose">
        <p className="eyebrow">Legal</p>
        <h1>Terms</h1>
        <p>
          These terms cover marketing pages and clipping retainers sold by eevolvv, Inc., a Delaware corporation. A signed statement of work controls if it conflicts with this page. This draft is pending counsel review.
        </p>
        <h2>The service</h2>
        <p>
          Clip & Ship is {packages.ship.clips} clips a month posted to your YouTube Shorts, TikTok, and Instagram Reels. Clip & Dominate is {packages.dominate.clips} clips a month and adds LinkedIn, hook tests, SEO metadata, and a biweekly strategy call. We do not guarantee virality, follower counts, or revenue.
        </p>
        <h2>Your accounts and content</h2>
        <p>
          You own the accounts and the source. You license eevolvv to edit and post that source during the engagement. You are responsible for rights to music, guests, and trademarks in the source.
        </p>
        <h2>Approvals and the soft goal</h2>
        <p>
          You approve everything before it posts. On Clip & Dominate: {packages.dominate.softGuarantee}{" "}
          {packages.dominate.boostDetail}
        </p>
        <h2>Fees</h2>
        <p>Retainers are monthly. Fees are not refunded because a clip underperformed. Either party can end a month-to-month engagement as the contract states.</p>
        <h2>Law</h2>
        <p>
          Delaware law governs. Contact <a href={`mailto:${email}`}>{email}</a>.
        </p>
      </div>
    </section>
  );
}
