import type { Metadata } from "next";
import { PackageView } from "@/components/site/PackageView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Clip & Dominate — $3,497/mo",
  description:
    "Clip & Dominate: 48 clips a month on Shorts, TikTok, Reels, and LinkedIn. Hook tests, SEO titles, biweekly strategy, and up to $500 network boost.",
  path: "/packages/clip-and-dominate",
});

export default function ClipAndDominatePage() {
  return <PackageView id="dominate" />;
}
