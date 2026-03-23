import fs from "fs";
import path from "path";

export type RefMovie = {
  title: string;
  href: string;
  poster: string | null;
  badge: string | null;
};

export type RefHomeDiskPayload = {
  source: string;
  fetchedAt: string;
  suggestions: RefMovie[];
  latestMovies: RefMovie[];
  latestTvSeries: RefMovie[];
};

export const REFERENCE_HOME_SOURCE_URL = "https://ww8.123moviesfree.net/home/";

const DISK_PATH = path.join(process.cwd(), "app", "data", "referenceHomeSnapshot.json");

export function getReferenceHomeSnapshotPath(): string {
  return DISK_PATH;
}

export function extractSection(html: string, title: string): string {
  const marker = `<div class="fs-6 list-title">${title}</div>`;
  const start = html.indexOf(marker);
  if (start === -1) return "";
  const after = html.slice(start + marker.length);
  const next = after.indexOf(`<div class="fs-6 list-title">`);
  return next === -1 ? after : after.slice(0, next);
}

export function parseReferenceItems(sectionHtml: string): RefMovie[] {
  const items: RefMovie[] = [];
  const linkRe = /<a\b([^>]*\bposter\b[^>]*)>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = linkRe.exec(sectionHtml))) {
    const attrs = m[1] || "";
    const inner = m[2] || "";
    const href =
      attrs.match(/\bhref=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/i)?.[1] ??
      attrs.match(/\bhref=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/i)?.[2] ??
      attrs.match(/\bhref=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/i)?.[3] ??
      "";
    if (!href) continue;

    const alt =
      inner.match(/alt=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/i)?.[1] ??
      inner.match(/alt=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/i)?.[2] ??
      inner.match(/alt=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/i)?.[3] ??
      null;
    const h2 = inner.match(/<h2[^>]*>\s*([^<]+)\s*<\/h2>/i)?.[1] ?? null;
    const title = (alt || h2 || "").trim();
    if (!title) continue;

    const poster =
      inner.match(/data-src=(?:"([^"]+\.(?:jpg|jpeg|png|webp))"|'([^']+\.(?:jpg|jpeg|png|webp))'|([^\s>]+\.(?:jpg|jpeg|png|webp)))/i)?.[1] ??
      inner.match(/data-src=(?:"([^"]+\.(?:jpg|jpeg|png|webp))"|'([^']+\.(?:jpg|jpeg|png|webp))'|([^\s>]+\.(?:jpg|jpeg|png|webp)))/i)?.[2] ??
      inner.match(/data-src=(?:"([^"]+\.(?:jpg|jpeg|png|webp))"|'([^']+\.(?:jpg|jpeg|png|webp))'|([^\s>]+\.(?:jpg|jpeg|png|webp)))/i)?.[3] ??
      inner.match(/<img[^>]+src=(?:"([^"]+\.(?:jpg|jpeg|png|webp))"|'([^']+\.(?:jpg|jpeg|png|webp))'|([^\s>]+\.(?:jpg|jpeg|png|webp)))/i)?.[1] ??
      null;

    const badge =
      inner.match(/<span class="mlbq">\s*([^<\s]+)\s*<\/span>/i)?.[1] ??
      (inner.match(/<span class="mlbe">\s*Eps<i>\s*(\d+)\s*<\/i>\s*<\/span>/i)?.[1]
        ? `Eps${inner.match(/<span class="mlbe">\s*Eps<i>\s*(\d+)\s*<\/i>\s*<\/span>/i)?.[1]}`
        : null);

    items.push({ title, href, poster, badge });
  }

  const seen = new Set<string>();
  return items.filter((it) => {
    const key = it.title.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function buildReferenceHomePayloadFromHtml(html: string): RefHomeDiskPayload {
  const suggestionsHtml = extractSection(html, "Suggestions");
  const latestMoviesHtml = extractSection(html, "Latest Movies");
  const latestTvHtml = extractSection(html, "Latest TV-Series");

  return {
    source: REFERENCE_HOME_SOURCE_URL,
    fetchedAt: new Date().toISOString(),
    suggestions: parseReferenceItems(suggestionsHtml).slice(0, 60),
    latestMovies: parseReferenceItems(latestMoviesHtml).slice(0, 60),
    latestTvSeries: parseReferenceItems(latestTvHtml).slice(0, 60),
  };
}

export function readReferenceHomeSnapshot(): RefHomeDiskPayload | null {
  try {
    if (!fs.existsSync(DISK_PATH)) return null;
    const raw = fs.readFileSync(DISK_PATH, "utf8");
    const data = JSON.parse(raw) as RefHomeDiskPayload;
    if (!data || typeof data !== "object") return null;
    if (!Array.isArray(data.suggestions)) data.suggestions = [];
    if (!Array.isArray(data.latestMovies)) data.latestMovies = [];
    if (!Array.isArray(data.latestTvSeries)) data.latestTvSeries = [];
    return data;
  } catch {
    return null;
  }
}

/** True if snapshot has no usable rows (first run / cleared file). */
export function isSnapshotEmpty(data: RefHomeDiskPayload | null): boolean {
  if (!data) return true;
  const n =
    (data.suggestions?.length || 0) +
    (data.latestMovies?.length || 0) +
    (data.latestTvSeries?.length || 0);
  return n === 0;
}

export function writeReferenceHomeSnapshot(data: RefHomeDiskPayload): void {
  try {
    const dir = path.dirname(DISK_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DISK_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (e) {
    console.error("writeReferenceHomeSnapshot:", e);
  }
}
