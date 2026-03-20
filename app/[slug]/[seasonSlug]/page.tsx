import Link from "next/link";
import Image from "next/image";
import { getTVImageUrl, getSeasonEpisodes } from "@/api/tmdb-tv";
import { getCanonicalBase } from "@/lib/domain";
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import clientPromise from '@/lib/mongodb-client';

interface SeasonPageProps {
  params: Promise<{
    slug: string;
    seasonSlug: string;
  }>;
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

// Extract TMDB ID from slug (e.g., "breaking-bad-1396" -> 1396)
function extractTmdbIdFromSlug(slug: string): number | null {
  const match = slug.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}

// Extract season number from seasonSlug (e.g., "season-1" -> 1)
function extractSeasonNumber(seasonSlug: string): number | null {
  const match = seasonSlug.match(/^season-(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}

// Helper function to create episode slug
function createEpisodeSlug(seriesName: string, seasonNumber: number, episodeNumber: number, episodeName: string, episodeImdbId: string): string {
  const nameSlug = episodeName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const s = seasonNumber.toString().padStart(2, '0');
  const e = episodeNumber.toString().padStart(2, '0');
  return `${nameSlug}-s${s}e${e}-${episodeImdbId}`;
}

export async function generateMetadata({ params }: SeasonPageProps): Promise<Metadata> {
  const { slug, seasonSlug } = await params;
  const tmdbId = extractTmdbIdFromSlug(slug);
  const seasonNumber = extractSeasonNumber(seasonSlug);
  
  if (!tmdbId || seasonNumber === null) {
    return {
      title: 'Season Not Found',
      description: 'The requested season could not be found.',
    };
  }
  
  try {
    const series = await getTMDBSeries(tmdbId);
    if (series) {
      const baseUrl = await getCanonicalBase();
      return {
        title: `${series.name} - Season ${seasonNumber} - Watch All Episodes`,
        description: `Watch all episodes of ${series.name} Season ${seasonNumber} online.`,
        alternates: {
          canonical: `${baseUrl}/${slug}/${seasonSlug}`,
        },
        openGraph: {
          title: `${series.name} - Season ${seasonNumber} - Watch All Episodes`,
          description: `Watch all episodes of ${series.name} Season ${seasonNumber} online.`,
          url: `${baseUrl}/${slug}/${seasonSlug}`,
          type: 'video.tv_show',
        },
      };
    }
  } catch (error) {
    // Silent error handling
  }
  
  return {
    title: 'Season Not Found',
    description: 'The requested season could not be found.',
  };
}

interface EpisodeData {
  episode_imdb_id: string;
  episode_number: number;
  episode_name: string;
  overview?: string;
  still_path?: string;
  air_date?: string;
  vote_average?: number;
  runtime?: number;
}

function getEpisodeThumbnailSrc(episode: EpisodeData, series: { poster_path?: string | null; backdrop_path?: string | null }) {
  if (episode.still_path) {
    return getTVImageUrl(episode.still_path, 'w500');
  }
  if (series.poster_path) {
    return getTVImageUrl(series.poster_path, 'w500');
  }
  if (series.backdrop_path) {
    return getTVImageUrl(series.backdrop_path, 'w500');
  }
  return '/placeholder.svg';
}

export default async function SeasonPage({ params }: SeasonPageProps) {
  const { slug, seasonSlug } = await params;
  const tmdbId = extractTmdbIdFromSlug(slug);
  const seasonNumber = extractSeasonNumber(seasonSlug);
  
  if (!tmdbId || seasonNumber === null) {
    notFound();
  }
  
  // Get series details from TMDB (cached)
  const series = await getTMDBSeries(tmdbId);
  if (!series) {
    notFound();
  }
  
  // Fetch episodes from MongoDB database (optional)
  let episodes: EpisodeData[] = [];
  try {
    const client = await clientPromise;
    if (client) {
    const db = client.db('moviesDB');
    const seriesCollection = db.collection('tvSeries');
    const episodesCollection = db.collection('episodes');
    
    // First get the series from our database to get the IMDB ID
    const seriesData = await seriesCollection.findOne({ tmdb_id: tmdbId });
    
    if (!seriesData || !seriesData.imdb_id) {
      console.log(`No series found in database for TMDB ID ${tmdbId}`);
      notFound();
      return;
    }
    
    // Fetch episodes for this season using IMDB ID
    const episodeDocs = await episodesCollection
      .find({ 
        series_imdb_id: seriesData.imdb_id,
        season_number: seasonNumber
      })
      .sort({ episode_number: 1 })
      .toArray();
    
    episodes = episodeDocs.map((episode: any) => ({
      episode_imdb_id: episode.episode_imdb_id,
      episode_number: episode.episode_number,
      episode_name: episode.episode_name,
      overview: episode.overview,
      still_path: episode.still_path,
      air_date: episode.air_date,
      vote_average: episode.vote_average,
      runtime: episode.runtime
    }));
    
    console.log(`Found ${episodes.length} episodes for ${series.name} Season ${seasonNumber}`);
    }
  } catch (error) {
    console.error('Error fetching episodes from MongoDB:', error);
  }

  // When no episodes from DB, use TMDB so season page still shows episode list
  if (episodes.length === 0) {
    const tmdbEpisodes = await getSeasonEpisodes(tmdbId, seasonNumber);
    episodes = tmdbEpisodes.map((ep) => ({
      episode_imdb_id: ep.imdb_id || `tmdb-${tmdbId}-${seasonNumber}-${ep.episode_number}`,
      episode_number: ep.episode_number,
      episode_name: ep.name,
      overview: ep.overview,
      still_path: ep.still_path || undefined,
      air_date: ep.air_date,
      vote_average: ep.vote_average,
      runtime: ep.runtime,
    }));
  }
  
  if (episodes.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2 text-gray-400">
            <li><Link href="/series" className="hover:text-purple-400">TV Series</Link></li>
            <li>›</li>
            <li><Link href={`/${slug}`} className="hover:text-purple-400">{series.name}</Link></li>
            <li>›</li>
            <li className="text-white">Season {seasonNumber}</li>
          </ol>
        </nav>

        {/* Season Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-4xl font-bold text-white">
              {series.name} - Season {seasonNumber}
            </h1>
          </div>
          <p className="text-gray-400">
            {episodes.length} {episodes.length === 1 ? 'Episode' : 'Episodes'}
          </p>
        </div>

        {/* Episodes List */}
        <div className="space-y-4">
          {episodes.map((episode: EpisodeData) => (
            <Link
              key={episode.episode_imdb_id}
              href={`/${createEpisodeSlug(series.name, seasonNumber, episode.episode_number, episode.episode_name, episode.episode_imdb_id)}`}
              className="group block overflow-hidden rounded-xl border border-gray-700/70 bg-gray-800/70 transition-all duration-200 hover:border-purple-500/70 hover:ring-1 hover:ring-purple-500/50"
            >
              <div className="flex flex-col gap-4 p-4 md:flex-row md:gap-5 md:p-5">
                {/* Episode Thumbnail */}
                <div className="relative h-48 w-full flex-shrink-0 overflow-hidden rounded-lg bg-gray-700 md:h-48 md:w-80">
                  <Image
                    src={getEpisodeThumbnailSrc(episode, series)}
                    alt={`${series.name} S${seasonNumber}E${episode.episode_number}`}
                    fill
                    className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/15 transition-all duration-200 group-hover:bg-black/35">
                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-200">
                      <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                  {/* Episode Number Badge */}
                  <div className="absolute top-2 left-2 bg-black bg-opacity-80 text-white px-3 py-1 rounded font-semibold">
                    E{episode.episode_number}
                  </div>
                  {/* Duration Badge */}
                  {episode.runtime && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                      {episode.runtime} min
                    </div>
                  )}
                </div>
                
                {/* Episode Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-white transition-colors group-hover:text-purple-400">
                      {episode.episode_number}. {episode.episode_name}
                    </h3>
                    {episode.vote_average && (
                      <span className="ml-2 rounded-full bg-yellow-400/15 px-2.5 py-1 text-sm text-yellow-300">
                        ⭐ {episode.vote_average.toFixed(1)}
                      </span>
                    )}
                  </div>
                  
                  {episode.air_date && (
                    <p className="text-gray-400 text-sm mb-2">
                      Aired: {new Date(episode.air_date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  )}
                  
                  {episode.overview && (
                    <p className="text-gray-300 text-sm line-clamp-3">
                      {episode.overview}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}


