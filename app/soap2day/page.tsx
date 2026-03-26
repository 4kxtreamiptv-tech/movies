import Soap2dayStyleLanding from "@/components/keyword-landings/Soap2dayStyleLanding";
import type { Metadata } from "next";
import { getCanonicalBase } from "@/lib/domain";

export async function generateMetadata(): Promise<Metadata> {
  const base = await getCanonicalBase();
  const url = `${base}/soap2day`;
  return {
    title: "Soap2Day search — movies & TV guide | our catalog",
    description:
      "Searched Soap2Day? How to use our site’s search, movies, and series pages—informational guide only.",
    keywords: "soap2day, movies online, tv series, catalog, search, browse",
    alternates: { canonical: url },
    openGraph: {
      title: "Soap2Day search — movies & TV guide | our catalog",
      description: "Guide to our catalog for visitors who searched Soap2Day.",
      type: "website",
      url,
    },
  };
}

const content = {
  heading: "Soap2Day — find shows & films on our site",
  intro: [
    "Soap2Day is a common search phrase; this URL on our domain is a guide to how we organize movies and TV. Everything actionable should stay on our pages.",
    "We do not impersonate other sites—we explain search, lists, and detail screens as they exist here.",
  ],
  sections: [
    {
      title: "Transparency",
      paragraphs: [
        "We are not Soap2Day. Branding and URLs you see in the header belong to this project.",
        "If a result looks wrong, verify you are on our domain before clicking unfamiliar links.",
      ],
    },
    {
      title: "Search habits",
      paragraphs: [
        "Double-check spelling for international titles; try alternate transliterations.",
        "For franchises, include sequel numbers or subtitles so you open the correct entry.",
      ],
    },
    {
      title: "Streaming tips",
      paragraphs: [
        "Close unused tabs to free memory during long playback.",
        "If one stream path fails, check whether the title offers another option on its page.",
      ],
    },
    {
      title: "Compliance",
      paragraphs: [
        "Respect copyright and platform terms in your jurisdiction.",
        "This page is informational and describes our navigation layer only.",
      ],
    },
  ],
};

const colorTheme = {
  primary: "#10b981",
  secondary: "#14b8a6",
  accent: "#059669",
  buttonBg: "#10b981",
  buttonHover: "#059669",
  searchBorder: "#10b981",
  searchFocus: "#059669",
  cardHover: "#10b981",
  playButton: "#10b981",
  textAccent: "#10b981",
};

export default function Soap2DayPage() {
  return (
    <Soap2dayStyleLanding
      keyword="Soap2Day"
      description="Guide: our catalog & search (informational)"
      colorTheme={colorTheme}
      content={content}
    />
  );
}
