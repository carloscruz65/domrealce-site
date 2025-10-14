import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Package, Eye, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Encomenda {
  id: string;
  numeroEncomenda: string;
  clienteNome: string;
  clienteEmail: string;
  clienteTelefone: string;
  estado: string;
  estadoPagamento: string;
  total: string;
  itens: any[];
  createdAt: string;
}

const STATUS_OPTIONS = [
  { value: "pendente", label: "Pendente", color: "bg-yellow-500" },
  { value: "processamento", label: "Em Processamento", color: "bg-blue-500" },
  { value: "enviado", label: "Enviado", color: "bg-purple-500" },
  { value: "entregue", label: "Entregue", color: "bg-green-500" },
  { value: "cancelado", label: "Cancelado", color: "bg-red-500" },
];

const PAYMENT_STATUS = [
  { value: "pendente", label: "Pendente", color: "bg-yellow-500" },
  { value: "pago", label: "Pago", color: "bg-green-500" },
  { value: "falhou", label: "Falhou", color: "bg-red-500" },
];

export default function EncomendasManager() {
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<Encomenda | null>(null);

  const { data: orders, isLoading } = useQuery<Encomenda[]>({
    queryKey: ['/api/admin/orders'],
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, estado }: { id: string; estado: string }) => 
      apiRequest(`/api/admin/orders/${id}/status`, 'PUT', { estado }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/orders'] });
      toast({ title: "Estado atualizado!" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/admin/orders/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/orders'] });
      toast({ title: "Encomenda eliminada!" });
      setSelectedOrder(null);
    },
  });

  const getStatusBadge = (status: string, type: 'order' | 'payment') => {
    const options = type === 'order' ? STATUS_OPTIONS : PAYMENT_STATUS;
    const statusInfo = options.find(s => s.value === status) || options[0];
    return (
      <Badge className={`${statusInfo.color} text-white`}>
        {statusInfo.label}
      </Badge>
    );
  };

  if (isLoading) return <div className="p-4">A carregar...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Encomendas</h2>
          <p className="text-muted-foreground">Administrar encomendas e estados</p>
        </div>
      </div>

      <div className="grid gap-4">
        {orders?.map((order: Encomenda) => (
          <Card key={order.id} data-testid={`card-order-${order.id}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="font-semibold">#{order.numeroEncomenda}</h3>
                    {getStatusBadge(order.estado, 'order')}
                    {getStatusBadge(order.estadoPagamento, 'payment')}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {order.clienteNome} • {order.clienteEmail} • {order.total}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(order.createdAt).toLocaleString('pt-PT')}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <Select
                    value={order.estado}
                    onValueChange={(value) => updateStatusMutation.mutate({ id: order.id, estado: value })}
                  >
                    <SelectTrigger className="w-40" data-testid={`select-status-${order.id}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map(status => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedOrder(order)}
                    data-testid={`button-view-${order.id}`}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => deleteMutation.mutate(order.id)}
                    data-testid={`button-delete-${order.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Encomenda #{selectedOrder?.numeroEncomenda}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Informação do Cliente</h4>
                <p><strong>Nome:</strong> {selectedOrder.clienteNome}</p>
                <p><strong>Email:</strong> {selectedOrder.clienteEmail}</p>
                <p><strong>Telefone:</strong> {selectedOrder.clienteTelefone}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Itens</h4>
                {selectedOrder.itens?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between p-2 border-b">
                    <span>{item.nome || item.titulo}</span>
                    <span>{item.quantidade}x €{item.preco}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="font-semibold">Total:</span>
                <span className="text-xl font-bold">{selectedOrder.total}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
