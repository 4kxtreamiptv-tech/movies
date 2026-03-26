"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getYear } from "@/api/tmdb";
import type { MovieListItem } from "@/api/tmdb";
import { generateMovieUrl } from "@/lib/slug";
import StructuredData from '@/components/StructuredData';
import SiteLogo from '@/components/SiteLogo';

export default function SimpleLandingPage() {
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
    <>
      <StructuredData type="website" />
      {/* Landing page (/) should match 123moviesfree landing: light background */} 
      <div className="min-h-screen bg-[#f2f2f2]">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#333333] mb-2 tracking-tight flex items-center justify-center">
            <span>123M</span>
            <span className="inline-flex items-center justify-center w-[44px] h-[44px] mx-1 rounded-full bg-[#79c142] align-middle">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9 7v10l8-5-8-5z" fill="white" />
              </svg>
            </span>
            <span className="text-[#3fae2a]">VIES</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Watch Your Favorite Movies Online
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Search movies or series"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-3 bg-white border border-gray-300 text-gray-800 rounded-l-sm focus:outline-none focus:border-[#3fae2a] text-lg placeholder-gray-400"
              />
              <button 
                type="submit"
                disabled={loading}
                className="bg-[#3fae2a] hover:bg-[#35a024] disabled:opacity-50 text-white px-6 py-3 rounded-r-sm transition-colors"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </button>
            </form>
          </div>

          <Link href="/home" className="inline-block bg-[#3fae2a] hover:bg-[#35a024] text-white px-8 py-3 rounded font-semibold transition-colors">
            Use the old 123Movies? Click here
          </Link>
        </div>

        {/* Search Results */}
        {showResults && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Search Results for &quot;{searchTerm}&quot;
              </h2>
              <button 
                onClick={() => {
                  setShowResults(false);
                  setSearchTerm("");
                  setSearchResults([]);
                }}
                className="text-gray-500 hover:text-[#3fae2a]"
              >
                ✕ Clear
              </button>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3fae2a] mx-auto"></div>
                <p className="text-gray-600 mt-4">Searching movies...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {searchResults.map((movie, index) => (
                  <div
                    key={`${movie.imdb_id}-${index}`}
                    onClick={() => handleMovieClick(movie)}
                    className="cursor-pointer group"
                  >
                    <div className="relative aspect-[2/3] bg-white rounded overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <Image
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.svg'}
                        alt={movie.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-12 h-12 bg-[#3fae2a] rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <h3 className="text-gray-800 font-semibold text-sm line-clamp-2 group-hover:text-[#3fae2a] transition-colors">
                        {movie.title}
                      </h3>
                      <p className="text-gray-500 text-xs mt-1">
                        {getYear(movie.release_date)} • ⭐ {movie.vote_average?.toFixed(1) || 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No movies found for &quot;{searchTerm}&quot;</p>
                <p className="text-gray-500 text-sm mt-2">Try a different search term</p>
              </div>
            )}
          </div>
        )}

        {/* Genre List */}
        <div className="mb-12">
          <p className="text-gray-700 text-lg leading-relaxed">
            Action, Adventure, Animation, Biography, Comedy, Crime, Documentary, Drama, Family, Fantasy, Game show, History, Horror, Musical, Mystery, News, Reality, Romance, Sci-Fi, TV Movie, Thriller, War
          </p>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            123Movies - Watch HD Movies Online Free | 123movie | free streaming
          </h2>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              While other free streaming sites can be a pain to use and are often riddled with malware, 
              require signup with your credit card information (which can be misused), 123movies is 
              simple, requires no subscription or account and lets you watch movies anytime anywhere, 
              as long as you have a laptop/smartphone and the Internet, its smooth and seamless.
            </p>

            <p>
              Choose a movie and you are good to go! 123movies can be a great companion for a friends 
              or family get-together or a date night. Movies are a great source of entertainment while 
              reducing boredom for at least three hours at a stretch. 123movies only intends to link 
              only legal videos on internet. A bucket of popcorn or your munchies to go along and you 
              are set for a great time ahead.
            </p>

            <h3 className="text-2xl font-bold text-gray-800 mt-12 mb-4">
              Why Choose 123movies?
            </h3>
            
            <h4 className="text-xl font-bold text-gray-800 mb-3">
              123movies is One of a kind
            </h4>

            <p>
              We stand out from other streaming websites as we don't require a subscription or account 
              to watch movies. We provide best quality videos for a great viewing experience. You will 
              have a great time watching the movies of your choice with no compromise in quality. 
              Movies from many genres. You can find movies without scrolling down a lot. We are 
              non-region-specific.
            </p>

            <p>
              Even though you may like a certain type of genre, there are times when you want to bring 
              a change. 123movies can be accessed Anytime Anywhere, You choose a time and a place and 
              we are right there for you to help out.
            </p>

            <h3 className="text-2xl font-bold text-gray-800 mt-12 mb-4">
              Benefits of online movie streaming on 123movies
            </h3>

            <p>
              Online streaming has replaced the old way of waiting for DVDs and movie tickets. 
              We have listed the merits of online movie streaming on 123movies.
            </p>

            <h4 className="text-xl font-bold text-gray-800 mt-8 mb-3">
              You save time By using 123movies
            </h4>

            <p>
              You don't have to download movies and watch them later. You can watch them seamlessly 
              online. You save time by not having to wait for the download to complete.
            </p>

            <h4 className="text-xl font-bold text-gray-800 mt-8 mb-3">
              You save money by using 123movie
            </h4>

            <p>
              Watching movies is free. The only cost is the internet. 123movies links movies available 
              on web. It functions like a collective library. Like search engines, 123movies links to 
              data available on web.
            </p>

            <h4 className="text-xl font-bold text-gray-800 mt-8 mb-3">
              123movies is compatible with all devices and new browsers
            </h4>

            <p>
              You can watch movies on your computer, laptop, tablet, mobile phone. It works well with 
              Chrome, Safari, Firefox latest versions. It doesn't support old browser versions. 
              123movies doesn't link to 4K videos. You never run out of entertainment on 123movies.
            </p>

            <p>
              When it comes to watching a movie and being entertained, there is no limit. Our database 
              will take a lifetime to get exhausted. 123movies keeps on adding new data.
            </p>

            <h4 className="text-xl font-bold text-gray-800 mt-8 mb-3">
              123movies a better bond in a relationship
            </h4>

            <p>
              Anyone who watches movies with friends and family is known to have a better bonding when
              compared to the rest. The reason being the fact that they share the same experience and
              emotions. This site does not host or store video files on its servers. We only organize
              links to publicly available sources. Copyright holders may request removal of infringing
              material through our normal contact or DMCA process.
            </p>

            <h4 className="text-xl font-bold text-gray-800 mt-8 mb-3">
              September Update (2025)
            </h4>

            <p>
              Server costs are increasing due to rising energy prices in Europe. Currently, it does not 
              affect the website performance. We operate on a net zero profit model. We expect prices 
              to lower in the summer. We have improved the search index for more sources. We intend to 
              serve only legal and movies already available on web. We continuously work on improving 
              code and user experience.
            </p>
          </div>
        </div>
      </div>

      {/* Footer - 123moviesfree style */}
      <footer className="bg-[#0d0d0d] border-t border-[#2b2b2b] text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <SiteLogo href="/" size="footer" tagline="" />
                <div className="w-6 h-6 bg-[#3fae2a] rounded flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Watch your favorite movies and TV shows online for free. 
                High quality streaming with no registration required.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/home" className="text-gray-400 hover:text-[#3fae2a] transition-colors text-sm">Home</Link></li>
                <li><Link href="/movies" className="text-gray-400 hover:text-[#3fae2a] transition-colors text-sm">All Movies</Link></li>
                <li><Link href="/genres" className="text-gray-400 hover:text-[#3fae2a] transition-colors text-sm">Genres</Link></li>
                <li><Link href="/country" className="text-gray-400 hover:text-[#3fae2a] transition-colors text-sm">Countries</Link></li>
                <li><Link href="/search" className="text-gray-400 hover:text-[#3fae2a] transition-colors text-sm">Search</Link></li>
              </ul>
            </div>

            {/* Popular Genres */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Popular Genres</h3>
              <ul className="space-y-2">
                <li><Link href="/genre/action" className="text-gray-400 hover:text-[#3fae2a] transition-colors text-sm">Action</Link></li>
                <li><Link href="/genre/comedy" className="text-gray-400 hover:text-[#3fae2a] transition-colors text-sm">Comedy</Link></li>
                <li><Link href="/genre/drama" className="text-gray-400 hover:text-[#3fae2a] transition-colors text-sm">Drama</Link></li>
                <li><Link href="/genre/horror" className="text-gray-400 hover:text-[#3fae2a] transition-colors text-sm">Horror</Link></li>
                <li><Link href="/genre/romance" className="text-gray-400 hover:text-[#3fae2a] transition-colors text-sm">Romance</Link></li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="border-t border-[#2b2b2b] mt-8 pt-8">
            <div className="text-center">
              <div className="text-gray-500 text-sm">
                Made with ❤️ for movie lovers
              </div>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}
