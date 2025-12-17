import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploader from "@/components/ImageUploader";
import { Plus, Trash2, Save, ArrowLeft, GripVertical, AlertCircle, ChevronUp, ChevronDown, Image as ImageIcon } from "lucide-react";
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

interface ValidationErrors {
  [key: number]: { src?: string };
}

export default function ServiceGalleryEditor({ serviceId, serviceName, onBack }: ServiceGalleryEditorProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const { toast } = useToast();

  const { data: galleryData, isLoading } = useQuery<{ images: GalleryImage[] }>({
    queryKey: ['/api/service-galleries', serviceId],
  });

  useEffect(() => {
    if (galleryData?.images) {
      setImages(galleryData.images);
    }
  }, [galleryData]);

  const saveMutation = useMutation({
    mutationFn: async (updatedImages: GalleryImage[]) => {
      return await apiRequest(
        "PUT",
        `/api/admin/service-galleries/${serviceId}`,
        { images: updatedImages }
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
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    const newErrors = { ...errors };
    delete newErrors[index];
    setErrors(newErrors);
  };

  const handleUpdateImage = (index: number, field: keyof GalleryImage, value: string) => {
    const updatedImages = [...images];
    updatedImages[index][field] = value;
    setImages(updatedImages);
    
    if (field === "src" && value.trim() && errors[index]?.src) {
      const newErrors = { ...errors };
      delete newErrors[index];
      setErrors(newErrors);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = draggedIndex;
    
    if (dragIndex === null || dragIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newImages = [...images];
    const [draggedItem] = newImages.splice(dragIndex, 1);
    newImages.splice(dropIndex, 0, draggedItem);
    
    setImages(newImages);
    setDraggedIndex(null);
    setDragOverIndex(null);
    
    toast({
      title: "Ordem alterada",
      description: `Imagem movida para posição ${dropIndex + 1}`,
    });
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const moveImage = useCallback((fromIndex: number, direction: "up" | "down") => {
    const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
    
    if (toIndex < 0 || toIndex >= images.length) return;
    
    const newImages = [...images];
    [newImages[fromIndex], newImages[toIndex]] = [newImages[toIndex], newImages[fromIndex]];
    setImages(newImages);
  }, [images]);

  const validateImages = (): boolean => {
    const newErrors: ValidationErrors = {};
    let hasError = false;
    
    images.forEach((img, index) => {
      if (!img.src.trim()) {
        newErrors[index] = { src: "URL da imagem é obrigatória" };
        hasError = true;
      }
    });
    
    setErrors(newErrors);
    return !hasError;
  };

  const handleSave = () => {
    const validImages = images.filter(img => img.src.trim() !== "");
    
    if (validImages.length === 0) {
      toast({
        title: "Aviso",
        description: "Adicione pelo menos uma imagem com URL válida.",
        variant: "destructive",
      });
      return;
    }

    if (!validateImages()) {
      toast({
        title: "Imagens incompletas",
        description: "Algumas imagens não têm URL. Remova-as ou adicione URLs.",
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

  const FieldError = ({ message }: { message?: string }) => {
    if (!message) return null;
    return (
      <p className="text-sm text-destructive flex items-center gap-1 mt-1">
        <AlertCircle className="h-3 w-3" />
        {message}
      </p>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
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
              {images.length > 0 && (
                <span className="ml-2">• {images.length} {images.length === 1 ? "imagem" : "imagens"}</span>
              )}
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

      {images.length > 1 && (
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <GripVertical className="h-4 w-4" />
            <strong>Dica:</strong> Arraste os cartões para reordenar as imagens, ou use as setas para mover.
          </p>
        </div>
      )}

      {images.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4 text-center">
              Nenhuma imagem na galeria.<br />
              Adicione imagens para mostrar os seus trabalhos.
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
            <Card 
              key={index} 
              data-testid={`card-image-${index}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`
                transition-all duration-200 cursor-move
                ${draggedIndex === index ? "opacity-50 scale-[0.98]" : ""}
                ${dragOverIndex === index && draggedIndex !== index ? "ring-2 ring-primary ring-offset-2" : ""}
                ${errors[index]?.src ? "border-destructive" : ""}
              `}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab active:cursor-grabbing" />
                  <CardTitle className="text-sm font-medium">
                    Imagem {index + 1}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => moveImage(index, "up")}
                    disabled={index === 0}
                    title="Mover para cima"
                    data-testid={`button-move-up-${index}`}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => moveImage(index, "down")}
                    disabled={index === images.length - 1}
                    title="Mover para baixo"
                    data-testid={`button-move-down-${index}`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveImage(index)}
                    title="Remover imagem"
                    data-testid={`button-remove-${index}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className={errors[index]?.src ? "border border-destructive rounded-lg p-3" : ""}>
                      <ImageUploader
                        label="URL da Imagem *"
                        value={image.src}
                        onChange={(url) => handleUpdateImage(index, "src", url)}
                        folder="servicos"
                      />
                      <FieldError message={errors[index]?.src} />
                    </div>
                    {image.src && (
                      <div className="mt-2 border rounded-lg overflow-hidden bg-muted">
                        <img 
                          src={image.src} 
                          alt={image.alt || "Preview"} 
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/400x300?text=Erro+ao+carregar+imagem";
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`alt-${index}`}>Texto Alternativo (Alt)</Label>
                      <Input
                        id={`alt-${index}`}
                        value={image.alt}
                        onChange={(e) => handleUpdateImage(index, "alt", e.target.value)}
                        placeholder="Descrição da imagem para acessibilidade e SEO"
                        data-testid={`input-alt-${index}`}
                      />
                      <p className="text-xs text-muted-foreground">
                        Importante para SEO e acessibilidade
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`title-${index}`}>Título</Label>
                      <Input
                        id={`title-${index}`}
                        value={image.title}
                        onChange={(e) => handleUpdateImage(index, "title", e.target.value)}
                        placeholder="Título da imagem (aparece ao passar o rato)"
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
      
      {images.length > 0 && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={handleAddImage}
            variant="outline"
            className="w-full max-w-md"
            data-testid="button-add-more"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Mais Imagens
          </Button>
        </div>
      )}
    </div>
  );
}
