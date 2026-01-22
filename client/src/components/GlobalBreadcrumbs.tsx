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

  const crumbs = buildCrumbs(pathname || "");
  
  if (!crumbs || crumbs.length === 0) {
    return null;
  }

  return (
    <nav 
      aria-label="Breadcrumb" 
      className="py-3 px-4 text-sm bg-gray-900 border-b border-gray-800"
    >
      <ol className="container mx-auto flex items-center gap-2 flex-wrap">
        {crumbs.map((crumb, index) => (
          <li key={crumb.href + index} className="flex items-center gap-2">
            {index === 0 && <Home className="w-4 h-4 text-gray-400" />}
            {index > 0 && <ChevronRight className="w-4 h-4 text-gray-500" />}
            {crumb.isLast ? (
              <span className="text-brand-yellow font-medium">{crumb.label}</span>
            ) : (
              <Link 
                href={crumb.href} 
                className="text-gray-400 hover:text-white transition-colors"
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
