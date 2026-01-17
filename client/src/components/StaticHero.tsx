import { useEffect, useRef } from "react";
import { Link } from "wouter";

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
      {/* HERO */}
      <div className="relative w-full aspect-[16/9] max-h-[85vh]">
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

        {/* Overlay MUITO leve (só para garantir leitura futura) */}
        <div className="absolute inset-0 bg-black/20" />

        {/* CONTEÚDO */}
        <div className="absolute inset-0 z-10 flex flex-col justify-between">
          {/* TOPO — badge + texto (esquerda) */}
          <div className="px-6 pt-8 md:px-10 md:pt-12 w-full max-w-[900px]">
            {/* Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-yellow" />
              Viaturas | Montras | Painéis | Impressão Digital
            </div>

            {/* Título */}
            <h1 className="text-4xl md:text-4xl lg:text-5xl font-semibold leading-tight text-white">
              <span className="block">Comunicação visual profissional</span>
            </h1>

            {/* Descrição */}
            <p className="mt-4 max-w-xl text-sm md:text-base text-white/85">
              Do design à produção e aplicação, criamos soluções visuais para marcas, espaços e viaturas.
            </p>
          </div>

          {/* FUNDO — botões centrados em baixo */}
          <div className="pb-8 md:pb-10 flex justify-center">
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contactos#formulario">
                <a className="min-h-[48px] inline-flex items-center justify-center rounded-xl bg-brand-yellow px-6 text-base font-semibold text-black hover:bg-brand-yellow/90 transition">
                  Pedir orçamento
                </a>
              </Link>

              <a
                href="/#servicos"
                className="min-h-[48px] inline-flex items-center justify-center rounded-xl border border-white/40 bg-black/30 px-6 text-base font-semibold text-white hover:bg-black/50 transition"
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