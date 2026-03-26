import LookmovieStyleLanding from "@/components/keyword-landings/LookmovieStyleLanding";
import type { Metadata } from "next";
import { getCanonicalBase } from "@/lib/domain";

export async function generateMetadata(): Promise<Metadata> {
  const base = await getCanonicalBase();
  const url = `${base}/lookmovie`;
  return {
    title: "Lookmovie search — movies & TV guide | our catalog",
    description:
      "Searched Lookmovie? Use our site’s search, movies, and series sections—this page explains our catalog only.",
    keywords: "lookmovie, movies, tv series, catalog, search, browse",
    alternates: { canonical: url },
    openGraph: {
      title: "Lookmovie search — movies & TV guide | our catalog",
      description: "Informational guide to our movie and TV catalog for Lookmovie-related searches.",
      type: "website",
      url,
    },
  };
}

const content = {
  heading: "Lookmovie — quick path to our title pages",
  intro: [
    "This guide is for traffic that arrives via Lookmovie-style searches. Our product is this site’s index: consistent URLs for movies and TV, plus search.",
    "You can move from the homepage to a title in a few clicks when you combine search with genre or year filters.",
  ],
  sections: [
    {
      title: "Clarification",
      paragraphs: [
        "We are not affiliated with Lookmovie. Content here describes how to use our own listings and players.",
        "Outbound marketing that suggests we are another domain is inaccurate; bookmark pages you trust.",
      ],
    },
    {
      title: "Library structure",
      paragraphs: [
        "Movies and series are split so long shows do not clutter film-only browsing.",
        "Similar or related titles often appear on detail pages—use them to continue a marathon without new searches.",
      ],
    },
    {
      title: "Playback",
      paragraphs: [
        "Streaming behavior follows our embed configuration per item. If audio and video drift, reload once before changing device settings.",
        "Fullscreen and keyboard shortcuts depend on the browser and player focus.",
      ],
    },
    {
      title: "Ethical viewing",
      paragraphs: [
        "Studios and crews benefit when audiences use paid or ad-supported legal options.",
        "This landing stays informational and points you through our on-site catalog.",
      ],
    },
  ],
};

const colorTheme = {
  primary: "#a855f7",
  secondary: "#c084fc",
  accent: "#9333ea",
  buttonBg: "#a855f7",
  buttonHover: "#9333ea",
  searchBorder: "#a855f7",
  searchFocus: "#9333ea",
  cardHover: "#a855f7",
  playButton: "#a855f7",
  textAccent: "#a855f7",
};

export default function LookmoviePage() {
  return (
    <LookmovieStyleLanding
      keyword="Lookmovie"
      description="Guide: our catalog & search (informational)"
      colorTheme={colorTheme}
      content={content}
    />
  );
}
