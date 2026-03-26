import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import { SearchLinkPill } from "./SearchLinkPill";
import type { KeywordLandingProps } from "./types";

export default function LookmovieStyleLanding({ keyword, description, content }: KeywordLandingProps) {
  const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];
  const socials = [
    { bg: "#1877f2", label: "Facebook", abbr: "f" },
    { bg: "#555555", label: "Email", abbr: "@" },
    { bg: "#e60023", label: "Pinterest", abbr: "P" },
    { bg: "#ff4500", label: "Reddit", abbr: "r" },
    { bg: "#25d366", label: "WhatsApp", abbr: "W" },
  ];

  return (
    <>
      <StructuredData type="website" />
      <div className="min-h-screen bg-[#1a1a1a] font-sans text-white">
        <div className="mx-auto max-w-[720px] px-4 py-10 text-center sm:px-6 md:py-14">
          <div className="mb-4 flex justify-center gap-1 text-xl font-black tracking-tight">
            <span>LOOK</span>
            <span className="rounded bg-red-600 px-2 py-0.5 text-sm text-white">MOVIE</span>
          </div>
          <h1 className="text-lg font-semibold leading-snug text-white md:text-2xl">
            {keyword} Official Website — stream and browse movies &amp; series in multiple qualities.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-400">{description}</p>

          <div className="mx-auto mt-8 max-w-xl">
            <SearchLinkPill placeholder="Search Movies" />
          </div>

          <p className="mt-6 flex flex-wrap justify-center gap-3 text-xs text-gray-500">
            <Link href="/movies" className="hover:text-green-400">
              Browse Movies
            </Link>
            <span>·</span>
            <Link href="/series" className="hover:text-green-400">
              Browse Series
            </Link>
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {socials.map((s) => (
              <span
                key={s.label}
                title={s.label}
                className="inline-flex items-center gap-2 rounded px-3 py-1.5 text-xs font-semibold text-white"
                style={{ backgroundColor: s.bg }}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/20 text-[11px] font-bold">{s.abbr}</span>
                {s.label}
              </span>
            ))}
          </div>

          <Link
            href="/movies"
            className="mx-auto mt-10 flex w-full max-w-xl items-center justify-center gap-2 border border-white/20 bg-black py-3.5 text-sm font-bold text-white hover:bg-neutral-900"
          >
            Go To {keyword} →
          </Link>

          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {["Browse All", "Latest Movies", "Latest Series", "Trending", "Hindi"].map((t) => (
              <span key={t} className="cursor-pointer rounded border border-white/20 bg-black px-3 py-1.5 text-xs hover:bg-neutral-900">
                {t}
              </span>
            ))}
          </div>

          <p className="mt-10 text-center text-xs font-semibold text-gray-400 md:text-left">Browse by year</p>
          <div className="mt-2 flex flex-wrap justify-center gap-1">
            {years.map((y) => (
              <Link
                key={y}
                href={`/year/${y}`}
                className="min-w-[3rem] border border-white/15 bg-[#2a2a2a] px-2 py-1.5 text-center text-xs hover:bg-neutral-800"
              >
                {y}
              </Link>
            ))}
            <span className="border border-white/15 bg-[#2a2a2a] px-2 py-1.5 text-xs">&gt;&gt;</span>
          </div>

          <div className="mx-auto mt-12 w-full max-w-xl rounded border border-green-600/40 bg-green-950/30 p-4 text-left text-sm">
            <p className="text-green-400">★ Popular downloads &amp; official domain notice</p>
            <p className="mt-2 text-gray-300">
              Use our built-in catalog:{" "}
              <Link href="/movies" className="text-green-400 underline">
                Movies
              </Link>{" "}
              and{" "}
              <Link href="/series" className="text-green-400 underline">
                Series
              </Link>
              . This page explains features only.
            </p>
          </div>
        </div>

        <main className="mx-auto max-w-[720px] space-y-10 px-4 py-10 text-left text-sm leading-[1.75] text-gray-300 sm:px-6">
          <h2 className="text-xl font-bold text-white">{content.heading}</h2>
          {content.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {content.sections.map((section) => (
            <section key={section.title}>
              <h3 className="text-lg font-bold text-white">{section.title}</h3>
              {section.paragraphs.map((para, j) => (
                <p key={j} className="mt-3">
                  {para}
                </p>
              ))}
            </section>
          ))}
        </main>

        <footer className="border-t border-neutral-800 bg-black py-10 text-center text-[11px] leading-relaxed text-gray-500">
          <p>
            {keyword} © 2011 - {new Date().getFullYear()}
          </p>
          <div className="mx-auto mt-4 flex max-w-[720px] flex-wrap justify-center gap-x-3 gap-y-1 px-4">
            {["Browse Movies", "Browse Series", "Trending", "About", "Contact", "Disclaimer", "Privacy", "Terms"].map((t) => (
              <span key={t} className="cursor-pointer hover:text-gray-300">
                {t}
              </span>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-3xl text-[10px] text-gray-600">
            {keyword} {keyword.toLowerCase()} watch movies online free streaming HD official guide information
          </p>
        </footer>
      </div>
    </>
  );
}
