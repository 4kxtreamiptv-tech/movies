import GomoviesStyleLanding from "@/components/keyword-landings/GomoviesStyleLanding";
import type { Metadata } from "next";
import { getCanonicalBase } from "@/lib/domain";

export async function generateMetadata(): Promise<Metadata> {
  const base = await getCanonicalBase();
  const url = `${base}/gomovies`;
  return {
    title: "Gomovies search — movies & TV guide | our catalog",
    description:
      "Searched for Gomovies? Learn how to use our movie site: search, movies list, and TV series—on-site browsing only.",
    keywords: "gomovies, movies online, tv shows, catalog, search, browse guide",
    alternates: { canonical: url },
    openGraph: {
      title: "Gomovies search — movies & TV guide | our catalog",
      description: "Informational guide to our catalog for visitors who searched Gomovies.",
      type: "website",
      url,
    },
  };
}

const content = {
  heading: "Gomovies — discover titles through our catalog",
  intro: [
    "This page is for people who find us while searching for Gomovies. We are an independent catalog: search, movie pages, and series pages live on this site only.",
    "The menu and search bar are the fastest way to move from a keyword to a concrete title page.",
  ],
  sections: [
    {
      title: "Scope of this site",
      paragraphs: [
        "We do not claim to be Gomovies or any legacy portal. Links in our UI point to routes on this domain unless clearly marked otherwise.",
        "You get listings, artwork, and structured data to help you choose what to open next.",
      ],
    },
    {
      title: "Search and lists",
      paragraphs: [
        "Search accepts partial titles; refine with year or franchise words if results are noisy.",
        "Use Movies for films and Series for episodic shows so episode order stays logical.",
      ],
    },
    {
      title: "Playback expectations",
      paragraphs: [
        "Playback depends on our player and embed setup per title. If something fails, try again after a refresh or check your network.",
        "We do not guarantee availability for every title in every country—licensing varies.",
      ],
    },
    {
      title: "Support creators",
      paragraphs: [
        "When a title is on a licensed service you subscribe to, that supports studios and crews.",
        "This text is informational and describes our navigation only.",
      ],
    },
  ],
};

const colorTheme = {
  primary: "#ef4444",
  secondary: "#f97316",
  accent: "#dc2626",
  buttonBg: "#ef4444",
  buttonHover: "#dc2626",
  searchBorder: "#ef4444",
  searchFocus: "#dc2626",
  cardHover: "#ef4444",
  playButton: "#ef4444",
  textAccent: "#ef4444",
};

export default function GomoviesPage() {
  return (
    <GomoviesStyleLanding
      keyword="Gomovies"
      description="Guide: our movies & TV catalog after a Gomovies search"
      colorTheme={colorTheme}
      content={content}
    />
  );
}
