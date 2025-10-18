import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Link as LinkIcon, X, Image as ImageIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Uppy from "@uppy/core";
import { DashboardModal } from "@uppy/react";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import AwsS3 from "@uppy/aws-s3";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string; // Pasta no object storage (ex: "noticias", "portfolio", "produtos")
}

export default function ImageUploader({ value, onChange, label = "Imagem", folder = "uploads" }: ImageUploaderProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [urlInput, setUrlInput] = useState(value || "");

  // Configurar Uppy para upload
  const [uppy] = useState(() =>
    new Uppy({
      restrictions: {
        maxNumberOfFiles: 1,
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedFileTypes: ['image/*'],
      },
      autoProceed: false,
    })
      .use(AwsS3, {
        shouldUseMultipart: false,
        getUploadParameters: async (file) => {
          try {
            // Gerar nome de arquivo único
            const timestamp = Date.now();
            const fileName = `${folder}/${timestamp}-${file.name}`;
            
            // Obter URL de upload do backend
            const response = await fetch('/api/objects/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ fileName })
            });
            
            if (!response.ok) {
              throw new Error('Erro ao obter URL de upload');
            }
            
            const { uploadURL } = await response.json();
            
            return {
              method: 'PUT' as const,
              url: uploadURL,
            };
          } catch (error) {
            console.error('Erro ao obter parâmetros de upload:', error);
            throw error;
          }
        },
      })
      .on("complete", (result) => {
        if (result.successful && result.successful.length > 0) {
          // Extrair URL pública da resposta
          const uploadedFile = result.successful[0];
          const publicUrl = uploadedFile.uploadURL?.split('?')[0] || uploadedFile.uploadURL;
          onChange(publicUrl || '');
          setUrlInput(publicUrl || '');
        }
        setShowUploadModal(false);
      })
      .on("upload-error", (file, error, response) => {
        console.error("Upload error:", error, response);
      })
  );

  const handleUrlSubmit = () => {
    onChange(urlInput);
  };

  const handleClear = () => {
    setUrlInput("");
    onChange("");
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="url">
            <LinkIcon className="h-4 w-4 mr-2" />
            URL
          </TabsTrigger>
          <TabsTrigger value="upload">
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </TabsTrigger>
        </TabsList>
        
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
