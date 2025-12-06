import { useState, useEffect } from "react";
import { Link } from "wouter";   // ✅ Wouter SPA navigation
import type { Slide } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import "./Slider.css";

interface SliderResponse {
  slides: Slide[];
}

export default function DynamicSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data, isLoading, error } = useQuery<SliderResponse>({
    queryKey: ["/api/admin/slider"]
  });

  let activeSlides = data?.slides?.filter((slide: Slide) => slide.active) || [];

  // 👉 Forçar que o 2º slide (index 1) fique sempre em 1º
  if (activeSlides.length > 1) {
    const second = activeSlides.splice(1, 1)[0];
    activeSlides.unshift(second);
  }

  // Auto-advance slides every 3.5s
  useEffect(() => {
    if (activeSlides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
      }, 3500);import { useState, useEffect } from "react";
      import { Link } from "wouter";
      import type { Slide } from "@shared/schema";
      import { useQuery } from "@tanstack/react-query";
      import "./Slider.css";

      interface SliderResponse {
        slides: Slide[];
      }

      // imagens fixas na AppStorage (ordem visual do slider)
      const APP_IMAGES = [
        {
          desktop: "/appstorage/honda-midas.webp",
          mobile: "/appstorage/honda-midas-mobile.webp",
        },
        {
          desktop: "/appstorage/bem-vindo-domrealce.webp",
          mobile: "/appstorage/bem-vindo-domrealce-mobile.webp",
        },
        {
          desktop: "/appstorage/camiao-corrida-reboconorte.webp",
          mobile: "/appstorage/camiao-corrida-reboconorte-mobile.webp",
        },
        {
          desktop: "/appstorage/deco-montra-river-cais-de-gaia.webp",
          mobile: "/appstorage/deco-montra-river-cais-de-gaia-mobile.webp",
        },
        {
          desktop: "/appstorage/papel-de-parede-cesar.webp",
          mobile: "/appstorage/papel-de-parede-cesar-mobile.webp",
        },
        {
          desktop: "/appstorage/viatura-pao-de-lo-forno.webp",
          mobile: "/appstorage/viatura-pao-de-lo-forno-mobile.webp",
        },
      ];

      export default function DynamicSlider() {
        const [currentSlide, setCurrentSlide] = useState(0);
        const [isMobile, setIsMobile] = useState(
          typeof window !== "undefined" ? window.innerWidth <= 767 : false
        );

        const { data, isLoading, error } = useQuery<SliderResponse>({
          queryKey: ["/api/admin/slider"],
        });

        // deteta mobile / desktop
        useEffect(() => {
          function handleResize() {
            setIsMobile(window.innerWidth <= 767);
          }
          window.addEventListener("resize", handleResize);
          return () => window.removeEventListener("resize", handleResize);
        }, []);

        let activeSlides = data?.slides?.filter((slide: Slide) => slide.active) || [];

        // manter truque do "2º slide em 1º"
        if (activeSlides.length > 1) {
          const second = activeSlides.splice(1, 1)[0];
          activeSlides.unshift(second);
        }

        // autoplay
        useEffect(() => {
          if (activeSlides.length > 1) {
            const interval = setInterval(() => {
              setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
            }, 3500);
            return () => clearInterval(interval);
          }
        }, [activeSlides.length]);

        // LOADING
        if (isLoading) {
          return (
            <div className="slider">
              <div className="slide active loading">
                <div className="text-overlay">
                  <div className="animate-pulse">
                    <div className="h-12 bg-gray-700 rounded mb-4"></div>
                    <div className="h-6 bg-gray-700 rounded mb-6"></div>
                    <div className="flex justify-center gap-4">
                      <div className="h-12 w-32 bg-gray-700 rounded"></div>
                      <div className="h-12 w-32 bg-gray-700 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        // ERRO
        if (error || activeSlides.length === 0) {
          return (
            <div className="slider">
              <div className="slide active fallback">
                <div className="text-overlay">
                  <h1>Realce a sua marca com criatividade e alta definição</h1>
                  <p>
                    Transformamos as suas ideias em comunicação visual de excelência.
                    Design gráfico, impressão digital, papel de parede e soluções
                    personalizadas para empresas e particulares.
                  </p>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="slider">
            {activeSlides.map((slide: Slide, index: number) => {
              const imgSet = APP_IMAGES[index % APP_IMAGES.length];

              return (
                <div
                  key={slide.id}
                  className={`slide ${index === currentSlide ? "active" : ""}`}
                >
                  {/* 🔥 agora imagem real, não backgroundImage */}
                  <img
                    className="slide-bg-image"
                    src={isMobile ? imgSet.mobile : imgSet.desktop}
                    alt={slide.title}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />

                  <div className="text-overlay">
                    <h1>{slide.title}</h1>
                    <p>{slide.text}</p>

                    {/* Botões */}
                    {index !== 0 && (
                      <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3 w-full max-w-[260px] sm:max-w-sm md:max-w-md mx-auto">
                        <Link href="/servicos" className="flex-1">
                          <button className="w-full px-3 py-2 rounded-md font-medium text-xs sm:text-sm transition text-center bg-brand-yellow text-black hover:bg-yellow-500">
                            Explorar Serviços
                          </button>
                        </Link>
                        <Link href="/portfolio" className="flex-1">
                          <button className="w-full px-3 py-2 rounded-md font-medium text-xs sm:text-sm transition text-center border border-white text-white hover:bg-white hover:text-black">
                            Ver Portfólio
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

      return () => clearInterval(interval);
    }
  }, [activeSlides.length]);

  // Loading state
  if (isLoading) {
    return (
      <div className="slider">
        <div className="slide active loading">
          <div className="text-overlay">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-700 rounded mb-4"></div>
              <div className="h-6 bg-gray-700 rounded mb-6"></div>
              <div className="flex justify-center gap-4">
                <div className="h-12 w-32 bg-gray-700 rounded"></div>
                <div className="h-12 w-32 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="slider">
        <div className="slide active fallback">
          <div className="text-overlay">
            <h1>Realce sua marca com criatividade e alta definição</h1>
            <p>
              Transformamos as suas ideias em comunicação visual de excelência.
              Design gráfico, impressão digital, papel de parede e soluções
              personalizadas para empresas e particulares.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Sem slides
  if (activeSlides.length === 0) {
    return (
      <div className="slider">
        <div className="slide active fallback">
          <div className="text-overlay">
            <h1>Realce sua marca com criatividade e alta definição</h1>
            <p>
              Transformamos as suas ideias em comunicação visual de excelência.
              Design gráfico, impressão digital, papel de parede e soluções
              personalizadas para empresas e particulares.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="slider">
      {activeSlides.map((slide: Slide, index: number) => (
        <div
          key={slide.id}
          className={`slide ${index === currentSlide ? "active" : ""}`}
          style={{
            backgroundImage: `url('${slide.image}')`
          }}
        >
          <div className="text-overlay">
            <h1>{slide.title}</h1>
            <p>{slide.text}</p>

            {/* ✅ Botões lado a lado - corrigido para mobile/tablet */}
            {index !== 0 && (
              <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3 w-full max-w-[260px] sm:max-w-sm md:max-w-md mx-auto">
                <Link href="/servicos" className="flex-1">
                  <button className="w-full px-3 py-2 rounded-md font-medium text-xs sm:text-sm transition text-center bg-brand-yellow text-black hover:bg-yellow-500">
                    Explorar Serviços
                  </button>
                </Link>
                <Link href="/portfolio" className="flex-1">
                  <button className="w-full px-3 py-2 rounded-md font-medium text-xs sm:text-sm transition text-center border border-white text-white hover:bg-white hover:text-black">
                    Ver Portfólio
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Navigation dots */}
      {activeSlides.length > 1 && (
        <div className="slider-dots">
          {activeSlides.map((_: Slide, index: number) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
              data-testid={`slider-dot-${index}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}