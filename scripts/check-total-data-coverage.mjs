import fs from "fs";
import path from "path";

const SOURCE_URL = "https://ww8.123moviesfree.net/home/";

function norm(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[\u2019']/g, "'")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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

function countMatches(titles, set) {
  let c = 0;
  for (const t of titles) {
    if (set.has(norm(t))) c++;
  }
  return c;
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

const movieTitleSet = new Set();
let totalMovieRows = 0;
for (const file of batchFiles) {
  const arr = JSON.parse(fs.readFileSync(path.join(scriptsDir, file), "utf8"));
  totalMovieRows += arr.length;
  for (const m of arr) {
    const t = norm(m?.title);
    if (t) movieTitleSet.add(t);
  }
}

let store = {};
try {
  store = JSON.parse(fs.readFileSync(path.join(scriptsDir, "tv-series-details.json"), "utf8"));
} catch {}
const tvNameSet = new Set();
for (const s of Object.values(store)) {
  const t = norm(s?.name);
  if (t && !t.startsWith("tv series tt")) tvNameSet.add(t);
}

const sugMatched = countMatches(suggestions, movieTitleSet);
const latestMatched = countMatches(latestMovies, movieTitleSet);
const tvMatched = countMatches(latestTv, tvNameSet);

console.log("Local total movie rows:", totalMovieRows);
console.log("Local unique movie titles:", movieTitleSet.size);
console.log("Local unique TV names:", tvNameSet.size);
console.log("");
console.log("Reference Suggestions:", suggestions.length, "matched in total movie data:", sugMatched);
console.log("Reference Latest Movies:", latestMovies.length, "matched in total movie data:", latestMatched);
console.log("Reference Latest TV-Series:", latestTv.length, "matched in total TV data:", tvMatched);
console.log("");
console.log(
  "Reference movie total (Suggestions+Latest):",
  suggestions.length + latestMovies.length,
  "matched:",
  sugMatched + latestMatched
);
