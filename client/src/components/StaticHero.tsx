import { useEffect, useRef } from "react";

interface StaticHeroProps {
  imageSrc: string;
  imageSrcMobile?: string;
  alt?: string;
  priority?: boolean;
}

export default function StaticHero({
  imageSrc,
  imageSrcMobile,
  alt = "DOMREALCE - Comunicação Visual",
  priority = false,
}: StaticHeroProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (priority && imgRef.current) {
      imgRef.current.setAttribute("fetchpriority", "high");
    }
  }, [priority]);

  return (
    <section className="relative w-full overflow-hidden bg-black">
      {/* HERO
          Mobile: ganha altura suficiente para “segurar” o hero sem a secção seguinte entrar logo
          Desktop: mantém 16/9 + max height */}
      <div className="relative w-full min-h-[85vh] md:min-h-0 md:aspect-[16/9] md:max-h-[85vh]">
        <picture>
          {imageSrcMobile && (
            <source media="(max-width: 768px)" srcSet={imageSrcMobile} />
          )}
          <img
            ref={imgRef}
            src={imageSrc}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover"
            loading={priority ? "eager" : "lazy"}
            decoding="async"
          />
        </picture>

        {/* Overlay leve, mas com gradiente (melhor leitura em mobile) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/65" />

        {/* CONTEÚDO */}
        <div className="absolute inset-0 z-10 flex flex-col justify-between">
          {/* TOPO — badge + texto
              Mobile: centrado
              Desktop: à esquerda */}
          <div className="px-6 pt-7 sm:pt-8 md:px-10 md:pt-12 w-full max-w-[900px] mx-auto md:mx-0 text-center md:text-left">
            {/* Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur mx-auto md:mx-0">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-yellow" />
              Viaturas | Montras | Painéis | Impressão Digital
            </div>

            {/* Título (largura controlada no mobile para não partir mal) */}
            <h1 className="text-4xl sm:text-5xl md:text-4xl lg:text-5xl font-semibold leading-tight text-white max-w-[22ch] mx-auto md:mx-0">
              Comunicação visual profissional
            </h1>

            {/* Descrição */}
            <p className="mt-4 max-w-xl text-sm sm:text-base text-white/85 mx-auto md:mx-0">
              Do design à produção e aplicação, criamos soluções visuais para marcas, espaços e viaturas.
            </p>
          </div>

          {/* FUNDO — botões
              Mobile: empilhados e largura total (touch-friendly)
              Desktop: em linha */}
          <div className="pb-20 sm:pb-12 md:pb-10 flex justify-center">
            <div className="flex flex-col sm:flex-row gap-4 w-full px-6 sm:w-auto sm:px-0 max-w-[420px]">
              <a
                href="/contactos#formulario"
                className="min-h-[48px] inline-flex items-center justify-center rounded-xl bg-brand-yellow px-6 text-base font-semibold text-black hover:bg-brand-yellow/90 transition w-full sm:w-auto"
              >
                Pedir orçamento
              </a>

              <a
                href="/#servicos"
                className="min-h-[48px] inline-flex items-center justify-center rounded-xl border border-white/40 bg-black/30 px-6 text-base font-semibold text-white hover:bg-black/50 transition w-full sm:w-auto"
              >
                Ver serviços
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}