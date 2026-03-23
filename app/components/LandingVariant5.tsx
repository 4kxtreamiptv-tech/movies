"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
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

// Design 5: Glassmorphism + Blur Effects
export default function LandingVariant5({ keyword, description, colorTheme, content }: Props) {
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
    <div className="min-h-screen relative" style={{
      background: `linear-gradient(135deg, ${colorTheme.primary}40 0%, ${colorTheme.accent}20 100%)`
    }}>
      <style jsx>{`
        @keyframes morphing {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
        }
        @keyframes glassFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        @keyframes blurPulse {
          0%, 100% { filter: blur(20px); }
          50% { filter: blur(30px); }
        }
        .animate-morphing {
          animation: morphing 8s ease-in-out infinite;
        }
        .animate-glassFloat {
          animation: glassFloat 4s ease-in-out infinite;
        }
        .animate-blurPulse {
          animation: blurPulse 4s ease-in-out infinite;
        }
      `}</style>

      {/* Glassmorphic Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 -top-20 -left-20 rounded-full opacity-60 animate-morphing animate-blurPulse"
          style={{ backgroundColor: colorTheme.primary }}
        />
        <div 
          className="absolute w-80 h-80 top-1/3 -right-20 rounded-full opacity-50 animate-morphing"
          style={{ 
            backgroundColor: colorTheme.accent,
            animationDelay: '2s'
          }}
        />
        <div 
          className="absolute w-72 h-72 bottom-20 left-1/4 rounded-full opacity-40 animate-morphing animate-blurPulse"
          style={{ 
            backgroundColor: colorTheme.secondary,
            animationDelay: '4s'
          }}
        />
      </div>

      {/* Hero with Glass Effect */}
      <div className="relative min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="backdrop-blur-3xl bg-white/30 rounded-3xl p-12 border border-white/40 shadow-2xl animate-glassFloat">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-6" style={{ color: colorTheme.accent }}>
              {keyword}
            </h1>
            <p className="text-2xl text-gray-900 mb-12 font-semibold">
              {description}
            </p>

            {/* Glass Search */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="flex backdrop-blur-xl bg-white/50 rounded-2xl border-2 overflow-hidden shadow-2xl"
                style={{ borderColor: colorTheme.accent }}
              >
                <input
                  type="text"
                  placeholder="Search movies, series..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-8 py-5 bg-transparent text-gray-900 placeholder-gray-600 focus:outline-none text-lg font-medium"
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-10 py-5 font-bold text-white transition-all hover:scale-105"
                  style={{ backgroundColor: colorTheme.accent }}
                >
                  {loading ? "..." : "Search"}
                </button>
              </div>
            </form>

            <Link 
              href="/home"
              className="inline-block px-10 py-4 rounded-full font-bold text-white border-2 transition-all hover:scale-105 shadow-xl"
              style={{ 
                backgroundColor: colorTheme.accent,
                borderColor: colorTheme.primary
              }}
            >
              Browse Library →
            </Link>
          </div>
        </div>
      </div>

      {/* Glass Cards Results */}
      {showResults && (
        <div className="relative max-w-7xl mx-auto px-6 pb-20">
          <div className="backdrop-blur-2xl bg-white/40 rounded-3xl p-10 border-2 shadow-2xl"
            style={{ borderColor: colorTheme.accent }}
          >
            <h2 className="text-4xl font-black mb-8 text-gray-900">
              Search Results
            </h2>
            {loading ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto" 
                  style={{ borderColor: `${colorTheme.accent}40`, borderTopColor: colorTheme.accent }}
                />
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
                {searchResults.map((movie, index) => (
                  <div
                    key={`${movie.imdb_id}-${index}`}
                    onClick={() => handleMovieClick(movie)}
                    className="cursor-pointer group"
                  >
                    <div className="backdrop-blur-md bg-white/60 rounded-2xl overflow-hidden border-2 border-white/40 hover:bg-white/70 transition-all shadow-lg hover:shadow-2xl transform hover:scale-105">
                      <div className="relative aspect-[2/3]">
                        <Image
                          src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.svg'}
                          alt={movie.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3 bg-white/80">
                        <p className="font-bold text-sm text-gray-900 line-clamp-2">{movie.title}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Glass Content Sections */}
      <div className="relative max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {content.intro.map((para: string, i: number) => (
            <div key={i} className="backdrop-blur-xl bg-white/50 rounded-3xl p-8 border-2 border-white/60 hover:bg-white/60 transition-all shadow-xl">
              <div 
                className="w-12 h-1 mb-4 rounded-full"
                style={{ backgroundColor: colorTheme.accent }}
              />
              <p className="text-gray-900 leading-relaxed text-lg font-medium">{para}</p>
            </div>
          ))}
        </div>

        {content.sections.map((section: any, i: number) => (
          <div key={i} className="mb-12 backdrop-blur-xl bg-white/40 rounded-3xl p-10 border-2 shadow-2xl"
            style={{ borderColor: `${colorTheme.accent}60` }}
          >
            <h3 className="text-4xl font-black mb-6 text-gray-900">
              {section.title}
            </h3>
            <div className="space-y-4">
              {section.paragraphs.map((para: string, j: number) => (
                <p key={j} className="text-gray-800 leading-relaxed text-lg">
                  {para}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Glass Footer */}
      <footer className="backdrop-blur-2xl bg-white/40 border-t-2 py-16" style={{ borderColor: colorTheme.accent }}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-4xl font-black mb-2 text-gray-900">
            {keyword}
          </h3>
          <p className="text-gray-700 font-semibold">Glassmorphism Design • Premium Streaming</p>
        </div>
      </footer>
    </div>
  );
}

