import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Link as LinkIcon, X, Image as ImageIcon, Loader2, FolderOpen, ChevronDown, ChevronRight } from "lucide-react";
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
  folder?: string;
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
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  // Buscar imagens da pasta atual
  const { data: folderData, isLoading: isLoadingFolder } = useQuery<{ images: StorageImage[] }>({
    queryKey: ['/api/objects/images', folder],
    queryFn: async () => {
      const response = await fetch(`/api/objects/images?folder=${folder}`);
      if (!response.ok) throw new Error('Erro ao carregar imagens');
      return response.json();
    }
  });

  // Buscar TODAS as imagens (biblioteca global)
  const { data: globalData, isLoading: isLoadingGlobal } = useQuery<{ images: StorageImage[] }>({
    queryKey: ['/api/objects/images', 'global'],
    queryFn: async () => {
      const response = await fetch('/api/objects/images');
      if (!response.ok) throw new Error('Erro ao carregar biblioteca');
      return response.json();
    },
    enabled: selectedTab === "global"
  });

  const folderImages = folderData?.images || [];
  const globalImages = globalData?.images || [];

  // Agrupar imagens globais por pasta
  const groupedImages = globalImages.reduce((acc, img) => {
    const pathParts = img.url.replace('/public-objects/', '').split('/');
    const folderName = pathParts.length > 1 ? pathParts[0] : 'raiz';
    if (!acc[folderName]) acc[folderName] = [];
    acc[folderName].push(img);
    return acc;
  }, {} as Record<string, StorageImage[]>);

  const toggleFolder = (folderName: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderName)) {
      newExpanded.delete(folderName);
    } else {
      newExpanded.add(folderName);
    }
    setExpandedFolders(newExpanded);
  };

  // Configurar Uppy
  const [uppy] = useState(() =>
    new Uppy({
      restrictions: {
        maxNumberOfFiles: 1,
        maxFileSize: 10 * 1024 * 1024,
        allowedFileTypes: ['image/*'],
      },
      autoProceed: false,
    })
      .on("upload-success", (file, response) => {
        if (response?.body?.url) {
          onChange(response.body.url);
          setUrlInput(response.body.url);
          setShowUploadModal(false);
        }
      })
      .on("upload-error", (file, error) => {
        alert(`Erro no upload: ${error?.message || 'Erro desconhecido'}`);
      })
  );

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
    return () => { uppy.off('upload', handleUpload); };
  }, [uppy, folder]);

  const handleUrlSubmit = () => onChange(urlInput);
  const handleClear = () => { setUrlInput(""); onChange(""); };
  const handleSelectImage = (imageUrl: string) => { onChange(imageUrl); setUrlInput(imageUrl); };

  useEffect(() => {
    if (value) setUrlInput(value);
  }, [value]);

  const renderImageGrid = (images: StorageImage[], loading: boolean) => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">A carregar imagens...</span>
        </div>
      );
    }
    if (images.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Nenhuma imagem encontrada</p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto border rounded-lg p-2 bg-gray-800">
        {images.map((img, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleSelectImage(img.url)}
            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
              urlInput === img.url ? 'border-yellow-500 ring-2 ring-yellow-500' : 'border-transparent hover:border-gray-600'
            }`}
            title={img.name}
          >
            <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
            {urlInput === img.url && (
              <div className="absolute top-1 right-1 bg-yellow-500 text-black rounded-full p-0.5">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {label && <Label className="text-white">{label}</Label>}
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="library" className="text-xs">
            <ImageIcon className="h-3 w-3 mr-1" />
            Pasta
          </TabsTrigger>
          <TabsTrigger value="global" className="text-xs">
            <FolderOpen className="h-3 w-3 mr-1" />
            Global
          </TabsTrigger>
          <TabsTrigger value="url" className="text-xs">
            <LinkIcon className="h-3 w-3 mr-1" />
            URL
          </TabsTrigger>
          <TabsTrigger value="upload" className="text-xs">
            <Upload className="h-3 w-3 mr-1" />
            Upload
          </TabsTrigger>
        </TabsList>
        
        {/* Biblioteca da Pasta Atual */}
        <TabsContent value="library" className="space-y-2">
          <p className="text-xs text-gray-400">Imagens em: /{folder}/</p>
          {renderImageGrid(folderImages, isLoadingFolder)}
        </TabsContent>

        {/* Biblioteca Global */}
        <TabsContent value="global" className="space-y-2">
          <p className="text-xs text-gray-400">Todas as imagens do storage (por pasta)</p>
          {isLoadingGlobal ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">A carregar biblioteca...</span>
            </div>
          ) : Object.keys(groupedImages).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma imagem no storage</p>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto space-y-2 border rounded-lg p-2 bg-gray-800">
              {Object.entries(groupedImages).sort().map(([folderName, images]) => (
                <div key={folderName} className="border border-gray-700 rounded">
                  <button
                    type="button"
                    onClick={() => toggleFolder(folderName)}
                    className="w-full flex items-center justify-between p-2 hover:bg-gray-700 rounded text-left"
                  >
                    <span className="flex items-center gap-2 text-sm text-white">
                      <FolderOpen className="h-4 w-4 text-yellow-500" />
                      {folderName}
                      <span className="text-xs text-gray-400">({images.length})</span>
                    </span>
                    {expandedFolders.has(folderName) ? (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                  {expandedFolders.has(folderName) && (
                    <div className="grid grid-cols-4 gap-1 p-2 bg-gray-900">
                      {images.slice(0, 20).map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectImage(img.url)}
                          className={`relative aspect-square rounded overflow-hidden border-2 transition-all hover:scale-105 ${
                            urlInput === img.url ? 'border-yellow-500' : 'border-transparent'
                          }`}
                          title={img.name}
                        >
                          <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                        </button>
                      ))}
                      {images.length > 20 && (
                        <div className="col-span-4 text-center text-xs text-gray-400 py-1">
                          +{images.length - 20} mais imagens nesta pasta
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* URL Manual */}
        <TabsContent value="url" className="space-y-2">
          <p className="text-xs text-gray-400">Insira URL externa (OneDrive, etc.)</p>
          <div className="flex gap-2">
            <Input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
              onBlur={handleUrlSubmit}
              onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
              className="bg-gray-800 border-gray-700 text-white"
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
          <p className="text-xs text-gray-400 mb-2">Upload para: /{folder}/</p>
          <Button 
            type="button"
            variant="outline" 
            onClick={() => setShowUploadModal(true)}
            className="w-full border-gray-600 text-white hover:bg-gray-700"
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
            className="w-full max-w-md h-32 object-cover rounded border border-gray-700"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 h-6 w-6"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      <DashboardModal
        uppy={uppy}
        open={showUploadModal}
        onRequestClose={() => setShowUploadModal(false)}
        proudlyDisplayPoweredByUppy={false}
      />
    </div>
  );
}
