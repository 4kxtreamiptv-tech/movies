import { NextResponse } from "next/server";
import { getBaseUrlForBuild } from "@/lib/domain";

const DOMAIN = getBaseUrlForBuild();
const ITEMS_PER_SITEMAP = 1000;

// sitemap.xml -> sitemap index that links to all XML sitemap endpoints
export async function GET() {
  try {
    // Import latest movie list from VidSrc to calculate number of movie sitemaps
    const { VID_SRC_LATEST_MOVIES } = await import("@/data/vidsrcLatestMovies");
    const totalMovies = VID_SRC_LATEST_MOVIES.length;
    const numberOfMovieSitemaps = Math.ceil(totalMovies / ITEMS_PER_SITEMAP);

    // Series sitemaps count (if Mongo available); fallback 0 if not
    let totalSeries = 0;
    let numberOfSeriesSitemaps = 0;
    try {
      const clientPromise = (await import("@/lib/mongodb-client")).default;
      const client = await clientPromise;
      if (client) {
        const db = client.db("moviesDB");
        const seriesCollection = db.collection("tvSeries");
        totalSeries = await seriesCollection.countDocuments();
        numberOfSeriesSitemaps = Math.ceil(totalSeries / ITEMS_PER_SITEMAP);
      }
    } catch {
      // ignore Mongo errors; just skip series sitemaps
    }

    const lastmod = new Date().toISOString();

    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${DOMAIN}/api/sitemap-pages</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/api/sitemap-years</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/api/sitemap-genres</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/api/sitemap-countries</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/api/sitemap-landingpages</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
${Array.from(
  { length: numberOfMovieSitemaps },
  (_, i) => `  <sitemap>
    <loc>${DOMAIN}/api/sitemap-movies/${i + 1}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`
).join("\n")}
${Array.from(
  { length: numberOfSeriesSitemaps },
  (_, i) => `  <sitemap>
    <loc>${DOMAIN}/api/sitemap-series/${i + 1}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`
).join("\n")}
</sitemapindex>`;

    return new Response(sitemapIndex, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap.xml index:", error);
    return new NextResponse("Error generating sitemap index", { status: 500 });
  }
}

