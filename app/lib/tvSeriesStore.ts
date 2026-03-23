import fs from 'fs';
import path from 'path';
import { TV_SERIES_IDS } from '@/data/tvSeriesIds';

const TMDB_API_KEY = 'b31d2e5f33b74ffa7b3b483ff353f760';
const TMDB_BASE = 'https://api.themoviedb.org/3';
const STORE_PATH = path.join(process.cwd(), 'scripts', 'tv-series-details.json');

type SeriesMeta = {
  imdb_id: string;
  tmdb_id: number | null;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string | null;
  vote_average: number;
  number_of_seasons: number;
  number_of_episodes: number;
  genre_ids: number[];
  genres: string[];
  seasons: any[];
};

let store: Record<string, SeriesMeta> | null = null;
let dirtyWrites = 0;

function ensureStoreLoaded() {
  if (store) return;
  try {
    if (fs.existsSync(STORE_PATH)) {
      store = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
    } else {
      store = {};
    }
  } catch {
    store = {};
  }
}

function persistStoreIfNeeded(force = false) {
  if (!store) return;
  if (!force && dirtyWrites < 20) return;
  try {
    const dir = path.dirname(STORE_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
    dirtyWrites = 0;
  } catch {
    // ignore disk write errors
  }
}

function fallbackSeries(imdbId: string): SeriesMeta {
  return {
    imdb_id: imdbId,
    tmdb_id: null,
    name: `TV Series ${imdbId}`,
    overview: '',
    poster_path: null,
    backdrop_path: null,
    first_air_date: null,
    vote_average: 0,
    number_of_seasons: 0,
    number_of_episodes: 0,
    genre_ids: [],
    genres: [],
    seasons: [],
  };
}

export function getAllSeriesIds(): string[] {
  return TV_SERIES_IDS;
}

export function getCachedSeriesMeta(imdbId: string): SeriesMeta | null {
  ensureStoreLoaded();
  return store?.[imdbId] || null;
}

export async function getSeriesMeta(imdbId: string, fetchIfMissing: boolean): Promise<SeriesMeta> {
  ensureStoreLoaded();
  const existing = store?.[imdbId];
  if (existing) return existing;
  if (!fetchIfMissing) return fallbackSeries(imdbId);

  try {
    const findRes = await fetch(
      `${TMDB_BASE}/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`
    );
    if (!findRes.ok) return fallbackSeries(imdbId);
    const findJson = await findRes.json();
    const tv = Array.isArray(findJson?.tv_results) ? findJson.tv_results[0] : null;
    if (!tv?.id) return fallbackSeries(imdbId);

    const detailsRes = await fetch(`${TMDB_BASE}/tv/${tv.id}?api_key=${TMDB_API_KEY}`);
    const detailsJson = detailsRes.ok ? await detailsRes.json() : null;

    const meta: SeriesMeta = {
      imdb_id: imdbId,
      tmdb_id: (detailsJson?.id ?? tv.id) || null,
      name: detailsJson?.name || tv.name || `TV Series ${imdbId}`,
      overview: detailsJson?.overview || tv.overview || '',
      poster_path: detailsJson?.poster_path || tv.poster_path || null,
      backdrop_path: detailsJson?.backdrop_path || tv.backdrop_path || null,
      first_air_date: detailsJson?.first_air_date || tv.first_air_date || null,
      vote_average: Number(detailsJson?.vote_average ?? tv.vote_average ?? 0),
      number_of_seasons: Number(detailsJson?.number_of_seasons ?? 0),
      number_of_episodes: Number(detailsJson?.number_of_episodes ?? 0),
      genre_ids: Array.isArray(detailsJson?.genres)
        ? detailsJson.genres.map((g: any) => Number(g?.id)).filter((n: number) => !Number.isNaN(n))
        : Array.isArray(tv.genre_ids)
          ? tv.genre_ids.map((n: any) => Number(n)).filter((n: number) => !Number.isNaN(n))
          : [],
      genres: Array.isArray(detailsJson?.genres)
        ? detailsJson.genres.map((g: any) => String(g?.name)).filter(Boolean)
        : [],
      seasons: Array.isArray(detailsJson?.seasons)
        ? detailsJson.seasons
            .filter((s: any) => s && typeof s.season_number === 'number')
            .map((s: any) => ({ season_number: s.season_number, episodes: [] }))
        : [],
    };

    if (store) {
      store[imdbId] = meta;
      dirtyWrites += 1;
      persistStoreIfNeeded();
    }
    return meta;
  } catch {
    return fallbackSeries(imdbId);
  }
}

export function flushSeriesStore() {
  persistStoreIfNeeded(true);
}

