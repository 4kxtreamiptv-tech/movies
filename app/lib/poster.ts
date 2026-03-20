type PosterSize = "w92" | "w154" | "w185" | "w200" | "w342" | "w500" | "w780" | "original";

const TMDB_BASE = "https://image.tmdb.org/t/p";

/**
 * Build a TMDB poster URL, or pass through if already absolute.
 * Keeps production (Vercel) and local behavior consistent when API returns mixed path formats.
 */
export function resolvePosterUrl(
  path: string | null | undefined,
  size: PosterSize = "w500"
): string {
  if (!path || !path.trim()) return "/placeholder.svg";
  const p = path.trim();

  if (/^https?:\/\//i.test(p)) {
    return p;
  }
  if (p.startsWith("//")) {
    return `https:${p}`;
  }

  const normalizedPath = p.startsWith("/") ? p : `/${p}`;
  return `${TMDB_BASE}/${size}${normalizedPath}`;
}
