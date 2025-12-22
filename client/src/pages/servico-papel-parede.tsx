import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import ServiceHeroTwoColumn from "@/components/ServiceHeroTwoColumn";
import ServiceGallery from "@/components/service-gallery";
import ServiceCardsSection from "@/components/services/ServiceCardsSection";
import type { ServiceAccordionCard } from "@/components/services/ServiceCardAccordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Wallpaper,
  CheckCircle,
  Star,
  ArrowRight,
  Grid,
  Palette,
  Home,
  Ruler,
  Eye,
  Search,
  Upload,
  Calculator,
  ShoppingCart,
  FileText,
  X,
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ObjectUploader } from "@/components/ObjectUploader";

export default function ServicoPapelParede() {
  const [formData, setFormData] = useState({
    largura: "",
    altura: "",
    quantidade: "1",
    opcaoImagem: "adobe-stock", // 'adobe-stock' ou 'propria'
    descricaoImagem: "",
    codigoAdobeStock: "",
    linkImagemAdobe: "",
    informacoesImagemAdobe: "",
    mensagem: "",
    nome: "",
    email: "",
    telefone: "",
    anexos: [] as any[],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação para Adobe Stock
    if (formData.opcaoImagem === "adobe-stock") {
      const hasCode = formData.codigoAdobeStock.trim() !== "";
      const hasLink = formData.linkImagemAdobe.trim() !== "";
      const hasInfo = formData.informacoesImagemAdobe.trim() !== "";

      if (!hasCode && !hasLink && !hasInfo) {
        alert(
          "Para imagens do Adobe Stock, é obrigatório fornecer pelo menos um dos seguintes: código da imagem, link da imagem ou informações da imagem."
        );
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Construir info da imagem
      let imagemInfo = "";
      if (formData.opcaoImagem === "adobe-stock") {
        imagemInfo = `Adobe Stock:
${formData.codigoAdobeStock ? `📝 Código: ${formData.codigoAdobeStock}` : ""}
${formData.linkImagemAdobe ? `🔗 Link: ${formData.linkImagemAdobe}` : ""}
${
  formData.informacoesImagemAdobe
    ? `ℹ️ Informações: ${formData.informacoesImagemAdobe}`
    : ""
}
${
  formData.descricaoImagem
    ? `📝 Descrição: ${formData.descricaoImagem}`
    : ""
}`.trim();
      } else {
        imagemInfo = `Imagem própria
${formData.descricaoImagem ? `📝 Descrição: ${formData.descricaoImagem}` : ""}
(Nota: posso enviar a imagem em resposta a este email ou via WhatsApp.)`.trim();
      }

      // Mensagem final enviada para /api/contact (vai por email interno e auto-reply)
      let mensagemFinal = `Pedido de orçamento - Papel de parede

📐 Medidas: ${formData.largura} m x ${formData.altura} m
📦 Quantidade: ${formData.quantidade} parede(s)

🖼️ Imagem:
${imagemInfo}

👤 Contacto:
- Nome: ${formData.nome}
- Telefone: ${formData.telefone || "-"}
- Email: ${formData.email}

💬 Mensagem adicional:
${formData.mensagem || "(sem mensagem adicional)"}
`;

      // anexos (referências geradas pelo ObjectUploader)
      if (formData.anexos && formData.anexos.length > 0) {
        mensagemFinal += `

📎 Ficheiros enviados (referência):
${formData.anexos
  .map(
    (file: any, index: number) =>
      `${index + 1}. ${file.originalName}${
        file.uploadURL ? " - " + file.uploadURL : ""
      }`
  )
  .join("\n")}
`;
      }

      // Enviar via backend (igual ao formulário Contactos)
      const fd = new FormData();
      fd.append("nome", formData.nome.trim());
      fd.append("email", formData.email.trim());
      fd.append("telefone", formData.telefone?.trim() || "");
      fd.append("empresa", "");
      fd.append("mensagem", mensagemFinal);

      const res = await fetch("/api/contact", {
        method: "POST",
        body: fd,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || "Erro ao enviar pedido.");
      }

      alert("Pedido enviado com sucesso! Vamos responder com a maior brevidade.");

      // Limpar formulário
      setFormData({
        largura: "",
        altura: "",
        quantidade: "1",
        opcaoImagem: "adobe-stock",
        descricaoImagem: "",
        codigoAdobeStock: "",
        linkImagemAdobe: "",
        informacoesImagemAdobe: "",
        mensagem: "",
        nome: "",
        email: "",
        telefone: "",
        anexos: [],
      });
    } catch (err: any) {
      alert(err?.message || "Erro ao enviar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const process = [
    {
      step: "01",
      title: "Escolha da imagem",
      description:
        "Escolhe uma textura da nossa loja ou seleciona uma imagem no Adobe Stock.",
    },
    {
      step: "02",
      title: "Medidas personalizadas",
      description:
        "Indica as dimensões exatas (largura x altura) e a quantidade de paredes.",
    },
    {
      step: "03",
      title: "Medição e orçamento",
      description:
        "Calculamos quantidades, enviamos orçamento detalhado e esclarecemos dúvidas.",
    },
    {
      step: "04",
      title: "Produção",
      description:
        "Preparamos e produzimos o papel de parede com a imagem escolhida.",
    },
    {
      step: "05",
      title: "Entrega e aplicação",
      description:
        "Entregamos e aplicamos com equipa especializada e garantia de qualidade.",
    },
  ];

  const benefits = [
    "Catálogo sempre atualizado",
    "Visualização em tamanho real",
    "Cálculo automático de quantidades",
    "Aplicação profissional incluída",
    "Garantia de qualidade",
    "Suporte técnico especializado",
  ];

  // ✅ Cards no modelo Design (accordion)
  const catalogoCards: ServiceAccordionCard[] = [
    {
      key: "variedade",
      icon: <Grid className="w-6 h-6" />,
      title: "Grande variedade de texturas",
      intro: "Tendências atuais e opções para todos os estilos.",
      content: [
        "Coleção ampla e atualizada com padrões, texturas e estilos diferentes.",
        "Opções para ambientes residenciais e comerciais.",
      ],
    },
    {
      key: "categorias",
      icon: <Search className="w-6 h-6" />,
      title: "Múltiplas categorias",
      intro: "Encontra rápido o padrão certo.",
      content: [
        "Organização intuitiva por estilos e categorias.",
        "Filtragem mais rápida para chegar ao que realmente procura.",
      ],
    },
    {
      key: "tamanho-real",
      icon: <Eye className="w-6 h-6" />,
      title: "Visualização real",
      intro: "Veja a textura em tamanho real antes de decidir.",
      content: [
        "Catálogo interativo para avaliar melhor escala e detalhe.",
        "Ajuda a escolher com mais confiança e menos dúvidas.",
      ],
    },
    {
      key: "medidas",
      icon: <Ruler className="w-6 h-6" />,
      title: "Medidas personalizadas",
      intro: "Cálculo orientado ao seu espaço.",
      content: [
        "Indica largura e altura e calculamos a solução mais adequada.",
        "Evita desperdícios e ajuda a definir quantidades com segurança.",
      ],
    },
    {
      key: "comparar",
      icon: <Palette className="w-6 h-6" />,
      title: "Seleção múltipla",
      intro: "Compare opções antes de fechar a escolha.",
      content: [
        "Comparação lado a lado para escolher o padrão ideal.",
        "Útil quando está entre 2 ou 3 opções.",
      ],
    },
    {
      key: "simulacao",
      icon: <Home className="w-6 h-6" />,
      title: "Simulação no ambiente",
      intro: "Antecipar o resultado final ajuda a decidir melhor.",
      content: [
        "Visualize o papel aplicado no ambiente antes de avançar.",
        "Menos incerteza e mais satisfação no resultado final.",
      ],
    },
  ];

  const defaultImages = [
    {
      src: "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=800&q=80",
      alt: "Papel de parede decorativo moderno",
      title: "Texturas modernas",
    },
    {
      src: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
      alt: "Papel de parede com padrões geométricos",
      title: "Padrões geométricos",
    },
    {
      src: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
      alt: "Papel de parede floral elegante",
      title: "Designs florais",
    },
    {
      src: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80",
      alt: "Papel de parede texturizado",
      title: "Texturas premium",
    },
    {
      src: "https://images.unsplash.com/photo-1615873968403-89e068629265?w=800&q=80",
      alt: "Papel de parede para quarto",
      title: "Ambientes acolhedores",
    },
    {
      src: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=800&q=80",
      alt: "Papel de parede artístico",
      title: "Arte na parede",
    },
  ];

  const { data: galleryData } = useQuery<{ images: typeof defaultImages }>({
    queryKey: ["/api/service-galleries", "papel-parede"],
  });
  const galleryImages = galleryData?.images || defaultImages;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <ServiceHeroTwoColumn
        serviceId="papel-parede"
        badge="Papel de Parede Premium"
        badgeIcon={<Wallpaper className="w-4 h-4" />}
        title="Papel de parede à medida do seu espaço"
        subtitle="Decoração personalizada"
        description="Descubra uma coleção completa de papéis de parede, com visualização em tamanho real, várias categorias e aplicação profissional."
        imageSrc="/public-objects/servicos/papel-parede.webp"
        imageAlt="Papel de Parede DOMREALCE"
        primaryCta={{ text: "Explorar catálogo", href: "/loja/papel-parede" }}
      />

      <main>
        {/* ✅ Catálogo Interativo (normalizado para cards + dropdown) */}
        <ServiceCardsSection
          titleTop="Catálogo"
          titleBottom="interativo"
          subtitle="Explore centenas de texturas, padrões e estilos num catálogo fácil de utilizar e sempre atualizado."
          cards={catalogoCards}
          defaultOpenKey={null}
        />

        {/* Galeria */}
        <ServiceGallery
          images={galleryImages}
          title="Exemplos de ambientes"
          description="Algumas inspirações de aplicação de papel de parede em diferentes estilos e espaços."
          columns={3}
        />

        {/* Como funciona */}
        <section className="py-16 bg-black border-t border-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                <span className="text-white">Como</span>{" "}
                <span className="text-brand-yellow">funciona</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Pode escolher uma textura da nossa loja ou utilizar uma imagem do{" "}
                <a
                  href="https://stock.adobe.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-yellow hover:text-brand-yellow/80 underline"
                >
                  Adobe Stock
                </a>
                . Para Adobe Stock, bastam o número, o link ou as informações da
                imagem.
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                {process.map((step, index) => (
                  <div
                    key={index}
                    className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 flex gap-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-yellow text-black flex items-center justify-center font-semibold text-sm">
                      {step.step}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1 text-white">
                        {step.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Vantagens */}
        <section className="pt-8 pb-16 bg-gray-900/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                    <span className="text-brand-yellow">Vantagens</span>{" "}
                    <span className="text-white">exclusivas</span>
                  </h2>
                  <p className="text-gray-400 mb-8 text-lg">
                    Mais do que vender papel de parede, oferecemos uma solução
                    completa com aconselhamento, medição e aplicação profissional.
                  </p>
                  <div className="space-y-4">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-brand-yellow flex-shrink-0" />
                        <span className="text-white">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-black rounded-2xl p-8 border border-gray-800">
                  <div className="text-center mb-6">
                    <Star className="w-12 h-12 text-brand-yellow mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold mb-2 text-white">
                      Serviço completo
                    </h3>
                    <p className="text-gray-400">
                      Da escolha da imagem à aplicação final, a nossa equipa
                      acompanha todo o processo com atenção ao detalhe.
                    </p>
                  </div>

                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Texturas disponíveis</span>
                      <span className="text-brand-yellow font-semibold">
                        Grande variedade
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Categorias</span>
                      <span className="text-brand-yellow font-semibold">
                        Diversas
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Aplicação incluída</span>
                      <span className="text-brand-yellow font-semibold">Sim</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Garantia</span>
                      <span className="text-brand-yellow font-semibold">
                        2 anos
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
                  Escolha entre Adobe Stock ou envie a sua própria imagem e receba
                  um orçamento à medida.
                </p>
              </div>

              <Card className="bg-black border border-gray-800 mb-8">
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="largura" className="text-white">
                          Largura (metros)
                        </Label>
                        <Input
                          id="largura"
                          type="number"
                          step="0.1"
                          placeholder="Ex: 3.5"
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
                          Altura (metros)
                        </Label>
                        <Input
                          id="altura"
                          type="number"
                          step="0.1"
                          placeholder="Ex: 2.5"
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
                        Quantidade de paredes
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
                          <Label
                            htmlFor="codigoAdobeStock"
                            className="text-white"
                          >
                            Código Adobe Stock (se disponível)
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
                          />
                        </div>

                        <div>
                          <Label htmlFor="linkImagemAdobe" className="text-white">
                            Link da imagem Adobe Stock (se disponível)
                          </Label>
                          <Input
                            id="linkImagemAdobe"
                            type="url"
                            placeholder="https://stock.adobe.com/..."
                            value={formData.linkImagemAdobe}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                linkImagemAdobe: e.target.value,
                              })
                            }
                            className="bg-gray-900 border-gray-700 text-white"
                          />
                        </div>

                        <div>
                          <Label
                            htmlFor="informacoesImagemAdobe"
                            className="text-white"
                          >
                            Informações da imagem (título, autor, etc.)
                          </Label>
                          <Textarea
                            id="informacoesImagemAdobe"
                            placeholder="Ex: título da imagem, nome do autor, palavras-chave..."
                            value={formData.informacoesImagemAdobe}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                informacoesImagemAdobe: e.target.value,
                              })
                            }
                            className="bg-gray-900 border-gray-700 text-white"
                          />
                        </div>

                        <div>
                          <Label htmlFor="descricaoImagem" className="text-white">
                            Descrição adicional (opcional)
                          </Label>
                          <Textarea
                            id="descricaoImagem"
                            placeholder="Ex: preferências de cores, estilo, detalhes específicos..."
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
                            💡 <strong>Dica:</strong> forneça pelo menos um dos
                            seguintes: código da imagem, link direto ou informações
                            detalhadas. Assim conseguimos localizar a imagem correta.
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
                          placeholder="Ex: logo da empresa, foto de família, imagem específica..."
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
                            anexos: files,
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
                        <p>• Formatos aceites: JPG, JPEG, PNG, TIFF, SVG, AI, PDF</p>
                        <p>• Importante: Fontes devem ser convertidas em linhas antes do envio</p>
                        <p>
                          • Os ficheiros serão mencionados no email. Para envio dos ficheiros reais,
                          utilize email ou WhatsApp.
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
                      disabled={isSubmitting}
                      className="w-full bg-brand-yellow text-black font-bold hover:bg-brand-yellow/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Calculator className="w-4 h-4 mr-2" />
                      {isSubmitting ? "A enviar..." : "Solicitar orçamento"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Opções rápidas */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-black border border-gray-800 hover:border-brand-yellow transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <ShoppingCart className="w-12 h-12 text-brand-yellow mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-3 text-white">
                      Loja online
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Explore a nossa secção de texturas na loja online.
                    </p>
                    <Button
                      asChild
                      className="bg-brand-yellow text-black hover:bg-brand-yellow/90"
                    >
                      <Link href="/loja">
                        Ver texturas na loja
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-black border border-gray-800 hover:border-brand-yellow transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <Upload className="w-12 h-12 text-brand-yellow mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-3 text-white">
                      Dúvidas
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Pode usar o WhatsApp para tirar dúvidas rápidas ou enviar imagens
                      de referência para o seu papel de parede.
                    </p>
                    <Button
                      asChild
                      variant="outline"
                      className="border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-black"
                    >
                      <a
                        href="https://wa.me/351930682725?text=Olá!%20Quero%20enviar%20uma%20imagem%20para%20papel%20de%20parede"
                        target="_blank"
                        rel="noreferrer"
                      >
                        WhatsApp
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="py-16 bg-black border-t border-gray-900">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              <span className="text-white">Pronto para transformar o seu</span>{" "}
              <span className="text-brand-yellow">espaço?</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Envie-nos as medidas e a imagem que pretende utilizar e criamos um
              projeto de papel de parede à medida do seu ambiente.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-brand-yellow text-black font-bold px-8 py-6 text-lg hover:bg-brand-yellow/90"
              >
                <Link href="/contactos#formulario">
                  Agendar consulta
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-black px-8 py-6 text-lg"
              >
                <a
                  href="https://wa.me/351930682725?text=Olá!%20Interessado%20em%20papel%20de%20parede."
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