import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import ServiceHero from "@/components/service-hero";
import ServiceGallery from "@/components/service-gallery";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
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
  ShoppingCart
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ServicoPapelParede() {
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

    const whatsappMessage = `Olá! Gostaria de um orçamento para papel de parede:
    
📐 Medidas: ${formData.largura}m x ${formData.altura}m
📦 Quantidade: ${formData.quantidade} parede(s)
🖼️ Imagem: ${imagemInfo}
📞 Contacto: ${formData.nome} - ${formData.telefone}
📧 Email: ${formData.email}
💬 Mensagem: ${formData.mensagem}`;
    
    const encodedMessage = encodeURIComponent(whatsappMessage);
    window.open(`https://wa.me/351930682725?text=${encodedMessage}`, '_blank');
  };


  const features = [
    {
      icon: <Grid className="w-6 h-6" />,
      title: "Grande Variedade de Texturas",
      description: "Vasta coleção constantemente atualizada com as últimas tendências"
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "Múltiplas Categorias",
      description: "Organização intuitiva para encontrar rapidamente o padrão ideal"
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Visualização Real",
      description: "Catálogo interativo que permite ver as texturas em tamanho real"
    },
    {
      icon: <Ruler className="w-6 h-6" />,
      title: "Medidas Personalizadas",
      description: "Cálculo automático de quantidades necessárias para o seu espaço"
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Seleção Múltipla",
      description: "Compare diferentes padrões lado a lado para decidir melhor"
    },
    {
      icon: <Home className="w-6 h-6" />,
      title: "Simulação no Ambiente",
      description: "Veja como ficará o papel na sua parede antes de comprar"
    }
  ];

  const process = [
    {
      step: "01",
      title: "Escolha da Imagem",
      description: "Escolha das nossas texturas da loja ou visite Adobe Stock para selecionar uma imagem"
    },
    {
      step: "02", 
      title: "Medidas Personalizadas",
      description: "Forneça as dimensões exactas (largura x altura) do seu projeto"
    },
    {
      step: "03",
      title: "Medição do Espaço", 
      description: "Calculamos as quantidades exatas necessárias para o seu projeto"
    },
    {
      step: "04",
      title: "Orçamento Detalhado",
      description: "Receba orçamento completo incluindo papel e aplicação"
    },
    {
      step: "05",
      title: "Entrega e Aplicação",
      description: "Entregamos e aplicamos com garantia de qualidade profissional"
    }
  ];

  const benefits = [
    "Catálogo sempre atualizado",
    "Visualização em tamanho real", 
    "Cálculo automático de quantidades",
    "Aplicação profissional incluída",
    "Garantia de qualidade",
    "Suporte técnico especializado"
  ];

  const galleryImages = [
    {
      src: "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=800&q=80",
      alt: "Papel de parede decorativo moderno",
      title: "Texturas Modernas"
    },
    {
      src: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
      alt: "Papel de parede com padrões geométricos",
      title: "Padrões Geométricos"
    },
    {
      src: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
      alt: "Papel de parede floral elegante",
      title: "Designs Florais"
    },
    {
      src: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80",
      alt: "Papel de parede texturizado",
      title: "Texturas Premium"
    },
    {
      src: "https://images.unsplash.com/photo-1615873968403-89e068629265?w=800&q=80",
      alt: "Papel de parede para quarto",
      title: "Ambientes Acolhedores"
    },
    {
      src: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=800&q=80",
      alt: "Papel de parede artístico",
      title: "Arte na Parede"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <ServiceHero
        badge="Papel de Parede Premium"
        badgeIcon={<Wallpaper className="w-4 h-4 mr-2" />}
        title="Grande Variedade de Texturas"
        subtitle="em Catálogo Interativo"
        description="Descubra a maior coleção de papéis de parede em Portugal. Catálogo interativo com visualização em tamanho real e múltiplas categorias diferentes."
        backgroundTexture="linear-gradient(45deg, rgba(255, 127, 80, 0.1) 25%, transparent 25%, transparent 75%, rgba(255, 127, 80, 0.1) 75%, rgba(255, 127, 80, 0.1)), linear-gradient(45deg, rgba(255, 127, 80, 0.1) 25%, transparent 25%, transparent 75%, rgba(255, 127, 80, 0.1) 75%, rgba(255, 127, 80, 0.1))"
        gradientOverlay="from-black/95 via-black/90 to-black/95"
        primaryCta={{
          text: "Explorar Catálogo de Texturas",
          href: "/loja/papel-parede"
        }}
        secondaryCta={{
          text: "Contactar",
          href: "/contactos#formulario"
        }}
      />

      {/* Features Grid */}
      <section className="pt-0 pb-8 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-brand-coral">Catálogo</span> <span className="text-white">Interativo</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Tecnologia inovadora que permite explorar milhares de texturas de forma intuitiva
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-black/50 border-gray-800 hover:border-brand-coral transition-all duration-300">
                <CardContent className="p-6">
                  <div className="text-brand-coral mb-4">
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



      {/* Process Section */}
      <section className="py-16 bg-gray-900/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-white">Como</span> <span className="text-brand-turquoise">Funciona</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Escolha entre as nossas texturas da loja ou use <a href="https://stock.adobe.com/" target="_blank" rel="noopener noreferrer" className="text-brand-turquoise hover:text-brand-yellow underline">Adobe Stock</a>. Para imagens do Adobe Stock, recolha o número da imagem ou tire uma miniatura para enviar pelo formulário
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {process.map((step, index) => (
              <div key={index} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-coral to-brand-yellow rounded-full flex items-center justify-center text-white font-bold text-xl">
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

      {/* Benefits Section */}
      <section className="pt-0 pb-8 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                  <span className="text-brand-coral">Vantagens</span> <span className="text-white">Exclusivas</span>
                </h2>
                <p className="text-gray-400 mb-8 text-lg">
                  Mais que um simples catálogo, oferecemos uma experiência completa 
                  de seleção e aplicação de papel de parede.
                </p>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-brand-coral flex-shrink-0" />
                      <span className="text-white">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
                <div className="text-center mb-6">
                  <Star className="w-12 h-12 text-brand-coral mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold mb-2 text-white">Serviço Completo</h3>
                  <p className="text-gray-400">
                    Da seleção à aplicação, cuidamos de todo o processo
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Texturas disponíveis</span>
                    <span className="text-brand-coral font-semibold">Grande variedade</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Categorias</span>
                    <span className="text-brand-coral font-semibold">Múltiplas</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Aplicação incluída</span>
                    <span className="text-brand-coral font-semibold">Sim</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Garantia</span>
                    <span className="text-brand-coral font-semibold">2 anos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Orçamento Personalizado */}
      <section className="py-16 bg-gray-900/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                <span className="text-brand-coral">Orçamento</span> <span className="text-white">Personalizado</span>
              </h2>
              <p className="text-gray-400 text-lg">
                Escolha entre Adobe Stock ou envie sua própria imagem
              </p>
            </div>

            {/* Formulário de Orçamento - Largura Total */}
            <Card className="bg-black/50 border-gray-800 mb-8">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="largura" className="text-white">Largura (metros)</Label>
                        <Input
                          id="largura"
                          type="number"
                          step="0.1"
                          placeholder="Ex: 3.5"
                          value={formData.largura}
                          onChange={(e) => setFormData({...formData, largura: e.target.value})}
                          className="bg-gray-900 border-gray-700 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="altura" className="text-white">Altura (metros)</Label>
                        <Input
                          id="altura"
                          type="number"
                          step="0.1"
                          placeholder="Ex: 2.5"
                          value={formData.altura}
                          onChange={(e) => setFormData({...formData, altura: e.target.value})}
                          className="bg-gray-900 border-gray-700 text-white"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="quantidade" className="text-white">Quantidade de Paredes</Label>
                      <Input
                        id="quantidade"
                        type="number"
                        min="1"
                        value={formData.quantidade}
                        onChange={(e) => setFormData({...formData, quantidade: e.target.value})}
                        className="bg-gray-900 border-gray-700 text-white"
                        required
                      />
                    </div>

                    <div>
                      <Label className="text-white">Opção de Imagem</Label>
                      <div className="flex gap-4 mt-2">
                        <label className="flex items-center text-white">
                          <input
                            type="radio"
                            name="opcaoImagem"
                            value="adobe-stock"
                            checked={formData.opcaoImagem === 'adobe-stock'}
                            onChange={(e) => setFormData({...formData, opcaoImagem: e.target.value})}
                            className="mr-2"
                          />
                          Adobe Stock
                        </label>
                        <label className="flex items-center text-white">
                          <input
                            type="radio"
                            name="opcaoImagem"
                            value="propria"
                            checked={formData.opcaoImagem === 'propria'}
                            onChange={(e) => setFormData({...formData, opcaoImagem: e.target.value})}
                            className="mr-2"
                          />
                          Imagem Própria
                        </label>
                      </div>
                    </div>

                    {formData.opcaoImagem === 'adobe-stock' ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="codigoAdobeStock" className="text-white">Código Adobe Stock (se disponível)</Label>
                          <Input
                            id="codigoAdobeStock"
                            placeholder="Ex: 123456789"
                            value={formData.codigoAdobeStock}
                            onChange={(e) => setFormData({...formData, codigoAdobeStock: e.target.value})}
                            className="bg-gray-900 border-gray-700 text-white"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="linkImagemAdobe" className="text-white">Link da imagem Adobe Stock (se disponível)</Label>
                          <Input
                            id="linkImagemAdobe"
                            type="url"
                            placeholder="https://stock.adobe.com/..."
                            value={formData.linkImagemAdobe}
                            onChange={(e) => setFormData({...formData, linkImagemAdobe: e.target.value})}
                            className="bg-gray-900 border-gray-700 text-white"
                          />
                        </div>

                        <div>
                          <Label htmlFor="informacoesImagemAdobe" className="text-white">Informações da imagem (título, autor, etc.)</Label>
                          <Textarea
                            id="informacoesImagemAdobe"
                            placeholder="Ex: Título da imagem, nome do autor, palavras-chave..."
                            value={formData.informacoesImagemAdobe}
                            onChange={(e) => setFormData({...formData, informacoesImagemAdobe: e.target.value})}
                            className="bg-gray-900 border-gray-700 text-white"
                          />
                        </div>

                        <div>
                          <Label htmlFor="descricaoImagem" className="text-white">Descrição adicional (opcional)</Label>
                          <Textarea
                            id="descricaoImagem"
                            placeholder="Ex: Preferências de cores, estilo, detalhes específicos..."
                            value={formData.descricaoImagem}
                            onChange={(e) => setFormData({...formData, descricaoImagem: e.target.value})}
                            className="bg-gray-900 border-gray-700 text-white"
                          />
                        </div>

                        <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
                          <p className="text-blue-300 text-sm">
                            💡 <strong>Dica:</strong> Forneça pelo menos um dos seguintes: código da imagem, link direto ou informações detalhadas (título + autor). Isto permite-nos localizar e fazer o download da imagem correta.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Label htmlFor="descricaoImagem" className="text-white">Descrição da sua imagem</Label>
                        <Textarea
                          id="descricaoImagem"
                          placeholder="Ex: Logo da empresa, foto de família, imagem específica..."
                          value={formData.descricaoImagem}
                          onChange={(e) => setFormData({...formData, descricaoImagem: e.target.value})}
                          className="bg-gray-900 border-gray-700 text-white"
                          required
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="nome" className="text-white">Nome</Label>
                        <Input
                          id="nome"
                          value={formData.nome}
                          onChange={(e) => setFormData({...formData, nome: e.target.value})}
                          className="bg-gray-900 border-gray-700 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-white">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="bg-gray-900 border-gray-700 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="telefone" className="text-white">Telefone</Label>
                        <Input
                          id="telefone"
                          value={formData.telefone}
                          onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                          className="bg-gray-900 border-gray-700 text-white"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="mensagem" className="text-white">Mensagem Adicional</Label>
                      <Textarea
                        id="mensagem"
                        placeholder="Detalhes adicionais sobre o projeto..."
                        value={formData.mensagem}
                        onChange={(e) => setFormData({...formData, mensagem: e.target.value})}
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </div>

                    <Button type="submit" className="w-full bg-gradient-to-r from-brand-coral to-brand-yellow text-white">
                      <Calculator className="w-4 h-4 mr-2" />
                      Solicitar Orçamento
                    </Button>
                </form>
              </CardContent>
            </Card>

            {/* Opções Rápidas - Lado a Lado */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-black/50 border-gray-800 hover:border-brand-turquoise transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <ShoppingCart className="w-12 h-12 text-brand-turquoise mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3 text-white">Loja Online</h3>
                  <p className="text-gray-400 mb-4">
                    Explore nossa seção de texturas na loja online
                  </p>
                  <Button asChild className="bg-brand-turquoise text-black hover:bg-brand-turquoise/80">
                    <Link href="/loja">
                      Ver Texturas na Loja
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-gray-800 hover:border-brand-coral transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <Upload className="w-12 h-12 text-brand-coral mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3 text-white">Envio de Imagens</h3>
                  <p className="text-gray-400 mb-4">
                    Se escolheu "Imagem Própria", pode enviar após o orçamento
                  </p>
                  <Button asChild variant="outline" className="border-brand-coral text-brand-coral hover:bg-brand-coral hover:text-white">
                    <a href="https://wa.me/351930682725?text=Olá!%20Quero%20enviar%20uma%20imagem%20para%20papel%20de%20parede" target="_blank">
                      Enviar via WhatsApp
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <ServiceGallery images={galleryImages} />

      {/* CTA Section */}
      <section className="pt-0 pb-8 bg-gradient-to-r from-brand-coral/10 via-brand-yellow/10 to-brand-turquoise/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            <span className="text-white">Pronto para Transformar o Seu</span> <span className="text-brand-coral">Espaço?</span>
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Explore o nosso catálogo interativo e descubra milhares de possibilidades 
            para decorar as suas paredes com estilo e personalidade.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-gradient-to-r from-brand-coral to-brand-yellow text-white font-bold px-8 py-6 text-lg">
              <Link href="/contactos#formulario">
                Agendar Consulta
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-brand-turquoise text-brand-turquoise hover:bg-brand-turquoise hover:text-black px-8 py-6 text-lg">
              <a href="https://wa.me/351930682725?text=Olá!%20Interessado%20em%20papel%20de%20parede." target="_blank" rel="noopener noreferrer">
                WhatsApp Direto
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}