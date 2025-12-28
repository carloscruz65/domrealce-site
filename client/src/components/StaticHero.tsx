import { useEffect, useRef } from "react";

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
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (priority && imgRef.current) {
      // ✅ atributo HTML literal (Lighthouse-friendly)
      imgRef.current.setAttribute("fetchpriority", "high");
    }
  }, [priority]);

  return (
    <section className="relative w-full overflow-hidden bg-black">
      <div className="relative w-full aspect-square md:aspect-[16/9]">
        <picture>
          {/* MOBILE */}
          {mobileUrl && (
            <source media="(max-width: 768px)" srcSet={mobileUrl} />
          )}

          {/* DESKTOP / LCP */}
          <img
            ref={imgRef}
            src={imageSrc}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover"
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            width={1900}
            height={1069}
          />
        </picture>
      </div>
    </section>
  );
}