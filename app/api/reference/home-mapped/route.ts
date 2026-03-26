import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { VID_SRC_LATEST_MOVIES } from "@/data/vidsrcLatestMovies";

type Payload = {
  source: string;
  fetchedAt: string;
  suggestionsImdbIds: string[];
  latestMoviesImdbIds: string[];
};

let cache: { at: number; data: Payload } | null = null;
// Refresh reference-home mapping at most once per 24 hours
const TTL_MS = 24 * 60 * 60 * 1000;
const LIMIT = 12;
const DISK_FILE = path.join(process.cwd(), "app", "data", "referenceHomeMapped.json");

// We use our local "latest" catalog to decide if stored mapping is still useful.
// If mapping doesn't point to anything we currently have, treat it as stale and refresh from source.
const LOCAL_LATEST_IMDB_SET = new Set(
  VID_SRC_LATEST_MOVIES.map((m) => String(m?.imdb_id || "").trim()).filter(Boolean)
);

function countIntersection(a: string[] | undefined, localSet: Set<string>) {
  if (!Array.isArray(a) || a.length === 0) return 0;
  let c = 0;
  for (const id of a) {
    const t = String(id || "").trim();
    if (t && localSet.has(t)) c++;
  }
  return c;
}

function buildFromVidsrc(limit: number): Payload {
  const sorted = [...(VID_SRC_LATEST_MOVIES || [])].sort((a, b) =>
    String(b.time_added || "").localeCompare(String(a.time_added || ""))
  );

  const ids = sorted
    .map((m) => String(m?.imdb_id || "").trim())
    .filter(Boolean);

  const latestMoviesImdbIds = Array.from(new Set(ids)).slice(0, limit);
  const suggestionsImdbIds = latestMoviesImdbIds.slice(0, limit);

  return {
    source: "vidsrc-latest",
    fetchedAt: new Date().toISOString(),
    suggestionsImdbIds,
    latestMoviesImdbIds,
  };
}

export async function GET(request: Request) {
  let diskDataFallback: Payload | null = null;
  try {
    const { searchParams } = new URL(request.url);

    // Optional: force refresh only when explicitly requested.
    // Default behavior is storage-first to avoid expensive remapping/searching.
    const shouldRefresh =
      process.env.REF_HOME_REFRESH_ON_REQUEST === "1" || searchParams.get("refresh") === "1";

    // 0) Local disk cache (for dev): if file exists, use it and DO NOT re-search.
    try {
      if (!shouldRefresh && fs.existsSync(DISK_FILE)) {
        // Disk file can live long; treat it as stale after TTL_MS.
        const raw = fs.readFileSync(DISK_FILE, "utf8");
        const diskData = JSON.parse(raw) as Payload;
        diskDataFallback = diskData;

        const fetchedAtTs = Number(new Date(diskData?.fetchedAt || 0).getTime());
        const mtimeMs = fs.statSync(DISK_FILE).mtimeMs;
        const diskAgeMs = Number.isFinite(fetchedAtTs) && fetchedAtTs > 0 ? Date.now() - fetchedAtTs : Date.now() - mtimeMs;

        if (diskAgeMs >= 0 && diskAgeMs < TTL_MS) {
          // If disk mapping has NO overlap with our local latest catalog,
          // assume source changed and re-map (avoid showing totally unrelated items).
          const overlap =
            countIntersection(diskData?.latestMoviesImdbIds, LOCAL_LATEST_IMDB_SET) +
            countIntersection(diskData?.suggestionsImdbIds, LOCAL_LATEST_IMDB_SET);

          if (overlap > 0) {
            return NextResponse.json(diskData, {
              headers: { "Cache-Control": "public, max-age=86400" },
            });
          }
        }
      }
    } catch {
      // ignore disk errors; we'll fall back to in-memory / live fetch
    }

    if (!shouldRefresh && cache && Date.now() - cache.at < TTL_MS) {
      return NextResponse.json(cache.data, {
        headers: { "Cache-Control": "public, max-age=86400" },
      });
    }

    if (!shouldRefresh && !fs.existsSync(DISK_FILE)) {
      return NextResponse.json(
        {
          error: "Stored mapping not found",
          suggestionsImdbIds: [],
          latestMoviesImdbIds: [],
        },
        { status: 404 }
      );
    }
    const data: Payload = buildFromVidsrc(LIMIT);

    cache = { at: Date.now(), data };

    // 2) Best-effort: write result to disk (for local dev). On Vercel this will just fail silently.
    try {
      const dir = path.dirname(DISK_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(DISK_FILE, JSON.stringify(data, null, 2), "utf8");
    } catch {
      // ignore write failures
    }
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, max-age=600" },
    });
  } catch (e) {
    console.error("Error in /api/reference/home-mapped:", e);
    if (diskDataFallback) {
      return NextResponse.json(diskDataFallback, {
        headers: { "Cache-Control": "public, max-age=300" },
      });
    }
    return NextResponse.json({ error: "Failed to map reference home" }, { status: 500 });
  }
}

