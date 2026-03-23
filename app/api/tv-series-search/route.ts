// API Route: Search TV Series
import { NextRequest, NextResponse } from 'next/server';
import { flushSeriesStore, getAllSeriesIds, getSeriesMeta } from '@/lib/tvSeriesStore';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = Math.max(0, (page - 1) * limit);

    if (query.trim().length < 2) {
      return NextResponse.json({
        success: true,
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          pages: 0
        }
      });
    }

    // JSON-first search over cached/enriched series metadata.
    const q = query.trim().toLowerCase();
    const matched: any[] = [];
    for (const id of getAllSeriesIds()) {
      const meta = await getSeriesMeta(id, true);
      const name = String(meta.name || '').toLowerCase();
      const overview = String(meta.overview || '').toLowerCase();
      const imdb = String(meta.imdb_id || '').toLowerCase();
      if (name.includes(q) || overview.includes(q) || imdb.includes(q)) matched.push(meta);
    }

    matched.sort((a, b) => {
      const da = a.first_air_date || '';
      const db = b.first_air_date || '';
      if (da !== db) return db.localeCompare(da);
      return Number(b.vote_average || 0) - Number(a.vote_average || 0);
    });

    const total = matched.length;
    const pageItems = matched.slice(skip, skip + limit);

    const searchResults = pageItems.map((s: any) => ({
      imdb_id: s.imdb_id,
      tmdb_id: s.tmdb_id ?? null,
      title: s.name,
      name: s.name,
      poster_path: s.poster_path ?? null,
      backdrop_path: s.backdrop_path ?? null,
      overview: s.overview ?? '',
      release_date: s.first_air_date ?? null,
      first_air_date: s.first_air_date ?? null,
      vote_average: Number(s.vote_average || 0),
      media_type: 'tv',
      episode_count: Number(s.number_of_episodes || 0),
      number_of_seasons: Number(s.number_of_seasons || 0)
    }));

    flushSeriesStore();

    return NextResponse.json({
      success: true,
      data: searchResults,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error searching TV series:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search TV series' },
      { status: 500 }
    );
  }
}
