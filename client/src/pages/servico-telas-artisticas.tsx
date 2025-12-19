import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import ServiceHeroTwoColumn from "@/components/ServiceHeroTwoColumn";
import ServiceGallery from "@/components/service-gallery";
import ServiceCardsSection from "@/components/services/ServiceCardsSection";
import type { ServiceAccordionCard } from "@/components/services/ServiceCardAccordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Image,
  CheckCircle,
  Star,
  ArrowRight,
  Frame,
  Brush,
  Camera,
  Palette,
  Award,
  Shield,
  FileText,
  X,
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ObjectUploader } from "@/components/ObjectUploader";
import { useToast } from "@/hooks/use-toast";
import { insertContactSchema } from "@shared/schema";
import { z } from "zod";

type TelasAnexoItem = {
  file: File;
  originalName: string;
  size: number;
  type?: string;
};

export default function ServicoTelasArtisticas() {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    largura: "",
    altura: "",
    quantidade: "1",
    opcaoImagem: "adobe-stock", // 'adobe-stock' ou 'propria'
    descricaoImagem: "",
    codigoAdobeStock: "",
    mensagem: "",
    nome: "",
    email: "",
    telefone: "",
    anexos: [] as TelasAnexoItem[],
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      // Validação extra: Adobe Stock precisa de código
      if (formData.opcaoImagem === "adobe-stock") {
        const hasCode = formData.codigoAdobeStock.trim() !== "";
        if (!hasCode) {
          throw new Error(
            "Para imagens do Adobe Stock, é obrigatório indicar o código ou número da imagem."
          );
        }
      }

      // Montar mensagem final (igual ao Contactos: tudo vai dentro de "mensagem")
      const imagemInfo =
        formData.opcaoImagem === "adobe-stock"
          ? [
              "Imagem: Adobe Stock",
              `- Código / nº da imagem: ${formData.codigoAdobeStock || "-"}`,
              formData.descricaoImagem
                ? `- Observações: ${formData.descricaoImagem}`
                : "",
            ]
              .filter(Boolean)
              .join("\n")
          : [
              "Imagem: Própria",
              formData.descricaoImagem
                ? `- Descrição: ${formData.descricaoImagem}`
                : "- Descrição: -",
            ].join("\n");

      const detalhesTelas = [
        "=== Pedido de Orçamento: Tela Artística ===",
        `Medidas: ${formData.largura} cm x ${formData.altura} cm`,
        `Quantidade: ${formData.quantidade} tela(s)`,
        "",
        imagemInfo,
        "",
        "Mensagem adicional:",
        formData.mensagem?.trim() || "(sem mensagem adicional)",
      ].join("\n");

      // Validar com o schema do contacto (como em Contactos)
      const payload = {
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        telefone: formData.telefone?.trim() || undefined,
        empresa: undefined,
        mensagem: detalhesTelas.trim(),
        ficheiros: [],
      };

      const validatedData = insertContactSchema.parse(payload);

      // FormData com texto + ficheiros reais
      const fd = new FormData();
      fd.append("nome", validatedData.nome);
      fd.append("email", validatedData.email);
      fd.append("telefone", validatedData.telefone ?? "");
      fd.append("empresa", validatedData.empresa ?? "");
      fd.append("mensagem", validatedData.mensagem);

      // backend espera "files"
      (formData.anexos || []).forEach((a) => {
        if (a?.file) fd.append("files", a.file);
      });

      const res = await fetch("/api/contact", {
        method: "POST",
        body: fd,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || "Erro ao enviar pedido.");
      }

      return data;
    },

    onSuccess: () => {
      toast({
        title: "Pedido enviado",
        description: "Recebemos o seu pedido. Respondemos com a maior brevidade.",
      });

      setFormData({
        largura: "",
        altura: "",
        quantidade: "1",
        opcaoImagem: "adobe-stock",
        descricaoImagem: "",
        codigoAdobeStock: "",
        mensagem: "",
        nome: "",
        email: "",
        telefone: "",
        anexos: [],
      });
    },

    onError: (error: any) => {
      // Zod errors mais “humanos”
      if (error instanceof z.ZodError) {
        const issues = error.issues;

        let errorMessage = "Por favor, verifique os dados inseridos.";
        if (
          issues.some(
            (issue) =>
              issue.path[0] === "nome" &&
              issue.message.toLowerCase().includes("2 caracteres")
          )
        ) {
          errorMessage = "Nome deve ter pelo menos 2 caracteres.";
        } else if (
          issues.some(
            (issue) =>
              issue.path[0] === "mensagem" &&
              issue.message.toLowerCase().includes("10 caracteres")
          )
        ) {
          errorMessage = "Mensagem deve ter pelo menos 10 caracteres.";
        } else if (issues.some((issue) => issue.path[0] === "email")) {
          errorMessage = "Por favor insira um email válido.";
        }

        toast({
          title: "Erro de validação",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Erro",
        description: error?.message || "Erro ao enviar. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate();
  };

  // ✅ Agora vamos usar estes “features” no accordion
  const features = [
    {
      icon: <Frame className="w-6 h-6" />,
      title: "Canvas premium",
      description:
        "Telas de algodão de alta gramagem para máxima durabilidade e qualidade.",
    },
    {
      icon: <Brush className="w-6 h-6" />,
      title: "Impressão artística",
      description:
        "Tecnologia de impressão que reproduz fielmente cores e texturas.",
    },
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Fotografias personalizadas",
      description:
        "Transforme as suas fotografias em obras de arte profissionais.",
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Arte digital",
      description: "Criação de arte digital exclusiva para a sua tela.",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Molduras incluídas",
      description: "Variedade de molduras elegantes incluídas no serviço.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Resistente ao tempo",
      description:
        "Tintas UV resistentes que mantêm as cores vibrantes por anos.",
    },
  ];

  const artisticCards: ServiceAccordionCard[] = features.map((f, idx) => ({
    key: `feature-${idx}`,
    icon: f.icon,
    title: f.title,
    intro: "Detalhe técnico e acabamento premium.",
    content: [f.description],
  }));

  const sizes = [
    "20x30 cm",
    "30x40 cm",
    "40x50 cm",
    "50x70 cm",
    "60x80 cm",
    "70x100 cm",
    "80x120 cm",
    "100x150 cm",
  ];

  const applications = [
    {
      title: "Decoração residencial",
      description:
        "Transforme a sua casa num espaço único com arte personalizada.",
      examples: ["Salas de estar", "Quartos", "Escritórios", "Corredores"],
    },
    {
      title: "Espaços comerciais",
      description: "Crie ambientes profissionais inspiradores e memoráveis.",
      examples: ["Hotéis", "Restaurantes", "Consultórios", "Escritórios"],
    },
    {
      title: "Presentes especiais",
      description: "Ofereça algo verdadeiramente único e pessoal.",
      examples: ["Casamentos", "Aniversários", "Formações", "Eventos"],
    },
  ];

  const process = [
    {
      step: "01",
      title: "Seleção da imagem",
      description:
        "Escolhe uma imagem da nossa loja, do Adobe Stock ou envia a tua própria fotografia.",
    },
    {
      step: "02",
      title: "Preparação digital",
      description:
        "Otimizamos a imagem para garantir a melhor qualidade de impressão.",
    },
    {
      step: "03",
      title: "Impressão em canvas",
      description: "Impressão de alta qualidade em tela de algodão premium.",
    },
    {
      step: "04",
      title: "Montagem e moldura",
      description: "Esticamos a tela e aplicamos a moldura escolhida.",
    },
    {
      step: "05",
      title: "Controlo de qualidade",
      description:
        "Inspeção final antes da entrega para garantir um resultado perfeito.",
    },
  ];

  const defaultImages = [
    {
      src: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80",
      alt: "Tela artística em sala moderna",
      title: "Arte contemporânea",
    },
    {
      src: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
      alt: "Canvas com fotografia em preto e branco",
      title: "Fotografia artística",
    },
    {
      src: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&q=80",
      alt: "Tela com paisagem natural",
      title: "Paisagens naturais",
    },
    {
      src: "https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=800&q=80",
      alt: "Canvas abstrato colorido",
      title: "Arte abstrata",
    },
    {
      src: "https://images.unsplash.com/photo-1578926314433-e2789279f4aa?w=800&q=80",
      alt: "Tela decorativa em quarto",
      title: "Decoração personalizada",
    },
    {
      src: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&q=80",
      alt: "Tela artística premium",
      title: "Qualidade premium",
    },
  ];

  const { data: galleryData } = useQuery<{ images: typeof defaultImages }>({
    queryKey: ["/api/service-galleries", "telas-artisticas"],
  });
  const galleryImages = galleryData?.images || defaultImages;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <ServiceHeroTwoColumn
        badge="Telas Artísticas Premium"
        badgeIcon={<Image className="w-4 h-4" />}
        title="Transforme fotografias em obras de arte"
        subtitle="Impressão artística"
        description="Impressão artística em canvas de alta qualidade. Transforme as suas memórias mais preciosas ou criações artísticas em telas duradouras e elegantes."
        imageSrc="/public-objects/servicos/telas-artisticas.webp"
        imageAlt="Telas Artísticas DOMREALCE"
        primaryCta={{ text: "Criar minha tela", href: "/contactos#formulario" }}
      />

      <main>
        {/* ✅ Qualidade artística (normalizada para cards + dropdown) */}
        <ServiceCardsSection
          titleTop="Qualidade"
          titleBottom="artística"
          subtitle="Tecnologia de impressão artística que garante resultados dignos de galeria."
          cards={artisticCards}
          defaultOpenKey={null}
        />

        {/* Galeria */}
        <ServiceGallery
          images={galleryImages}
          title="Exemplos de telas artísticas"
          description="Algumas inspirações de telas produzidas para decoração residencial e comercial."
          columns={3}
        />

        {/* Tamanhos disponíveis */}
        <section className="pt-8 pb-16 bg-black border-t border-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                <span className="text-white">Tamanhos</span>{" "}
                <span className="text-brand-yellow">disponíveis</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Desde formatos compactos até grandes obras de parede.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {sizes.map((size, index) => (
                <div
                  key={index}
                  className="bg-gray-900/60 border border-gray-800 rounded-lg p-6 text-center hover:border-brand-yellow transition-all duration-300"
                >
                  <div className="text-2xl font-bold text-brand-yellow mb-2">
                    {size}
                  </div>
                  <div className="text-sm text-gray-400">Formato padrão</div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-gray-400 mb-4">
                Precisa de um tamanho personalizado?
              </p>
              <Button
                asChild
                variant="outline"
                className="border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-black"
              >
                <Link href="/contactos#formulario">Solicitar medida especial</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Aplicações ideais */}
        <section className="pt-8 pb-16 bg-gray-900/40">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                <span className="text-white">Aplicações</span>{" "}
                <span className="text-brand-yellow">ideais</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Perfeitas para qualquer ambiente que necessite de um toque
                artístico especial.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {applications.map((application, index) => (
                <Card
                  key={index}
                  className="bg-black border border-gray-800 hover:border-brand-yellow transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3 text-brand-yellow">
                      {application.title}
                    </h3>
                    <p className="text-gray-400 mb-4">
                      {application.description}
                    </p>
                    <div>
                      <span className="text-sm text-gray-500 mb-2 block">
                        Exemplos:
                      </span>
                      <div className="space-y-1">
                        {application.examples.map((example, exampleIndex) => (
                          <div
                            key={exampleIndex}
                            className="flex items-center gap-2"
                          >
                            <div className="w-1.5 h-1.5 bg-brand-yellow rounded-full" />
                            <span className="text-sm text-gray-300">
                              {example}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Processo de criação */}
        <section className="py-16 bg-black border-t border-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                <span className="text-white">Processo de</span>{" "}
                <span className="text-brand-yellow">criação</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Cada tela é cuidadosamente produzida para garantir qualidade
                artística excecional.
              </p>
            </div>

            <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-2">
              {process.map((step) => (
                <div
                  key={step.step}
                  className="bg-gray-900/80 border border-gray-800 rounded-2xl px-6 py-5 flex items-start gap-4"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-brand-yellow rounded-full flex items-center justify-center text-black font-bold text-lg md:text-xl">
                      {step.step}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-white mb-1">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 text-sm md:text-base">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Garantia de qualidade */}
        <section className="py-16 bg-gray-900/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                    <span className="text-brand-yellow">Garantia de</span>{" "}
                    <span className="text-white">qualidade</span>
                  </h2>
                  <p className="text-gray-400 mb-8 text-lg">
                    Utilizamos apenas materiais premium e tecnologia de impressão
                    avançada para garantir que cada tela seja uma verdadeira obra
                    de arte.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-brand-yellow flex-shrink-0" />
                      <span className="text-white">
                        Canvas 100% algodão, 400g/m²
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-brand-yellow flex-shrink-0" />
                      <span className="text-white">
                        Tintas pigmentadas resistentes UV
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-brand-yellow flex-shrink-0" />
                      <span className="text-white">Molduras de madeira</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-brand-yellow flex-shrink-0" />
                      <span className="text-white">
                        Acabamento profissional e pronto a pendurar
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-black rounded-2xl p-8 border border-gray-800">
                  <div className="text-center mb-6">
                    <Star className="w-12 h-12 text-brand-yellow mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold mb-2 text-white">
                      Qualidade artística
                    </h3>
                    <p className="text-gray-400">
                      Cada tela é uma peça única criada com máximo cuidado.
                    </p>
                  </div>

                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Durabilidade</span>
                      <span className="text-brand-yellow font-semibold">
                        50+ anos
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Resolução mínima</span>
                      <span className="text-brand-yellow font-semibold">
                        300 DPI
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Prazo de produção</span>
                      <span className="text-brand-yellow font-semibold">
                        3-7 dias
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Garantia</span>
                      <span className="text-brand-yellow font-semibold">
                        Vida útil da tela
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Orçamento personalizado */}
        <section className="py-16 bg-black border-t border-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                  <span className="text-brand-yellow">Orçamento</span>{" "}
                  <span className="text-white">personalizado</span>
                </h2>
                <p className="text-gray-400 text-lg">
                  Use uma imagem do Adobe Stock ou envie a sua fotografia e receba
                  um orçamento à medida.
                </p>
              </div>

              <Card className="bg-black border border-gray-800">
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="largura" className="text-white">
                          Largura (cm)
                        </Label>
                        <Input
                          id="largura"
                          type="number"
                          step="1"
                          placeholder="Ex: 70"
                          value={formData.largura}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              largura: e.target.value,
                            })
                          }
                          className="bg-gray-900 border-gray-700 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="altura" className="text-white">
                          Altura (cm)
                        </Label>
                        <Input
                          id="altura"
                          type="number"
                          step="1"
                          placeholder="Ex: 100"
                          value={formData.altura}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              altura: e.target.value,
                            })
                          }
                          className="bg-gray-900 border-gray-700 text-white"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="quantidade" className="text-white">
                        Quantidade de telas
                      </Label>
                      <Input
                        id="quantidade"
                        type="number"
                        min="1"
                        value={formData.quantidade}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            quantidade: e.target.value,
                          })
                        }
                        className="bg-gray-900 border-gray-700 text-white"
                        required
                      />
                    </div>

                    <div>
                      <Label className="text-white">Opção de imagem</Label>
                      <div className="flex gap-4 mt-2">
                        <label className="flex items-center text-white">
                          <input
                            type="radio"
                            name="opcaoImagem"
                            value="adobe-stock"
                            checked={formData.opcaoImagem === "adobe-stock"}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                opcaoImagem: e.target.value,
                              })
                            }
                            className="mr-2"
                          />
                          Adobe Stock
                        </label>
                        <label className="flex items-center text-white">
                          <input
                            type="radio"
                            name="opcaoImagem"
                            value="propria"
                            checked={formData.opcaoImagem === "propria"}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                opcaoImagem: e.target.value,
                              })
                            }
                            className="mr-2"
                          />
                          Imagem própria
                        </label>
                      </div>
                    </div>

                    {formData.opcaoImagem === "adobe-stock" ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="codigoAdobeStock" className="text-white">
                            Código / nº da imagem Adobe Stock
                          </Label>
                          <Input
                            id="codigoAdobeStock"
                            placeholder="Ex: 123456789"
                            value={formData.codigoAdobeStock}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                codigoAdobeStock: e.target.value,
                              })
                            }
                            className="bg-gray-900 border-gray-700 text-white"
                            required
                          />
                        </div>

                        <div>
                          <Label
                            htmlFor="descricaoImagemAdobe"
                            className="text-white"
                          >
                            Observações (opcional)
                          </Label>
                          <Textarea
                            id="descricaoImagemAdobe"
                            placeholder="Notas adicionais sobre a imagem ou composição..."
                            value={formData.descricaoImagem}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                descricaoImagem: e.target.value,
                              })
                            }
                            className="bg-gray-900 border-gray-700 text-white"
                          />
                        </div>

                        <div className="bg-brand-yellow/10 border border-brand-yellow/40 rounded-lg p-4">
                          <p className="text-brand-yellow text-sm">
                            💡 <strong>Dica:</strong> pode procurar a imagem em{" "}
                            <a
                              href="https://stock.adobe.com/pt"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline"
                            >
                              Adobe Stock
                            </a>{" "}
                            e copiar o código/número para aqui.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Label
                          htmlFor="descricaoImagemPropria"
                          className="text-white"
                        >
                          Descrição da sua imagem
                        </Label>
                        <Textarea
                          id="descricaoImagemPropria"
                          placeholder="Ex: fotografia de família, retrato, paisagem..."
                          value={formData.descricaoImagem}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              descricaoImagem: e.target.value,
                            })
                          }
                          className="bg-gray-900 border-gray-700 text-white"
                          required
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="nome" className="text-white">
                          Nome
                        </Label>
                        <Input
                          id="nome"
                          value={formData.nome}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              nome: e.target.value,
                            })
                          }
                          className="bg-gray-900 border-gray-700 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-white">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              email: e.target.value,
                            })
                          }
                          className="bg-gray-900 border-gray-700 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="telefone" className="text-white">
                          Telefone
                        </Label>
                        <Input
                          id="telefone"
                          value={formData.telefone}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              telefone: e.target.value,
                            })
                          }
                          className="bg-gray-900 border-gray-700 text-white"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="mensagem" className="text-white">
                        Mensagem adicional
                      </Label>
                      <Textarea
                        id="mensagem"
                        placeholder="Detalhes adicionais sobre o projeto..."
                        value={formData.mensagem}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mensagem: e.target.value,
                          })
                        }
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </div>

                    {/* Anexos (opcional) */}
                    <div>
                      <Label className="text-white">Anexos (opcional)</Label>

                      <ObjectUploader
                        onUpload={(files) =>
                          setFormData({
                            ...formData,
                            anexos: files as any,
                          })
                        }
                        maxFiles={3}
                        acceptedTypes={[
                          "image/*",
                          ".pdf",
                          ".ai",
                          ".svg",
                          ".tif",
                          ".tiff",
                        ]}
                        className="w-full mt-2"
                      />

                      <div className="mt-3 text-xs text-white/60 space-y-1">
                        <p>• Máximo 3 ficheiros, até 10MB cada</p>
                        <p>
                          • Formatos aceites: JPG, JPEG, PNG, TIFF, SVG, AI, PDF
                        </p>
                        <p>
                          • Importante: Fontes devem ser convertidas em linhas antes do envio
                        </p>
                      </div>

                      {formData.anexos && formData.anexos.length > 0 && (
                        <div className="mt-3">
                          <p className="text-white/60 mb-2 text-sm">
                            Ficheiros anexados:
                          </p>
                          <div className="space-y-2">
                            {formData.anexos.map((file: any, index: number) => (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-gray-800/30 p-2 rounded border border-white/10"
                              >
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-brand-turquoise" />
                                  <span className="text-white/80 text-sm">
                                    {file.originalName}
                                  </span>
                                  {typeof file.size === "number" && (
                                    <span className="text-white/40 text-xs">
                                      ({(file.size / 1024).toFixed(1)} KB)
                                    </span>
                                  )}
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    setFormData({
                                      ...formData,
                                      anexos: formData.anexos.filter(
                                        (_: any, i: number) => i !== index
                                      ),
                                    })
                                  }
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

                    <Button
                      type="submit"
                      disabled={submitMutation.isPending}
                      className="w-full bg-brand-yellow text-black font-bold hover:bg-brand-yellow/90"
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      {submitMutation.isPending
                        ? "A enviar..."
                        : "Solicitar orçamento por email"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="py-16 bg-black border-t border-gray-900">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              <span className="text-white">Pronto para criar a sua</span>{" "}
              <span className="text-brand-yellow">obra de arte?</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Transforme as suas fotografias favoritas ou criações artísticas em
              telas profissionais que durarão muitos anos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                variant="outline"
                className="border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-black px-8 py-6 text-lg"
              >
                <a
                  href="https://wa.me/351930682725?text=Olá!%20Interessado%20em%20telas%20artísticas."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp direto
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}