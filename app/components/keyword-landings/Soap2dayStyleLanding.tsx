import Link from "next/link";
import { Suspense } from "react";
import StructuredData from "@/components/StructuredData";
import LandingMovieThumbnails from "./LandingMovieThumbnails";
import type { KeywordLandingProps } from "./types";

const TEAL = "#5fd4cf";
const PAGE = "#f0f4f8";

const thumbFallback = <div className="mt-4 h-48 w-full animate-pulse rounded bg-neutral-100" aria-hidden />;

export default function Soap2dayStyleLanding({ keyword, description, content }: KeywordLandingProps) {
  return (
    <>
      <StructuredData type="website" />
      <div className="min-h-screen font-sans" style={{ backgroundColor: PAGE }}>
        <div className="mx-auto max-w-xl px-4 py-12 text-center sm:px-6 md:py-16">
          <div className="text-3xl font-black md:text-4xl" style={{ color: TEAL }}>
            🎬 {keyword}
          </div>
          <p className="mt-3 text-sm text-gray-600">{description}</p>

          <p className="mt-6 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[10px] font-bold tracking-wide text-gray-600">
            <Link href="/home" className="hover:text-black">
              HOME
            </Link>
            <span className="text-gray-300">·</span>
            <Link href="/movies" className="hover:text-black">
              MOVIES
            </Link>
            <span className="text-gray-300">·</span>
            <Link href="/series" className="hover:text-black">
              TV SHOWS
            </Link>
            <span className="text-gray-300">·</span>
            <Link href="/genres" className="hover:text-black">
              GENRES
            </Link>
          </p>

          <Link
            href="/search"
            className="mx-auto mt-8 flex min-h-[52px] w-full items-stretch overflow-hidden rounded-xl border-[5px] bg-white text-left shadow-md transition-opacity hover:opacity-95"
            style={{ borderColor: TEAL }}
          >
            <span className="flex flex-1 items-center px-5 text-sm text-gray-500">Search movies and TV shows...</span>
            <span className="flex items-center px-4 text-gray-500" aria-hidden>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </Link>

          <Link
            href="/movies"
            className="mt-6 inline-block rounded-full px-10 py-3 text-sm font-bold text-white shadow-md"
            style={{ backgroundColor: TEAL }}
          >
            Enter to {keyword} &gt;&gt;
          </Link>

          <div className="mt-6 flex justify-center gap-2">
            {["#1da1f2", "#1877f2", "#ff4500", "#333"].map((c, i) => (
              <span key={i} className="h-9 w-9 rounded-full shadow" style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>

        <main className="mx-auto max-w-[800px] px-4 pb-20 sm:px-6">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <p className="text-xs font-bold text-gray-500">Preview — filters (UI sample)</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Sort by", "Genre", "Year", "IMDb"].map((x) => (
                <span
                  key={x}
                  className="rounded border px-3 py-1 text-xs font-semibold text-gray-700"
                  style={{ borderColor: TEAL, color: "#334155" }}
                >
                  {x} ▾
                </span>
              ))}
            </div>
            <div className="mt-4">
              <Suspense fallback={thumbFallback}>
                <LandingMovieThumbnails
                  count={8}
                  className="mx-auto mt-0 w-full max-w-none"
                  gridClassName="grid grid-cols-4 gap-2"
                />
              </Suspense>
            </div>
          </div>

          <div className="mt-12 space-y-10 text-[15px] leading-relaxed text-gray-700">
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <span>🔍</span> Advanced search on {keyword}
              </h2>
              {content.intro.map((p, i) => (
                <p key={i} className="mt-3">
                  {p}
                </p>
              ))}
            </section>

            {content.sections.map((section, idx) => (
              <section key={section.title}>
                <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  <span>{idx === 0 ? "🤖" : idx === 1 ? "📣" : "📌"}</span>
                  {section.title}
                </h2>
                {section.paragraphs.map((para, j) => (
                  <p key={j} className="mt-3">
                    {para}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </main>

        <footer className="bg-[#1a1a1a] py-12 text-gray-400">
          <div className="mx-auto grid max-w-5xl gap-8 px-4 sm:grid-cols-3">
            <div>
              <h3 className="font-bold text-white">Info</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>About</li>
                <li>Privacy</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white">Genres</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>Horror</li>
                <li>Drama</li>
                <li>Animation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white">{keyword}</h3>
              <p className="mt-3 text-sm">Follow updates — browse our movie &amp; series index.</p>
            </div>
          </div>
          <div className="mx-auto mt-10 max-w-5xl px-4 text-center text-2xl font-black" style={{ color: TEAL }}>
            🎬 {keyword}
          </div>
          <p className="mt-6 text-center text-xs text-gray-600">
            © {new Date().getFullYear()} · {keyword} · watch movies online
          </p>
        </footer>
      </div>
    </>
  );
}
