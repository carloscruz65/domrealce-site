import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, ZoomIn } from "lucide-react";

interface ServiceImage {
  src: string;
  alt: string;
  title?: string;
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
  columns = 3
}: ServiceGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<ServiceImage | null>(null);

  const gridClass = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  }[columns];

  return (
    <section className="py-16 bg-gray-900/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            <span className="text-brand-yellow">{title}</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Gallery Grid */}
        <div className={`grid ${gridClass} gap-6`}>
          {images.map((image, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden bg-black/50 border-gray-800 hover:border-brand-yellow transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedImage(image)}
              data-testid={`gallery-image-${index}`}
            >
              <CardContent className="p-0 relative aspect-[4/3]">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                  {image.title && (
                    <span className="text-white font-semibold text-lg">
                      {image.title}
                    </span>
                  )}
                  <div className="bg-brand-yellow text-black p-2 rounded-full">
                    <ZoomIn className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-7xl w-full bg-black/95 border-gray-800 p-0">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 z-50 bg-black/80 text-white p-2 rounded-full hover:bg-brand-yellow hover:text-black transition-colors"
            data-testid="close-modal"
          >
            <X className="w-6 h-6" />
          </button>
          
          {selectedImage && (
            <div className="relative">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-auto max-h-[90vh] object-contain"
              />
              {selectedImage.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                  <h3 className="text-white text-2xl font-semibold">
                    {selectedImage.title}
                  </h3>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
