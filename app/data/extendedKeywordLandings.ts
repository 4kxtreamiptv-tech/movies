import type {
  ExtendedLandingConfig,
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

const makeContent = (keyword: string) => ({
  heading: `${keyword} - Watch Movies and TV Series Online`,
  intro: [
    `${keyword} helps viewers discover movies and series quickly with a clean streaming-style layout and easy navigation.`,
    `This landing page is optimized for fast discovery, keyword relevance, and direct access to the core sections users need.`,
  ],
  sections: [
    {
      title: `Why users search for ${keyword}`,
      paragraphs: [
        `${keyword} terms are commonly used by users looking for quick streaming navigation and updated movie catalogs.`,
        `This page keeps the structure simple so users can move from keyword intent to actual browsing in fewer steps.`,
      ],
    },
    {
      title: "Content discovery experience",
      paragraphs: [
        "The page highlights search-first behavior and fast category access to reduce friction for new visitors.",
        "A familiar hero, clear CTA buttons, and structured article blocks keep both UX and SEO consistency strong.",
      ],
    },
    {
      title: "Mobile-friendly and lightweight layout",
      paragraphs: [
        "The design is responsive and follows a reusable component pattern for stable rendering on low-end devices.",
        "Consistent spacing, typographic hierarchy, and compact components improve first impression and usability.",
      ],
    },
    {
      title: "How this page fits the full site",
      paragraphs: [
        "Landing traffic can continue to /home, /movies, or /series through clear action paths.",
        "This keeps branded keyword pages aligned with the same content system used across the rest of the website.",
      ],
    },
  ],
});

const entries: Array<{
  slug: string;
  keyword: string;
  preset: OfficialStylePreset;
  description: string;
  theme: LandingColorTheme;
}> = [
  { slug: "123movies", keyword: "123Movies", preset: "m123", description: "Watch Movies Online Free", theme: makeTheme("#79c142", "#6bb23a", "#3fae2a") },
  { slug: "gostream", keyword: "GoStream", preset: "gostream", description: "Stream HD Movies and Shows", theme: makeTheme("#38bdf8", "#0ea5e9", "#0284c7") },
  { slug: "putlocker", keyword: "Putlocker", preset: "putlocker", description: "Free Movie Streaming Hub", theme: makeTheme("#2563eb", "#1d4ed8", "#1e40af") },
  { slug: "bflix", keyword: "BFlix", preset: "bflix", description: "Trending Movies in HD", theme: makeTheme("#ec4899", "#db2777", "#be185d") },
  { slug: "netfree", keyword: "NetFree", preset: "netfree", description: "Unlimited Free Streaming", theme: makeTheme("#8b5cf6", "#7c3aed", "#6d28d9") },
  { slug: "filmyhit", keyword: "Filmyhit", preset: "filmyhit", description: "Latest Movies and Dubbed Content", theme: makeTheme("#f97316", "#ea580c", "#c2410c") },
  { slug: "5movierulz", keyword: "5Movierulz", preset: "movierulz5", description: "Popular Movie Discovery", theme: makeTheme("#f59e0b", "#d97706", "#b45309") },
  { slug: "7starhd", keyword: "7StarHD", preset: "sevenstarhd", description: "HD Movies and Series", theme: makeTheme("#14b8a6", "#0d9488", "#0f766e") },
  { slug: "hdmovie2", keyword: "HDMovie2", preset: "hdmovie2", description: "Fast HD Streaming Access", theme: makeTheme("#06b6d4", "#0891b2", "#0e7490") },
  { slug: "ssrmovies", keyword: "SSRMovies", preset: "ssrmovies", description: "Regional and Global Titles", theme: makeTheme("#ef4444", "#dc2626", "#b91c1c") },
  { slug: "9xmovies", keyword: "9xMovies", preset: "nine-x-movies", description: "Movies Across Genres", theme: makeTheme("#f59e0b", "#d97706", "#b45309") },
  { slug: "kuttymovies", keyword: "KuttyMovies", preset: "kuttymovies", description: "Tamil and Dubbed Library", theme: makeTheme("#a855f7", "#9333ea", "#7e22ce") },
  { slug: "sflix", keyword: "SFlix", preset: "sflix", description: "Series and Movies Online", theme: makeTheme("#d946ef", "#c026d3", "#a21caf") },
  { slug: "9xflix", keyword: "9xFlix", preset: "nine-x-flix", description: "Multi-genre Streaming Picks", theme: makeTheme("#14b8a6", "#0d9488", "#0f766e") },
  { slug: "prmovies", keyword: "PRMovies", preset: "prmovies", description: "Fresh Movie Updates", theme: makeTheme("#fb923c", "#f97316", "#ea580c") },
  { slug: "filmy4web", keyword: "Filmy4Web", preset: "filmy4web", description: "Watch and Discover New Titles", theme: makeTheme("#f472b6", "#ec4899", "#db2777") },
  { slug: "goojara", keyword: "Goojara", preset: "goojara", description: "Long Catalog Streaming", theme: makeTheme("#22c55e", "#16a34a", "#15803d") },
  { slug: "bolly4u", keyword: "Bolly4u", preset: "bolly4u", description: "Bollywood and More", theme: makeTheme("#ef4444", "#dc2626", "#b91c1c") },
  { slug: "moviesda", keyword: "Moviesda", preset: "moviesda", description: "Mobile-first Movie Browsing", theme: makeTheme("#06b6d4", "#0891b2", "#0e7490") },
  { slug: "filmy4wap", keyword: "Filmy4Wap", preset: "filmy4wap", description: "Quick Mobile Streaming", theme: makeTheme("#ec4899", "#db2777", "#be185d") },
  { slug: "mp4moviez", keyword: "MP4Moviez", preset: "mp4moviez", description: "Format-focused Movie Hub", theme: makeTheme("#84cc16", "#65a30d", "#4d7c0f") },
  { slug: "ibomma", keyword: "iBOMMA", preset: "ibomma", description: "Telugu-focused Movie Discovery", theme: makeTheme("#22c55e", "#16a34a", "#15803d") },
  { slug: "fzmovies", keyword: "FZMovies", preset: "fzmovies", description: "Global Streaming Catalog", theme: makeTheme("#3b82f6", "#2563eb", "#1d4ed8") },
];

export const extendedLandings: Record<string, ExtendedLandingConfig> = Object.fromEntries(
  entries.map((entry) => [
    entry.slug,
    {
      keyword: entry.keyword,
      description: entry.description,
      metaTitle: `${entry.keyword} - Watch Movies and TV Shows Online`,
      metaDescription: `${entry.keyword} landing page with search-first movie discovery, curated sections, and fast navigation.`,
      keywords: `${entry.slug}, ${entry.keyword.toLowerCase()}, watch movies online, stream tv shows, free streaming`,
      preset: entry.preset,
      colorTheme: entry.theme,
      content: makeContent(entry.keyword),
    },
  ])
);

export const extendedLandingSlugs = Object.keys(extendedLandings);
