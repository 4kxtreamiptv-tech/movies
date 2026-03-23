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

// Design 7: Magazine/Editorial Layout
export default function LandingVariant7({ keyword, description, colorTheme, content }: Props) {
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
    <div className="min-h-screen bg-white">
      <style jsx>{`
        @keyframes slideInFromTop {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeInScale {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-slideInFromTop {
          animation: slideInFromTop 0.8s ease-out;
        }
        .animate-fadeInScale {
          animation: fadeInScale 0.6s ease-out;
        }
      `}</style>

      {/* Magazine Hero - Large Typography */}
      <div className="border-b-8" style={{ borderColor: colorTheme.primary }}>
        <div className="max-w-7xl mx-auto px-8 py-24">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left - Editorial Text */}
            <div>
              <div className="mb-6">
                <div className="inline-block">
                  <p className="text-xs uppercase tracking-[0.3em] font-bold mb-2" style={{ color: colorTheme.accent }}>
                    STREAMING MAGAZINE • 2025
                  </p>
                  <div className="h-1 w-24" style={{ backgroundColor: colorTheme.primary }} />
                </div>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-black leading-tight mb-8 text-gray-900" style={{
                wordBreak: 'break-word',
                hyphens: 'auto'
              }}>
                {keyword}
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {description}
              </p>

              <div className="flex gap-4">
                <Link 
                  href="/home"
                  className="inline-block px-10 py-4 text-white font-bold text-lg transition-all hover:translate-x-2"
                  style={{ 
                    backgroundColor: colorTheme.buttonBg,
                    boxShadow: `8px 8px 0px ${colorTheme.accent}`
                  }}
                >
                  Browse Library →
                </Link>
                <Link 
                  href="/movies"
                  className="inline-block px-10 py-4 border-4 font-bold text-lg transition-all hover:translate-x-2"
                  style={{ 
                    borderColor: colorTheme.accent,
                    color: colorTheme.accent
                  }}
                >
                  All Movies
                </Link>
              </div>
            </div>

            {/* Right - Search */}
            <div className="bg-gray-50 p-10 border-l-8" style={{ borderColor: colorTheme.accent }}>
              <h3 className="text-2xl font-black mb-6 text-gray-900 uppercase tracking-wide">
                Find Content
              </h3>
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search movies, series..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 border-2 border-gray-300 focus:outline-none focus:border-current mb-4 text-lg"
                  style={{ borderColor: colorTheme.searchBorder }}
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 text-white font-black tracking-wider"
                  style={{ backgroundColor: colorTheme.buttonBg }}
                >
                  {loading ? "SEARCHING..." : "SEARCH NOW"}
                </button>
              </form>
              
              <div className="mt-8 space-y-2 text-sm text-gray-600">
                <p>✓ Over 10,000 titles</p>
                <p>✓ Updated daily</p>
                <p>✓ HD quality streams</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {showResults && (
        <div className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-8">
            <div className="mb-12">
              <h2 className="text-5xl font-black text-gray-900 mb-2 uppercase">Results</h2>
              <div className="h-2 w-32" style={{ backgroundColor: colorTheme.primary }} />
            </div>
            
            {loading ? (
              <div className="text-center py-20">
                <div className="text-6xl animate-blink" style={{ color: colorTheme.primary }}>●</div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
                {searchResults.map((movie, index) => (
                  <div
                    key={`${movie.imdb_id}-${index}`}
                    onClick={() => handleMovieClick(movie)}
                    className="cursor-pointer group"
                  >
                    <div className="relative aspect-[2/3] bg-gray-200 border-4 border-gray-900 overflow-hidden group-hover:border-current transition-colors"
                      style={{ borderColor: 'black' }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = colorTheme.primary}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'black'}
                    >
                      <Image
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.svg'}
                        alt={movie.title}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 transition-all"
                      />
                    </div>
                    <p className="mt-3 font-bold text-xs uppercase tracking-wide text-gray-900 line-clamp-2">
                      {movie.title}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Editorial Content */}
      <div className="max-w-6xl mx-auto px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {content.intro.map((para: string, i: number) => (
            <div key={i} className="border-t-4 pt-6" style={{ borderColor: colorTheme.accent }}>
              <div className="text-6xl font-black mb-4 opacity-20" style={{ color: colorTheme.primary }}>
                {i + 1}
              </div>
              <p className="text-gray-700 leading-relaxed">{para}</p>
            </div>
          ))}
        </div>

        {content.sections.map((section: any, i: number) => (
          <div key={i} className="mb-16 pb-16 border-b-2 border-gray-200 last:border-0">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-16 h-16 flex items-center justify-center font-black text-2xl text-white"
                style={{ backgroundColor: colorTheme.primary }}
              >
                {i + 1}
              </div>
              <h3 className="text-4xl font-black text-gray-900 uppercase tracking-tight">
                {section.title}
              </h3>
            </div>
            <div className="space-y-6 pl-24">
              {section.paragraphs.map((para: string, j: number) => (
                <p key={j} className="text-gray-700 leading-relaxed text-lg">
                  {para}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Magazine Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center">
            <h3 className="text-6xl font-black mb-4 uppercase tracking-tighter">
              {keyword}
            </h3>
            <div className="h-1 w-32 mx-auto mb-4" style={{ backgroundColor: colorTheme.primary }} />
            <p className="text-gray-400 uppercase tracking-widest text-xs">
              Your Entertainment Magazine
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

