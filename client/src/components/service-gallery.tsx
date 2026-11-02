import { Fragment } from "react";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ServiceImage {
  src: string;
  alt: string;
  title?: string;
  href?: string;
  action?: string;
}

interface ServiceGalleryProps {
  title?: string;
  description?: string;
  images: ServiceImage[];
  columns?: 2 | 3 | 4;
}

export default function ServiceGallery({
  title = "Galeria de Trabalhos",
  description = "Confira alguns dos nossos projetos realizados nesta área",
  images,
  columns = 3,
}: ServiceGalleryProps) {
  const gridClass = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <section className="py-16 bg-black border-t border-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            <span className="text-brand-yellow">{title}</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Gallery Grid */}
        <div className={`grid ${gridClass} gap-6`}>
          {images.map((image, index) => {
            const card = (
              <Card
                className="h-full rounded-2xl overflow-hidden bg-gray-900/60 border border-gray-800 group-hover:border-brand-yellow hover:border-brand-yellow transition-all duration-300"
                data-testid={`gallery-image-${index}`}
              >
                <CardContent className="p-0">
                  <div className="aspect-[4/3] w-full overflow-hidden">
                    <img src={image.src} alt={image.alt} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  {(image.title || image.href) && (
                    <div className="p-4">
                      {image.title && <h3 className="text-sm font-medium text-white">{image.title}</h3>}
                      {image.href && (
                        <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-brand-yellow">
                          {image.action || "Ver opções"}
                          <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
            return image.href ? (
              <a key={index} href={image.href} aria-label={`${image.action || "Ver opções"} — ${image.title || image.alt}`}
                className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-black">
                {card}
              </a>
            ) : <Fragment key={index}>{card}</Fragment>;
          })}
        </div>
      </div>
    </section>
  );
}
