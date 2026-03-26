"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getTVImageUrl } from "@/api/tmdb-tv";
import Head from "next/head";
// REMOVED: import { TV_SERIES_STATIC } from "@/data/tvSeriesStatic"; // 61MB - Now lazy loaded

// Helper function to create series slug
function createSeriesSlug(name: string, id: string | number): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${slug}-${id}`;
}

export default function TVYearPage() {
  const params = useParams();
  const slug = params.slug as string;
  const year = parseInt(slug);
  const [displayCount, setDisplayCount] = useState(7);
  const [allSeriesData, setAllSeriesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Set page title
  useEffect(() => {
    if (year) {
      document.title = `${year} TV Shows - Watch Online`;
    }
  }, [year]);

  // Load TV series data from MongoDB API
  useEffect(() => {
    if (!year || isNaN(year)) return;
    
    setLoading(true);
    
    // Fetch series by year from MongoDB
    console.log(`Fetching TV series for year: ${year}`);
    fetch(`/api/tv-series-db?limit=100&year=${year}&sortBy=vote_average&sortOrder=desc`)
      .then(res => res.json())
      .then(result => {
        console.log(`TV series API response for year ${year}:`, result);
        if (result.success && result.data) {
          const seriesData = result.data.map((data: any) => ({
      imdb_id: data.imdb_id,
      tmdb_id: data.tmdb_id,
      name: data.name || `TV Series ${data.imdb_id}`,
      poster_path: data.poster_path,
      backdrop_path: data.backdrop_path,
      overview: data.overview,
      first_air_date: data.first_air_date,
      vote_average: data.vote_average || 0,
      number_of_seasons: data.number_of_seasons || data.seasons?.length || 0,
      episodeCount:
        Number(data.number_of_episodes || 0) ||
        data.seasons?.reduce((sum: number, season: any) => sum + (season?.episodes?.length || 0), 0) ||
        0
          }));
          
          setAllSeriesData(seriesData);
          console.log(`Loaded ${seriesData.length} series for year ${year}`);
        } else {
          console.log(`No data found for year ${year}`);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading TV series data:', error);
        setLoading(false);
      });
  }, [year]);
  
  if (!year || isNaN(year)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Year Not Found</h1>
            <p className="text-gray-400">The requested year could not be found.</p>
            <Link href="/series" className="text-purple-400 hover:text-purple-300 mt-4 inline-block">
              ← Back to TV Series
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const seriesInYear = allSeriesData.slice(0, displayCount);

  return (
    <>
      <Head>
        <title>{year} TV Shows - Watch Free Online | 123Movies</title>
        <meta name="description" content={`Watch TV shows and series from ${year} online for free. Stream the best television series released in ${year} in HD quality. No registration required.`} />
        <meta name="keywords" content={`${year} TV shows, ${year} TV series, watch ${year} shows online, free ${year} television series, ${year} TV programs, stream ${year} TV shows, ${year} television shows`} />
        <meta property="og:title" content={`${year} TV Shows - Watch Free Online`} />
        <meta property="og:description" content={`Watch TV shows and series from ${year} online for free. Stream the best television series released in ${year} in HD quality.`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${year} TV Shows - Watch Free Online`} />
        <meta name="twitter:description" content={`Watch TV shows and series from ${year} online for free. Stream the best television series released in ${year} in HD quality.`} />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/series" className="text-purple-400 hover:text-purple-300">
              ← Back to TV Series
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">{year} TV Shows</h1>
          <p className="text-gray-400">TV shows and series released in {year}</p>
          <p className="text-purple-400 mt-2 text-sm">
            📺 {allSeriesData.length.toLocaleString()} TV shows from {year} • Sorted by rating
          </p>
        </div>

        {/* Series Grid */}
        {seriesInYear.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📺</div>
            <h2 className="text-2xl font-bold text-white mb-2">No TV Shows Available</h2>
            <p className="text-gray-400">No TV shows found for the year {year}.</p>
            <Link href="/series" className="text-purple-400 hover:text-purple-300 mt-4 inline-block">
              Browse All TV Series
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {seriesInYear.map((series, index) => (
                <Link
                  key={series.tmdb_id ?? series.imdb_id ?? `series-${index}`}
                  href={`/${createSeriesSlug(series.name, series.tmdb_id || series.imdb_id)}`}
                  className="group"
                >
                  <div className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all duration-200">
                    {/* Poster */}
                    <div className="relative aspect-[2/3] bg-gray-700">
                      <Image
                        src={getTVImageUrl(series.poster_path, 'w500')}
                        alt={series.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      {/* Episode Count Badge */}
                      {series.episodeCount > 0 && (
                        <div className="absolute top-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                          {series.episodeCount} eps
                        </div>
                      )}
                      {/* Year Badge */}
                      <div className="absolute top-2 left-2 bg-purple-600 bg-opacity-90 text-white text-xs px-2 py-1 rounded">
                        {year}
                      </div>
                    </div>
                    
                    {/* Info */}
                    <div className="p-3">
                      <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1 group-hover:text-purple-400 transition-colors">
                        {series.name}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{series.first_air_date?.split('-')[0] || 'N/A'}</span>
                        {series.vote_average > 0 && (
                          <span className="flex items-center">
                            ⭐ {series.vote_average.toFixed(1)}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-purple-400 mt-1">
                        {series.number_of_seasons} {series.number_of_seasons === 1 ? 'Season' : 'Seasons'}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Load More Button */}
            {displayCount < allSeriesData.length && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setDisplayCount(prev => Math.min(prev + 7, allSeriesData.length))}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg"
                >
                  Load More ({allSeriesData.length - displayCount} remaining)
                </button>
                <p className="text-gray-400 text-sm mt-2">
                  Showing {displayCount} of {allSeriesData.length} series from {year}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
    </>
  );
}
