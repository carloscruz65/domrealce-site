import { useState, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save, X, GripVertical, ChevronUp, ChevronDown, Eye, EyeOff } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";

interface Slide {
  id: string;
  title: string;
  text: string;
  image: string;
  order_position: string;
  active: boolean;
  createdAt?: string;
}

export default function SliderManager() {
  const { toast } = useToast();
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Slide>>({ active: true });
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const { data: slidesData, isLoading } = useQuery<{ slides: Slide[] }>({
    queryKey: ['/api/admin/slider'],
  });
  
  const slides = slidesData?.slides || [];
  const sortedSlides = [...slides].sort((a, b) => 
    parseInt(a.order_position || "0") - parseInt(b.order_position || "0")
  );
  const activeCount = slides.filter(s => s.active).length;

  const createMutation = useMutation({
    mutationFn: (data: Partial<Slide>) => apiRequest('POST', '/api/admin/slider', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/slider'] });
      toast({ title: "Slide criado com sucesso!" });
      setFormData({ active: true });
      setEditing(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Slide> }) => 
      apiRequest('PUT', `/api/admin/slider/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/slider'] });
      toast({ title: "Slide atualizado!" });
      setFormData({ active: true });
      setEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/admin/slider/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/slider'] });
      toast({ title: "Slide eliminado!" });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => 
      apiRequest('PUT', `/api/admin/slider/${id}`, { active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/slider'] });
    },
  });

  const handleSave = () => {
    if (!formData.title?.trim()) {
      toast({ title: "Título obrigatório", variant: "destructive" });
      return;
    }
    if (!formData.image?.trim()) {
      toast({ title: "Imagem obrigatória", variant: "destructive" });
      return;
    }

    if (editing === 'new') {
      createMutation.mutate({
        ...formData,
        order_position: formData.order_position || String(slides.length + 1),
      });
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
    setFormData({ active: true });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      handleDragEnd();
      return;
    }

    const newSlides = [...sortedSlides];
    const [draggedItem] = newSlides.splice(draggedIndex, 1);
    newSlides.splice(dropIndex, 0, draggedItem);

    for (let i = 0; i < newSlides.length; i++) {
      if (newSlides[i].order_position !== String(i + 1)) {
        await apiRequest('PUT', `/api/admin/slider/${newSlides[i].id}`, { 
          order_position: String(i + 1) 
        });
      }
    }

    queryClient.invalidateQueries({ queryKey: ['/api/admin/slider'] });
    toast({ title: "Ordem atualizada!" });
    handleDragEnd();
  };

  const moveSlide = useCallback(async (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sortedSlides.length) return;

    const slide1 = sortedSlides[index];
    const slide2 = sortedSlides[newIndex];

    await apiRequest('PUT', `/api/admin/slider/${slide1.id}`, { 
      order_position: slide2.order_position 
    });
    await apiRequest('PUT', `/api/admin/slider/${slide2.id}`, { 
      order_position: slide1.order_position 
    });

    queryClient.invalidateQueries({ queryKey: ['/api/admin/slider'] });
    toast({ title: "Ordem atualizada!" });
  }, [sortedSlides]);

  if (isLoading) {
    return <div className="p-4">A carregar...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold">Gestão do Slider</h2>
          <p className="text-muted-foreground">
            Gerir slides da página inicial • {activeCount} de {slides.length} ativos
          </p>
        </div>
        {!editing && (
          <Button onClick={() => setEditing('new')} data-testid="button-novo-slide">
            <Plus className="mr-2 h-4 w-4" /> Novo Slide
          </Button>
        )}
      </div>

      {slides.length > 1 && !editing && (
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <GripVertical className="h-4 w-4" />
            <strong>Dica:</strong> Arraste os slides para reordenar, ou use as setas. Ative/desative slides com o interruptor.
          </p>
        </div>
      )}

      {editing && (
        <Card>
          <CardHeader>
            <CardTitle>{editing === 'new' ? 'Criar Slide' : 'Editar Slide'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Título <span className="text-destructive">*</span></Label>
                  <Input
                    id="title"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Título do slide"
                    data-testid="input-title"
                  />
                </div>
                <div>
                  <Label htmlFor="text">Texto / Descrição</Label>
                  <Textarea
                    id="text"
                    value={formData.text || ''}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    placeholder="Descrição do slide"
                    rows={3}
                    data-testid="input-text"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label htmlFor="order_position">Posição</Label>
                    <Input
                      id="order_position"
                      type="number"
                      min="1"
                      value={formData.order_position || String(slides.length + 1)}
                      onChange={(e) => setFormData({ ...formData, order_position: e.target.value })}
                      data-testid="input-order"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <Switch
                      id="active"
                      checked={formData.active ?? true}
                      onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                      data-testid="switch-active"
                    />
                    <Label htmlFor="active">Ativo</Label>
                  </div>
                </div>
              </div>
              <div>
                <ImageUploader
                  label="Imagem do Slide *"
                  value={formData.image || ''}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  folder="slider"
                />
                {formData.image && (
                  <div className="mt-2 border rounded-lg overflow-hidden">
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="w-full h-40 object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleSave} 
                disabled={createMutation.isPending || updateMutation.isPending}
                data-testid="button-save"
              >
                <Save className="mr-2 h-4 w-4" /> 
                {createMutation.isPending || updateMutation.isPending ? 'A guardar...' : 'Guardar'}
              </Button>
              <Button variant="outline" onClick={handleCancel} data-testid="button-cancel">
                <X className="mr-2 h-4 w-4" /> Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {sortedSlides.length === 0 && !editing ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Ainda não há slides.</p>
            <Button onClick={() => setEditing('new')}>
              <Plus className="mr-2 h-4 w-4" /> Criar Primeiro Slide
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {sortedSlides.map((slide: Slide, index: number) => (
            <Card 
              key={slide.id} 
              data-testid={`card-slide-${slide.id}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              onDrop={(e) => handleDrop(e, index)}
              className={`
                transition-all duration-200 cursor-move
                ${draggedIndex === index ? "opacity-50 scale-[0.98]" : ""}
                ${dragOverIndex === index && draggedIndex !== index ? "ring-2 ring-primary" : ""}
                ${!slide.active ? "opacity-60" : ""}
              `}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => moveSlide(index, "up")}
                    disabled={index === 0}
                    className="h-6 w-6"
                    data-testid={`button-move-up-${slide.id}`}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => moveSlide(index, "down")}
                    disabled={index === sortedSlides.length - 1}
                    className="h-6 w-6"
                    data-testid={`button-move-down-${slide.id}`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>

                {slide.image && (
                  <img 
                    src={slide.image} 
                    alt={slide.title} 
                    className="w-24 h-16 object-cover rounded"
                  />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      #{slide.order_position}
                    </Badge>
                    <h3 className="font-semibold truncate">{slide.title || 'Sem título'}</h3>
                    {slide.active ? (
                      <Badge className="bg-green-500 text-white text-xs">Ativo</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">Inativo</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {slide.text?.substring(0, 80)}{slide.text?.length > 80 ? '...' : ''}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={slide.active}
                    onCheckedChange={(checked) => 
                      toggleActiveMutation.mutate({ id: slide.id, active: checked })
                    }
                    data-testid={`switch-active-${slide.id}`}
                  />
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
      )}
    </div>
  );
}
