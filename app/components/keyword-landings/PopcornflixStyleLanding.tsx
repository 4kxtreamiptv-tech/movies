import StructuredData from "@/components/StructuredData";
import type { KeywordLandingProps } from "./types";

const BG = "#0a0a14";

export default function PopcornflixStyleLanding({ keyword: _keyword, description, content }: KeywordLandingProps) {
  return (
    <>
      <StructuredData type="website" />
      <div className="relative flex min-h-screen flex-col font-sans text-gray-300" style={{ backgroundColor: BG }}>
        <main className="mx-auto w-full max-w-[640px] flex-1 px-4 py-12 pb-56 sm:px-6 md:py-16">
          <h1 className="text-2xl font-bold text-white md:text-3xl">{content.heading}</h1>
          <p className="mt-3 text-sm text-gray-400">{description}</p>
          <div className="mt-8 space-y-4 text-sm leading-relaxed">
            {content.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="mt-12 space-y-10">
            {content.sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-lg font-semibold text-white">{section.title}</h2>
                {section.paragraphs.map((para, j) => (
                  <p key={j} className="mt-3">
                    {para}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </main>

        <div
          className="fixed bottom-4 right-4 z-50 w-[min(calc(100vw-2rem),360px)] rounded-xl border border-neutral-200 bg-white p-4 pr-5 pt-6 shadow-xl sm:bottom-5 sm:right-5"
          role="dialog"
          aria-label="Cookie consent"
        >
          <button
            type="button"
            className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm font-bold text-white"
            aria-label="Close"
          >
            ×
          </button>
          <p className="text-xs leading-relaxed text-gray-600">
            This site uses cookies to improve performance and your experience. Read our{" "}
            <span className="cursor-pointer font-medium text-red-600">privacy policy</span>. By clicking Accept you consent
            to cookies as described.
          </p>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              className="flex-1 rounded-lg bg-gradient-to-b from-red-600 to-red-800 py-2.5 text-sm font-bold text-white"
            >
              Accept
            </button>
            <button
              type="button"
              className="flex-1 rounded-lg bg-gradient-to-b from-neutral-700 to-neutral-900 py-2.5 text-sm font-bold text-white"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
