# RECENT_SYNC_EXPORT.md

Single-file export of this repo's **recent data sync + homepage latest content** system, ready to replicate in another Next.js project.

---

## 1) Goal (what this system does)

- Pulls **recently added movies** from source API.
- Stores them in local data file: `app/data/vidsrcLatestMovies.ts`.
- Syncs TV IDs into `app/data/tvSeriesIds.ts`.
- Homepage shows latest movies/TV quickly with fast-first render strategy.
- Prevents repeated TV entries across categories (Latest / Popular / Featured).

---

## 2) Core files used

- `scripts/daily-sync.js`
- `package.json` scripts
- `app/data/vidsrcLatestMovies.ts` (generated)
- `app/data/tvSeriesIds.ts` (generated)
- `app/api/movies/list/route.ts`
- `app/api/tv-series-db/route.ts`
- `app/home/page.tsx`

---

## 3) Sync script behavior (`scripts/daily-sync.js`)

### Source endpoints

- Movies pages:
  - `https://vidsrc-embed.ru/movies/latest/page-1.json`
  - `https://vidsrc-embed.ru/movies/latest/page-2.json`
  - ...
- TV ids:
  - `https://vidsrc.me/ids/tv_imdb.txt`

### Features implemented

- `--recent`: only fetch first N pages (fast mode).
- `--pages=<n>`: how many recent pages to check.
- `--batch=<n>`: parallel batch page fetching.
- `--watch=<minutes>`: loop mode.
- `--skip-tv`: movies-only sync.
- Reads existing `vidsrcLatestMovies.ts`, merges/dedupes by `imdb_id`, prefers newer `time_added`.
- Incremental early-stop logic: if a batch has no new data, stops fetching deeper pages.

### Generated file format

- Writes TypeScript export:
  - `export interface VidsrcLatestMovie`
  - `export const VID_SRC_LATEST_MOVIES: VidsrcLatestMovie[] = [...]`

---

## 4) NPM scripts used

Add these scripts in `package.json`:

```json
{
  "scripts": {
    "daily:sync": "node scripts/daily-sync.js",
    "sync:recent": "node scripts/daily-sync.js --recent --pages=6 --batch=5",
    "sync:recent:watch": "node scripts/daily-sync.js --recent --pages=6 --batch=5 --watch=1440",
    "sync:daily:check": "node scripts/daily-sync.js --recent --pages=6 --batch=5"
  }
}
```

Recommended daily manual run:

```bash
npm run sync:daily:check
```

---

## 5) Movies API for homepage (`app/api/movies/list/route.ts`)

Purpose:

- Returns paginated `imdb_ids` from `VID_SRC_LATEST_MOVIES`.
- Supports:
  - `offset`
  - `limit`
  - `order=desc|asc` (desc = latest-first)
- Fallback to `BULK_MOVIE_IDS` if vidsrc list is empty.

Homepage consumes this API to display latest movie rows from recent synced data.

---

## 6) Homepage fast-load strategy (`app/home/page.tsx`)

### Fast first paint

- Introduced fast mode:
  - `FAST_COUNT = 8`
  - `DISPLAY_COUNT = 16`
- Stage-1 quick render:
  - load small suggestions quickly and render immediately.
- Stage-2 background hydrate:
  - full mapping/sorting/load for complete rows.

### Lighter images

- Movie card poster size switched to `w342`.
- TV poster size switched to `w342`.

This reduces first-load payload and improves perceived speed.

---

## 7) TV categories logic (no duplicates)

TV rows are built from one latest-first pool (fast query), then split into unique buckets:

- `Latest TV-Series`
- `Popular TV-Series`
- `Featured TV-Series`

Helpers added in `app/home/page.tsx`:

- `pickRenderableTvSeries(...)`: prefer items with usable metadata/poster.
- `tvUniqKey(...)`: unique identity from id, or normalized `name+year`.
- `pickUniqueTvSeries(...)`: excludes already-used keys to avoid repetition.

This ensures categories do not show the exact same series repeatedly.

---

## 8) Why strict rating filters were removed for TV homepage rows

Previous queries with `minRating=7/8` + high skip caused very slow responses (50s-88s seen in logs).

Now homepage TV rows use a **single latest feed** and unique splitting.

Benefit:

- Much faster API calls.
- Better first-time UX.
- Avoid empty/slow Featured section.

---

## 9) Daily run (local)

Roz 1 dafa run karne ke liye:

```bash
npm run sync:daily:check
```

Phir homepage refresh karke check kar lo ke `Latest Movies` aur `Latest/Popular/Featured TV-Series` latest items se updated hain.

## 10) Kis cheez ko update karta hai

- `app/data/vidsrcLatestMovies.ts` (movies latest list)
- `app/data/tvSeriesIds.ts` (TV ids list)

