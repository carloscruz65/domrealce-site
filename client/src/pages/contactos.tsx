import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import GoogleMap from "@/components/GoogleMap";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { insertContactSchema, type InsertContact } from "@shared/schema";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  FileText,
  X,
  PhoneCall,
  MessageCircle,
  MapPin,
  Clock3,
  Mail,
} from "lucide-react";

export default function Contactos() {
  const { toast } = useToast();

  // Fetch Google Maps API key
  const { data: mapsConfig } = useQuery<{ apiKey: string }>({
    queryKey: ["/api/config/google-maps-key"],
  });

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    assunto: "",
    mensagem: "",
    anexos: [] as any[],
  });

  const submitMutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      // ATENÇÃO: manter a assinatura correta do apiRequest que estiveres a usar no projeto
      return await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: (data: any) => {
      toast({
        title: "Sucesso!",
        description: data.message || "Mensagem enviada com sucesso!",
        variant: "default",
      });
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        assunto: "",
        mensagem: "",
        anexos: [],
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description:
          error.message || "Erro ao enviar mensagem. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const ficheiros =
        formData.anexos?.map(
          (file) =>
            `${file.name} (${(file.size / 1024).toFixed(1)} KB) - ${
              file.file?.type || "unknown"
            }`,
        ) || [];

      const payload: InsertContact = {
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        telefone: formData.telefone?.trim() || undefined,
        empresa: undefined,
        mensagem: formData.mensagem.trim(),
        ficheiros,
      };

      const validatedData = insertContactSchema.parse(payload);
      submitMutation.mutate(validatedData);
    } catch (error) {
      let errorMessage = "Por favor, verifique os dados inseridos.";

      if (error instanceof z.ZodError) {
        const issues = error.issues;
        if (
          issues.some(
            (issue) =>
              issue.path[0] === "nome" &&
              issue.message.toLowerCase().includes("2 caracteres"),
          )
        ) {
          errorMessage = "Nome deve ter pelo menos 2 caracteres.";
        } else if (
          issues.some(
            (issue) =>
              issue.path[0] === "mensagem" &&
              issue.message.toLowerCase().includes("10 caracteres"),
          )
        ) {
          errorMessage = "Mensagem deve ter pelo menos 10 caracteres.";
        } else if (issues.some((issue) => issue.path[0] === "email")) {
          errorMessage = "Por favor insira um email válido.";
        }
      }

      toast({
        title: "Erro de validação",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navigation />

      {/* HERO mais leve, estilo portfólio */}
      <section className="mt-16 bg-gradient-to-br from-black via-[#050505] to-brand-yellow/10 border-b border-white/5">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs uppercase tracking-[0.2em] text-brand-yellow mb-4">
                <MessageCircle className="w-3 h-3" />
                <span>Fale connosco</span>
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                Vamos falar{" "}
                <span className="text-brand-yellow">sobre o seu projeto</span>
              </h1>

              <p className="text-base md:text-lg text-gray-300 mb-6 leading-relaxed">
                Use o formulário, envie um email ou fale diretamente por
                telefone ou WhatsApp. Respondemos com a maior brevidade
                possível.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="bg-brand-yellow text-black font-semibold hover:bg-brand-yellow/90">
                  <a href="#formulario">Formulário de contacto</a>
                </Button>
                <Button
                  variant="outline"
                  className="border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-black flex items-center gap-2"
                  asChild
                >
                  <a
                    href="https://wa.me/351930682725?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20os%20vossos%20serviços."
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp direto
                  </a>
                </Button>
              </div>
            </div>

            {/* Cartão com info rápida */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-black/60 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin className="w-5 h-5 text-brand-yellow" />
                  <h2 className="font-semibold text-lg">Onde estamos</h2>
                </div>
                <p className="text-gray-200 text-sm mb-2">
                  Rua de Rebolido, 42
                  <br />
                  4580-402 Gondalães, Paredes · Portugal
                </p>
                <p className="text-xs text-gray-400">
                  Atendemos sobretudo a zona do Grande Porto, com foco em
                  decoração de viaturas, espaços comerciais, papel de parede e
                  projetos personalizados.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-black/70 p-4 flex items-start gap-3">
                  <PhoneCall className="w-5 h-5 text-brand-turquoise mt-1" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-gray-400 mb-1">
                      Telefone / WhatsApp
                    </p>
                    <p className="font-semibold text-white text-sm">
                      +351 930 682 725
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/70 p-4 flex items-start gap-3">
                  <Mail className="w-5 h-5 text-brand-coral mt-1" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-gray-400 mb-1">
                      Email
                    </p>
                    <p className="font-semibold text-white text-sm break-all">
                      carloscruz@domrealce.com
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/70 p-4 flex items-start gap-3">
                <Clock3 className="w-5 h-5 text-brand-yellow mt-1" />
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-400 mb-1">
                    Horário
                  </p>
                  <p className="text-sm text-gray-200">
                    Segunda a Sexta · 9h00 – 18h00
                    <br />
                    Atendimento por marcação para projetos mais detalhados.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Secção Contacto + Formulário */}
      <section className="py-12 bg-[#050505]">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Informação (coluna esquerda) */}
            <div className="lg:col-span-1">
              <div className="bg-black/70 rounded-2xl p-6 border border-white/10 h-full">
                <h3 className="text-xl font-bold text-brand-yellow mb-4">
                  Detalhes de contacto
                </h3>

                <div className="space-y-4 text-sm text-gray-200">
                  <div>
                    <p className="font-semibold mb-1">DomRealce</p>
                    <p className="text-gray-300">
                      Rua de Rebolido, 42
                      <br />
                      4580-402 Gondalães, Paredes
                      <br />
                      Portugal
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/10 mt-2">
                    <div className="flex gap-2">
                      <span className="text-brand-yellow">📞</span>
                      <p className="text-gray-200">+351 930 682 725</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-brand-turquoise">✉️</span>
                      <p className="text-gray-200 break-all">
                        carloscruz@domrealce.com
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        "Rua de Rebolido 42, 4580-402 Gondalães, Paredes",
                      );
                      toast({
                        title: "Morada copiada!",
                        description:
                          "A morada foi copiada para a área de transferência.",
                      });
                    }}
                    className="mt-4 w-full px-4 py-2 bg-brand-turquoise/20 text-brand-turquoise rounded-lg hover:bg-brand-turquoise/30 transition-all duration-300 text-xs font-medium"
                  >
                    📋 Copiar morada
                  </button>
                </div>
              </div>
            </div>

            {/* Formulário (coluna direita) */}
            <div className="lg:col-span-2" id="formulario">
              <div className="bg-black/70 rounded-2xl p-6 md:p-8 border border-white/10">
                <h3 className="text-2xl font-bold text-brand-yellow mb-2">
                  Enviar mensagem
                </h3>
                <p className="text-sm text-gray-400 mb-6">
                  Conte-nos, com o máximo de detalhe possível, o que pretende.
                  Quanto mais contexto, melhor conseguimos ajudar.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white/80 mb-2 font-medium">
                        Nome *
                      </label>
                      <input
                        type="text"
                        value={formData.nome}
                        onChange={(e) =>
                          setFormData({ ...formData, nome: e.target.value })
                        }
                        className="w-full p-3 bg-gray-900/60 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow transition-all duration-300"
                        placeholder="O seu nome"
                        required
                      />
                      <p className="text-xs text-white/40 mt-1">
                        Mínimo 2 caracteres
                      </p>
                    </div>

                    <div>
                      <label className="block text-white/80 mb-2 font-medium">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full p-3 bg-gray-900/60 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow transition-all duration-300"
                        placeholder="o.seu.email@exemplo.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white/80 mb-2 font-medium">
                        Telefone
                      </label>
                      <input
                        type="tel"
                        value={formData.telefone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            telefone: e.target.value,
                          })
                        }
                        className="w-full p-3 bg-gray-900/60 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow transition-all duration-300"
                        placeholder="+351 900 000 000 (opcional)"
                      />
                    </div>

                    <div>
                      <label className="block text-white/80 mb-2 font-medium">
                        Assunto *
                      </label>
                      <input
                        type="text"
                        value={formData.assunto}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            assunto: e.target.value,
                          })
                        }
                        className="w-full p-3 bg-gray-900/60 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow transition-all duration-300"
                        placeholder="Qual é o assunto da sua mensagem?"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/80 mb-2 font-medium">
                      Mensagem *
                    </label>
                    <textarea
                      value={formData.mensagem}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mensagem: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full p-3 bg-gray-900/60 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow transition-all duration-300 resize-none"
                      placeholder="Descreva o seu projeto, medidas, prazos, tipo de material, etc."
                      required
                    />
                    <p className="text-xs text-white/40 mt-1">
                      Mínimo 10 caracteres
                    </p>
                  </div>

                  {/* Anexos */}
                  <div>
                    <label className="block text-white/80 mb-2 font-medium">
                      Anexos (opcional)
                    </label>
                    <input
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,.tiff,.tif,.svg,.ai,.pdf"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const fileData = files.map((file) => ({
                          name: file.name,
                          originalName: file.name,
                          size: file.size,
                          uploadURL: URL.createObjectURL(file),
                          file,
                        }));
                        setFormData((prev) => ({
                          ...prev,
                          anexos: [...prev.anexos, ...fileData].slice(0, 3),
                        }));
                      }}
                      className="w-full p-3 bg-gray-900/60 border border-white/10 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-black file:bg-brand-yellow hover:file:bg-brand-yellow/90 file:cursor-pointer"
                    />

                    <div className="mt-2 text-xs text-white/60 space-y-1">
                      <p>• Máximo 3 ficheiros, até 10MB cada</p>
                      <p>
                        • Formatos aceites: JPG, JPEG, PNG, TIFF, SVG, AI, PDF
                      </p>
                      <p>
                        • <strong>Importante:</strong> fontes devem ser
                        convertidas em linhas antes do envio
                      </p>
                      <p>
                        • Os ficheiros serão mencionados no email. Para envio
                        dos ficheiros reais, utilize email ou WhatsApp.
                      </p>
                    </div>

                    {formData.anexos && formData.anexos.length > 0 && (
                      <div className="mt-3">
                        <p className="text-white/60 mb-2 text-sm">
                          Ficheiros anexados:
                        </p>
                        <div className="space-y-2">
                          {formData.anexos.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-gray-900/60 p-2 rounded border border-white/10"
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-brand-turquoise" />
                                <span className="text-white/80 text-sm">
                                  {file.originalName}
                                </span>
                                <span className="text-white/40 text-xs">
                                  ({(file.size / 1024).toFixed(1)} KB)
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    anexos:
                                      formData.anexos?.filter(
                                        (_, i) => i !== index,
                                      ) || [],
                                  });
                                }}
                                className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitMutation.isPending}
                      className="w-full bg-brand-yellow text-black font-semibold py-3 px-6 rounded-lg hover:bg-brand-yellow/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-black/30 border-t-black"></div>
                          A enviar...
                        </>
                      ) : (
                        "Enviar mensagem"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAPA mais leve, lá em baixo */}
      <section className="pb-16 bg-[#050505]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Como chegar até nós
            </h2>
            <p className="text-sm md:text-base text-gray-300 mb-4">
              Pode usar Google Maps ou Waze para traçar o caminho até ao nosso
              atelier.
            </p>

            <div className="mb-4 flex flex-wrap gap-3">
              <Button
                className="bg-brand-yellow text-black hover:bg-brand-yellow/90 text-sm"
                onClick={() => {
                  window.open(
                    "https://www.google.com/maps/search/?api=1&query=Rua+de+Rebolido+42%2C+4580-402+Gondalães%2C+Paredes",
                    "_blank",
                  );
                }}
              >
                🗺️ Ver no Google Maps
              </Button>
              <Button
                variant="outline"
                className="border-brand-turquoise text-brand-turquoise hover:bg-brand-turquoise hover:text-black text-sm"
                onClick={() => {
                  window.open(
                    "https://waze.com/ul?q=Rua+de+Rebolido+42+Gondalães+Paredes",
                    "_blank",
                  );
                }}
              >
                🚗 Abrir no Waze
              </Button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/60">
              {mapsConfig?.apiKey ? (
                <GoogleMap
                  apiKey={mapsConfig.apiKey}
                  center={{
                    lat: 41.2294,
                    lng: -8.3237,
                  }}
                  zoom={17}
                  className="w-full h-[420px]"
                  address="Rua de Rebolido, 42, 4580-402 Gondalães, Paredes, Portugal"
                  companyName="DOMREALCE"
                />
              ) : (
                <div className="w-full h-[320px] bg-gray-900 flex items-center justify-center">
                  <div className="text-center text-brand-yellow">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-yellow mx-auto mb-4"></div>
                    <p>A carregar mapa...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
