import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, X, Search, GripVertical, ChevronUp, ChevronDown, Edit, Image as ImageIcon, ZoomIn } from "lucide-react";

interface PortfolioImage {
  id: string;
  url: string;
  filename: string;
  category: string;
  caption?: string;
  order?: number;
}

const CATEGORIES = [
  "Autocolantes",
  "camioes",
  "Comerciais",
  "Competição",
  "Fachadas",
  "Interiores",
  "Lonas",
  "Máquinas",
  "Montras",
  "Reclames"
];

export default function PortfolioManager() {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("todas");
  const [previewImage, setPreviewImage] = useState<PortfolioImage | null>(null);
  const [editingCaption, setEditingCaption] = useState<string | null>(null);
  const [captionText, setCaptionText] = useState("");

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
      setPreviewImage(null);
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

  const filteredImages = useMemo(() => {
    if (!images) return [];
    
    return images.filter(img => {
      if (filterCategory !== "todas" && img.category !== filterCategory) {
        return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return img.filename?.toLowerCase().includes(query) ||
               img.caption?.toLowerCase().includes(query) ||
               img.category?.toLowerCase().includes(query);
      }
      return true;
    });
  }, [images, filterCategory, searchQuery]);

  const groupedImages = useMemo(() => {
    return filteredImages.reduce((acc, img) => {
      if (!acc[img.category]) acc[img.category] = [];
      acc[img.category].push(img);
      return acc;
    }, {} as Record<string, PortfolioImage[]>);
  }, [filteredImages]);

  const stats = useMemo(() => {
    const total = images?.length || 0;
    const categories = new Set(images?.map(i => i.category)).size;
    return { total, categories };
  }, [images]);

  if (isLoading) return <div className="p-4">A carregar...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Portfolio</h2>
          <p className="text-muted-foreground">
            {stats.total} imagens em {stats.categories} categorias
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Carregar Nova Imagem</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
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
            <div className="md:col-span-2">
              <Label>Ficheiro</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                data-testid="input-file"
              />
            </div>
          </div>
          {selectedFile && (
            <div className="flex items-center gap-4">
              <div className="flex-1 p-3 bg-muted rounded-lg flex items-center gap-3">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedCategory}
                  </p>
                </div>
              </div>
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

      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <Label className="text-xs">Pesquisar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nome do ficheiro ou legenda..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
            </div>
            <div className="min-w-[150px]">
              <Label className="text-xs">Categoria</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger data-testid="select-filter-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as categorias</SelectItem>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {(searchQuery || filterCategory !== "todas") && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => { setSearchQuery(""); setFilterCategory("todas"); }}
              >
                <X className="h-4 w-4 mr-2" /> Limpar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        A mostrar {filteredImages.length} de {images?.length || 0} imagens
      </div>

      {Object.keys(groupedImages).length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {searchQuery || filterCategory !== "todas" 
                ? "Nenhuma imagem encontrada com os filtros aplicados."
                : "Ainda não há imagens no portfolio."}
            </p>
          </CardContent>
        </Card>
      ) : (
        Object.entries(groupedImages).map(([category, imgs]) => (
          <Card key={category}>
            <CardHeader className="pb-2">
              <CardTitle className="capitalize flex items-center gap-2">
                {category}
                <span className="text-sm font-normal text-muted-foreground">
                  ({imgs.length} {imgs.length === 1 ? "imagem" : "imagens"})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {imgs.map((img) => (
                  <div 
                    key={img.id} 
                    className="relative group rounded-lg overflow-hidden border bg-muted"
                    data-testid={`image-${img.id}`}
                  >
                    <img
                      src={img.url}
                      alt={img.caption || img.filename}
                      className="w-full h-32 object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setPreviewImage(img)}
                        data-testid={`button-preview-${img.id}`}
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => deleteMutation.mutate(img.id)}
                        data-testid={`button-delete-${img.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {img.caption && (
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-white text-xs truncate">{img.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))
      )}

      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{previewImage?.caption || previewImage?.filename}</DialogTitle>
          </DialogHeader>
          {previewImage && (
            <div className="space-y-4">
              <img
                src={previewImage.url}
                alt={previewImage.caption || previewImage.filename}
                className="w-full max-h-[60vh] object-contain rounded-lg"
              />
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <p>Categoria: {previewImage.category}</p>
                  <p>Ficheiro: {previewImage.filename}</p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteMutation.mutate(previewImage.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
