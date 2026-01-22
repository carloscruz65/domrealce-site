import React, { useMemo } from "react";
import type { PageNode } from "@/config/navigationMap";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function PageNavBar({
  order,
  currentId,
  backHref,
  backLabel = "Voltar",
  className,
}: {
  order: PageNode[];
  currentId: string;
  backHref: string;
  backLabel?: string;
  className?: string;
}) {
  const { prev, next } = useMemo(() => {
    const idx = order.findIndex((x) => x.id === currentId);
    const prevNode = idx > 0 ? order[idx - 1] : null;
    const nextNode = idx >= 0 && idx < order.length - 1 ? order[idx + 1] : null;
    return { prev: prevNode, next: nextNode };
  }, [order, currentId]);

  return (
    <div className={cn("mx-auto max-w-6xl px-4", className)}>
      <div
        className={cn(
          "w-full rounded-2xl",
          "bg-white/[0.06] ring-1 ring-white/10 backdrop-blur",
          "px-4 py-3",
          "flex items-center justify-between"
        )}
      >
        {/* Left */}
        <a
          href={backHref}
          className={cn(
            "inline-flex items-center gap-3",
            "rounded-xl px-2 py-2",
            "text-sm font-semibold text-yellow-300 hover:text-yellow-200",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/70"
          )}
        >
          <span aria-hidden="true" className="text-lg">←</span>
          <span>{backLabel}</span>
        </a>

        {/* Right */}
        <div className="flex items-center gap-8">
          {prev ? (
            <a
              href={prev.href}
              className={cn(
                "inline-flex items-center gap-3",
                "rounded-xl px-2 py-2",
                "text-sm font-semibold text-white/55 hover:text-white/80",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/70"
              )}
              title={prev.label}
            >
              <span aria-hidden="true" className="text-lg">‹</span>
              <span>Anterior</span>
            </a>
          ) : (
            <span className="inline-flex items-center gap-3 text-sm font-semibold text-white/25 select-none">
              <span aria-hidden="true" className="text-lg">‹</span>
              <span>Anterior</span>
            </span>
          )}

          {next ? (
            <a
              href={next.href}
              className={cn(
                "inline-flex items-center gap-3",
                "rounded-xl px-2 py-2",
                "text-sm font-semibold text-white hover:text-white",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/70"
              )}
              title={next.label}
            >
              <span>Seguinte</span>
              <span aria-hidden="true" className="text-lg">›</span>
            </a>
          ) : (
            <span className="inline-flex items-center gap-3 text-sm font-semibold text-white/35 select-none">
              <span>Seguinte</span>
              <span aria-hidden="true" className="text-lg">›</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
