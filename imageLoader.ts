/**
 * Passthrough loader: img src = exact URL you pass to <Image src="..." />.
 * Does NOT route through Vercel Image Optimization (/_next/image), so no image optimization quota.
 * TMDB and other remote URLs load directly in the browser.
 */
export default function imageLoader({
  src,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  return src;
}
