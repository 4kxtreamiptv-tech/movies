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

// Design 4: Zen Minimalist + Smooth Fade Animations
export default function LandingVariant4({ keyword, description, colorTheme, content }: Props) {
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
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <style jsx>{`
        @keyframes fadeInSlow {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes expandWidth {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes floatUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ripple {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        .animate-fadeInSlow {
          animation: fadeInSlow 1.5s ease-out;
        }
        .animate-expandWidth {
          animation: expandWidth 1s ease-out;
        }
        .animate-floatUp {
          animation: floatUp 0.8s ease-out;
        }
        .animate-ripple {
          animation: ripple 2s ease-out infinite;
        }
        .animate-breathe {
          animation: breathe 4s ease-in-out infinite;
        }
      `}</style>

      {/* Zen Hero */}
      <div className="max-w-5xl mx-auto px-8 py-32 text-center">
        <div className="animate-floatUp mb-12">
          <div 
            className="inline-block w-20 h-1 mb-8 rounded-full animate-expandWidth"
            style={{ backgroundColor: colorTheme.accent }}
          />
          <h2 className="text-7xl md:text-8xl font-black text-gray-900 mb-6 leading-tight tracking-tighter">
            Pure<br />Entertainment
          </h2>
          <p className="text-2xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
            {description}
          </p>
        </div>

        {/* Minimal Search */}
        <div className="animate-floatUp max-w-3xl mx-auto" style={{ animationDelay: '0.3s' }}>
          <form onSubmit={handleSearch}>
            <div className="relative group">
              <div 
                className="absolute -bottom-2 left-0 h-0.5 w-0 group-focus-within:w-full transition-all duration-700"
                style={{ backgroundColor: colorTheme.primary }}
              />
              <input
                type="text"
                placeholder="Search movies, series..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-8 py-6 text-xl bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-current transition-all shadow-lg hover:shadow-xl text-gray-900 placeholder-gray-400"
                style={{ borderColor: 'transparent' }}
                onFocus={(e) => e.currentTarget.style.borderColor = colorTheme.primary}
                onBlur={(e) => e.currentTarget.style.borderColor = 'transparent'}
              />
              <button 
                type="submit"
                disabled={loading}
                className="absolute right-4 top-1/2 -translate-y-1/2 px-8 py-3 rounded-xl font-bold transition-all hover:scale-110"
                style={{ 
                  backgroundColor: colorTheme.buttonBg,
                  color: 'white'
                }}
              >
                {loading ? "..." : "→"}
              </button>
            </div>
          </form>
        </div>

        {/* Simple Features */}
        <div className="flex justify-center gap-16 mt-20 animate-floatUp" style={{ animationDelay: '0.6s' }}>
          {['Free', 'HD', 'No Ads'].map((feature, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="relative">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black text-white mb-3 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: colorTheme.accent }}
                >
                  {feature[0]}
                </div>
                <div 
                  className="absolute inset-0 rounded-full animate-ripple"
                  style={{ border: `2px solid ${colorTheme.accent}` }}
                />
              </div>
              <p className="text-gray-600 font-semibold">{feature}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Clean Results */}
      {showResults && (
        <div className="bg-white py-20">
          <div className="max-w-6xl mx-auto px-8">
            <div className="flex items-center gap-4 mb-12">
              <div 
                className="w-12 h-1 rounded animate-expandWidth"
                style={{ backgroundColor: colorTheme.primary }}
              />
              <h3 className="text-4xl font-black text-gray-900">
                Results
              </h3>
            </div>
            
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center gap-2">
                  {[0, 1, 2].map((i) => (
                    <div 
                      key={i}
                      className="w-2 h-2 rounded-full animate-breathe"
                      style={{ 
                        backgroundColor: colorTheme.primary,
                        animationDelay: `${i * 0.15}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                {searchResults.map((movie, index) => (
                  <div
                    key={`${movie.imdb_id}-${index}`}
                    onClick={() => handleMovieClick(movie)}
                    className="cursor-pointer group animate-floatUp"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-200 mb-4 shadow-lg group-hover:shadow-2xl transition-all duration-500">
                      <Image
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.svg'}
                        alt={movie.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ backgroundColor: `${colorTheme.primary}dd` }}
                      >
                        <div className="flex items-center justify-center h-full">
                          <div className="text-5xl text-white animate-breathe">▶</div>
                        </div>
                      </div>
                    </div>
                    <h4 className="font-bold text-sm text-gray-900 line-clamp-2 mb-1">
                      {movie.title}
                    </h4>
                    <p className="text-xs text-gray-500">{getYear(movie.release_date)}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Content with Breathing Animation */}
      <div className="max-w-4xl mx-auto px-8 py-32">
        {content.intro.map((para: string, i: number) => (
          <div 
            key={i}
            className="mb-20 animate-floatUp"
            style={{ animationDelay: `${i * 0.2}s` }}
          >
            <div 
              className="w-16 h-1 mb-6 rounded animate-expandWidth"
              style={{ 
                backgroundColor: colorTheme.accent,
                animationDelay: `${i * 0.2}s`
              }}
            />
            <p className="text-xl text-gray-700 leading-relaxed font-light">
              {para}
            </p>
          </div>
        ))}

        {content.sections.map((section: any, i: number) => (
          <div 
            key={i} 
            className="mb-24 animate-floatUp"
            style={{ animationDelay: `${i * 0.3}s` }}
          >
            <h3 className="text-5xl font-black text-gray-900 mb-8 tracking-tight">
              {section.title}
            </h3>
            <div className="space-y-6">
              {section.paragraphs.map((para: string, j: number) => (
                <p key={j} className="text-lg text-gray-600 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Minimal Footer */}
      <footer className="border-t py-16">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div 
              className="w-2 h-2 rounded-full animate-breathe"
              style={{ backgroundColor: colorTheme.primary }}
            />
            <h3 className="text-3xl font-black text-gray-900">
              {keyword}
            </h3>
          </div>
          <p className="text-gray-500 text-sm">Simplified. Elevated. Yours.</p>
        </div>
      </footer>
    </div>
  );
}
