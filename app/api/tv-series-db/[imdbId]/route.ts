import { NextRequest, NextResponse } from 'next/server';
import { getAllSeriesIds, getSeriesMeta } from '@/lib/tvSeriesStore';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ imdbId: string }> }
) {
  try {
    const { imdbId } = await params;
    const exists = getAllSeriesIds().includes(imdbId);
    if (!exists) {
      return NextResponse.json(
        { success: false, error: 'Series not found' },
        { status: 404 }
      );
    }

    const meta = await getSeriesMeta(imdbId, true);

    return NextResponse.json({
      success: true,
      data: {
        imdb_id: meta.imdb_id,
        tmdb_id: meta.tmdb_id ?? null,
        name: meta.name,
        overview: meta.overview ?? '',
        poster_path: meta.poster_path ?? null,
        backdrop_path: meta.backdrop_path ?? null,
        first_air_date: meta.first_air_date ?? null,
        vote_average: Number(meta.vote_average || 0),
        number_of_seasons: Number(meta.number_of_seasons || 0),
        number_of_episodes: Number(meta.number_of_episodes || 0),
        seasons: Array.isArray(meta.seasons) ? meta.seasons : []
      }
    });

  } catch (error) {
    console.error('Error fetching TV series:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch TV series' },
      { status: 500 }
    );
  }
}

