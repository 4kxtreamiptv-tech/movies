"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { searchMoviesByTitle } from "@/api/tmdb";
import type { MovieListItem } from "@/api/tmdb";
import { generateMovieUrl } from "@/lib/slug";
import Image from "next/image";
import { getYear } from "@/api/tmdb";
import SiteLogo from "@/components/SiteLogo";
import { resolvePosterUrl } from "@/lib/poster";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<MovieListItem[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [years, setYears] = useState<number[]>([]);
  const [decades, setDecades] = useState<Array<{decade: string, years: number[]}>>([]);
  const [progress, setProgress] = useState({processedMovies: 0, totalMovies: 95942, foundMovies: 0});
  const [isLoadingYears, setIsLoadingYears] = useState(false);
  const [yearsLoaded, setYearsLoaded] = useState(false); // Track if years have been loaded

  // Fetch years data from API - ONLY when user hovers over dropdown
  // Get site name, tagline and styles based on pathname
  const getSiteInfo = () => {
    const keywordPages: { [key: string]: { 
      name: string; 
      tagline: string; 
      logo: { first: string; second: string };
      firstStyle: React.CSSProperties;
      secondStyle: React.CSSProperties;
      iconBg: string;
      taglineColor: string;
    } } = {
      '/fmovies': { 
        name: 'FMOVIES', 
        tagline: 'Stream Movies & Series Free',
        logo: { first: 'F', second: 'MOVIES' },
        firstStyle: { 
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
        },
        secondStyle: { color: '#8b5cf6' },
        iconBg: 'linear-gradient(135deg, #3b82f6, #6366f1)',
        taglineColor: '#8b5cf6'
      },
      '/soap2day': { 
        name: 'SOAP2DAY', 
        tagline: 'Watch Movies Online Free',
        logo: { first: 'SOAP', second: '2DAY' },
        firstStyle: { 
          color: '#10b981',
          fontWeight: '900',
          textShadow: '2px 2px 0px rgba(5, 150, 105, 0.3)'
        },
        secondStyle: { 
          color: '#14b8a6',
          fontWeight: '600'
        },
        iconBg: 'linear-gradient(135deg, #10b981, #14b8a6)',
        taglineColor: '#059669'
      },
      '/gomovies': { 
        name: 'GOMOVIES', 
        tagline: 'Latest Movies & TV Shows',
        logo: { first: 'GO', second: 'MOVIES' },
        firstStyle: { 
          color: '#ef4444',
          fontWeight: '900',
          borderBottom: '3px solid #dc2626'
        },
        secondStyle: { 
          color: '#f97316',
          fontWeight: '700'
        },
        iconBg: 'linear-gradient(45deg, #ef4444, #f97316)',
        taglineColor: '#dc2626'
      },
      '/hurawatch': { 
        name: 'HURAWATCH', 
        tagline: 'HD Movie Streaming Platform',
        logo: { first: 'HURA', second: 'WATCH' },
        firstStyle: { 
          color: '#06b6d4',
          fontWeight: '900',
          border: '2px solid #06b6d4',
          padding: '0 4px',
          borderRadius: '4px'
        },
        secondStyle: { 
          color: '#0891b2',
          fontWeight: '600'
        },
        iconBg: 'linear-gradient(135deg, #06b6d4, #0e7490)',
        taglineColor: '#0891b2'
      },
      '/yesmovies': { 
        name: 'YESMOVIES', 
        tagline: 'Say Yes to Free Streaming',
        logo: { first: 'YES', second: 'MOVIES' },
        firstStyle: { 
          backgroundColor: '#f59e0b',
          color: '#000',
          fontWeight: '900',
          padding: '2px 8px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.5)'
        },
        secondStyle: { 
          color: '#d97706',
          fontWeight: '700'
        },
        iconBg: 'linear-gradient(135deg, #f59e0b, #d97706)',
        taglineColor: '#b45309'
      },
      '/solarmovie': { 
        name: 'SOLARMOVIE', 
        tagline: 'Free Movies & TV Series',
        logo: { first: 'SOLAR', second: 'MOVIE' },
        firstStyle: { 
          background: 'linear-gradient(90deg, #f97316, #fb923c, #f97316)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: '900',
          backgroundSize: '200% auto',
          animation: 'shine 3s linear infinite'
        },
        secondStyle: { 
          color: '#ea580c',
          fontWeight: '600'
        },
        iconBg: 'linear-gradient(135deg, #f97316, #ea580c)',
        taglineColor: '#ea580c'
      },
      '/popcornflix': { 
        name: 'POPCORNFLIX', 
        tagline: 'Stream Free Entertainment',
        logo: { first: 'POPCORN', second: 'FLIX' },
        firstStyle: { 
          background: 'linear-gradient(to right, #dc2626, #fbbf24)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: '900'
        },
        secondStyle: { 
          color: '#b91c1c',
          fontWeight: '700',
          fontStyle: 'italic'
        },
        iconBg: 'linear-gradient(135deg, #dc2626, #fbbf24)',
        taglineColor: '#dc2626'
      },
      '/lookmovie': { 
        name: 'LOOKMOVIE', 
        tagline: 'Instant HD Streaming',
        logo: { first: 'LOOK', second: 'MOVIE' },
        firstStyle: { 
          color: '#a855f7',
          fontWeight: '900',
          textDecoration: 'underline',
          textDecorationColor: '#9333ea',
          textDecorationThickness: '3px',
          textUnderlineOffset: '4px'
        },
        secondStyle: { 
          color: '#c084fc',
          fontWeight: '600'
        },
        iconBg: 'linear-gradient(135deg, #a855f7, #9333ea)',
        taglineColor: '#9333ea'
      }
    };
    return keywordPages[pathname] || { 
      name: '123MOVIES', 
      tagline: 'Watch HD Movies Online Free',
      logo: { first: '123', second: 'MOVIES' },
      firstStyle: { color: '#3fae2a', fontWeight: '900' },
      secondStyle: { color: '#ffffff', fontWeight: '700' },
      iconBg: '#3fae2a',
      taglineColor: '#e5e5e5'
    };
  };

  const siteInfo = getSiteInfo();
  const displayName = siteInfo.logo;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setSearchLoading(true);
    setShowSearchResults(true);
    
    try {
      const results = await searchMoviesByTitle(searchTerm.trim(), 20);
      if (Array.isArray(results)) {
        const moviesData = results
          .filter(movie => movie.imdb_id && movie.imdb_id.trim() !== '')
          .map(movie => ({
            ...movie,
            imdb_id: movie.imdb_id!,
          }));
        setSearchResults(moviesData);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
    setSearchLoading(false);
  };

  const handleMovieClick = (movie: MovieListItem) => {
    setShowSearchResults(false);
    setSearchTerm("");
    router.push(generateMovieUrl(movie.title, movie.imdb_id || ''));
  };

  const fetchYears = async () => {
    if (yearsLoaded) return; // Don't fetch if already loaded
    
    setIsLoadingYears(true);
    try {
      const response = await fetch('/api/years');
      const data = await response.json();
      
      if (data.years) {
        setYears(data.years);
        
        // Process decades to move 2026 and 2027 into 2025 decade
        const processedDecades = (data.decades || []).map((decadeData: {decade: string, years: number[]}) => {
          if (decadeData.decade === "2020s") {
            // Move 2026 and 2027 to 2025 decade if they exist
            const years2025 = decadeData.years.filter(year => year <= 2025);
            const years2026_2027 = decadeData.years.filter(year => year === 2026 || year === 2027);
            
            return {
              ...decadeData,
              years: years2025
            };
          } else if (decadeData.decade === "2025s") {
            // Add 2026 and 2027 to 2025 decade
            const allYears = [...decadeData.years];
            const originalDecades = data.decades || [];
            const decade2020s = originalDecades.find((d: {decade: string, years: number[]}) => d.decade === "2020s");
            if (decade2020s) {
              const years2026_2027 = decade2020s.years.filter((year: number) => year === 2026 || year === 2027);
              allYears.push(...years2026_2027);
            }
            return {
              ...decadeData,
              years: allYears.sort((a, b) => b - a)
            };
          }
          return decadeData;
        });
        
        setDecades(processedDecades);
        setProgress({
          processedMovies: data.processedMovies || 0,
          totalMovies: data.totalMovies || 95942,
          foundMovies: data.foundMovies || 0
        });
        setYearsLoaded(true); // Mark as loaded
      }
    } catch (error) {
      console.error('Error fetching years:', error);
      // Fallback to static years if API fails
      setYears([2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000]);
      setYearsLoaded(true);
    } finally {
      setIsLoadingYears(false);
    }
  };

  return (
    <nav className="bg-[#181818] border-b border-[#2b2b2b] sticky top-0 z-30">
      <style jsx>{`
        @keyframes shine {
          to {
            background-position: 200% center;
          }
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - 123moviesfree style; keyword pages use getSiteInfo */}
          <div className="flex items-center">
            <SiteLogo
              tagline={siteInfo.tagline}
              href="/"
              size="nav"
              variant="playO"
              first={displayName.first}
              second={displayName.second}
              firstColor={typeof siteInfo.firstStyle.color === "string" ? siteInfo.firstStyle.color : undefined}
              secondColor={typeof siteInfo.secondStyle.color === "string" ? siteInfo.secondStyle.color : undefined}
            />
          </div>
          
          {/* Navigation - Center */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/home" 
              className="text-gray-200 hover:text-[#3fae2a] transition-colors font-medium"
              onClick={() => {
                localStorage.setItem('homepageMode', 'movies');
              }}
            >
              HOME
            </Link>
            <Link
              href="/movies"
              className="text-gray-300 hover:text-[#3fae2a] transition-colors font-medium"
            >
              MOVIES
            </Link>
            
            {/* Genres Dropdown */}
            <div className="relative group">
              <button className="text-gray-300 hover:text-white transition-colors flex items-center">
                GENRES
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-96 bg-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Link href="/genre/action" className="block text-gray-300 hover:text-white transition-colors text-sm">Action</Link>
                      <Link href="/genre/action-adventure" className="block text-gray-300 hover:text-white transition-colors text-sm">Action & Adventure</Link>
                      <Link href="/genre/adventure" className="block text-gray-300 hover:text-white transition-colors text-sm">Adventure</Link>
                      <Link href="/genre/animation" className="block text-gray-300 hover:text-white transition-colors text-sm">Animation</Link>
                      <Link href="/genre/biography" className="block text-gray-300 hover:text-white transition-colors text-sm">Biography</Link>
                      <Link href="/genre/comedy" className="block text-gray-300 hover:text-white transition-colors text-sm">Comedy</Link>
                      <Link href="/genre/costume" className="block text-gray-300 hover:text-white transition-colors text-sm">Costume</Link>
                      <Link href="/genre/crime" className="block text-gray-300 hover:text-white transition-colors text-sm">Crime</Link>
                      <Link href="/genre/documentary" className="block text-gray-300 hover:text-white transition-colors text-sm">Documentary</Link>
                      <Link href="/genre/drama" className="block text-gray-300 hover:text-white transition-colors text-sm">Drama</Link>
                    </div>
                    <div className="space-y-2">
                      <Link href="/genre/family" className="block text-gray-300 hover:text-white transition-colors text-sm">Family</Link>
                      <Link href="/genre/fantasy" className="block text-gray-300 hover:text-white transition-colors text-sm">Fantasy</Link>
                      <Link href="/genre/film-noir" className="block text-gray-300 hover:text-white transition-colors text-sm">Film-Noir</Link>
                      <Link href="/genre/game-show" className="block text-gray-300 hover:text-white transition-colors text-sm">Game-Show</Link>
                      <Link href="/genre/history" className="block text-gray-300 hover:text-white transition-colors text-sm">History</Link>
                      <Link href="/genre/horror" className="block text-gray-300 hover:text-white transition-colors text-sm">Horror</Link>
                      <Link href="/genre/romance" className="block text-gray-300 hover:text-white transition-colors text-sm">Romance</Link>
                      <Link href="/genre/kungfu" className="block text-gray-300 hover:text-white transition-colors text-sm">Kungfu</Link>
                      <Link href="/genre/music" className="block text-gray-300 hover:text-white transition-colors text-sm">Music</Link>
                      <Link href="/genre/musical" className="block text-gray-300 hover:text-white transition-colors text-sm">Musical</Link>
                    </div>
                    <div className="space-y-2">
                      <Link href="/genre/mystery" className="block text-gray-300 hover:text-white transition-colors text-sm">Mystery</Link>
                      <Link href="/genre/mythological" className="block text-gray-300 hover:text-white transition-colors text-sm">Mythological</Link>
                      <Link href="/genre/news" className="block text-gray-300 hover:text-white transition-colors text-sm">News</Link>
                      <Link href="/genre/psychological" className="block text-gray-300 hover:text-white transition-colors text-sm">Psychological</Link>
                      <Link href="/genre/reality" className="block text-gray-300 hover:text-white transition-colors text-sm">Reality</Link>
                      <Link href="/genre/reality-tv" className="block text-gray-300 hover:text-white transition-colors text-sm">Reality-TV</Link>
                      <Link href="/genre/sci-fi" className="block text-gray-300 hover:text-white transition-colors text-sm">Sci-Fi</Link>
                      <Link href="/genre/sci-fi-fantasy" className="block text-gray-300 hover:text-white transition-colors text-sm">Sci-Fi & Fantasy</Link>
                      <Link href="/genre/science-fiction" className="block text-gray-300 hover:text-white transition-colors text-sm">Science Fiction</Link>
                      <Link href="/genre/short" className="block text-gray-300 hover:text-white transition-colors text-sm">Short</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Country Dropdown */}
            <div className="relative group">
              <button className="text-gray-300 hover:text-white transition-colors flex items-center">
                COUNTRY
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Link href="/country/united-states" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm py-1">
                        <img src="https://flagcdn.com/w20/us.png" alt="US" className="w-5 h-3 object-cover rounded-sm" />
                        <span>United States</span>
                      </Link>
                      <Link href="/country/united-kingdom" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm py-1">
                        <img src="https://flagcdn.com/w20/gb.png" alt="GB" className="w-5 h-3 object-cover rounded-sm" />
                        <span>United Kingdom</span>
                      </Link>
                      <Link href="/country/canada" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm py-1">
                        <img src="https://flagcdn.com/w20/ca.png" alt="CA" className="w-5 h-3 object-cover rounded-sm" />
                        <span>Canada</span>
                      </Link>
                      <Link href="/country/estonia" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm py-1">
                        <img src="https://flagcdn.com/w20/ee.png" alt="EE" className="w-5 h-3 object-cover rounded-sm" />
                        <span>Estonia</span>
                      </Link>
                    </div>
                    <div className="space-y-2">
                      <Link href="/country/france" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm py-1">
                        <img src="https://flagcdn.com/w20/fr.png" alt="FR" className="w-5 h-3 object-cover rounded-sm" />
                        <span>France</span>
                      </Link>
                      <Link href="/country/georgia" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm py-1">
                        <img src="https://flagcdn.com/w20/ge.png" alt="GE" className="w-5 h-3 object-cover rounded-sm" />
                        <span>Georgia</span>
                      </Link>
                      <Link href="/country/bulgaria" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm py-1">
                        <img src="https://flagcdn.com/w20/bg.png" alt="BG" className="w-5 h-3 object-cover rounded-sm" />
                        <span>Bulgaria</span>
                      </Link>
                      <Link href="/country/brazil" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm py-1">
                        <img src="https://flagcdn.com/w20/br.png" alt="BR" className="w-5 h-3 object-cover rounded-sm" />
                        <span>Brazil</span>
                      </Link>
                    </div>
                    <div className="space-y-2">
                      <Link href="/country/china" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm py-1">
                        <img src="https://flagcdn.com/w20/cn.png" alt="CN" className="w-5 h-3 object-cover rounded-sm" />
                        <span>China</span>
                      </Link>
                      <Link href="/country/peru" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm py-1">
                        <img src="https://flagcdn.com/w20/pe.png" alt="PE" className="w-5 h-3 object-cover rounded-sm" />
                        <span>Peru</span>
                      </Link>
                      <Link href="/country/ireland" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm py-1">
                        <img src="https://flagcdn.com/w20/ie.png" alt="IE" className="w-5 h-3 object-cover rounded-sm" />
                        <span>Ireland</span>
                      </Link>
                      <Link href="/country/spain" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm py-1">
                        <img src="https://flagcdn.com/w20/es.png" alt="ES" className="w-5 h-3 object-cover rounded-sm" />
                        <span>Spain</span>
                      </Link>
                      <Link href="/country/sweden" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm py-1">
                        <img src="https://flagcdn.com/w20/se.png" alt="SE" className="w-5 h-3 object-cover rounded-sm" />
                        <span>Sweden</span>
                      </Link>
                      <Link href="/country/philippines" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm py-1">
                        <img src="https://flagcdn.com/w20/ph.png" alt="PH" className="w-5 h-3 object-cover rounded-sm" />
                        <span>Philippines</span>
                      </Link>
                      <Link href="/country/cyprus" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm py-1">
                        <img src="https://flagcdn.com/w20/cy.png" alt="CY" className="w-5 h-3 object-cover rounded-sm" />
                        <span>Cyprus</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Years Dropdown - Dynamic (Load on hover) */}
            <div className="relative group">
              <button 
                className="text-gray-300 hover:text-white transition-colors flex items-center"
                onMouseEnter={fetchYears}
              >
                YEARS
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {isLoadingYears && (
                  <div className="ml-2 w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                )}
              </button>
              <div 
                className="absolute top-full left-0 mt-2 w-96 bg-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
                onMouseEnter={fetchYears}
              >
                <div className="p-4">
                  
                  {/* Years organized by decades */}
                  {decades.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {decades.map(({decade, years}) => (
                        <div key={decade}>
                          <h3 className="text-sm font-semibold text-gray-400 mb-2 border-b border-gray-600 pb-1">
                            {decade}
                          </h3>
                          <div className="grid grid-cols-5 gap-1">
                            {years.map(year => (
                              <Link 
                                key={year} 
                                href={`/year/${year}`} 
                                className="text-gray-300 hover:text-white transition-colors text-sm py-1 px-2 text-center rounded hover:bg-gray-700"
                              >
                                {year}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      {isLoadingYears ? (
                        <div className="text-gray-400">Loading years...</div>
                      ) : (
                        <div className="text-gray-400">
                          <div>No years found yet</div>
                          <div className="text-xs mt-1">Movie processing may not have started</div>
                        </div>
                      )}
                  </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Search Bar - Right */}
          <div className="hidden md:flex items-center">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowSearchResults(true)}
                className="bg-gray-800 text-white px-4 py-2 pl-10 rounded-lg border border-gray-700 focus:outline-none focus:border-[#3fae2a] w-64"
              />
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setShowSearchResults(false);
                  }}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </form>
          </div>

          {/* Mobile menu button - Right */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none focus:text-white p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-700">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link 
              href="/home" 
              className="text-white hover:text-[#3fae2a] block px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={() => {
                setIsMenuOpen(false);
                localStorage.setItem('homepageMode', 'movies');
              }}
            >
              Home
            </Link>
            <Link 
              href="/genres" 
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Genres
            </Link>
            <Link
              href="/movies"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Movies
            </Link>
            <Link 
              href="/country" 
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Country
            </Link>
            <Link 
              href="/years" 
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Years
            </Link>
            <div className="pt-4 pb-3 border-t border-gray-700">
            </div>
          </div>
        </div>
      )}

      {/* Search Results Dropdown */}
      {showSearchResults && searchTerm && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowSearchResults(false)}
          />
          <div className="absolute top-full right-0 mt-2 w-[600px] max-h-[80vh] overflow-y-auto bg-gray-900 rounded-lg shadow-2xl border border-gray-700 z-50 mr-4">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-white font-bold">
                {searchLoading ? "Searching..." : `Results for "${searchTerm}"`}
              </h3>
              <button
                onClick={() => {
                  setShowSearchResults(false);
                  setSearchTerm("");
                }}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            {searchLoading ? (
              <div className="p-12 text-center">
                <div className="w-12 h-12 border-4 border-[#3fae2a] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-gray-400 mt-4">Loading...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
                {searchResults.map((movie, index) => (
                  <div
                    key={`${movie.imdb_id}-${index}`}
                    onClick={() => handleMovieClick(movie)}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors"
                  >
                    <div className="relative w-16 h-24 flex-shrink-0 rounded overflow-hidden bg-gray-800">
                      <Image
                        src={resolvePosterUrl(movie.poster_path, "w200")}
                        alt={movie.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-semibold text-sm line-clamp-2 mb-1">
                        {movie.title}
                      </h4>
                      <p className="text-gray-400 text-xs">
                        {getYear(movie.release_date)} • ⭐ {movie.vote_average?.toFixed(1) || 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <p className="text-gray-400">No results found</p>
              </div>
            )}
          </div>
        </>
      )}
      
    </nav>
  );
}