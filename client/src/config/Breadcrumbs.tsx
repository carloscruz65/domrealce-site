import React from "react";

type Crumb = { label: string; href?: string };

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Breadcrumbs({
  items,
  className,
}: {
  items: Crumb[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("mx-auto max-w-6xl px-4 pt-4", className)}>
      <ol className="flex flex-wrap items-center gap-2 text-xs text-white/55">
        {items.map((c, i) => (
          <li key={`${c.label}-${i}`} className="flex items-center gap-2">
            {c.href ? (
              <a
                href={c.href}
                className="rounded hover:text-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/70"
              >
                {c.label}
              </a>
            ) : (
              <span className="font-semibold text-white/75">{c.label}</span>
            )}
            {i < items.length - 1 && <span className="text-white/25">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
