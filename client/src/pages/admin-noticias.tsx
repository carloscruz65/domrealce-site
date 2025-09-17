import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/navigation";
import { ArrowLeft, Plus, Edit, Trash2, Save, X, FileText, Calendar, Tag } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { ImageUploadField } from "@/components/visual-editor/ImageUploadField";
import type { News } from "@shared/schema";

interface NewsForm {
  titulo: string;
  descricao: string;
  categoria: string;
  imagem: string;
  data: string;
}

export default function AdminNoticias() {
  const { toast } = useToast();
  const [noticias, setNoticias] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<NewsForm>({
    titulo: "", descricao: "", categoria: "", imagem: "", data: ""
  });

  useEffect(() => {
    fetchNoticias();
  }, []);

  const fetchNoticias = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/noticias');
      const data = await response.json();
      setNoticias(data.noticias || []);
    } catch (error) {
      console.error('Error fetching noticias:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar notícias",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveNoticia = async (noticiaData: NewsForm, noticiaId?: string) => {
    try {
      const url = noticiaId ? `/api/admin/noticias/${noticiaId}` : '/api/admin/noticias';
      const method = noticiaId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...noticiaData,
          data: new Date(noticiaData.data).toISOString()
        }),
      });

      if (response.ok) {
        await fetchNoticias();
        setEditingId(null);
        resetForm();
        toast({
          title: "Sucesso",
          description: noticiaId ? "Notícia atualizada" : "Notícia criada",
        });
      } else {
        throw new Error('Falha ao salvar notícia');
      }
    } catch (error) {
      console.error('Error saving noticia:', error);
      toast({
        title: "Erro",
        description: "Falha ao salvar notícia",
        variant: "destructive",
      });
    }
  };

  const deleteNoticia = async (noticiaId: string) => {
    if (!confirm('Tem certeza que deseja remover esta notícia?')) return;

    try {
      const response = await fetch(`/api/admin/noticias/${noticiaId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchNoticias();
        toast({
          title: "Sucesso",
          description: "Notícia removida",
        });
      } else {
        throw new Error('Falha ao remover notícia');
      }
    } catch (error) {
      console.error('Error deleting noticia:', error);
      toast({
        title: "Erro",
        description: "Falha ao remover notícia",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditForm({
      titulo: "", descricao: "", categoria: "", imagem: "", data: ""
    });
  };

  const startEdit = (noticia: News) => {
    setEditingId(noticia.id);
    setEditForm({
      titulo: noticia.titulo,
      descricao: noticia.descricao,
      categoria: noticia.categoria,
      imagem: noticia.imagem,
      data: noticia.data ? new Date(noticia.data).toISOString().split('T')[0] : ""
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('pt-PT');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Navigation />
        <div className="container mx-auto px-4 py-16 mt-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FFD700] mx-auto"></div>
            <p className="mt-4 text-gray-400">A carregar notícias...</p>
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
            <Link href="/noticias">
              <Button variant="outline" size="sm" className="gap-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black">
                <ArrowLeft className="h-4 w-4" />
                Voltar às Notícias
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Administração de <span className="text-[#FFD700]">Notícias</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Gere as notícias e artigos do site
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-[#111111] border-[#333]">
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 text-[#FFD700] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{noticias.length}</div>
              <div className="text-sm text-gray-400">Total Notícias</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#111111] border-[#333]">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-[#00d4aa] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {noticias.filter(n => n.data && new Date(n.data) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
              </div>
              <div className="text-sm text-gray-400">Últimos 30 dias</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#111111] border-[#333]">
            <CardContent className="p-6 text-center">
              <Tag className="h-8 w-8 text-[#4dabf7] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {new Set(noticias.map(n => n.categoria)).size}
              </div>
              <div className="text-sm text-gray-400">Categorias</div>
            </CardContent>
          </Card>
        </div>

        {/* Add New News */}
        {editingId === "new" && (
          <Card className="bg-[#111111] border-[#333] mb-8">
            <CardHeader>
              <CardTitle className="text-[#FFD700]">Nova Notícia</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-titulo" className="text-white">Título</Label>
                <Input
                  id="new-titulo"
                  value={editForm.titulo}
                  onChange={(e) => setEditForm({ ...editForm, titulo: e.target.value })}
                  placeholder="Título da notícia"
                  className="bg-[#222] border-[#444] text-white mt-1"
                />
              </div>
              <div>
                <Label htmlFor="new-categoria" className="text-white">Categoria</Label>
                <Input
                  id="new-categoria"
                  value={editForm.categoria}
                  onChange={(e) => setEditForm({ ...editForm, categoria: e.target.value })}
                  placeholder="Categoria da notícia"
                  className="bg-[#222] border-[#444] text-white mt-1"
                />
              </div>
              <div>
                <Label htmlFor="new-data" className="text-white">Data</Label>
                <Input
                  id="new-data"
                  type="date"
                  value={editForm.data}
                  onChange={(e) => setEditForm({ ...editForm, data: e.target.value })}
                  className="bg-[#222] border-[#444] text-white mt-1"
                />
              </div>
              <div>
                <ImageUploadField
                  label="Imagem da Notícia"
                  value={editForm.imagem}
                  onChange={(value) => setEditForm({ ...editForm, imagem: value })}
                  placeholder="https://exemplo.com/noticia.jpg ou faça upload"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="new-descricao" className="text-white">Descrição</Label>
                <Textarea
                  id="new-descricao"
                  value={editForm.descricao}
                  onChange={(e) => setEditForm({ ...editForm, descricao: e.target.value })}
                  placeholder="Conteúdo da notícia"
                  rows={6}
                  className="bg-[#222] border-[#444] text-white mt-1"
                />
              </div>
              <div className="md:col-span-2 flex gap-2">
                <Button 
                  onClick={() => saveNoticia(editForm)}
                  className="bg-[#FFD700] text-black hover:bg-yellow-400"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Notícia
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
        {editingId !== "new" && (
          <Card className="bg-[#111111] border-[#333] mb-8">
            <CardContent className="p-6 text-center">
              <Button 
                onClick={() => setEditingId("new")}
                className="bg-[#FFD700] text-black hover:bg-yellow-400"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Nova Notícia
              </Button>
            </CardContent>
          </Card>
        )}

        {/* News List */}
        <Card className="bg-[#111111] border-[#333]">
          <CardHeader>
            <CardTitle className="text-[#FFD700]">
              Notícias
              <Badge variant="secondary" className="ml-2 bg-[#FFD700] text-black">
                {noticias.length} notícias
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {noticias.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Nenhuma notícia encontrada</p>
                <p className="text-gray-500 text-sm">Adicione notícias para o site</p>
              </div>
            ) : (
              <div className="space-y-6">
                {noticias.map((noticia) => (
                  <div key={noticia.id} className="bg-[#222] rounded-lg border border-[#333] overflow-hidden">
                    {editingId === noticia.id ? (
                      <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-white">Título</Label>
                            <Input
                              value={editForm.titulo}
                              onChange={(e) => setEditForm({ ...editForm, titulo: e.target.value })}
                              className="bg-[#333] border-[#444] text-white mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-white">Categoria</Label>
                            <Input
                              value={editForm.categoria}
                              onChange={(e) => setEditForm({ ...editForm, categoria: e.target.value })}
                              className="bg-[#333] border-[#444] text-white mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-white">Data</Label>
                            <Input
                              type="date"
                              value={editForm.data}
                              onChange={(e) => setEditForm({ ...editForm, data: e.target.value })}
                              className="bg-[#333] border-[#444] text-white mt-1"
                            />
                          </div>
                          <div>
                            <ImageUploadField
                              label="Imagem da Notícia"
                              value={editForm.imagem}
                              onChange={(value) => setEditForm({ ...editForm, imagem: value })}
                              placeholder="https://exemplo.com/noticia.jpg ou faça upload"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-white">Descrição</Label>
                          <Textarea
                            value={editForm.descricao}
                            onChange={(e) => setEditForm({ ...editForm, descricao: e.target.value })}
                            rows={4}
                            className="bg-[#333] border-[#444] text-white mt-1"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => saveNoticia(editForm, noticia.id)}
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
                            src={noticia.imagem} 
                            alt={noticia.titulo}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="border-[#FFD700] text-[#FFD700]">
                                  {noticia.categoria}
                                </Badge>
                                <Badge variant="secondary" className="bg-[#333] text-gray-300">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {formatDate(noticia.data)}
                                </Badge>
                              </div>
                              <h3 className="text-white font-medium text-lg mb-2">
                                {noticia.titulo}
                              </h3>
                              <p className="text-gray-400 text-sm line-clamp-2">
                                {noticia.descricao}
                              </p>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => startEdit(noticia)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteNoticia(noticia.id)}
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