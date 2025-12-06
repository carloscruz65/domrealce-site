import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import type { Slide } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import "./Slider.css";

interface SliderResponse {
  slides: Slide[];
}

export default function DynamicSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data, isLoading, error } = useQuery<SliderResponse>({
    queryKey: ["/api/slider"],
    queryFn: async () => {
      const res = await fetch("/api/slider");
      if (!res.ok) throw new Error("Erro ao carregar slides");
      return res.json();
    },
  });

  // 👉 Filtrar apenas slides ativos e garantir que o 2.º vem em primeiro
  const activeSlides = useMemo(() => {
    const base = data?.slides?.filter((s) => s.active) ?? [];
    if (base.length > 1) {
      const clone = [...base];
      const second = clone[1];
      clone.splice(1, 1);
      clone.unshift(second);
      return clone;
    }
    return base;
  }, [data?.slides]);

  // Auto-advance
  useEffect(() => {
    if (activeSlides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [activeSlides.length]);

  // Estado de loading – mantém um “hero” com altura estável
  if (isLoading) {
    return (
      <div className="slider">
        <div className="slide active loading">
          <div className="slide-bg-placeholder" />
          <div className="text-overlay">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-700/70 rounded mb-3"></div>
              <div className="h-6 bg-gray-700/60 rounded mb-5"></div>
              <div className="flex justify-center gap-4">
                <div className="h-10 w-32 bg-gray-700/60 rounded"></div>
                <div className="h-10 w-32 bg-gray-700/60 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Erro
  if (error || activeSlides.length === 0) {
    return (
      <div className="slider">
        <div className="slide active fallback">
          <div className="slide-bg-placeholder" />
          <div className="text-overlay">
            <h1>Realce a sua marca com criatividade e alta definição</h1>
            <p>
              Transformamos as suas ideias em comunicação visual de excelência:
              design gráfico, impressão digital, papel de parede e soluções
              personalizadas para empresas e particulares.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="slider">
      {activeSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`slide ${index === currentSlide ? "active" : ""}`}
        >
          {/* ✅ Imagem real (melhor para LCP do que background-image) */}
          <img
            src={slide.image}
            alt={slide.title || "Slide DOMREALCE"}
            className="slide-bg-image"
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            /* ajuda o browser a priorizar o primeiro slide */
            {...(index === 0 ? { fetchpriority: "high" as any } : {})}
            width={1920}
            height={900}
          />

          <div className="text-overlay">
            <h1>{slide.title}</h1>
            <p>{slide.text}</p>

            {/* Botões só nos outros slides, como já tinhas */}
            {index !== 0 && (
              <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3 w-full max-w-[260px] sm:max-w-sm md:max-w-md mx-auto">
                <Link href="/servicos" className="flex-1">
                  <button className="w-full px-3 py-2 rounded-md font-medium text-xs sm:text-sm transition text-center bg-brand-yellow text-black hover:bg-yellow-500">
                    Explorar Serviços
                  </button>
                </Link>
                <Link href="/contactos#formulario" className="flex-1">
                  <button className="w-full px-3 py-2 rounded-md font-medium text-xs sm:text-sm transition text-center border border-white text-white hover:bg-white hover:text-black">
                    Ver Portfólio
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Dots */}
      {activeSlides.length > 1 && (
        <div className="slider-dots">
          {activeSlides.map((_, index) => (
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
