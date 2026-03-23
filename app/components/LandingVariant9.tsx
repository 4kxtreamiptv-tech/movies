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

// Design 9: Terminal/Tech Matrix Style
export default function LandingVariant9({ keyword, description, colorTheme, content }: Props) {
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
    <div className="min-h-screen bg-black text-green-400 font-mono">
      <style jsx>{`
        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes matrixRain {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        .terminal-cursor::after {
          content: '▊';
          animation: cursorBlink 1s step-end infinite;
        }
      `}</style>

      {/* Matrix Rain Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute text-xs"
            style={{
              left: `${i * 3.33}%`,
              animation: `matrixRain ${5 + Math.random() * 5}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
              color: colorTheme.primary
            }}
          >
            01010101
          </div>
        ))}
      </div>

      {/* Terminal Hero */}
      <div className="relative min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl w-full border-2 rounded-lg shadow-2xl overflow-hidden"
          style={{ 
            borderColor: colorTheme.primary,
            boxShadow: `0 0 30px ${colorTheme.primary}50`
          }}
        >
          {/* Terminal Header */}
          <div className="border-b-2 px-6 py-3 flex items-center gap-2"
            style={{ 
              borderColor: colorTheme.primary,
              backgroundColor: colorTheme.primary + '20'
            }}
          >
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-sm ml-4" style={{ color: colorTheme.primary }}>
              {keyword.toLowerCase()}@streaming:~$
            </span>
          </div>

          {/* Terminal Content */}
          <div className="p-10 bg-black/90">
            <div className="mb-8">
              <p className="mb-2" style={{ color: colorTheme.primary }}>
                $ echo "Welcome to {keyword}"
              </p>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mb-4 terminal-cursor" style={{ color: colorTheme.accent }}>
                {keyword}
              </h1>
              <p className="text-lg mb-4 opacity-80">
                {description}
              </p>
            </div>

            {/* Terminal Search */}
            <div className="mb-8">
              <p className="mb-2" style={{ color: colorTheme.primary }}>
                $ search --query=""
              </p>
              <form onSubmit={handleSearch}>
                <div className="flex items-center border-2 bg-black/50 overflow-hidden"
                  style={{ borderColor: colorTheme.primary }}
                >
                  <span className="px-4" style={{ color: colorTheme.primary }}>&gt;</span>
                  <input
                    type="text"
                    placeholder="search_query"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-4 bg-transparent focus:outline-none text-lg"
                    style={{ color: colorTheme.accent }}
                  />
                  <button 
                    type="submit"
                    disabled={loading}
                    className="px-8 py-4 font-bold border-l-2 transition-all hover:bg-white/10"
                    style={{ 
                      borderColor: colorTheme.primary,
                      color: colorTheme.accent
                    }}
                  >
                    {loading ? "[LOADING...]" : "[EXECUTE]"}
                  </button>
                </div>
              </form>
            </div>

            {/* Terminal Links */}
            <div>
              <p className="mb-2" style={{ color: colorTheme.primary }}>
                $ ls -la /library
              </p>
              <div className="flex gap-4">
                <Link 
                  href="/home"
                  className="px-8 py-3 border-2 font-bold hover:bg-white/10 transition-all"
                  style={{ 
                    borderColor: colorTheme.accent,
                    color: colorTheme.accent
                  }}
                >
                  ./browse_all
                </Link>
                <Link 
                  href="/movies"
                  className="px-8 py-3 border-2 font-bold hover:bg-white/10 transition-all"
                  style={{ 
                    borderColor: colorTheme.primary,
                    color: colorTheme.primary
                  }}
                >
                  ./movies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terminal Results */}
      {showResults && (
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <div className="border-2 rounded-lg overflow-hidden"
            style={{ 
              borderColor: colorTheme.primary,
              backgroundColor: '#000'
            }}
          >
            <div className="border-b-2 px-6 py-3" style={{ borderColor: colorTheme.primary }}>
              <p style={{ color: colorTheme.primary }}>
                $ search --results --query="{searchTerm}"
              </p>
            </div>
            <div className="p-8">
              {loading ? (
                <div className="text-center py-10">
                  <p className="text-2xl animate-pulse" style={{ color: colorTheme.accent }}>
                    [████████░░] Loading...
                  </p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
                  {searchResults.map((movie, index) => (
                    <div
                      key={`${movie.imdb_id}-${index}`}
                      onClick={() => handleMovieClick(movie)}
                      className="cursor-pointer group"
                    >
                      <div className="border-2 overflow-hidden hover:border-current transition-colors"
                        style={{ borderColor: colorTheme.primary + '60' }}
                      >
                        <div className="relative aspect-[2/3] bg-gray-900">
                          <Image
                            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.svg'}
                            alt={movie.title}
                            fill
                            className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                          />
                        </div>
                      </div>
                      <p className="mt-2 text-xs line-clamp-2" style={{ color: colorTheme.accent }}>
                        &gt; {movie.title}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Terminal Content Sections */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        {content.sections.map((section: any, i: number) => (
          <div key={i} className="mb-12 border-2 rounded-lg p-8"
            style={{ 
              borderColor: colorTheme.primary,
              backgroundColor: '#000'
            }}
          >
            <p className="mb-4" style={{ color: colorTheme.primary }}>
              $ cat /docs/section_{i + 1}.txt
            </p>
            <h3 className="text-3xl font-black mb-6" style={{ color: colorTheme.accent }}>
              {section.title}
            </h3>
            <div className="space-y-4 text-sm opacity-80" style={{ color: colorTheme.primary }}>
              {section.paragraphs.map((para: string, j: number) => (
                <p key={j} className="leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Terminal Footer */}
      <footer className="border-t-2 py-12" style={{ borderColor: colorTheme.primary }}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="mb-2" style={{ color: colorTheme.primary }}>
            $ whoami
          </p>
          <h3 className="text-4xl font-black mb-2" style={{ color: colorTheme.accent }}>
            {keyword}
          </h3>
          <p className="text-sm opacity-60">
            [streaming_platform] © 2025
          </p>
        </div>
      </footer>
    </div>
  );
}

