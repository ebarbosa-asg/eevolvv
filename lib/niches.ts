import type { PackageId } from "@/lib/packages";

export type Niche = {
  slug: "podcasts" | "saas" | "coaches";
  nav: string;
  cardTitle: string;
  eyebrow: string;
  title: string;
  description: string;
  h1: string;
  lead: string;
  diagramTitle: string;
  steps: readonly { label: string; caption: string }[];
  points: readonly string[];
  packageId: PackageId;
  packageNote: string;
  faqs: readonly { q: string; a: string }[];
};

export const niches: readonly Niche[] = [
  {
    slug: "podcasts",
    nav: "Podcasts",
    cardTitle: "Business & money podcasts",
    eyebrow: "Podcast clipping service",
    title: "Podcast clipping for business & money shows",
    description:
      "Podcast clipping for business and money shows. Host and guest moments, captioned and posted to Shorts, TikTok, and Reels every week.",
    h1: "Podcast clipping for business & money shows",
    lead: "Your episodes are the place to stand. We cut host and guest moments, caption them, title them, and post to Shorts, TikTok, and Reels every week.",
    diagramTitle: "Episode in. Clips in the feed.",
    steps: [
      { label: "Episode", caption: "The hour you already recorded" },
      { label: "Moments", caption: "Claims, stories, numbers" },
      { label: "Clips", caption: "9:16, captions, titles" },
      { label: "Feed", caption: "Posted on your accounts" },
    ],
    points: [
      "Hook-first cuts that work without the full episode",
      "Optional host vs guest angle selection",
      "Posted to your owned accounts",
      "Monthly reporting so you see what held attention",
    ],
    packageId: "ship",
    packageNote:
      "Clip & Ship: 24 clips, Shorts + TikTok + Reels, monthly report. Upgrade to Clip & Dominate for LinkedIn, hook tests, and network boost.",
    faqs: [
      {
        q: "What is a podcast clipping service?",
        a: "It turns episode recordings into short vertical videos for TikTok, Reels, and YouTube Shorts, usually with captions and titles. eevolvv also posts them to your accounts.",
      },
      {
        q: "How many clips from one episode?",
        a: "Most hour-long interviews yield several strong standalone moments. Clip & Ship is 24 clips a month. How they split across episodes depends on the show. We do not promise a fixed count from every episode.",
      },
      {
        q: "Do you guarantee more listeners?",
        a: "No. We post clips to your accounts. We do not guarantee more listeners.",
      },
    ],
  },
  {
    slug: "saas",
    nav: "SaaS",
    cardTitle: "SaaS & AI founders",
    eyebrow: "SaaS clipping agency",
    title: "Short-form distribution for SaaS & AI founders",
    description:
      "SaaS clipping for founders. Demos, webinars, and interviews turned into LinkedIn and short-form posts on your accounts.",
    h1: "Short-form distribution for SaaS & AI founders",
    lead: "Your recordings are the place to stand. We turn demos and founder takes into LinkedIn and short-form posts on your accounts.",
    diagramTitle: "Demo in. Buyer feed out.",
    steps: [
      { label: "Recording", caption: "Demo, webinar, or interview" },
      { label: "Product moment", caption: "Screen + the claim" },
      { label: "Native post", caption: "LinkedIn and vertical clips" },
      { label: "Feed", caption: "Posted on your accounts" },
    ],
    points: [
      "Screen + face layouts for product moments",
      "LinkedIn included on Clip & Dominate",
      "Hook tests so weak opens die fast",
      "Honest reporting — what held, and what to try next",
    ],
    packageId: "dominate",
    packageNote:
      "48 clips, LinkedIn + short-form, hook tests, SEO titles, biweekly strategy, up to $500 network boost. Earlier-stage founders can start on Clip & Ship and upgrade when LinkedIn volume matters.",
    faqs: [
      {
        q: "What is a SaaS clipping agency?",
        a: "It turns founder interviews, demos, and webinars into short-form posts for LinkedIn, Shorts, TikTok, and Reels, and posts them to your accounts.",
      },
      {
        q: "Do I need a podcast?",
        a: "No. Product demos, changelogs, and webinar recordings work. The product often persuades better than a talking head.",
      },
      {
        q: "How is this different from a $5k network campaign?",
        a: "Enterprise clipper networks buy reach across many creator accounts with high minimums. We start with retainers on your owned channels. Clip & Dominate can add a capped boost.",
      },
    ],
  },
  {
    slug: "coaches",
    nav: "Coaches",
    cardTitle: "Coaches & course sellers",
    eyebrow: "Clip service for coaches",
    title: "Clipping for coaches & course sellers",
    description:
      "Clipping for coaches and course sellers. Webinars and teaching sessions become weekly Shorts and Reels, posted for you.",
    h1: "Clipping for coaches & course sellers",
    lead: "Webinars and teaching sessions pile up. We clip, caption, and post so your expertise shows up in the scroll—without you living in an editor.",
    diagramTitle: "One session. Posts for the feed.",
    steps: [
      { label: "Session", caption: "Webinar, VSL, or lesson" },
      { label: "Teaching cut", caption: "A moment that stands alone" },
      { label: "Caption + CTA", caption: "You approve the wording" },
      { label: "Weekly feed", caption: "Still posting when a launch hits" },
    ],
    points: [
      "Teaching moments cut to stand alone",
      "Clear CTAs in descriptions (you approve wording)",
      "Consistent posting when launches get busy",
      "No hype about guaranteed course sales",
    ],
    packageId: "ship",
    packageNote:
      "Clip & Ship keeps the machine running during cohort launches when your time disappears. Choose Clip & Dominate for LinkedIn volume, hook testing, and light network amplification.",
    faqs: [
      {
        q: "Do coaches need a clipping service?",
        a: "If you run webinars, VSLs, or teaching sessions and struggle to post daily social proof, yes. Clipping turns one recording into a month of feed content.",
      },
      {
        q: "Will this sell my course for me?",
        a: "Clips create awareness and trust. They do not replace funnels, emails, or offers. We are distribution ops.",
      },
      {
        q: "Which package for coaches?",
        a: "Most coaches fit Clip & Ship. Choose Clip & Dominate if you want LinkedIn volume, hook testing, and light network amplification.",
      },
    ],
  },
];

export function getNiche(slug: string) {
  return niches.find((niche) => niche.slug === slug);
}
