export interface LandingColorTheme {
  primary: string;
  secondary: string;
  accent: string;
  buttonBg: string;
  buttonHover: string;
  searchBorder: string;
  searchFocus: string;
  cardHover: string;
  playButton: string;
  textAccent: string;
}

export interface LandingContentSection {
  title: string;
  paragraphs: string[];
}

export interface LandingContent {
  heading: string;
  intro: string[];
  sections: LandingContentSection[];
}

export type OfficialStylePreset =
  | "m123"
  | "gostream"
  | "putlocker"
  | "bflix"
  | "netfree"
  | "filmyhit"
  | "movierulz5"
  | "sevenstarhd"
  | "hdmovie2"
  | "ssrmovies"
  | "nine-x-movies"
  | "kuttymovies"
  | "sflix"
  | "nine-x-flix"
  | "prmovies"
  | "filmy4web"
  | "goojara"
  | "bolly4u"
  | "moviesda"
  | "filmy4wap"
  | "mp4moviez"
  | "ibomma"
  | "fzmovies";

export interface ExtendedLandingConfig {
  keyword: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  preset: OfficialStylePreset;
  colorTheme: LandingColorTheme;
  content: LandingContent;
}
