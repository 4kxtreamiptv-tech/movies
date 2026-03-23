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

// Design 6: Colorful Bubble/Organic Shapes
export default function LandingVariant6({ keyword, description, colorTheme, content }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<MovieListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

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
    <div className="min-h-screen relative overflow-hidden" style={{
      background: `linear-gradient(180deg, #fff 0%, ${colorTheme.primary}10 100%)`
    }}>
      <style jsx>{`
        @keyframes blob {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: rotate(0deg); }
          25% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          50% { border-radius: 50% 50% 20% 80% / 25% 75% 75% 25%; transform: rotate(90deg); }
          75% { border-radius: 80% 20% 50% 50% / 75% 25% 25% 75%; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pop {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-blob {
          animation: blob 10s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce 3s ease-in-out infinite;
        }
        .animate-pop {
          animation: pop 0.5s cubic-bezier(0.26, 0.53, 0.74, 1.48);
        }
      `}</style>

      {/* Organic Blob Shapes */}
      {mounted && (
        <>
          <div 
            className="absolute w-96 h-96 -top-20 -left-20 opacity-20 animate-blob"
            style={{ backgroundColor: colorTheme.primary }}
          />
          <div 
            className="absolute w-80 h-80 top-1/2 -right-20 opacity-15 animate-blob"
            style={{ 
              backgroundColor: colorTheme.accent,
              animationDelay: '2s'
            }}
          />
          <div 
            className="absolute w-72 h-72 bottom-20 left-1/3 opacity-10 animate-blob"
            style={{ 
              backgroundColor: colorTheme.secondary,
              animationDelay: '4s'
            }}
          />
        </>
      )}

      {/* Bubbly Hero */}
      <div className="relative min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="animate-bounce-slow inline-block mb-8">
            <div 
              className="w-32 h-32 rounded-full flex items-center justify-center text-5xl font-black text-white mb-6 mx-auto"
              style={{ 
                background: `linear-gradient(135deg, ${colorTheme.primary}, ${colorTheme.accent})`,
                boxShadow: `0 20px 60px ${colorTheme.primary}60`
              }}
            >
              {keyword[0]}
            </div>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-9xl font-black mb-6 tracking-tight" style={{
            background: `linear-gradient(135deg, ${colorTheme.primary}, ${colorTheme.accent})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {keyword}
          </h1>

          <p className="text-2xl text-gray-700 mb-16 max-w-3xl mx-auto font-medium">
            {description}
          </p>

          {/* Bubble Search */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="🔍 Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-8 py-6 rounded-full border-4 focus:outline-none text-lg shadow-xl"
                style={{ 
                  borderColor: colorTheme.primary,
                  backgroundColor: 'white'
                }}
              />
              <button 
                type="submit"
                disabled={loading}
                className="px-12 py-6 rounded-full text-white font-black text-lg shadow-2xl hover:scale-105 transition-all"
                style={{ 
                  background: `linear-gradient(135deg, ${colorTheme.buttonBg}, ${colorTheme.accent})`
                }}
              >
                {loading ? "..." : "GO"}
              </button>
            </div>
          </form>

          {/* Bubble Pills */}
          <div className="flex flex-wrap justify-center gap-4">
            {['Free', 'HD', 'Fast', 'Safe'].map((tag, i) => (
              <div 
                key={i}
                className="px-8 py-3 rounded-full text-white font-bold shadow-lg animate-pop"
                style={{ 
                  backgroundColor: i % 2 === 0 ? colorTheme.primary : colorTheme.accent,
                  animationDelay: `${i * 0.1}s`
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bubble Results */}
      {showResults && (
        <div className="relative max-w-7xl mx-auto px-6 pb-20">
          <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-12 shadow-2xl">
            <h2 className="text-5xl font-black text-gray-900 mb-12 text-center">
              Results
            </h2>
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-flex gap-3">
                  {[0, 1, 2].map((i) => (
                    <div 
                      key={i}
                      className="w-6 h-6 rounded-full animate-bounce"
                      style={{ 
                        backgroundColor: colorTheme.primary,
                        animationDelay: `${i * 0.15}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {searchResults.map((movie, index) => (
                  <div
                    key={`${movie.imdb_id}-${index}`}
                    onClick={() => handleMovieClick(movie)}
                    className="cursor-pointer group animate-pop"
                    style={{ animationDelay: `${index * 0.03}s` }}
                  >
                    <div className="relative aspect-[2/3] rounded-3xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all transform group-hover:scale-105">
                      <Image
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.svg'}
                        alt={movie.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="mt-4 font-bold text-sm text-gray-900 line-clamp-2 text-center">
                      {movie.title}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Bubble Content Sections */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {content.intro.map((para: string, i: number) => (
            <div 
              key={i}
              className="bg-white rounded-[2rem] p-10 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2"
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black text-white mb-6"
                style={{ backgroundColor: colorTheme.accent }}
              >
                {i + 1}
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">{para}</p>
            </div>
          ))}
        </div>

        {content.sections.map((section: any, i: number) => (
          <div 
            key={i}
            className="mb-12 bg-white rounded-[2rem] p-12 shadow-xl"
          >
            <h3 className="text-4xl font-black mb-6" style={{ color: colorTheme.primary }}>
              {section.title}
            </h3>
            <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
              {section.paragraphs.map((para: string, j: number) => (
                <p key={j}>{para}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Rounded Footer */}
      <footer className="py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div 
            className="inline-block px-16 py-8 rounded-full text-white shadow-2xl"
            style={{ background: `linear-gradient(135deg, ${colorTheme.primary}, ${colorTheme.accent})` }}
          >
            <h3 className="text-4xl font-black mb-2">
              {keyword}
            </h3>
            <p className="text-sm opacity-90">
              Bubble Streaming Experience
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
