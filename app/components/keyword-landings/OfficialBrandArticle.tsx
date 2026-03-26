import Link from "next/link";
import type { KeywordLandingContent } from "./types";

export function ArticleBody({
  content,
  headingClass,
  bodyClass,
  cardClass,
}: {
  content: KeywordLandingContent;
  headingClass: string;
  bodyClass: string;
  cardClass: string;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
      <h2 className={`mb-8 text-center text-xl font-bold md:text-2xl ${headingClass}`}>{content.heading}</h2>
      <div className={`space-y-5 text-[15px] leading-relaxed ${bodyClass}`}>
        {content.intro.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <div className="mt-12 space-y-8">
        {content.sections.map((section) => (
          <section key={section.title} className={cardClass}>
            <h2 className={`text-lg font-bold md:text-xl ${headingClass}`}>{section.title}</h2>
            <div className={`mt-4 space-y-3 text-[15px] leading-relaxed ${bodyClass}`}>
              {section.paragraphs.map((para, j) => (
                <p key={j}>{para}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
      <p className={`mt-14 text-center text-xs ${bodyClass}`}>
        © {new Date().getFullYear()} · Informational guide ·{" "}
        <Link href="/home" className="underline-offset-2 hover:underline">
          Home
        </Link>
      </p>
    </div>
  );
}

export function ShareRow({ dark: _dark }: { dark?: boolean }) {
  const items = [
    { bg: "#1877f2", label: "Facebook" },
    { bg: "#1da1f2", label: "Twitter" },
    { bg: "#ff4500", label: "Reddit" },
    { bg: "#333", label: "Email" },
  ];
  return (
    <div className="mt-6 flex flex-wrap justify-center gap-2">
      {items.map((s) => (
        <span
          key={s.label}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold text-white shadow opacity-95"
          style={{ backgroundColor: s.bg }}
        >
          {s.label}
        </span>
      ))}
    </div>
  );
}
