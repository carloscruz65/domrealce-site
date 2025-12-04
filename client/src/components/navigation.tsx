import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesMobileOpen, setIsServicesMobileOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fechar menu ao clicar fora (mobile)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const nav = document.querySelector("nav");
      if (isMenuOpen && nav && !nav.contains(target)) {
        setIsMenuOpen(false);
        setIsServicesMobileOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMenuOpen]);

  const isServicesActive =
    location === "/servicos" || location.startsWith("/servico-");

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 border-b border-brand-yellow ${
        isScrolled ? "bg-black" : "bg-black/90 backdrop-blur-md"
      }`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <img
              src="/public-objects/essenciais/1758147535288_domrealce-logo.png"
              alt="DOMREALCE Logo"
              className="h-14 w-auto"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-3 items-center">
            <Link
              href="/"
              className={`transition-all duration-300 font-medium px-3 py-2 rounded-md ${
                location === "/"
                  ? "bg-brand-yellow text-brand-dark"
                  : "text-white hover:text-brand-yellow"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Início
            </Link>

            <Link
              href="/sobre"
              className={`transition-all duration-300 font-medium px-3 py-2 rounded-md ${
                location === "/sobre"
                  ? "bg-brand-yellow text-brand-dark"
                  : "text-white hover:text-brand-turquoise"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre
            </Link>

            {/* Serviços com DROPDOWN (desktop) */}
            <div className="relative group">
              <button
                type="button"
                className={`transition-all duration-300 font-medium px-3 py-2 rounded-md flex items-center gap-1 ${
                  isServicesActive
                    ? "bg-brand-yellow text-brand-dark"
                    : "text-white hover:text-brand-coral"
                }`}
              >
                Serviços
                <span className="text-xs">▾</span>
              </button>

              <div className="absolute left-0 top-full w-72 bg-black border border-[#333] rounded-xl shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 z-50">
                <ul className="py-2">
                  <li>
                    <Link
                      href="/servico-design-grafico"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#222] hover:text-brand-yellow"
                    >
                      Design Gráfico
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/servico-impressao-digital"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#222] hover:text-brand-yellow"
                    >
                      Impressão Digital
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/servico-papel-parede"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#222] hover:text-brand-yellow"
                    >
                      Papel de Parede
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/servico-telas-artisticas"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#222] hover:text-brand-yellow"
                    >
                      Telas Artísticas
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/servico-autocolantes"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#222] hover:text-brand-yellow"
                    >
                      Autocolantes e Etiquetas
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/servico-decoracao-viaturas"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#222] hover:text-brand-yellow"
                    >
                      Decoração de Viaturas
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/servico-espacos-comerciais"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#222] hover:text-brand-yellow"
                    >
                      Espaços Comerciais
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/servico-peliculas-protecao-solar"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#222] hover:text-brand-yellow"
                    >
                      Películas de Proteção Solar
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <Link
              href="/portfolio"
              className={`transition-all duration-300 font-medium px-3 py-2 rounded-md ${
                location === "/portfolio"
                  ? "bg-brand-yellow text-brand-dark"
                  : "text-white hover:text-brand-yellow"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Portfólio
            </Link>

            <Link
              href="/loja"
              className={`transition-all duration-300 font-medium px-3 py-2 rounded-md ${
                location === "/loja"
                  ? "bg-brand-yellow text-brand-dark"
                  : "text-white hover:text-brand-turquoise"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Loja
            </Link>

            <Link
              href="/noticias"
              className={`transition-all duration-300 font-medium px-3 py-2 rounded-md ${
                location === "/noticias"
                  ? "bg-brand-yellow text-brand-dark"
                  : "text-white hover:text-brand-green"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Notícias
            </Link>

            <Link
              href="/contactos"
              className={`transition-all duration-300 font-medium px-3 py-2 rounded-md ${
                location === "/contactos"
                  ? "bg-brand-yellow text-brand-dark"
                  : "text-white hover:text-brand-coral"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contactos
            </Link>

            {/* Cart Button */}
            <Link
              href="/carrinho"
              className={`transition-all duration-300 font-medium px-3 py-2 rounded-md flex items-center gap-2 bg-gradient-to-r from-brand-coral to-brand-turquoise hover:from-brand-turquoise hover:to-brand-coral ${
                location === "/carrinho"
                  ? "text-black"
                  : "text-black hover:text-black"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingCart className="h-4 w-4" />
              Carrinho
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-brand-coral/20"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              if (!isMenuOpen) setIsServicesMobileOpen(false);
            }}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-2">
              <Link
                href="/"
                className={`transition-all duration-300 font-medium py-3 px-4 rounded-md text-left ${
                  location === "/"
                    ? "bg-brand-yellow text-brand-dark"
                    : "text-white hover:text-brand-yellow"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Início
              </Link>

              <Link
                href="/sobre"
                className={`transition-all duration-300 font-medium py-3 px-4 rounded-md text-left ${
                  location === "/sobre"
                    ? "bg-brand-yellow text-brand-dark"
                    : "text-white hover:text-brand-turquoise"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre
              </Link>

              {/* Serviços com SUBMENU (mobile) */}
              <div className="rounded-md bg-black/40 border border-gray-800">
                <button
                  type="button"
                  className={`w-full text-left transition-all duration-300 font-medium py-3 px-4 rounded-md flex items-center justify-between ${
                    location.startsWith("/servico-")
                      ? "bg-brand-yellow text-brand-dark"
                      : "text-white"
                  }`}
                  onClick={() =>
                    setIsServicesMobileOpen((prev) => !prev)
                  }
                >
                  <span>Serviços</span>
                  <span className="text-xs">
                    {isServicesMobileOpen ? "▴" : "▾"}
                  </span>
                </button>

                {isServicesMobileOpen && (
                  <div className="border-t border-gray-800">
                    <div className="flex flex-col py-1">
                      <Link
                        href="/servico-design-grafico"
                        className="px-6 py-2 text-sm text-gray-200 hover:bg-[#222] hover:text-brand-yellow"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsServicesMobileOpen(false);
                        }}
                      >
                        Design Gráfico
                      </Link>
                      <Link
                        href="/servico-impressao-digital"
                        className="px-6 py-2 text-sm text-gray-200 hover:bg-[#222] hover:text-brand-yellow"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsServicesMobileOpen(false);
                        }}
                      >
                        Impressão Digital
                      </Link>
                      <Link
                        href="/servico-papel-parede"
                        className="px-6 py-2 text-sm text-gray-200 hover:bg-[#222] hover:text-brand-yellow"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsServicesMobileOpen(false);
                        }}
                      >
                        Papel de Parede
                      </Link>
                      <Link
                        href="/servico-telas-artisticas"
                        className="px-6 py-2 text-sm text-gray-200 hover:bg-[#222] hover:text-brand-yellow"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsServicesMobileOpen(false);
                        }}
                      >
                        Telas Artísticas
                      </Link>
                      <Link
                        href="/servico-autocolantes"
                        className="px-6 py-2 text-sm text-gray-200 hover:bg-[#222] hover:text-brand-yellow"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsServicesMobileOpen(false);
                        }}
                      >
                        Autocolantes e Etiquetas
                      </Link>
                      <Link
                        href="/servico-decoracao-viaturas"
                        className="px-6 py-2 text-sm text-gray-200 hover:bg-[#222] hover:text-brand-yellow"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsServicesMobileOpen(false);
                        }}
                      >
                        Decoração de Viaturas
                      </Link>
                      <Link
                        href="/servico-espacos-comerciais"
                        className="px-6 py-2 text-sm text-gray-200 hover:bg-[#222] hover:text-brand-yellow"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsServicesMobileOpen(false);
                        }}
                      >
                        Espaços Comerciais
                      </Link>
                      <Link
                        href="/servico-peliculas-protecao-solar"
                        className="px-6 py-2 text-sm text-gray-200 hover:bg-[#222] hover:text-brand-yellow"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsServicesMobileOpen(false);
                        }}
                      >
                        Películas de Proteção Solar
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/portfolio"
                className={`transition-all duration-300 font-medium py-3 px-4 rounded-md text-left ${
                  location === "/portfolio"
                    ? "bg-brand-yellow text-brand-dark"
                    : "text-white hover:text-brand-yellow"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Portfólio
              </Link>

              <Link
                href="/loja"
                className={`transition-all duration-300 font-medium py-3 px-4 rounded-md text-left ${
                  location === "/loja"
                    ? "bg-brand-yellow text-brand-dark"
                    : "text-white hover:text-brand-turquoise"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Loja
              </Link>

              <Link
                href="/noticias"
                className={`transition-all duration-300 font-medium py-3 px-4 rounded-md text-left ${
                  location === "/noticias"
                    ? "bg-brand-yellow text-brand-dark"
                    : "text-white hover:text-brand-green"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Notícias
              </Link>

              <Link
                href="/contactos"
                className={`transition-all duration-300 font-medium py-3 px-4 rounded-md text-left ${
                  location === "/contactos"
                    ? "bg-brand-yellow text-brand-dark"
                    : "text-white hover:text-brand-coral"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contactos
              </Link>

              {/* Cart Button Mobile */}
              <Link
                href="/carrinho"
                className={`transition-all duration-300 font-medium py-3 px-4 rounded-md text-left flex items-center gap-2 bg-gradient-to-r from-brand-coral to-brand-turquoise hover:from-brand-turquoise hover:to-brand-coral ${
                  location === "/carrinho"
                    ? "text-black"
                    : "text-black hover:text-black"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingCart className="h-4 w-4" />
                Carrinho
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
