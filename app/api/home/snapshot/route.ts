import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type HomeSnapshot = {
  generatedAt: string;
  suggestions: any[];
  latestMovies: any[];
  homeLatestTvSeries: any[];
  referenceFetchedAt?: string;
};

const DISK_FILE = path.join(process.cwd(), "app", "data", "homeSnapshot.json");
const DISK_LATEST_MOVIES_TS = path.join(process.cwd(), "app", "data", "vidsrcLatestMovies.ts");
const DISK_TV_SERIES_IDS_TS = path.join(process.cwd(), "app", "data", "tvSeriesIds.ts");
const TTL_MS = 24 * 60 * 60 * 1000; // 24h
let recomputeInFlight: Promise<HomeSnapshot> | null = null;

function readJsonAny(filePath: string): HomeSnapshot | null {
  try {
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw) as HomeSnapshot;
  } catch {
    return null;
  }
}

function readJsonIfFresh(filePath: string, ttlMs: number): HomeSnapshot | null {
  try {
    if (!fs.existsSync(filePath)) return null;
    const stat = fs.statSync(filePath);
    const ageMs = Date.now() - stat.mtimeMs;
    if (ageMs >= ttlMs) return null;
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw) as HomeSnapshot;
  } catch {
    return null;
  }
}

function scoreRenderableTvSeries(series: any) {
  const name = String(series?.name || series?.title || "").trim();
  if (!name) return { item: null as any, score: -1 };

  const score =
    (series?.poster_path ? 4 : 0) +
    (series?.backdrop_path ? 2 : 0) +
    (Number(series?.vote_average || 0) > 0 ? 1 : 0) +
    (series?.first_air_date ? 1 : 0);

  return { item: series, score };
}

function pickRenderableTvSeries(series: any[], count: number): any[] {
  if (!Array.isArray(series) || series.length === 0) return [];
  const scored = series
    .map((s) => scoreRenderableTvSeries(s))
    .filter((x) => x.item)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.item);
  return scored.slice(0, count);
}

function reorderByImdbIds(pool: any[], refIds: string[], count: number): any[] {
  if (!Array.isArray(pool) || pool.length === 0) return [];
  if (!Array.isArray(refIds) || refIds.length === 0) return pool.slice(0, count);

  const byId = new Map<string, any>();
  for (const item of pool) {
    const id = String(item?.imdb_id || "").trim();
    if (!id) continue;
    if (!byId.has(id)) byId.set(id, item);
  }

  const out: any[] = [];
  const used = new Set<string>();
  for (const rid of refIds) {
    const id = String(rid || "").trim();
    if (!id) continue;
    const item = byId.get(id);
    if (!item || used.has(id)) continue;
    used.add(id);
    out.push(item);
    if (out.length >= count) break;
  }

  for (const item of pool) {
    const id = String(item?.imdb_id || "").trim();
    if (!id || used.has(id)) continue;
    used.add(id);
    out.push(item);
    if (out.length >= count) break;
  }

  return out.slice(0, count);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const force = searchParams.get("force") === "1" || searchParams.get("force") === "true";
  const diskSnapshot = readJsonAny(DISK_FILE);

  // User request should be instant:
  // - If snapshot exists, always serve it (even if TTL expired).
  // - Snapshot update only happens when `force=1` OR snapshot missing.
  if (!force && diskSnapshot) {
    const diskFresh = readJsonIfFresh(DISK_FILE, TTL_MS);
    return NextResponse.json(diskSnapshot, {
      headers: {
        "Cache-Control": diskFresh ? "public, max-age=3600" : "public, max-age=600",
      },
    });
  }

  // Recompute snapshot (force/missing). Prevent stampede for simultaneous hits.
  if (!recomputeInFlight) {
    recomputeInFlight = (async () => {
      const url = new URL(request.url);
      const base = url.origin;

      const DISPLAY_COUNT = 16;
      const TV_POOL_LIMIT = DISPLAY_COUNT * 2; // enough for scoring

      const snapshotGeneratedMs = diskSnapshot?.generatedAt
        ? Date.parse(diskSnapshot.generatedAt)
        : fs.existsSync(DISK_FILE)
          ? fs.statSync(DISK_FILE).mtimeMs
          : 0;

      const latestMoviesTsMs = fs.existsSync(DISK_LATEST_MOVIES_TS)
        ? fs.statSync(DISK_LATEST_MOVIES_TS).mtimeMs
        : 0;
      const tvIdsTsMs = fs.existsSync(DISK_TV_SERIES_IDS_TS)
        ? fs.statSync(DISK_TV_SERIES_IDS_TS).mtimeMs
        : 0;
      const localChanged = latestMoviesTsMs > snapshotGeneratedMs || tvIdsTsMs > snapshotGeneratedMs;

      // Mapping check: if ref mapping fetchedAt changed, we apply it (reorder) in the snapshot.
      const refMapped = await fetch(`${base}/api/reference/home-mapped`)
        .then((r) => r.json())
        .catch(() => null);
      const referenceFetchedAt = refMapped?.fetchedAt ? String(refMapped.fetchedAt) : undefined;
      const mappingChanged =
        !diskSnapshot?.referenceFetchedAt || (referenceFetchedAt ? referenceFetchedAt !== diskSnapshot?.referenceFetchedAt : false);

      // If nothing changed, avoid extra movie/TV fetch (unless force=1).
      if (!force && diskSnapshot && !localChanged && !mappingChanged) {
        return diskSnapshot;
      }

      const refSuggestionsImdbIds: string[] = Array.isArray(refMapped?.suggestionsImdbIds)
        ? (refMapped.suggestionsImdbIds as string[])
        : [];
      const refLatestMoviesImdbIds: string[] = Array.isArray(refMapped?.latestMoviesImdbIds)
        ? (refMapped.latestMoviesImdbIds as string[])
        : [];

      const [sugRes, latestRes, tvRes] = await Promise.all([
        fetch(
          `${base}/api/movies/latest?category=suggestions&limit=${DISPLAY_COUNT}`
        )
          .then((r) => r.json())
          .catch(() => null),
        fetch(
          `${base}/api/movies/latest?category=latest&limit=${DISPLAY_COUNT * 2}`
        )
          .then((r) => r.json())
          .catch(() => null),
        fetch(
          `${base}/api/tv-series-db?limit=${TV_POOL_LIMIT}&skip=0&sortBy=first_air_date&sortOrder=desc`
        )
          .then((r) => r.json())
          .catch(() => null),
      ]);

      const suggestionsPool: any[] = Array.isArray(sugRes?.movies) ? sugRes.movies : [];
      const suggestionsImdb = new Set(
        suggestionsPool.map((m) => String(m?.imdb_id || "").trim()).filter(Boolean)
      );

      const latestPool: any[] = Array.isArray(latestRes?.movies) ? latestRes.movies : [];
      const latestPoolFiltered = latestPool.filter((m) => {
        const id = String(m?.imdb_id || "").trim();
        if (!id) return true;
        return !suggestionsImdb.has(id);
      });

      const suggestionsOrdered = reorderByImdbIds(suggestionsPool, refSuggestionsImdbIds, DISPLAY_COUNT);
      const latestMoviesOrdered = reorderByImdbIds(latestPoolFiltered, refLatestMoviesImdbIds, DISPLAY_COUNT);

      const tvRaw: any[] = tvRes?.success && Array.isArray(tvRes.data) ? tvRes.data : [];
      const homeLatestTvSeries = pickRenderableTvSeries(tvRaw, DISPLAY_COUNT);

      const snapshot: HomeSnapshot = {
        generatedAt: new Date().toISOString(),
        suggestions: suggestionsOrdered,
        latestMovies: latestMoviesOrdered,
        homeLatestTvSeries,
        referenceFetchedAt,
      };

      try {
        const dir = path.dirname(DISK_FILE);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(DISK_FILE, JSON.stringify(snapshot, null, 2), "utf8");
      } catch {
        // ignore disk write failures (e.g. read-only env)
      }

      return snapshot;
    })();

    // Always clear the lock (success or failure).
    recomputeInFlight.finally(() => {
      recomputeInFlight = null;
    });
  }

  const snapshot = await recomputeInFlight;
  return NextResponse.json(snapshot, {
    headers: { "Cache-Control": "public, max-age=600" },
  });
}

