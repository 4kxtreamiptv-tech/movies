import Link from "next/link";
import { Suspense } from "react";
import StructuredData from "@/components/StructuredData";
import LandingMovieThumbnails from "./LandingMovieThumbnails";
import type { KeywordLandingProps } from "./types";

const NAVY = "#0d253f";
const BLUE = "#3b82f6";

const gridFallback = <div className="mt-4 h-64 w-full animate-pulse rounded bg-neutral-100" aria-hidden />;

export default function SolarmovieStyleLanding({ keyword, description, content }: KeywordLandingProps) {
  const picks = [
    { rank: 1, title: "Featured pick", type: "Movie", rating: "8.1" },
    { rank: 2, title: "Trending drama", type: "TV Series", rating: "7.6" },
    { rank: 3, title: "Action night", type: "Movie", rating: "7.9" },
    { rank: 4, title: "Binge bundle", type: "TV Series", rating: "8.0" },
    { rank: 5, title: "Family watch", type: "Movie", rating: "7.2" },
    { rank: 6, title: "Sci‑fi hub", type: "TV Series", rating: "7.8" },
  ];

  return (
    <>
      <StructuredData type="website" />
      <div className="min-h-screen bg-white font-sans text-[#111]">
        <div className="mx-auto max-w-[1200px] px-4 pb-8 pt-6 sm:px-6 sm:pt-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-lg font-bold text-[#0d253f]">{keyword}</p>
            <Link
              href="/search"
              className="flex w-full max-w-md items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-500 shadow-sm transition-colors hover:border-gray-300 sm:ml-auto sm:w-auto"
            >
              <span className="shrink-0 text-gray-400" aria-hidden>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <span className="truncate">Search for Movies and Series...</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
            <div className="relative overflow-hidden rounded-xl bg-neutral-900">
              <div className="relative aspect-[21/9] w-full bg-gradient-to-br from-slate-700 via-slate-900 to-slate-950">
                <div className="absolute bottom-4 left-4 max-w-md rounded-lg bg-black/70 p-4 text-white backdrop-blur-sm">
                  <p className="text-xl font-bold">Spotlight title</p>
                  <p className="mt-2 text-sm text-white/85">{description}</p>
                  <div className="mt-3 flex gap-2 text-xs">
                    <span className="rounded bg-white/20 px-2 py-0.5">Movie</span>
                    <span className="text-white/70">2025</span>
                  </div>
                </div>
              </div>
            </div>

            <aside className="rounded-xl p-4 text-white lg:sticky lg:top-4" style={{ backgroundColor: NAVY }}>
              <div className="flex items-center gap-2 text-sm font-bold tracking-wide">
                <span style={{ color: BLUE }}>📈</span> QUICK PICKS
              </div>
              <ul className="mt-4 space-y-3">
                {picks.map((p) => (
                  <li key={p.rank} className="flex gap-3 text-sm">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: BLUE }}
                    >
                      {p.rank}
                    </span>
                    <div>
                      <p className="font-semibold text-white">{p.title}</p>
                      <p className="text-xs text-white/60">
                        {p.type} · <span className="text-amber-300">★</span> {p.rating}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </aside>
          </div>

          <section className="mt-12">
            <h2 className="text-lg font-bold text-black">Popular movies &amp; series</h2>
            <Suspense fallback={gridFallback}>
              <LandingMovieThumbnails
                count={16}
                className="mx-auto mt-4 w-full max-w-none"
                gridClassName="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8"
              />
            </Suspense>
          </section>

          <div className="mt-12 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="flex items-center gap-2 font-bold text-black">
              <span className="text-green-600">☰</span> What to watch
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              {content.heading}.{" "}
              <Link href="/movies" className="font-medium" style={{ color: BLUE }}>
                Browse movies
              </Link>{" "}
              or{" "}
              <Link href="/series" className="font-medium" style={{ color: BLUE }}>
                TV series
              </Link>
              . {content.intro[0]?.slice(0, 180)}…
            </p>
          </div>

          <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-700">
            {content.sections.map((section) => (
              <section key={section.title}>
                <h3 className="font-bold text-black">{section.title}</h3>
                {section.paragraphs.map((para, j) => (
                  <p key={j} className="mt-2">
                    {para}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4 border-t border-gray-200 pt-8 text-sm text-gray-500">
            {["About Us", "Disclaimer", "Privacy", "Terms", "DMCA", "Contact"].map((t) => (
              <span key={t} className="cursor-pointer hover:text-black">
                {t}
              </span>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} {keyword} · Informational landing
          </p>
        </div>
      </div>
    </>
  );
}
