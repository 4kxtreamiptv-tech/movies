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

// Design 2: Smooth Wave Animations + Gradient Cards
export default function LandingVariant2({ keyword, description, colorTheme, content }: Props) {
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
        @keyframes wave {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes rotateIn {
          from { opacity: 0; transform: rotate(-10deg) scale(0.9); }
          to { opacity: 1; transform: rotate(0) scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .animate-wave {
          animation: wave 3s linear infinite;
        }
        .animate-bounceIn {
          animation: bounceIn 0.6s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.8s ease-out;
        }
        .animate-rotateIn {
          animation: rotateIn 0.6s ease-out;
        }
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>

      {/* Hero with Bouncing Elements */}
      <div className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0" style={{
          background: `radial-gradient(circle at top right, ${colorTheme.primary}15, transparent 50%),
                       radial-gradient(circle at bottom left, ${colorTheme.accent}15, transparent 50%)`
        }} />
        
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="animate-bounceIn mb-8">
            <div 
              className="inline-block px-6 py-2 rounded-full text-sm font-bold text-white mb-6"
              style={{ backgroundColor: colorTheme.accent }}
            >
              ⚡ Premium Streaming Platform
            </div>
          </div>

          <h1 className="text-7xl md:text-8xl font-black text-gray-900 mb-6 animate-slideUp">
            <span 
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${colorTheme.primary}, ${colorTheme.accent})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {keyword}
            </span>
          </h1>

          <p className="text-2xl text-gray-600 mb-12 max-w-3xl mx-auto animate-slideUp" style={{ animationDelay: '0.2s' }}>
            {description}
          </p>

          {/* Floating Search Box */}
          <div className="animate-slideUp max-w-2xl mx-auto" style={{ animationDelay: '0.4s' }}>
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute -inset-2 rounded-2xl opacity-50 blur-xl transition-all group-hover:opacity-75"
                style={{ backgroundColor: colorTheme.primary }}
              />
              <div className="relative flex bg-white shadow-2xl rounded-2xl overflow-hidden border-4"
                style={{ borderColor: colorTheme.primary }}
              >
                <input
                  type="text"
                  placeholder="Search movies, series, anime..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-8 py-6 text-lg text-gray-900 placeholder-gray-400 focus:outline-none"
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-12 font-bold text-white text-lg transition-all hover:scale-105"
                  style={{ backgroundColor: colorTheme.buttonBg }}
                >
                  {loading ? "⏳" : "Search"}
                </button>
              </div>
            </form>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mt-12 animate-slideUp" style={{ animationDelay: '0.6s' }}>
            {['🎬 10,000+ Movies', '📺 Latest Series', '🌟 HD Quality', '🆓 100% Free'].map((feature, i) => (
              <div 
                key={i}
                className="px-6 py-3 rounded-full bg-white shadow-lg border-2 font-semibold transition-all hover:scale-110 hover:-translate-y-1"
                style={{ borderColor: `${colorTheme.accent}50` }}
              >
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search Results with Stagger */}
      {showResults && (
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-10 shadow-2xl">
            <h2 className="text-4xl font-black text-gray-900 mb-10">
              Search Results
            </h2>
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center gap-2">
                  {[0, 1, 2].map((i) => (
                    <div 
                      key={i}
                      className="w-4 h-4 rounded-full animate-bounce"
                      style={{ 
                        backgroundColor: colorTheme.primary,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
                {searchResults.map((movie, index) => (
                  <div
                    key={`${movie.imdb_id}-${index}`}
                    onClick={() => handleMovieClick(movie)}
                    className="cursor-pointer group animate-rotateIn"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300">
                      <Image
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.svg'}
                        alt={movie.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity shimmer"
                        style={{ 
                          background: `linear-gradient(135deg, ${colorTheme.primary}aa, ${colorTheme.accent}aa)`
                        }}
                      />
                    </div>
                    <p className="mt-3 font-bold text-sm text-gray-900 line-clamp-2">
                      {movie.title}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Content Cards with Wave Effect */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Intro Cards - Horizontal Layout */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          {content.intro.map((para: string, i: number) => (
            <div 
              key={i}
              className="relative overflow-hidden rounded-3xl p-10 shadow-2xl animate-slideUp group hover:-translate-y-2 transition-all duration-300 bg-white"
              style={{ 
                animationDelay: `${i * 0.2}s`,
                borderTop: `6px solid ${i === 0 ? colorTheme.primary : colorTheme.accent}`
              }}
            >
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black text-white mb-6"
                style={{ 
                  background: `linear-gradient(135deg, ${colorTheme.primary}, ${colorTheme.accent})`
                }}
              >
                {i + 1}
              </div>
              <p className="text-gray-700 leading-relaxed text-lg font-medium">{para}</p>
            </div>
          ))}
        </div>

        {/* Sections - Clean Layout with Proper Spacing */}
        <div className="space-y-20">
          {content.sections.map((section: any, i: number) => (
            <div 
              key={i} 
              className="animate-slideUp bg-white rounded-3xl p-12 shadow-xl hover:shadow-2xl transition-all"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              <div className="flex items-center gap-6 mb-8">
                <div 
                  className="w-2 h-20 rounded-full"
                  style={{ backgroundColor: colorTheme.accent }}
                />
                <h3 
                  className="text-4xl md:text-5xl font-black"
                  style={{ 
                    background: `linear-gradient(135deg, ${colorTheme.primary}, ${colorTheme.accent})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {section.title}
                </h3>
              </div>
              <div className="space-y-6 pl-8">
                {section.paragraphs.map((para: string, j: number) => (
                  <div key={j} className="flex items-start gap-4">
                    <div 
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: colorTheme.primary }}
                    />
                    <p className="text-gray-700 leading-relaxed text-lg flex-1">
                      {para}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Animated Footer */}
      <footer 
        className="relative py-20 text-center overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${colorTheme.primary}, ${colorTheme.accent})`
        }}
      >
        <div className="relative z-10">
          <h3 className="text-5xl font-black text-white mb-4 animate-bounceIn">
            {keyword}
          </h3>
          <p className="text-white/80 text-lg">Start Your Streaming Journey Today</p>
        </div>
      </footer>
    </div>
  );
}
