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

// Design 3: Tilted Cards + Parallax Effect
export default function LandingVariant3({ keyword, description, colorTheme, content }: Props) {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <style jsx>{`
        @keyframes flip {
          from { transform: perspective(400px) rotateY(-15deg); opacity: 0; }
          to { transform: perspective(400px) rotateY(0); opacity: 1; }
        }
        @keyframes tilt {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        @keyframes zoom {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes slideInBottom {
          from { opacity: 0; transform: translateY(100px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        .animate-flip {
          animation: flip 0.8s ease-out;
        }
        .animate-tilt {
          animation: tilt 3s ease-in-out infinite;
        }
        .animate-zoom {
          animation: zoom 4s ease-in-out infinite;
        }
        .animate-slideInBottom {
          animation: slideInBottom 0.8s ease-out;
        }
        .animate-wiggle {
          animation: wiggle 0.5s ease-in-out;
        }
      `}</style>

      {/* Diagonal Hero Section */}
      <div className="relative min-h-screen">
        <div 
          className="absolute inset-0 transform -skew-y-6 origin-top-left"
          style={{ 
            background: `linear-gradient(135deg, ${colorTheme.primary}, ${colorTheme.accent})`
          }}
        />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
          <div className="text-center max-w-6xl mx-auto">
            <div className="animate-flip">
              <h1 className="text-8xl md:text-9xl font-black text-white mb-6 tracking-tighter animate-tilt">
                {keyword}
              </h1>
            </div>
            
            <p className="text-lg sm:text-2xl md:text-3xl text-white/90 mb-12 animate-slideInBottom font-light">
              {description}
            </p>

            {/* Search with 3D Effect */}
            <div className="animate-slideInBottom max-w-3xl mx-auto mb-12" style={{ animationDelay: '0.2s' }}>
              <form onSubmit={handleSearch} className="relative group">
                <div className="absolute -inset-4 bg-white/20 rounded-3xl blur-2xl group-hover:bg-white/30 transition-all" />
                <div className="relative flex bg-black/50 backdrop-blur-xl rounded-3xl overflow-hidden border-2 border-white/30 shadow-2xl transform group-hover:scale-105 transition-all duration-300">
                  <input
                    type="text"
                    placeholder="🎬 What would you like to watch?"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-10 py-8 text-xl bg-transparent text-white placeholder-white/60 focus:outline-none"
                  />
                  <button 
                    type="submit"
                    disabled={loading}
                    className="px-12 py-8 bg-white text-black font-black text-lg transition-all hover:bg-white/90"
                  >
                    {loading ? "..." : "GO"}
                  </button>
                </div>
              </form>
            </div>

            {/* Animated Stats */}
            <div className="flex justify-center gap-12 animate-slideInBottom" style={{ animationDelay: '0.4s' }}>
              {[
                { icon: '🎥', number: '10K+', label: 'Movies' },
                { icon: '📺', number: '5K+', label: 'Series' },
                { icon: '⭐', number: '100%', label: 'Free' }
              ].map((stat, i) => (
                <div 
                  key={i}
                  className="text-center group hover:scale-110 transition-transform cursor-pointer"
                >
                  <div className="text-5xl mb-2 animate-zoom" style={{ animationDelay: `${i * 0.2}s` }}>
                    {stat.icon}
                  </div>
                  <div className="text-4xl font-black text-white mb-1">{stat.number}</div>
                  <div className="text-white/70 font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tilted Card Results */}
      {showResults && (
        <div className="relative -mt-32 z-20 max-w-7xl mx-auto px-6 pb-20">
          <div className="bg-gray-900/90 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/10">
            <h2 className="text-5xl font-black text-white mb-10 animate-flip">
              Found Results
            </h2>
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-flex gap-3">
                  {[0, 1, 2, 3].map((i) => (
                    <div 
                      key={i}
                      className="w-3 h-16 rounded-full animate-zoom"
                      style={{ 
                        backgroundColor: colorTheme.primary,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
                {searchResults.map((movie, index) => (
                  <div
                    key={`${movie.imdb_id}-${index}`}
                    onClick={() => handleMovieClick(movie)}
                    className="cursor-pointer group animate-flip hover:animate-wiggle"
                    style={{ animationDelay: `${index * 0.03}s` }}
                  >
                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl transform group-hover:-rotate-3 group-hover:scale-110 transition-all duration-300">
                      <Image
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.svg'}
                        alt={movie.title}
                        fill
                        className="object-cover"
                      />
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ 
                          background: `linear-gradient(45deg, ${colorTheme.primary}dd, ${colorTheme.accent}dd)`
                        }}
                      >
                        <div className="flex items-center justify-center h-full">
                          <div className="text-6xl">▶</div>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 font-bold text-sm text-white line-clamp-2">
                      {movie.title}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Diagonal Content Sections */}
      <div className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 mb-20">
            {content.intro.map((para: string, i: number) => (
              <div 
                key={i}
                className="animate-flip group"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                <div 
                  className="p-10 rounded-3xl backdrop-blur-sm transform group-hover:rotate-1 group-hover:scale-105 transition-all duration-300"
                  style={{ 
                    background: `linear-gradient(135deg, ${colorTheme.primary}20, ${colorTheme.accent}10)`,
                    border: `2px solid ${colorTheme.primary}40`
                  }}
                >
                  <div 
                    className="w-16 h-1 mb-6 rounded"
                    style={{ backgroundColor: colorTheme.accent }}
                  />
                  <p className="text-white/90 leading-relaxed text-lg">{para}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Section with Alternating Tilts */}
          {content.sections.map((section: any, i: number) => (
            <div 
              key={i}
              className={`mb-16 p-10 rounded-3xl backdrop-blur-sm animate-slideInBottom ${i % 2 === 0 ? 'transform rotate-1' : 'transform -rotate-1'}`}
              style={{ 
                animationDelay: `${i * 0.2}s`,
                background: `linear-gradient(135deg, ${colorTheme.primary}10, transparent)`,
                border: `1px solid ${colorTheme.primary}20`
              }}
            >
              <h3 className="text-5xl font-black text-white mb-6" style={{ color: colorTheme.accent }}>
                {section.title}
              </h3>
              <div className="space-y-6">
                {section.paragraphs.map((para: string, j: number) => (
                  <p key={j} className="text-white/80 leading-relaxed text-lg">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tilted Footer */}
      <footer className="relative py-20 overflow-hidden">
        <div 
          className="absolute inset-0 transform skew-y-3"
          style={{ 
            background: `linear-gradient(135deg, ${colorTheme.primary}, ${colorTheme.accent})`
          }}
        />
        <div className="relative z-10 text-center">
          <h3 className="text-6xl font-black text-white mb-4 animate-tilt">
            {keyword}
          </h3>
          <p className="text-white/80 text-xl">Streaming. Reimagined.</p>
        </div>
      </footer>
    </div>
  );
}
