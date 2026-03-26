import Link from "next/link";

type Props = {
  href?: string;
  placeholder: string;
  className?: string;
  iconClassName?: string;
  variant?: "dark" | "light" | "soft";
};

const variantClass: Record<NonNullable<Props["variant"]>, string> = {
  dark: "border-white/10 bg-[#1a1a24] text-gray-500 hover:border-white/20 hover:bg-[#22222e]",
  light: "border-gray-200 bg-white text-gray-600 shadow-sm hover:border-gray-300 hover:bg-gray-50",
  soft: "border-slate-200/80 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white",
};

export function SearchLinkPill({
  href = "/search",
  placeholder,
  className = "",
  iconClassName = "text-gray-400",
  variant = "dark",
}: Props) {
  return (
    <Link
      href={href}
      className={`flex w-full cursor-pointer items-center gap-3 rounded-full px-5 py-3.5 pl-6 text-left text-sm transition-colors ${variantClass[variant]} ${className}`}
    >
      <span className="flex-1">{placeholder}</span>
      <span className={`shrink-0 ${iconClassName}`} aria-hidden>
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </span>
    </Link>
  );
}
