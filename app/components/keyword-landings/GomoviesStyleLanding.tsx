import Link from "next/link";
import { Suspense } from "react";
import StructuredData from "@/components/StructuredData";
import LandingMovieThumbnails from "./LandingMovieThumbnails";
import type { KeywordLandingProps } from "./types";

const ACCENT = "#6366f1";

const thumbFallback = (
  <div className="mx-auto mt-12 h-40 max-w-2xl animate-pulse rounded-lg bg-neutral-100" aria-hidden />
);

export default function GomoviesStyleLanding({ keyword, description, content }: KeywordLandingProps) {
  const linesFromSections = content.sections.flatMap((s) => [
    `— ${s.title}`,
    ...s.paragraphs.map((p) => `  ${p}`),
  ]);

  return (
    <>
      <StructuredData type="website" />
      <div className="min-h-screen bg-white font-sans text-[#1a1a1a]">
        <main className="mx-auto max-w-[820px] px-6 py-14 md:py-20">
          <h1 className="text-center text-3xl font-bold leading-tight md:text-[2.25rem]">{content.heading}</h1>
          <p className="mx-auto mt-5 max-w-xl text-center text-[#555]">{description}</p>

          <Suspense fallback={thumbFallback}>
            <LandingMovieThumbnails
              count={8}
              className="mx-auto mt-12 max-w-2xl"
              gridClassName="grid grid-cols-2 gap-3 sm:grid-cols-4"
            />
          </Suspense>

          <hr className="my-16 border-neutral-200" />

          <div className="space-y-7 text-[15px] leading-[1.75] text-[#333]">
            {content.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <hr className="my-16 border-neutral-200" />

          <h2 className="text-xl font-bold">Complete overview</h2>
          <p className="mt-2 text-sm text-[#666]">Structured reference — one block per topic.</p>

          <div className="mt-10 font-mono text-[13px] leading-8 text-[#1a1a1a]">
            {linesFromSections.map((line, i) => (
              <div key={i} className="border-b border-neutral-100 py-2 last:border-0">
                {line}
              </div>
            ))}
          </div>

          <hr className="my-16 border-neutral-200" />

          <div className="flex flex-wrap gap-3">
            <Link href="/movies" className="rounded-md px-5 py-2 text-sm font-semibold text-white" style={{ backgroundColor: ACCENT }}>
              Open movies
            </Link>
            <Link href="/series" className="text-sm font-medium text-[#444] underline-offset-4 hover:underline">
              TV series catalog →
            </Link>
          </div>
        </main>

        <footer className="border-t border-neutral-200 py-8 text-center text-xs text-[#666]">
          <p>
            © {new Date().getFullYear()} {keyword}
          </p>
          <div className="mt-2 flex justify-center gap-4">
            <span className="cursor-pointer hover:text-black">Terms</span>
            <span className="cursor-pointer hover:text-black">Privacy</span>
          </div>
        </footer>
      </div>
    </>
  );
}
