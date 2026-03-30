import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import ServiceHeroTwoColumn from "@/components/ServiceHeroTwoColumn";
import ServiceGallery from "@/components/service-gallery";
import ServiceCardsSection from "@/components/services/ServiceCardsSection";
import type { ServiceAccordionCard } from "@/components/services/ServiceCardAccordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
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
  const [, navigate] = useLocation();

  const [formData, setFormData] = useState({
    largura: "",
    altura: "",
    quantidade: "1",
    opcaoImagem: "aconselhamento",
    descricaoImagem: "",
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

    if (formData.opcaoImagem === "aconselhamento" && !formData.descricaoImagem) {
      alert("Descreva o que pretende.");
      return;
    }

    setIsSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("nome", formData.nome);
      fd.append("email", formData.email);
      fd.append("telefone", formData.telefone);
      fd.append("mensagem", "Pedido papel parede");

      await fetch("/api/contact", { method: "POST", body: fd });

      navigate("/obrigado-orcamento");
    } catch {
      alert("Erro ao enviar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const catalogoCards: ServiceAccordionCard[] = [
    {
      key: "variedade",
      icon: <Grid className="w-6 h-6" />,
      title: "Grande variedade",
      intro: "Muitas opções",
      content: ["Texturas e padrões"],
    },
  ];

  const defaultImages = [
    {
      src: "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=800&q=80",
      alt: "Papel parede",
      title: "Exemplo",
    },
  ];

  const { data } = useQuery<{ images: typeof defaultImages }>({
    queryKey: ["/api/service-galleries"],
  });

  const images = data?.images || defaultImages;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      {/* HERO CORRIGIDO */}
      <ServiceHeroTwoColumn
        title="Papel de parede à medida"
        subtitle="Decoração personalizada"
        description="Escolha ou peça orçamento"
        primaryCta={{
          text: "Pedir orçamento gratuito",
          onClick: () => {
            document
              .getElementById("orcamento")
              ?.scrollIntoView({ behavior: "smooth" });
          },
        }}
        secondaryCta={{
          text: "Falar por WhatsApp",
          href: "https://wa.me/351930682725",
        }}
      />

      {/* OPÇÕES */}
      <section className="py-10">
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <h3>Loja</h3>
              <Button asChild>
                <Link href="/loja/papel-parede">Ver loja</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <h3>Personalizado</h3>
              <Button asChild>
                <a href="#orcamento">Pedir orçamento</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <ServiceCardsSection cards={catalogoCards} />

      <ServiceGallery images={images} />

      {/* FORM */}
      <section id="orcamento" className="py-16">
        <div className="max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Nome"
              value={formData.nome}
              onChange={(e) =>
                setFormData({ ...formData, nome: e.target.value })
              }
            />
            <Input
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <Button type="submit">
              {isSubmitting ? "A enviar..." : "Enviar"}
            </Button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}