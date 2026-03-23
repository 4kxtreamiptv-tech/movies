import { NextRequest, NextResponse } from 'next/server';
import { flushSeriesStore, getAllSeriesIds, getSeriesMeta } from '@/lib/tvSeriesStore';

export const dynamic = 'force-dynamic';

function imdbNumericValue(imdbId: string): number {
  const m = imdbId.match(/^tt(\d+)$/i);
  return m ? Number(m[1]) : 0;
}

const GENRE_TO_TMDB_IDS: Record<string, number[]> = {
  action: [10759],
  drama: [18],
  comedy: [35],
  'sci-fi': [10765],
  scifi: [10765],
  horror: [9648], // TV has no strict horror id; closest discovery bucket
  thriller: [80, 9648, 10759],
  romance: [10749],
  mystery: [9648],
  fantasy: [10765],
  crime: [80],
  adventure: [10759],
  family: [10751],
  documentary: [99],
  animation: [16],
  reality: [10764],
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
  const skip = Math.max(0, parseInt(searchParams.get('skip') || '0', 10));
  const sortBy = searchParams.get('sortBy') || 'first_air_date';
  const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;
  const enrich = searchParams.get('enrich') === '1';

  const minRating = parseFloat(searchParams.get('minRating') || '0');
  const maxRating = parseFloat(searchParams.get('maxRating') || '10');
  const minYear = parseInt(searchParams.get('minYear') || '1900', 10);
  const maxYear = parseInt(searchParams.get('maxYear') || '2030', 10);
  const year = parseInt(searchParams.get('year') || '0', 10);
  const genre = (searchParams.get('genre') || '').trim().toLowerCase();

  try {
    const orderedIds = [...getAllSeriesIds()].sort((a, b) => {
      const diff = imdbNumericValue(b) - imdbNumericValue(a);
      return sortOrder === 1 ? -diff : diff;
    });

    const needsStrictFilters =
      year > 0 ||
      minYear > 1900 ||
      maxYear < 2030 ||
      genre.length > 0 ||
      minRating > 0 ||
      maxRating < 10;

    const targetGenreIds = genre ? GENRE_TO_TMDB_IDS[genre] || [] : [];

    // Fast path: no strict filters, just paginated latest list.
    if (!needsStrictFilters) {
      const total = orderedIds.length;
      const sliceIds = orderedIds.slice(skip, skip + limit);
      const data = enrich
        ? await Promise.all(sliceIds.map((id) => getSeriesMeta(id, true)))
        : await Promise.all(sliceIds.map((id) => getSeriesMeta(id, false)));
      flushSeriesStore();
      return NextResponse.json({
        success: true,
        data,
        total,
        limit,
        skip,
        source: 'tvSeriesIds',
        sortBy,
      });
    }

    const matched: any[] = [];
    const required = skip + limit + 1; // enough to detect hasMore in filtered mode

    for (const imdbId of orderedIds) {
      const meta = await getSeriesMeta(imdbId, enrich || needsStrictFilters);
      const firstYear =
        typeof meta.first_air_date === 'string' && meta.first_air_date.length >= 4
          ? parseInt(meta.first_air_date.slice(0, 4), 10)
          : 0;
      const rating = Number(meta.vote_average || 0);

      if (needsStrictFilters) {
        if (rating < minRating || rating > maxRating) continue;
        if (year > 0) {
          if (!firstYear || firstYear !== year) continue;
        } else if (firstYear) {
          if (firstYear < minYear || firstYear > maxYear) continue;
        }
        if (targetGenreIds.length > 0) {
          const ids = Array.isArray(meta.genre_ids) ? meta.genre_ids : [];
          if (!ids.some((id: number) => targetGenreIds.includes(id))) continue;
        }
      }

      matched.push(meta);
      if (needsStrictFilters && matched.length >= required) break;
    }

    // Latest-first by date, then rating, then imdb number
    matched.sort((a, b) => {
      const da = a.first_air_date || '';
      const db = b.first_air_date || '';
      if (da !== db) return db.localeCompare(da);
      const vr = Number(b.vote_average || 0) - Number(a.vote_average || 0);
      if (vr !== 0) return vr;
      return imdbNumericValue(b.imdb_id) - imdbNumericValue(a.imdb_id);
    });

    const pageItems = matched.slice(skip, skip + limit);
    const hasMoreFiltered = needsStrictFilters ? matched.length > skip + limit : skip + limit < matched.length;
    const total = needsStrictFilters
      ? skip + pageItems.length + (hasMoreFiltered ? 1 : 0)
      : matched.length;

    flushSeriesStore();

    return NextResponse.json({
      success: true,
      data: pageItems,
      total,
      limit,
      skip,
      source: 'tvSeriesIds',
      sortBy,
    });
  } catch (err) {
    console.error('TV series fetch failed:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch TV series' },
      { status: 500 }
    );
  }
}

