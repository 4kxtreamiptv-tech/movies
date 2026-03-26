import type {
  ExtendedLandingConfig,
  KeywordLandingContent,
  LandingColorTheme,
  OfficialStylePreset,
} from "@/components/keyword-landings/types";

const makeTheme = (primary: string, secondary: string, accent: string): LandingColorTheme => ({
  primary,
  secondary,
  accent,
  buttonBg: primary,
  buttonHover: secondary,
  searchBorder: primary,
  searchFocus: secondary,
  cardHover: primary,
  playButton: primary,
  textAccent: primary,
});

/**
 * SEO landing copy: informational guides tied to our catalog (Movies, Series, Search, Genres).
 * Keyword = common search term; we never claim to be a third-party brand—only how to use this site.
 */
const makeContent = (keyword: string): KeywordLandingContent => {
  const k = keyword;
  const kl = keyword.toLowerCase();
  return {
    heading: `${k} — browse movies & TV on our catalog`,
    intro: [
      `Many visitors arrive after searching for “${kl}.” This page explains how our movie site helps you explore titles—posters, metadata, genres, years, and search—without claiming to be another service or third-party brand.`,
      `Use Search from the header, or open Movies and TV series in the menu. The goal is simple discovery inside our layout, similar to what people expect when they look up ${k} online.`,
    ],
    sections: [
      {
        title: `What this page is about`,
        paragraphs: [
          `We are not the official “${k}” product or company. We offer information and on-site links only—to our movie pages, series listings, genres, and search.`,
          `If you want a clear grid of titles and a short path from search to a detail page, that is how our catalog is organized.`,
        ],
      },
      {
        title: `How to use our site`,
        paragraphs: [
          `Start with Search when you know a title; add a release year if names clash across remakes or years.`,
          `Movies lists films; Series groups TV by show and season. Genres and year filters help when you only have a mood, not an exact name.`,
          `Pages are responsive for phones, tablets, and desktops. Use a current browser and a stable connection for the best experience.`,
        ],
      },
      {
        title: `Creators, copyright, and your region`,
        paragraphs: [
          `Whenever possible, prefer licensed streaming and official releases available where you live.`,
          `We provide navigation and catalog structure on this domain only. Respect copyright and follow rules that apply in your country.`,
        ],
      },
    ],
  };
};

const entries: Array<{
  slug: string;
  keyword: string;
  preset: OfficialStylePreset;
  description: string;
  theme: LandingColorTheme;
}> = [
  { slug: "123movies", keyword: "123Movies", preset: "m123", description: "Guide: our movies & TV catalog", theme: makeTheme("#79c142", "#6bb23a", "#3fae2a") },
  { slug: "gostream", keyword: "GoStream", preset: "gostream", description: "Guide: search & browse on our site", theme: makeTheme("#38bdf8", "#0ea5e9", "#0284c7") },
  { slug: "putlocker", keyword: "Putlocker", preset: "putlocker", description: "Guide: on-site movies & series", theme: makeTheme("#2563eb", "#1d4ed8", "#1e40af") },
  { slug: "bflix", keyword: "BFlix", preset: "bflix", description: "Guide: HD listings in our catalog", theme: makeTheme("#ec4899", "#db2777", "#be185d") },
  { slug: "netfree", keyword: "NetFree", preset: "netfree", description: "Guide: browse without leaving our site", theme: makeTheme("#8b5cf6", "#7c3aed", "#6d28d9") },
  { slug: "filmyhit", keyword: "Filmyhit", preset: "filmyhit", description: "Guide: regional & Hindi discovery here", theme: makeTheme("#f97316", "#ea580c", "#c2410c") },
  { slug: "5movierulz", keyword: "5Movierulz", preset: "movierulz5", description: "Guide: South Indian titles in our index", theme: makeTheme("#f59e0b", "#d97706", "#b45309") },
  { slug: "7starhd", keyword: "7StarHD", preset: "sevenstarhd", description: "Guide: quality labels & our catalog", theme: makeTheme("#14b8a6", "#0d9488", "#0f766e") },
  { slug: "hdmovie2", keyword: "HDMovie2", preset: "hdmovie2", description: "Guide: find the right title on our site", theme: makeTheme("#06b6d4", "#0891b2", "#0e7490") },
  { slug: "ssrmovies", keyword: "SSRMovies", preset: "ssrmovies", description: "Guide: Hindi cinema in our catalog", theme: makeTheme("#ef4444", "#dc2626", "#b91c1c") },
  { slug: "9xmovies", keyword: "9xMovies", preset: "nine-x-movies", description: "Guide: multi-language browse here", theme: makeTheme("#f59e0b", "#d97706", "#b45309") },
  { slug: "kuttymovies", keyword: "KuttyMovies", preset: "kuttymovies", description: "Guide: Tamil picks via our search", theme: makeTheme("#a855f7", "#9333ea", "#7e22ce") },
  { slug: "sflix", keyword: "SFlix", preset: "sflix", description: "Guide: series-first browsing here", theme: makeTheme("#d946ef", "#c026d3", "#a21caf") },
  { slug: "9xflix", keyword: "9xFlix", preset: "nine-x-flix", description: "Guide: genres & search on our site", theme: makeTheme("#14b8a6", "#0d9488", "#0f766e") },
  { slug: "prmovies", keyword: "PRMovies", preset: "prmovies", description: "Guide: Hindi & English in our index", theme: makeTheme("#fb923c", "#f97316", "#ea580c") },
  { slug: "filmy4web", keyword: "Filmy4Web", preset: "filmy4web", description: "Guide: web-friendly catalog paths", theme: makeTheme("#f472b6", "#ec4899", "#db2777") },
  { slug: "goojara", keyword: "Goojara", preset: "goojara", description: "Guide: large library, our navigation", theme: makeTheme("#22c55e", "#16a34a", "#15803d") },
  { slug: "bolly4u", keyword: "Bolly4u", preset: "bolly4u", description: "Guide: Bollywood rows on our site", theme: makeTheme("#ef4444", "#dc2626", "#b91c1c") },
  { slug: "moviesda", keyword: "Moviesda", preset: "moviesda", description: "Guide: mobile-friendly search here", theme: makeTheme("#06b6d4", "#0891b2", "#0e7490") },
  { slug: "filmy4wap", keyword: "Filmy4Wap", preset: "filmy4wap", description: "Guide: quick browse on our catalog", theme: makeTheme("#ec4899", "#db2777", "#be185d") },
  { slug: "mp4moviez", keyword: "MP4Moviez", preset: "mp4moviez", description: "Guide: formats & sources on our pages", theme: makeTheme("#84cc16", "#65a30d", "#4d7c0f") },
  { slug: "ibomma", keyword: "iBOMMA", preset: "ibomma", description: "Guide: Telugu discovery in our index", theme: makeTheme("#22c55e", "#16a34a", "#15803d") },
  { slug: "fzmovies", keyword: "FZMovies", preset: "fzmovies", description: "Guide: world titles via our search", theme: makeTheme("#3b82f6", "#2563eb", "#1d4ed8") },
];

export const extendedLandings: Record<string, ExtendedLandingConfig> = Object.fromEntries(
  entries.map((entry) => [
    entry.slug,
    {
      keyword: entry.keyword,
      description: entry.description,
      metaTitle: `${entry.keyword} — movies & series guide | our catalog`,
      metaDescription: `Searched for ${entry.keyword}? See how to browse movies, TV series, and search on our site—clear discovery, no third-party promises.`,
      keywords: `${entry.slug}, ${entry.keyword.toLowerCase()}, movies online, tv series, browse catalog, watch guide`,
      preset: entry.preset,
      colorTheme: entry.theme,
      content: makeContent(entry.keyword),
    },
  ])
);

export const extendedLandingSlugs = Object.keys(extendedLandings);
