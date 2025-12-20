import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save, X, ImagePlus, Images, Grid3x3, ArrowLeftRight, Video, Link as LinkIcon } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";

interface Noticia {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  imagem: string;
  imagens?: string[];
  tipoGaleria?: "single" | "slide" | "grid" | "before-after";
  heroTipo?: "image" | "video";
  heroUrl?: string;
  data: string;
}

const GALLERY_TYPES = [
  { value: "single", label: "Imagem Única", icon: ImagePlus, description: "Uma só imagem de destaque" },
  { value: "slide", label: "Slideshow", icon: Images, description: "Carrossel de imagens" },
  { value: "grid", label: "Grelha", icon: Grid3x3, description: "Múltiplas imagens em grelha" },
  { value: "before-after", label: "Antes/Depois", icon: ArrowLeftRight, description: "Comparação de 2 imagens" },
];

export default function NoticiasManager() {
  const { toast } = useToast();
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Noticia>>({
    tipoGaleria: "single",
    imagens: [],
    heroTipo: "image",
    heroUrl: ""
  });
  const [novaImagem, setNovaImagem] = useState("");

  const { data: noticiasData, isLoading } = useQuery<{ noticias: Noticia[] }>({
    queryKey: ['/api/admin/noticias'],
  });
  
  const noticias = noticiasData?.noticias || [];

  const createMutation = useMutation({
    mutationFn: (data: Partial<Noticia>) => apiRequest('POST', '/api/admin/noticias', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/noticias'] });
      toast({ title: "Notícia criada com sucesso!" });
      setFormData({ tipoGaleria: "single", imagens: [], heroTipo: "image", heroUrl: "" });
      setEditing(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Noticia> }) => 
      apiRequest('PUT', `/api/admin/noticias/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/noticias'] });
      toast({ title: "Notícia atualizada!" });
      setFormData({ tipoGaleria: "single", imagens: [], heroTipo: "image", heroUrl: "" });
      setEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/admin/noticias/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/noticias'] });
      toast({ title: "Notícia eliminada!" });
    },
  });

  const handleSave = () => {
    // Validações básicas
    if (!formData.titulo || !formData.descricao || !formData.categoria) {
      toast({ 
        title: "Campos obrigatórios em falta", 
        description: "Preencha título, descrição e categoria",
        variant: "destructive" 
      });
      return;
    }

    // Validação de imagens conforme tipo de galeria
    if (formData.tipoGaleria === "single" && !formData.imagem) {
      toast({ 
        title: "Imagem necessária", 
        description: "Adicione uma imagem para o tipo 'Imagem Única'",
        variant: "destructive" 
      });
      return;
    }

    if (formData.tipoGaleria === "before-after" && (!formData.imagens || formData.imagens.length !== 2)) {
      toast({ 
        title: "Duas imagens necessárias", 
        description: "O tipo 'Antes/Depois' requer exatamente 2 imagens",
        variant: "destructive" 
      });
      return;
    }

    if ((formData.tipoGaleria === "slide" || formData.tipoGaleria === "grid") && (!formData.imagens || formData.imagens.length === 0)) {
      toast({ 
        title: "Imagens necessárias", 
        description: "Adicione pelo menos uma imagem à galeria",
        variant: "destructive" 
      });
      return;
    }

    // Preparar dados para envio
    const dataToSave = { ...formData };
    
    // Se não é tipo "single", usar a primeira imagem do array como imagem principal
    if (formData.tipoGaleria !== "single" && formData.imagens && formData.imagens.length > 0) {
      dataToSave.imagem = formData.imagens[0];
    }

    if (editing === 'new') {
      createMutation.mutate(dataToSave);
    } else if (editing) {
      updateMutation.mutate({ id: editing, data: dataToSave });
    }
  };

  const adicionarImagem = () => {
    if (!novaImagem.trim()) return;
    
    const imagens = formData.imagens || [];
    setFormData({ 
      ...formData, 
      imagens: [...imagens, novaImagem.trim()] 
    });
    setNovaImagem("");
  };

  const removerImagem = (index: number) => {
    const imagens = formData.imagens || [];
    setFormData({ 
      ...formData, 
      imagens: imagens.filter((_, i) => i !== index) 
    });
  };

  const handleEdit = (noticia: Noticia) => {
    setEditing(noticia.id);
    setFormData({
      ...noticia,
      imagens: noticia.imagens || [],
      tipoGaleria: noticia.tipoGaleria || "single",
      heroTipo: noticia.heroTipo || "image",
      heroUrl: noticia.heroUrl || ""
    });
  };

  const handleCancel = () => {
    setEditing(null);
    setFormData({ tipoGaleria: "single", imagens: [], heroTipo: "image", heroUrl: "" });
    setNovaImagem("");
  };

  if (isLoading) return <div className="p-4">A carregar...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Notícias</h2>
          <p className="text-muted-foreground">Criar e editar artigos com galerias de imagens</p>
        </div>
        {!editing && (
          <Button onClick={() => setEditing('new')} data-testid="button-nova-noticia">
            <Plus className="mr-2 h-4 w-4" /> Nova Notícia
          </Button>
        )}
      </div>

      {editing && (
        <Card>
          <CardHeader>
            <CardTitle>{editing === 'new' ? 'Criar Notícia' : 'Editar Notícia'}</CardTitle>
            <CardDescription>Preencha os campos para criar uma notícia com galeria de imagens</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informações Básicas</h3>
              <div>
                <Label>Título *</Label>
                <Input
                  value={formData.titulo || ''}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Título da notícia"
                  data-testid="input-titulo"
                />
              </div>
              <div>
                <Label>Descrição *</Label>
                <Textarea
                  rows={4}
                  value={formData.descricao || ''}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descrição completa da notícia"
                  data-testid="input-descricao"
                />
              </div>
              <div>
                <Label>Categoria *</Label>
                <Input
                  value={formData.categoria || ''}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  placeholder="Ex: Novidades, Projetos, etc"
                  data-testid="input-categoria"
                />
              </div>
            </div>

            {/* Tipo de Galeria */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tipo de Galeria</h3>
              <RadioGroup 
                value={formData.tipoGaleria || "single"} 
                onValueChange={(value) => setFormData({ ...formData, tipoGaleria: value as any })}
              >
                <div className="grid grid-cols-2 gap-4">
                  {GALLERY_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                      <Label
                        key={type.value}
                        htmlFor={type.value}
                        className={`flex flex-col items-start space-y-2 border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                          formData.tipoGaleria === type.value 
                            ? 'border-primary bg-primary/5' 
                            : 'border-muted hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={type.value} id={type.value} />
                          <Icon className="h-5 w-5" />
                          <span className="font-semibold">{type.label}</span>
                        </div>
                        <p className="text-sm text-muted-foreground ml-6">{type.description}</p>
                      </Label>
                    );
                  })}
                </div>
              </RadioGroup>
            </div>

            {/* Tipo de Conteúdo Principal */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Conteúdo Principal (Hero)</h3>
              <RadioGroup 
                value={formData.heroTipo || "image"} 
                onValueChange={(value) => setFormData({ ...formData, heroTipo: value as "image" | "video" })}
              >
                <div className="flex gap-4">
                  <Label
                    htmlFor="hero-image"
                    className={`flex items-center space-x-2 border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      formData.heroTipo === "image" 
                        ? 'border-primary bg-primary/5' 
                        : 'border-muted hover:border-primary/50'
                    }`}
                  >
                    <RadioGroupItem value="image" id="hero-image" />
                    <ImagePlus className="h-5 w-5" />
                    <span className="font-semibold">Imagem</span>
                  </Label>
                  <Label
                    htmlFor="hero-video"
                    className={`flex items-center space-x-2 border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      formData.heroTipo === "video" 
                        ? 'border-primary bg-primary/5' 
                        : 'border-muted hover:border-primary/50'
                    }`}
                  >
                    <RadioGroupItem value="video" id="hero-video" />
                    <Video className="h-5 w-5" />
                    <span className="font-semibold">Vídeo</span>
                  </Label>
                </div>
              </RadioGroup>

              {/* URL do Vídeo */}
              {formData.heroTipo === "video" && (
                <div className="space-y-4 p-4 border border-gray-700 rounded-lg bg-gray-800/50">
                  <div>
                    <Label className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4" />
                      URL do Vídeo (OneDrive, YouTube, Vimeo, etc.)
                    </Label>
                    <Input
                      value={formData.heroUrl || ''}
                      onChange={(e) => setFormData({ ...formData, heroUrl: e.target.value })}
                      placeholder="https://onedrive.live.com/... ou https://youtube.com/..."
                      className="mt-2"
                      data-testid="input-video-url"
                    />
                    <p className="text-xs text-gray-400 mt-2">
                      Cole o link direto do vídeo (OneDrive, YouTube, Vimeo) ou faça upload abaixo
                    </p>
                  </div>
                  
                  <div className="border-t border-gray-700 pt-4">
                    <Label>Ou faça upload de um vídeo</Label>
                    <ImageUploader
                      label=""
                      value={formData.heroUrl || ''}
                      onChange={(url) => setFormData({ ...formData, heroUrl: url })}
                      folder="noticias/videos"
                    />
                  </div>

                  {formData.heroUrl && (
                    <div className="mt-2 p-2 bg-gray-900 rounded">
                      <p className="text-sm text-gray-300 break-all">
                        <strong>URL atual:</strong> {formData.heroUrl}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Gestão de Imagens */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Imagens</h3>
              
              {/* Imagem única para tipo "single" */}
              {formData.tipoGaleria === "single" && (
                <ImageUploader
                  label="Imagem de Destaque *"
                  value={formData.imagem || ''}
                  onChange={(url) => setFormData({ ...formData, imagem: url })}
                  folder="noticias"
                />
              )}

              {/* Galeria para outros tipos */}
              {formData.tipoGaleria !== "single" && (
                <div>
                  <Label>
                    Adicionar Imagens à Galeria 
                    {formData.tipoGaleria === "before-after" && " (Exatamente 2 imagens)"}
                    {formData.tipoGaleria && " *"}
                  </Label>
                  
                  <ImageUploader
                    label=""
                    value={novaImagem}
                    onChange={(url) => {
                      if (url) {
                        const imagens = formData.imagens || [];
                        setFormData({ 
                          ...formData, 
                          imagens: [...imagens, url] 
                        });
                        setNovaImagem("");
                      }
                    }}
                    folder="noticias"
                  />
                  
                  {/* Preview das imagens */}
                  {formData.imagens && formData.imagens.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      {formData.imagens.map((img, index) => (
                        <div key={index} className="relative group">
                          <img src={img} alt={`Imagem ${index + 1}`} className="w-full h-32 object-cover rounded" />
                          <div className="absolute top-1 right-1">
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => removerImagem(index)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="absolute bottom-1 left-1 bg-black/50 text-white px-2 py-1 rounded text-xs">
                            {formData.tipoGaleria === "before-after" 
                              ? index === 0 ? "Antes" : "Depois" 
                              : `Imagem ${index + 1}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleSave} 
                data-testid="button-save"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                <Save className="mr-2 h-4 w-4" /> 
                {createMutation.isPending || updateMutation.isPending ? "A guardar..." : "Guardar"}
              </Button>
              <Button variant="outline" onClick={handleCancel} data-testid="button-cancel">
                <X className="mr-2 h-4 w-4" /> Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {noticias?.map((noticia: Noticia) => (
          <Card key={noticia.id} data-testid={`card-noticia-${noticia.id}`}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4 flex-1">
                {noticia.imagem && (
                  <img src={noticia.imagem} alt={noticia.titulo} className="w-16 h-16 object-cover rounded" />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold">{noticia.titulo}</h3>
                  <p className="text-sm text-muted-foreground">
                    {noticia.descricao?.substring(0, 80)}{noticia.descricao?.length > 80 ? '...' : ''}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {GALLERY_TYPES.find(t => t.value === (noticia.tipoGaleria || "single"))?.label}
                    </span>
                    {noticia.imagens && noticia.imagens.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {noticia.imagens.length} imagens
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(noticia)} data-testid={`button-edit-${noticia.id}`}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => deleteMutation.mutate(noticia.id)} data-testid={`button-delete-${noticia.id}`}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
