import FmoviesStyleLanding from "@/components/keyword-landings/FmoviesStyleLanding";
import type { Metadata } from "next";
import { getCanonicalBase } from "@/lib/domain";

export async function generateMetadata(): Promise<Metadata> {
  const base = await getCanonicalBase();
  const url = `${base}/fmovies`;
  return {
    title: "Fmovies search — movies & TV guide | our catalog",
    description:
      "Looked up Fmovies? Here is how to browse movies, series, and search on our site—on-site discovery only, no third-party claims.",
    keywords: "fmovies, movies online, tv series, browse catalog, search movies, streaming guide",
    alternates: { canonical: url },
    openGraph: {
      title: "Fmovies search — movies & TV guide | our catalog",
      description: "How to use our movie site after searching for Fmovies: search, movies, and series pages.",
      type: "website",
      url,
    },
  };
}

const content = {
  heading: "Fmovies — use our catalog to find movies & shows",
  intro: [
    "If you landed here from a search for Fmovies, this page is an informational guide. Our site is a separate movie and TV catalog: you can search titles, open film pages, and browse series—without us pretending to be another website or service.",
    "Use the site search and menu links to stay inside our pages. We focus on clear listings, posters, and metadata so you can pick what to watch next.",
  ],
  sections: [
    {
      title: "What you get on this site",
      paragraphs: [
        "We are not the Fmovies brand. We offer navigation on this domain: movie detail pages, TV series listings, genres, and search results that load here.",
        "Think of it as a structured index plus playback where our embed rules allow—not a copy of any external streaming portal.",
      ],
    },
    {
      title: "How to browse efficiently",
      paragraphs: [
        "Type the film or show name in Search. If several versions exist, add the year to narrow results.",
        "Movies and Series are split on purpose: films are one-offs; series keep seasons together so you do not jump into random episodes.",
      ],
    },
    {
      title: "Devices and quality",
      paragraphs: [
        "The layout works on mobile and desktop. For fewer hiccups, close heavy background tabs and use a current browser.",
        "If a player offers quality steps, pick one that matches your connection instead of always forcing the highest setting.",
      ],
    },
    {
      title: "Legal viewing",
      paragraphs: [
        "Prefer official and licensed options when they exist in your region. This guide only describes how to move around our catalog.",
        "Follow copyright and local regulations that apply to you.",
      ],
    },
  ],
};

const colorTheme = {
  primary: "#3b82f6",
  secondary: "#8b5cf6",
  accent: "#6366f1",
  buttonBg: "#3b82f6",
  buttonHover: "#2563eb",
  searchBorder: "#3b82f6",
  searchFocus: "#2563eb",
  cardHover: "#3b82f6",
  playButton: "#3b82f6",
  textAccent: "#3b82f6",
};

export default function FmoviesPage() {
  return (
    <FmoviesStyleLanding
      keyword="Fmovies"
      description="Guide: search & browse movies and TV on our site"
      colorTheme={colorTheme}
      content={content}
    />
  );
}
