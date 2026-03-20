import { getMovieByImdbId, getSimilarMovies, getYear } from "@/api/tmdb";
import type { Movie, MovieListItem } from "@/api/tmdb";
import { getTVImageUrl, getSeriesSeasons } from "@/api/tmdb-tv";
import Link from "next/link";
import Image from "next/image";
import { generateMovieSEO, generateMovieMetadata } from "@/lib/seo";
import { generateMovieUrl, extractImdbIdFromSlug, isValidMovieSlug } from "@/lib/slug";
import { getCanonicalBase } from "@/lib/domain";
import { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import { cache } from 'react';
import clientPromise from '@/lib/mongodb-client';
import StructuredData from '@/components/StructuredData';
import EmbedPlayer from '@/components/EmbedPlayer';
import { getEmbedServers } from '@/lib/embed-config';
import { isEpisodeSlug } from '@/lib/episode-slug';
import EpisodePageContent, { getEpisodeMetadata } from '@/components/EpisodePageContent';

interface MoviePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Helper to detect if slug is for a series (ends with just number) or movie (ends with tt + number)
function isSeriesSlug(slug: string): boolean {
  // Series: ends with -NUMBER (e.g., "breaking-bad-1396")
  // Movie: ends with -ttNUMBER (e.g., "the-godfather-tt0068646")
  return /^.+-(\d+)$/.test(slug) && !/-tt\d+$/.test(slug);
}

// Extract TMDB ID from series slug (e.g., "breaking-bad-1396" -> 1396)
function extractTmdbIdFromSlug(slug: string): number | null {
  const match = slug.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}

// Cache TMDB API calls for better performance
const getTMDBSeries = cache(async (tmdbId: number) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=b31d2e5f33b74ffa7b3b483ff353f760`,
    { next: { revalidate: 86400 } } // Cache for 24 hours
  );
  if (!response.ok) return null;
  return response.json();
});

interface SeasonData {
  season_number: number;
  episodeCount: number;
  episodes: {
    episode_imdb_id: string;
    episode_number: number;
    episode_name: string;
    still_path?: string;
  }[];
}

function getSeasonThumbnailSrc(season: SeasonData, series: { poster_path?: string | null; backdrop_path?: string | null }) {
  const episodeStillPath = season.episodes.find((episode) => Boolean(episode.still_path))?.still_path;
  if (episodeStillPath) {
    return getTVImageUrl(episodeStillPath, 'w500');
  }
  if (series.poster_path) {
    return getTVImageUrl(series.poster_path, 'w500');
  }
  if (series.backdrop_path) {
    return getTVImageUrl(series.backdrop_path, 'w500');
  }
  return '/placeholder.svg';
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const { slug } = await params;

  if (isEpisodeSlug(slug)) {
    return getEpisodeMetadata(slug);
  }
  
  // Check if this is a series or movie
  if (isSeriesSlug(slug)) {
    // Series metadata
    const tmdbId = extractTmdbIdFromSlug(slug);
    if (!tmdbId) {
      return {
        title: 'Series Not Found',
        description: 'The requested TV series could not be found.',
      };
    }
    
    try {
      const series = await getTMDBSeries(tmdbId);
      if (series) {
        const baseUrl = await getCanonicalBase();
        const shortOverview = series.overview ? series.overview.substring(0, 120) + '...' : '';
        return {
          title: `${series.name} - Watch All Seasons Online`,
          description: shortOverview || `Watch ${series.name} online free. All seasons and episodes available.`,
          alternates: {
            canonical: `${baseUrl}/${slug}`,
          },
          openGraph: {
            title: `${series.name} - Watch All Seasons Online`,
            description: shortOverview || `Watch ${series.name} online free. All seasons and episodes available.`,
            url: `${baseUrl}/${slug}`,
            type: 'video.tv_show',
          },
        };
      }
    } catch (error) {
      // Silent error handling
    }
    
    return {
      title: 'Series Not Found',
      description: 'The requested TV series could not be found.',
    };
  }
  
  // Movie metadata
  let imdbId: string | null = null;
  
  // Check if it's a new slug format (e.g., "the-godfather-tt0068646")
  if (isValidMovieSlug(slug)) {
    imdbId = extractImdbIdFromSlug(slug);
  } 
  // Check if it's an old IMDB ID format (e.g., "tt0068646")
  else if (slug.match(/^tt\d{7,8}$/)) {
    imdbId = slug;
  }
  
  if (!imdbId) {
    return {
      title: 'Movie Not Found - 123Movies',
      description: 'The requested movie could not be found.',
    };
  }
  
  try {
    const movie = await getMovieByImdbId(imdbId);
    if (!movie) {
      return {
        title: 'Movie Not Found - 123Movies',
        description: 'The requested movie could not be found.',
      };
    }

    const baseUrl = await getCanonicalBase();
    const seoConfig = generateMovieSEO(movie, baseUrl);
    return generateMovieMetadata(seoConfig);
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Movie Not Found - 123Movies',
      description: 'The requested movie could not be found.',
    };
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { slug } = await params;

  if (isEpisodeSlug(slug)) {
    return <EpisodePageContent slug={slug} />;
  }
  
  // Check if this is a series or movie
  if (isSeriesSlug(slug)) {
    // Handle Series Detail Page
    const tmdbId = extractTmdbIdFromSlug(slug);
    
    if (!tmdbId) {
      notFound();
    }
    
    // Get series details from TMDB (cached)
    const series = await getTMDBSeries(tmdbId);
    if (!series) {
      notFound();
    }
    
    // Fetch seasons/episodes data directly from MongoDB (skip when MONGODB_URI not set)
    let seasons: SeasonData[] = [];
    try {
      const client = await clientPromise;
      if (!client) {
        // No MongoDB – seasons stay empty; series page still works via TMDB
      } else {
      const db = client.db('moviesDB');
      const episodesCollection = db.collection('episodes');
      
      // First get the series from our database to get the IMDB ID
      const seriesCollection = db.collection('tvSeries');
      const seriesData = await seriesCollection.findOne({ tmdb_id: tmdbId });
      
      if (!seriesData || !seriesData.imdb_id) {
        console.log(`No series found in database for TMDB ID ${tmdbId}`);
      } else {
        // Fetch episodes for this series using IMDB ID (since static data uses IMDB IDs)
        const episodes = await episodesCollection
          .find({ series_imdb_id: seriesData.imdb_id })
          .sort({ season_number: 1, episode_number: 1 })
          .toArray();
        
        // Group episodes by season
        const seasonMap = new Map<number, SeasonData>();
        
        episodes.forEach((episode: any) => {
          const seasonNumber = episode.season_number;
          
          if (!seasonMap.has(seasonNumber)) {
            seasonMap.set(seasonNumber, {
              season_number: seasonNumber,
              episodeCount: 0,
              episodes: []
            });
          }
          
          const season = seasonMap.get(seasonNumber)!;
          season.episodeCount++;
          season.episodes.push({
            episode_imdb_id: episode.episode_imdb_id || `episode-${episode.episode_number}`,
            episode_number: episode.episode_number,
            episode_name: episode.episode_name || `Episode ${episode.episode_number}`,
            still_path: episode.still_path
          });
        });
        
        // Convert map to array and sort by season number
        seasons = Array.from(seasonMap.values()).sort((a, b) => a.season_number - b.season_number);
        
        console.log(`Found ${episodes.length} episodes for series ${tmdbId}, grouped into ${seasons.length} seasons`);
      }
      }
    } catch (error) {
      console.error('Error fetching episodes from MongoDB:', error);
      // Fallback to empty seasons array
    }

    // When no seasons from DB, use TMDB so "No episodes available" doesn’t show
    if (seasons.length === 0) {
      const tmdbSeasons = await getSeriesSeasons(tmdbId);
      seasons = tmdbSeasons.map((s) => ({
        season_number: s.season_number,
        episodeCount: s.episode_count || 0,
        episodes: [],
      }));
    }

    // Render Series Detail Page
    return (
      <>
        <StructuredData series={series} type="series" />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Series Header */}
          <div className="mb-8">
            {/* Backdrop */}
            {series.backdrop_path && (
              <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-6">
                <Image
                  src={getTVImageUrl(series.backdrop_path, 'original')}
                  alt={series.name}
                  fill
                  className="object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
              </div>
            )}
            
            {/* Series Info */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Poster */}
              <div className="flex-shrink-0 w-48 md:w-64">
                <Image
                  src={getTVImageUrl(series.poster_path, 'w500')}
                  alt={series.name}
                  width={256}
                  height={384}
                  className="rounded-lg shadow-2xl"
                />
              </div>
              
              {/* Details */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white mb-4">{series.name}</h1>
                
                <div className="flex flex-wrap gap-4 mb-4 text-sm">
                  {series.first_air_date && (
                    <span className="text-gray-300">
                      📅 {new Date(series.first_air_date).getFullYear()}
                      {series.last_air_date && ` - ${new Date(series.last_air_date).getFullYear()}`}
                    </span>
                  )}
                  {series.vote_average && (
                    <span className="text-yellow-400">
                      ⭐ {series.vote_average.toFixed(1)}/10
                    </span>
                  )}
                  {series.status && (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      series.status === 'Returning Series' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-500 text-white'
                    }`}>
                      {series.status}
                    </span>
                  )}
                </div>
                
                {series.genres && series.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {series.genres.map((genre: any, index: number) => (
                      <span key={index} className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs">
                        {typeof genre === 'object' ? genre.name : genre}
                      </span>
                    ))}
                  </div>
                )}
                
                {series.overview && (
                  <p className="text-gray-300 leading-relaxed mb-4">
                    {series.overview.length > 200 
                      ? series.overview.substring(0, 200) + '...' 
                      : series.overview}
                  </p>
                )}
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Seasons:</span>
                    <span className="text-white ml-2 font-semibold">{series.number_of_seasons || seasons.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Episodes:</span>
                    <span className="text-white ml-2 font-semibold">{series.number_of_episodes || seasons.reduce((sum: number, s: any) => sum + s.episodeCount, 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seasons List */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Seasons</h2>
            
            {seasons.length === 0 ? (
              <div className="text-center py-16 bg-gray-800 rounded-lg">
                <p className="text-gray-400">No episodes available for this series yet.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {seasons.map((season) => (
                  <Link
                    key={season.season_number}
                    href={`/${slug}/season-${season.season_number}`}
                    className="group block overflow-hidden rounded-lg border border-gray-700/70 bg-gray-800/70 transition-all duration-200 hover:border-purple-500/70 hover:ring-1 hover:ring-purple-500/50"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="relative h-44 w-full overflow-hidden bg-gray-700 md:h-48 md:w-72 md:flex-shrink-0">
                        <Image
                          src={getSeasonThumbnailSrc(season, series)}
                          alt={`${series.name} Season ${season.season_number}`}
                          fill
                          className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                      </div>
                      <div className="flex flex-1 items-center justify-between p-6">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                          Season {season.season_number}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {season.episodeCount} {season.episodeCount === 1 ? 'Episode' : 'Episodes'}
                        </p>
                      </div>
                      <div className="text-gray-400 group-hover:text-purple-400 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      </>
    );
  }
  
  // Handle Movie Detail Page
  let imdbId: string | null = null;
  let shouldRedirect = false;
  
  // Check if it's a new slug format (e.g., "the-godfather-tt0068646")
  if (isValidMovieSlug(slug)) {
    imdbId = extractImdbIdFromSlug(slug);
  } 
  // Check if it's an old IMDB ID format (e.g., "tt0068646")
  else if (slug.match(/^tt\d{7,8}$/)) {
    imdbId = slug;
    shouldRedirect = true; // We'll redirect to the new format
  }
  
  if (!imdbId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="text-8xl mb-6">⚠️</div>
            <h1 className="text-2xl font-bold text-white mb-4">Invalid Movie URL</h1>
            <p className="text-gray-400 mb-6">The movie URL format is invalid.</p>
            <Link 
              href="/"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  let movie: Movie | null = null;
  let similarMovies: MovieListItem[] = [];
  let error: string | null = null;

  try {
    movie = await getMovieByImdbId(imdbId);
    if (movie) {
      similarMovies = await getSimilarMovies(movie.id);
      
      // If this was an old URL format, redirect to the new format
      if (shouldRedirect) {
        const newUrl = generateMovieUrl(movie.title, movie.imdb_id);
        redirect(newUrl);
      }
    } else {
      error = "Movie not found";
    }
  } catch (err) {
    console.error('Error loading movie:', err);
    error = 'Failed to load movie data';
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="text-8xl mb-6">⚠️</div>
            <h1 className="text-2xl font-bold text-white mb-4">Movie Not Found</h1>
            <p className="text-gray-400 mb-6">{error || 'This movie could not be loaded.'}</p>
            <Link 
              href="/"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const embedServersList = await getEmbedServers();
  const embedServers = embedServersList.map((s) => ({
    name: s.name,
    url: s.getMovieUrl(imdbId!, movie.id),
  }));

  return (
    <>
      <StructuredData movie={movie} type="movie" />
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* YouTube Style Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Main Content (75%) */}
          <div className="flex-1 lg:w-3/4 space-y-4">
            {/* Video Player - 2-3 servers (domain from config) */}
            <EmbedPlayer
              servers={embedServers}
              title={`${movie.title} - Movie Player`}
            />

            {/* Movie Details Section - Responsive Layout */}
            <div className="bg-gray-100 p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                {/* Left side - Movie Poster */}
                <div className="flex-shrink-0 mx-auto md:mx-0">
                  <div className="w-32 md:w-48">
                    <Image
                      src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.svg'}
                      alt={`${movie.title} movie poster`}
                      width={192}
                      height={288}
                      className="rounded-lg w-full h-auto"
                    />
                    <Link 
                      href="/"
                      className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium text-center block transition-colors"
                    >
                      Trailer
                    </Link>
                  </div>
                </div>

                {/* Right side - Movie Details */}
                <div className="flex-1">
                  {/* Movie Title */}
                  <h1 className="text-2xl font-bold text-black mb-3">
                    {movie.title}
                  </h1>

                  {/* Synopsis */}
                  <p className="text-black italic mb-4 leading-relaxed">
                    {movie.overview && movie.overview.length > 200 
                      ? movie.overview.substring(0, 200) + '...' 
                      : movie.overview}
                  </p>

                  {/* Movie Details - Responsive grid layout */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="flex">
                      <span className="font-bold text-black w-20">Genre:</span>
                      <span className="text-green-500 ml-2">
                        {movie.genres?.slice(0, 3).map((genre, index) => 
                          `${genre.name}${index < Math.min(movie.genres?.length || 0, 3) - 1 ? ', ' : ''}`
                        ).join('') || 'N/A'}
                      </span>
                    </div>

                    <div className="flex">
                      <span className="font-bold text-black w-20">Actor:</span>
                      <span className="text-green-500 ml-2">N/A</span>
                    </div>

                    <div className="flex">
                      <span className="font-bold text-black w-20">Director:</span>
                      <span className="text-green-500 ml-2">N/A</span>
                    </div>

                    <div className="flex">
                      <span className="font-bold text-black w-20">Country:</span>
                      <span className="text-green-500 ml-2">N/A</span>
                    </div>

                    <div className="flex">
                      <span className="font-bold text-black w-20">Quality:</span>
                      <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-medium ml-2">
                        HD
                      </span>
                    </div>

                    <div className="flex">
                      <span className="font-bold text-black w-20">Duration:</span>
                      <span className="text-green-500 ml-2">
                        {movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'N/A'}
                      </span>
                    </div>

                    <div className="flex">
                      <span className="font-bold text-black w-20">Release:</span>
                      <span className="text-green-500 ml-2">
                        {getYear(movie.release_date)}
                      </span>
                    </div>

                    <div className="flex">
                      <span className="font-bold text-black w-20">IMDb:</span>
                      <span className="text-green-500 ml-2">
                        {movie.vote_average ? `${movie.vote_average.toFixed(1)}/10` : 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons - Responsive layout */}
                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <Link 
                      href="/"
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium text-center transition-colors flex-1"
                    >
                      Stream in HD
                    </Link>
                    <Link 
                      href="/"
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium text-center transition-colors flex-1"
                    >
                      Download in HD
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Title */}
            <div className="space-y-3">
              <h1 className="text-xl font-medium text-gray-900 leading-tight">
                {movie.title}
              </h1>
              
              {/* Video Stats */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-6 text-sm text-gray-600">
                <span>1.2M views</span>
                <span className="hidden sm:inline">•</span>
                <span>{getYear(movie.release_date)}</span>
                <span className="hidden sm:inline">•</span>
                <span>{movie.runtime || 'N/A'} min</span>
                <span className="hidden sm:inline">•</span>
                <span>⭐ {movie.vote_average?.toFixed(1) || 'N/A'}</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">Synopsis</h3>
                <p className="text-gray-800 leading-relaxed italic">
                  {movie.overview && movie.overview.length > 300 
                    ? movie.overview.substring(0, 300) + '...' 
                    : movie.overview}
                </p>
              </div>
            </div>

          </div>

          {/* Right Column - Recommended Movies (25%) */}
          <div className="w-full lg:w-1/4 space-y-4">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <button className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full font-medium">All</button>
              <button className="text-gray-600 px-3 py-1 rounded-full hover:bg-gray-100 transition-colors">From 123Movies</button>
              <button className="text-gray-600 px-3 py-1 rounded-full hover:bg-gray-100 transition-colors">Related</button>
            </div>

            {/* Recommended Movies List */}
            <div className="space-y-3 max-h-96 lg:max-h-screen overflow-y-auto">
              {similarMovies
                .filter((similarMovie) => similarMovie.imdb_id && similarMovie.imdb_id.trim() !== '')
                .slice(0, 8)
                .map((similarMovie, index) => (
                <Link
                  key={`${similarMovie.imdb_id}-${index}`}
                  href={generateMovieUrl(similarMovie.title, similarMovie.imdb_id || '')}
                  className="flex items-start space-x-3 group hover:bg-gray-50 p-2 rounded-lg transition-colors"
                >
                  <div className="relative w-24 h-16 sm:w-32 sm:h-20 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={similarMovie.poster_path ? `https://image.tmdb.org/t/p/w300${similarMovie.poster_path}` : '/placeholder.svg'}
                      alt={`${similarMovie.title} movie poster`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
                      {Math.floor(Math.random() * 60) + 90}m
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-gray-900 text-xs sm:text-sm font-medium line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {similarMovie.title}
                    </h4>
                    <p className="text-gray-600 text-xs mt-1">123Movies</p>
                    <p className="text-gray-500 text-xs">
                      {Math.floor(Math.random() * 1000) + 100}K views • {Math.floor(Math.random() * 30) + 1} days ago
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
