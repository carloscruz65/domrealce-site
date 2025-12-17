import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Package, Eye, Trash2, Search, Download, Filter, X, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Encomenda {
  id: string;
  numeroEncomenda: string;
  clienteNome: string;
  clienteEmail: string;
  clienteTelefone: string;
  clienteMorada?: string;
  clienteCidade?: string;
  clienteCodigoPostal?: string;
  clienteNIF?: string;
  estado: string;
  estadoPagamento: string;
  metodoPagamento?: string;
  total: string;
  subtotal?: string;
  envio?: string;
  iva?: string;
  itens: any[];
  createdAt: string;
  dadosPagamento?: {
    paypalOrderId?: string;
    paypalPayerId?: string;
    paypalPayerEmail?: string;
    captureId?: string;
  };
  referenciaIfthenpay?: string;
}

const STATUS_OPTIONS = [
  { value: "pendente", label: "Pendente", color: "bg-yellow-500" },
  { value: "paga", label: "Paga", color: "bg-emerald-500" },
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
  const [searchQuery, setSearchQuery] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("todos");
  const [filterPagamento, setFilterPagamento] = useState<string>("todos");
  const [filterDataInicio, setFilterDataInicio] = useState("");
  const [filterDataFim, setFilterDataFim] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, refetch } = useQuery<{ orders: Encomenda[] }>({
    queryKey: ['/api/admin/orders'],
  });
  
  const orders = data?.orders || [];

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          order.numeroEncomenda?.toLowerCase().includes(query) ||
          order.clienteNome?.toLowerCase().includes(query) ||
          order.clienteEmail?.toLowerCase().includes(query) ||
          order.clienteTelefone?.includes(query);
        if (!matchesSearch) return false;
      }

      if (filterEstado !== "todos" && order.estado !== filterEstado) {
        return false;
      }

      if (filterPagamento !== "todos" && order.estadoPagamento !== filterPagamento) {
        return false;
      }

      if (filterDataInicio) {
        const orderDate = new Date(order.createdAt);
        const startDate = new Date(filterDataInicio);
        if (orderDate < startDate) return false;
      }

      if (filterDataFim) {
        const orderDate = new Date(order.createdAt);
        const endDate = new Date(filterDataFim);
        endDate.setHours(23, 59, 59, 999);
        if (orderDate > endDate) return false;
      }

      return true;
    });
  }, [orders, searchQuery, filterEstado, filterPagamento, filterDataInicio, filterDataFim]);

  const stats = useMemo(() => {
    const total = filteredOrders.length;
    const pendentes = filteredOrders.filter(o => o.estado === "pendente").length;
    const pagas = filteredOrders.filter(o => o.estadoPagamento === "pago").length;
    const valorTotal = filteredOrders.reduce((sum, o) => {
      const val = parseFloat(o.total?.replace("€", "").replace(",", ".").trim() || "0");
      return sum + (isNaN(val) ? 0 : val);
    }, 0);
    return { total, pendentes, pagas, valorTotal };
  }, [filteredOrders]);

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, estado }: { id: string; estado: string }) => 
      apiRequest('PUT', `/api/admin/orders/${id}/status`, { estado }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/orders'] });
      toast({ title: "Estado atualizado!" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/admin/orders/${id}`),
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

  const clearFilters = () => {
    setSearchQuery("");
    setFilterEstado("todos");
    setFilterPagamento("todos");
    setFilterDataInicio("");
    setFilterDataFim("");
  };

  const hasActiveFilters = searchQuery || filterEstado !== "todos" || filterPagamento !== "todos" || filterDataInicio || filterDataFim;

  const exportToCSV = () => {
    if (filteredOrders.length === 0) {
      toast({ title: "Sem dados", description: "Não há encomendas para exportar.", variant: "destructive" });
      return;
    }

    const headers = [
      "Número Encomenda",
      "Data",
      "Cliente",
      "Email",
      "Telefone",
      "Morada",
      "Cidade",
      "Código Postal",
      "NIF",
      "Estado",
      "Estado Pagamento",
      "Método Pagamento",
      "Subtotal",
      "Envio",
      "IVA",
      "Total",
      "Referência Pagamento"
    ];

    const rows = filteredOrders.map(order => [
      order.numeroEncomenda,
      new Date(order.createdAt).toLocaleDateString('pt-PT'),
      order.clienteNome,
      order.clienteEmail,
      order.clienteTelefone,
      order.clienteMorada || "",
      order.clienteCidade || "",
      order.clienteCodigoPostal || "",
      order.clienteNIF || "",
      order.estado,
      order.estadoPagamento,
      order.metodoPagamento || "",
      order.subtotal || "",
      order.envio || "",
      order.iva || "",
      order.total,
      order.referenciaIfthenpay || order.dadosPagamento?.paypalOrderId || ""
    ]);

    const csvContent = [
      headers.join(";"),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(";"))
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `encomendas_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({ title: "Exportado!", description: `${filteredOrders.length} encomendas exportadas para CSV.` });
  };

  if (isLoading) return <div className="p-4">A carregar...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Encomendas</h2>
          <p className="text-muted-foreground">Administrar encomendas e estados</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} data-testid="button-refresh">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline" size="sm" onClick={exportToCSV} data-testid="button-export">
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total de encomendas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-yellow-500">{stats.pendentes}</div>
            <p className="text-xs text-muted-foreground">Pendentes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-500">{stats.pagas}</div>
            <p className="text-xs text-muted-foreground">Pagas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">€{stats.valorTotal.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Valor total</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="search" className="text-xs">Pesquisar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Número, nome, email ou telefone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
            </div>

            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              data-testid="button-toggle-filters"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
              {hasActiveFilters && <Badge className="ml-2 bg-primary">Ativo</Badge>}
            </Button>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} data-testid="button-clear-filters">
                <X className="h-4 w-4 mr-2" />
                Limpar
              </Button>
            )}
          </div>

          {showFilters && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
              <div>
                <Label htmlFor="filter-estado" className="text-xs">Estado da Encomenda</Label>
                <Select value={filterEstado} onValueChange={setFilterEstado}>
                  <SelectTrigger id="filter-estado" data-testid="select-filter-estado">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {STATUS_OPTIONS.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="filter-pagamento" className="text-xs">Estado do Pagamento</Label>
                <Select value={filterPagamento} onValueChange={setFilterPagamento}>
                  <SelectTrigger id="filter-pagamento" data-testid="select-filter-pagamento">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {PAYMENT_STATUS.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="filter-data-inicio" className="text-xs">Data Início</Label>
                <Input
                  id="filter-data-inicio"
                  type="date"
                  value={filterDataInicio}
                  onChange={(e) => setFilterDataInicio(e.target.value)}
                  data-testid="input-filter-data-inicio"
                />
              </div>

              <div>
                <Label htmlFor="filter-data-fim" className="text-xs">Data Fim</Label>
                <Input
                  id="filter-data-fim"
                  type="date"
                  value={filterDataFim}
                  onChange={(e) => setFilterDataFim(e.target.value)}
                  data-testid="input-filter-data-fim"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        A mostrar {filteredOrders.length} de {orders.length} encomendas
      </div>

      <div className="grid gap-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {hasActiveFilters ? "Nenhuma encomenda encontrada com os filtros aplicados." : "Ainda não há encomendas."}
              </p>
              {hasActiveFilters && (
                <Button variant="link" onClick={clearFilters} className="mt-2">
                  Limpar filtros
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order: Encomenda) => (
            <Card key={order.id} data-testid={`card-order-${order.id}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h3 className="font-semibold">#{order.numeroEncomenda}</h3>
                      {getStatusBadge(order.estado, 'order')}
                      {getStatusBadge(order.estadoPagamento, 'payment')}
                      {order.metodoPagamento && (
                        <Badge variant="outline" className="text-xs">
                          {order.metodoPagamento.toUpperCase()}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.clienteNome} • {order.clienteEmail}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm font-medium">{order.total}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleString('pt-PT')}
                      </span>
                    </div>
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
          ))
        )}
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Encomenda #{selectedOrder?.numeroEncomenda}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Informação do Cliente</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Nome:</strong> {selectedOrder.clienteNome}</p>
                    <p><strong>Email:</strong> {selectedOrder.clienteEmail}</p>
                    <p><strong>Telefone:</strong> {selectedOrder.clienteTelefone}</p>
                    {selectedOrder.clienteNIF && <p><strong>NIF:</strong> {selectedOrder.clienteNIF}</p>}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Morada de Envio</h4>
                  <div className="space-y-1 text-sm">
                    <p>{selectedOrder.clienteMorada || "-"}</p>
                    <p>{selectedOrder.clienteCodigoPostal} {selectedOrder.clienteCidade}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Pagamento</h4>
                <div className="flex items-center gap-2 flex-wrap text-sm">
                  <span><strong>Método:</strong> {selectedOrder.metodoPagamento?.toUpperCase() || "-"}</span>
                  {getStatusBadge(selectedOrder.estadoPagamento, 'payment')}
                  {selectedOrder.referenciaIfthenpay && (
                    <span className="text-xs text-muted-foreground">
                      Ref: {selectedOrder.referenciaIfthenpay}
                    </span>
                  )}
                </div>
                {selectedOrder.dadosPagamento?.paypalOrderId && (
                  <div className="mt-2 p-2 bg-muted rounded text-xs">
                    <p><strong>PayPal Order:</strong> {selectedOrder.dadosPagamento.paypalOrderId}</p>
                    {selectedOrder.dadosPagamento.paypalPayerEmail && (
                      <p><strong>PayPal Email:</strong> {selectedOrder.dadosPagamento.paypalPayerEmail}</p>
                    )}
                    {selectedOrder.dadosPagamento.captureId && (
                      <p><strong>Capture ID:</strong> {selectedOrder.dadosPagamento.captureId}</p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-semibold mb-2">Itens ({selectedOrder.itens?.length || 0})</h4>
                <div className="border rounded-lg overflow-hidden">
                  {selectedOrder.itens?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between p-3 border-b last:border-b-0 bg-muted/30">
                      <div>
                        <span className="font-medium">{item.textureName || item.canvasName || item.nome || item.titulo}</span>
                        {item.larguraCm && item.alturaCm && (
                          <span className="text-xs text-muted-foreground ml-2">
                            ({item.larguraCm}×{item.alturaCm}cm)
                          </span>
                        )}
                        {item.tamanho && (
                          <span className="text-xs text-muted-foreground ml-2">
                            ({item.tamanho})
                          </span>
                        )}
                      </div>
                      <span className="font-medium">€{item.precoTotal || item.preco}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                {selectedOrder.subtotal && (
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{selectedOrder.subtotal}</span>
                  </div>
                )}
                {selectedOrder.envio && (
                  <div className="flex justify-between text-sm">
                    <span>Envio:</span>
                    <span>{selectedOrder.envio}</span>
                  </div>
                )}
                {selectedOrder.iva && (
                  <div className="flex justify-between text-sm">
                    <span>IVA (23%):</span>
                    <span>{selectedOrder.iva}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="font-semibold">Total:</span>
                  <span className="text-xl font-bold">{selectedOrder.total}</span>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Criada em: {new Date(selectedOrder.createdAt).toLocaleString('pt-PT')}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
