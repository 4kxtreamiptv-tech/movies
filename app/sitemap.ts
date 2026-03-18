import { MetadataRoute } from "next";
import { getBaseUrlForBuild } from "@/lib/domain";

const DOMAIN = getBaseUrlForBuild();
const ITEMS_PER_SITEMAP = 1000;

/**
 * Root /sitemap.xml
 *
 * Instead of listing individual pages, yeh file **saari XML sitemaps ke links**
 * expose karti hai (pages, years, genres, countries, movies, series).
 *
 * Google / Bing ko sirf ye 1 URL dena hai:
 *   https://your-domain.com/sitemap.xml
 * Aur yahan se woh sari sub‑sitemaps crawl kar lenge.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Count movie sitemaps from vidsrc list
  const { VID_SRC_LATEST_MOVIES } = await import("@/data/vidsrcLatestMovies");
  const totalMovies = VID_SRC_LATEST_MOVIES.length;
  const numberOfMovieSitemaps = Math.ceil(totalMovies / ITEMS_PER_SITEMAP);

  // Count TV-series sitemaps from MongoDB (if available)
  let numberOfSeriesSitemaps = 0;
  try {
    const clientPromise = (await import("@/lib/mongodb-client")).default;
    const client = await clientPromise;
    if (client) {
      const db = client.db("moviesDB");
      const seriesCollection = db.collection("tvSeries");
      const totalSeries = await seriesCollection.countDocuments();
      numberOfSeriesSitemaps = Math.ceil(totalSeries / ITEMS_PER_SITEMAP);
    }
  } catch {
    // ignore DB failure; fall back to zero series sitemaps
  }

  const entries: MetadataRoute.Sitemap = [
    // Core sitemap XML endpoints
    {
      url: `${DOMAIN}/api/sitemap-pages`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${DOMAIN}/api/sitemap-years`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${DOMAIN}/api/sitemap-genres`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${DOMAIN}/api/sitemap-countries`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${DOMAIN}/api/sitemap-landingpages`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  // Movie sitemap XMLs
  for (let i = 1; i <= numberOfMovieSitemaps; i++) {
    entries.push({
      url: `${DOMAIN}/api/sitemap-movies/${i}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  // Series sitemap XMLs
  for (let i = 1; i <= numberOfSeriesSitemaps; i++) {
    entries.push({
      url: `${DOMAIN}/api/sitemap-series/${i}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  return entries;
}