import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploader from "@/components/ImageUploader";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface GalleryImage {
  src: string;
  alt: string;
  title: string;
}

interface ServiceGalleryEditorProps {
  serviceId: string;
  serviceName: string;
  onBack?: () => void;
}

export default function ServiceGalleryEditor({ serviceId, serviceName, onBack }: ServiceGalleryEditorProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const { toast } = useToast();

  // Load existing gallery
  const { data: galleryData, isLoading } = useQuery<{ images: GalleryImage[] }>({
    queryKey: ['/api/service-galleries', serviceId],
  });

  // Initialize images when data is loaded
  useEffect(() => {
    if (galleryData?.images) {
      setImages(galleryData.images);
    }
  }, [galleryData]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (updatedImages: GalleryImage[]) => {
      return await apiRequest<{ success: boolean; gallery: any }>(
        `/api/admin/service-galleries/${serviceId}`,
        {
          method: "PUT",
          body: JSON.stringify({ images: updatedImages }),
        }
      );
    },
    onSuccess: () => {
      toast({
        title: "Galeria guardada!",
        description: "As alterações foram guardadas com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/service-galleries', serviceId] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao guardar",
        description: "Não foi possível guardar as alterações.",
        variant: "destructive",
      });
      console.error("Error saving gallery:", error);
    },
  });

  const handleAddImage = () => {
    setImages([...images, { src: "", alt: "", title: "" }]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleUpdateImage = (index: number, field: keyof GalleryImage, value: string) => {
    const updatedImages = [...images];
    updatedImages[index][field] = value;
    setImages(updatedImages);
  };

  const handleSave = () => {
    // Filter out images without src
    const validImages = images.filter(img => img.src.trim() !== "");
    
    if (validImages.length === 0) {
      toast({
        title: "Aviso",
        description: "Adicione pelo menos uma imagem com URL válida.",
        variant: "destructive",
      });
      return;
    }

    saveMutation.mutate(validImages);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">A carregar galeria...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button
              variant="outline"
              size="icon"
              onClick={onBack}
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <h2 className="text-2xl font-bold" data-testid="text-service-title">
              Galeria: {serviceName}
            </h2>
            <p className="text-sm text-muted-foreground">
              ID do serviço: <code className="bg-muted px-2 py-1 rounded">{serviceId}</code>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleAddImage}
            variant="outline"
            data-testid="button-add-image"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Imagem
          </Button>
          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            data-testid="button-save"
          >
            <Save className="h-4 w-4 mr-2" />
            {saveMutation.isPending ? "A guardar..." : "Guardar Alterações"}
          </Button>
        </div>
      </div>

      {images.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              Nenhuma imagem na galeria
            </p>
            <Button onClick={handleAddImage} data-testid="button-add-first-image">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeira Imagem
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {images.map((image, index) => (
            <Card key={index} data-testid={`card-image-${index}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Imagem {index + 1}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveImage(index)}
                  data-testid={`button-remove-${index}`}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <ImageUploader
                      label="URL da Imagem"
                      value={image.src}
                      onChange={(url) => handleUpdateImage(index, "src", url)}
                      folder="servicos"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`alt-${index}`}>Texto Alternativo (Alt)</Label>
                      <Input
                        id={`alt-${index}`}
                        value={image.alt}
                        onChange={(e) => handleUpdateImage(index, "alt", e.target.value)}
                        placeholder="Descrição da imagem para acessibilidade"
                        data-testid={`input-alt-${index}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`title-${index}`}>Título</Label>
                      <Input
                        id={`title-${index}`}
                        value={image.title}
                        onChange={(e) => handleUpdateImage(index, "title", e.target.value)}
                        placeholder="Título da imagem"
                        data-testid={`input-title-${index}`}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
