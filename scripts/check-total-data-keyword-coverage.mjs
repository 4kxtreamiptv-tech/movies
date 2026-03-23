import fs from "fs";
import path from "path";

const SOURCE_URL = "https://ww8.123moviesfree.net/home/";
const STOP = new Set([
  "the", "a", "an", "and", "of", "to", "in", "on", "for", "with", "at", "by",
  "is", "are", "from", "my", "your", "our", "its", "it", "this", "that", "again",
  "story", "season", "series", "tv"
]);

function norm(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[\u2019']/g, "'")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(s) {
  return norm(s)
    .split(" ")
    .filter((w) => w.length >= 3 && !STOP.has(w));
}

function extractSection(html, title) {
  const marker = `<div class="fs-6 list-title">${title}</div>`;
  const i = html.indexOf(marker);
  if (i < 0) return "";
  const after = html.slice(i + marker.length);
  const j = after.indexOf(`<div class="fs-6 list-title">`);
  return j < 0 ? after : after.slice(0, j);
}

function extractTitles(sectionHtml) {
  const out = [];
  const seen = new Set();
  const re = /alt=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/gi;
  let m;
  while ((m = re.exec(sectionHtml))) {
    const t = (m[1] || m[2] || m[3] || "").trim();
    const k = norm(t);
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(t);
  }
  return out;
}

function keywordHit(refTitle, candidateTitle) {
  const rt = tokens(refTitle);
  const ct = new Set(tokens(candidateTitle));
  if (rt.length === 0 || ct.size === 0) return false;
  let overlap = 0;
  for (const t of rt) if (ct.has(t)) overlap++;
  // Require at least 2 token overlap, or full overlap for short titles.
  if (rt.length <= 2) return overlap === rt.length;
  return overlap >= 2;
}

function countKeywordMatches(refTitles, candidates) {
  let matched = 0;
  for (const rt of refTitles) {
    let ok = false;
    for (const ct of candidates) {
      if (keywordHit(rt, ct)) {
        ok = true;
        break;
      }
    }
    if (ok) matched++;
  }
  return matched;
}

const html = await fetch(SOURCE_URL, {
  cache: "no-store",
  headers: { "User-Agent": "movies-site-bot/1.0", Accept: "text/html" },
}).then((r) => {
  if (!r.ok) throw new Error(`Fetch failed: ${r.status}`);
  return r.text();
});

const suggestions = extractTitles(extractSection(html, "Suggestions"));
const latestMovies = extractTitles(extractSection(html, "Latest Movies"));
const latestTv = extractTitles(extractSection(html, "Latest TV-Series"));

const scriptsDir = path.join(process.cwd(), "scripts");
const batchFiles = fs
  .readdirSync(scriptsDir)
  .filter((f) => f.startsWith("batch-") && f.endsWith("-results.json"));

const movieTitles = [];
for (const file of batchFiles) {
  const arr = JSON.parse(fs.readFileSync(path.join(scriptsDir, file), "utf8"));
  for (const m of arr) if (m?.title) movieTitles.push(m.title);
}

let store = {};
try {
  store = JSON.parse(fs.readFileSync(path.join(scriptsDir, "tv-series-details.json"), "utf8"));
} catch {}
const tvNames = [];
for (const s of Object.values(store)) {
  if (s?.name && !String(s.name).startsWith("TV Series tt")) tvNames.push(s.name);
}

const sugMatched = countKeywordMatches(suggestions, movieTitles);
const latestMatched = countKeywordMatches(latestMovies, movieTitles);
const tvMatched = countKeywordMatches(latestTv, tvNames);

console.log("Keyword-based match check");
console.log("Reference Suggestions:", suggestions.length, "matched:", sugMatched);
console.log("Reference Latest Movies:", latestMovies.length, "matched:", latestMatched);
console.log("Reference Latest TV-Series:", latestTv.length, "matched:", tvMatched);
console.log("Reference movie total:", suggestions.length + latestMovies.length, "matched:", sugMatched + latestMatched);
