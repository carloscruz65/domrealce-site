import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Link as LinkIcon, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import Uppy from "@uppy/core";
import { DashboardModal } from "@uppy/react";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string; // Pasta no object storage (ex: "noticias", "portfolio", "produtos")
}

interface StorageImage {
  name: string;
  url: string;
  size: number;
  updated: string;
}

export default function ImageUploader({ value, onChange, label = "Imagem", folder = "uploads" }: ImageUploaderProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [urlInput, setUrlInput] = useState(value || "");
  const [selectedTab, setSelectedTab] = useState("library");

  // Buscar imagens do storage
  const { data: storageData, isLoading } = useQuery<{ images: StorageImage[] }>({
    queryKey: ['/api/objects/images', folder],
    queryFn: async () => {
      const response = await fetch(`/api/objects/images?folder=${folder}`);
      if (!response.ok) throw new Error('Erro ao carregar imagens');
      return response.json();
    }
  });

  const storageImages = storageData?.images || [];

  // Configurar Uppy para upload direto via backend
  const [uppy] = useState(() =>
    new Uppy({
      restrictions: {
        maxNumberOfFiles: 1,
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedFileTypes: ['image/*'],
      },
      autoProceed: false,
    })
      .on("file-added", () => {
        console.log('📁 Ficheiro adicionado ao Uppy');
      })
      .on("upload", () => {
        console.log('📤 A iniciar upload...');
      })
      .on("upload-success", (file, response) => {
        console.log("✅ Upload bem-sucedido:", response);
        if (response && response.body && response.body.url) {
          const publicUrl = response.body.url;
          onChange(publicUrl);
          setUrlInput(publicUrl);
          setShowUploadModal(false);
        }
      })
      .on("upload-error", (file, error) => {
        console.error("❌ Erro no upload:", error);
        alert(`Erro no upload: ${error?.message || 'Erro desconhecido'}`);
      })
      .on("complete", (result) => {
        console.log('🏁 Upload completo:', result);
      })
  );

  // Custom upload handler
  useEffect(() => {
    const handleUpload = async (_uploadID: string, files: any[]) => {
      for (const file of files) {
        try {
          const formData = new FormData();
          formData.append('file', file.data);
          formData.append('folder', folder);

          const response = await fetch('/api/objects/upload-file', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Upload failed');
          }

          const data = await response.json();
          uppy.emit('upload-success', file, { body: data, status: 200 });
        } catch (error) {
          uppy.emit('upload-error', file, error as Error);
        }
      }
    };

    uppy.on('upload', handleUpload);
    return () => {
      uppy.off('upload', handleUpload);
    };
  }, [uppy, folder]);

  const handleUrlSubmit = () => {
    onChange(urlInput);
  };

  const handleClear = () => {
    setUrlInput("");
    onChange("");
  };

  const handleSelectImage = (imageUrl: string) => {
    onChange(imageUrl);
    setUrlInput(imageUrl);
  };

  // Update local state when value changes
  useEffect(() => {
    if (value) {
      setUrlInput(value);
    }
  }, [value]);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="library">
            <ImageIcon className="h-4 w-4 mr-2" />
            Biblioteca
          </TabsTrigger>
          <TabsTrigger value="url">
            <LinkIcon className="h-4 w-4 mr-2" />
            URL
          </TabsTrigger>
          <TabsTrigger value="upload">
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </TabsTrigger>
        </TabsList>
        
        {/* Biblioteca - Imagens do Storage */}
        <TabsContent value="library" className="space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">A carregar imagens...</span>
            </div>
          ) : storageImages.length > 0 ? (
            <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto border rounded-lg p-2">
              {storageImages.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectImage(img.url)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                    urlInput === img.url ? 'border-primary ring-2 ring-primary' : 'border-transparent'
                  }`}
                >
                  <img 
                    src={img.url} 
                    alt={img.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors" />
                  {urlInput === img.url && (
                    <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma imagem encontrada</p>
              <p className="text-xs mt-1">Faça upload de imagens primeiro</p>
            </div>
          )}
        </TabsContent>
        
        {/* URL Manual */}
        <TabsContent value="url" className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
              onBlur={handleUrlSubmit}
              onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
            />
            {urlInput && (
              <Button type="button" variant="ghost" size="icon" onClick={handleClear}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </TabsContent>
        
        {/* Upload */}
        <TabsContent value="upload">
          <Button 
            type="button"
            variant="outline" 
            onClick={() => setShowUploadModal(true)}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            Escolher Ficheiro
          </Button>
        </TabsContent>
      </Tabs>

      {/* Preview da imagem */}
      {(value || urlInput) && (
        <div className="relative mt-2">
          <img 
            src={value || urlInput} 
            alt="Preview" 
            className="w-full max-w-md h-48 object-cover rounded border"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Modal de Upload */}
      <DashboardModal
        uppy={uppy}
        open={showUploadModal}
        onRequestClose={() => setShowUploadModal(false)}
        proudlyDisplayPoweredByUppy={false}
      />
    </div>
  );
}
