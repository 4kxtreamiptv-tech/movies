"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getYear } from "@/api/tmdb";
import type { MovieListItem } from "@/api/tmdb";
import { generateMovieUrl } from "@/lib/slug";
import StructuredData from '@/components/StructuredData';

interface ColorTheme {
  primary: string;
  secondary: string;
  accent: string;
  buttonBg: string;
  buttonHover: string;
  searchBorder: string;
  searchFocus: string;
  cardHover: string;
  playButton: string;
  textAccent: string;
}

interface KeywordLandingPageProps {
  keyword: string;
  title: string;
  description: string;
  colorTheme: ColorTheme;
  content: {
    heading: string;
    intro: string[];
    sections: {
      title: string;
      paragraphs: string[];
    }[];
  };
}

export default function KeywordLandingPage({ keyword, title, description, colorTheme, content }: KeywordLandingPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<MovieListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setShowResults(true);
    
    try {
      const response = await fetch(
        `/api/tmdb-search-movies?q=${encodeURIComponent(searchTerm.trim())}&limit=20&page=1`
      );
      const result = await response.json();
      if (result?.success && Array.isArray(result.data)) {
        const moviesData = result.data
          .filter(movie => movie.imdb_id && movie.imdb_id.trim() !== '')
          .map(movie => ({
            ...movie,
            imdb_id: movie.imdb_id!,
          }));
        setSearchResults(moviesData);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
    setLoading(false);
  };

  const handleMovieClick = (movie: MovieListItem) => {
    router.push(generateMovieUrl(movie.title, movie.imdb_id || ''));
  };

  return (
    <>
      <StructuredData type="website" />
      <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            {keyword.toUpperCase()}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {description} - curated picks, fast discovery, and smooth playback in one place.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Search movies or series"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`flex-1 px-4 py-3 border ${colorTheme.searchBorder} rounded-l-lg focus:outline-none focus:${colorTheme.searchFocus} text-lg`}
                style={{ borderColor: colorTheme.searchBorder }}
              />
              <button 
                type="submit"
                disabled={loading}
                className="disabled:opacity-50 text-white px-6 py-3 rounded-r-lg transition-colors"
                style={{ backgroundColor: colorTheme.buttonBg }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colorTheme.buttonHover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colorTheme.buttonBg}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </button>
            </form>
          </div>

          <Link 
            href="/home" 
            className="inline-block text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            style={{ backgroundColor: colorTheme.accent }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colorTheme.buttonHover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colorTheme.accent}
          >
            Explore Full Library
          </Link>
        </div>

        {/* Search Results */}
        {showResults && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Search Results for "{searchTerm}"
              </h2>
              <button 
                onClick={() => {
                  setShowResults(false);
                  setSearchTerm("");
                  setSearchResults([]);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕ Clear
              </button>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <div 
                  className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto"
                  style={{ borderTopColor: colorTheme.primary, borderBottomColor: colorTheme.primary }}
                ></div>
                <p className="text-gray-600 mt-4">Searching movies...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {searchResults.map((movie, index) => (
                  <div
                    key={`${movie.imdb_id}-${index}`}
                    onClick={() => handleMovieClick(movie)}
                    className="cursor-pointer group"
                  >
                    <div className="relative aspect-[2/3] bg-gray-200 rounded-lg overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <Image
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.svg'}
                        alt={movie.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: colorTheme.playButton }}
                          >
                            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <h3 
                        className="text-gray-800 font-semibold text-sm line-clamp-2 transition-colors"
                        style={{ '--hover-color': colorTheme.textAccent } as React.CSSProperties}
                        onMouseEnter={(e) => e.currentTarget.style.color = colorTheme.textAccent}
                        onMouseLeave={(e) => e.currentTarget.style.color = ''}
                      >
                        {movie.title}
                      </h3>
                      <p className="text-gray-500 text-xs mt-1">
                        {getYear(movie.release_date)} • ⭐ {movie.vote_average?.toFixed(1) || 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No movies found for "{searchTerm}"</p>
                <p className="text-gray-500 text-sm mt-2">Try a different search term</p>
              </div>
            )}
          </div>
        )}

        {/* Genre List */}
        <div className="mb-12">
          <p className="text-gray-700 text-lg leading-relaxed">
            Explore popular categories including Action, Adventure, Animation, Biography, Comedy, Crime, Documentary, Drama, Family, Fantasy, History, Horror, Mystery, Reality, Romance, Sci-Fi, Thriller, and more.
          </p>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            {content.heading}
          </h2>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            {content.intro.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}

            {content.sections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <h3 className="text-2xl font-bold text-gray-800 mt-12 mb-4">
                  {section.title}
                </h3>
                {section.paragraphs.map((paragraph, paraIndex) => (
                  <p key={paraIndex} className="mb-4">{paragraph}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="text-3xl font-bold text-gray-800">{keyword.toUpperCase()}</span>
                <div 
                  className="w-6 h-6 rounded ml-2 flex items-center justify-center"
                  style={{ backgroundColor: colorTheme.accent }}
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Browse a large catalog of movies and series with a cleaner experience,
                better search, and faster discovery across genres.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/home" className="text-gray-400 hover:text-white transition-colors text-sm">Home</Link></li>
                <li><Link href="/movies" className="text-gray-400 hover:text-white transition-colors text-sm">All Movies</Link></li>
                <li><Link href="/genres" className="text-gray-400 hover:text-white transition-colors text-sm">Genres</Link></li>
                <li><Link href="/country" className="text-gray-400 hover:text-white transition-colors text-sm">Countries</Link></li>
                <li><Link href="/search" className="text-gray-400 hover:text-white transition-colors text-sm">Search</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Popular Genres</h3>
              <ul className="space-y-2">
                <li><Link href="/genre/action" className="text-gray-400 hover:text-white transition-colors text-sm">Action</Link></li>
                <li><Link href="/genre/comedy" className="text-gray-400 hover:text-white transition-colors text-sm">Comedy</Link></li>
                <li><Link href="/genre/drama" className="text-gray-400 hover:text-white transition-colors text-sm">Drama</Link></li>
                <li><Link href="/genre/horror" className="text-gray-400 hover:text-white transition-colors text-sm">Horror</Link></li>
                <li><Link href="/genre/romance" className="text-gray-400 hover:text-white transition-colors text-sm">Romance</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8">
            <div className="text-center">
              <div className="text-gray-500 text-sm">
                Updated daily for viewers who want simple and reliable entertainment discovery.
              </div>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}

