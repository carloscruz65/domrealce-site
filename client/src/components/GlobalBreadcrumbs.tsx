import { Link, useLocation } from "wouter";
import { ChevronRight, Home } from "lucide-react";
import { SITE, SERVICES, type PageNode } from "@/config/navigationMap";

interface Crumb {
  label: string;
  href: string;
  isLast: boolean;
}

const ALL_PAGES: PageNode[] = [...SITE, ...SERVICES];

function findPageByHref(href: string): PageNode | undefined {
  return ALL_PAGES.find((p) => p.href === href);
}

function buildCrumbs(pathname: string): Crumb[] | null {
  if (!pathname || pathname === "/") return null;

  const page = findPageByHref(pathname);
  
  if (pathname === "/servicos") {
    return [
      { label: "Início", href: "/", isLast: false },
      { label: "Serviços", href: "/servicos", isLast: true },
    ];
  }

  if (pathname.startsWith("/servico-")) {
    const service = SERVICES.find((s) => s.href === pathname);
    if (service) {
      return [
        { label: "Início", href: "/", isLast: false },
        { label: "Serviços", href: "/servicos", isLast: false },
        { label: service.label, href: service.href, isLast: true },
      ];
    }
    return null;
  }

  if (page && page.group === "site") {
    return [
      { label: "Início", href: "/", isLast: false },
      { label: page.label, href: page.href, isLast: true },
    ];
  }

  return null;
}

export default function GlobalBreadcrumbs() {
  const [pathname] = useLocation();

  if (!pathname) return null;

  const crumbs = buildCrumbs(pathname);
  if (!crumbs || crumbs.length === 0) return null;

  return (
    <nav 
      aria-label="Breadcrumb" 
      className="py-2 px-4 text-sm text-gray-400 bg-black/30"
    >
      <ol className="container mx-auto flex items-center gap-1 flex-wrap">
        {crumbs.map((crumb, index) => (
          <li key={crumb.href} className="flex items-center gap-1">
            {index === 0 && <Home className="w-3 h-3 mr-1" />}
            {index > 0 && <ChevronRight className="w-3 h-3 text-gray-600" />}
            {crumb.isLast ? (
              <span className="text-brand-yellow">{crumb.label}</span>
            ) : (
              <Link 
                href={crumb.href} 
                className="hover:text-white transition-colors"
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
