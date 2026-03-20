import { NextRequest, NextResponse } from 'next/server';
import { generateMovieUrl } from '@/lib/slug';
import { getBaseUrlForBuild } from '@/lib/domain';
import { getBatchMovieCount, getBatchMovieItemsSlice } from '@/lib/batchMovies';

const DOMAIN = getBaseUrlForBuild();
// User request: 50k movies per sitemap chunk
const MOVIES_PER_SITEMAP = 50000;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sitemapNumber = parseInt(id, 10);
    
    if (isNaN(sitemapNumber) || sitemapNumber < 1) {
      return new NextResponse('Invalid sitemap number', { status: 400 });
    }

    const totalMovies = getBatchMovieCount();
    
    // Calculate start and end indices for this sitemap
    const startIndex = (sitemapNumber - 1) * MOVIES_PER_SITEMAP;
    const endIndex = Math.min(startIndex + MOVIES_PER_SITEMAP, totalMovies);
    
    // Check if sitemap number is valid
    if (startIndex >= totalMovies) {
      return new NextResponse('Sitemap not found', { status: 404 });
    }
    
    // Get movie IDs for this chunk
    const movieChunk = getBatchMovieItemsSlice(startIndex, endIndex - startIndex);
    
    console.log(`Generating sitemap ${sitemapNumber}: Movies ${startIndex}-${endIndex} (${movieChunk.length} movies)`);
    
    // Generate sitemap XML directly from movie IDs (without TMDB API call for speed)
    const lastmod = new Date().toISOString();
    
    // Generate sitemap XML with actual movie URLs (title-slug format), without TMDB calls.
    const urlEntriesString = movieChunk
      .map(({ imdb_id, title }) => {
        const safeImdb = (imdb_id || '').trim();
        if (!safeImdb) return '';
        const url = title ? generateMovieUrl(title, safeImdb) : `/${safeImdb}`;
        return `  <url>
    <loc>${DOMAIN}${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      })
      .filter(Boolean)
      .join('\n');
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntriesString}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
    
  } catch (error) {
    console.error('Error generating movie sitemap:', error);
    return new NextResponse('Error generating movie sitemap', { status: 500 });
  }
}


