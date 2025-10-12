import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  link?: string;
  order: number;
}

export default function SliderManager() {
  const { toast } = useToast();
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Slide>>({});

  const { data: slides, isLoading } = useQuery({
    queryKey: ['/api/admin/slider'],
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Slide>) => apiRequest('/api/admin/slider', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/slider'] });
      toast({ title: "Slide criado com sucesso!" });
      setFormData({});
      setEditing(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Slide> }) => 
      apiRequest(`/api/admin/slider/${id}`, 'PUT', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/slider'] });
      toast({ title: "Slide atualizado com sucesso!" });
      setFormData({});
      setEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/admin/slider/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/slider'] });
      toast({ title: "Slide eliminado com sucesso!" });
    },
  });

  const handleSave = () => {
    if (editing === 'new') {
      createMutation.mutate(formData);
    } else if (editing) {
      updateMutation.mutate({ id: editing, data: formData });
    }
  };

  const handleEdit = (slide: Slide) => {
    setEditing(slide.id);
    setFormData(slide);
  };

  const handleCancel = () => {
    setEditing(null);
    setFormData({});
  };

  if (isLoading) {
    return <div className="p-4">A carregar...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestão do Slider</h2>
          <p className="text-muted-foreground">Gerir slides da página inicial</p>
        </div>
        {!editing && (
          <Button onClick={() => setEditing('new')} data-testid="button-novo-slide">
            <Plus className="mr-2 h-4 w-4" /> Novo Slide
          </Button>
        )}
      </div>

      {editing && (
        <Card>
          <CardHeader>
            <CardTitle>{editing === 'new' ? 'Criar Slide' : 'Editar Slide'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                data-testid="input-title"
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Subtítulo</Label>
              <Input
                id="subtitle"
                value={formData.subtitle || ''}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                data-testid="input-subtitle"
              />
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                data-testid="input-description"
              />
            </div>
            <div>
              <Label htmlFor="image">URL da Imagem</Label>
              <Input
                id="image"
                value={formData.image || ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                data-testid="input-image"
              />
            </div>
            <div>
              <Label htmlFor="link">Link (opcional)</Label>
              <Input
                id="link"
                value={formData.link || ''}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                data-testid="input-link"
              />
            </div>
            <div>
              <Label htmlFor="order">Ordem</Label>
              <Input
                id="order"
                type="number"
                value={formData.order || 0}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                data-testid="input-order"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} data-testid="button-save">
                <Save className="mr-2 h-4 w-4" /> Guardar
              </Button>
              <Button variant="outline" onClick={handleCancel} data-testid="button-cancel">
                <X className="mr-2 h-4 w-4" /> Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {slides?.slides?.map((slide: Slide) => (
          <Card key={slide.id} data-testid={`card-slide-${slide.id}`}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex-1">
                <h3 className="font-semibold">{slide.title}</h3>
                <p className="text-sm text-muted-foreground">{slide.subtitle}</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEdit(slide)}
                  data-testid={`button-edit-${slide.id}`}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => deleteMutation.mutate(slide.id)}
                  data-testid={`button-delete-${slide.id}`}
                >
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
