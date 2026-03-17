import { NextResponse } from "next/server";

type RefMovie = {
  title: string;
  href: string;
  poster: string | null;
  badge: string | null; // HD/CAM/EpsX/TV
};

type RefHomePayload = {
  source: string;
  fetchedAt: string;
  suggestions: RefMovie[];
  latestMovies: RefMovie[];
  latestTvSeries: RefMovie[];
};

const SOURCE_URL = "https://ww8.123moviesfree.net/home/";

let cache: { at: number; data: RefHomePayload } | null = null;
const TTL_MS = 10 * 60 * 1000; // 10 minutes

function extractSection(html: string, title: string): string | null {
  const marker = `<div class="fs-6 list-title">${title}</div>`;
  const start = html.indexOf(marker);
  if (start === -1) return null;
  const after = html.slice(start + marker.length);
  // Next section marker
  const next = after.indexOf(`<div class="fs-6 list-title">`);
  return next === -1 ? after : after.slice(0, next);
}

function parseItems(sectionHtml: string): RefMovie[] {
  const items: RefMovie[] = [];

  // Capture cards. Title is usually in alt="" or inside <h2 ...>Title</h2>
  const linkRe = /<a\s+href="([^"]+)"[^>]*class="[^"]*\bposter\b[^"]*"[^>]*>([\s\S]*?)<\/a>/g;
  let m: RegExpExecArray | null;
  while ((m = linkRe.exec(sectionHtml))) {
    const href = m[1];
    const inner = m[2] || "";

    const alt = inner.match(/alt="([^"]+)"/i)?.[1] ?? null;
    const h2 = inner.match(/<h2[^>]*>\s*([^<]+)\s*<\/h2>/i)?.[1] ?? null;
    const title = (alt || h2 || "").trim();
    if (!title) continue;

    const poster =
      inner.match(/data-src="([^"]+\.(?:jpg|jpeg|png|webp))"/i)?.[1] ??
      inner.match(/<img[^>]+src="([^"]+\.(?:jpg|jpeg|png|webp))"/i)?.[1] ??
      null;

    const badge =
      inner.match(/<span class="mlbq">\s*([^<\s]+)\s*<\/span>/i)?.[1] ??
      inner.match(/<span class="mlbe">\s*Eps<i>\s*(\d+)\s*<\/i>\s*<\/span>/i)?.[1]?.trim()
        ? `Eps${inner.match(/<span class="mlbe">\s*Eps<i>\s*(\d+)\s*<\/i>\s*<\/span>/i)?.[1]}`
        : null;

    items.push({ title, href, poster, badge });
  }

  // Dedup by title keeping order
  const seen = new Set<string>();
  return items.filter((it) => {
    const key = it.title.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function GET() {
  try {
    if (cache && Date.now() - cache.at < TTL_MS) {
      return NextResponse.json(cache.data, {
        headers: { "Cache-Control": "public, max-age=300" },
      });
    }

    const res = await fetch(SOURCE_URL, {
      // avoid edge caching oddities
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

    const suggestionsHtml = extractSection(html, "Suggestions") || "";
    const latestMoviesHtml = extractSection(html, "Latest Movies") || "";
    const latestTvHtml = extractSection(html, "Latest TV-Series") || "";

    const data: RefHomePayload = {
      source: SOURCE_URL,
      fetchedAt: new Date().toISOString(),
      suggestions: parseItems(suggestionsHtml).slice(0, 60),
      latestMovies: parseItems(latestMoviesHtml).slice(0, 60),
      latestTvSeries: parseItems(latestTvHtml).slice(0, 60),
    };

    cache = { at: Date.now(), data };
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, max-age=300" },
    });
  } catch (e) {
    console.error("Error in /api/reference/home:", e);
    return NextResponse.json({ error: "Failed to load reference home" }, { status: 500 });
  }
}

