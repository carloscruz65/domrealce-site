import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  Upload, 
  Trash2, 
  RefreshCw, 
  Folder, 
  Image as ImageIcon,
  File as FileIcon,
  Loader2
} from "lucide-react";

interface MediaListResponse {
  success: boolean;
  files: Record<string, string[]>;
  total: number;
}

const CATEGORIES = [
  { value: "produtos/canvas", label: "Produtos - Canvas" },
  { value: "produtos/texturas", label: "Produtos - Texturas" },
  { value: "noticias", label: "Notícias" },
  { value: "portfolio", label: "Portfolio" },
  { value: "slider", label: "Slider Homepage" },
  { value: "outros", label: "Outros" },
];

export default function MediaManager() {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("outros");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  // Query para listar arquivos
  const { data, isLoading, refetch } = useQuery<MediaListResponse>({
    queryKey: ["/api/media/list"],
    retry: 1,
  });

  // Mutation para upload
  const uploadMutation = useMutation({
    mutationFn: async ({ file, category }: { file: File; category: string }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);

      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload file");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Upload concluído",
        description: "Ficheiro enviado com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/media/list"] });
      setSelectedFile(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Erro no upload",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation para deletar
  const deleteMutation = useMutation({
    mutationFn: async (filePath: string) => {
      return await apiRequest("DELETE", "/api/media/delete", { filePath });
    },
    onSuccess: () => {
      toast({
        title: "Ficheiro eliminado",
        description: "Ficheiro removido com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/media/list"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao eliminar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        title: "Nenhum ficheiro selecionado",
        description: "Por favor, selecione um ficheiro primeiro.",
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate({ file: selectedFile, category: selectedCategory });
  };

  const handleDelete = (filePath: string) => {
    if (confirm(`Tem certeza que deseja eliminar ${filePath}?`)) {
      deleteMutation.mutate(filePath);
    }
  };

  const toggleFolder = (folder: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folder)) {
      newExpanded.delete(folder);
    } else {
      newExpanded.add(folder);
    }
    setExpandedFolders(newExpanded);
  };

  const isImage = (filePath: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    return imageExtensions.some(ext => filePath.toLowerCase().endsWith(ext));
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload de Ficheiros
          </CardTitle>
          <CardDescription>
            Envie imagens e organize-as automaticamente por categorias
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="file">Selecionar Ficheiro</Label>
              <Input
                id="file"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                data-testid="input-file-upload"
              />
              {selectedFile && (
                <p className="text-sm text-muted-foreground">
                  Ficheiro: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger id="category" data-testid="select-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploadMutation.isPending}
            className="w-full md:w-auto"
            data-testid="button-upload"
          >
            {uploadMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                A enviar...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Enviar Ficheiro
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Files List Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Folder className="h-5 w-5" />
                Ficheiros no Object Storage
              </CardTitle>
              <CardDescription>
                Total de ficheiros: {data?.total || 0}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
              data-testid="button-refresh"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : data?.files && Object.keys(data.files).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(data.files).map(([folder, files]) => (
                <div key={folder} className="border rounded-lg">
                  <button
                    onClick={() => toggleFolder(folder)}
                    className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                    data-testid={`folder-${folder}`}
                  >
                    <div className="flex items-center gap-2">
                      <Folder className="h-5 w-5 text-primary" />
                      <span className="font-medium">{folder}</span>
                      <span className="text-sm text-muted-foreground">
                        ({files.length} {files.length === 1 ? 'ficheiro' : 'ficheiros'})
                      </span>
                    </div>
                    <span className="text-muted-foreground">
                      {expandedFolders.has(folder) ? '▼' : '▶'}
                    </span>
                  </button>

                  {expandedFolders.has(folder) && (
                    <div className="border-t p-4 space-y-2">
                      {files.map((filePath) => (
                        <div
                          key={filePath}
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-md hover:bg-muted/50 transition-colors"
                          data-testid={`file-${filePath}`}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {isImage(filePath) ? (
                              <ImageIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
                            ) : (
                              <FileIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            )}
                            <span className="text-sm truncate">{filePath}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(filePath)}
                            disabled={deleteMutation.isPending}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            data-testid={`button-delete-${filePath}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum ficheiro encontrado</p>
              <p className="text-sm mt-2">Envie o primeiro ficheiro para começar</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
