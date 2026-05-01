import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Trash2, Star, Search, Filter, MessageSquare, Clock, ThumbsUp } from "lucide-react";
import type { Testimonial } from "@shared/schema";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pendente:  { label: "Pendente",  color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" },
  aprovado:  { label: "Aprovado",  color: "bg-green-500/20 text-green-300 border-green-500/30" },
  rejeitado: { label: "Rejeitado", color: "bg-red-500/20 text-red-300 border-red-500/30" },
};

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < rating ? "text-brand-yellow fill-brand-yellow" : "text-gray-600"}`}
        />
      ))}
    </div>
  );
}

export default function TestimonialsManager() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pendente" | "aprovado" | "rejeitado">("all");

  const { data, isLoading } = useQuery<{ testimonials: Testimonial[] }>({
    queryKey: ["/api/admin/testimonials"],
  });

  const all = data?.testimonials || [];

  const filtered = all.filter((t) => {
    const matchSearch =
      !search ||
      t.nome.toLowerCase().includes(search.toLowerCase()) ||
      (t.empresa || "").toLowerCase().includes(search.toLowerCase()) ||
      t.mensagem.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => apiRequest("PUT", `/api/admin/testimonials/${id}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      toast({ title: "Testemunho aprovado!" });
    },
    onError: () => toast({ title: "Erro ao aprovar", variant: "destructive" }),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => apiRequest("PUT", `/api/admin/testimonials/${id}/reject`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      toast({ title: "Testemunho rejeitado." });
    },
    onError: () => toast({ title: "Erro ao rejeitar", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/testimonials/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      toast({ title: "Testemunho eliminado." });
    },
    onError: () => toast({ title: "Erro ao eliminar", variant: "destructive" }),
  });

  const counts = {
    total: all.length,
    pendente: all.filter((t) => t.status === "pendente").length,
    aprovado: all.filter((t) => t.status === "aprovado").length,
  };

  if (isLoading) return <div className="p-4 text-white">A carregar...</div>;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4 flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-brand-yellow" />
            <div>
              <p className="text-2xl font-bold text-white">{counts.total}</p>
              <p className="text-xs text-gray-400">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="h-8 w-8 text-yellow-400" />
            <div>
              <p className="text-2xl font-bold text-white">{counts.pendente}</p>
              <p className="text-xs text-gray-400">Pendentes</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4 flex items-center gap-3">
            <ThumbsUp className="h-8 w-8 text-green-400" />
            <div>
              <p className="text-2xl font-bold text-white">{counts.aprovado}</p>
              <p className="text-xs text-gray-400">Aprovados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Pesquisar por nome, empresa ou mensagem..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white"
          />
        </div>
        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)}>
          <SelectTrigger className="w-44 bg-gray-800 border-gray-700 text-white">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pendente">Pendentes</SelectItem>
            <SelectItem value="aprovado">Aprovados</SelectItem>
            <SelectItem value="rejeitado">Rejeitados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="py-12 text-center text-gray-400">
              {search || filterStatus !== "all"
                ? "Nenhum testemunho encontrado com esses filtros."
                : "Ainda não há testemunhos submetidos."}
            </CardContent>
          </Card>
        ) : (
          filtered.map((t) => {
            const st = STATUS_LABELS[t.status] || STATUS_LABELS.pendente;
            return (
              <Card key={t.id} className="bg-gray-900 border-gray-700">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Info principal */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-semibold text-white">{t.nome}</span>
                        {t.empresa && (
                          <span className="text-sm text-gray-400">— {t.empresa}</span>
                        )}
                        <Badge className={`text-xs border ${st.color}`}>{st.label}</Badge>
                      </div>

                      <StarDisplay rating={t.rating} />

                      <p className="text-gray-300 mt-2 leading-relaxed">"{t.mensagem}"</p>

                      <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
                        <span>Notícia: <code className="text-gray-400">{t.noticiaId.slice(0, 8)}…</code></span>
                        <span>
                          {t.createdAt
                            ? new Date(t.createdAt).toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" })
                            : "—"}
                        </span>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex gap-2 flex-shrink-0 flex-wrap sm:flex-nowrap">
                      {t.status !== "aprovado" && (
                        <Button
                          size="sm"
                          onClick={() => approveMutation.mutate(t.id)}
                          disabled={approveMutation.isPending}
                          className="bg-green-700 hover:bg-green-600 text-white"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Aprovar
                        </Button>
                      )}
                      {t.status !== "rejeitado" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => rejectMutation.mutate(t.id)}
                          disabled={rejectMutation.isPending}
                          className="border-yellow-600 text-yellow-400 hover:bg-yellow-900/30"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Rejeitar
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (confirm("Eliminar este testemunho definitivamente?")) {
                            deleteMutation.mutate(t.id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                        className="border-red-800 text-red-400 hover:bg-red-900/30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
