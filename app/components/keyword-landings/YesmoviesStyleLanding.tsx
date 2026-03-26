import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import type { KeywordLandingProps } from "./types";

const RED = "#ff0000";
const YELLOW = "#ffff00";
const CYAN = "#00ffff";
const BLUE = "#2563eb";
const ORANGE_BORDER = "#ffa500";

function highlightBrand(text: string, brand: string) {
  const re = new RegExp(`(${brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(re);
  return parts.map((part, i) =>
    part.toLowerCase() === brand.toLowerCase() ? (
      <span key={i} style={{ color: CYAN }}>
        {part}
      </span>
    ) : (
      part
    )
  );
}

export default function YesmoviesStyleLanding({ keyword, description, content }: KeywordLandingProps) {
  const brand = keyword;
  const tableRows = [
    { rank: "1", title: "Spotlight A", genre: "Action", director: "TBA", note: "Fan favorite pick" },
    { rank: "2", title: "Spotlight B", genre: "Drama", director: "TBA", note: "Strong story" },
    { rank: "3", title: "Spotlight C", genre: "Sci‑Fi", director: "TBA", note: "Visual heavy" },
    { rank: "4", title: "Spotlight D", genre: "Thriller", director: "TBA", note: "Fast pace" },
    { rank: "5", title: "Spotlight E", genre: "Comedy", director: "TBA", note: "Light watch" },
  ];

  return (
    <>
      <StructuredData type="website" />
      <div className="min-h-screen bg-[#121212] font-sans text-white">
        <div className="mx-auto max-w-[640px] px-4 py-10 text-center sm:px-6 md:py-14">
          <div className="text-4xl font-black md:text-5xl">
            <span style={{ color: RED }}>YES</span>
            <span className="text-white drop-shadow-[0_0_8px_rgba(250,204,21,0.9)]">MOVIES</span>
          </div>
          <h1 className="mt-6 text-xl font-bold md:text-2xl" style={{ color: YELLOW }}>
            {keyword} Official – Watch Latest Movies &amp; TV Shows Online
          </h1>
          <p className="mt-2 text-sm text-white/70">{description}</p>

          <Link
            href="/search"
            className="mx-auto mt-6 flex w-full max-w-md items-center gap-2 rounded-full border border-white/10 bg-[#2a2a2a] px-5 py-3 text-left text-sm text-gray-500 transition-colors hover:border-white/20 hover:bg-[#333]"
          >
            <span className="flex-1">Search titles…</span>
            <svg className="h-5 w-5 shrink-0 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>

          <Link
            href="/movies"
            className="mt-6 inline-flex items-center gap-2 rounded-lg px-8 py-3 text-sm font-bold text-white"
            style={{ backgroundColor: BLUE }}
          >
            Watch Movies NOW ▶
          </Link>

          <div className="mt-10 space-y-4 text-left text-sm leading-[1.75]">
            {content.intro.map((p, i) => (
              <p key={i}>{highlightBrand(p, brand)}</p>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-6">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-lg bg-gradient-to-br from-orange-900 via-red-900 to-black">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-gradient-to-b from-white to-yellow-400 bg-clip-text text-3xl font-black tracking-tight text-transparent md:text-5xl">
                {keyword.toUpperCase().replace(/\s/g, "")}.SITE
              </span>
            </div>
          </div>
        </div>

        <main className="mx-auto max-w-[680px] space-y-14 px-4 py-12 sm:px-6 md:space-y-16 md:py-16">
          {content.sections.map((section) => (
            <section key={section.title} className="text-left">
              <h2 className="text-center text-lg font-bold md:text-left md:text-xl" style={{ color: RED }}>
                {section.title}
              </h2>
              {section.paragraphs.map((para, j) => (
                <p key={j} className="mt-4 text-sm leading-[1.75] md:text-base">
                  {highlightBrand(para, brand)}
                </p>
              ))}
            </section>
          ))}

          <section className="text-left">
            <h2 className="text-center text-lg font-bold md:text-left" style={{ color: RED }}>
              Top 5 Best Movies of {new Date().getFullYear()}
            </h2>
            <div className="-mx-1 overflow-x-auto sm:mx-0">
              <table
                className="min-w-[520px] w-full border-collapse text-center text-sm md:min-w-0"
                style={{ border: `1px solid ${ORANGE_BORDER}` }}
              >
                <thead>
                  <tr className="bg-black">
                    {["Rank", "Movie Title", "Genre", "Director", "Why It Stands Out"].map((h) => (
                      <th key={h} className="p-2 font-bold" style={{ border: `1px solid ${ORANGE_BORDER}`, color: YELLOW }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, i) => (
                    <tr key={row.rank} className={i % 2 === 0 ? "bg-[#1a1a1a]" : "bg-[#0d0d0d]"}>
                      <td className="p-2 text-white" style={{ border: `1px solid ${ORANGE_BORDER}` }}>
                        {row.rank}
                      </td>
                      <td className="p-2 font-medium" style={{ border: `1px solid ${ORANGE_BORDER}`, color: YELLOW }}>
                        {row.title}
                      </td>
                      <td className="p-2" style={{ border: `1px solid ${ORANGE_BORDER}`, color: YELLOW }}>
                        {row.genre}
                      </td>
                      <td className="p-2 text-white" style={{ border: `1px solid ${ORANGE_BORDER}` }}>
                        {row.director}
                      </td>
                      <td className="p-2 text-white" style={{ border: `1px solid ${ORANGE_BORDER}` }}>
                        {row.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold" style={{ color: RED }}>
              Frequently Asked Questions About {keyword}
            </h2>
            {content.sections.slice(0, 3).map((s) => (
              <div key={s.title} className="mt-6 text-left">
                <p className="font-bold" style={{ color: YELLOW }}>
                  {s.title}?
                </p>
                <p className="mt-2 text-sm">{highlightBrand(s.paragraphs[0] || "", brand)}</p>
              </div>
            ))}
          </section>

          <div className="pb-8 text-center">
            <Link
              href="/movies"
              className="inline-flex items-center gap-2 rounded-lg px-8 py-3 text-sm font-bold text-white"
              style={{ backgroundColor: BLUE }}
            >
              Watch Movies NOW ▶
            </Link>
            <p className="mt-8 text-sm" style={{ color: RED }}>
              Copyright © {new Date().getFullYear()} {keyword}
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
