"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getMoviesByImdbIds } from "@/api/tmdb";
import type { Movie } from "@/api/tmdb";
import { generateMovieUrl } from "@/lib/slug";
import Head from "next/head";
import { resolvePosterUrl } from "@/lib/poster";

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const CHUNK_SIZE = 100;

  useEffect(() => {
    void loadInitialMovies();
  }, []);

  const fetchValidMoviesChunk = async (startOffset: number) => {
    let attemptOffset = startOffset;
    for (let i = 0; i < 5; i += 1) {
      const res = await fetch(`/api/movies/list?offset=${attemptOffset}&limit=${CHUNK_SIZE}`);
      const data = await res.json();
      const movieIds = (data.imdb_ids || []) as string[];
      const total = Number(data.total || 0);
      const nextOffset = attemptOffset + CHUNK_SIZE;
      if (movieIds.length === 0) {
        return { moviesChunk: [] as Movie[], nextOffset, total };
      }
      const moviesData = await getMoviesByImdbIds(movieIds);
      if (moviesData.length > 0) {
        return { moviesChunk: moviesData, nextOffset, total };
      }
      // Empty mapped chunk: move to next chunk until we find valid data.
      attemptOffset = nextOffset;
    }
    return { moviesChunk: [] as Movie[], nextOffset: startOffset + CHUNK_SIZE, total: 0 };
  };

  const loadInitialMovies = async () => {
    setLoading(true);
    try {
      const { moviesChunk, nextOffset, total } = await fetchValidMoviesChunk(0);
      setMovies(moviesChunk);
      setOffset(nextOffset);
      setHasMore(nextOffset < total);
    } catch (error) {
      console.error("Error loading initial movies:", error);
      setMovies([]);
    }
    setLoading(false);
  };

  const loadMoreMovies = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const { moviesChunk, nextOffset, total } = await fetchValidMoviesChunk(offset);
      setMovies((prev) => {
        const seen = new Set(prev.map((m) => m.imdb_id));
        const uniqueNew = moviesChunk.filter((m) => !seen.has(m.imdb_id));
        return [...prev, ...uniqueNew];
      });
      setOffset(nextOffset);
      setHasMore(nextOffset < total);
    } catch (error) {
      console.error("Error loading more movies:", error);
    }
    setLoadingMore(false);
  };

  return (
    <>
      <Head>
        <title>All Movies - Watch Free HD Movies Online | 123Movies</title>
        <meta name="description" content="Browse thousands of free HD movies online. Watch latest movies, classic films, and popular titles without registration. Stream movies in HD quality for free." />
        <meta name="keywords" content="all movies, watch movies online free, HD movies streaming, free movies list, latest movies online, popular movies, classic movies, movie collection, stream movies free, fmovies, putlocker, moviesflix, watch free movies online free, free movie streaming, best free movie sites, movie streaming websites, free movies no registration, HD movie streaming free, latest movies free online, new movies streaming, movie download free, watch movies HD free, streaming movies online, free movie websites, movie streaming platform, watch latest movies free, free movie site, movie streaming service, online movies free, watch movies online HD, free movie streaming sites, movie streaming free, watch free HD movies, online movie streaming free, free movies streaming, movie streaming website, watch movies free online free, free movie streaming platform, HD movies online free, streaming free movies, movie streaming sites free, watch movies online free HD, free movie streaming website, movie streaming free online, watch movies free streaming, free movies online streaming, movie streaming sites HD, watch free movies online HD, free movie streaming service, online movie streaming sites, free movies streaming sites, movie streaming platform free, watch movies free online streaming, free HD movie streaming, movie streaming websites free, watch free movies streaming, free movie streaming sites HD, online movies streaming free, movie streaming free sites, watch movies online streaming free, free movie streaming websites, movie streaming sites online, watch free movies online streaming, free movies streaming website, movie streaming platform online, watch movies streaming free, free movie streaming sites online, online movie streaming free sites, movie streaming free website, watch movies free online sites, free movie streaming platform HD, movie streaming sites free HD, watch free movies streaming HD, free movie streaming website HD, online movie streaming free HD, movie streaming free sites HD, watch movies online streaming free HD, free movie streaming websites HD, movie streaming sites online HD, watch free movies online streaming HD, free movies streaming website HD, movie streaming platform online HD, watch movies streaming free HD, free movie streaming sites online HD, online movie streaming free sites HD, movie streaming free website HD, watch movies free online sites HD, free movie streaming platform online HD, movie streaming sites free online HD, watch free movies streaming online HD, free movie streaming website online HD, online movie streaming free online HD, movie streaming free sites online HD, watch movies online streaming free online HD, free movie streaming websites online HD, movie streaming sites online online HD, watch free movies online streaming online HD, free movies streaming website online HD, movie streaming platform online online HD, watch movies streaming free online HD, free movie streaming sites online online HD, online movie streaming free sites online HD, movie streaming free website online HD, watch movies free online sites online HD, free movie streaming platform online online HD" />
        <meta property="og:title" content="All Movies - Watch Free HD Movies Online" />
        <meta property="og:description" content="Browse thousands of free HD movies online. Watch latest movies, classic films, and popular titles without registration." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="All Movies - Watch Free HD Movies Online" />
        <meta name="twitter:description" content="Browse thousands of free HD movies online. Watch latest movies, classic films, and popular titles without registration." />
      </Head>
      <div className="min-h-screen bg-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-3xl font-bold text-white mb-8">All Movies</h1>
        
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-3">
            {Array.from({ length: 80 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-gray-800 rounded animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-3">
            {movies.map((movie, index) => (
              <Link
                key={`${movie.imdb_id}-${index}`}
                href={generateMovieUrl(movie.title, movie.imdb_id)}
                className="group relative"
              >
                <div className="relative aspect-[2/3] bg-gray-800 rounded overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300">
                  <Image
                    src={resolvePosterUrl(movie.poster_path, "w500")}
                    alt={movie.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  <div className="absolute top-0.5 right-0.5 bg-yellow-500 text-black text-xs font-bold px-1 py-0.5 rounded">
                    HD
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-6 h-6 bg-[#3fae2a] rounded-full flex items-center justify-center hover:bg-[#35a024] hover:scale-110 transition-all duration-200">
                      <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-white text-xs mt-1 line-clamp-1 group-hover:text-[#3fae2a] transition-colors">
                  {movie.title}
                </h3>
              </Link>
            ))}
          </div>
        )}
        {!loading && (
          <div className="text-center mt-8">
            {hasMore ? (
              <button
                onClick={loadMoreMovies}
                disabled={loadingMore}
                className="bg-[#3fae2a] hover:bg-[#35a024] disabled:opacity-60 text-white font-semibold px-6 py-3 rounded"
              >
                {loadingMore ? "Loading..." : "Load More Movies"}
              </button>
            ) : (
              <p className="text-gray-400 text-sm">No more movies to load</p>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
