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
  titulo: string;
  descricao: string;
  categoria: string;
  imagem: string;
  data: string;
}

export default function NoticiasManager() {
  const { toast } = useToast();
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Noticia>>({});

  const { data: noticiasData, isLoading } = useQuery<{ noticias: Noticia[] }>({
    queryKey: ['/api/admin/noticias'],
  });
  
  const noticias = noticiasData?.noticias || [];

  const createMutation = useMutation({
    mutationFn: (data: Partial<Noticia>) => apiRequest('POST', '/api/admin/noticias', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/noticias'] });
      toast({ title: "Notícia criada com sucesso!" });
      setFormData({});
      setEditing(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Noticia> }) => 
      apiRequest('PUT', `/api/admin/noticias/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/noticias'] });
      toast({ title: "Notícia atualizada!" });
      setFormData({});
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
                value={formData.titulo || ''}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                data-testid="input-titulo"
              />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea
                rows={4}
                value={formData.descricao || ''}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                data-testid="input-descricao"
              />
            </div>
            <div>
              <Label>Categoria</Label>
              <Input
                value={formData.categoria || ''}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                data-testid="input-categoria"
              />
            </div>
            <div>
              <Label>URL da Imagem</Label>
              <Input
                value={formData.imagem || ''}
                onChange={(e) => setFormData({ ...formData, imagem: e.target.value })}
                data-testid="input-imagem"
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
                {noticia.imagem && (
                  <img src={noticia.imagem} alt={noticia.titulo} className="w-16 h-16 object-cover rounded" />
                )}
                <div>
                  <h3 className="font-semibold">{noticia.titulo}</h3>
                  <p className="text-sm text-muted-foreground">{noticia.descricao?.substring(0, 80)}{noticia.descricao?.length > 80 ? '...' : ''}</p>
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
