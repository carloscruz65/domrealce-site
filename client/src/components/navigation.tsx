import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import logoDomrealce from "@/assets/domrealce-logo.png";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesMobileOpen, setIsServicesMobileOpen] = useState(false);
  const [location] = useLocation();

  // 🔢 Número de produtos no carrinho
  // 👉 Quando tiveres o store/contexto do carrinho, substituis isto por algo real.
  //
  // Exemplos futuros:
  //   const { items } = useCart();
  //   const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  //
  const cartCount = 0;

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

  const baseLinkClasses =
    "relative transition-all duration-300 font-medium px-3 py-2 rounded-full text-sm text-white/80 hover:text-white hover:bg-white/5";

  const activeLinkClasses = "text-brand-yellow bg-white/5";

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 border-b border-white/10 ${
        isScrolled
          ? "bg-black/95 shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
          : "bg-black/70 backdrop-blur-xl"
      }`}
    >
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* LOGO */}
          <Link href="/" className="flex items-center space-x-3">
            <img
              src={logoDomrealce}
              alt="DOMREALCE Logo"
              className="h-14 w-auto"
            />
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-black/40 border border-white/5 backdrop-blur">
            <Link
              href="/"
              className={`${baseLinkClasses} ${
                location === "/" ? activeLinkClasses : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Início
            </Link>

            <Link
              href="/sobre"
              className={`${baseLinkClasses} ${
                location === "/sobre" ? activeLinkClasses : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre
            </Link>

            {/* Serviços com DROPDOWN (desktop) */}
            <div className="relative group">
              <button
                type="button"
                className={`${baseLinkClasses} flex items-center gap-1 ${
                  isServicesActive ? activeLinkClasses : ""
                }`}
              >
                Serviços
                <span className="text-xs">▾</span>
                {isServicesActive && (
                  <span className="absolute left-3 right-3 -bottom-1 h-[2px] rounded-full bg-brand-yellow/80" />
                )}
              </button>

              <div className="absolute left-0 top-full mt-2 w-72 bg-black border border-[#333] rounded-xl shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 z-50">
                <ul className="py-2">
                  <li>
                    <Link
                      href="/servico-design-grafico"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#181818] hover:text-brand-yellow"
                    >
                      Design Gráfico
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/servico-impressao-digital"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#181818] hover:text-brand-yellow"
                    >
                      Impressão Digital
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/servico-papel-parede"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#181818] hover:text-brand-yellow"
                    >
                      Papel de Parede
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/servico-telas-artisticas"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#181818] hover:text-brand-yellow"
                    >
                      Telas Artísticas
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/servico-autocolantes"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#181818] hover:text-brand-yellow"
                    >
                      Autocolantes e Etiquetas
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/servico-decoracao-viaturas"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#181818] hover:text-brand-yellow"
                    >
                      Decoração de Viaturas
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/servico-espacos-comerciais"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#181818] hover:text-brand-yellow"
                    >
                      Espaços Comerciais
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/servico-peliculas-protecao-solar"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#181818] hover:text-brand-yellow"
                    >
                      Películas de Proteção Solar
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <Link
              href="/portfolio"
              className={`${baseLinkClasses} ${
                location === "/portfolio" ? activeLinkClasses : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Portfólio
            </Link>

            <Link
              href="/loja"
              className={`${baseLinkClasses} ${
                location === "/loja" ? activeLinkClasses : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Loja
            </Link>

            <Link
              href="/noticias"
              className={`${baseLinkClasses} ${
                location === "/noticias" ? activeLinkClasses : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Notícias
            </Link>

            <Link
              href="/contactos"
              className={`${baseLinkClasses} ${
                location === "/contactos" ? activeLinkClasses : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contactos
            </Link>

            {/* Cart Button – com badge */}
            <Link
              href="/carrinho"
              className={`ml-1 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                location === "/carrinho"
                  ? "bg-brand-yellow text-brand-dark shadow-lg shadow-brand-yellow/30"
                  : "bg-brand-yellow text-black hover:bg-brand-yellow/90 hover:shadow-lg hover:shadow-brand-yellow/30"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="relative">
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[18px] px-1 h-[18px] rounded-full bg-black text-brand-yellow text-[10px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span>Carrinho</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-white/10"
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
          <div className="md:hidden mt-4 pb-4 border-t border-white/10 pt-3">
            <div className="flex flex-col space-y-2">
              <Link
                href="/"
                className={`transition-all duration-300 font-medium py-3 px-4 rounded-lg text-left ${
                  location === "/"
                    ? "bg-white/5 text-brand-yellow"
                    : "text-white/80 hover:bg-white/5 hover:text-white"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Início
              </Link>

              <Link
                href="/sobre"
                className={`transition-all duration-300 font-medium py-3 px-4 rounded-lg text-left ${
                  location === "/sobre"
                    ? "bg-white/5 text-brand-turquoise"
                    : "text-white/80 hover:bg-white/5 hover:text-white"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre
              </Link>

              {/* Serviços com SUBMENU (mobile) */}
              <div className="rounded-lg bg-black/60 border border-gray-800">
                <button
                  type="button"
                  className={`w-full text-left transition-all duration-300 font-medium py-3 px-4 rounded-lg flex items-center justify-between ${
                    location.startsWith("/servico-")
                      ? "bg:white/5 text-brand-yellow"
                      : "text-white/80"
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
                        className="px-6 py-2 text-sm text-gray-200 hover:bg-[#181818] hover:text-brand-yellow"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsServicesMobileOpen(false);
                        }}
                      >
                        Design Gráfico
                      </Link>
                      <Link
                        href="/servico-impressao-digital"
                        className="px-6 py-2 text-sm text-gray-200 hover:bg-[#181818] hover:text-brand-yellow"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsServicesMobileOpen(false);
                        }}
                      >
                        Impressão Digital
                      </Link>
                      <Link
                        href="/servico-papel-parede"
                        className="px-6 py-2 text-sm text-gray-200 hover:bg-[#181818] hover:text-brand-yellow"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsServicesMobileOpen(false);
                        }}
                      >
                        Papel de Parede
                      </Link>
                      <Link
                        href="/servico-telas-artisticas"
                        className="px-6 py-2 text-sm text-gray-200 hover:bg-[#181818] hover:text-brand-yellow"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsServicesMobileOpen(false);
                        }}
                      >
                        Telas Artísticas
                      </Link>
                      <Link
                        href="/servico-autocolantes"
                        className="px-6 py-2 text-sm text-gray-200 hover:bg-[#181818] hover:text-brand-yellow"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsServicesMobileOpen(false);
                        }}
                      >
                        Autocolantes e Etiquetas
                      </Link>
                      <Link
                        href="/servico-decoracao-viaturas"
                        className="px-6 py-2 text-sm text-gray-200 hover:bg-[#181818] hover:text-brand-yellow"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsServicesMobileOpen(false);
                        }}
                      >
                        Decoração de Viaturas
                      </Link>
                      <Link
                        href="/servico-espacos-comerciais"
                        className="px-6 py-2 text-sm text-gray-200 hover:bg-[#181818] hover:text-brand-yellow"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsServicesMobileOpen(false);
                        }}
                      >
                        Espaços Comerciais
                      </Link>
                      <Link
                        href="/servico-peliculas-protecao-solar"
                        className="px-6 py-2 text-sm text-gray-200 hover:bg-[#181818] hover:text-brand-yellow"
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
                className={`transition-all duration-300 font-medium py-3 px-4 rounded-lg text-left ${
                  location === "/portfolio"
                    ? "bg-white/5 text-brand-yellow"
                    : "text-white/80 hover:bg-white/5 hover:text-white"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Portfólio
              </Link>

              <Link
                href="/loja"
                className={`transition-all duration-300 font-medium py-3 px-4 rounded-lg text-left ${
                  location === "/loja"
                    ? "bg-white/5 text-brand-turquoise"
                    : "text-white/80 hover:bg-white/5 hover:text-white"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Loja
              </Link>

              <Link
                href="/noticias"
                className={`transition-all duration-300 font-medium py-3 px-4 rounded-lg text-left ${
                  location === "/noticias"
                    ? "bg-white/5 text-brand-green"
                    : "text-white/80 hover:bg-white/5 hover:text-white"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Notícias
              </Link>

              <Link
                href="/contactos"
                className={`transition-all duration-300 font-medium py-3 px-4 rounded-lg text-left ${
                  location === "/contactos"
                    ? "bg-white/5 text-brand-coral"
                    : "text-white/80 hover:bg-white/5 hover:text-white"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contactos
              </Link>

              {/* Cart Button Mobile – com badge */}
              <Link
                href="/carrinho"
                className={`transition-all duration-300 font-semibold py-3 px-4 rounded-lg text-left flex items-center gap-2 ${
                  location === "/carrinho"
                    ? "bg-brand-yellow text-black shadow-lg shadow-brand-yellow/30"
                    : "bg-brand-yellow text-black hover:bg-brand-yellow/90"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="relative">
                  <ShoppingCart className="h-4 w-4" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-[18px] px-1 h-[18px] rounded-full bg-black text-brand-yellow text-[10px] font-bold flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span>Carrinho</span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
