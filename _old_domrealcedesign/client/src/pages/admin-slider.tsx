import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/navigation";
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Image, Monitor } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { ImageSelector } from "@/components/ImageSelector";

interface SlideData {
  id: number;
  image: string;
  title: string;
  text: string;
}

export default function AdminSlider() {
  const { toast } = useToast();
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ image: "", title: "", text: "" });

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/slider');
      const data = await response.json();
      setSlides(data.slides || []);
    } catch (error) {
      console.error('Error fetching slides:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar slides",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const syncSliderImages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/slider/images');
      if (response.ok) {
        await fetchSlides();
        toast({
          title: "Sucesso",
          description: "Imagens sincronizadas automaticamente",
        });
      } else {
        throw new Error('Falha na sincronização');
      }
    } catch (error) {
      console.error('Error syncing images:', error);
      toast({
        title: "Erro",
        description: "Falha ao sincronizar imagens",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSlide = async (slideData: Omit<SlideData, 'id'>, slideId?: number) => {
    try {
      const url = slideId ? `/api/admin/slider/${slideId}` : '/api/admin/slider';
      const method = slideId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slideData),
      });

      if (response.ok) {
        await fetchSlides();
        setEditingId(null);
        setEditForm({ image: "", title: "", text: "" });
        toast({
          title: "Sucesso",
          description: slideId ? "Slide atualizado" : "Slide criado",
        });
      } else {
        throw new Error('Falha ao salvar slide');
      }
    } catch (error) {
      console.error('Error saving slide:', error);
      toast({
        title: "Erro",
        description: "Falha ao salvar slide",
        variant: "destructive",
      });
    }
  };

  const deleteSlide = async (slideId: number) => {
    if (!confirm('Tem certeza que deseja remover este slide?')) return;

    try {
      const response = await fetch(`/api/admin/slider/${slideId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchSlides();
        toast({
          title: "Sucesso",
          description: "Slide removido",
        });
      } else {
        throw new Error('Falha ao remover slide');
      }
    } catch (error) {
      console.error('Error deleting slide:', error);
      toast({
        title: "Erro",
        description: "Falha ao remover slide",
        variant: "destructive",
      });
    }
  };

  const startEdit = (slide: SlideData) => {
    setEditingId(slide.id);
    setEditForm({ image: slide.image, title: slide.title, text: slide.text });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ image: "", title: "", text: "" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Navigation />
        <div className="container mx-auto px-4 py-16 mt-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FFD700] mx-auto"></div>
            <p className="mt-4 text-gray-400">A carregar slides...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navigation />
      
      {/* Header */}
      <div className="bg-[#111111] border-b border-[#333] mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black">
                <ArrowLeft className="h-4 w-4" />
                Voltar à Homepage
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Administração do <span className="text-[#FFD700]">Slider</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Gere as imagens e textos do slider da página inicial
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-[#111111] border-[#333]">
            <CardContent className="p-6 text-center">
              <Monitor className="h-8 w-8 text-[#FFD700] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{slides.length}</div>
              <div className="text-sm text-gray-400">Slides Ativos</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#111111] border-[#333]">
            <CardContent className="p-6 text-center">
              <Image className="h-8 w-8 text-[#00d4aa] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">5s</div>
              <div className="text-sm text-gray-400">Tempo por Slide</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#111111] border-[#333]">
            <CardContent className="p-6 text-center">
              <Plus className="h-8 w-8 text-[#4dabf7] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">100vh</div>
              <div className="text-sm text-gray-400">Altura Total</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Button 
            onClick={() => setEditingId(-1)}
            className="bg-[#FFD700] text-black hover:bg-yellow-400"
            disabled={loading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Novo Slide
          </Button>
          
          <Button 
            onClick={syncSliderImages}
            variant="outline"
            className="border-[#00d4aa] text-[#00d4aa] hover:bg-[#00d4aa] hover:text-black"
            disabled={loading}
          >
            <Image className="h-4 w-4 mr-2" />
            Detectar Imagens Automaticamente
          </Button>
        </div>

        {/* Add New Slide */}
        {editingId === -1 && (
          <Card className="bg-[#111111] border-[#333] mb-8">
            <CardHeader>
              <CardTitle className="text-[#FFD700]">Novo Slide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Imagem do Slide</Label>
                <div className="mt-2">
                  <ImageSelector 
                    selectedImage={editForm.image}
                    onImageSelect={(imageUrl) => setEditForm({ ...editForm, image: imageUrl })}
                    placeholder="Adicionar Imagem"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="new-title" className="text-white">Título</Label>
                <Input
                  id="new-title"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="Título do slide"
                  className="bg-[#222] border-[#444] text-white mt-1"
                />
              </div>
              <div>
                <Label htmlFor="new-text" className="text-white">Descrição</Label>
                <Textarea
                  id="new-text"
                  value={editForm.text}
                  onChange={(e) => setEditForm({ ...editForm, text: e.target.value })}
                  placeholder="Texto descritivo do slide"
                  className="bg-[#222] border-[#444] text-white mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => saveSlide(editForm)}
                  className="bg-[#FFD700] text-black hover:bg-yellow-400"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
                <Button onClick={cancelEdit} variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Button */}
        {editingId !== -1 && (
          <Card className="bg-[#111111] border-[#333] mb-8">
            <CardContent className="p-6 text-center">
              <Button 
                onClick={() => setEditingId(-1)}
                className="bg-[#FFD700] text-black hover:bg-yellow-400"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Novo Slide
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Slides List */}
        <Card className="bg-[#111111] border-[#333]">
          <CardHeader>
            <CardTitle className="text-[#FFD700]">
              Slides do Homepage
              <Badge variant="secondary" className="ml-2 bg-[#FFD700] text-black">
                {slides.length} slides
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {slides.length === 0 ? (
              <div className="text-center py-12">
                <Monitor className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Nenhum slide encontrado</p>
                <p className="text-gray-500 text-sm">Adicione slides para a página inicial</p>
              </div>
            ) : (
              <div className="space-y-6">
                {slides.map((slide, index) => (
                  <div key={slide.id} className="bg-[#222] rounded-lg border border-[#333] overflow-hidden">
                    {editingId === slide.id ? (
                      <div className="p-6 space-y-4">
                        <div>
                          <Label className="text-white">Imagem do Slide</Label>
                          <div className="mt-2">
                            <ImageSelector 
                              selectedImage={editForm.image}
                              onImageSelect={(imageUrl) => {
                                // Apenas atualizar a imagem, preservar título e texto
                                setEditForm(prev => ({ ...prev, image: imageUrl }));
                              }}
                              placeholder="Alterar Imagem"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-white">Título</Label>
                          <Input
                            value={editForm.title}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            className="bg-[#333] border-[#444] text-white mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-white">Descrição</Label>
                          <Textarea
                            value={editForm.text}
                            onChange={(e) => setEditForm({ ...editForm, text: e.target.value })}
                            className="bg-[#333] border-[#444] text-white mt-1"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => saveSlide(editForm, slide.id)}
                            className="bg-[#FFD700] text-black hover:bg-yellow-400"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Salvar
                          </Button>
                          <Button onClick={cancelEdit} variant="outline">
                            <X className="w-4 h-4 mr-2" />
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex">
                        <div className="w-48 h-32 flex-shrink-0">
                          <img 
                            src={slide.image} 
                            alt={slide.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <Badge variant="outline" className="mb-2 border-[#FFD700] text-[#FFD700]">
                                Slide {index + 1}
                              </Badge>
                              <h3 className="text-white font-medium text-lg mb-2">
                                {slide.title}
                              </h3>
                              <p className="text-gray-400 text-sm">
                                {slide.text}
                              </p>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => startEdit(slide)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteSlide(slide.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}