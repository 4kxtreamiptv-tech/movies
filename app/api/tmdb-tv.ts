// TMDB API utility functions for TV Series

const TMDB_API_KEY = 'b31d2e5f33b74ffa7b3b483ff353f760';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export type TVSeries = {
  id: number;
  imdb_id?: string;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  last_air_date?: string;
  number_of_seasons: number;
  number_of_episodes: number;
  status: string;
  vote_average?: number;
  genres?: { id: number; name: string }[];
  created_by?: { id: number; name: string }[];
  networks?: { id: number; name: string; logo_path: string }[];
  origin_country?: string[];
  original_language?: string;
  popularity?: number;
};

export type Episode = {
  id: number;
  imdb_id: string;
  episode_number: number;
  season_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  vote_average?: number;
  runtime?: number;
  series_id: number;
  series_name: string;
  series_imdb_id?: string;
};

export type Season = {
  season_number: number;
  name: string;
  overview: string;
  poster_path: string | null;
  air_date: string;
  episode_count: number;
};

// Get episode details by IMDB ID
export async function getEpisodeByImdbId(imdbId: string): Promise<Episode | null> {
  try {
    // First, find the TMDB ID using the IMDB ID
    const findUrl = `${TMDB_BASE_URL}/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
    const findResponse = await fetch(findUrl);
    const findData = await findResponse.json();
    
    // Check if we found any TV episode results
    if (!findData.tv_episode_results || findData.tv_episode_results.length === 0) {
      console.log(`No TV episode found for IMDB ID: ${imdbId}`);
      return null;
    }
    
    const episodeResult = findData.tv_episode_results[0];
    const seriesId = episodeResult.show_id;
    const seasonNumber = episodeResult.season_number;
    const episodeNumber = episodeResult.episode_number;
    
    // Get series details to get series IMDB ID and name
    const seriesUrl = `${TMDB_BASE_URL}/tv/${seriesId}?api_key=${TMDB_API_KEY}`;
    const seriesResponse = await fetch(seriesUrl);
    const seriesData = await seriesResponse.json();
    
    // Get detailed episode information
    const episodeUrl = `${TMDB_BASE_URL}/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}?api_key=${TMDB_API_KEY}`;
    const episodeResponse = await fetch(episodeUrl);
    const episodeData = await episodeResponse.json();
    
    const episode: Episode = {
      id: episodeData.id,
      imdb_id: imdbId,
      episode_number: episodeNumber,
      season_number: seasonNumber,
      name: episodeData.name,
      overview: episodeData.overview || '',
      still_path: episodeData.still_path || null,
      air_date: episodeData.air_date || '',
      vote_average: episodeData.vote_average,
      runtime: episodeData.runtime,
      series_id: seriesId,
      series_name: seriesData.name,
      series_imdb_id: seriesData.external_ids?.imdb_id,
    };
    
    console.log(`Fetched episode: ${seriesData.name} S${seasonNumber}E${episodeNumber} - ${episodeData.name}`);
    return episode;
  } catch (error) {
    console.error('Error fetching episode by IMDB ID:', error);
    return null;
  }
}

// Get TV series details by TMDB ID
export async function getTVSeriesById(seriesId: number): Promise<TVSeries | null> {
  try {
    const url = `${TMDB_BASE_URL}/tv/${seriesId}?api_key=${TMDB_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    // Get external IDs including IMDB ID
    const externalIdsUrl = `${TMDB_BASE_URL}/tv/${seriesId}/external_ids?api_key=${TMDB_API_KEY}`;
    const externalIdsResponse = await fetch(externalIdsUrl);
    const externalIds = await externalIdsResponse.json();
    
    const series: TVSeries = {
      id: data.id,
      imdb_id: externalIds.imdb_id,
      name: data.name,
      original_name: data.original_name,
      overview: data.overview,
      poster_path: data.poster_path || null,
      backdrop_path: data.backdrop_path || null,
      first_air_date: data.first_air_date,
      last_air_date: data.last_air_date,
      number_of_seasons: data.number_of_seasons,
      number_of_episodes: data.number_of_episodes,
      status: data.status,
      vote_average: data.vote_average,
      genres: data.genres || [],
      created_by: data.created_by || [],
      networks: data.networks || [],
      origin_country: data.origin_country || [],
      original_language: data.original_language,
      popularity: data.popularity,
    };
    
    return series;
  } catch (error) {
    console.error('Error fetching TV series:', error);
    return null;
  }
}

// Get all seasons of a TV series
export async function getSeriesSeasons(seriesId: number): Promise<Season[]> {
  try {
    const url = `${TMDB_BASE_URL}/tv/${seriesId}?api_key=${TMDB_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.seasons || !Array.isArray(data.seasons)) {
      return [];
    }
    
    // Filter out season 0 (specials) and map to Season type
    const seasons: Season[] = data.seasons
      .filter((season: Season) => season.season_number > 0)
      .map((season: Season) => ({
        season_number: season.season_number,
        name: season.name,
        overview: season.overview || '',
        poster_path: season.poster_path || null,
        air_date: season.air_date || '',
        episode_count: season.episode_count,
      }));
    
    return seasons;
  } catch (error) {
    console.error('Error fetching series seasons:', error);
    return [];
  }
}

// Get all episodes of a specific season
export async function getSeasonEpisodes(seriesId: number, seasonNumber: number): Promise<Episode[]> {
  try {
    const seasonUrl = `${TMDB_BASE_URL}/tv/${seriesId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}`;
    const seasonResponse = await fetch(seasonUrl);
    const seasonData = await seasonResponse.json();
    
    // Get series name
    const seriesUrl = `${TMDB_BASE_URL}/tv/${seriesId}?api_key=${TMDB_API_KEY}`;
    const seriesResponse = await fetch(seriesUrl);
    const seriesInfo = await seriesResponse.json();
    
    if (!seasonData.episodes || !Array.isArray(seasonData.episodes)) {
      return [];
    }
    
    const episodes: Episode[] = seasonData.episodes.map((ep: Episode) => ({
      id: ep.id,
      imdb_id: '', // Will be populated from database
      episode_number: ep.episode_number,
      season_number: seasonNumber,
      name: ep.name,
      overview: ep.overview || '',
      still_path: ep.still_path || null,
      air_date: ep.air_date || '',
      vote_average: ep.vote_average,
      runtime: ep.runtime,
      series_id: seriesId,
      series_name: seriesInfo.name,
      series_imdb_id: seriesInfo.external_ids?.imdb_id,
    }));
    
    return episodes;
  } catch (error) {
    console.error('Error fetching season episodes:', error);
    return [];
  }
}

// Fetch multiple episodes by IMDB IDs
export async function getEpisodesByImdbIds(imdbIds: string[]): Promise<Episode[]> {
  try {
    const episodesPromises = imdbIds.map(imdbId => getEpisodeByImdbId(imdbId));
    const episodes = await Promise.all(episodesPromises);
    
    // Filter out any null results
    const validEpisodes = episodes.filter((episode): episode is Episode => episode !== null);
    
    console.log(`Fetched ${validEpisodes.length} episodes out of ${imdbIds.length} IDs`);
    return validEpisodes;
  } catch (error) {
    console.error('Error fetching episodes by multiple IMDB IDs:', error);
    return [];
  }
}

// Helper function to get image URL
export function getTVImageUrl(path: string | null | undefined, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string {
  if (!path || path.trim() === '') {
    return '/placeholder.svg';
  }
  const normalizedPath = path.trim();

  // Already a complete URL
  if (/^https?:\/\//i.test(normalizedPath)) {
    return normalizedPath;
  }

  // Protocol-relative URL: //image.tmdb.org/...
  if (normalizedPath.startsWith('//')) {
    return `https:${normalizedPath}`;
  }

  // Host-only URL without protocol: image.tmdb.org/...
  if (/^[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(normalizedPath)) {
    return `https://${normalizedPath}`;
  }

  const tmdbPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
  return `https://image.tmdb.org/t/p/${size}${tmdbPath}`;
}

// Helper function to format season/episode number (e.g., S01E01)
export function formatEpisodeCode(season: number, episode: number): string {
  const s = season.toString().padStart(2, '0');
  const e = episode.toString().padStart(2, '0');
  return `S${s}E${e}`;
}


