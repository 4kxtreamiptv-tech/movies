import fs from "fs";
import path from "path";

type CachedMoviesState = {
  allMovies: any[];
  latestYear: number | null;
  fingerprint: string;
  cachedAt: number;
};

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
let cacheState: CachedMoviesState | null = null;

function getScriptsDir(): string {
  return path.join(process.cwd(), "scripts");
}

function getBatchFiles(scriptsDir: string): string[] {
  return fs
    .readdirSync(scriptsDir)
    .filter((file) => file.startsWith("batch-") && file.endsWith("-results.json"))
    .sort((a, b) => {
      const aNum = parseInt(a.match(/batch-(\d+)-results\.json/)?.[1] || "0", 10);
      const bNum = parseInt(b.match(/batch-(\d+)-results\.json/)?.[1] || "0", 10);
      return aNum - bNum;
    });
}

function buildFingerprint(scriptsDir: string, batchFiles: string[]): string {
  const parts = batchFiles.map((file) => {
    const stat = fs.statSync(path.join(scriptsDir, file));
    return `${file}:${stat.mtimeMs}:${stat.size}`;
  });
  return parts.join("|");
}

function normalizeMovie(movie: any) {
  return {
    ...movie,
    id: movie.imdbId || movie.id,
    imdb_id: movie.imdbId,
    title: movie.title,
    year: movie.year,
    poster_path: movie.poster,
    backdrop_path: movie.backdrop,
    overview: movie.overview,
    vote_average: movie.rating,
    release_date: movie.release_date,
    runtime: movie.runtime,
    original_language: movie.language,
    genres: movie.genres || [],
  };
}

function sortMovies(allMovies: any[]) {
  allMovies.sort((a, b) => {
    const ay = a.year || 0;
    const by = b.year || 0;
    if (by !== ay) return by - ay;

    const ad = a.release_date ? Date.parse(a.release_date) : Date.parse(`${ay}-01-01`);
    const bd = b.release_date ? Date.parse(b.release_date) : Date.parse(`${by}-01-01`);
    if (bd !== ad) return bd - ad;

    return (b.vote_average || 0) - (a.vote_average || 0);
  });
}

export function getCachedMoviesData() {
  const scriptsDir = getScriptsDir();
  if (!fs.existsSync(scriptsDir)) {
    return {
      available: false,
      allMovies: [] as any[],
      latestYear: null as number | null,
      message: "Movie data not available yet",
    };
  }

  const batchFiles = getBatchFiles(scriptsDir);
  const fingerprint = buildFingerprint(scriptsDir, batchFiles);
  const now = Date.now();

  if (
    cacheState &&
    cacheState.fingerprint === fingerprint &&
    now - cacheState.cachedAt < CACHE_TTL_MS
  ) {
    return {
      available: true,
      allMovies: cacheState.allMovies,
      latestYear: cacheState.latestYear,
    };
  }

  const allMovies: any[] = [];
  for (const batchFile of batchFiles) {
    try {
      const batchPath = path.join(scriptsDir, batchFile);
      const batchData = JSON.parse(fs.readFileSync(batchPath, "utf8"));
      batchData.forEach((movie: any) => {
        if (movie.year && movie.poster) {
          allMovies.push(normalizeMovie(movie));
        }
      });
    } catch (error) {
      console.error(`Error reading batch file ${batchFile}:`, error);
    }
  }

  sortMovies(allMovies);
  const latestYear = allMovies.length > 0 ? Math.max(...allMovies.map((m) => m.year)) : null;

  cacheState = {
    allMovies,
    latestYear,
    fingerprint,
    cachedAt: now,
  };

  return {
    available: true,
    allMovies,
    latestYear,
  };
}

