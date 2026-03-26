import SolarmovieStyleLanding from "@/components/keyword-landings/SolarmovieStyleLanding";
import type { Metadata } from "next";
import { getCanonicalBase } from "@/lib/domain";

export async function generateMetadata(): Promise<Metadata> {
  const base = await getCanonicalBase();
  const url = `${base}/solarmovie`;
  return {
    title: "Solarmovie search — movies & TV guide | our catalog",
    description:
      "Searched Solarmovie? Browse movies and TV on our site using search and curated lists—on-site informational guide.",
    keywords: "solarmovie, free catalog, movies, tv series, search, browse",
    alternates: { canonical: url },
    openGraph: {
      title: "Solarmovie search — movies & TV guide | our catalog",
      description: "How to navigate our movie site after a Solarmovie-related search.",
      type: "website",
      url,
    },
  };
}

const content = {
  heading: "Solarmovie — browse our movie & TV catalog",
  intro: [
    "Solarmovie-style searches bring many users to keyword pages. We clarify that this site is its own catalog: movies, series, and search under our control.",
    "You get structured browsing instead of random off-site hops when you stick to our navigation.",
  ],
  sections: [
    {
      title: "Identity",
      paragraphs: [
        "We are not Solarmovie. This page’s purpose is to route interest toward our internal movie and TV routes.",
        "Favorites and history depend on your browser; we focus on stable URLs for titles.",
      ],
    },
    {
      title: "Exploring the library",
      paragraphs: [
        "Rotate between genres during discovery nights so you do not burn out on one tone.",
        "Use year filters when you want classics or only recent releases.",
      ],
    },
    {
      title: "Reliability",
      paragraphs: [
        "Peak hours can feel slower; try off-peak times for large files or long episodes.",
        "Wired internet often beats crowded Wi-Fi for steady playback.",
      ],
    },
    {
      title: "Respectful use",
      paragraphs: [
        "Creators rely on ticket sales and licensed windows.",
        "This guide does not encourage infringement; it maps our on-site features.",
      ],
    },
  ],
};

const colorTheme = {
  primary: "#f97316",
  secondary: "#fb923c",
  accent: "#ea580c",
  buttonBg: "#f97316",
  buttonHover: "#ea580c",
  searchBorder: "#f97316",
  searchFocus: "#ea580c",
  cardHover: "#f97316",
  playButton: "#f97316",
  textAccent: "#f97316",
};

export default function SolarmoviesPage() {
  return (
    <SolarmovieStyleLanding
      keyword="Solarmovie"
      description="Guide: movies & TV on our catalog"
      colorTheme={colorTheme}
      content={content}
    />
  );
}
