import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  ShoppingCart,
  Eye,
  Edit,
  Package,
  Calendar,
  User,
  Euro,
  Filter,
  RefreshCw,
  Truck,
  CreditCard,
  Search
} from "lucide-react";

interface Order {
  id: string;
  numeroEncomenda: string;
  clienteNome: string;
  clienteEmail: string;
  clienteTelefone: string;
  clienteMorada: string;
  clienteCodigoPostal: string;
  clienteCidade: string;
  clienteNIF?: string;
  itens: any[];
  subtotal: string;
  envio: string;
  iva: string;
  total: string;
  estado: "pendente" | "paga" | "processando" | "enviada" | "entregue" | "cancelada";
  metodoPagamento: string;
  estadoPagamento: "pendente" | "pago" | "falhado";
  referenciaIfthenpay?: string;
  dadosPagamento?: any;
  codigoRastreio?: string;
  notasInternas?: string;
  dataPagamento?: string;
  dataEnvio?: string;
  dataEntrega?: string;
  createdAt: string;
  updatedAt: string;
}

const estadoColors = {
  pendente: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  paga: "bg-green-500/20 text-green-400 border-green-500/30",
  processando: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  enviada: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  entregue: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  cancelada: "bg-red-500/20 text-red-400 border-red-500/30",
};

const estadoPagamentoColors = {
  pendente: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  pago: "bg-green-500/20 text-green-400 border-green-500/30",
  falhado: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function AdminEncomendas() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [filterEstado, setFilterEstado] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Estados para edição
  const [editEstado, setEditEstado] = useState("");
  const [editEstadoPagamento, setEditEstadoPagamento] = useState("");
  const [editCodigoRastreio, setEditCodigoRastreio] = useState("");
  const [editNotasInternas, setEditNotasInternas] = useState("");

  // Fetch orders
  const { data: ordersData, isLoading, refetch } = useQuery({
    queryKey: ["/api/admin/orders"],
    enabled: true,
  });

  const orders: Order[] = ordersData?.orders || [];

  // Update order mutation
  const updateOrderMutation = useMutation({
    mutationFn: async (data: { orderId: string; updates: any }) => {
      const response = await fetch(`/api/admin/orders/${data.orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data.updates),
      });
      if (!response.ok) throw new Error("Failed to update order");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      toast({
        title: "Encomenda atualizada",
        description: "As alterações foram guardadas com sucesso.",
      });
      setIsEditDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar a encomenda.",
        variant: "destructive",
      });
    },
  });

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async (data: { orderId: string; estado: string; estadoPagamento?: string }) => {
      const response = await fetch(`/api/admin/orders/${data.orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update order status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      toast({
        title: "Estado atualizado",
        description: "O estado da encomenda foi atualizado.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar o estado da encomenda.",
        variant: "destructive",
      });
    },
  });

  const openEditDialog = (order: Order) => {
    setSelectedOrder(order);
    setEditEstado(order.estado);
    setEditEstadoPagamento(order.estadoPagamento);
    setEditCodigoRastreio(order.codigoRastreio || "");
    setEditNotasInternas(order.notasInternas || "");
    setIsEditDialogOpen(true);
  };

  const handleSaveChanges = () => {
    if (!selectedOrder) return;

    const updates: any = {
      estado: editEstado,
      estadoPagamento: editEstadoPagamento,
      codigoRastreio: editCodigoRastreio || null,
      notasInternas: editNotasInternas || null,
    };

    updateOrderMutation.mutate({
      orderId: selectedOrder.id,
      updates,
    });
  };

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filterEstado === "all" || order.estado === filterEstado;
    const matchesSearch = 
      order.numeroEncomenda.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.clienteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.clienteEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const formatCurrency = (value: string) => {
    return `€${parseFloat(value).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-8 w-8 animate-spin text-[#FFD700]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <ShoppingCart className="h-8 w-8 text-[#FFD700]" />
            <h1 className="text-3xl font-bold text-white">Gestão de Encomendas</h1>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-[#111111] border-[#333]">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-[#FFD700]" />
                  <div>
                    <p className="text-sm text-gray-400">Total Encomendas</p>
                    <p className="text-xl font-bold">{orders.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#111111] border-[#333]">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">Pagas</p>
                    <p className="text-xl font-bold">{orders.filter(o => o.estadoPagamento === "pago").length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#111111] border-[#333]">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-400">Enviadas</p>
                    <p className="text-xl font-bold">{orders.filter(o => o.estado === "enviada").length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#111111] border-[#333]">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Euro className="h-5 w-5 text-[#20B2AA]" />
                  <div>
                    <p className="text-sm text-gray-400">Volume Total</p>
                    <p className="text-xl font-bold">
                      {formatCurrency(
                        orders
                          .filter(o => o.estadoPagamento === "pago")
                          .reduce((sum, o) => sum + parseFloat(o.total), 0)
                          .toString()
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-[#111111] border-[#333] mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Pesquisar por número, nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-[#0a0a0a] border-[#333] text-white"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Select value={filterEstado} onValueChange={setFilterEstado}>
                  <SelectTrigger className="w-40 bg-[#0a0a0a] border-[#333] text-white">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111111] border-[#333]">
                    <SelectItem value="all" className="text-white">Todos os Estados</SelectItem>
                    <SelectItem value="pendente" className="text-white">Pendente</SelectItem>
                    <SelectItem value="paga" className="text-white">Paga</SelectItem>
                    <SelectItem value="processando" className="text-white">Processando</SelectItem>
                    <SelectItem value="enviada" className="text-white">Enviada</SelectItem>
                    <SelectItem value="entregue" className="text-white">Entregue</SelectItem>
                    <SelectItem value="cancelada" className="text-white">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  onClick={() => refetch()} 
                  variant="outline" 
                  className="border-[#333] hover:bg-[#333]"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="bg-[#111111] border-[#333]">
          <CardHeader>
            <CardTitle className="text-[#FFD700]">
              Encomendas ({filteredOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#333] hover:bg-[#0a0a0a]">
                    <TableHead className="text-gray-300">Nº Encomenda</TableHead>
                    <TableHead className="text-gray-300">Cliente</TableHead>
                    <TableHead className="text-gray-300">Total</TableHead>
                    <TableHead className="text-gray-300">Estado</TableHead>
                    <TableHead className="text-gray-300">Pagamento</TableHead>
                    <TableHead className="text-gray-300">Método</TableHead>
                    <TableHead className="text-gray-300">Data</TableHead>
                    <TableHead className="text-gray-300">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} className="border-[#333] hover:bg-[#0a0a0a]">
                      <TableCell>
                        <div className="font-mono text-sm">
                          {order.numeroEncomenda}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div>
                          <div className="font-medium text-white">{order.clienteNome}</div>
                          <div className="text-sm text-gray-400">{order.clienteEmail}</div>
                        </div>
                      </TableCell>
                      
                      <TableCell className="font-semibold text-[#FFD700]">
                        {formatCurrency(order.total)}
                      </TableCell>
                      
                      <TableCell>
                        <Badge className={estadoColors[order.estado]}>
                          {order.estado}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <Badge className={estadoPagamentoColors[order.estadoPagamento]}>
                          {order.estadoPagamento}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <span className="text-sm text-gray-300 capitalize">
                          {order.metodoPagamento}
                        </span>
                      </TableCell>
                      
                      <TableCell className="text-sm text-gray-400">
                        {formatDate(order.createdAt)}
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-[#333]"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl bg-[#111111] border-[#333] text-white">
                              <DialogHeader>
                                <DialogTitle className="text-[#FFD700]">
                                  Detalhes da Encomenda {order.numeroEncomenda}
                                </DialogTitle>
                              </DialogHeader>
                              
                              {selectedOrder && (
                                <div className="space-y-4 max-h-96 overflow-y-auto">
                                  {/* Cliente */}
                                  <div className="bg-[#0a0a0a] p-4 rounded border border-[#333]">
                                    <h3 className="font-semibold mb-2 text-[#20B2AA]">Dados do Cliente</h3>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                      <div><strong>Nome:</strong> {selectedOrder.clienteNome}</div>
                                      <div><strong>Email:</strong> {selectedOrder.clienteEmail}</div>
                                      <div><strong>Telefone:</strong> {selectedOrder.clienteTelefone}</div>
                                      <div><strong>NIF:</strong> {selectedOrder.clienteNIF || "N/A"}</div>
                                      <div className="col-span-2"><strong>Morada:</strong> {selectedOrder.clienteMorada}</div>
                                      <div><strong>Código Postal:</strong> {selectedOrder.clienteCodigoPostal}</div>
                                      <div><strong>Cidade:</strong> {selectedOrder.clienteCidade}</div>
                                    </div>
                                  </div>
                                  
                                  {/* Itens */}
                                  <div className="bg-[#0a0a0a] p-4 rounded border border-[#333]">
                                    <h3 className="font-semibold mb-2 text-[#20B2AA]">Itens da Encomenda</h3>
                                    <div className="space-y-2">
                                      {selectedOrder.itens.map((item: any, index: number) => (
                                        <div key={index} className="flex justify-between items-center border-b border-[#333] pb-2">
                                          <div>
                                            <div className="font-medium">{item.textureName || item.canvasName}</div>
                                            <div className="text-sm text-gray-400">
                                              {item.larguraCm}×{item.alturaCm}cm • 
                                              Qty: {item.quantidade || 1}
                                            </div>
                                          </div>
                                          <div className="text-[#FFD700]">
                                            {formatCurrency((item.precoTotal * (item.quantidade || 1)).toString())}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  {/* Totais */}
                                  <div className="bg-[#0a0a0a] p-4 rounded border border-[#333]">
                                    <h3 className="font-semibold mb-2 text-[#20B2AA]">Resumo</h3>
                                    <div className="space-y-1 text-sm">
                                      <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span>{formatCurrency(selectedOrder.subtotal)}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Envio:</span>
                                        <span>{formatCurrency(selectedOrder.envio)}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>IVA (23%):</span>
                                        <span>{formatCurrency(selectedOrder.iva)}</span>
                                      </div>
                                      <div className="flex justify-between font-bold text-[#FFD700] border-t border-[#333] pt-1">
                                        <span>Total:</span>
                                        <span>{formatCurrency(selectedOrder.total)}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Tracking */}
                                  {selectedOrder.codigoRastreio && (
                                    <div className="bg-[#0a0a0a] p-4 rounded border border-[#333]">
                                      <h3 className="font-semibold mb-2 text-[#20B2AA]">Rastreamento</h3>
                                      <p><strong>Código:</strong> {selectedOrder.codigoRastreio}</p>
                                    </div>
                                  )}
                                  
                                  {/* Notas */}
                                  {selectedOrder.notasInternas && (
                                    <div className="bg-[#0a0a0a] p-4 rounded border border-[#333]">
                                      <h3 className="font-semibold mb-2 text-[#20B2AA]">Notas Internas</h3>
                                      <p className="text-sm">{selectedOrder.notasInternas}</p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-[#333]"
                            onClick={() => openEditDialog(order)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredOrders.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma encomenda encontrada</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-[#111111] border-[#333] text-white">
            <DialogHeader>
              <DialogTitle className="text-[#FFD700]">
                Editar Encomenda {selectedOrder?.numeroEncomenda}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Atualize o estado e adicione informações de rastreamento.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Estado da Encomenda</Label>
                <Select value={editEstado} onValueChange={setEditEstado}>
                  <SelectTrigger className="bg-[#0a0a0a] border-[#333] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111111] border-[#333]">
                    <SelectItem value="pendente" className="text-white">Pendente</SelectItem>
                    <SelectItem value="paga" className="text-white">Paga</SelectItem>
                    <SelectItem value="processando" className="text-white">Processando</SelectItem>
                    <SelectItem value="enviada" className="text-white">Enviada</SelectItem>
                    <SelectItem value="entregue" className="text-white">Entregue</SelectItem>
                    <SelectItem value="cancelada" className="text-white">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-gray-300">Estado do Pagamento</Label>
                <Select value={editEstadoPagamento} onValueChange={setEditEstadoPagamento}>
                  <SelectTrigger className="bg-[#0a0a0a] border-[#333] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111111] border-[#333]">
                    <SelectItem value="pendente" className="text-white">Pendente</SelectItem>
                    <SelectItem value="pago" className="text-white">Pago</SelectItem>
                    <SelectItem value="falhado" className="text-white">Falhado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-gray-300">Código de Rastreamento</Label>
                <Input
                  value={editCodigoRastreio}
                  onChange={(e) => setEditCodigoRastreio(e.target.value)}
                  placeholder="Insira o código de rastreamento..."
                  className="bg-[#0a0a0a] border-[#333] text-white"
                />
              </div>
              
              <div>
                <Label className="text-gray-300">Notas Internas</Label>
                <Textarea
                  value={editNotasInternas}
                  onChange={(e) => setEditNotasInternas(e.target.value)}
                  placeholder="Adicione notas internas..."
                  className="bg-[#0a0a0a] border-[#333] text-white"
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
                className="border-[#333] hover:bg-[#333]"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSaveChanges}
                disabled={updateOrderMutation.isPending}
                className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90"
              >
                {updateOrderMutation.isPending ? "A guardar..." : "Guardar Alterações"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}