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

// Design 1: Floating Particles + Neon Glow Effect
export default function LandingVariant1({ keyword, description, colorTheme, content }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<MovieListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Fix hydration error - only show particles after mount
  useEffect(() => {
    setMounted(true);
  }, []);

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
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px ${colorTheme.primary}, 0 0 40px ${colorTheme.primary}50; }
          50% { box-shadow: 0 0 40px ${colorTheme.primary}, 0 0 80px ${colorTheme.primary}80; }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
        .animate-pulse-slow {
          animation: pulse 3s ease-in-out infinite;
        }
      `}</style>

      {/* Floating Particles Background - Client Side Only */}
      {mounted && (
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-20 animate-float"
              style={{
                width: Math.random() * 100 + 50 + 'px',
                height: Math.random() * 100 + 50 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                backgroundColor: i % 2 === 0 ? colorTheme.primary : colorTheme.accent,
                animationDelay: Math.random() * 5 + 's',
                animationDuration: Math.random() * 10 + 10 + 's',
              }}
            />
          ))}
        </div>
      )}

      {/* Hero Section with Neon Effect */}
      <div className="relative min-h-screen flex items-center justify-center px-6">
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <div className="animate-slideInLeft">
            <h1 
              className="text-5xl sm:text-7xl md:text-9xl font-black mb-8 tracking-tighter animate-glow"
              style={{ 
                color: colorTheme.primary,
                textShadow: `0 0 30px ${colorTheme.primary}, 0 0 60px ${colorTheme.primary}50`
              }}
            >
              {keyword}
            </h1>
          </div>
          
          <p className="text-lg sm:text-xl md:text-3xl mb-12 text-gray-100 animate-slideInRight font-normal">
            {description}
          </p>

          {/* Neon Search Box */}
          <div className="animate-fadeInUp max-w-3xl mx-auto mb-12">
            <form onSubmit={handleSearch} className="relative group">
              <div 
                className="absolute -inset-1 rounded-2xl opacity-75 blur animate-glow"
                style={{ backgroundColor: colorTheme.primary }}
              />
              <div className="relative flex bg-gray-900 rounded-2xl overflow-hidden">
                <input
                  type="text"
                  placeholder="Search movies, series, anything..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-8 py-6 text-xl bg-transparent text-white placeholder-gray-400 focus:outline-none font-medium"
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-10 py-6 font-bold text-lg transition-all hover:scale-105"
                  style={{ 
                    backgroundColor: colorTheme.buttonBg,
                    boxShadow: `0 0 20px ${colorTheme.buttonBg}50`
                  }}
                >
                  {loading ? "⏳" : "🔍"}
                </button>
              </div>
            </form>
          </div>

          {/* Animated CTA Buttons */}
          <div className="flex gap-6 justify-center animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <Link 
              href="/home"
              className="px-10 py-5 rounded-full font-bold text-lg transition-all hover:scale-110 animate-pulse-slow"
              style={{ 
                backgroundColor: colorTheme.accent,
                boxShadow: `0 10px 40px ${colorTheme.accent}50`
              }}
            >
              🎬 Start Watching
            </Link>
            <button 
              className="px-10 py-5 rounded-full font-bold text-lg border-2 transition-all hover:scale-110 hover:bg-white/10"
              style={{ borderColor: colorTheme.primary }}
            >
              ⚡ Trending Now
            </button>
          </div>
        </div>
      </div>

      {/* Search Results with Stagger Animation */}
      {showResults && (
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-4xl font-bold mb-12 animate-fadeInUp" style={{ color: colorTheme.primary }}>
            Search Results
          </h2>
          {loading ? (
            <div className="text-center py-20">
              <div 
                className="w-20 h-20 border-4 border-t-transparent rounded-full animate-spin mx-auto"
                style={{ borderColor: colorTheme.primary, borderTopColor: 'transparent' }}
              />
            </div>
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
              {searchResults.map((movie, index) => (
                <div
                  key={`${movie.imdb_id}-${index}`}
                  onClick={() => handleMovieClick(movie)}
                  className="cursor-pointer group animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="relative aspect-[2/3] rounded-2xl overflow-hidden transition-all duration-500 group-hover:scale-105 group-hover:rotate-2">
                    <Image
                      src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.svg'}
                      alt={movie.title}
                      fill
                      className="object-cover"
                    />
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ 
                        background: `linear-gradient(to top, ${colorTheme.primary}ee, transparent)`
                      }}
                    />
                  </div>
                  <p className="mt-3 font-bold text-sm line-clamp-2 text-gray-100 group-hover:text-current transition-colors"
                    onMouseEnter={(e) => e.currentTarget.style.color = colorTheme.primary}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#f3f4f6'}
                  >
                    {movie.title}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}

      {/* Content Sections with Neon Cards - Improved Readability */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          {content.intro.map((para: string, i: number) => (
            <div 
              key={i} 
              className="relative p-10 rounded-3xl backdrop-blur-md animate-fadeInUp group hover:scale-105 transition-all duration-300"
              style={{ 
                backgroundColor: `${colorTheme.primary}20`,
                animationDelay: `${i * 0.2}s`,
                border: `2px solid ${colorTheme.primary}60`,
                boxShadow: `0 10px 40px ${colorTheme.primary}30`
              }}
            >
              <div 
                className="absolute -inset-0.5 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity blur-xl"
                style={{ backgroundColor: colorTheme.primary }}
              />
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white mb-6"
                style={{ 
                  backgroundColor: colorTheme.accent,
                  boxShadow: `0 0 20px ${colorTheme.accent}80`
                }}
              >
                {i + 1}
              </div>
              <p className="relative text-gray-100 leading-relaxed text-lg font-medium">{para}</p>
            </div>
          ))}
        </div>

        {/* Sections with Better Structure */}
        <div className="space-y-16">
          {content.sections.map((section: any, i: number) => (
            <div key={i} className="animate-fadeInUp" style={{ animationDelay: `${i * 0.2}s` }}>
              <div className="flex items-center gap-6 mb-8">
                <div 
                  className="w-3 h-24 rounded-full"
                  style={{ 
                    background: `linear-gradient(to bottom, ${colorTheme.primary}, ${colorTheme.accent})`,
                    boxShadow: `0 0 20px ${colorTheme.primary}60`
                  }}
                />
                <h3 
                  className="text-4xl md:text-5xl font-black"
                  style={{ 
                    color: colorTheme.primary,
                    textShadow: `0 0 30px ${colorTheme.primary}80`
                  }}
                >
                  {section.title}
                </h3>
              </div>
              <div className="space-y-6 pl-10">
                {section.paragraphs.map((para: string, j: number) => (
                  <div key={j} className="flex items-start gap-4">
                    <div 
                      className="w-3 h-3 rounded-full mt-2 flex-shrink-0"
                      style={{ 
                        backgroundColor: colorTheme.accent,
                        boxShadow: `0 0 10px ${colorTheme.accent}`
                      }}
                    />
                    <p className="text-gray-200 leading-relaxed text-lg flex-1 font-normal">
                      {para}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Glowing Footer */}
      <footer 
        className="relative z-10 py-20 text-center border-t-2"
        style={{ 
          background: `linear-gradient(to bottom, transparent, ${colorTheme.primary}20)`,
          borderColor: `${colorTheme.primary}40`
        }}
      >
        <h3 
          className="text-6xl font-black mb-4 animate-pulse-slow"
          style={{ 
            color: colorTheme.primary,
            textShadow: `0 0 30px ${colorTheme.primary}`
          }}
        >
          {keyword}
        </h3>
        <p className="text-gray-100 text-xl font-medium">Experience the Future of Streaming ✨</p>
      </footer>
    </div>
  );
}
