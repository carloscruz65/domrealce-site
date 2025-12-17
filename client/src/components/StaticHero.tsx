interface StaticHeroProps {
  imageSrc: string; // versão desktop, ideal 1600–1920px
  mobileImageSrc?: string; // versão mobile, ideal 800–1000px
  alt?: string;
}

export default function StaticHero({
  imageSrc,
  mobileImageSrc,
  alt = "DOMREALCE - Comunicação Visual"
}: StaticHeroProps) {

  // fallback seguro: se não houver mobile image, usa desktop
  const mobileUrl =
    mobileImageSrc ||
    (imageSrc.endsWith(".webp")
      ? imageSrc.replace(".webp", "-mobile.webp")
      : imageSrc);

  return (
    <section className="relative w-full overflow-hidden bg-black">
      <img
        src={mobileUrl} // mobile primeiro para pre-render
        srcSet={`
          ${mobileUrl} 800w,
          ${imageSrc} 1600w,
          ${imageSrc} 1920w
        `}
        sizes="(max-width: 768px) 100vw, 100vw"
        alt={alt}
        className="w-full h-auto block object-cover"
        loading="eager"
        decoding="async"
        width={1920}
        height={900} // ajusta conforme a tua imagem real
      />
    </section>
  );
}