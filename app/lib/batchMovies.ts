import fs from 'fs';
import path from 'path';
import { BULK_MOVIE_IDS } from '@/data/bulkMovieIds';
import { TV_SERIES_IDS } from '@/data/tvSeriesIds';

type BatchMovie = {
  imdbId?: string;
  imdb_id?: string;
  title?: string;
  year?: number;
  poster?: string | null;
};

let cachedMovieIds: { at: number; ids: string[] } | null = null;

function getScriptsDir() {
  return path.join(process.cwd(), 'scripts');
}

export function getBatchMovieImdbIds(): string[] {
  // Cache for 10 minutes (good enough for dev + serverless cold starts)
  const now = Date.now();
  if (cachedMovieIds && now - cachedMovieIds.at < 10 * 60 * 1000) return cachedMovieIds.ids;

  const scriptsDir = getScriptsDir();
  if (!fs.existsSync(scriptsDir)) {
    cachedMovieIds = { at: now, ids: BULK_MOVIE_IDS };
    return cachedMovieIds.ids;
  }

  const batchFiles = fs
    .readdirSync(scriptsDir)
    .filter((file) => file.startsWith('batch-') && file.endsWith('-results.json'))
    .sort((a, b) => {
      const aNum = parseInt(a.match(/batch-(\d+)-results\.json/)?.[1] || '0', 10);
      const bNum = parseInt(b.match(/batch-(\d+)-results\.json/)?.[1] || '0', 10);
      return aNum - bNum;
    });

  if (batchFiles.length === 0) {
    cachedMovieIds = { at: now, ids: BULK_MOVIE_IDS };
    return cachedMovieIds.ids;
  }

  const ids: string[] = [];
  for (const batchFile of batchFiles) {
    try {
      const batchPath = path.join(scriptsDir, batchFile);
      const batchData = JSON.parse(fs.readFileSync(batchPath, 'utf8')) as BatchMovie[];

      for (const movie of batchData) {
        const imdb = (movie.imdbId || movie.imdb_id || '').trim();
        if (!imdb) continue;
        // Keep parity with /api/movies/latest (only take movies with year+poster)
        if (!movie.year || !movie.poster) continue;
        ids.push(imdb);
      }
    } catch {
      // Ignore broken batch file; continue with others
    }
  }

  // If something went wrong and we got nothing, fall back to bulk list.
  cachedMovieIds = { at: now, ids: ids.length > 0 ? ids : BULK_MOVIE_IDS };
  return cachedMovieIds.ids;
}

export function getBatchMovieItemsSlice(
  offset: number,
  limit: number
): { imdb_id: string; title: string }[] {
  const safeOffset = Math.max(0, offset);
  const safeLimit = Math.max(0, limit);
  if (safeLimit === 0) return [];

  const scriptsDir = getScriptsDir();
  if (!fs.existsSync(scriptsDir)) {
    // Fallback: no titles available
    return BULK_MOVIE_IDS.slice(safeOffset, safeOffset + safeLimit).map((imdb_id) => ({
      imdb_id,
      title: '',
    }));
  }

  const batchFiles = fs
    .readdirSync(scriptsDir)
    .filter((file) => file.startsWith('batch-') && file.endsWith('-results.json'))
    .sort((a, b) => {
      const aNum = parseInt(a.match(/batch-(\d+)-results\.json/)?.[1] || '0', 10);
      const bNum = parseInt(b.match(/batch-(\d+)-results\.json/)?.[1] || '0', 10);
      return aNum - bNum;
    });

  if (batchFiles.length === 0) {
    return BULK_MOVIE_IDS.slice(safeOffset, safeOffset + safeLimit).map((imdb_id) => ({
      imdb_id,
      title: '',
    }));
  }

  const items: { imdb_id: string; title: string }[] = [];
  let seen = 0;

  for (const batchFile of batchFiles) {
    if (items.length >= safeLimit) break;
    try {
      const batchPath = path.join(scriptsDir, batchFile);
      const batchData = JSON.parse(fs.readFileSync(batchPath, 'utf8')) as BatchMovie[];

      for (const movie of batchData) {
        const imdb_id = (movie.imdbId || movie.imdb_id || '').trim();
        if (!imdb_id) continue;
        if (!movie.year || !movie.poster) continue;

        if (seen >= safeOffset && items.length < safeLimit) {
          items.push({ imdb_id, title: movie.title || '' });
        }
        seen++;
        if (items.length >= safeLimit) break;
      }
    } catch {
      // ignore file errors
    }
  }

  // If slice is empty (unexpected), fall back to bulk IDs slice
  if (items.length === 0) {
    return BULK_MOVIE_IDS.slice(safeOffset, safeOffset + safeLimit).map((imdb_id) => ({
      imdb_id,
      title: '',
    }));
  }

  return items;
}

export function getBatchMovieCount(): number {
  return getBatchMovieImdbIds().length;
}

export function getBulkSeriesCount(): number {
  // Series "batches" don’t exist in scripts; series sitemap uses ids file.
  return TV_SERIES_IDS.length;
}

export function getSeriesImdbIds(): string[] {
  return TV_SERIES_IDS;
}


