import type { Metadata } from "next";
import { getCanonicalBase } from "@/lib/domain";
import OfficialBrandStyleLanding from "@/components/keyword-landings/OfficialBrandStyleLanding";
import { extendedLandings } from "@/data/extendedKeywordLandings";
import { notFound } from "next/navigation";

export async function getExtendedLandingMetadata(slug: string): Promise<Metadata> {
  const config = extendedLandings[slug];
  if (!config) {
    return {
      title: "Page Not Found",
      description: "Requested landing page could not be found.",
    };
  }
  const base = await getCanonicalBase();
  const url = `${base}/${slug}`;
  return {
    title: config.metaTitle,
    description: config.metaDescription,
    keywords: config.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: config.metaTitle,
      description: config.metaDescription,
      type: "website",
      url,
    },
  };
}

export function renderExtendedLanding(slug: string) {
  const config = extendedLandings[slug];
  if (!config) return notFound();
  return <OfficialBrandStyleLanding config={config} />;
}
