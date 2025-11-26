import { Link, useLocation } from "wouter";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const routeLabels: Record<string, string> = {
  "/": "Início",
  "/sobre": "Sobre",
  "/servicos": "Serviços",
  "/portfolio": "Portfólio",
  "/contactos": "Contactos",
  "/loja": "Loja",
  "/carrinho": "Carrinho",
  "/checkout": "Checkout",
  "/noticias": "Notícias",
  "/servico-design-grafico": "Design Gráfico",
  "/servico-impressao-digital": "Impressão Digital",
  "/servico-papel-parede": "Papel de Parede",
  "/servico-telas-artisticas": "Telas Artísticas",
  "/servico-autocolantes": "Autocolantes",
  "/servico-decoracao-viaturas": "Decoração de Viaturas",
  "/servico-espacos-comerciais": "Espaços Comerciais",
};

export default function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`bg-gray-900 py-3 mt-16 ${className}`}
    >
      <div className="container mx-auto px-4">
        <ol 
          className="flex items-center flex-wrap gap-1 text-sm"
          itemScope 
          itemType="https://schema.org/BreadcrumbList"
        >
          <li 
            className="flex items-center"
            itemProp="itemListElement" 
            itemScope 
            itemType="https://schema.org/ListItem"
          >
            <Link 
              href="/" 
              className="flex items-center text-gray-400 hover:text-brand-yellow transition-colors"
              itemProp="item"
            >
              <Home className="w-4 h-4 mr-1" />
              <span itemProp="name">Início</span>
            </Link>
            <meta itemProp="position" content="1" />
          </li>

          {items.map((item, index) => (
            <li 
              key={index} 
              className="flex items-center"
              itemProp="itemListElement" 
              itemScope 
              itemType="https://schema.org/ListItem"
            >
              <ChevronRight className="w-4 h-4 mx-2 text-gray-600" />
              {item.href ? (
                <Link 
                  href={item.href} 
                  className="text-gray-400 hover:text-brand-yellow transition-colors"
                  itemProp="item"
                >
                  <span itemProp="name">{item.label}</span>
                </Link>
              ) : (
                <span className="text-brand-yellow font-medium" itemProp="name">
                  {item.label}
                </span>
              )}
              <meta itemProp="position" content={String(index + 2)} />
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

export function useBreadcrumbs(): BreadcrumbItem[] {
  const [location] = useLocation();
  const items: BreadcrumbItem[] = [];
  
  if (location.startsWith("/servico-")) {
    items.push({ label: "Serviços", href: "/servicos" });
    const label = routeLabels[location] || location.replace("/servico-", "").replace(/-/g, " ");
    items.push({ label });
  } else if (location !== "/") {
    const label = routeLabels[location] || location.slice(1).replace(/-/g, " ");
    items.push({ label: label.charAt(0).toUpperCase() + label.slice(1) });
  }
  
  return items;
}
