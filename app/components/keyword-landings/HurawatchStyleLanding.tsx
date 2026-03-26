import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import type { KeywordLandingProps } from "./types";

const GOLD = "#d4af37";
const CYAN = "#22d3ee";

export default function HurawatchStyleLanding({ keyword, description, content }: KeywordLandingProps) {
  return (
    <>
      <StructuredData type="website" />
      <div className="min-h-screen bg-black font-sans text-white">
        <div className="mx-auto max-w-2xl px-4 py-10 text-center sm:px-6">
          <h1 className="text-lg font-normal leading-snug text-white sm:text-xl md:text-2xl">
            {keyword} | {description} - Official
          </h1>
          <Link
            href="/search"
            className="mx-auto mt-6 flex w-full max-w-xl overflow-hidden rounded-lg border border-neutral-600 bg-white shadow-sm transition-opacity hover:opacity-95"
          >
            <span className="flex-1 px-4 py-3 text-left text-sm text-gray-500">Search movies and TV shows...</span>
            <span className="flex items-center px-5 py-3 text-sm font-bold text-black" style={{ backgroundColor: GOLD }}>
              Search
            </span>
          </Link>
          <Link
            href="/home"
            className="mt-4 inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-bold text-black"
            style={{ backgroundColor: GOLD }}
          >
            🏠 Go To Homepage
          </Link>
          <p className="mx-auto mt-8 max-w-xl text-left text-sm leading-relaxed text-white/90">
            Watch free movies and series in HD.{" "}
            <Link href="/movies" className="underline" style={{ color: CYAN }}>
              {keyword}
            </Link>{" "}
            helps you browse our catalog quickly — no signup wall on this info page.
          </p>
        </div>

        <div className="relative mx-auto max-w-[960px] overflow-hidden px-4 sm:px-6">
          <div className="relative h-52 w-full rounded-lg bg-gradient-to-r from-slate-900 via-purple-900/50 to-slate-900 md:h-72">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p
                className="text-3xl font-black tracking-tighter md:text-5xl"
                style={{ color: GOLD, textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}
              >
                {keyword.toUpperCase()}
              </p>
              <p className="mt-2 text-xs font-semibold tracking-[0.3em] text-white/80 md:text-sm">WATCH FREE MOVIES ONLINE</p>
            </div>
          </div>
        </div>

        <main className="mx-auto max-w-[680px] px-4 py-14 sm:px-6 md:py-16">
          <nav className="mb-14 rounded border border-neutral-700 p-5 sm:p-6">
            <p className="mb-4 text-sm font-bold" style={{ color: GOLD }}>
              Contents
            </p>
            <div className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
              {content.sections.map((s, i) => (
                <a key={s.title} href={`#hw-${i}`} className="text-left text-sm underline" style={{ color: CYAN }}>
                  {i + 1}) {s.title}
                </a>
              ))}
            </div>
          </nav>

          <h2 className="text-center text-xl font-bold md:text-2xl">{content.heading}</h2>
          <div className="mt-8 space-y-5 text-sm leading-[1.75] text-white/85">
            {content.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full border-collapse border border-white text-left text-sm">
              <thead>
                <tr>
                  <th className="border border-white p-2 font-bold" style={{ color: GOLD }}>
                    Feature
                  </th>
                  <th className="border border-white p-2 font-bold" style={{ color: GOLD }}>
                    What you get
                  </th>
                  <th className="border border-white p-2 font-bold" style={{ color: GOLD }}>
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {content.sections.slice(0, 3).map((s) => (
                  <tr key={s.title}>
                    <td className="border border-white p-2 text-white/90">{s.title}</td>
                    <td className="border border-white p-2 text-white/70">{s.paragraphs[0]?.slice(0, 70)}…</td>
                    <td className="border border-white p-2 text-white/60">Updated</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full border-collapse border border-white text-left text-sm">
              <thead>
                <tr>
                  <th className="border border-white p-2 font-bold" style={{ color: GOLD }}>
                    vs
                  </th>
                  <th className="border border-white p-2 font-bold" style={{ color: GOLD }}>
                    Our catalog
                  </th>
                  <th className="border border-white p-2 font-bold" style={{ color: GOLD }}>
                    Typical paid apps
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-white p-2">Library</td>
                  <td className="border border-white p-2 text-white/80">Large browse index</td>
                  <td className="border border-white p-2 text-white/80">Subscription gated</td>
                </tr>
                <tr>
                  <td className="border border-white p-2">Cost</td>
                  <td className="border border-white p-2 text-white/80">Free browsing</td>
                  <td className="border border-white p-2 text-white/80">Monthly fee</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-16 space-y-14 md:space-y-16">
            {content.sections.map((section, idx) => (
              <article key={section.title} id={`hw-${idx}`} className="scroll-mt-28">
                <h3 className="text-lg font-bold md:text-xl" style={{ color: GOLD }}>
                  {idx + 1}) {section.title}
                </h3>
                <ul className="mt-5 list-disc space-y-4 pl-6 text-sm leading-[1.75] text-white/90 marker:text-cyan-400">
                  {section.paragraphs.map((para, j) => (
                    <li key={j}>{para}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <section className="mt-16 border-t border-neutral-800 pt-12">
            <h3 className="text-lg font-bold" style={{ color: GOLD }}>
              14) FAQs
            </h3>
            {content.sections.slice(0, 2).map((s) => (
              <div key={s.title} className="mt-6">
                <p className="font-bold" style={{ color: CYAN }}>
                  {s.title}?
                </p>
                <p className="mt-2 text-sm text-white/85">{s.paragraphs[0]}</p>
              </div>
            ))}
          </section>
        </main>

        <footer className="bg-neutral-900 py-6 text-center text-xs text-neutral-500">
          © {new Date().getFullYear()} {keyword} All Rights Reserved
        </footer>
      </div>
    </>
  );
}
