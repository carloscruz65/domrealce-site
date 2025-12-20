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
import ImageUploader from "@/components/ImageUploader";

interface Produto {
  id: string;
  titulo: string;
  descricao: string;
  preco: string;
  imagem: string;
  categoria: string;
  destaque?: boolean;
  categoryPath?: string;
}

export default function ProdutosManager() {
  const { toast } = useToast();
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Produto>>({});

  const { data: produtosData, isLoading } = useQuery<{ produtos: Produto[] }>({
    queryKey: ['/api/admin/produtos'],
  });
  
  const produtos = produtosData?.produtos || [];

  const createMutation = useMutation({
    mutationFn: (data: Partial<Produto>) => apiRequest('POST', '/api/admin/produtos', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/produtos'] });
      toast({ title: "Produto criado com sucesso!" });
      setFormData({});
      setEditing(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Produto> }) => 
      apiRequest('PUT', `/api/admin/produtos/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/produtos'] });
      toast({ title: "Produto atualizado!" });
      setFormData({});
      setEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/admin/produtos/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/produtos'] });
      toast({ title: "Produto eliminado!" });
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
          <h2 className="text-2xl font-bold">Gestão de Produtos</h2>
          <p className="text-muted-foreground">Administrar produtos da loja</p>
        </div>
        {!editing && (
          <Button onClick={() => setEditing('new')} data-testid="button-novo-produto">
            <Plus className="mr-2 h-4 w-4" /> Novo Produto
          </Button>
        )}
      </div>

      {editing && (
        <Card>
          <CardHeader>
            <CardTitle>{editing === 'new' ? 'Criar Produto' : 'Editar Produto'}</CardTitle>
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
                value={formData.descricao || ''}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                data-testid="input-descricao"
              />
            </div>
            <div>
              <Label>Preço</Label>
              <Input
                value={formData.preco || ''}
                onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                data-testid="input-preco"
                placeholder="Ex: A partir de €20/m²"
              />
            </div>
            <ImageUploader
              label="Imagem do Produto"
              value={formData.imagem || ''}
              onChange={(url) => setFormData({ ...formData, imagem: url })}
              folder="produtos"
            />
            <div>
              <Label>Categoria</Label>
              <Input
                value={formData.categoria || ''}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                data-testid="input-categoria"
              />
            </div>
            <div>
              <Label>Caminho da Categoria (URL)</Label>
              <Input
                value={formData.categoryPath || ''}
                onChange={(e) => setFormData({ ...formData, categoryPath: e.target.value })}
                data-testid="input-category-path"
                placeholder="Ex: /loja/papel-de-parede/texturas"
              />
              <p className="text-xs text-gray-400 mt-1">Caminho completo para a categoria na loja</p>
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
        {produtos?.map((produto: Produto) => (
          <Card key={produto.id} data-testid={`card-produto-${produto.id}`}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4 flex-1">
                {produto.imagem && (
                  <img src={produto.imagem} alt={produto.titulo} className="w-16 h-16 object-cover rounded" />
                )}
                <div>
                  <h3 className="font-semibold">{produto.titulo}</h3>
                  <p className="text-sm text-muted-foreground">{produto.categoria} • {produto.preco}</p>
                  {produto.categoryPath && (
                    <p className="text-xs text-gray-500">{produto.categoryPath}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { setEditing(produto.id); setFormData(produto); }} data-testid={`button-edit-${produto.id}`}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => deleteMutation.mutate(produto.id)} data-testid={`button-delete-${produto.id}`}>
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
