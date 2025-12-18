import { useState, useEffect } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Share2, Facebook, Instagram, Linkedin, Search, Filter, Eye, Heart, MessageCircle, Play, ArrowRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";

// Dados das notícias (em produção viria de uma base de dados)
const noticias = [
  {
    id: 2,
    titulo: "🎬 Nova Demonstração Interativa - Conheça a DOMREALCE numa Jornada Guiada!",
    resumo: "Descubra tudo sobre a DOMREALCE numa experiência interativa única! Explore nossos produtos, serviços, portfólio e simule uma compra completa numa apresentação envolvente.",
    conteudo: "🌟 APRESENTAMOS A DEMONSTRAÇÃO INTERATIVA MAIS COMPLETA DO SETOR!\n\nQuer conhecer tudo sobre a DOMREALCE de forma divertida e envolvente? A nossa nova demonstração interativa é como um vídeo de apresentação, mas melhor - você controla o ritmo!\n\n🎯 O QUE VAI DESCOBRIR:\n\n🛍️ LOJA ONLINE EM AÇÃO\n• Veja os nossos produtos em destaque\n• Características detalhadas e diferenciais\n• Preços transparentes e qualidade garantida\n• Calculadora automática para papel de parede\n\n🎨 SERVIÇOS ESPECIALIZADOS\n• Design Gráfico profissional\n• Impressão Digital de alta qualidade  \n• Papel de Parede com instalação\n• Decoração de Viaturas personalizada\n\n📸 PORTFÓLIO IMPRESSIONANTE\n• Mais de 100 projetos realizados\n• Galeria interativa de trabalhos\n• Antes e depois dos nossos projetos\n• Inspiração para o seu próximo trabalho\n\n💳 SIMULAÇÃO DE COMPRA REALISTA\n• Processo de compra passo a passo\n• Opções de pagamento portuguesas (MB WAY, Multibanco, Payshop)\n• Informações de entrega e instalação\n• Experiência de compra simplificada\n\n🌐 REDES SOCIAIS INTEGRADAS\n• Links diretos para Facebook, Instagram e LinkedIn\n• Botões de ação para contacto imediato\n• Convites para visitar a nossa loja online\n\n⚡ CONTROLOS INTERATIVOS\n• Botão play/pause como num vídeo\n• Navegação por passos\n• Barra de progresso visual\n• Avance no seu próprio ritmo\n\n🚀 COMO FUNCIONA?\n1. Visite /demo-interativo no nosso site\n2. Clique em 'Play' para começar a jornada\n3. Navegue pelos 6 passos da apresentação\n4. Pause quando quiser explorar mais\n5. Salte para qualquer secção que lhe interesse\n\n💡 PERFEITO PARA:\n✓ Novos clientes que querem conhecer-nos\n✓ Quem procura inspiração para projetos\n✓ Empresas interessadas nos nossos serviços\n✓ Qualquer pessoa curiosa sobre comunicação visual\n\n🎉 EXPERIMENTE AGORA!\nA demonstração está disponível 24/7 no nosso website. É grátis, rápida e vai mostrar-lhe porque somos líderes em comunicação visual!\n\n👑 DOMREALCE - Onde cada ideia ganha vida!",
    categoria: "Funcionalidades",
    imagem: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    data: "2025-09-03",
    autor: "Equipa Digital DOMREALCE",
    tags: ["demo-interativo", "experiência-digital", "produtos", "serviços", "inovação"],
    visualizacoes: 1,
    likes: 0,
    comentarios: 0
  },
  {
    id: 1,
    titulo: "🚀 DOMREALCE Digital: A Revolução na Comunicação Visual Portuguesa Chegou!",
    resumo: "Descobra a nova era da comunicação visual com a nossa plataforma digital revolucionária. Design profissional, tecnologia de ponta e a qualidade DOMREALCE que conhece - tudo num só lugar, à distância de um clique.",
    conteudo: "⭐ A NOVA ERA DA COMUNICAÇÃO VISUAL PORTUGUESA ESTÁ AQUI!\n\nApós meses de desenvolvimento intensivo, apresentamos com imenso orgulho www.domrealce.com - não é apenas um website, é uma revolução digital que vai transformar a forma como pensa em comunicação visual!\n\n🎨 EXPLORE UM UNIVERSO DE POSSIBILIDADES\n• Portfolio Interativo com mais de 200 projetos exclusivos organizados por categorias\n• Galeria HD com antes/depois dos nossos trabalhos mais impactantes\n• Estudos de caso detalhados de campanhas que marcaram a diferença\n• Inspiração sem limites para o seu próximo projeto\n\n🛒 LOJA ONLINE INTELIGENTE - PAPEL DE PAREDE PERSONALIZADO\n• Calculadora automática de medidas - nunca mais desperdice material!\n• Simulador de acabamentos em tempo real\n• Sistema de orçamento instantâneo com preços transparentes\n• Guias de aplicação profissionais incluídos\n\n💳 PAGAMENTOS 100% PORTUGUESES SEGUROS\n• MB WAY instantâneo\n• Multibanco tradicional\n• Confirmações automáticas por SMS e email\n\n📱 EXPERIÊNCIA PREMIUM EM QUALQUER DISPOSITIVO\n• Design responsivo de última geração\n• Navegação intuitiva e carregamento ultra-rápido\n• Formulários inteligentes com upload direto de ficheiros\n• Sistema de orçamentos online com resposta em 24h\n\n🏆 QUALIDADE DOMREALCE, AGORA DIGITAL\nMais de 15 anos de experiência em comunicação visual, agora potenciados pela tecnologia mais avançada. Cada detalhe foi pensado para proporcionar uma experiência única e profissional.\n\n🎯 PORQUE É QUE DEVE VISITAR AGORA?\n✓ Descontos exclusivos de lançamento até 31 de Agosto\n✓ Orçamentos gratuitos e sem compromisso\n✓ Inspiração ilimitada para os seus projetos\n✓ Acesso prioritário a novos serviços\n✓ Suporte técnico especializado incluído\n\n🌟 NÃO PERCA ESTA OPORTUNIDADE ÚNICA!\nSeja um dos primeiros a descobrir o futuro da comunicação visual portuguesa. Visite www.domrealce.com e prepare-se para ficar surpreendido!\n\n👑 DOMREALCE Digital - Onde a Sua Visão Ganha Vida!",
    categoria: "Novidades DOMREALCE",
    imagem: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    data: "2025-08-22",
    autor: "Equipa DOMREALCE",
    tags: ["revolução-digital", "loja-exclusiva", "descontos-lançamento", "premium", "inovação-portuguesa"],
    visualizacoes: 1,
    likes: 0,
    comentarios: 0
  }
];

const categorias = ["Todas", "Funcionalidades", "Novidades DOMREALCE"];

export default function Noticias() {
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [noticiasFiltradas, setNoticiasFiltradas] = useState(noticias);

  // Filtrar notícias
  const filtrarNoticias = () => {
    let resultado = noticias;

    // Filtro por categoria
    if (filtroCategoria !== "Todas") {
      resultado = resultado.filter(noticia => noticia.categoria === filtroCategoria);
    }

    // Filtro por termo de pesquisa
    if (termoPesquisa) {
      resultado = resultado.filter(noticia => 
        noticia.titulo.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
        noticia.resumo.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
        noticia.tags.some(tag => tag.toLowerCase().includes(termoPesquisa.toLowerCase()))
      );
    }

    setNoticiasFiltradas(resultado);
  };

  // Partilhar nas redes sociais
  const partilharFacebook = (noticia: typeof noticias[0]) => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href + '#' + noticia.id)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const partilharInstagram = () => {
    // Instagram não permite partilha directa por URL, mostra instrução
    alert('Para partilhar no Instagram, tire uma captura de ecrã desta página e publique na sua conta @domrealce');
  };

  const partilharLinkedin = (noticia: typeof noticias[0]) => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href + '#' + noticia.id)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };



  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-PT', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  // Aplicar filtros quando mudarem
  useEffect(() => {
    filtrarNoticias();
  }, [filtroCategoria, termoPesquisa]);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-yellow/10 via-brand-turquoise/5 to-brand-coral/10 py-20 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">
              <span className="text-brand-yellow">Notícias</span> & <span className="text-brand-turquoise">Projectos</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
              Descubra os nossos trabalhos mais recentes, projetos históricos e as últimas tendências em comunicação visual
            </p>
          </div>
        </div>
      </section>

      {/* Filtros e Pesquisa */}
      <section className="pt-0 pb-4 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  placeholder="Pesquisar notícias..."
                  value={termoPesquisa}
                  onChange={(e) => setTermoPesquisa(e.target.value)}
                  className="pl-10 w-full sm:w-80"
                />
              </div>
              
              <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter size={16} className="mr-2" />
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria} value={categoria}>
                      {categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-muted-foreground">
              {noticiasFiltradas.length} {noticiasFiltradas.length === 1 ? 'resultado' : 'resultados'}
            </div>
          </div>
        </div>
      </section>

      {/* Destaque - Demonstração Interativa */}
      <section className="pt-0 pb-4">
        <div className="container mx-auto px-4">
          <div className="relative bg-gradient-to-r from-[#e84b5e] to-[#4dabf7] rounded-2xl p-8 mb-8 shadow-2xl">
            <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>
            <div className="relative z-10 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                🎬 Experimente Nossa Nova Demonstração Interativa!
              </h2>
              <p className="text-white/90 mb-6 text-lg">
                Descubra tudo sobre a DOMREALCE numa jornada guiada de 6 passos - como um vídeo que pode controlar!
              </p>
              <Link href="/demo-interativo">
                <Button className="bg-white text-[#e84b5e] hover:bg-gray-100 font-bold px-8 py-3 text-lg">
                  <Play className="h-5 w-5 mr-2" />
                  Ver Demonstração Agora
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lista de Notícias */}
      <section className="pt-0 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid gap-8">
            {noticiasFiltradas.map((noticia) => (
              <Card key={noticia.id} className="overflow-hidden hover-lift border-border bg-card">
                <div className="md:flex">
                  {/* Imagem */}
                  <div className="md:w-1/3">
                    <div className="aspect-video md:aspect-square bg-muted relative overflow-hidden">
                      <img 
                        src={noticia.imagem} 
                        alt={noticia.titulo}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-yellow/20 via-transparent to-brand-turquoise/20"></div>
                      {/* Badge de destaque */}
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-brand-coral text-white font-semibold">🔥 NOVO</Badge>
                      </div>
                    </div>
                  </div>
                  
                  {/* Conteúdo */}
                  <div className="md:w-2/3 p-6">
                    <CardHeader className="p-0 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="bg-brand-yellow/10 text-brand-yellow border-brand-yellow/20">
                          {noticia.categoria}
                        </Badge>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye size={14} />
                            {noticia.visualizacoes}
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart size={14} />
                            {noticia.likes}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle size={14} />
                            {noticia.comentarios}
                          </div>
                        </div>
                      </div>
                      
                      <CardTitle className="text-2xl mb-2 hover:text-brand-turquoise transition-colors cursor-pointer">
                        {noticia.titulo}
                      </CardTitle>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatarData(noticia.data)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          {noticia.autor}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-0">
                      <CardDescription className="text-base mb-4 leading-relaxed">
                        {noticia.resumo}
                      </CardDescription>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {noticia.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Acções */}
                      <div className="flex items-center justify-between">
                        <Button 
                          asChild
                          variant="outline" 
                          className="border-brand-coral text-brand-coral hover:bg-brand-coral hover:text-white font-semibold shadow-sm"
                        >
                          <Link href="/servicos">
                            🌟 Descobrir Agora
                          </Link>
                        </Button>
                        
                        {/* Partilha Social */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground mr-2">Partilhar:</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => partilharFacebook(noticia)}
                            className="text-blue-600 hover:bg-blue-600/10"
                          >
                            <Facebook size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={partilharInstagram}
                            className="text-pink-600 hover:bg-pink-600/10"
                          >
                            <Instagram size={16} />
                          </Button>
                          <Button
                            variant="ghost" 
                            size="sm"
                            onClick={() => partilharLinkedin(noticia)}
                            className="text-blue-700 hover:bg-blue-700/10"
                          >
                            <Linkedin size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigator.share?.({
                              title: noticia.titulo,
                              text: noticia.resumo,
                              url: window.location.href + '#' + noticia.id
                            })}
                            className="text-muted-foreground hover:bg-muted"
                          >
                            <Share2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Mensagem quando não há resultados */}
          {noticiasFiltradas.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-heading font-semibold mb-2">Nenhum resultado encontrado</h3>
              <p className="text-muted-foreground mb-6">
                Tente ajustar os filtros ou termo de pesquisa
              </p>
              <Button 
                onClick={() => {
                  setFiltroCategoria("Todas");
                  setTermoPesquisa("");
                }}
                className="bg-brand-yellow text-brand-dark hover:bg-brand-yellow/90"
              >
                Limpar Filtros
              </Button>
            </div>
          )}

          {/* Paginação (simulada) */}
          {noticiasFiltradas.length > 0 && (
            <div className="flex justify-center items-center gap-4 mt-16">
              <Button variant="outline" disabled>Anterior</Button>
              <div className="flex gap-2">
                <Button variant="default" className="bg-brand-yellow text-brand-dark">1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
              </div>
              <Button variant="outline">Próxima</Button>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">
            Tem um projeto em mente?
          </h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Vamos criar algo extraordinário juntos. Contacte-nos para discutir o seu próximo projeto.
          </p>
          <Button 
            size="lg" 
            className="bg-brand-turquoise text-white hover:bg-brand-turquoise/90"
            onClick={() => window.location.href = '/contactos#formulario'}
          >
            Pedir Orçamento
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}