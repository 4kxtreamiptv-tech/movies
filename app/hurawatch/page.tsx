import HurawatchStyleLanding from "@/components/keyword-landings/HurawatchStyleLanding";
import type { Metadata } from "next";
import { getCanonicalBase } from "@/lib/domain";

export async function generateMetadata(): Promise<Metadata> {
  const base = await getCanonicalBase();
  const url = `${base}/hurawatch`;
  return {
    title: "Hurawatch search — HD browsing guide | our catalog",
    description:
      "Searched Hurawatch? How to browse movies and series on our site with clear listings and search—informational page only.",
    keywords: "hurawatch, hd movies, tv series, catalog, browse, search guide",
    alternates: { canonical: url },
    openGraph: {
      title: "Hurawatch search — HD browsing guide | our catalog",
      description: "Guide to using our movie site after a Hurawatch-related search.",
      type: "website",
      url,
    },
  };
}

const content = {
  heading: "Hurawatch — browsing movies & series here",
  intro: [
    "Visitors often open this URL after searching for Hurawatch. We provide a local catalog experience: search, filters, and title pages on this website.",
    "Quality and availability depend on the source we attach per title; this page does not promise a specific bitrate or third-party brand.",
  ],
  sections: [
    {
      title: "What we offer",
      paragraphs: [
        "We are not Hurawatch. We publish guides and on-site navigation so you can scan posters, read basics, and open films or shows in our flow.",
        "All primary actions should keep you inside our domain’s movie and series routes.",
      ],
    },
    {
      title: "Finding HD-friendly titles",
      paragraphs: [
        "Detail pages show what metadata we have; player options may vary by title.",
        "On slower networks, lower quality in the player often reduces buffering more than reloading repeatedly.",
      ],
    },
    {
      title: "Simple navigation",
      paragraphs: [
        "Search first when you know the name; browse genres or years when you are deciding.",
        "No account is required for reading the catalog; follow any prompts only if we add optional features later.",
      ],
    },
    {
      title: "Rights and region",
      paragraphs: [
        "Some titles may be unavailable where you are. That is normal for global catalogs.",
        "Prefer legal windows (theatrical, rental, subscription) when they exist for you.",
      ],
    },
  ],
};

const colorTheme = {
  primary: "#06b6d4",
  secondary: "#0891b2",
  accent: "#0e7490",
  buttonBg: "#06b6d4",
  buttonHover: "#0891b2",
  searchBorder: "#06b6d4",
  searchFocus: "#0891b2",
  cardHover: "#06b6d4",
  playButton: "#06b6d4",
  textAccent: "#06b6d4",
};

export default function HurawatchPage() {
  return (
    <HurawatchStyleLanding
      keyword="Hurawatch"
      description="Guide: catalog search & browse (informational)"
      colorTheme={colorTheme}
      content={content}
    />
  );
}
