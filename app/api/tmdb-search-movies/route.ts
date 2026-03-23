import { NextRequest, NextResponse } from "next/server";
import { getCachedMoviesData } from "@/lib/serverMovieCache";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    if (query.trim().length < 2) {
      return NextResponse.json({
        success: true,
        data: [],
        pagination: {
          page: Math.max(1, page),
          limit: Math.max(1, limit),
          totalResults: 0,
          totalPages: 0
        }
      });
    }

    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, Math.min(100, limit));
    const skip = (safePage - 1) * safeLimit;

    const moviesData = getCachedMoviesData();
    if (!moviesData.available) {
      return NextResponse.json({
        success: true,
        data: [],
        pagination: {
          page: safePage,
          limit: safeLimit,
          totalResults: 0,
          totalPages: 0,
        },
        message: moviesData.message || "Movie data not available yet",
      });
    }

    const q = query.trim().toLowerCase();
    const filtered = moviesData.allMovies.filter((movie: any) => {
      const title = (movie.title || "").toLowerCase();
      const overview = (movie.overview || "").toLowerCase();
      const imdb = (movie.imdb_id || "").toLowerCase();
      return title.includes(q) || overview.includes(q) || imdb.includes(q);
    });

    const totalResults = filtered.length;
    const totalPages = Math.ceil(totalResults / safeLimit);
    const slice = filtered.slice(skip, skip + safeLimit);

    return NextResponse.json({
      success: true,
      data: slice,
      pagination: {
        page: safePage,
        limit: safeLimit,
        totalResults,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error in /api/tmdb-search-movies:", error);
    return NextResponse.json(
      { success: false, error: "Failed to search movies" },
      { status: 500 }
    );
  }
}

