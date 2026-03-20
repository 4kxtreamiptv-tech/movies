import { MetadataRoute } from "next";
import { getBaseUrlForBuild } from "@/lib/domain";
import { getBatchMovieCount, getBulkSeriesCount } from "@/lib/batchMovies";

const DOMAIN = getBaseUrlForBuild();
const ITEMS_PER_SITEMAP = 50000;

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

  // Count movie + TV-series sitemaps from the same bulk datasets used by chunk routes
  const totalMovies = getBatchMovieCount();
  const numberOfMovieSitemaps = Math.ceil(totalMovies / ITEMS_PER_SITEMAP);

  const totalSeries = getBulkSeriesCount();
  const numberOfSeriesSitemaps = Math.ceil(totalSeries / ITEMS_PER_SITEMAP);

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