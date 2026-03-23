// TMDB API utility functions
import { resolvePosterUrl } from "@/lib/poster";

const TMDB_API_KEY = 'b31d2e5f33b74ffa7b3b483ff353f760';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export type Movie = {
  id: number;
  imdb_id: string;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  genres: { id: number; name: string }[];
  vote_average?: number;
  backdrop_path: string | null;
  runtime?: number;
  original_language?: string;
  status?: string;
  budget?: number;
  revenue?: number;
};

type Video = {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
};

export type MovieListItem = {
  id: number;
  imdb_id?: string;
  title: string;
  poster_path: string | null;
  release_date: string;
  genre_ids: number[];
  vote_average?: number;
  backdrop_path?: string | null;
};

export async function getMovieByImdbId(imdbId: string): Promise<Movie | null> {
  try {
    // First, find the TMDB ID using the IMDB ID
    const findUrl = `${TMDB_BASE_URL}/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
    const findResponse = await fetch(findUrl, {
      next: { revalidate: 86400 } // Cache for 24 hours
    });
    const findData = await findResponse.json();
    
    // Check if we found any movie results
    if (!findData.movie_results || findData.movie_results.length === 0) {
      return null;
    }
    
    // Get the TMDB ID from the first result
    const tmdbId = findData.movie_results[0].id;
    
    // Now get the full movie details using the TMDB ID
    const detailsUrl = `${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}`;
    const detailsResponse = await fetch(detailsUrl, {
      next: { revalidate: 86400 } // Cache for 24 hours
    });
    const movieData = await detailsResponse.json();
    
    const movie = {
      id: movieData.id,
      imdb_id: imdbId,
      title: movieData.title,
      overview: movieData.overview,
      poster_path: movieData.poster_path || null,
      release_date: movieData.release_date,
      genres: movieData.genres || [],
      vote_average: movieData.vote_average,
      backdrop_path: movieData.backdrop_path || null,
      runtime: movieData.runtime,
      original_language: movieData.original_language,
      status: movieData.status,
      budget: movieData.budget,
      revenue: movieData.revenue,
    };
    
    // Only return movies that have at least a poster image
    if (!movie.poster_path || movie.poster_path.trim() === '') {
      console.log('Skipping movie without poster:', movieData.title);
      return null;
    }
    
    console.log('Fetched movie data for', movieData.title, ':', {
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      hasPoster: !!movie.poster_path,
      hasBackdrop: !!movie.backdrop_path
    });
    
    return movie;
  } catch (error) {
    console.error('Error fetching movie by IMDB ID:', error);
    return null;
  }
}

export async function getPopularMovies(page: number = 1): Promise<MovieListItem[]> {
  try {
    const url = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`;
    const response = await fetch(url);
    const data = await response.json();
    
    // For each movie, get its IMDB ID
    const moviesWithImdbIds = await Promise.all(
      data.results.map(async (movie: Record<string, unknown>) => {
        try {
          const detailsUrl = `${TMDB_BASE_URL}/movie/${movie.id}?api_key=${TMDB_API_KEY}`;
          const detailsResponse = await fetch(detailsUrl);
          const movieDetails = await detailsResponse.json();
          
          return {
            ...movie,
            imdb_id: movieDetails.imdb_id,
          };
        } catch {
          return movie;
        }
      })
    );
    
    return moviesWithImdbIds;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return [];
  }
}

export function getImageUrl(path: string | null | undefined, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string {
  return resolvePosterUrl(path, size);
}

export function getFullImageUrl(path: string | null | undefined): string {
  return resolvePosterUrl(path, 'original');
}


export function getYear(dateString: string): string {
  return dateString ? new Date(dateString).getFullYear().toString() : '';
}

// Utility function to check if an image path is valid
export function isValidImagePath(path: string | null | undefined): boolean {
  if (!path || path.trim() === '') return false;
  
  // Check if it's already a placeholder
  if (path === '/placeholder.svg') return false;
  
  // Check if it's a valid TMDB image path
  return path.startsWith('/') && path.length > 1;
}

// Enhanced image URL function with fallback
export function getImageUrlWithFallback(
  path: string | null | undefined, 
  size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'
): string {
  console.log('getImageUrlWithFallback called with:', path, 'size:', size);
  if (!isValidImagePath(path)) {
    console.log('getImageUrlWithFallback: Invalid path, using placeholder');
    return '/placeholder.svg';
  }
  const url = getImageUrl(path, size);
  console.log('getImageUrlWithFallback: Returning URL:', url);
  return url;
}

export async function getSimilarMovies(movieId: number): Promise<MovieListItem[]> {
  try {
    const url = `${TMDB_BASE_URL}/movie/${movieId}/similar?api_key=${TMDB_API_KEY}&page=1`;
    const response = await fetch(url);
    const data = await response.json();
    
    // For each movie, get its IMDB ID
    const moviesWithImdbIds = await Promise.all(
      data.results.slice(0, 6).map(async (movie: Record<string, unknown>) => {
        try {
          const detailsUrl = `${TMDB_BASE_URL}/movie/${movie.id}?api_key=${TMDB_API_KEY}`;
          const detailsResponse = await fetch(detailsUrl);
          const movieDetails = await detailsResponse.json();
          
          return {
            ...movie,
            imdb_id: movieDetails.imdb_id,
          };
        } catch {
          return movie;
        }
      })
    );
    
    // Filter out movies without poster images
    const moviesWithImages = moviesWithImdbIds.filter(movie => 
      movie.poster_path && 
      movie.poster_path.trim() !== ''
    );
    
    console.log(`Filtered similar movies from ${moviesWithImdbIds.length} to ${moviesWithImages.length} with images`);
    return moviesWithImages;
  } catch (error) {
    console.error('Error fetching similar movies:', error);
    return [];
  }
}

// Fetch data from multiple IMDB IDs
export async function getMoviesByMultipleImdbIds(imdbIds: string[]): Promise<Movie[]> {
  try {
    // Use Promise.all to fetch multiple movies in parallel
    const moviesPromises = imdbIds.map(imdbId => getMovieByImdbId(imdbId));
    const movies = await Promise.all(moviesPromises);
    
    // Filter out any null results and movies without images
    const validMovies = movies.filter((movie): movie is Movie => 
      movie !== null && 
      typeof movie.poster_path === 'string' && 
      movie.poster_path.trim() !== ''
    );
    
    console.log(`Filtered ${movies.length} movies down to ${validMovies.length} with images`);
    return validMovies;
  } catch (error) {
    console.error('Error fetching movies by multiple IMDB IDs:', error);
    return [];
  }
}

// Alias for getMoviesByMultipleImdbIds for backward compatibility
export const getMoviesByImdbIds = getMoviesByMultipleImdbIds;

// Fetch movie videos (trailers, teasers, etc.) from TMDB
export async function getMovieVideos(movieId: number): Promise<Video[]> {
  try {
    const url = `${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    // Return videos, prioritizing official YouTube trailers
    return data.results
      .filter((video: Video) => video.site.toLowerCase() === 'youtube')
      .sort((a: Video, b: Video) => {
        // Prioritize official trailers
        if (a.official && a.type === 'Trailer' && (!b.official || b.type !== 'Trailer')) return -1;
        if (b.official && b.type === 'Trailer' && (!a.official || a.type !== 'Trailer')) return 1;
        // Then official teasers
        if (a.official && a.type === 'Teaser' && (!b.official || b.type !== 'Teaser')) return -1;
        if (b.official && b.type === 'Teaser' && (!a.official || a.type !== 'Teaser')) return 1;
        return 0;
      });
  } catch (error) {
    console.error('Error fetching movie videos:', error);
    return [];
  }
}

// Search movies by title using TMDB API
export async function searchMoviesByTitle(searchTerm: string, limit: number = 20): Promise<MovieListItem[]> {
  try {
    console.log('TMDB searchMoviesByTitle called with:', searchTerm, limit);
    const url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchTerm)}&page=1`;
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('TMDB search response:', data);
    
    // Check if we have results
    if (!data.results || !Array.isArray(data.results)) {
      console.log('No results or invalid results array from TMDB');
      return [];
    }
    
    // For each movie, get its IMDB ID
    const moviesWithImdbIds = await Promise.all(
      data.results.slice(0, limit).map(async (movie: Record<string, unknown>) => {
        try {
          const detailsUrl = `${TMDB_BASE_URL}/movie/${movie.id}?api_key=${TMDB_API_KEY}`;
          const detailsResponse = await fetch(detailsUrl);
          const movieDetails = await detailsResponse.json();
          
          return {
            ...movie,
            imdb_id: movieDetails.imdb_id,
            runtime: movieDetails.runtime,
          };
        } catch (error) {
          console.error('Error fetching movie details:', error);
          return {
            ...movie,
            imdb_id: null,
            runtime: null,
          };
        }
      })
    );
    
    // Filter out movies without IMDB IDs
    const validMovies = moviesWithImdbIds.filter(movie => movie.imdb_id) as MovieListItem[];
    console.log('TMDB searchMoviesByTitle returning:', validMovies.length, 'movies');
    return validMovies;
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
}

// Search movies with pagination metadata (TMDB search/movie endpoint).
// We still fetch each result's details to extract `imdb_id`.
export async function searchMoviesByTitlePaginated(
  searchTerm: string,
  page: number = 1,
  limit: number = 20
): Promise<{
  results: MovieListItem[];
  pagination: { page: number; limit: number; totalResults: number; totalPages: number };
}> {
  try {
    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, Math.min(50, limit));

    const url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
      searchTerm
    )}&page=${safePage}`;

    const response = await fetch(url);
    const data = await response.json();

    const totalResults = typeof data?.total_results === 'number' ? data.total_results : 0;
    const totalPages = typeof data?.total_pages === 'number' ? data.total_pages : 0;

    if (!data.results || !Array.isArray(data.results)) {
      return {
        results: [],
        pagination: { page: safePage, limit: safeLimit, totalResults, totalPages }
      };
    }

    const moviesPage = data.results.slice(0, safeLimit);

    const moviesWithImdbIds = await Promise.all(
      moviesPage.map(async (movie: Record<string, unknown>) => {
        try {
          const detailsUrl = `${TMDB_BASE_URL}/movie/${movie.id}?api_key=${TMDB_API_KEY}`;
          const detailsResponse = await fetch(detailsUrl);
          const movieDetails = await detailsResponse.json();

          return {
            ...movie,
            imdb_id: movieDetails.imdb_id,
            runtime: movieDetails.runtime
          };
        } catch {
          return {
            ...movie,
            imdb_id: null,
            runtime: null
          };
        }
      })
    );

    // Filter out movies without IMDB IDs
    const validMovies = moviesWithImdbIds.filter(
      (movie): movie is MovieListItem => !!movie.imdb_id
    );

    return {
      results: validMovies,
      pagination: { page: safePage, limit: safeLimit, totalResults, totalPages }
    };
  } catch (error) {
    console.error('Error searching movies (paginated):', error);
    return {
      results: [],
      pagination: { page: Math.max(1, page), limit: Math.max(1, limit), totalResults: 0, totalPages: 0 }
    };
  }
}