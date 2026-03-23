import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const norm = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/[\u2019']/g, "'")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const snapPath = path.join(root, "app", "data", "referenceHomeSnapshot.json");
const snap = JSON.parse(fs.readFileSync(snapPath, "utf8"));
const refTitles = [...(snap.suggestions || []), ...(snap.latestMovies || [])].map((x) => x.title).filter(Boolean);
const refUnique = [...new Set(refTitles.map(norm))].filter(Boolean);

const scriptsDir = path.join(root, "scripts");
const batchFiles = fs
  .readdirSync(scriptsDir)
  .filter((f) => f.startsWith("batch-") && f.endsWith("-results.json"));

const movieNorms = [];
for (const f of batchFiles) {
  const arr = JSON.parse(fs.readFileSync(path.join(scriptsDir, f), "utf8"));
  for (const m of arr) {
    const t = norm(m.title);
    if (t) movieNorms.push(t);
  }
}

function matchKind(rt) {
  for (const mt of movieNorms) {
    if (mt === rt) return "exact";
  }
  for (const mt of movieNorms) {
    if (mt.includes(rt) || rt.includes(mt)) return "fuzzy";
  }
  return null;
}

let exact = 0,
  fuzzy = 0,
  miss = 0;
const missing = [];
for (const rt of refUnique) {
  const h = matchKind(rt);
  if (h === "exact") exact++;
  else if (h === "fuzzy") fuzzy++;
  else {
    miss++;
    missing.push(rt);
  }
}

console.log("Reference snapshot: Suggestions + Latest Movies (unique titles):", refUnique.length);
console.log("Exact match in local batch movies:", exact);
console.log("Fuzzy match (substring) in local batches:", fuzzy);
console.log("Not in local batches:", miss);
console.log("Total covered (exact+fuzzy):", exact + fuzzy);
if (missing.length && missing.length <= 50) {
  console.log("Missing sample:", missing.join(" | "));
}
