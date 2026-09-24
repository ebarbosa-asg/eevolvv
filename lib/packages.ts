export type PackageId = "ship" | "dominate";

export type PackageFact = {
  id: PackageId;
  slug: "clip-and-ship" | "clip-and-dominate";
  tier: "Standard" | "Pro";
  name: "Clip & Ship" | "Clip & Dominate";
  price: 1497 | 3497;
  clips: number;
  platforms: readonly string[];
  sourceHours: number;
  report: string;
  blurb: string;
  lead: string;
  who: string;
  instead: string;
  bullets: readonly string[];
  included: readonly { title: string; detail: string }[];
  notIncluded?: readonly string[];
  softGuarantee?: string;
  networkBoostUsd?: number;
  stripeEnv: "NEXT_PUBLIC_STRIPE_LINK_SHIP" | "NEXT_PUBLIC_STRIPE_LINK_DOMINATE";
};

export const packages = {
  ship: {
    id: "ship",
    slug: "clip-and-ship",
    tier: "Standard",
    name: "Clip & Ship",
    price: 1497,
    clips: 24,
    platforms: ["YouTube Shorts", "TikTok", "Instagram Reels"],
    sourceHours: 4,
    report: "Monthly Loom + spreadsheet",
    blurb: "For weekly shows that need reliable short-form without a second job.",
    lead: "Twenty-four finished clips a month, posted to your Shorts, TikTok, and Reels—with captions, titles, and a monthly Loom report. The lever applied on a weekly show’s schedule.",
    who: "Weekly podcasts, interview shows, and founders who already record long-form and keep meaning to “get the clips out.”",
    instead: "LinkedIn, hook testing, SEO’d metadata, biweekly strategy, or a capped network boost.",
    bullets: [
      "24 vertical clips / month",
      "Post to your Shorts + TikTok + Reels",
      "Captions, titles, descriptions",
      "Monthly Loom + spreadsheet report",
      "Up to 4 hours of source video",
    ],
    included: [
      { title: "24 vertical clips / month", detail: "Roughly 6 per weekly episode × 4 weeks" },
      { title: "Posting", detail: "YouTube Shorts, TikTok, and Instagram Reels on your accounts" },
      { title: "Editing", detail: "Hook-first cut, burned-in captions, 9:16, light brand end-card" },
      { title: "Metadata", detail: "Title, description, 3–5 hashtags per clip" },
      { title: "Approvals", detail: "Async review folder. 48 hours of silence = approved" },
      { title: "Reporting", detail: "One monthly Loom (≤10 min) + spreadsheet" },
      { title: "Source limit", detail: "Up to 4 hours of source video / month" },
      { title: "Turnaround", detail: "First clips within 5 business days of source drop" },
    ],
    notIncluded: [
      "LinkedIn",
      "Clipper networks",
      "Paid ads",
      "Custom thumbnail art",
      "Live strategy workshops",
    ],
    stripeEnv: "NEXT_PUBLIC_STRIPE_LINK_SHIP",
  },
  dominate: {
    id: "dominate",
    slug: "clip-and-dominate",
    tier: "Pro",
    name: "Clip & Dominate",
    price: 3497,
    clips: 48,
    platforms: ["YouTube Shorts", "TikTok", "Instagram Reels", "LinkedIn"],
    sourceHours: 8,
    report: "Biweekly strategy call or Loom",
    blurb: "For shows treating short-form as a growth channel—with tests and light network reach.",
    lead: "Forty-eight clips a month, LinkedIn included, hook A/B tests, SEO titles, biweekly strategy, and up to $500 in managed clipper-network boost. A longer lever on the same place to stand.",
    who: "Shows that want LinkedIn, hook tests, keyworded metadata, and a capped network boost on top of owned-account posting.",
    instead: "A weekly show that only needs reliable Shorts, TikTok, and Reels.",
    bullets: [
      "48 vertical clips / month",
      "Shorts + TikTok + Reels + LinkedIn",
      "Hook A/B tests on top moments",
      "SEO titles & descriptions",
      "Biweekly strategy + up to $500 network boost",
    ],
    included: [
      { title: "48 vertical clips / month", detail: "Double the Ship volume on the same source library" },
      { title: "Platforms", detail: "YouTube Shorts, TikTok, Instagram Reels, and LinkedIn" },
      { title: "Hook testing", detail: "Top 8 moments × 2 hook variants. Kill losers after ~72h" },
      { title: "SEO / metadata", detail: "Keyworded titles and descriptions" },
      { title: "Strategy", detail: "Biweekly 20-minute call or async Loom" },
      { title: "Analytics", detail: "Biweekly dashboard + monthly written summary" },
      { title: "Source limit", detail: "Up to 8 hours of source video / month" },
      { title: "Network boost", detail: "Up to $500 managed clipper spend / month. Unused rolls one month" },
    ],
    networkBoostUsd: 500,
    softGuarantee:
      "If fewer than 8 clips/month clear 10k views on at least one platform, we extend production by 1 week at no charge (extra work, not a fee refund).",
    stripeEnv: "NEXT_PUBLIC_STRIPE_LINK_DOMINATE",
  },
} as const satisfies Record<PackageId, PackageFact>;

export const packageList = [packages.ship, packages.dominate] as const;

export function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function stripeHref(id: PackageId): string | undefined {
  const key = packages[id].stripeEnv;
  const value = process.env[key]?.trim();
  return value || undefined;
}

export const homeFaqs = [
  {
    q: "Do you guarantee virality or a view-count refund?",
    a: "No. Virality is not something an honest vendor can guarantee. Clip & Dominate includes a soft operational goal: if fewer than eight clips clear 10k views on at least one platform in a month, we extend production by one week at no charge. That is extra work—not a fee refund.",
  },
  {
    q: "Who owns the accounts and the content?",
    a: "You do. We post to accounts you control (Brand Account manager access preferred). You license us to edit and distribute your source for the engagement term.",
  },
  {
    q: "What does “lever and place to stand” mean here?",
    a: "Your long-form library is the place to stand—the solid ground. Our clipping, captioning, posting, and reporting system is the lever. A small, consistent force on that lever moves more audience than heroic one-off edits.",
  },
  {
    q: "Is this the same as a $15k clipping network campaign?",
    a: "No. Enterprise networks pay armies of clippers per verified view with high minimums. We start with a productized retainer on your channels. Clip & Dominate can add a capped network boost; larger CPM campaigns are a separate conversation later.",
  },
] as const;
