# Homepage Snapshot (Recent Add) Flow

This document explains the complete “homepage recent” flow currently used in this project: how we fetch *recently added* items from our source, how we build a saved snapshot, and how the homepage serves it to users.

## Key goal

- Homepage should show **32 movies** (2 sections × 16 each) that are **recently added to our source**.
- Homepage should show **16 TV series** that are **recent** (by TV DB sorting).
- Homepage should be fast: serve a **pre-saved snapshot** (`homeSnapshot.json`) to users.

## Definitions

- **Recent added (movies)**: determined by **VidSrc `time_added`**, not by TMDB release date.
- **Snapshot**: a JSON file committed to the repo and served to users to avoid slow API calls on every homepage request.

## Data sources and files

### 1) VidSrc latest movies (our “recent” source)

- File: `app/data/vidsrcLatestMovies.ts`
- Produced by: `scripts/daily-sync.js` (command: `npm run sync:recent`)
- Contains a list of objects like:
  - `imdb_id`
  - `title`
  - `time_added` (this is what we use to define “recent added”)

### 2) Server movie cache (fast mapping for posters/details)

- File: `app/lib/serverMovieCache.ts`
- Purpose:
  - Reads our generated movie dataset from `scripts/batch-*-results.json`
  - Builds an in-memory cache:
    - `allMovies` (normalized movie objects)
    - `byImdbId` map for fast `imdb_id -> movie` lookup
  - Auto-refresh logic:
    - Rebuilds when batch file fingerprint changes (mtime/size)
    - TTL for cache reuse

### 3) Movies “latest” API (homepage uses this to build snapshot)

- Route: `app/api/movies/latest/route.ts`
- Endpoint: `/api/movies/latest?category=...&limit=...`
- Behavior (important categories):
  - **`category=latest`**
    - Sorts `VID_SRC_LATEST_MOVIES` by `time_added` desc
    - Takes only a limited number of candidate IDs (to avoid heavy work)
    - Maps those IDs to full movie objects using `serverMovieCache.byImdbId`
    - Falls back to `allMovies` if VidSrc list is empty/unmapped
  - **`category=suggestions`**
    - Same as above: for homepage, it is also “recent added” from VidSrc
    - Falls back to `allMovies` if needed

### 4) Saved mapping (IDs list; “save wala page”)

- Route: `app/api/reference/home-mapped/route.ts`
- Endpoint: `/api/reference/home-mapped` (supports `?refresh=1`)
- Disk file: `app/data/referenceHomeMapped.json`
- Current behavior:
  - Generates `suggestionsImdbIds` and `latestMoviesImdbIds` from `VID_SRC_LATEST_MOVIES` ordered by `time_added`
  - This file is used by the snapshot builder to reorder pools (when needed)

### 5) Snapshot builder API (writes `homeSnapshot.json`)

- Route: `app/api/home/snapshot/route.ts`
- Endpoint: `/api/home/snapshot`
  - Use `?force=1` to force recompute and write the snapshot.
- Disk snapshot file: `app/data/homeSnapshot.json`
- Important fix:
  - `force=1` now **always recomputes** (does not early-return old snapshot).

#### What snapshot builder fetches

It builds the homepage snapshot by fetching:

- Suggestions pool:
  - `/api/movies/latest?category=suggestions&limit=16`
- Latest movies pool:
  - `/api/movies/latest?category=latest&limit=32`
  - then it removes duplicates already used in Suggestions
  - final “Latest Movies” section becomes **16 unique movies**
- TV series pool:
  - `/api/tv-series-db?limit=32&skip=0&sortBy=first_air_date&sortOrder=desc`
  - then it picks the best renderable items to get **16** for homepage

#### Snapshot output shape

`app/data/homeSnapshot.json` contains:

- `generatedAt`
- `suggestions` (16 movies)
- `latestMovies` (16 movies, deduped vs suggestions)
- `homeLatestTvSeries` (16 series)
- `referenceFetchedAt` (to detect mapping changes)

### 6) Homepage UI (serves saved snapshot)

- Page: `app/home/page.tsx`
- It imports and uses:
  - `import homeSnapshot from "@/data/homeSnapshot.json";`
- On initial load it makes **0 API calls** for movies/TV on homepage (movies mode uses snapshot directly).
- Result on homepage (Movies mode):
  - `Suggestions`: 16 movies
  - `Latest Movies`: 16 movies
  - Total: **32 movies**

## Operational workflow (what to run when new additions arrive)

### A) Fetch new “recent added” from source

Run:

```bash
npm run sync:recent
```

This updates:
- `app/data/vidsrcLatestMovies.ts`

You’ll see output like:
- `Movies synced: ... total, ... new candidates`

### B) Regenerate homepage snapshot (saved server-side)

Run:

```bash
npm run home:snapshot:update -- --base=http://127.0.0.1:3001
```

Notes:
- Use the correct base/port for your running dev server.
- This calls `/api/home/snapshot?force=1` internally and rewrites:
  - `app/data/homeSnapshot.json`

### C) Commit + push

Commit and push updated files so production serves the latest snapshot:
- `app/data/vidsrcLatestMovies.ts` (if changed)
- `app/data/homeSnapshot.json`
- any logic changes you made

## Why “same movies” might appear

Common reasons:

- You did not run `sync:recent`, so VidSrc data didn’t change.
- You did not regenerate the snapshot, so `homeSnapshot.json` stayed the same.
- Snapshot recompute was blocked before; now fixed (force recompute always rebuilds).

## Production note (Vercel)

Vercel runtime filesystem is not meant for persistent writes. Therefore:

- The correct production approach is:
  - generate `homeSnapshot.json` locally (or in CI),
  - commit/push,
  - deploy.

