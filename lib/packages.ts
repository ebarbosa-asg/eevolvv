export type PackageId = "ship" | "dominate";

export type PackageFact = {
  id: PackageId;
  slug: "clip-and-ship" | "clip-and-dominate";
  tier: "Standard" | "Pro";
  name: "Clip & Ship" | "Clip & Dominate";
  price: 1497 | 3497;
  clips: number;
  platforms: readonly string[];
  report: string;
  blurb: string;
  lead: string;
  who: string;
  instead: string;
  bullets: readonly string[];
  homeBullets: readonly string[];
  included: readonly { title: string; detail: string }[];
  notIncluded?: readonly string[];
  softGuarantee?: string;
  boostDetail?: string;
  networkBoostUsd?: number;
  badge?: string;
  stripeEnv: "NEXT_PUBLIC_STRIPE_LINK_SHIP" | "NEXT_PUBLIC_STRIPE_LINK_DOMINATE";
};

const hookTests = "Testing hook styles across different clips. Never two versions of one moment.";

const boostDetail =
  "Up to $500/mo goes into a pool. Each quarter we run one clipper campaign with it, using only clips you approved, tagged with your handle. Those views happen on other people's accounts, so we report them separately from your own channels.";

const softGuarantee =
  "If after 60 days of on-schedule posting (you approve within 48 h and send your source hours) fewer than 25% of posted clips beat your own trailing median views on a platform, we produce one extra batch at no charge. Once per quarter. New accounts use their first 30 days as the baseline. Extra work, not refunds.";

export const packages = {
  ship: {
    id: "ship",
    slug: "clip-and-ship",
    tier: "Standard",
    name: "Clip & Ship",
    price: 1497,
    clips: 24,
    platforms: ["YouTube Shorts", "TikTok", "Instagram Reels"],
    report: "Monthly report",
    blurb: "24 clips a month on your Shorts, TikTok, and Reels. You approve everything.",
    lead: "Twenty-four clips a month for Shorts, TikTok, and Reels, with captions, hooks, and a title per platform. A monthly report. You approve everything before it posts.",
    who: "Weekly shows that already record and want a steady short-form cadence without giving up approval.",
    instead: "LinkedIn, hook tests, SEO metadata, a biweekly strategy call, or the clipper pool.",
    bullets: [
      "24 clips / month",
      "YouTube Shorts, TikTok, and Instagram Reels",
      "Captions + hooks",
      "Titles per platform",
      "Monthly report",
      "You approve everything",
    ],
    homeBullets: [
      "24 clips / mo",
      "Shorts, TikTok, Reels",
      "Captions + hooks",
      "Titles per platform",
      "Monthly report",
      "You approve everything",
    ],
    included: [
      { title: "24 clips / month", detail: "Cut from the episodes you already record" },
      { title: "Platforms", detail: "YouTube Shorts, TikTok, and Instagram Reels on your accounts" },
      { title: "Captions + hooks", detail: "Burned-in captions and a hook on every clip" },
      { title: "Titles per platform", detail: "A title written for each place it posts" },
      { title: "Monthly report", detail: "What shipped and what to keep recording" },
      { title: "Approval", detail: "You approve everything before it posts" },
    ],
    notIncluded: ["LinkedIn", "Hook tests", "SEO metadata", "Biweekly strategy call", "Clipper boost"],
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
    report: "Biweekly strategy call (live or Loom)",
    blurb: "48 clips, LinkedIn, hook tests, and a quarterly clipper campaign from a $500 pool.",
    lead: "Forty-eight clips a month, plus LinkedIn, hook tests, SEO metadata, and a biweekly strategy call (live or Loom). Up to $500 a month goes into a clipper pool. The soft view guarantee is extra work, not a refund.",
    who: "Shows that want LinkedIn, hook tests, and a capped clipper campaign on top of owned-account posting.",
    instead: "A weekly show that only needs Shorts, TikTok, and Reels.",
    bullets: [
      "48 clips / month",
      "Shorts, TikTok, Reels, and LinkedIn",
      "Hook tests",
      "SEO metadata",
      "Biweekly strategy call (live or Loom)",
      "Up to $500/mo clipper boost",
      "Soft view guarantee",
    ],
    homeBullets: [
      "48 clips / mo",
      "+ LinkedIn",
      "Hook tests",
      "SEO metadata",
      "Biweekly strategy call",
      "Up to $500/mo clipper boost",
      "Soft view guarantee",
    ],
    included: [
      { title: "48 clips / month", detail: "Double the Ship volume from the same kind of source" },
      { title: "Platforms", detail: "YouTube Shorts, TikTok, Instagram Reels, and LinkedIn" },
      { title: "Hook tests", detail: hookTests },
      { title: "SEO metadata", detail: "Keyworded titles and descriptions" },
      { title: "Strategy", detail: "Biweekly strategy call, live or Loom" },
      { title: "Approval", detail: "You approve everything before it posts" },
      { title: "Clipper boost", detail: boostDetail },
    ],
    networkBoostUsd: 500,
    boostDetail,
    softGuarantee,
    badge: "Most leverage",
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

function configuredEnv(value: string | undefined) {
  const trimmed = value?.trim();
  if (!trimmed || /^todo\b/i.test(trimmed)) return undefined;
  return trimmed;
}

export function stripeHref(id: PackageId): string | undefined {
  return configuredEnv(process.env[packages[id].stripeEnv]);
}

export const homeFaqs = [
  {
    q: "Do you buy views?",
    a: "No, never. We do not buy views, followers, or bot traffic.",
  },
  {
    q: "Who owns the clips?",
    a: "You. We edit and post to accounts you control. You keep the source and the cuts.",
  },
  {
    q: "Do I approve everything?",
    a: "Yes, by default. Nothing posts until you approve it.",
  },
  {
    q: "Is this AI?",
    a: "Yes, plus a human QA gate. Models help find moments and draft captions. A person checks the cut before you see it.",
  },
  {
    q: "Do you guarantee virality or a view-count refund?",
    a: `No. ${softGuarantee}`,
  },
  {
    q: "What does “lever and place to stand” mean here?",
    a: "Your show is the place to stand. The clipping, captioning, posting, and reporting is the lever. A small, consistent force moves more audience than heroic one-off edits.",
  },
  {
    q: "Where do clipper-boost views show up?",
    a: boostDetail,
  },
] as const;
