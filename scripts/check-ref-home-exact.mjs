import fs from "fs";
import path from "path";

const SOURCE_URL = "https://ww8.123moviesfree.net/home/";

function normalizeTitleKey(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[\\u2019']/g, "'")
    .replace(/[^a-z0-9\\s]/g, " ")
    .replace(/\\s+/g, " ")
    .trim();
}

function extractSectionHtml(html, sectionTitle) {
  const marker = `<div class="fs-6 list-title">${sectionTitle}</div>`;
  const start = html.indexOf(marker);
  if (start === -1) return "";
  const after = html.slice(start + marker.length);
  const next = after.indexOf(`<div class="fs-6 list-title">`);
  return next === -1 ? after : after.slice(0, next);
}

function extractAltTitles(sectionHtml) {
  // alt="Some Title"
  const re = /alt=(?:"([^"]+)"|'([^']+)'|([^\\s>]+))/gi;
  const titles = [];
  const seen = new Set();
  let m;
  while ((m = re.exec(sectionHtml))) {
    const t = (m[1] || m[2] || m[3] || "").trim();
    if (!t) continue;
    const key = normalizeTitleKey(t);
    if (!key) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    titles.push(t);
    if (titles.length >= 60) break;
  }
  return titles;
}

function loadLocalMovieNormalizedTitleSet() {
  const scriptsDir = path.join(process.cwd(), "scripts");
  const batchFiles = fs
    .readdirSync(scriptsDir)
    .filter((f) => f.startsWith("batch-") && f.endsWith("-results.json"));

  const set = new Set();
  for (const file of batchFiles) {
    const full = path.join(scriptsDir, file);
    const arr = JSON.parse(fs.readFileSync(full, "utf8"));
    for (const m of arr) {
      if (!m?.title) continue;
      const nt = normalizeTitleKey(m.title);
      if (nt) set.add(nt);
    }
  }
  return set;
}

function checkMissing(refTitles, localSet) {
  const matched = [];
  const missing = [];
  for (const t of refTitles) {
    const nt = normalizeTitleKey(t);
    if (!nt) continue;
    if (localSet.has(nt)) matched.push(t);
    else missing.push(t);
  }
  return { matched, missing };
}

const html = await fetch(SOURCE_URL, {
  cache: "no-store",
  headers: { "User-Agent": "movies-site-bot/1.0", Accept: "text/html" },
}).then((r) => {
  if (!r.ok) throw new Error(`Fetch failed: ${r.status}`);
  return r.text();
});

const refSuggestions = extractAltTitles(extractSectionHtml(html, "Suggestions"));
const refLatestMovies = extractAltTitles(extractSectionHtml(html, "Latest Movies"));

const localSet = loadLocalMovieNormalizedTitleSet();

const s = checkMissing(refSuggestions, localSet);
const l = checkMissing(refLatestMovies, localSet);

console.log("Reference SOURCE:", SOURCE_URL);
console.log("Suggestions titles:", refSuggestions.length);
console.log("Suggestions matched (exact normalized):", s.matched.length);
console.log("Suggestions missing (exact normalized):", s.missing.length);
if (s.missing.length) console.log("Suggestions missing list:", s.missing.join(" | "));

console.log("\nLatest Movies titles:", refLatestMovies.length);
console.log("Latest Movies matched (exact normalized):", l.matched.length);
console.log("Latest Movies missing (exact normalized):", l.missing.length);
if (l.missing.length) console.log("Latest Movies missing list:", l.missing.join(" | "));

