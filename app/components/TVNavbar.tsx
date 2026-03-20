"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import SearchModal from "./SearchModal";
import SiteLogo from "./SiteLogo";

export default function TVNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [years, setYears] = useState<number[]>([]);
  const [decades, setDecades] = useState<Array<{decade: string, years: number[]}>>([]);
  const [isLoadingYears, setIsLoadingYears] = useState(false);
  const [yearsLoaded, setYearsLoaded] = useState(false); // Track if years have been loaded

  // Fetch TV years data from API - ONLY when user hovers over dropdown
  const fetchTVYears = async () => {
    if (yearsLoaded) return; // Don't fetch if already loaded
    
    setIsLoadingYears(true);
    try {
      const response = await fetch('/api/tv-years');
      const data = await response.json();
      
      if (data.success && data.data) {
        // Extract years from the data
        const yearNumbers = data.data.map((item: any) => item.year).sort((a: number, b: number) => b - a);
        setYears(yearNumbers);
        
        // Group into decades
        const decadeMap: {[key: string]: number[]} = {};
        yearNumbers.forEach((year: number) => {
          const decade = `${Math.floor(year / 10) * 10}s`;
          if (!decadeMap[decade]) decadeMap[decade] = [];
          decadeMap[decade].push(year);
        });
        
        const decadesArray = Object.entries(decadeMap).map(([decade, years]) => ({
          decade,
          years: years.sort((a, b) => b - a)
        })).sort((a, b) => parseInt(b.decade) - parseInt(a.decade));
        
        setDecades(decadesArray);
        setYearsLoaded(true); // Mark as loaded
      }
    } catch (error) {
      console.error('Error fetching TV years:', error);
      // Fallback to static years
      setYears([2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000, 1999, 1998, 1997, 1996, 1995, 1994]);
      setYearsLoaded(true);
    } finally {
      setIsLoadingYears(false);
    }
  };

  return (
    <nav className="bg-[#181818] border-b border-[#2b2b2b] sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <SiteLogo
              tagline="Watch HD Movies & TV Series Online Free"
              href="/"
              size="nav"
              variant="playO"
            />
          </div>
          
          {/* Navigation - Center */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/home" 
              className="text-gray-200 hover:text-[#3fae2a] transition-colors font-medium"
              onClick={() => {
                localStorage.setItem('homepageMode', 'tv');
                // Dispatch event to update navbar immediately
                window.dispatchEvent(new CustomEvent('homepageModeChange', { 
                  detail: { mode: 'tv' } 
                }));
              }}
            >
              HOME
            </Link>
            
            <Link href="/series" className="text-gray-300 hover:text-white transition-colors font-medium">
              TV SERIES
            </Link>

            <Link
              href="/movies"
              className="text-gray-300 hover:text-[#3fae2a] transition-colors font-medium"
              onClick={() => {
                localStorage.setItem('homepageMode', 'movies');
                window.dispatchEvent(new CustomEvent('homepageModeChange', {
                  detail: { mode: 'movies' }
                }));
              }}
            >
              MOVIES
            </Link>
            
            {/* TV Genres Dropdown */}
            <div className="relative group">
              <button className="text-gray-300 hover:text-white transition-colors flex items-center">
                TV GENRES
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-96 bg-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Link href="/tv-genre/action" className="block text-gray-300 hover:text-white transition-colors text-sm">Action</Link>
                      <Link href="/tv-genre/drama" className="block text-gray-300 hover:text-white transition-colors text-sm">Drama</Link>
                      <Link href="/tv-genre/comedy" className="block text-gray-300 hover:text-white transition-colors text-sm">Comedy</Link>
                      <Link href="/tv-genre/sci-fi" className="block text-gray-300 hover:text-white transition-colors text-sm">Sci-Fi</Link>
                      <Link href="/tv-genre/horror" className="block text-gray-300 hover:text-white transition-colors text-sm">Horror</Link>
                      <Link href="/tv-genre/thriller" className="block text-gray-300 hover:text-white transition-colors text-sm">Thriller</Link>
                      <Link href="/tv-genre/romance" className="block text-gray-300 hover:text-white transition-colors text-sm">Romance</Link>
                      <Link href="/tv-genre/mystery" className="block text-gray-300 hover:text-white transition-colors text-sm">Mystery</Link>
                    </div>
                    <div className="space-y-2">
                      <Link href="/tv-genre/fantasy" className="block text-gray-300 hover:text-white transition-colors text-sm">Fantasy</Link>
                      <Link href="/tv-genre/crime" className="block text-gray-300 hover:text-white transition-colors text-sm">Crime</Link>
                      <Link href="/tv-genre/adventure" className="block text-gray-300 hover:text-white transition-colors text-sm">Adventure</Link>
                      <Link href="/tv-genre/family" className="block text-gray-300 hover:text-white transition-colors text-sm">Family</Link>
                      <Link href="/tv-genre/documentary" className="block text-gray-300 hover:text-white transition-colors text-sm">Documentary</Link>
                      <Link href="/tv-genre/animation" className="block text-gray-300 hover:text-white transition-colors text-sm">Animation</Link>
                      <Link href="/tv-genre/reality" className="block text-gray-300 hover:text-white transition-colors text-sm">Reality</Link>
                      <Link href="/tv-genre/all" className="block text-[#3fae2a] hover:text-white transition-colors text-sm font-semibold">View All Genres</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TV Years Dropdown (Load on hover) */}
            <div className="relative group">
              <button 
                className="text-gray-300 hover:text-white transition-colors flex items-center"
                onMouseEnter={fetchTVYears}
              >
                TV YEARS
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {isLoadingYears && (
                  <div className="ml-2 w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                )}
              </button>
              <div 
                className="absolute top-full left-0 mt-2 w-96 bg-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
                onMouseEnter={fetchTVYears}
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
                                href={`/tv-year/${year}`} 
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
                        <div className="text-gray-400">Loading TV years...</div>
                      ) : (
                        <div className="text-gray-400">
                          <div>No years found yet</div>
                          <div className="text-xs mt-1">TV series processing may not have started</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Search Bar - Right (Hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search TV series"
                className="bg-gray-800 text-white px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-700 focus:outline-none focus:border-[#3fae2a] w-64 cursor-pointer"
                onClick={() => setIsSearchOpen(true)}
                readOnly
              />
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
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
                localStorage.setItem('homepageMode', 'tv');
                // Dispatch event to update navbar immediately
                window.dispatchEvent(new CustomEvent('homepageModeChange', { 
                  detail: { mode: 'tv' } 
                }));
              }}
            >
              Home
            </Link>
            <Link 
              href="/series"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              TV Series
            </Link>
            <Link
              href="/movies"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={() => {
                setIsMenuOpen(false);
                localStorage.setItem('homepageMode', 'movies');
                window.dispatchEvent(new CustomEvent('homepageModeChange', {
                  detail: { mode: 'movies' }
                }));
              }}
            >
              Movies
            </Link>
            <Link 
              href="/tv-genre/all" 
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              TV Genres
            </Link>
            <Link 
              href="/tv-year/2024" 
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              TV Years
            </Link>
            <div className="pt-4 pb-3 border-t border-gray-700">
              <div className="px-3 py-2">
                <button
                  onClick={() => {
                    setIsSearchOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-gray-800 text-gray-400 rounded-lg px-3 py-2 text-left hover:bg-gray-700 transition-all cursor-pointer"
                >
                  Search TV series...
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)}
        searchType="tv"
      />
    </nav>
  );
}
