import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Navigation from "@/components/navigation";
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Package, Star, Euro } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

interface ProductForm {
  titulo: string;
  descricao: string;
  preco: string;
  imagem: string;
  categoria: string;
  destaque: boolean;
}
export default function AdminProdutos() {
  const { toast } = useToast();
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ProductForm>({
    titulo: "", descricao: "", preco: "", imagem: "", categoria: "", destaque: false
  });
  useEffect(() => {
    fetchProdutos();
  }, []);
  const fetchProdutos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/produtos');
      const data = await response.json();
      setProdutos(data.produtos || []);
    } catch (error) {
      console.error('Error fetching produtos:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar produtos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const saveProduto = async (produtoData: ProductForm, produtoId?: string) => {
      const url = produtoId ? `/api/admin/produtos/${produtoId}` : '/api/admin/produtos';
      const method = produtoId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produtoData),
      if (response.ok) {
        await fetchProdutos();
        setEditingId(null);
        resetForm();
        toast({
          title: "Sucesso",
          description: produtoId ? "Produto atualizado" : "Produto criado",
        });
      } else {
        throw new Error('Falha ao salvar produto');
      }
      console.error('Error saving produto:', error);
        description: "Falha ao salvar produto",
  const deleteProduto = async (produtoId: string) => {
    if (!confirm('Tem certeza que deseja remover este produto?')) return;
      const response = await fetch(`/api/admin/produtos/${produtoId}`, {
        method: 'DELETE',
          description: "Produto removido",
        throw new Error('Falha ao remover produto');
      console.error('Error deleting produto:', error);
        description: "Falha ao remover produto",
  const resetForm = () => {
    setEditForm({
      titulo: "", descricao: "", preco: "", imagem: "", categoria: "", destaque: false
    });
  const startEdit = (produto: Product) => {
    setEditingId(produto.id);
      titulo: produto.titulo,
      descricao: produto.descricao,
      preco: produto.preco,
      imagem: produto.imagem,
      categoria: produto.categoria,
      destaque: produto.destaque || false
  const cancelEdit = () => {
    setEditingId(null);
    resetForm();
  const featuredCount = produtos.filter(p => p.destaque).length;
  if (loading) {
    return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Navigation />
        <div className="container mx-auto px-4 py-16 mt-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FFD700] mx-auto"></div>
            <p className="mt-4 text-gray-400">A carregar produtos...</p>
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
          <h1 className="text-4xl font-bold text-white mb-4">
            Administração de <span className="text-[#FFD700]">Produtos</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Gere os produtos em destaque da homepage
          </p>
      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-[#111111] border-[#333]">
            <CardContent className="p-6 text-center">
              <Package className="h-8 w-8 text-[#FFD700] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{produtos.length}</div>
              <div className="text-sm text-gray-400">Total Produtos</div>
            </CardContent>
          </Card>
          
              <Star className="h-8 w-8 text-[#00d4aa] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{featuredCount}</div>
              <div className="text-sm text-gray-400">Em Destaque</div>
              <Euro className="h-8 w-8 text-[#4dabf7] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {new Set(produtos.map(p => p.categoria)).size}
              </div>
              <div className="text-sm text-gray-400">Categorias</div>
        {/* Add New Product */}
        {editingId === "new" && (
          <Card className="bg-[#111111] border-[#333] mb-8">
            <CardHeader>
              <CardTitle className="text-[#FFD700]">Novo Produto</CardTitle>
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
                <Label htmlFor="new-categoria" className="text-white">Categoria</Label>
                  id="new-categoria"
                  value={editForm.categoria}
                  onChange={(e) => setEditForm({ ...editForm, categoria: e.target.value })}
                  placeholder="Categoria do produto"
                <Label htmlFor="new-preco" className="text-white">Preço</Label>
                  id="new-preco"
                  value={editForm.preco}
                  onChange={(e) => setEditForm({ ...editForm, preco: e.target.value })}
                  placeholder="€ 99.00"
                <Label htmlFor="new-imagem" className="text-white">URL da Imagem</Label>
                  id="new-imagem"
                  value={editForm.imagem}
                  onChange={(e) => setEditForm({ ...editForm, imagem: e.target.value })}
                  placeholder="https://exemplo.com/produto.jpg"
              <div className="md:col-span-2">
                <Label htmlFor="new-descricao" className="text-white">Descrição</Label>
                <Textarea
                  id="new-descricao"
                  value={editForm.descricao}
                  onChange={(e) => setEditForm({ ...editForm, descricao: e.target.value })}
                  placeholder="Descrição detalhada do produto"
              <div className="md:col-span-2 flex items-center space-x-2">
                <Checkbox
                  id="new-destaque"
                  checked={editForm.destaque}
                  onCheckedChange={(checked) => setEditForm({ ...editForm, destaque: !!checked })}
                <Label htmlFor="new-destaque" className="text-white">Produto em destaque na homepage</Label>
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
        )}
        {/* Add Button */}
        {editingId !== "new" && (
              <Button 
                onClick={() => setEditingId("new")}
                className="bg-[#FFD700] text-black hover:bg-yellow-400"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Novo Produto
        {/* Products List */}
        <Card className="bg-[#111111] border-[#333]">
          <CardHeader>
            <CardTitle className="text-[#FFD700]">
              Produtos
              <Badge variant="secondary" className="ml-2 bg-[#FFD700] text-black">
                {produtos.length} produtos
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {produtos.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Nenhum produto encontrado</p>
                <p className="text-gray-500 text-sm">Adicione produtos para a homepage</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {produtos.map((produto) => (
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
                          <Label className="text-white">Categoria</Label>
                            value={editForm.categoria}
                            onChange={(e) => setEditForm({ ...editForm, categoria: e.target.value })}
                          <Label className="text-white">Preço</Label>
                            value={editForm.preco}
                            onChange={(e) => setEditForm({ ...editForm, preco: e.target.value })}
                          <Label className="text-white">URL da Imagem</Label>
                            value={editForm.imagem}
                            onChange={(e) => setEditForm({ ...editForm, imagem: e.target.value })}
                          <Label className="text-white">Descrição</Label>
                          <Textarea
                            value={editForm.descricao}
                            onChange={(e) => setEditForm({ ...editForm, descricao: e.target.value })}
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={editForm.destaque}
                            onCheckedChange={(checked) => setEditForm({ ...editForm, destaque: !!checked })}
                          <Label className="text-white">Produto em destaque</Label>
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
                      </div>
                    ) : (
                      <>
                        <div className="h-48 relative">
                          <img 
                            src={produto.imagem} 
                            alt={produto.titulo}
                            className="w-full h-full object-cover"
                          {produto.destaque && (
                            <Badge className="absolute top-2 right-2 bg-[#FFD700] text-black">
                              <Star className="w-3 h-3 mr-1" />
                              Destaque
                            </Badge>
                          )}
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant="outline" className="border-[#FFD700] text-[#FFD700]">
                              {produto.categoria}
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => startEdit(produto)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                                variant="destructive"
                                onClick={() => deleteProduto(produto.id)}
                                <Trash2 className="h-4 w-4" />
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
                      </>
                    )}
                  </div>
                ))}
            )}
          </CardContent>
        </Card>
    </div>
  );
