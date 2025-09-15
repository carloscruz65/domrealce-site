import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ObjectUploader } from "@/components/ObjectUploader";
import { Upload, Link, X } from "lucide-react";
import type { UploadResult } from "@uppy/core";
import { apiRequest } from "@/lib/queryClient";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Componente de upload de imagens para o editor visual.
 * Permite upload de arquivo ou inserção de URL.
 */
export function ImageUploadField({
  label,
  value,
  onChange,
  placeholder = "URL da imagem ou /public-objects/...",
  className = "",
}: ImageUploadFieldProps) {
  const [urlInput, setUrlInput] = useState(value);
  const [isUploading, setIsUploading] = useState(false);

  const handleUrlChange = (url: string) => {
    setUrlInput(url);
    onChange(url);
  };

  const handleGetUploadParameters = async () => {
    try {
      const response = await apiRequest('/api/objects/upload', 'POST') as unknown as { uploadURL: string };
      return {
        method: 'PUT' as const,
        url: response.uploadURL,
      };
    } catch (error) {
      console.error('Erro ao obter URL de upload:', error);
      throw error;
    }
  };

  const handleUploadComplete = async (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    setIsUploading(true);
    try {
      if (result.successful && result.successful.length > 0) {
        const successful = result.successful[0];
        if (successful?.uploadURL) {
          // Normalizar o path para usar /public-objects/
          const response = await apiRequest('/api/images/normalize', 'POST', {
            imageURL: successful.uploadURL,
          }) as unknown as { objectPath: string };
          
          const normalizedPath = response.objectPath;
          onChange(normalizedPath);
          setUrlInput(normalizedPath);
        }
      }
    } catch (error) {
      console.error('Erro ao processar upload:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const clearImage = () => {
    onChange('');
    setUrlInput('');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label htmlFor={`image-${label}`}>{label}</Label>
      
      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="url" className="flex items-center gap-2">
            <Link className="w-4 h-4" />
            URL
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="url" className="space-y-2">
          <div className="flex gap-2">
            <Input
              id={`image-${label}`}
              type="url"
              value={urlInput}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder={placeholder}
              className="flex-1"
            />
            {value && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={clearImage}
                className="shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          {value && (
            <div className="mt-2 p-2 border rounded">
              <img
                src={value.startsWith('/public-objects/') ? value : value}
                alt="Preview"
                className="max-w-full h-auto max-h-32 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="upload" className="space-y-2">
          <ObjectUploader
            maxNumberOfFiles={1}
            maxFileSize={5242880} // 5MB
            onGetUploadParameters={handleGetUploadParameters}
            onComplete={handleUploadComplete}
            buttonClassName="w-full"
          >
            {isUploading ? 'A processar...' : 'Selecionar Imagem'}
          </ObjectUploader>
          
          {value && (
            <div className="mt-2 p-2 border rounded">
              <div className="flex justify-between items-start gap-2">
                <img
                  src={value.startsWith('/public-objects/') ? value : value}
                  alt="Preview"
                  className="max-w-full h-auto max-h-32 object-contain flex-1"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={clearImage}
                  className="shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}