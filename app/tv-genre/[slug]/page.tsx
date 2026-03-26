"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getTVImageUrl } from "@/api/tmdb-tv";
import { getTVGenreBySlug } from "@/data/tvGenres";
import Head from "next/head";

// Helper function to create series slug
function createSeriesSlug(name: string, id: string | number): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${slug}-${id}`;
}

export default function TVGenrePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [allSeries, setAllSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 7;
  
  const genre = getTVGenreBySlug(slug);
  
  // Fetch series from MongoDB API with pagination
  const fetchSeries = async (skip: number = 0) => {
    try {
      if (skip === 0) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      // Use genre filter from API
      const genreName = genre?.name || '';
      const response = await fetch(`/api/tv-series-db?limit=${ITEMS_PER_PAGE}&skip=${skip}&sortBy=first_air_date&sortOrder=desc&genre=${encodeURIComponent(genreName)}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        const seriesWithCount = result.data.map((series: any) => ({
          imdb_id: series.imdb_id,
          tmdb_id: series.tmdb_id,
          name: series.name || `TV Series ${series.imdb_id}`,
          overview: series.overview,
          poster_path: series.poster_path,
          backdrop_path: series.backdrop_path,
          first_air_date: series.first_air_date,
          vote_average: series.vote_average || 0,
          number_of_seasons: series.number_of_seasons || series.seasons?.length || 0,
          episodeCount:
            Number(series.number_of_episodes || 0) ||
            series.seasons?.reduce((sum: number, season: any) => sum + (season?.episodes?.length || 0), 0) ||
            0
        }));
        
        if (skip === 0) {
          setAllSeries(seriesWithCount);
        } else {
          setAllSeries(prev => [...prev, ...seriesWithCount]);
        }
        
        setTotalCount(result.total || 0);
        setHasMore((skip + ITEMS_PER_PAGE) < (result.total || 0));
      }
    } catch (error) {
      console.error('Error fetching series:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };
  
  // Load initial series
  useEffect(() => {
    fetchSeries(0);
    
    if (genre) {
      document.title = `${genre.name} TV Shows - Watch Online`;
    }
  }, [genre]);
  
  // Load more handler
  const handleLoadMore = () => {
    fetchSeries(allSeries.length);
  };
  
  if (!genre) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Genre Not Found</h1>
            <p className="text-gray-400">The requested TV genre could not be found.</p>
            <Link href="/series" className="text-purple-400 hover:text-purple-300 mt-4 inline-block">
              ← Back to TV Series
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const seriesInGenre = allSeries;

  return (
    <>
      <Head>
        <title>{genre.name} TV Shows - Watch Free Online | 123Movies</title>
        <meta name="description" content={`Watch ${genre.name.toLowerCase()} TV shows and series online for free. Stream the best ${genre.name.toLowerCase()} television series in HD quality. No registration required.`} />
        <meta name="keywords" content={`${genre.name.toLowerCase()} TV shows, ${genre.name.toLowerCase()} series, watch ${genre.name.toLowerCase()} shows online, free ${genre.name.toLowerCase()} TV series, ${genre.name.toLowerCase()} television shows, stream ${genre.name.toLowerCase()} series`} />
        <meta property="og:title" content={`${genre.name} TV Shows - Watch Free Online`} />
        <meta property="og:description" content={`Watch ${genre.name.toLowerCase()} TV shows and series online for free. Stream the best ${genre.name.toLowerCase()} television series in HD quality.`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${genre.name} TV Shows - Watch Free Online`} />
        <meta name="twitter:description" content={`Watch ${genre.name.toLowerCase()} TV shows and series online for free. Stream the best ${genre.name.toLowerCase()} television series in HD quality.`} />
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
          <h1 className="text-4xl font-bold text-white mb-2">{genre.name} TV Shows</h1>
          <p className="text-gray-400">{genre.description}</p>
          <p className="text-purple-400 mt-2 text-sm">
            📺 {loading ? 'Loading...' : `Showing ${allSeries.length} of ${totalCount.toLocaleString()} TV shows • New releases first`}
          </p>
        </div>

        {/* Series Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 animate-pulse">📺</div>
            <h2 className="text-2xl font-bold text-white mb-2">Loading TV Shows...</h2>
            <p className="text-gray-400">Please wait</p>
          </div>
        ) : seriesInGenre.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📺</div>
            <h2 className="text-2xl font-bold text-white mb-2">No TV Shows Available</h2>
            <p className="text-gray-400">No TV shows found in the {genre.name} genre.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {seriesInGenre.map((series, index) => (
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
                      {/* Genre Badge */}
                      <div className="absolute top-2 left-2 bg-purple-600 bg-opacity-90 text-white text-xs px-2 py-1 rounded">
                        {genre.name}
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
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg"
                >
                  {loadingMore ? 'Loading...' : `Load More (${totalCount - allSeries.length} remaining)`}
                </button>
                <p className="text-gray-400 text-sm mt-2">
                  Showing {allSeries.length} of {totalCount.toLocaleString()} series in {genre.name}
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
