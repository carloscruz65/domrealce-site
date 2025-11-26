import ScrollToTop from "@/components/scroll-to-top";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import ServiceHero from "@/components/service-hero";
import ServiceGallery from "@/components/service-gallery";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
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
  Shield
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ServicoTelasArtisticas() {
  useScrollAnimation();
  const [formData, setFormData] = useState({
    largura: '',
    altura: '',
    quantidade: '1',
    opcaoImagem: 'adobe-stock', // 'adobe-stock' ou 'propria'
    descricaoImagem: '',
    codigoAdobeStock: '',
    linkImagemAdobe: '',
    informacoesImagemAdobe: '',
    mensagem: '',
    nome: '',
    email: '',
    telefone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação para Adobe Stock
    if (formData.opcaoImagem === 'adobe-stock') {
      const hasCode = formData.codigoAdobeStock.trim() !== '';
      const hasLink = formData.linkImagemAdobe.trim() !== '';
      const hasInfo = formData.informacoesImagemAdobe.trim() !== '';
      
      if (!hasCode && !hasLink && !hasInfo) {
        alert('Para imagens do Adobe Stock, é obrigatório fornecer pelo menos um dos seguintes: código da imagem, link da imagem ou informações da imagem.');
        return;
      }
    }
    
    let imagemInfo = '';
    if (formData.opcaoImagem === 'adobe-stock') {
      imagemInfo = `Adobe Stock:
${formData.codigoAdobeStock ? `📝 Código: ${formData.codigoAdobeStock}` : ''}
${formData.linkImagemAdobe ? `🔗 Link: ${formData.linkImagemAdobe}` : ''}
${formData.informacoesImagemAdobe ? `ℹ️ Informações: ${formData.informacoesImagemAdobe}` : ''}
${formData.descricaoImagem ? `📝 Descrição: ${formData.descricaoImagem}` : ''}`;
    } else {
      imagemInfo = `Imagem própria - ${formData.descricaoImagem}`;
    }

    const whatsappMessage = `Olá! Gostaria de um orçamento para tela artística:
    
📐 Medidas: ${formData.largura}cm x ${formData.altura}cm
📦 Quantidade: ${formData.quantidade} tela(s)
🖼️ Imagem: ${imagemInfo}
📞 Contacto: ${formData.nome} - ${formData.telefone}
📧 Email: ${formData.email}
💬 Mensagem: ${formData.mensagem}`;
    
    const encodedMessage = encodeURIComponent(whatsappMessage);
    window.open(`https://wa.me/351930682725?text=${encodedMessage}`, '_blank');
  };
  const features = [
    {
      icon: <Frame className="w-6 h-6" />,
      title: "Canvas Premium",
      description: "Telas de algodão de alta gramagem para máxima durabilidade e qualidade"
    },
    {
      icon: <Brush className="w-6 h-6" />,
      title: "Impressão Artística",
      description: "Tecnologia de impressão que reproduz fielmente cores e texturas"
    },
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Fotografias Personalizadas",
      description: "Transforme as suas fotografias em obras de arte profissionais"
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Arte Digital",
      description: "Criação de arte digital exclusiva para a sua tela"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Molduras Incluídas",
      description: "Variedade de molduras elegantes incluídas no serviço"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Resistente ao Tempo",
      description: "Tintas UV resistentes que mantêm as cores vibrantes por anos"
    }
  ];

  const sizes = [
    "20x30 cm", "30x40 cm", "40x50 cm", "50x70 cm", 
    "60x80 cm", "70x100 cm", "80x120 cm", "100x150 cm"
  ];

  const applications = [
    {
      title: "Decoração Residencial",
      description: "Transforme a sua casa num espaço único com arte personalizada",
      examples: ["Salas de estar", "Quartos", "Escritórios", "Corredores"]
    },
    {
      title: "Espaços Comerciais", 
      description: "Crie ambientes profissionais inspiradores e memoráveis",
      examples: ["Hotéis", "Restaurantes", "Consultórios", "Escritórios"]
    },
    {
      title: "Presentes Especiais",
      description: "Ofereça algo verdadeiramente único e pessoal",
      examples: ["Casamentos", "Aniversários", "Formações", "Eventos"]
    }
  ];

  const process = [
    {
      step: "01",
      title: "Seleção da Imagem",
      description: "Escolha das nossas texturas da loja ou visite o Adobe Stock para selecionar uma imagem. Para Adobe Stock, recolha o número da imagem ou tire uma miniatura"
    },
    {
      step: "02", 
      title: "Preparação Digital",
      description: "Otimizamos a imagem para garantir a melhor qualidade de impressão"
    },
    {
      step: "03",
      title: "Impressão em Canvas", 
      description: "Impressão de alta qualidade em tela de algodão premium"
    },
    {
      step: "04",
      title: "Montagem e Moldura",
      description: "Esticamos a tela e aplicamos a moldura escolhida"
    },
    {
      step: "05",
      title: "Controlo de Qualidade",
      description: "Inspeção final antes da entrega para garantir perfeição"
    }
  ];

  const defaultImages = [
    {
      src: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80",
      alt: "Tela artística em sala moderna",
      title: "Arte Contemporânea"
    },
    {
      src: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
      alt: "Canvas com fotografia em preto e branco",
      title: "Fotografia Artística"
    },
    {
      src: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&q=80",
      alt: "Tela com paisagem natural",
      title: "Paisagens Naturais"
    },
    {
      src: "https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=800&q=80",
      alt: "Canvas abstrato colorido",
      title: "Arte Abstrata"
    },
    {
      src: "https://images.unsplash.com/photo-1578926314433-e2789279f4aa?w=800&q=80",
      alt: "Tela decorativa em quarto",
      title: "Decoração Personalizada"
    },
    {
      src: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&q=80",
      alt: "Tela artística premium",
      title: "Qualidade Premium"
    }
  ];

  const { data: galleryData } = useQuery<{images: typeof defaultImages}>({
    queryKey: ['/api/service-galleries', 'telas-artisticas'],
  });
  const galleryImages = galleryData?.images || defaultImages;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navigation />
      
      <ServiceHero
        serviceId="telas-artisticas"
        badge="Telas Artísticas Premium"
        badgeIcon={<Image className="w-4 h-4 mr-2" />}
        title="Transforme Fotografias"
        subtitle="em Obras de Arte"
        description="Impressão artística em canvas de alta qualidade. Transforme as suas memórias mais preciosas ou criações artísticas em telas duradouras e elegantes."
        overlayOpacity="0"
        primaryCta={{
          text: "Criar Minha Tela",
          href: "/contactos#formulario"
        }}
        secondaryCta={{
          text: "Contactar",
          href: "/contactos#formulario"
        }}
      />

      {/* Features Grid */}
      <section className="pt-8 pb-8 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-purple-400">Qualidade</span> <span className="text-white">Artística</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Tecnologia de impressão artística que garante resultados dignos de galeria
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-[#0a0a0a] border-[#333] hover:border-purple-400 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="text-purple-400 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <ServiceGallery images={galleryImages} />

      {/* Sizes Section */}
      <section className="pt-8 pb-8 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-white">Tamanhos</span> <span className="text-brand-coral">Disponíveis</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Desde formatos compactos até grandes obras de parede
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {sizes.map((size, index) => (
              <div key={index} className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 text-center hover:border-brand-coral transition-all duration-300">
                <div className="text-2xl font-bold text-brand-coral mb-2">{size}</div>
                <div className="text-sm text-gray-400">Formato padrão</div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-400 mb-4">Precisa de um tamanho personalizado?</p>
            <Button asChild variant="outline" className="border-brand-turquoise text-brand-turquoise hover:bg-brand-turquoise hover:text-black">
              <Link href="/contactos#formulario">Solicitar Medida Especial</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="pt-8 pb-8 bg-gray-900/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-white">Aplicações</span> <span className="text-brand-yellow">Ideais</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Perfeitas para qualquer ambiente que necessite de um toque artístico especial
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {applications.map((application, index) => (
              <Card key={index} className="bg-[#0a0a0a] border-[#333] hover:border-brand-yellow transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-brand-yellow">{application.title}</h3>
                  <p className="text-gray-400 mb-4">{application.description}</p>
                  <div>
                    <span className="text-sm text-gray-500 mb-2 block">Exemplos:</span>
                    <div className="space-y-1">
                      {application.examples.map((example, exampleIndex) => (
                        <div key={exampleIndex} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-brand-yellow rounded-full"></div>
                          <span className="text-sm text-gray-300">{example}</span>
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

      {/* Process Section */}
      <section data-scroll className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-white">Processo de</span> <span className="text-purple-400">Criação</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Cada tela é cuidadosamente produzida para garantir qualidade artística excepcional
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {process.map((step, index) => (
              <div key={index} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-brand-coral rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {step.step}
                  </div>
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                  {index < process.length - 1 && (
                    <div className="w-px h-8 bg-gray-700 ml-8 mt-4"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Section */}
      <section data-scroll className="py-16 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                  <span className="text-purple-400">Garantia de</span> <span className="text-white">Qualidade</span>
                </h2>
                <p className="text-gray-400 mb-8 text-lg">
                  Utilizamos apenas materiais premium e tecnologia de impressão avançada 
                  para garantir que cada tela seja uma verdadeira obra de arte.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-purple-400 flex-shrink-0" />
                    <span className="text-white">Canvas 100% algodão, 400g/m²</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-purple-400 flex-shrink-0" />
                    <span className="text-white">Tintas pigmentadas resistentes UV</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-purple-400 flex-shrink-0" />
                    <span className="text-white">Molduras de madeira certificada</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-purple-400 flex-shrink-0" />
                    <span className="text-white">Acabamento profissional</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-purple-400 flex-shrink-0" />
                    <span className="text-white">Pronto para pendurar</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/50 rounded-2xl p-8 border border-gray-800">
                <div className="text-center mb-6">
                  <Star className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold mb-2 text-white">Qualidade Artística</h3>
                  <p className="text-gray-400">
                    Cada tela é uma peça única criada com máximo cuidado
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Durabilidade</span>
                    <span className="text-purple-400 font-semibold">50+ anos</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Resolução mínima</span>
                    <span className="text-purple-400 font-semibold">300 DPI</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Prazo de produção</span>
                    <span className="text-purple-400 font-semibold">3-7 dias</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Garantia</span>
                    <span className="text-purple-400 font-semibold">Vida útil</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      {/* CTA Section */}
      <section className="pt-8 pb-8 bg-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            <span className="text-white">Pronto para Criar a Sua</span> <span className="text-purple-400">Obra de Arte?</span>
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Transforme as suas fotografias favoritas ou criações artísticas em telas 
            profissionais que durarão para sempre.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-brand-yellow text-white font-bold px-8 py-6 text-lg">
              <Link href="/contactos#formulario">
                Criar Minha Tela
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-black px-8 py-6 text-lg">
              <a href="https://wa.me/351930682725?text=Olá!%20Interessado%20em%20telas%20artísticas." target="_blank" rel="noopener noreferrer">
                WhatsApp Direto
              </a>
            </Button>
          </div>
        </div>
      </section>

      <ScrollToTop />
      <Footer />
    </div>
  );
}