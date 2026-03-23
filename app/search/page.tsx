"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getYear } from "@/api/tmdb";
import { generateMovieUrl } from "@/lib/slug";
import Head from "next/head";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        setPage(1);
        setTotalResults(0);
        setTotalPages(0);
        return;
      }

      setLoading(true);
      setError(null);
      setPage(1);
      setResults([]);
      setTotalResults(0);
      setTotalPages(0);

      try {
        const limit = 20;
        const res = await fetch(
          `/api/tmdb-search-movies?q=${encodeURIComponent(query)}&limit=${limit}&page=1`
        );
        const json = await res.json();
        if (json?.success) {
          setResults(Array.isArray(json.data) ? json.data : []);
          setTotalResults(json.pagination?.totalResults || 0);
          setTotalPages(json.pagination?.totalPages || 0);
        } else {
          setError('Failed to search movies. Please try again.');
          setResults([]);
        }
      } catch (e) {
        console.error('Error searching movies:', e);
        setError('Failed to search movies. Please try again.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    void performSearch();
  }, [query]);

  const loadMore = async () => {
    if (loadingMore) return;
    if (page >= totalPages) return;

    setLoadingMore(true);
    try {
      const limit = 20;
      const nextPage = page + 1;
      const res = await fetch(
        `/api/tmdb-search-movies?q=${encodeURIComponent(query)}&limit=${limit}&page=${nextPage}`
      );
      const json = await res.json();
      if (json?.success) {
        setResults((prev) => [...prev, ...(Array.isArray(json.data) ? json.data : [])]);
        setTotalResults(json.pagination?.totalResults || totalResults);
        setTotalPages(json.pagination?.totalPages || totalPages);
        setPage(nextPage);
      }
    } catch (e) {
      console.error('Error loading more movies:', e);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            <p className="mt-4 text-gray-400 text-lg">Searching for &quot;{query}&quot;...</p>
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-block mb-4 text-purple-400 hover:text-purple-300 transition-colors">
            &larr; Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">
            Search Results
          </h1>
          <p className="text-gray-400">
            {results.length > 0 ? (
              <>
                Showing {results.length} of {totalResults.toLocaleString()} movies for "{query}"
              </>
            ) : (
              <>No movies found for "{query}"</>
            )}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* No Results */}
        {!loading && results.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-white mb-2">No movies found</h2>
            <p className="text-gray-400 mb-6">
              We couldn&apos;t find any movies matching &quot;{query}&quot;
            </p>
            <div className="space-y-2 text-gray-500">
              <p>Try:</p>
              <ul className="text-sm">
                <li>• Using different keywords</li>
                <li>• Checking your spelling</li>
                <li>• Using more general terms</li>
                <li>• Searching by movie title only</li>
              </ul>
            </div>
          </div>
        )}

        {/* Search Results Grid */}
        {results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map((movie, index) => (
              <Link
                key={`${movie.imdb_id}-${index}`}
                href={generateMovieUrl(movie.title, movie.imdb_id || '')}
                className="group relative bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {/* Movie Poster */}
                <div className="relative aspect-[2/3] bg-gray-700">
                  <Image
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.svg'}
                    alt={movie.title}
                    fill
                    className="object-cover group-hover:brightness-110 transition-all duration-300"
                    onError={(e) => {
                      console.log('Search page poster error:', movie.title, movie.poster_path);
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Movie Info */}
                <div className="p-3">
                  <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-purple-400 transition-colors">
                    {movie.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-gray-400 text-xs">
                      {getYear(movie.release_date)}
                    </span>
                    <div className="flex items-center">
                      <span className="text-yellow-400 text-xs">⭐</span>
                      <span className="text-gray-400 text-xs ml-1">
                        {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && results.length > 0 && page < totalPages && (
          <div className="text-center mt-8">
            <button
              onClick={() => void loadMore()}
              disabled={loadingMore}
              className="bg-[#3fae2a] hover:bg-[#35a024] disabled:opacity-60 text-white font-semibold px-6 py-3 rounded"
            >
              {loadingMore ? "Loading..." : `Load More Movies (${Math.max(0, totalResults - results.length)} remaining)`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <>
      <Head>
        <title>Search Movies - Find Your Favorite Films | 123Movies</title>
        <meta name="description" content="Search and find your favorite movies online. Browse through thousands of free HD movies by title, genre, or year. Quick and easy movie search with instant results." />
        <meta name="keywords" content="search movies, find movies online, movie search engine, search films, browse movies, movie finder, search free movies, movie search tool" />
        <meta property="og:title" content="Search Movies - Find Your Favorite Films" />
        <meta property="og:description" content="Search and find your favorite movies online. Browse through thousands of free HD movies by title, genre, or year." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Search Movies - Find Your Favorite Films" />
        <meta name="twitter:description" content="Search and find your favorite movies online. Browse through thousands of free HD movies by title, genre, or year." />
      </Head>
      <Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
              <p className="mt-4 text-gray-400 text-lg">Loading...</p>
            </div>
          </div>
        </div>
      }>
        <SearchResultsContent />
      </Suspense>
    </>
  );
}
