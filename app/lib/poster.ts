type PosterSize = "w92" | "w154" | "w185" | "w200" | "w342" | "w500" | "w780" | "original";
type PosterProvider = "tmdb" | "cdn";

const TMDB_BASE = "https://image.tmdb.org/t/p";
const CDN_BASE = "https://img.icdn.my.id/t/p";

export function resolvePosterUrl(
  path: string | null | undefined,
  size: PosterSize = "w500",
  provider: PosterProvider = "tmdb"
): string {
  if (!path || !path.trim()) return "/placeholder.svg";
  const base = provider === "cdn" ? CDN_BASE : TMDB_BASE;
  return `${base}/${size}${path}`;
}

