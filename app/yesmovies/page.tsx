import YesmoviesStyleLanding from "@/components/keyword-landings/YesmoviesStyleLanding";
import type { Metadata } from "next";
import { getCanonicalBase } from "@/lib/domain";

export async function generateMetadata(): Promise<Metadata> {
  const base = await getCanonicalBase();
  const url = `${base}/yesmovies`;
  return {
    title: "Yesmovies search — movies & TV guide | our catalog",
    description:
      "Searched Yesmovies? Use our search, movies, and series pages—informational guide to this site’s catalog only.",
    keywords: "yesmovies, movies online, tv series, catalog, browse, search",
    alternates: { canonical: url },
    openGraph: {
      title: "Yesmovies search — movies & TV guide | our catalog",
      description: "Guide to our movie site after a Yesmovies-related search.",
      type: "website",
      url,
    },
  };
}

const content = {
  heading: "Yesmovies — say yes to clear on-site browsing",
  intro: [
    "Yesmovies is a frequent search term; visitors who land here should know we are a standalone catalog with its own URLs and layout.",
    "Search, Movies, and Series are the three pillars—combine them with genres or years when you explore.",
  ],
  sections: [
    {
      title: "Disclaimer",
      paragraphs: [
        "We are not Yesmovies. Keyword in the heading reflects search intent, not ownership of a third-party trademark.",
        "Trust only links that match our domain when you follow buttons from this page.",
      ],
    },
    {
      title: "Discovery workflow",
      paragraphs: [
        "Short on time? Search a specific title instead of endless grid scrolling.",
        "Long evening? Pick a genre page and sample trailers or synopses before committing.",
      ],
    },
    {
      title: "Quality and access",
      paragraphs: [
        "Adaptive playback works best when the browser is updated and extensions are minimal.",
        "Missing titles may be regional or not yet indexed—check back after catalog updates.",
      ],
    },
    {
      title: "Support the industry",
      paragraphs: [
        "Rentals, subscriptions, and cinema tickets keep productions funded.",
        "This landing explains navigation; it is not a substitute for licensed services.",
      ],
    },
  ],
};

const colorTheme = {
  primary: "#f59e0b",
  secondary: "#d97706",
  accent: "#b45309",
  buttonBg: "#f59e0b",
  buttonHover: "#d97706",
  searchBorder: "#f59e0b",
  searchFocus: "#d97706",
  cardHover: "#f59e0b",
  playButton: "#f59e0b",
  textAccent: "#d97706",
};

export default function YesmoviesPage() {
  return (
    <YesmoviesStyleLanding
      keyword="Yesmovies"
      description="Guide: our movies & TV catalog (informational)"
      colorTheme={colorTheme}
      content={content}
    />
  );
}
