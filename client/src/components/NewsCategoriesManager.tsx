import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save, X, GripVertical, Tag } from "lucide-react";

interface NewsCategory {
  id: string;
  nome: string;
  slug: string;
  cor?: string | null;
  ordem: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

const DEFAULT_COLORS = [
  "#FFD700", "#4dabf7", "#00d4aa", "#ff6b35",
  "#ff8cc8", "#a78bfa", "#34d399", "#f97316",
];

export default function NewsCategoriesManager() {
  const { toast } = useToast();
  const [editing, setEditing] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [formData, setFormData] = useState<Partial<NewsCategory>>({
    nome: "", slug: "", cor: "", ordem: 0,
  });

  const { data, isLoading } = useQuery<{ categories: NewsCategory[] }>({
    queryKey: ["/api/admin/news-categories"],
  });
  const categories = (data?.categories || []).sort((a, b) => a.ordem - b.ordem);

  const createMutation = useMutation({
    mutationFn: (body: Partial<NewsCategory>) =>
      apiRequest("POST", "/api/admin/news-categories", body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/news-categories"] });
      toast({ title: "Categoria criada!" });
      resetForm();
    },
    onError: () => toast({ title: "Erro ao criar categoria", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NewsCategory> }) =>
      apiRequest("PUT", `/api/admin/news-categories/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/news-categories"] });
      toast({ title: "Categoria atualizada!" });
      resetForm();
    },
    onError: () => toast({ title: "Erro ao atualizar", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/news-categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/news-categories"] });
      toast({ title: "Categoria eliminada!" });
    },
    onError: () => toast({ title: "Erro ao eliminar", variant: "destructive" }),
  });

  const resetForm = () => {
    setEditing(null);
    setSlugTouched(false);
    setFormData({ nome: "", slug: "", cor: "", ordem: 0 });
  };

  const handleEdit = (cat: NewsCategory) => {
    setEditing(cat.id);
    setSlugTouched(true);
    setFormData({ nome: cat.nome, slug: cat.slug, cor: cat.cor || "", ordem: cat.ordem });
  };

  const handleSave = () => {
    if (!formData.nome?.trim()) {
      toast({ title: "Nome obrigatório", variant: "destructive" });
      return;
    }
    if (!formData.slug?.trim()) {
      toast({ title: "Slug obrigatório", variant: "destructive" });
      return;
    }
    const payload = {
      nome: formData.nome.trim(),
      slug: formData.slug.trim(),
      cor: formData.cor || null,
      ordem: Number(formData.ordem) || 0,
    };
    if (editing && editing !== "new") {
      updateMutation.mutate({ id: editing, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Tag className="h-6 w-6 text-brand-yellow" />
            Categorias de Notícias
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Gerencie as categorias usadas nas notícias e projetos. A URL pública futura será{" "}
            <code className="text-yellow-400 bg-gray-800 px-1 rounded">/noticias/categoria/slug</code>
          </p>
        </div>
        {editing === null && (
          <Button
            onClick={() => { resetForm(); setEditing("new"); }}
            className="bg-brand-yellow text-black hover:bg-yellow-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Categoria
          </Button>
        )}
      </div>

      {/* Form */}
      {editing !== null && (
        <Card className="bg-gray-900 border-yellow-600/40">
          <CardHeader>
            <CardTitle className="text-white text-lg">
              {editing === "new" ? "Nova Categoria" : "Editar Categoria"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome */}
              <div className="space-y-2">
                <Label className="text-white">Nome *</Label>
                <Input
                  value={formData.nome || ""}
                  onChange={(e) => {
                    const nome = e.target.value;
                    setFormData({
                      ...formData,
                      nome,
                      slug: slugTouched ? formData.slug : slugify(nome),
                    });
                  }}
                  placeholder="ex: Decoração de Viaturas"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label className="text-white">
                  Slug{" "}
                  <span className="text-gray-500 font-normal text-xs">(URL)</span>
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm shrink-0">/noticias/categoria/</span>
                  <Input
                    value={formData.slug || ""}
                    onChange={(e) => {
                      setSlugTouched(true);
                      setFormData({
                        ...formData,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-"),
                      });
                    }}
                    placeholder="decoracao-viaturas"
                    className="bg-gray-800 border-gray-700 text-white font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cor */}
              <div className="space-y-2">
                <Label className="text-white">
                  Cor{" "}
                  <span className="text-gray-500 font-normal text-xs">(opcional)</span>
                </Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.cor || "#FFD700"}
                    onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer border border-gray-700 bg-gray-800"
                  />
                  <Input
                    value={formData.cor || ""}
                    onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                    placeholder="#FFD700"
                    className="bg-gray-800 border-gray-700 text-white font-mono"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {DEFAULT_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormData({ ...formData, cor: c })}
                      className="w-6 h-6 rounded-full border-2 border-gray-700 hover:border-white transition-colors"
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>

              {/* Ordem */}
              <div className="space-y-2">
                <Label className="text-white">
                  Ordem{" "}
                  <span className="text-gray-500 font-normal text-xs">(menor = primeiro)</span>
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.ordem ?? 0}
                  onChange={(e) => setFormData({ ...formData, ordem: Number(e.target.value) })}
                  className="bg-gray-800 border-gray-700 text-white w-32"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2 border-t border-gray-700">
              <Button
                onClick={handleSave}
                disabled={isSubmitting}
                className="bg-brand-yellow text-black hover:bg-yellow-500"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "A guardar..." : "Guardar"}
              </Button>
              <Button variant="outline" onClick={resetForm} className="border-gray-600">
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* List */}
      {isLoading ? (
        <div className="text-gray-400 text-center py-12">A carregar categorias...</div>
      ) : categories.length === 0 ? (
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="py-12 text-center text-gray-400">
            <Tag className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Ainda não há categorias. Crie a primeira!</p>
            <p className="text-xs mt-2 text-gray-500">
              As categorias por defeito (Projetos, Novidades, etc.) foram migradas automaticamente.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => (
            <Card key={cat.id} className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <GripVertical className="h-4 w-4 text-gray-600 shrink-0" />

                  {/* Color dot */}
                  <div
                    className="w-4 h-4 rounded-full shrink-0 border border-gray-700"
                    style={{ backgroundColor: cat.cor || "#555" }}
                    title={cat.cor || "sem cor"}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-white font-medium">{cat.nome}</span>
                      <code className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded font-mono">
                        /noticias/categoria/{cat.slug}
                      </code>
                      <Badge variant="outline" className="text-xs text-gray-500 border-gray-700">
                        ordem: {cat.ordem}
                      </Badge>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(cat)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Eliminar a categoria "${cat.nome}"?\n\nAs notícias associadas NÃO serão apagadas.`)) {
                          deleteMutation.mutate(cat.id);
                        }
                      }}
                      className="text-gray-400 hover:text-red-400"
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="py-4 px-5">
          <p className="text-gray-400 text-sm">
            <span className="text-yellow-400 font-semibold">Nota:</span> Eliminar uma categoria não apaga as notícias associadas.
            As notícias ficam com o nome da categoria anterior até serem editadas manualmente.
            No futuro, cada categoria terá uma página pública em{" "}
            <code className="text-yellow-400">/noticias/categoria/[slug]</code>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
