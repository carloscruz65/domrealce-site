import { Link, useLocation } from "wouter";
import { ChevronRight, Home } from "lucide-react";
import { SITE, SERVICES, type PageNode } from "@/config/navigationMap";

interface Crumb {
  label: string;
  href: string;
  isLast: boolean;
}

const ALL_PAGES: PageNode[] = [...SITE, ...SERVICES];

// 🔧 liga/desliga aqui (para testar)
const DEBUG = false;

function normalizePath(path: string) {
  if (!path) return "/";
  let clean = path.split("?")[0].split("#")[0];
  if (clean.length > 1 && clean.endsWith("/")) clean = clean.slice(0, -1);
  return clean;
}

function findPageByHref(href: string): PageNode | undefined {
  const target = normalizePath(href);
  return ALL_PAGES.find((p) => normalizePath(p.href) === target);
}

function buildCrumbs(rawPathname: string): Crumb[] | null {
  const pathname = normalizePath(rawPathname);

  if (!pathname || pathname === "/") return null;

  // ❌ /servicos não existe (é só agrupador no menu)
  // Portanto não mostramos breadcrumbs aqui
  if (pathname === "/servicos") {
    return null;
  }

  // ✅ formato A: /servicos/... (se existir algum legacy link)
  if (pathname.startsWith("/servicos/")) {
    const service = SERVICES.find((s) => normalizePath(s.href) === pathname);
    if (service) {
      return [
        { label: "Início", href: "/", isLast: false },
        // ✅ removido "Serviços"
        { label: service.label, href: service.href, isLast: true },
      ];
    }
  }

  // ✅ formato B: /servico-...
  if (pathname.startsWith("/servico-")) {
    const service = SERVICES.find((s) => normalizePath(s.href) === pathname);
    if (service) {
      return [
        { label: "Início", href: "/", isLast: false },
        // ✅ removido "Serviços"
        { label: service.label, href: service.href, isLast: true },
      ];
    }
  }

  // Páginas do SITE (Sobre, Contactos, etc.)
  const page = findPageByHref(pathname);
  if (page) {
    if (normalizePath(page.href) === "/") return null;

    return [
      { label: "Início", href: "/", isLast: false },
      { label: page.label, href: page.href, isLast: true },
    ];
  }

  return null;
}

export default function GlobalBreadcrumbs() {
  const [pathname] = useLocation();
  const cleanPath = normalizePath(pathname || "");
  const crumbs = buildCrumbs(pathname || "");

  // Debug visível (para confirmar montagem e caminho)
  if (DEBUG) {
    return (
      <div className="border-b border-white/10 bg-black/30">
        <div className="mx-auto max-w-6xl px-4 py-2 text-[12px] text-white/70">
          Breadcrumbs DEBUG: <span className="text-white/90">{cleanPath}</span>{" "}
          <span className="text-white/40">
            | crumbs: {crumbs ? crumbs.length : 0}
          </span>
        </div>

        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="py-2 px-4 text-sm">
            <ol className="mx-auto max-w-6xl flex items-center gap-2 flex-wrap text-white/70">
              {crumbs.map((crumb, index) => (
                <li key={crumb.href + index} className="flex items-center gap-2">
                  {index === 0 && <Home className="w-4 h-4 text-white/45" />}
                  {index > 0 && <ChevronRight className="w-4 h-4 text-white/35" />}

                  {crumb.isLast ? (
                    <span className="text-yellow-300 font-semibold">{crumb.label}</span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="text-white/55 hover:text-white/85 transition-colors no-underline focus:outline-none"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
      </div>
    );
  }

  // Produção (sem debug)
  if (!crumbs || crumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="py-3 px-4 text-sm">
      <ol className="mx-auto max-w-6xl flex items-center gap-2 flex-wrap text-white/70">
        {crumbs.map((crumb, index) => (
          <li key={crumb.href + index} className="flex items-center gap-2">
            {index === 0 && <Home className="w-4 h-4 text-white/45" />}
            {index > 0 && <ChevronRight className="w-4 h-4 text-white/35" />}

            {crumb.isLast ? (
              <span className="text-yellow-300 font-semibold">{crumb.label}</span>
            ) : (
              <Link
                href={crumb.href}
                className="text-white/55 hover:text-white/85 transition-colors no-underline focus:outline-none"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}