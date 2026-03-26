import { NextRequest, NextResponse } from 'next/server';
import { getCachedMoviesData } from '@/lib/serverMovieCache';
import { VID_SRC_LATEST_MOVIES } from '@/data/vidsrcLatestMovies';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'latest';
    const limit = parseInt(searchParams.get('limit') || '20');

    const moviesData = getCachedMoviesData();
    if (!moviesData.available) {
      return NextResponse.json({
        movies: [],
        message: moviesData.message || 'Movie data not available yet'
      });
    }
    const allMovies = moviesData.allMovies;
    const byImdbId = moviesData.byImdbId;

    // Get latest movies based on category
    let selectedMovies: any[] = [];

    switch (category) {
      case 'suggestions':
        // Homepage requirement: show RECENT-ADDED from our source (VidSrc).
        if (Array.isArray(VID_SRC_LATEST_MOVIES) && VID_SRC_LATEST_MOVIES.length) {
          const ids = [...VID_SRC_LATEST_MOVIES]
            .sort((a, b) => String(b.time_added || '').localeCompare(String(a.time_added || '')))
            .map((m) => String(m.imdb_id || '').trim())
            .filter(Boolean);
          // Only map what we need (allow some slack for missing IDs).
          const candidateIds = ids.slice(0, Math.max(limit * 5, 40));
          const mapped = candidateIds.map((id) => byImdbId.get(id)).filter(Boolean);
          selectedMovies = mapped.slice(0, limit);
        }
        if (selectedMovies.length === 0) {
          // Fallback: dataset ordering
          selectedMovies = allMovies.slice(0, limit);
        }
        break;
        
      case 'latest':
        // Show what's most recently added in VidSrc source first.
        if (Array.isArray(VID_SRC_LATEST_MOVIES) && VID_SRC_LATEST_MOVIES.length) {
          const ids = [...VID_SRC_LATEST_MOVIES]
            .sort((a, b) => String(b.time_added || '').localeCompare(String(a.time_added || '')))
            .map((m) => String(m.imdb_id || '').trim())
            .filter(Boolean);
          const candidateIds = ids.slice(0, Math.max(limit * 5, 40));
          const mapped = candidateIds.map((id) => byImdbId.get(id)).filter(Boolean);
          selectedMovies = mapped.slice(0, limit);
        }
        if (selectedMovies.length === 0) {
          // Fallback to generated dataset ordering
          selectedMovies = allMovies.slice(0, limit);
        }
        break;
        
      case 'trending':
        // Movies from latest 3 years, sorted by rating
        const maxYear = Math.max(...allMovies.map(m => m.year));
        selectedMovies = allMovies
          .filter(movie => movie.year >= maxYear - 2)
          .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
          .slice(0, limit);
        break;
        
      case 'top_rated':
        // Highest rated movies overall
        selectedMovies = allMovies
          .filter(movie => movie.vote_average && movie.vote_average > 0)
          .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
          .slice(0, limit);
        break;
        
              case 'action':
                // Latest movies with good ratings (action-like)
                const actionMaxYear = Math.max(...allMovies.map(m => m.year));
                selectedMovies = allMovies
                  .filter(movie => movie.year >= actionMaxYear - 1 && movie.vote_average && movie.vote_average > 5)
                  .slice(0, limit);
                break;
                
              case 'tv_shows':
                // TV Shows: Filter for TV series content
                const tvMaxYear = Math.max(...allMovies.map(m => m.year));
                selectedMovies = allMovies
                  .filter(movie => {
                    const isRecent = movie.year >= tvMaxYear - 3;
                    const hasGoodRating = movie.vote_average && movie.vote_average > 5.0;
                    const titleIndicatesTV = movie.title && (
                      movie.title.toLowerCase().includes('series') ||
                      movie.title.toLowerCase().includes('season') ||
                      movie.title.toLowerCase().includes('episode') ||
                      movie.title.toLowerCase().includes('tv') ||
                      movie.title.toLowerCase().includes('show') ||
                      movie.title.toLowerCase().includes('drama') ||
                      movie.title.toLowerCase().includes('comedy') ||
                      movie.title.toLowerCase().includes('sitcom')
                    );
                    return isRecent && hasGoodRating && titleIndicatesTV;
                  })
                  .slice(0, limit);
                break;
                
              default:
        // Default to latest movies
        const defaultYear = Math.max(...allMovies.map(m => m.year));
        selectedMovies = allMovies
          .filter(movie => movie.year === defaultYear)
          .slice(0, limit);
    }

    // If we don't have enough movies for the specific category, fill with latest movies
    if (selectedMovies.length < limit) {
      const additionalMovies = allMovies
        .filter(movie => !selectedMovies.some(selected => selected.imdb_id === movie.imdb_id))
        .slice(0, limit - selectedMovies.length);
      selectedMovies = [...selectedMovies, ...additionalMovies];
    }

    return NextResponse.json({
      movies: selectedMovies.slice(0, limit),
      category: category,
      totalAvailable: allMovies.length,
      latestYear: moviesData.latestYear
    });

  } catch (error) {
    console.error('Error fetching latest movies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch latest movies' },
      { status: 500 }
    );
  }
}
