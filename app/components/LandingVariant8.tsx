"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getYear } from "@/api/tmdb";
import type { MovieListItem } from "@/api/tmdb";
import { generateMovieUrl } from "@/lib/slug";

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

interface Props {
  keyword: string;
  description: string;
  colorTheme: ColorTheme;
  content: any;
}

// Design 8: Card Deck / Stack Style
export default function LandingVariant8({ keyword, description, colorTheme, content }: Props) {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <style jsx>{`
        @keyframes cardSlide {
          from { transform: translateY(20px) rotate(-2deg); opacity: 0; }
          to { transform: translateY(0) rotate(0deg); opacity: 1; }
        }
        @keyframes stackAppear {
          0% { transform: translateZ(-100px) scale(0.8); opacity: 0; }
          100% { transform: translateZ(0) scale(1); opacity: 1; }
        }
        .animate-cardSlide {
          animation: cardSlide 0.6s ease-out;
        }
        .card-stack {
          transform-style: preserve-3d;
          perspective: 1000px;
        }
      `}</style>

      {/* Card Stack Hero */}
      <div className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-7xl md:text-8xl font-black text-gray-900 mb-4 tracking-tight">
              {keyword}
            </h1>
            <p className="text-2xl text-gray-600 font-light">
              {description}
            </p>
          </div>

          {/* Stacked Cards */}
          <div className="relative card-stack mx-auto max-w-4xl">
            {/* Card 1 - Search */}
            <div 
              className="relative bg-white rounded-3xl p-10 shadow-2xl mb-8 transform hover:scale-105 transition-all animate-cardSlide"
              style={{ 
                boxShadow: `0 20px 60px ${colorTheme.primary}30`,
                animationDelay: '0s'
              }}
            >
              <form onSubmit={handleSearch}>
                <label className="block text-sm font-black uppercase tracking-wide mb-4 text-gray-900">
                  What would you like to watch?
                </label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Type movie name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-6 py-4 bg-gray-50 border-2 rounded-2xl focus:outline-none focus:border-current text-lg"
                    style={{ borderColor: colorTheme.primary }}
                  />
                  <button 
                    type="submit"
                    disabled={loading}
                    className="px-10 py-4 rounded-2xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                    style={{ backgroundColor: colorTheme.buttonBg }}
                  >
                    {loading ? "..." : "GO"}
                  </button>
                </div>
              </form>
            </div>

            {/* Card 2 - Info */}
            <div 
              className="relative bg-white rounded-3xl p-10 shadow-2xl mb-8 transform hover:scale-105 transition-all animate-cardSlide"
              style={{ 
                boxShadow: `0 20px 60px ${colorTheme.accent}30`,
                animationDelay: '0.2s'
              }}
            >
              <div className="grid grid-cols-3 gap-8 text-center">
                {[
                  { num: '10K+', label: 'Movies' },
                  { num: '5K+', label: 'Series' },
                  { num: '100%', label: 'Free' }
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-5xl font-black mb-2" style={{ color: colorTheme.primary }}>
                      {stat.num}
                    </div>
                    <div className="text-sm text-gray-600 font-semibold uppercase tracking-wide">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3 - CTA */}
            <div 
              className="relative rounded-3xl p-10 shadow-2xl text-white text-center animate-cardSlide"
              style={{ 
                background: `linear-gradient(135deg, ${colorTheme.primary}, ${colorTheme.accent})`,
                animationDelay: '0.4s'
              }}
            >
              <p className="text-xl font-bold mb-4">Ready to start watching?</p>
              <Link 
                href="/home"
                className="inline-block px-10 py-4 bg-white rounded-full font-black text-lg transition-all hover:scale-110"
                style={{ color: colorTheme.primary }}
              >
                Browse Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Card Results */}
      {showResults && (
        <div className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-8">
            <h2 className="text-5xl font-black text-gray-900 mb-12 uppercase tracking-tight">
              Search Results
            </h2>
            {loading ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 border-8 rounded-full animate-spin mx-auto"
                  style={{ 
                    borderColor: `${colorTheme.primary}20`,
                    borderTopColor: colorTheme.primary
                  }}
                />
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
                {searchResults.map((movie, index) => (
                  <div
                    key={`${movie.imdb_id}-${index}`}
                    onClick={() => handleMovieClick(movie)}
                    className="cursor-pointer group animate-fadeInScale"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform group-hover:-translate-y-2">
                      <div className="relative aspect-[2/3]">
                        <Image
                          src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.svg'}
                          alt={movie.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <p className="font-bold text-sm text-gray-900 line-clamp-2">{movie.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{getYear(movie.release_date)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Editorial Sections */}
      <div className="max-w-5xl mx-auto px-8 py-20">
        {content.sections.map((section: any, i: number) => (
          <div key={i} className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-2 h-20" style={{ backgroundColor: colorTheme.accent }} />
              <h3 className="text-5xl font-black text-gray-900 leading-tight">
                {section.title}
              </h3>
            </div>
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              {section.paragraphs.map((para: string, j: number) => (
                <p key={j}>{para}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bold Footer */}
      <footer className="border-t-8 py-20" style={{ borderColor: colorTheme.primary }}>
        <div className="max-w-6xl mx-auto px-8 text-center">
          <h3 className="text-6xl font-black text-gray-900 mb-4 uppercase">
            {keyword}
          </h3>
          <p className="text-gray-600 text-sm uppercase tracking-widest">
            Editorial Streaming Experience
          </p>
        </div>
      </footer>
    </div>
  );
}

