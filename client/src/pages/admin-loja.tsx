import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/navigation";
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Store, Palette, RefreshCw, Image, Package, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";

interface ProductForm {
  titulo: string;
  descricao: string;
  preco: string;
  imagem: string;
  categoria: string;
  destaque: boolean;
}

interface TextureCover {
  name: string;
  path: string;
  fileName: string;
  textureCount: number;
}

interface CanvasCover {
  name: string;
  path: string;
  fileName: string;
  imageCount: number;
}

interface CanvasImage {
  name: string;
  path: string;
  fileName: string;
  category: string;
}

export default function AdminLoja() {
  const { toast } = useToast();
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ProductForm>({
    titulo: "", descricao: "", preco: "", imagem: "", categoria: "Papel de Parede", destaque: false
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  // Fetch texture images for the store
  const { data: images } = useQuery({
    queryKey: ["/api/loja/images"],
  });

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/loja');
      const data = await response.json();
      setProdutos(data.produtos || []);
    } catch (error) {
      console.error('Error fetching loja produtos:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar produtos da loja",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get texture categories from images (papel de parede)
  const textureCovers: TextureCover[] = (images as { images: string[] })?.images
    ?.filter((path: string) => path.includes('capas-texturas'))
    ?.map((path: string) => {
      const fileName = path.split('/').pop()?.replace('.webp', '') || '';
      const displayName = fileName
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l: string) => l.toUpperCase());
      
      // Count textures in this category
      const categoryImages = (images as { images: string[] })?.images
        ?.filter((imgPath: string) => 
          imgPath.includes(`texturas/${fileName}/`) &&
          /\.(jpg|jpeg|png|gif|webp)$/i.test(imgPath)
        ) || [];
      
      return {
        name: displayName,
        path: `/public-objects/${path}`,
        fileName: fileName,
        textureCount: categoryImages.length
      };
    })
    ?.filter((texture) => texture.textureCount > 0) || [];

  // Get canvas covers (capas dos quadros)
  const canvasCovers: CanvasCover[] = (images as { images: string[] })?.images
    ?.filter((path: string) => path.includes('Capas-quadros-em-canvas'))
    ?.map((path: string) => {
      const fileName = path.split('/').pop()?.replace('.webp', '') || '';
      const displayName = fileName
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l: string) => l.toUpperCase());
      
      // Count canvas images in this category
      const categoryImages = (images as { images: string[] })?.images
        ?.filter((imgPath: string) => 
          imgPath.includes(`Quadros-em-canvas/${fileName}/`) &&
          /\.(jpg|jpeg|png|gif|webp)$/i.test(imgPath)
        ) || [];
      
      return {
        name: displayName,
        path: `/public-objects/${path}`,
        fileName: fileName,
        imageCount: categoryImages.length
      };
    })
    ?.filter((cover) => cover.imageCount > 0) || [];

  // Get all canvas images with their categories
  const canvasImages: CanvasImage[] = (images as { images: string[] })?.images
    ?.filter((path: string) => 
      path.includes('Quadros-em-canvas/') && 
      !path.includes('Capas-quadros-em-canvas') &&
      /\.(jpg|jpeg|png|gif|webp)$/i.test(path)
    )
    ?.map((path: string) => {
      const parts = path.split('/');
      const fileName = parts.pop()?.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '') || '';
      const category = parts[parts.length - 1] || '';
      const displayName = fileName
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l: string) => l.toUpperCase());
      
      return {
        name: displayName,
        path: `/public-objects/${path}`,
        fileName: fileName,
        category: category
      };
    }) || [];

  const saveProduto = async (produtoData: ProductForm, produtoId?: string) => {
    try {
      const url = produtoId ? `/api/admin/loja/${produtoId}` : '/api/admin/loja';
      const method = produtoId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produtoData),
      });

      if (response.ok) {
        await fetchProdutos();
        setEditingId(null);
        resetForm();
        toast({
          title: "Sucesso",
          description: produtoId ? "Produto da loja atualizado" : "Produto da loja criado",
        });
      } else {
        throw new Error('Falha ao salvar produto da loja');
      }
    } catch (error) {
      console.error('Error saving loja produto:', error);
      toast({
        title: "Erro",
        description: "Falha ao salvar produto da loja",
        variant: "destructive",
      });
    }
  };

  const deleteProduto = async (produtoId: string) => {
    if (!confirm('Tem certeza que deseja remover este produto da loja?')) return;

    try {
      const response = await fetch(`/api/admin/loja/${produtoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchProdutos();
        toast({
          title: "Sucesso",
          description: "Produto da loja removido",
        });
      } else {
        throw new Error('Falha ao remover produto da loja');
      }
    } catch (error) {
      console.error('Error deleting loja produto:', error);
      toast({
        title: "Erro",
        description: "Falha ao remover produto da loja",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditForm({
      titulo: "", descricao: "", preco: "", imagem: "", categoria: "Papel de Parede", destaque: false
    });
  };

  const startEdit = (produto: Product) => {
    setEditingId(produto.id);
    setEditForm({
      titulo: produto.titulo,
      descricao: produto.descricao,
      preco: produto.preco,
      imagem: produto.imagem,
      categoria: produto.categoria,
      destaque: produto.destaque || false
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  const handleAutoGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/auto-generate-covers', {
        method: 'POST'
      });
      
      const result = await response.json();
      setLastResult(result);
      
      if (response.ok) {
        toast({
          title: "Geração automática concluída!",
          description: `${result.coversGenerated?.length || 0} novas capas geradas.`,
        });
      } else {
        toast({
          title: "Erro na geração",
          description: result.error || "Erro desconhecido",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha na comunicação com o servidor",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const lojaProdutos = produtos.filter(p => 
    p.categoria === "Papel de Parede" || 
    p.categoria === "Quadros Canvas" ||
    textureCovers.some(t => t.name === p.categoria) ||
    canvasCovers.some(c => c.name === p.categoria)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Navigation />
        <div className="container mx-auto px-4 py-16 mt-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FFD700] mx-auto"></div>
            <p className="mt-4 text-gray-400">A carregar produtos da loja...</p>
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
            <Link href="/admin">
              <Button variant="outline" size="sm" className="gap-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black">
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Dashboard
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Administração da <span className="text-[#FFD700]">Loja</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Gere produtos e texturas de papel de parede da loja online
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-[#111111] border-[#333]">
            <CardContent className="p-6 text-center">
              <Store className="h-8 w-8 text-[#FFD700] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{lojaProdutos.length}</div>
              <div className="text-sm text-gray-400">Produtos Loja</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#111111] border-[#333]">
            <CardContent className="p-6 text-center">
              <Palette className="h-8 w-8 text-[#00d4aa] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{textureCovers.length}</div>
              <div className="text-sm text-gray-400">Categorias Texturas</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#111111] border-[#333]">
            <CardContent className="p-6 text-center">
              <Image className="h-8 w-8 text-[#20B2AA] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{canvasCovers.length}</div>
              <div className="text-sm text-gray-400">Categorias Canvas</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#111111] border-[#333]">
            <CardContent className="p-6 text-center">
              <Store className="h-8 w-8 text-[#4dabf7] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {textureCovers.reduce((sum, texture) => sum + texture.textureCount, 0) + canvasImages.length}
              </div>
              <div className="text-sm text-gray-400">Total Imagens</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#111111] border-[#333]">
            <CardContent className="p-6 text-center">
              <Package className="h-8 w-8 text-[#ff6b35] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {lojaProdutos.filter(p => p.destaque).length}
              </div>
              <div className="text-sm text-gray-400">Em Destaque</div>
            </CardContent>
          </Card>
        </div>

        {/* Texture Management */}
        <Card className="bg-[#111111] border-[#333] mb-8">
          <CardHeader>
            <CardTitle className="text-[#FFD700] flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Gestão de Texturas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <Button 
                onClick={handleAutoGenerate}
                disabled={isGenerating}
                className="bg-[#00d4aa] text-black hover:bg-[#00b894]"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    A gerar...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Auto-gerar Capas
                  </>
                )}
              </Button>
              <span className="text-gray-400 text-sm">
                Gera automaticamente capas para novas categorias de texturas
              </span>
            </div>
            
            {lastResult && (
              <div className="mt-4 p-4 bg-[#222] rounded-lg border border-[#333]">
                <div className="flex items-center gap-2 mb-2">
                  {lastResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  )}
                  <span className="text-white font-medium">
                    {lastResult.success ? "Geração concluída com sucesso" : "Erro na geração"}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  {lastResult.message || `${lastResult.coversGenerated?.length || 0} capas geradas`}
                </p>
              </div>
            )}

            {/* Texture Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {textureCovers.map((texture) => (
                <Card key={texture.fileName} className="bg-[#222] border-[#333] overflow-hidden">
                  <div className="aspect-video">
                    <img 
                      src={texture.path} 
                      alt={texture.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-white font-medium mb-2">{texture.name}</h3>
                    <Badge variant="outline" className="border-[#00d4aa] text-[#00d4aa]">
                      {texture.textureCount} texturas
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Canvas Management */}
        <Card className="bg-[#111111] border-[#333] mb-8">
          <CardHeader>
            <CardTitle className="text-[#FFD700] flex items-center gap-2">
              <Image className="h-5 w-5" />
              Gestão de Quadros em Canvas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <p className="text-white mb-4">
                Capas e imagens dos quadros em canvas disponíveis no sistema
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-[#222] rounded-lg">
                  <div className="text-2xl font-bold text-[#20B2AA]">
                    {canvasCovers.length}
                  </div>
                  <div className="text-sm text-gray-400">Categorias Canvas</div>
                </div>
                <div className="text-center p-4 bg-[#222] rounded-lg">
                  <div className="text-2xl font-bold text-[#FFD700]">
                    {canvasImages.length}
                  </div>
                  <div className="text-sm text-gray-400">Imagens Canvas</div>
                </div>
              </div>
            </div>

            {/* Canvas Categories Grid */}
            {canvasCovers.length > 0 && (
              <div>
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Capas de Categorias Canvas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {canvasCovers.map((cover) => (
                    <Card key={cover.fileName} className="bg-[#222] border-[#333] overflow-hidden">
                      <div className="aspect-video">
                        <img 
                          src={cover.path} 
                          alt={cover.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h4 className="text-white font-medium mb-2">{cover.name}</h4>
                        <Badge variant="outline" className="border-[#20B2AA] text-[#20B2AA]">
                          {cover.imageCount} imagens
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Canvas Images Grid */}
            {canvasImages.length > 0 && (
              <div>
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  Imagens Canvas Disponíveis
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {canvasImages.slice(0, 12).map((image, index) => (
                    <div key={index} className="bg-[#222] border border-[#333] rounded overflow-hidden">
                      <div className="aspect-square">
                        <img 
                          src={image.path} 
                          alt={image.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-2">
                        <div className="text-xs text-white truncate" title={image.name}>
                          {image.name}
                        </div>
                        <div className="text-xs text-gray-400 truncate">
                          {image.category}
                        </div>
                      </div>
                    </div>
                  ))}
                  {canvasImages.length > 12 && (
                    <div className="bg-[#222] border border-[#333] rounded flex items-center justify-center text-center p-4">
                      <div className="text-gray-400">
                        <div className="text-lg font-bold">+{canvasImages.length - 12}</div>
                        <div className="text-xs">mais imagens</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {canvasCovers.length === 0 && canvasImages.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma capa ou imagem de canvas encontrada</p>
                <p className="text-sm mt-2">Faça upload de arquivos para as pastas:</p>
                <div className="text-xs mt-2 bg-[#222] p-2 rounded">
                  <div>• Capas-quadros-em-canvas/</div>
                  <div>• Quadros-em-canvas/[categoria]/</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add New Product */}
        {editingId === "new" && (
          <Card className="bg-[#111111] border-[#333] mb-8">
            <CardHeader>
              <CardTitle className="text-[#FFD700]">Novo Produto da Loja</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-titulo" className="text-white">Título</Label>
                <Input
                  id="new-titulo"
                  value={editForm.titulo}
                  onChange={(e) => setEditForm({ ...editForm, titulo: e.target.value })}
                  placeholder="Nome do produto"
                  className="bg-[#222] border-[#444] text-white mt-1"
                />
              </div>
              <div>
                <Label htmlFor="new-categoria" className="text-white">Categoria</Label>
                <Select
                  value={editForm.categoria}
                  onValueChange={(value) => setEditForm({ ...editForm, categoria: value })}
                >
                  <SelectTrigger className="bg-[#222] border-[#444] text-white mt-1">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#222] border-[#444] text-white">
                    <SelectItem value="Papel de Parede">Papel de Parede</SelectItem>
                    <SelectItem value="Quadros Canvas">Quadros Canvas</SelectItem>
                    {textureCovers.map((texture) => (
                      <SelectItem key={texture.fileName} value={texture.name}>
                        {texture.name} (Textura)
                      </SelectItem>
                    ))}
                    {canvasCovers.map((canvas) => (
                      <SelectItem key={canvas.fileName} value={canvas.name}>
                        {canvas.name} (Canvas)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="new-preco" className="text-white">Preço</Label>
                <Input
                  id="new-preco"
                  value={editForm.preco}
                  onChange={(e) => setEditForm({ ...editForm, preco: e.target.value })}
                  placeholder="€ 29.90"
                  className="bg-[#222] border-[#444] text-white mt-1"
                />
              </div>
              <div>
                <Label htmlFor="new-imagem" className="text-white">URL da Imagem</Label>
                <Input
                  id="new-imagem"
                  value={editForm.imagem}
                  onChange={(e) => setEditForm({ ...editForm, imagem: e.target.value })}
                  placeholder="https://exemplo.com/produto.jpg"
                  className="bg-[#222] border-[#444] text-white mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="new-descricao" className="text-white">Descrição</Label>
                <Textarea
                  id="new-descricao"
                  value={editForm.descricao}
                  onChange={(e) => setEditForm({ ...editForm, descricao: e.target.value })}
                  placeholder="Descrição detalhada do produto"
                  className="bg-[#222] border-[#444] text-white mt-1"
                />
              </div>
              <div className="md:col-span-2 flex items-center space-x-2">
                <Checkbox
                  id="new-destaque"
                  checked={editForm.destaque}
                  onCheckedChange={(checked) => setEditForm({ ...editForm, destaque: !!checked })}
                />
                <Label htmlFor="new-destaque" className="text-white">Produto em destaque na loja</Label>
              </div>
              <div className="md:col-span-2 flex gap-2">
                <Button 
                  onClick={() => saveProduto(editForm)}
                  className="bg-[#FFD700] text-black hover:bg-yellow-400"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Produto
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
                Adicionar Produto à Loja
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Products List */}
        <Card className="bg-[#111111] border-[#333]">
          <CardHeader>
            <CardTitle className="text-[#FFD700]">
              Produtos da Loja
              <Badge variant="secondary" className="ml-2 bg-[#FFD700] text-black">
                {lojaProdutos.length} produtos
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lojaProdutos.length === 0 ? (
              <div className="text-center py-12">
                <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Nenhum produto encontrado na loja</p>
                <p className="text-gray-500 text-sm">Adicione produtos para a loja online</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {lojaProdutos.map((produto) => (
                  <div key={produto.id} className="bg-[#222] rounded-lg border border-[#333] overflow-hidden">
                    {editingId === produto.id ? (
                      <div className="p-6 space-y-4">
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
                          <Select
                            value={editForm.categoria}
                            onValueChange={(value) => setEditForm({ ...editForm, categoria: value })}
                          >
                            <SelectTrigger className="bg-[#333] border-[#444] text-white mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#333] border-[#444] text-white">
                              <SelectItem value="Papel de Parede">Papel de Parede</SelectItem>
                              <SelectItem value="Quadros Canvas">Quadros Canvas</SelectItem>
                              {textureCovers.map((texture) => (
                                <SelectItem key={texture.fileName} value={texture.name}>
                                  {texture.name} (Textura)
                                </SelectItem>
                              ))}
                              {canvasCovers.map((canvas) => (
                                <SelectItem key={canvas.fileName} value={canvas.name}>
                                  {canvas.name} (Canvas)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-white">Preço</Label>
                          <Input
                            value={editForm.preco}
                            onChange={(e) => setEditForm({ ...editForm, preco: e.target.value })}
                            className="bg-[#333] border-[#444] text-white mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-white">URL da Imagem</Label>
                          <Input
                            value={editForm.imagem}
                            onChange={(e) => setEditForm({ ...editForm, imagem: e.target.value })}
                            className="bg-[#333] border-[#444] text-white mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-white">Descrição</Label>
                          <Textarea
                            value={editForm.descricao}
                            onChange={(e) => setEditForm({ ...editForm, descricao: e.target.value })}
                            className="bg-[#333] border-[#444] text-white mt-1"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={editForm.destaque}
                            onCheckedChange={(checked) => setEditForm({ ...editForm, destaque: !!checked })}
                          />
                          <Label className="text-white">Produto em destaque</Label>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => saveProduto(editForm, produto.id)}
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
                      <>
                        <div className="h-48 relative">
                          <img 
                            src={produto.imagem} 
                            alt={produto.titulo}
                            className="w-full h-full object-cover"
                          />
                          {produto.destaque && (
                            <Badge className="absolute top-2 right-2 bg-[#FFD700] text-black">
                              <Store className="w-3 h-3 mr-1" />
                              Destaque
                            </Badge>
                          )}
                        </div>
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant="outline" className="border-[#FFD700] text-[#FFD700]">
                              {produto.categoria}
                            </Badge>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => startEdit(produto)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteProduto(produto.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <h3 className="text-white font-medium text-lg mb-2">
                            {produto.titulo}
                          </h3>
                          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                            {produto.descricao}
                          </p>
                          <div className="text-[#FFD700] font-bold text-xl">
                            {produto.preco}
                          </div>
                        </div>
                      </>
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