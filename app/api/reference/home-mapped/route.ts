import { NextResponse } from "next/server";
import { searchMoviesByTitle } from "@/api/tmdb";
import fs from "fs";
import path from "path";

type Payload = {
  source: string;
  fetchedAt: string;
  suggestionsImdbIds: string[];
  latestMoviesImdbIds: string[];
};

const SOURCE_URL = "https://ww8.123moviesfree.net/home/";

let cache: { at: number; data: Payload } | null = null;
// Cache reference homepage mapping for 7 days in-memory
const TTL_MS = 7 * 24 * 60 * 60 * 1000;
const LIMIT = 12;
const DISK_FILE = path.join(process.cwd(), "app", "data", "referenceHomeMapped.json");

function extractTitles(html: string, sectionTitle: string, limit: number): string[] {
  const marker = `<div class="fs-6 list-title">${sectionTitle}</div>`;
  const start = html.indexOf(marker);
  if (start === -1) return [];
  const after = html.slice(start + marker.length);
  const next = after.indexOf(`<div class="fs-6 list-title">`);
  const sectionHtml = next === -1 ? after : after.slice(0, next);

  const titles: string[] = [];
  const altRe = /alt="([^"]+)"/gi;
  let m: RegExpExecArray | null;
  while ((m = altRe.exec(sectionHtml))) {
    const title = (m[1] || "").trim();
    if (!title) continue;
    if (!titles.includes(title)) titles.push(title);
    if (titles.length >= limit) break;
  }
  return titles;
}

async function mapTitlesToImdbIds(titles: string[]): Promise<string[]> {
  const concurrency = 4;
  const out = new Array<string | null>(titles.length).fill(null);
  let idx = 0;

  const worker = async () => {
    while (idx < titles.length) {
      const myIdx = idx++;
      const title = titles[myIdx];
      try {
        const r = await searchMoviesByTitle(title, 1);
        const imdb = r?.[0]?.imdb_id;
        if (imdb && typeof imdb === "string" && imdb.trim()) out[myIdx] = imdb;
      } catch {
        // ignore
      }
    }
  };

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  return out.filter((x): x is string => !!x);
}

export async function GET() {
  try {
    // 0) Local disk cache (for dev): if file exists, use it and DO NOT re-search.
    try {
      if (fs.existsSync(DISK_FILE)) {
        const raw = fs.readFileSync(DISK_FILE, "utf8");
        const diskData = JSON.parse(raw) as Payload;
        return NextResponse.json(diskData, {
          headers: { "Cache-Control": "public, max-age=600" },
        });
      }
    } catch {
      // ignore disk errors; we'll fall back to in-memory / live fetch
    }

    if (cache && Date.now() - cache.at < TTL_MS) {
      return NextResponse.json(cache.data, {
        headers: { "Cache-Control": "public, max-age=600" },
      });
    }

    const res = await fetch(SOURCE_URL, {
      cache: "no-store",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; movies-site-bot/1.0; +https://example.invalid)",
        Accept: "text/html",
      },
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch source: ${res.status}` },
        { status: 502 }
      );
    }
    const html = await res.text();

    const suggestionsTitles = extractTitles(html, "Suggestions", LIMIT);
    const latestTitles = extractTitles(html, "Latest Movies", LIMIT);

    const [suggestionsImdbIds, latestMoviesImdbIds] = await Promise.all([
      mapTitlesToImdbIds(suggestionsTitles),
      mapTitlesToImdbIds(latestTitles),
    ]);

    const data: Payload = {
      source: SOURCE_URL,
      fetchedAt: new Date().toISOString(),
      suggestionsImdbIds,
      latestMoviesImdbIds,
    };

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
    return NextResponse.json(
      { error: "Failed to map reference home" },
      { status: 500 }
    );
  }
}

