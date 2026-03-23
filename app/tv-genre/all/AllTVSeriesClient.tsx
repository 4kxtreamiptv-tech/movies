"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getTVImageUrl } from "@/api/tmdb-tv";

function createSeriesSlug(name: string, id: string | number): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${slug}-${id}`;
}

export default function AllTVSeriesClient() {
  const [series, setSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const LIMIT = 20;

  const fetchSeries = async (skip: number, append: boolean) => {
    const targetLoadingSetter = append ? setLoadingMore : setLoading;
    targetLoadingSetter(true);
    try {
      const response = await fetch(
        `/api/tv-series-db?limit=${LIMIT}&skip=${skip}&sortBy=first_air_date&sortOrder=desc`
      );
      const result = await response.json();

      if (result?.success && Array.isArray(result.data)) {
        const mapped = result.data.map((item: any) => ({
          id: item.tmdb_id || item.imdb_id || `${item.name}-${Math.random()}`,
          name: item.name || `TV Series ${item.imdb_id || item.tmdb_id || ""}`,
          poster_path: item.poster_path || null,
          first_air_date: item.first_air_date || null,
          number_of_seasons: item.number_of_seasons || item.seasons?.length || 0,
          episode_count:
            item.seasons?.reduce(
              (sum: number, season: any) => sum + (season?.episodes?.length || 0),
              0
            ) || 0,
          imdb_id: item.imdb_id,
          tmdb_id: item.tmdb_id,
        }));

        setSeries((prev) => (append ? [...prev, ...mapped] : mapped));
        const totalCount = Number(result.total || 0);
        setTotal(totalCount);
        setHasMore(skip + mapped.length < totalCount);
      } else {
        if (!append) setSeries([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading all TV series:", error);
      if (!append) setSeries([]);
      setHasMore(false);
    } finally {
      targetLoadingSetter(false);
    }
  };

  useEffect(() => {
    void fetchSeries(0, false);
  }, []);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    await fetchSeries(series.length, true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/series" className="text-purple-400 hover:text-purple-300">
              ← Back to Featured Series
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">All TV Series</h1>
          <p className="text-gray-400">
            {loading
              ? "Loading TV series..."
              : `Showing ${series.length.toLocaleString()} of ${total.toLocaleString()} TV shows`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: LIMIT }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-gray-800 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {series.map((item, index) => (
                <Link
                  key={`${item.id}-${index}`}
                  href={`/${createSeriesSlug(item.name, item.tmdb_id || item.imdb_id || item.id)}`}
                  className="group"
                >
                  <div className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all duration-200">
                    <div className="relative aspect-[2/3] bg-gray-700">
                      <Image
                        src={item.poster_path ? getTVImageUrl(item.poster_path, "w500") : "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {item.episode_count} eps
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1 group-hover:text-purple-400 transition-colors">
                        {item.name}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{item.first_air_date?.split("-")[0] || "N/A"}</span>
                        <span>
                          📺 {item.number_of_seasons || 1} Season
                          {(item.number_of_seasons || 1) !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={() => void loadMore()}
                  disabled={loadingMore}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg"
                >
                  {loadingMore
                    ? "Loading..."
                    : `Load More (${Math.max(0, total - series.length)} remaining)`}
                </button>
              </div>
            )}

            {!hasMore && series.length > 0 && (
              <div className="text-center mt-8">
                <p className="text-gray-400">No more TV series to load</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

