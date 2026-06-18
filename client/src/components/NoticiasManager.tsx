import { useState, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, Edit, Trash2, Save, X, Image as ImageIcon, Video, 
  ChevronUp, ChevronDown, Search, Filter, Eye, EyeOff, GripVertical
} from "lucide-react";
import ImageUploader from "@/components/ImageUploader";

interface MediaItem {
  type: "image" | "video";
  url: string;
  caption?: string;
}

interface Noticia {
  id: string;
  titulo: string;
  descricao: string;
  summary?: string;
  categoria: string;
  imagem: string;
  cardImageUrl?: string;
  heroImageUrl?: string;
  tipoGaleria?: string;
  media?: MediaItem[];
  layoutGaleria?: "single" | "slider" | "grid" | "beforeAfter";
  published?: boolean;
  publishedAt?: string;
  data: string;
  createdAt?: string;
  notaEditorial?: string | null;
  pontuacao?: string | null;
  clienteReviewText?: string | null;
  clienteReviewAuthor?: string | null;
  clienteReviewRating?: number | null;
  shareTitle?: string | null;
  shareDescription?: string | null;
  shareImage?: string | null;
  slug?: string | null;
}

const CATEGORIAS = [
  "Projetos",
  "Novidades", 
  "Dicas",
  "Eventos",
  "Parcerias",
  "Outros"
];

const LAYOUTS = [
  { value: "single", label: "Imagem Única" },
  { value: "slider", label: "Slideshow" },
  { value: "grid", label: "Grelha" },
  { value: "beforeAfter", label: "Antes/Depois" },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export default function NoticiasManager() {
  const { toast } = useToast();
  const [editing, setEditing] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
  const [slugTouched, setSlugTouched] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Noticia>>({
    titulo: "",
    descricao: "",
    summary: "",
    categoria: "Projetos",
    media: [],
    layoutGaleria: "grid",
    published: false,
    notaEditorial: "",
    pontuacao: "",
    clienteReviewText: "",
    clienteReviewAuthor: "",
    clienteReviewRating: undefined,
    shareTitle: "",
    shareDescription: "",
    shareImage: "",
    slug: "",
  });

  const { data: noticiasData, isLoading } = useQuery<{ noticias: Noticia[] }>({
    queryKey: ['/api/admin/noticias'],
  });
  
  const noticias = noticiasData?.noticias || [];

  const filteredNoticias = noticias.filter(n => {
    const matchesSearch = n.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" 
      || (filterStatus === "published" && n.published) 
      || (filterStatus === "draft" && !n.published);
    return matchesSearch && matchesStatus;
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Noticia>) => apiRequest('POST', '/api/admin/noticias', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/noticias'] });
      toast({ title: "Notícia criada com sucesso!" });
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: "Erro ao criar", description: error.message, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Noticia> }) => 
      apiRequest('PUT', `/api/admin/noticias/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/noticias'] });
      toast({ title: "Notícia atualizada!" });
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: "Erro ao atualizar", description: error.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/admin/noticias/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/noticias'] });
      toast({ title: "Notícia eliminada!" });
    },
  });

  const resetForm = () => {
    setEditing(null);
    setSlugTouched(false);
    setFormData({
      titulo: "",
      descricao: "",
      summary: "",
      categoria: "Projetos",
      media: [],
      layoutGaleria: "grid",
      published: false,
      notaEditorial: "",
      pontuacao: "",
      clienteReviewText: "",
      clienteReviewAuthor: "",
      clienteReviewRating: undefined,
      shareTitle: "",
      shareDescription: "",
      shareImage: "",
      slug: "",
    });
  };

  const handleEdit = (noticia: Noticia) => {
    setEditing(noticia.id);

    // 1. Garantir que o array 'media' é processado corretamente (caso o backend devolva como string JSON)
    let mediaArray: any[] = [];
    if (typeof noticia.media === 'string') {
      try { mediaArray = JSON.parse(noticia.media); } catch (e) { mediaArray = []; }
    } else if (Array.isArray(noticia.media)) {
      mediaArray = noticia.media;
    }

    // 2. Fazer o mesmo parse defensivo para o campo legacy 'imagens'
    let imagensArray: any[] = [];
    // @ts-ignore
    if (typeof noticia.imagens === 'string') {
      // @ts-ignore
      try { imagensArray = JSON.parse(noticia.imagens); } catch (e) { imagensArray = []; }
    // @ts-ignore
    } else if (Array.isArray(noticia.imagens)) {
      // @ts-ignore
      imagensArray = noticia.imagens;
    }

    // 3. Reconstruir a galeria baseada nos dados disponíveis
    let media = [...mediaArray];

    if (media.length === 0 && imagensArray.length > 0) {
      media = imagensArray.map((url: string) => ({ type: "image" as const, url, caption: "" }));
    } else if (media.length === 0 && noticia.imagem) {
      media = [{ type: "image" as const, url: noticia.imagem, caption: "" }];
    }

    // 4. Limpar e normalizar os dados para evitar que o uploader quebre
    media = media
      .filter(m => m && (m.url || m.src)) // Remove items corrompidos ou sem link
      .map(m => ({
        type: m.type || "image", // Força o tipo "image" se faltar nos dados antigos
        url: m.url || m.src || "",
        caption: m.caption || ""
      }));

    // Map backend tipoGaleria to frontend layoutGaleria[cite: 1]
    const reverseLayoutMap: Record<string, "single" | "slider" | "grid" | "beforeAfter"> = {
      "single": "single",
      "slide": "slider",
      "grid": "grid",
      "before-after": "beforeAfter"
    };

    setFormData({
      ...noticia,
      media, // Agora injetamos a array 'media' 100% normalizada e pronta para o React 
      cardImageUrl: noticia.cardImageUrl || noticia.imagem || media.find(m => m.type === "image")?.url || "",
      heroImageUrl: noticia.heroImageUrl || "",
      // @ts-ignore
      layoutGaleria: noticia.layoutGaleria || reverseLayoutMap[noticia.tipoGaleria || "grid"] || "grid",
      published: noticia.published ?? false,
      notaEditorial: noticia.notaEditorial || "",
      pontuacao: noticia.pontuacao || "",
      clienteReviewText: noticia.clienteReviewText || "",
      clienteReviewAuthor: noticia.clienteReviewAuthor || "",
      clienteReviewRating: noticia.clienteReviewRating ?? undefined,
      shareTitle: noticia.shareTitle || "",
      shareDescription: noticia.shareDescription || "",
      shareImage: noticia.shareImage || "",
      slug: noticia.slug || "",
    });
  };

  const handleSave = () => {
    if (!formData.titulo?.trim()) {
      toast({ title: "Título obrigatório", variant: "destructive" });
      return;
    }

    const media = formData.media || [];
    const imageMedia = media.filter(m => m.type === "image");
    
    // Map frontend layout values to backend schema values
    const layoutMap: Record<string, string> = {
      "single": "single",
      "slider": "slide",
      "grid": "grid", 
      "beforeAfter": "before-after"
    };
    
    const cardImage = formData.cardImageUrl || "";
    const firstGalleryImage = imageMedia[0]?.url || "";
    const mainListImage = cardImage || firstGalleryImage || formData.imagem || "";

    const dataToSave = {
      ...formData,
      media: formData.media || [],
      descricao: formData.descricao || formData.summary || "Projeto visual",
      // Campo legacy usado por alguns cards antigos do site.
      // Primeiro usa a Imagem do Cartão; se não existir, usa a primeira imagem da galeria.
      imagem: mainListImage,
      imagens: imageMedia.map(m => m.url),
      cardImageUrl: cardImage,
      heroImageUrl: formData.heroImageUrl || "",
      tipoGaleria: layoutMap[formData.layoutGaleria || "grid"] || "grid",
      publishedAt: formData.published && !formData.publishedAt ? new Date().toISOString() : formData.publishedAt,
      categoria: formData.categoria || "Projetos",
      clienteReviewText: formData.clienteReviewText || null,
      clienteReviewAuthor: formData.clienteReviewAuthor || null,
      clienteReviewRating: formData.clienteReviewRating ?? null,
      shareTitle: formData.shareTitle || null,
      shareDescription: formData.shareDescription || null,
      shareImage: formData.shareImage || null,
      slug: formData.slug?.trim() || null,
    };

    if (editing && editing !== "new") {
      updateMutation.mutate({ id: editing, data: dataToSave });
    } else {
      createMutation.mutate(dataToSave);
    }
  };

  const addMediaItem = (type: "image" | "video") => {
    const media = formData.media || [];
    setFormData({
      ...formData,
      media: [...media, { type, url: "", caption: "" }]
    });
  };

  const updateMediaItem = (index: number, field: keyof MediaItem, value: string) => {
    const media = [...(formData.media || [])];
    media[index] = { ...media[index], [field]: value };
    setFormData({ ...formData, media });
  };

  const removeMediaItem = (index: number) => {
    const media = [...(formData.media || [])];
    media.splice(index, 1);
    setFormData({ ...formData, media });
  };

  const moveMediaItem = (index: number, direction: "up" | "down") => {
    const media = [...(formData.media || [])];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= media.length) return;
    
    [media[index], media[newIndex]] = [media[newIndex], media[index]];
    setFormData({ ...formData, media });
  };

  if (isLoading) {
    return <div className="p-4 text-white">A carregar...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header com pesquisa e filtros */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex gap-3 flex-1 w-full md:w-auto">
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Pesquisar por título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
              data-testid="input-search-noticias"
            />
          </div>
          <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)}>
            <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="published">Publicadas</SelectItem>
              <SelectItem value="draft">Rascunhos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button 
          onClick={() => setEditing("new")} 
          className="bg-brand-yellow text-black hover:bg-yellow-500"
          data-testid="button-nova-noticia"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Notícia
        </Button>
      </div>

      {/* Formulário de edição */}
      {editing && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              {editing === "new" ? "Nova Notícia" : "Editar Notícia"}
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X className="h-5 w-5" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Campos básicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Título *</Label>
                <Input
                  value={formData.titulo || ""}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    const updates: Partial<Noticia> = { titulo: newTitle };
                    if (editing === "new" && !slugTouched) {
                      updates.slug = slugify(newTitle);
                    }
                    setFormData({ ...formData, ...updates });
                  }}
                  placeholder="Título da notícia"
                  className="bg-gray-800 border-gray-700 text-white"
                  data-testid="input-titulo"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Categoria</Label>
                <Select 
                  value={formData.categoria || "Projetos"} 
                  onValueChange={(v) => setFormData({ ...formData, categoria: v })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIAS.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Resumo Curto (opcional)</Label>
              <Input
                value={formData.summary || ""}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="Breve descrição para listagem e redes sociais"
                className="bg-gray-800 border-gray-700 text-white"
                data-testid="input-summary"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Descrição (opcional)</Label>
              <Textarea
                value={formData.descricao || ""}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Texto completo da notícia (se necessário)"
                className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                data-testid="input-descricao"
              />
            </div>

            {/* Estado e Layout */}
            <div className="flex flex-wrap gap-6 items-center p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <Switch
                  checked={formData.published ?? false}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                  data-testid="switch-published"
                />
                <Label className="text-white flex items-center gap-2">
                  {formData.published ? (
                    <>
                      <Eye className="h-4 w-4 text-green-400" />
                      Publicado
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-4 w-4 text-gray-400" />
                      Rascunho
                    </>
                  )}
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-white">Layout da Galeria:</Label>
                <Select 
                  value={formData.layoutGaleria || "grid"} 
                  onValueChange={(v) => setFormData({ ...formData, layoutGaleria: v as any })}
                >
                  <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LAYOUTS.map(layout => (
                      <SelectItem key={layout.value} value={layout.value}>{layout.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Nota Editorial */}
            <div className="space-y-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
              <Label className="text-white text-lg font-semibold">Nota do Atelier</Label>
              
              <div className="space-y-2">
                <Label className="text-gray-300 text-sm">Comentário editorial (opcional)</Label>
                <Textarea
                  value={formData.notaEditorial || ""}
                  onChange={(e) => setFormData({ ...formData, notaEditorial: e.target.value })}
                  placeholder="Comentário interno ou crítica sobre o projeto..."
                  className="bg-gray-700 border-gray-600 text-white min-h-[80px]"
                  data-testid="input-nota-editorial"
                />
              </div>

              <div className="flex items-center gap-4">
                <Label className="text-gray-300 text-sm">Pontuação:</Label>
                <Select 
                  value={formData.pontuacao || "none"} 
                  onValueChange={(v) => setFormData({ ...formData, pontuacao: v === "none" ? "" : v })}
                >
                  <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Sem pontuação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sem pontuação</SelectItem>
                    <SelectItem value="1">1/5 - Fraco</SelectItem>
                    <SelectItem value="2">2/5 - Razoável</SelectItem>
                    <SelectItem value="3">3/5 - Bom</SelectItem>
                    <SelectItem value="4">4/5 - Muito Bom</SelectItem>
                    <SelectItem value="5">5/5 - Excelente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Crítica do Cliente */}
            <div className="space-y-4 p-4 bg-gray-800 rounded-lg border border-yellow-700/40">
              <Label className="text-white text-lg font-semibold">Crítica do Cliente</Label>
              <p className="text-gray-400 text-sm">Testemunho real do cliente sobre este projeto (aparece no final da notícia).</p>

              <div className="space-y-2">
                <Label className="text-gray-300 text-sm">Nome do Cliente</Label>
                <Input
                  value={formData.clienteReviewAuthor || ""}
                  onChange={(e) => setFormData({ ...formData, clienteReviewAuthor: e.target.value })}
                  placeholder="Ex: João Silva, Empresa X"
                  className="bg-gray-700 border-gray-600 text-white"
                  data-testid="input-cliente-author"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300 text-sm">Texto da Crítica</Label>
                <Textarea
                  value={formData.clienteReviewText || ""}
                  onChange={(e) => setFormData({ ...formData, clienteReviewText: e.target.value })}
                  placeholder="O que disse o cliente sobre o projeto?"
                  className="bg-gray-700 border-gray-600 text-white min-h-[80px]"
                  data-testid="input-cliente-review"
                />
              </div>

              <div className="flex items-center gap-4">
                <Label className="text-gray-300 text-sm">Classificação:</Label>
                <Select
                  value={formData.clienteReviewRating ? String(formData.clienteReviewRating) : "none"}
                  onValueChange={(v) => setFormData({ ...formData, clienteReviewRating: v === "none" ? undefined : Number(v) })}
                >
                  <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Sem classificação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sem classificação</SelectItem>
                    <SelectItem value="1">⭐ 1 — Fraco</SelectItem>
                    <SelectItem value="2">⭐⭐ 2 — Razoável</SelectItem>
                    <SelectItem value="3">⭐⭐⭐ 3 — Bom</SelectItem>
                    <SelectItem value="4">⭐⭐⭐⭐ 4 — Muito Bom</SelectItem>
                    <SelectItem value="5">⭐⭐⭐⭐⭐ 5 — Excelente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Imagem do Cartão */}
            <div className="space-y-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
              <Label className="text-white text-lg font-semibold">Imagem do Cartão</Label>
              <p className="text-gray-400 text-sm">
                Usada nos cards da homepage e da listagem de notícias. A galeria/slideshow continua a ser definida mais abaixo.
              </p>
              
              <div className="space-y-3 max-w-md">
                <Label className="text-white flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-brand-yellow" />
                  Imagem do Cartão (thumbnail)
                </Label>
                <p className="text-gray-400 text-xs">Recomendado: 600x400px</p>
                <ImageUploader
                  value={formData.cardImageUrl || ""}
                  onChange={(url) => setFormData({ ...formData, cardImageUrl: url })}
                  folder="noticias/cards"
                />
                {formData.cardImageUrl && (
                  <img 
                    src={formData.cardImageUrl} 
                    alt="Preview card" 
                    className="w-full max-w-xs h-32 object-cover rounded border border-gray-600"
                  />
                )}
              </div>
            </div>

            {/* SEO e Partilha nas Redes Sociais */}
            <div className="space-y-4 p-4 bg-gray-800 rounded-lg border border-blue-700/40">
              <div>
                <Label className="text-white text-lg font-semibold">SEO e Partilha</Label>
                <p className="text-gray-400 text-sm mt-1">
                  Controla como esta página aparece no Google e quando é partilhada no Facebook, WhatsApp e LinkedIn.
                  Se deixar vazio, usa automaticamente o título e o resumo.
                </p>
              </div>

              {/* URL Personalizada (Slug) */}
              <div className="space-y-2">
                <Label className="text-gray-300 text-sm">URL Personalizada (Slug)</Label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm whitespace-nowrap shrink-0">/noticia/</span>
                  <Input
                    value={formData.slug || ""}
                    onChange={(e) => {
                      setSlugTouched(true);
                      const clean = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
                      setFormData({ ...formData, slug: clean });
                    }}
                    placeholder="url-do-projeto"
                    className="bg-gray-700 border-gray-600 text-white font-mono text-sm"
                  />
                </div>
                <p className="text-gray-500 text-xs">
                  Gerado automaticamente a partir do título na criação. Use apenas letras minúsculas, números e hífens.
                </p>
              </div>

              {/* Título SEO */}
              <div className="space-y-2">
                <Label className="text-gray-300 text-sm">Título SEO</Label>
                <Input
                  value={formData.shareTitle || ""}
                  onChange={(e) => setFormData({ ...formData, shareTitle: e.target.value })}
                  placeholder={formData.titulo || "Título (fallback automático)"}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <p className="text-gray-500 text-xs">
                  Aparece no separador do browser e nos resultados do Google (og:title).
                  {formData.shareTitle ? ` — ${formData.shareTitle.length}/60 caracteres` : " Recomendado: até 60 caracteres."}
                </p>
              </div>

              {/* Meta Descrição */}
              <div className="space-y-2">
                <Label className="text-gray-300 text-sm">Meta Descrição</Label>
                <Textarea
                  value={formData.shareDescription || ""}
                  onChange={(e) => setFormData({ ...formData, shareDescription: e.target.value.slice(0, 160) })}
                  placeholder={formData.summary || "Breve descrição para motores de busca e pré-visualização nas redes..."}
                  className="bg-gray-700 border-gray-600 text-white min-h-[70px]"
                  maxLength={160}
                />
                <div className="flex justify-between items-center">
                  <p className="text-gray-500 text-xs">Aparece nos resultados do Google e na pré-visualização das partilhas (og:description).</p>
                  <p className={`text-xs font-mono shrink-0 ml-2 ${(formData.shareDescription?.length || 0) > 140 ? "text-yellow-400" : "text-gray-500"}`}>
                    {formData.shareDescription?.length || 0}/160
                  </p>
                </div>
              </div>

              {/* Imagem de Partilha (Open Graph) */}
              <div className="space-y-2">
                <Label className="text-white flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-blue-400" />
                  Imagem de Partilha (Open Graph)
                </Label>
                <p className="text-gray-400 text-xs">
                  Imagem exibida quando o link é partilhado no Facebook, LinkedIn ou WhatsApp.
                  Tamanho ideal: <strong className="text-white">1200×630 px</strong>.
                  Se vazio, usa a imagem do cartão.
                </p>
                <ImageUploader
                  value={formData.shareImage || ""}
                  onChange={(url) => setFormData({ ...formData, shareImage: url })}
                  folder="noticias/share"
                />
                {formData.shareImage && (
                  <div className="relative">
                    <img
                      src={formData.shareImage}
                      alt="Preview partilha"
                      className="w-full max-w-sm rounded border border-gray-600 object-cover"
                      style={{ aspectRatio: "1200/630" }}
                    />
                    <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                      1200×630 px
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Galeria de Media */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-white text-lg font-semibold">Galeria</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addMediaItem("image")}
                    className="border-gray-600 text-white hover:bg-gray-700"
                    data-testid="button-add-image"
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Imagem
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addMediaItem("video")}
                    className="border-gray-600 text-white hover:bg-gray-700"
                    data-testid="button-add-video"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Vídeo
                  </Button>
                </div>
              </div>

              {/* Lista de items de media */}
              <div className="space-y-3">
                {(formData.media || []).map((item, index) => (
                  <div 
                    key={index} 
                    className="flex gap-3 p-4 bg-gray-800 rounded-lg border border-gray-700"
                  >
                    {/* Controlos de ordem */}
                    <div className="flex flex-col justify-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => moveMediaItem(index, "up")}
                        disabled={index === 0}
                        className="h-6 w-6"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <GripVertical className="h-4 w-4 text-gray-500 mx-auto" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => moveMediaItem(index, "down")}
                        disabled={index === (formData.media?.length || 0) - 1}
                        className="h-6 w-6"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Preview */}
                    <div className="w-24 h-24 bg-gray-700 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {item.url ? (
                        item.type === "image" ? (
                          <img src={item.url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Video className="h-8 w-8 text-gray-400" />
                        )
                      ) : (
                        item.type === "image" ? (
                          <ImageIcon className="h-8 w-8 text-gray-500" />
                        ) : (
                          <Video className="h-8 w-8 text-gray-500" />
                        )
                      )}
                    </div>

                    {/* Campos */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={item.type === "image" ? "default" : "secondary"}>
                          {item.type === "image" ? "Imagem" : "Vídeo"}
                        </Badge>
                        <span className="text-xs text-gray-400">#{index + 1}</span>
                      </div>

                      {item.type === "image" ? (
                        <ImageUploader
                          label=""
                          value={item.url}
                          onChange={(url) => updateMediaItem(index, "url", url)}
                          folder="noticias"
                        />
                      ) : (
                        <Input
                          value={item.url}
                          onChange={(e) => updateMediaItem(index, "url", e.target.value)}
                          placeholder="URL do vídeo (YouTube, Vimeo, etc.)"
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      )}

                      <Input
                        value={item.caption || ""}
                        onChange={(e) => updateMediaItem(index, "caption", e.target.value)}
                        placeholder="Legenda (opcional)"
                        className="bg-gray-700 border-gray-600 text-white"
                        data-testid={`input-caption-${index}`}
                      />
                    </div>

                    {/* Remover */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMediaItem(index)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/30"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                ))}

                {(!formData.media || formData.media.length === 0) && (
                  <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-700 rounded-lg">
                    Clique em "Imagem" ou "Vídeo" para adicionar items à galeria
                  </div>
                )}
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex gap-3 pt-4 border-t border-gray-700">
              <Button 
                onClick={handleSave}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="bg-brand-yellow text-black hover:bg-yellow-500"
                data-testid="button-save"
              >
                <Save className="h-4 w-4 mr-2" />
                {createMutation.isPending || updateMutation.isPending ? "A guardar..." : "Guardar"}
              </Button>
              <Button variant="outline" onClick={resetForm} className="border-gray-600">
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de notícias */}
      <div className="grid gap-4">
        {filteredNoticias.length === 0 ? (
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="py-12 text-center text-gray-400">
              {searchTerm || filterStatus !== "all" 
                ? "Nenhuma notícia encontrada com esses filtros" 
                : "Ainda não há notícias. Crie a primeira!"}
            </CardContent>
          </Card>
        ) : (
          filteredNoticias.map((noticia) => (
            <Card key={noticia.id} className="bg-gray-900 border-gray-700">
              <CardContent className="p-4">
                <div className="flex gap-4 items-start">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                    {noticia.cardImageUrl || noticia.imagem || (noticia.media && noticia.media.length > 0) ? (
                      <img 
                        src={noticia.cardImageUrl || noticia.imagem || noticia.media?.[0]?.url} 
                        alt="" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-gray-600" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-1">
                      <h3 className="text-white font-medium truncate">{noticia.titulo}</h3>
                      <Badge variant={noticia.published ? "default" : "secondary"} className="flex-shrink-0">
                        {noticia.published ? "Publicado" : "Rascunho"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">
                      {noticia.categoria} • {noticia.media?.length || 0} items • {new Date(noticia.data || noticia.createdAt || "").toLocaleDateString("pt-PT")}
                    </p>
                    {noticia.summary && (
                      <p className="text-sm text-gray-300 line-clamp-1">{noticia.summary}</p>
                    )}
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(noticia)}
                      className="border-gray-600 hover:bg-gray-700"
                      data-testid={`button-edit-${noticia.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        if (confirm("Eliminar esta notícia?")) {
                          deleteMutation.mutate(noticia.id);
                        }
                      }}
                      className="border-gray-600 hover:bg-red-900/30 text-red-400"
                      data-testid={`button-delete-${noticia.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}