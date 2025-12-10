interface StaticHeroProps {
  imageSrc: string;
  mobileImageSrc?: string;
  alt?: string;
}

export default function StaticHero({ 
  imageSrc, 
  mobileImageSrc,
  alt = "DOMREALCE - Comunicação Visual" 
}: StaticHeroProps) {
  const mobileUrl = mobileImageSrc || imageSrc.replace('.webp', '-mobile.webp');
  
  return (
    <section className="relative w-full h-[70vh] min-h-[400px] max-h-[700px] md:h-[70vh] bg-black overflow-hidden">
      <img
        src={imageSrc}
        srcSet={`${mobileUrl} 800w, ${imageSrc} 1920w`}
        sizes="100vw"
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        decoding="async"
        fetchPriority="high"
        width={1920}
        height={800}
      />
    </section>
  );
}
