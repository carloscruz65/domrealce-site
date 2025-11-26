import { useState, useEffect } from "react";
import { Link } from "wouter";
import type { Slide } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import "./Slider.css";

interface SliderResponse {
  slides: Slide[];
}

export default function DynamicSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set([0]));

  const { data, isLoading, error } = useQuery<SliderResponse>({
    queryKey: ["/api/slider"],
    queryFn: async () => {
      const res = await fetch("/api/slider");
      if (!res.ok) throw new Error("Erro ao carregar slides");
      return res.json();
    }
  });

  let activeSlides = data?.slides?.filter((slide: Slide) => slide.active) || [];

  if (activeSlides.length > 1) {
    const second = activeSlides.splice(1, 1)[0];
    activeSlides.unshift(second);
  }

  useEffect(() => {
    if (activeSlides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [activeSlides.length]);

  useEffect(() => {
    if (activeSlides.length > 0) {
      const nextSlide = (currentSlide + 1) % activeSlides.length;
      if (!imagesLoaded.has(nextSlide)) {
        const img = new Image();
        img.src = activeSlides[nextSlide].image;
        img.onload = () => {
          setImagesLoaded(prev => new Set(prev).add(nextSlide));
        };
      }
    }
  }, [currentSlide, activeSlides.length]);

  if (isLoading) {
    return (
      <div className="slider" style={{ aspectRatio: '16/9', minHeight: '100vh' }}>
        <div className="slide active loading">
          <div className="text-overlay">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-700 rounded mb-4 w-3/4 mx-auto"></div>
              <div className="h-6 bg-gray-700 rounded mb-6 w-1/2 mx-auto"></div>
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

  if (error || activeSlides.length === 0) {
    return (
      <div className="slider" style={{ aspectRatio: '16/9', minHeight: '100vh' }}>
        <div className="slide active fallback">
          <img
            src="/inicio/Imagem-1.jpg"
            alt="DOMREALCE - Comunicação Visual"
            className="slide-image"
            width={1920}
            height={1080}
            loading="eager"
            decoding="async"
          />
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
    <div className="slider" style={{ aspectRatio: '16/9', minHeight: '100vh' }}>
      {activeSlides.map((slide: Slide, index: number) => (
        <div
          key={slide.id}
          className={`slide ${index === currentSlide ? "active" : ""}`}
        >
          <img
            src={slide.image}
            alt={slide.title || "DOMREALCE - Comunicação Visual"}
            className="slide-image"
            width={1920}
            height={1080}
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
          />
          <div className="text-overlay">
            <h1>{slide.title}</h1>
            <p>{slide.text}</p>

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

      {activeSlides.length > 1 && (
        <div className="slider-dots">
          {activeSlides.map((_: Slide, index: number) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
              data-testid={`slider-dot-${index}`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
