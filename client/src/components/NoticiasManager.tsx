import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";

interface Noticia {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  slug: string;
  date: string;
}

export default function NoticiasManager() {
  const { toast } = useToast();
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Noticia>>({});

  const { data: noticias, isLoading } = useQuery<Noticia[]>({
    queryKey: ['/api/admin/noticias'],
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Noticia>) => apiRequest('/api/admin/noticias', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/noticias'] });
      toast({ title: "Notícia criada com sucesso!" });
      setFormData({});
      setEditing(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Noticia> }) => 
      apiRequest(`/api/admin/noticias/${id}`, 'PUT', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/noticias'] });
      toast({ title: "Notícia atualizada!" });
      setFormData({});
      setEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/admin/noticias/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/noticias'] });
      toast({ title: "Notícia eliminada!" });
    },
  });

  const handleSave = () => {
    if (editing === 'new') {
      createMutation.mutate(formData);
    } else if (editing) {
      updateMutation.mutate({ id: editing, data: formData });
    }
  };

  if (isLoading) return <div className="p-4">A carregar...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Notícias</h2>
          <p className="text-muted-foreground">Criar e editar artigos</p>
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
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Título</Label>
              <Input
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                data-testid="input-title"
              />
            </div>
            <div>
              <Label>Slug (URL amigável)</Label>
              <Input
                value={formData.slug || ''}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                data-testid="input-slug"
              />
            </div>
            <div>
              <Label>Resumo</Label>
              <Textarea
                value={formData.excerpt || ''}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                data-testid="input-excerpt"
              />
            </div>
            <div>
              <Label>Conteúdo</Label>
              <Textarea
                rows={6}
                value={formData.content || ''}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                data-testid="input-content"
              />
            </div>
            <div>
              <Label>URL da Imagem</Label>
              <Input
                value={formData.image || ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                data-testid="input-image"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} data-testid="button-save">
                <Save className="mr-2 h-4 w-4" /> Guardar
              </Button>
              <Button variant="outline" onClick={() => { setEditing(null); setFormData({}); }} data-testid="button-cancel">
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
                {noticia.image && (
                  <img src={noticia.image} alt={noticia.title} className="w-16 h-16 object-cover rounded" />
                )}
                <div>
                  <h3 className="font-semibold">{noticia.title}</h3>
                  <p className="text-sm text-muted-foreground">{noticia.excerpt?.substring(0, 80)}...</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { setEditing(noticia.id); setFormData(noticia); }} data-testid={`button-edit-${noticia.id}`}>
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
