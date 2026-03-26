import Link from "next/link";
import { Suspense } from "react";
import StructuredData from "@/components/StructuredData";
import { SearchLinkPill } from "./SearchLinkPill";
import LandingMovieThumbnails from "./LandingMovieThumbnails";
import { ArticleBody, ShareRow } from "./OfficialBrandArticle";
import type { KeywordLandingProps, OfficialStylePreset } from "./types";

const thumbFallback = (
  <div className="mx-auto mt-8 h-36 max-w-4xl animate-pulse rounded-xl bg-gray-200/80" aria-hidden />
);

type InnerProps = KeywordLandingProps & { preset: OfficialStylePreset };

export function OfficialPresetLanding({ preset, keyword, description, content, colorTheme }: InnerProps) {
  const a = colorTheme.primary;

  if (preset === "m123") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-[#0d0d0d] font-sans text-[#b8bcc4]">
          <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:py-16">
            <div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl text-2xl text-white shadow-lg sm:h-20 sm:w-20 sm:text-3xl"
              style={{ backgroundColor: a }}
            >
              ▶
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
              <span style={{ color: a }}>123</span>
              <span className="text-white">MOVIES</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm text-white/75">{description}</p>
            <SearchLinkPill className="mx-auto mt-10 max-w-xl" placeholder="Search movies & TV…" />
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/movies"
                className="rounded-full px-8 py-2.5 text-sm font-bold text-black"
                style={{ backgroundColor: a }}
              >
                Browse movies
              </Link>
              <Link
                href="/series"
                className="rounded-full border border-white/20 px-6 py-2.5 text-sm text-white/90 hover:bg-white/10"
              >
                TV series
              </Link>
            </div>
            <ShareRow dark />
          </div>
          <ArticleBody
            content={content}
            headingClass="text-white"
            bodyClass="text-white/80"
            cardClass="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
          />
        </div>
      </>
    );
  }

  if (preset === "gostream") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-[#f5f6f8] font-sans text-gray-800">
          <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:py-16">
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">{keyword}</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-gray-600">{description}</p>
            <Suspense fallback={thumbFallback}>
              <LandingMovieThumbnails
                count={8}
                className="mx-auto mt-8 max-w-4xl"
                gridClassName="mx-auto grid max-w-2xl grid-cols-4 gap-2 sm:gap-3"
              />
            </Suspense>
            <SearchLinkPill variant="light" className="mx-auto mt-10 max-w-xl" placeholder="Search titles…" />
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/movies" className="rounded-lg px-6 py-2.5 text-sm font-bold text-white" style={{ backgroundColor: a }}>
                Movies
              </Link>
              <Link
                href="/series"
                className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700"
              >
                Series
              </Link>
            </div>
          </div>
          <ArticleBody
            content={content}
            headingClass="text-gray-900"
            bodyClass="text-gray-600"
            cardClass="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          />
        </div>
      </>
    );
  }

  if (preset === "putlocker") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-[#0f172a] font-sans text-slate-300">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-emerald-400/90">Stream</p>
            <h1 className="mt-3 text-4xl font-black text-white md:text-5xl">{keyword}</h1>
            <p className="mt-4 text-sm text-slate-400">{description}</p>
            <SearchLinkPill className="mx-auto mt-10 max-w-lg" placeholder="Search library…" />
            <Link
              href="/movies"
              className="mt-8 inline-block rounded-md px-10 py-3 text-sm font-bold text-slate-900"
              style={{ backgroundColor: a }}
            >
              Watch now
            </Link>
          </div>
          <ArticleBody
            content={content}
            headingClass="text-white"
            bodyClass="text-slate-300"
            cardClass="rounded-xl border border-slate-700/80 bg-slate-900/50 p-6"
          />
        </div>
      </>
    );
  }

  if (preset === "bflix") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-[#0a0a0a] font-sans text-gray-400">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <h1 className="bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-4xl font-black text-transparent md:text-5xl">
              {keyword}
            </h1>
            <p className="mt-4 text-sm">{description}</p>
            <SearchLinkPill className="mx-auto mt-10 max-w-xl" placeholder="Find HD movies & shows…" />
            <div className="mt-8 flex justify-center gap-2">
              <Link href="/movies" className="rounded-full px-8 py-2.5 text-sm font-bold text-white" style={{ backgroundColor: a }}>
                HD Movies
              </Link>
            </div>
            <ShareRow dark />
          </div>
          <ArticleBody
            content={content}
            headingClass="text-white"
            bodyClass="text-gray-400"
            cardClass="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          />
        </div>
      </>
    );
  }

  if (preset === "netfree") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-gradient-to-b from-[#1e1b4b] to-[#0f0a1a] font-sans text-purple-100/90">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <h1 className="text-4xl font-black text-white md:text-5xl">{keyword}</h1>
            <p className="mt-4 text-sm text-purple-200/80">{description}</p>
            <SearchLinkPill className="mx-auto mt-10 max-w-xl" placeholder="Search free catalog…" />
            <Link
              href="/movies"
              className="mt-8 inline-block rounded-full px-10 py-3 text-sm font-bold text-white shadow-lg"
              style={{ backgroundColor: a }}
            >
              Explore
            </Link>
          </div>
          <ArticleBody
            content={content}
            headingClass="text-white"
            bodyClass="text-purple-100/85"
            cardClass="rounded-2xl border border-purple-500/20 bg-purple-950/40 p-6"
          />
        </div>
      </>
    );
  }

  if (preset === "filmyhit") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-[#fff7ed] font-sans text-gray-800">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <h1 className="text-3xl font-black text-orange-700 md:text-4xl">🎬 {keyword}</h1>
            <p className="mt-3 text-sm text-gray-600">{description}</p>
            <SearchLinkPill variant="light" className="mx-auto mt-10 max-w-xl" placeholder="Search Punjabi / Hindi…" />
            <div className="mt-6 flex flex-wrap justify-center gap-2 text-[11px] font-bold tracking-wide text-gray-600">
              <Link href="/movies" className="hover:text-orange-700">
                MOVIES
              </Link>
              <span className="text-gray-300">·</span>
              <Link href="/series" className="hover:text-orange-700">
                SHOWS
              </Link>
            </div>
          </div>
          <ArticleBody
            content={content}
            headingClass="text-gray-900"
            bodyClass="text-gray-600"
            cardClass="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm"
          />
        </div>
      </>
    );
  }

  if (preset === "movierulz5") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-[#0c0c0c] font-sans text-gray-300">
          <div className="border-b border-amber-500/30 bg-gradient-to-r from-amber-900/20 to-teal-900/20 py-3 text-center text-[11px] font-bold tracking-widest text-amber-200/90">
            SOUTH INDIAN · HINDI · TAMIL · TELUGU
          </div>
          <div className="mx-auto max-w-2xl px-4 py-12 text-center">
            <h1 className="text-3xl font-black text-amber-400 md:text-4xl">{keyword}</h1>
            <p className="mt-3 text-sm text-gray-400">{description}</p>
            <SearchLinkPill className="mx-auto mt-10 max-w-xl" placeholder="Search regional movies…" />
            <Link
              href="/movies"
              className="mt-8 inline-block rounded-sm px-8 py-2.5 text-sm font-bold text-black"
              style={{ backgroundColor: "#fbbf24" }}
            >
              Browse
            </Link>
          </div>
          <ArticleBody
            content={content}
            headingClass="text-amber-100"
            bodyClass="text-gray-400"
            cardClass="rounded-lg border border-amber-900/40 bg-black/40 p-6"
          />
        </div>
      </>
    );
  }

  if (preset === "sevenstarhd") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-black font-sans text-gray-400">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <span className="inline-block rounded border-2 border-teal-400 px-3 py-1 text-xs font-black text-teal-400">HD</span>
            <h1 className="mt-4 text-4xl font-black text-white md:text-5xl">{keyword}</h1>
            <p className="mt-3 text-sm">{description}</p>
            <SearchLinkPill className="mx-auto mt-10 max-w-xl" placeholder="Search HD titles…" />
          </div>
          <ArticleBody
            content={content}
            headingClass="text-white"
            bodyClass="text-gray-400"
            cardClass="rounded-xl border border-teal-900/50 bg-teal-950/20 p-6"
          />
        </div>
      </>
    );
  }

  if (preset === "hdmovie2") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-slate-950 font-sans text-slate-300">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <h1 className="text-3xl font-black text-cyan-400 md:text-4xl">{keyword}</h1>
            <p className="mt-3 text-sm text-slate-400">{description}</p>
            <SearchLinkPill className="mx-auto mt-10 max-w-xl" placeholder="Search sequels & remakes…" />
            <div className="mt-6 flex justify-center gap-2">
              <Link href="/movies" className="rounded-lg px-6 py-2 text-sm font-bold text-slate-950" style={{ backgroundColor: a }}>
                Movies
              </Link>
              <Link href="/series" className="rounded-lg border border-cyan-700 px-6 py-2 text-sm text-cyan-200">
                Series
              </Link>
            </div>
          </div>
          <ArticleBody
            content={content}
            headingClass="text-cyan-100"
            bodyClass="text-slate-400"
            cardClass="rounded-xl border border-cyan-900/40 bg-slate-900/60 p-6"
          />
        </div>
      </>
    );
  }

  if (preset === "ssrmovies") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-[#1a0505] font-sans text-red-100/80">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <h1 className="text-4xl font-black text-red-500 md:text-5xl">{keyword}</h1>
            <p className="mt-3 text-sm">{description}</p>
            <SearchLinkPill className="mx-auto mt-10 max-w-xl" placeholder="Search Hindi / dubbed…" />
          </div>
          <ArticleBody
            content={content}
            headingClass="text-red-100"
            bodyClass="text-red-100/70"
            cardClass="rounded-xl border border-red-900/50 bg-red-950/30 p-6"
          />
        </div>
      </>
    );
  }

  if (preset === "nine-x-movies") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-black font-sans text-amber-100/70">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <h1 className="text-4xl font-black text-amber-400 md:text-5xl">{keyword}</h1>
            <p className="mt-3 text-sm text-amber-100/60">{description}</p>
            <SearchLinkPill className="mx-auto mt-10 max-w-xl" placeholder="Dual audio search…" />
          </div>
          <ArticleBody
            content={content}
            headingClass="text-amber-200"
            bodyClass="text-amber-100/70"
            cardClass="rounded-xl border border-amber-900/40 bg-amber-950/20 p-6"
          />
        </div>
      </>
    );
  }

  if (preset === "kuttymovies") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-[#1a0a2e] font-sans text-purple-100/80">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <h1 className="text-3xl font-black text-purple-300 md:text-4xl">{keyword}</h1>
            <p className="mt-3 text-sm text-purple-200/60">{description}</p>
            <SearchLinkPill className="mx-auto mt-10 max-w-xl" placeholder="Search Tamil cinema…" />
          </div>
          <ArticleBody
            content={content}
            headingClass="text-purple-100"
            bodyClass="text-purple-100/70"
            cardClass="rounded-xl border border-purple-800/50 bg-purple-950/40 p-6"
          />
        </div>
      </>
    );
  }

  if (preset === "sflix") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-zinc-950 font-sans text-pink-100/70">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <h1 className="text-4xl font-black text-pink-500 md:text-5xl">{keyword}</h1>
            <p className="mt-3 text-sm">{description}</p>
            <SearchLinkPill className="mx-auto mt-10 max-w-xl" placeholder="Search series…" />
          </div>
          <ArticleBody
            content={content}
            headingClass="text-pink-100"
            bodyClass="text-pink-100/70"
            cardClass="rounded-xl border border-pink-900/40 bg-pink-950/20 p-6"
          />
        </div>
      </>
    );
  }

  if (preset === "nine-x-flix") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-slate-950 font-sans text-teal-100/70">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <h1 className="text-4xl font-black text-teal-400 md:text-5xl">{keyword}</h1>
            <p className="mt-3 text-sm">{description}</p>
            <SearchLinkPill className="mx-auto mt-10 max-w-xl" placeholder="Genre search…" />
          </div>
          <ArticleBody
            content={content}
            headingClass="text-teal-100"
            bodyClass="text-teal-100/70"
            cardClass="rounded-xl border border-teal-900/40 bg-slate-900/60 p-6"
          />
        </div>
      </>
    );
  }

  if (preset === "prmovies") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-orange-50 font-sans text-gray-800">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <h1 className="text-3xl font-black text-orange-700 md:text-4xl">{keyword}</h1>
            <p className="mt-3 text-sm text-gray-600">{description}</p>
            <SearchLinkPill variant="soft" className="mx-auto mt-10 max-w-xl" placeholder="Hindi · English…" />
          </div>
          <ArticleBody
            content={content}
            headingClass="text-gray-900"
            bodyClass="text-gray-600"
            cardClass="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm"
          />
        </div>
      </>
    );
  }

  if (preset === "filmy4web") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-rose-50 font-sans text-rose-950">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <h1 className="text-3xl font-black text-rose-700 md:text-4xl">{keyword}</h1>
            <p className="mt-3 text-sm text-rose-900/70">{description}</p>
            <SearchLinkPill variant="soft" className="mx-auto mt-10 max-w-xl" placeholder="Web streaming search…" />
          </div>
          <ArticleBody
            content={content}
            headingClass="text-rose-900"
            bodyClass="text-rose-900/80"
            cardClass="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm"
          />
        </div>
      </>
    );
  }

  if (preset === "goojara") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-[#0a1f14] font-sans text-green-100/75">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <h1 className="text-4xl font-black text-green-400 md:text-5xl">{keyword}</h1>
            <p className="mt-3 text-sm">{description}</p>
            <SearchLinkPill className="mx-auto mt-10 max-w-xl" placeholder="Anime · movies…" />
          </div>
          <ArticleBody
            content={content}
            headingClass="text-green-100"
            bodyClass="text-green-100/70"
            cardClass="rounded-xl border border-green-900/40 bg-green-950/30 p-6"
          />
        </div>
      </>
    );
  }

  if (preset === "bolly4u") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-[#1f0606] font-sans text-red-100/75">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <h1 className="text-4xl font-black text-red-500 md:text-5xl">{keyword}</h1>
            <p className="mt-3 text-sm">{description}</p>
            <SearchLinkPill className="mx-auto mt-10 max-w-xl" placeholder="Bollywood search…" />
          </div>
          <ArticleBody
            content={content}
            headingClass="text-red-100"
            bodyClass="text-red-100/70"
            cardClass="rounded-xl border border-red-900/50 bg-red-950/30 p-6"
          />
        </div>
      </>
    );
  }

  if (preset === "moviesda") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-cyan-950 font-sans text-cyan-100/75">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <h1 className="text-3xl font-black text-cyan-300 md:text-4xl">{keyword}</h1>
            <p className="mt-3 text-sm">{description}</p>
            <SearchLinkPill className="mx-auto mt-10 max-w-xl" placeholder="Tamil mobile search…" />
          </div>
          <ArticleBody
            content={content}
            headingClass="text-cyan-100"
            bodyClass="text-cyan-100/70"
            cardClass="rounded-xl border border-cyan-800/40 bg-cyan-950/50 p-6"
          />
        </div>
      </>
    );
  }

  if (preset === "filmy4wap") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-pink-50 font-sans text-pink-950">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <h1 className="text-3xl font-black text-pink-600 md:text-4xl">{keyword}</h1>
            <p className="mt-3 text-sm text-pink-900/70">{description}</p>
            <SearchLinkPill variant="soft" className="mx-auto mt-10 max-w-xl" placeholder="Hindi mobile…" />
          </div>
          <ArticleBody
            content={content}
            headingClass="text-pink-900"
            bodyClass="text-pink-900/80"
            cardClass="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm"
          />
        </div>
      </>
    );
  }

  if (preset === "mp4moviez") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-neutral-950 font-sans text-lime-100/70">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <h1 className="text-4xl font-black text-lime-400 md:text-5xl">{keyword}</h1>
            <p className="mt-3 text-sm">{description}</p>
            <SearchLinkPill className="mx-auto mt-10 max-w-xl" placeholder="Format-smart search…" />
          </div>
          <ArticleBody
            content={content}
            headingClass="text-lime-100"
            bodyClass="text-lime-100/70"
            cardClass="rounded-xl border border-lime-900/40 bg-lime-950/10 p-6"
          />
        </div>
      </>
    );
  }

  if (preset === "ibomma") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-green-950 font-sans text-green-100/80">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <h1 className="text-3xl font-black text-green-400 md:text-4xl">{keyword}</h1>
            <p className="mt-3 text-sm">{description}</p>
            <SearchLinkPill className="mx-auto mt-10 max-w-xl" placeholder="Telugu search…" />
            <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-green-500/90">Tollywood</p>
          </div>
          <ArticleBody
            content={content}
            headingClass="text-green-100"
            bodyClass="text-green-100/75"
            cardClass="rounded-xl border border-green-800/40 bg-green-950/50 p-6"
          />
        </div>
      </>
    );
  }

  if (preset === "fzmovies") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-blue-950 font-sans text-blue-100/75">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <h1 className="text-4xl font-black text-blue-400 md:text-5xl">{keyword}</h1>
            <p className="mt-3 text-sm">{description}</p>
            <SearchLinkPill className="mx-auto mt-10 max-w-xl" placeholder="International cinema…" />
          </div>
          <ArticleBody
            content={content}
            headingClass="text-blue-100"
            bodyClass="text-blue-100/70"
            cardClass="rounded-xl border border-blue-900/40 bg-slate-900/50 p-6"
          />
        </div>
      </>
    );
  }

  return (
    <OfficialPresetLanding
      preset="m123"
      keyword={keyword}
      description={description}
      content={content}
      colorTheme={{ ...colorTheme, primary: "#22c55e" }}
    />
  );
}
