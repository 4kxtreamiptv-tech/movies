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

// Design 10: Elegant Luxury Gold/Premium
export default function LandingVariant10({ keyword, description, colorTheme, content }: Props) {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -100% 0; }
          100% { background-position: 100% 0; }
        }
        @keyframes elegantFade {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes luxuryGlow {
          0%, 100% { box-shadow: 0 0 20px ${colorTheme.primary}60, 0 0 40px ${colorTheme.primary}30; }
          50% { box-shadow: 0 0 40px ${colorTheme.primary}80, 0 0 60px ${colorTheme.primary}50; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, ${colorTheme.primary}, ${colorTheme.accent}, ${colorTheme.primary});
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        .animate-elegantFade {
          animation: elegantFade 1s ease-out;
        }
      `}</style>

      {/* Luxury Hero */}
      <div className="relative min-h-screen flex items-center justify-center px-6 py-20">
        <div className="absolute inset-0" style={{
          background: `radial-gradient(circle at center, ${colorTheme.primary}10 0%, transparent 70%)`
        }} />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Decorative Lines */}
          <div className="flex items-center justify-center gap-8 mb-12 animate-elegantFade">
            <div className="h-px w-32" style={{ background: `linear-gradient(to right, transparent, ${colorTheme.primary})` }} />
            <div className="text-2xl" style={{ color: colorTheme.primary }}>✦</div>
            <div className="h-px w-32" style={{ background: `linear-gradient(to left, transparent, ${colorTheme.primary})` }} />
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-9xl font-serif font-black mb-8 shimmer-text leading-none">
            {keyword}
          </h1>

          <p className="text-2xl text-gray-400 mb-16 font-light italic max-w-2xl mx-auto animate-elegantFade" style={{ animationDelay: '0.2s' }}>
            {description}
          </p>

          {/* Luxury Search */}
          <div className="max-w-2xl mx-auto mb-16 animate-elegantFade" style={{ animationDelay: '0.4s' }}>
            <form onSubmit={handleSearch}>
              <div 
                className="relative overflow-hidden rounded-full border"
                style={{ 
                  borderColor: colorTheme.primary,
                  boxShadow: `0 10px 40px ${colorTheme.primary}40`
                }}
              >
                <div className="absolute inset-0" style={{
                  background: `linear-gradient(135deg, ${colorTheme.primary}20, ${colorTheme.accent}10)`
                }} />
                <div className="relative flex">
                  <input
                    type="text"
                    placeholder="Search for exclusive content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-10 py-6 bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg"
                  />
                  <button 
                    type="submit"
                    disabled={loading}
                    className="px-12 py-6 font-bold text-black transition-all hover:scale-105"
                    style={{ 
                      background: `linear-gradient(135deg, ${colorTheme.primary}, ${colorTheme.accent})`
                    }}
                  >
                    {loading ? "..." : "SEARCH"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Luxury Features */}
          <div className="flex justify-center gap-12 text-sm animate-elegantFade" style={{ animationDelay: '0.6s', color: colorTheme.secondary }}>
            <span>◆ Premium Quality</span>
            <span>◆ Exclusive Access</span>
            <span>◆ Always Free</span>
          </div>
        </div>
      </div>

      {/* Elegant Results */}
      {showResults && (
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-serif font-black mb-4 shimmer-text">
              Curated Results
            </h2>
            <div className="h-px w-64 mx-auto" style={{ background: `linear-gradient(to right, transparent, ${colorTheme.primary}, transparent)` }} />
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-4" style={{ color: colorTheme.primary }}>✦</div>
              <p className="text-gray-400">Loading exclusive content...</p>
            </div>
          ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-8">
              {searchResults.map((movie, index) => (
                <div
                  key={`${movie.imdb_id}-${index}`}
                  onClick={() => handleMovieClick(movie)}
                  className="cursor-pointer group animate-elegantFade"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="relative overflow-hidden rounded-lg border transition-all group-hover:border-current"
                    style={{ 
                      borderColor: `${colorTheme.primary}40`,
                      boxShadow: `0 10px 30px ${colorTheme.primary}20`
                    }}
                  >
                    <div className="relative aspect-[2/3]">
                      <Image
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.svg'}
                        alt={movie.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: `linear-gradient(to top, ${colorTheme.primary}ee, transparent)` }}
                    />
                  </div>
                  <p className="mt-4 font-serif text-sm text-gray-400 line-clamp-2">
                    {movie.title}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}

      {/* Elegant Content */}
      <div className="max-w-4xl mx-auto px-6 pb-32">
        {content.sections.map((section: any, i: number) => (
          <div key={i} className="mb-20 animate-elegantFade" style={{ animationDelay: `${i * 0.2}s` }}>
            <div className="flex items-center gap-6 mb-8">
              <div className="text-xl" style={{ color: colorTheme.primary }}>✦</div>
              <h3 className="text-4xl font-serif font-black text-white">
                {section.title}
              </h3>
            </div>
            <div className="space-y-6 text-gray-400 leading-relaxed text-lg font-light pl-10">
              {section.paragraphs.map((para: string, j: number) => (
                <p key={j}>{para}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Luxury Footer */}
      <footer className="border-t" style={{ borderColor: `${colorTheme.primary}40` }}>
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="mb-6">
            <div className="text-4xl mb-4" style={{ color: colorTheme.primary }}>✦</div>
          </div>
          <h3 className="text-6xl font-serif font-black mb-4 shimmer-text">
            {keyword}
          </h3>
          <p className="text-gray-500 text-sm tracking-widest uppercase">
            Premium Streaming Experience
          </p>
        </div>
      </footer>
    </div>
  );
}

