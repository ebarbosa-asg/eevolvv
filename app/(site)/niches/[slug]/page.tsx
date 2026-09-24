import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NicheView } from "@/components/site/NicheView";
import { getNiche, niches } from "@/lib/niches";
import { pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return niches.map((niche) => ({ slug: niche.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const niche = getNiche(params.slug);
  if (!niche) return { title: "Niche" };
  return pageMeta({ title: niche.title, description: niche.description, path: `/niches/${niche.slug}` });
}

export default function NichePage({ params }: { params: { slug: string } }) {
  const niche = getNiche(params.slug);
  if (!niche) notFound();
  return <NicheView niche={niche} />;
}
