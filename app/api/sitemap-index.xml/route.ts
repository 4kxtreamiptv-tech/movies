import { NextResponse } from 'next/server';
import { getBaseUrlForBuild } from '@/lib/domain';
import { getBatchMovieCount, getBulkSeriesCount } from '@/lib/batchMovies';

const DOMAIN = getBaseUrlForBuild();
// 50k movies / 50k series per sitemap chunk
const ITEMS_PER_SITEMAP = 50000;

export async function GET() {
  try {
    // Use the same datasets as the chunk routes
    const totalMovies = getBatchMovieCount();
    const numberOfMovieSitemaps = Math.ceil(totalMovies / ITEMS_PER_SITEMAP);

    const totalSeries = getBulkSeriesCount();
    const numberOfSeriesSitemaps = Math.ceil(totalSeries / ITEMS_PER_SITEMAP);
    
    const lastmod = new Date().toISOString();
    
    // Generate sitemap index XML with all sub-sitemaps
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
${Array.from({ length: numberOfMovieSitemaps }, (_, i) => `  <sitemap>
    <loc>${DOMAIN}/api/sitemap-movies/${i + 1}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`).join('\n')}
${Array.from({ length: numberOfSeriesSitemaps }, (_, i) => `  <sitemap>
    <loc>${DOMAIN}/api/sitemap-series/${i + 1}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

    return new Response(sitemapIndex, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
    
  } catch (error) {
    console.error('Error generating sitemap index:', error);
    return new NextResponse('Error generating sitemap index', { status: 500 });
  }
}

