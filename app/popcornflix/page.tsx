import PopcornflixStyleLanding from "@/components/keyword-landings/PopcornflixStyleLanding";
import type { Metadata } from "next";
import { getCanonicalBase } from "@/lib/domain";

export async function generateMetadata(): Promise<Metadata> {
  const base = await getCanonicalBase();
  const url = `${base}/popcornflix`;
  return {
    title: "Popcornflix search — movies & TV guide | our catalog",
    description:
      "Searched Popcornflix? Learn how to browse movies and shows on our site—on-site guide only.",
    keywords: "popcornflix, movies, tv series, catalog, browse, search",
    alternates: { canonical: url },
    openGraph: {
      title: "Popcornflix search — movies & TV guide | our catalog",
      description: "Informational page: using our catalog after a Popcornflix-related search.",
      type: "website",
      url,
    },
  };
}

const content = {
  heading: "Popcornflix — movie night starts in our catalog",
  intro: [
    "People searching Popcornflix-style keywords often want a simple pick-and-watch flow. We describe how that works on our movie site: lists, search, and title screens.",
    "Nothing on this page promises a partnership with any external brand; it is only about navigation here.",
  ],
  sections: [
    {
      title: "Our role",
      paragraphs: [
        "We are not Popcornflix. We maintain this catalog and its pages under our domain.",
        "Use Search when you already know the title; browse Movies or Series when you want suggestions.",
      ],
    },
    {
      title: "Picking a title",
      paragraphs: [
        "Genre and year filters reduce endless scrolling when you only know the vibe, not the name.",
        "Read the short synopsis on the detail page before starting long films or new series.",
      ],
    },
    {
      title: "Family and shared screens",
      paragraphs: [
        "For mixed-age groups, check ratings and themes on the metadata we show.",
        "Pause between episodes to avoid accidental autoplay fatigue.",
      ],
    },
    {
      title: "Legal options",
      paragraphs: [
        "Free and paid legal services help fund new shows and movies.",
        "This text explains our UI paths only.",
      ],
    },
  ],
};

const colorTheme = {
  primary: "#dc2626",
  secondary: "#fbbf24",
  accent: "#b91c1c",
  buttonBg: "#dc2626",
  buttonHover: "#b91c1c",
  searchBorder: "#dc2626",
  searchFocus: "#b91c1c",
  cardHover: "#dc2626",
  playButton: "#dc2626",
  textAccent: "#dc2626",
};

export default function PopcornflixPage() {
  return (
    <PopcornflixStyleLanding
      keyword="Popcornflix"
      description="Guide: browse our movies & TV catalog"
      colorTheme={colorTheme}
      content={content}
    />
  );
}
