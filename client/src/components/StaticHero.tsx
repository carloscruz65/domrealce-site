interface StaticHeroProps {
  imageSrc: string;            // desktop: 1900x1069
  mobileImageSrc?: string;     // mobile: 800x800
  imageSrcMobile?: string;
  alt?: string;
  priority?: boolean;
}

export default function StaticHero({
  imageSrc,
  mobileImageSrc,
  imageSrcMobile,
  alt = "DOMREALCE - Comunicação Visual",
  priority = false,
}: StaticHeroProps) {
  const mobileUrl = imageSrcMobile || mobileImageSrc;

  return (
    <section className="relative w-full overflow-hidden bg-black">
      <div className="relative w-full aspect-square md:aspect-[16/9]">
        <picture>
          {/* ✅ MOBILE FORÇADO */}
          {mobileUrl && (
            <source
              media="(max-width: 768px)"
              srcSet={mobileUrl}
            />
          )}

          {/* DESKTOP */}
          <img
            src={imageSrc}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover"
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            width={1900}
            height={1069}
          />
        </picture>
      </div>
    </section>
  );
}