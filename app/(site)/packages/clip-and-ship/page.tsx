import type { Metadata } from "next";
import { PackageView } from "@/components/site/PackageView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Clip & Ship — $1,497/mo",
  description:
    "Clip & Ship: 24 clips a month posted to YouTube Shorts, TikTok, and Instagram Reels, with captions, titles, and a monthly report.",
  path: "/packages/clip-and-ship",
});

export default function ClipAndShipPage() {
  return <PackageView id="ship" />;
}
