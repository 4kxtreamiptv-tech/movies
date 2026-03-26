import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import { SearchLinkPill } from "./SearchLinkPill";
import type { KeywordLandingProps } from "./types";

const MAGENTA = "#e91e63";
const BG = "#0d0d12";

export default function FmoviesStyleLanding({ keyword, description, content }: KeywordLandingProps) {
  const faq = content.sections.slice(0, 4).map((s, i) => ({
    q: s.title,
    a: s.paragraphs.join(" "),
    key: i,
  }));

  return (
    <>
      <StructuredData type="website" />
      <div className="min-h-screen font-sans text-[#b0b0b0] lg:pr-14" style={{ backgroundColor: BG }}>
        <div className="fixed right-2 top-1/3 z-40 hidden flex-col gap-2 lg:flex">
          {["#1877f2", "#1da1f2", "#0088cc", "#25d366"].map((c, i) => (
            <span key={i} className="h-9 w-9 cursor-pointer rounded shadow-md" style={{ backgroundColor: c }} aria-hidden />
          ))}
        </div>

        <div className="mx-auto max-w-[1200px] px-5 py-12 text-center sm:px-6 md:py-16">
          <div
            className="mx-auto mb-8 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl text-3xl text-white shadow-lg md:h-24 md:w-24 md:text-4xl"
            style={{ backgroundColor: MAGENTA }}
          >
            ▶
          </div>
          <h1 className="text-3xl font-bold text-white md:text-5xl lg:text-6xl">{keyword}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm md:text-base">{description}</p>

          <SearchLinkPill className="mx-auto mt-10 max-w-2xl" placeholder="Search your favorite content" />

          <div className="mx-auto mt-6 flex w-full max-w-2xl flex-wrap justify-center gap-2">
            {(
              [
                { bg: "#4267B2", label: "Facebook", abbr: "f" },
                { bg: "#1DA1F2", label: "Twitter", abbr: "X" },
                { bg: "#FF4500", label: "Reddit", abbr: "r" },
                { bg: "#444444", label: "Email", abbr: "@" },
                { bg: "#25D366", label: "WhatsApp", abbr: "W" },
                { bg: "#0088cc", label: "Telegram", abbr: "T" },
              ] as const
            ).map((s) => (
              <span
                key={s.label}
                title={s.label}
                className="inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold text-white shadow-sm"
                style={{ backgroundColor: s.bg }}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/20 text-[11px] font-bold">
                  {s.abbr}
                </span>
                {s.label}
              </span>
            ))}
          </div>

          <Link
            href="/movies"
            className="mt-8 inline-block rounded-full px-10 py-3 text-sm font-bold text-white"
            style={{ backgroundColor: MAGENTA, borderRadius: 30 }}
          >
            Go to {keyword}
          </Link>
        </div>

        <main className="mx-auto max-w-[1200px] px-5 pb-20 sm:px-6">
          <div className="mx-auto max-w-3xl text-left">
            <h2 className="mb-8 text-2xl font-bold text-white md:text-3xl">{content.heading}</h2>
            <div className="space-y-6 text-sm leading-[1.8] md:text-base">
              {content.intro.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="mt-20 space-y-20 md:space-y-24">
              {content.sections.map((section) => (
                <section key={section.title}>
                  <h3 className="text-xl font-bold text-white md:text-2xl">{section.title}</h3>
                  <ul className="mt-5 list-none space-y-4">
                    {section.paragraphs.map((para, j) => (
                      <li key={j} className="flex gap-2 text-sm md:text-base">
                        <span className="text-white">•</span>
                        <span>
                          <strong className="text-white">Point {j + 1}: </strong>
                          {para}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            <div className="mt-20 border-t border-white/10 pt-12">
              <h3 className="text-center text-xl font-bold text-white">Frequently Asked Questions</h3>
              <div className="mx-auto mt-8 max-w-3xl space-y-2">
                {faq.map((item) => (
                  <details
                    key={item.key}
                    className="group border border-white/10 bg-[#14141c] px-4 py-3 [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-white">
                      {item.q}
                      <span className="text-lg" style={{ color: MAGENTA }}>
                        ▼
                      </span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>

            <div className="mt-16 text-center">
              <Link
                href="/movies"
                className="inline-block rounded-full px-10 py-3 text-sm font-bold text-white"
                style={{ backgroundColor: MAGENTA, borderRadius: 30 }}
              >
                Go to {keyword}
              </Link>
            </div>
          </div>
        </main>

        <footer className="border-t border-white/10 bg-black/50 py-12">
          <div className="mx-auto grid max-w-[1200px] gap-10 px-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 font-bold text-white">
                <span className="rounded bg-[#e91e63] px-1 py-0.5 text-xs">▶</span>
                {keyword}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-gray-500">{description}</p>
            </div>
            <div>
              <h4 className="font-semibold text-white">Quick</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/home" className="hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/movies" className="hover:text-white">
                    Movies
                  </Link>
                </li>
                <li>
                  <Link href="/series" className="hover:text-white">
                    Series
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white">Browse</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/genres" className="hover:text-white">
                    Genres
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="hover:text-white">
                    Search
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white">Legal</h4>
              <p className="mt-3 text-xs text-gray-500">Informational page. Links to our catalog only.</p>
            </div>
          </div>
          <p className="mt-10 border-t border-white/5 py-4 text-center text-xs text-gray-600">
            © {new Date().getFullYear()} {keyword}. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
}
