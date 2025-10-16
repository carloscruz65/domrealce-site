import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, X } from "lucide-react";

interface PortfolioImage {
  id: string;
  url: string;
  filename: string;
  category: string;
}

const CATEGORIES = [
  "geral",
  "viaturas",
  "interiores",
  "exteriores",
  "sinaletica",
  "eventos"
];

export default function PortfolioManager() {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("geral");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: images, isLoading } = useQuery<PortfolioImage[]>({
    queryKey: ['/api/admin/portfolio'],
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ file, category }: { file: File; category: string }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      
      const response = await fetch('/api/admin/portfolio', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Upload failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/portfolio'] });
      toast({ title: "Imagem carregada com sucesso!" });
      setSelectedFile(null);
      setUploading(false);
    },
    onError: () => {
      toast({ title: "Erro ao carregar imagem", variant: "destructive" });
      setUploading(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (filename: string) => apiRequest('DELETE', '/api/admin/portfolio/delete', { filename }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/portfolio'] });
      toast({ title: "Imagem eliminada!" });
    },
  });

  const handleUpload = () => {
    if (!selectedFile) return;
    setUploading(true);
    uploadMutation.mutate({ file: selectedFile, category: selectedCategory });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const groupedImages = images?.reduce((acc, img) => {
    if (!acc[img.category]) acc[img.category] = [];
    acc[img.category].push(img);
    return acc;
  }, {} as Record<string, PortfolioImage[]>);

  if (isLoading) return <div className="p-4">A carregar...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Portfolio</h2>
          <p className="text-muted-foreground">Organizar imagens por categorias</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Carregar Nova Imagem</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Categoria</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger data-testid="select-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Ficheiro</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              data-testid="input-file"
            />
          </div>
          {selectedFile && (
            <div className="flex gap-2">
              <Button 
                onClick={handleUpload} 
                disabled={uploading}
                data-testid="button-upload"
              >
                <Upload className="mr-2 h-4 w-4" /> 
                {uploading ? 'A carregar...' : 'Carregar'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setSelectedFile(null)}
                data-testid="button-cancel-upload"
              >
                <X className="mr-2 h-4 w-4" /> Cancelar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {groupedImages && Object.entries(groupedImages).map(([category, imgs]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="capitalize">{category} ({imgs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imgs.map((img) => (
                <div key={img.id} className="relative group" data-testid={`image-${img.id}`}>
                  <img
                    src={img.url}
                    alt={img.filename}
                    className="w-full h-32 object-cover rounded"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => deleteMutation.mutate(img.id)}
                    data-testid={`button-delete-${img.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
