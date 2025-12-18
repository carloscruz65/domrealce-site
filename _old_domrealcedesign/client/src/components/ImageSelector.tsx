import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ObjectUploader } from "./ObjectUploader";
import { Image, Upload, FolderOpen, X, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageSelectorProps {
  selectedImage: string;
  onImageSelect: (imageUrl: string) => void;
  placeholder?: string;
}

interface StorageImage {
  path: string;
  url: string;
  name: string;
}

export function ImageSelector({ selectedImage, onImageSelect, placeholder = "Selecionar Imagem" }: ImageSelectorProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [storageImages, setStorageImages] = useState<StorageImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImagePreview, setSelectedImagePreview] = useState(selectedImage);

  useEffect(() => {
    setSelectedImagePreview(selectedImage);
  }, [selectedImage]);

  const fetchStorageImages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/slider/images');
      if (response.ok) {
        const data = await response.json();
        const images = data.images.map((imagePath: string) => ({
          path: imagePath,
          url: `/public-objects/${imagePath}`,
          name: imagePath.split('/').pop() || ''
        }));
        setStorageImages(images);
      }
    } catch (error) {
      console.error('Error fetching storage images:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar imagens do armazenamento",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = async (result: any) => {
    if (result.successful && result.successful.length > 0) {
      const uploadedFile = result.successful[0];
      const fileName = uploadedFile.name;
      
      // Upload the file to the slider folder
      try {
        const formData = new FormData();
        const response = await fetch(uploadedFile.uploadURL);
        const blob = await response.blob();
        
        // Create a new file in the slider folder
        const targetPath = `inicio/slider/${fileName}`;
        const uploadResponse = await fetch('/api/upload-slider-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName,
            targetPath
          })
        });
        
        if (uploadResponse.ok) {
          const imageUrl = `/public-objects/${targetPath}`;
          onImageSelect(imageUrl);
          setSelectedImagePreview(imageUrl);
          setOpen(false);
          await fetchStorageImages(); // Refresh the list
          toast({
            title: "Sucesso",
            description: "Imagem carregada com sucesso",
          });
        }
      } catch (error) {
        console.error('Error processing upload:', error);
        toast({
          title: "Erro",
          description: "Falha ao processar upload",
          variant: "destructive",
        });
      }
    }
  };

  const handleGetUploadParameters = async () => {
    const response = await fetch('/api/objects/upload', { method: 'POST' });
    const data = await response.json();
    return {
      method: 'PUT' as const,
      url: data.uploadURL
    };
  };

  const selectImage = (image: StorageImage) => {
    onImageSelect(image.url);
    setSelectedImagePreview(image.url);
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            type="button"
            variant="outline" 
            className="w-full h-32 border-2 border-dashed border-[#444] hover:border-[#FFD700] bg-[#222] hover:bg-[#333] relative"
            onClick={() => {
              setOpen(true);
              fetchStorageImages();
            }}
          >
            {selectedImagePreview ? (
              <div className="relative w-full h-full">
                <img 
                  src={selectedImagePreview} 
                  alt="Preview" 
                  className="w-full h-full object-cover rounded"
                  onError={() => setSelectedImagePreview('')}
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-white font-medium">Alterar Imagem</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <Image className="h-8 w-8" />
                <span>{placeholder}</span>
              </div>
            )}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-[#111111] border-[#333]">
          <DialogHeader>
            <DialogTitle className="text-[#FFD700]">Selecionar Imagem</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="storage" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#222] border-[#444]">
              <TabsTrigger value="storage" className="flex items-center gap-2 data-[state=active]:bg-[#FFD700] data-[state=active]:text-black">
                <FolderOpen className="h-4 w-4" />
                Biblioteca de Imagens
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2 data-[state=active]:bg-[#FFD700] data-[state=active]:text-black">
                <Upload className="h-4 w-4" />
                Carregar Nova Imagem
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="storage" className="space-y-4">
              <div className="mb-4 p-4 bg-[#333] rounded border border-[#444]">
                <Label className="text-white">URL da Imagem (temporário)</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="https://exemplo.com/imagem.jpg"
                    className="bg-[#222] border-[#444] text-white flex-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        if (input.value) {
                          onImageSelect(input.value);
                          setSelectedImagePreview(input.value);
                          setOpen(false);
                        }
                      }
                    }}
                  />
                  <Button 
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      if (input?.value) {
                        onImageSelect(input.value);
                        setSelectedImagePreview(input.value);
                        setOpen(false);
                      }
                    }}
                    className="bg-[#FFD700] text-black hover:bg-yellow-400"
                  >
                    Usar
                  </Button>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Cole a URL de uma imagem e pressione Enter ou clique em "Usar"
                </p>
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-gray-400">Carregando imagens...</div>
                </div>
              ) : storageImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {storageImages.map((image) => (
                    <Card 
                      key={image.path}
                      className={`cursor-pointer transition-all hover:border-[#FFD700] bg-[#222] border-[#444] ${
                        selectedImagePreview === image.url ? 'border-[#FFD700] ring-1 ring-[#FFD700]' : ''
                      }`}
                      onClick={() => selectImage(image)}
                    >
                      <CardContent className="p-2">
                        <div className="aspect-video relative">
                          <img 
                            src={image.url}
                            alt={image.name}
                            className="w-full h-full object-cover rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                          {selectedImagePreview === image.url && (
                            <div className="absolute top-1 right-1">
                              <Badge className="bg-[#FFD700] text-black">
                                <Check className="h-3 w-3" />
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-gray-400 truncate">{image.name}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                  <Image className="h-12 w-12 mb-2" />
                  <p>Nenhuma imagem encontrada na pasta inicio/slider</p>
                  <p className="text-sm">Use o Object Storage para adicionar imagens</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="upload" className="space-y-4">
              <div className="border-2 border-dashed border-[#444] rounded-lg p-8 text-center">
                <ObjectUploader
                  maxNumberOfFiles={1}
                  maxFileSize={10485760}
                  onGetUploadParameters={handleGetUploadParameters}
                  onComplete={handleUploadComplete}
                  buttonClassName="bg-[#FFD700] text-black hover:bg-yellow-400"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Carregar Imagem para Slider
                </ObjectUploader>
                <p className="text-sm text-gray-400 mt-2">
                  Formatos suportados: JPG, PNG, GIF, WEBP (máx. 10MB)
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}