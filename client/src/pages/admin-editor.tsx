import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/navigation";
import { 
  ArrowLeft, Edit3, Eye, Save, Undo, Redo, Plus, Trash2, 
  Image, Type, Layout, Palette, Upload, Download, Monitor,
  Move, Copy, Settings, RefreshCw, Pencil, Code
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { VisualEditorProvider, VisualEditorToolbar, EditableElement, InlineTextEditor } from "@/components/visual-editor";
import { useAuth } from "@/hooks/useAuth";
import DynamicSlider from "@/components/DynamicSlider";
import ServicesSection from "@/components/services-section";
import PortfolioSection from "@/components/portfolio-section";
import NewsSection from "@/components/news-section";
import ClientLogos from "@/components/ClientLogos";
import Footer from "@/components/footer";

interface Block {
  id: string;
  type: 'hero' | 'text' | 'image' | 'gallery' | 'grid' | 'cta' | 'separator' | 'section';
  content: any;
  styles: {
    backgroundColor?: string;
    textColor?: string;
    padding?: string;
    margin?: string;
    fontSize?: string;
    fontWeight?: string;
    textAlign?: 'left' | 'center' | 'right';
    width?: string;
  };
  position: number;
}

interface PageContent {
  id: string;
  route: string;
  title: string;
  blocks: Block[];
  metadata: {
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string;
  };
  version: number;
  status: 'draft' | 'published';
  updatedAt: string;
}

const blockTypes = [
  { value: 'hero', label: 'Hero Banner', icon: Layout },
  { value: 'text', label: 'Texto', icon: Type },
  { value: 'image', label: 'Imagem', icon: Image },
  { value: 'gallery', label: 'Galeria', icon: Image },
  { value: 'grid', label: 'Grid Cards', icon: Layout },
  { value: 'cta', label: 'Botão/CTA', icon: Plus },
  { value: 'separator', label: 'Separador', icon: Separator },
  { value: 'section', label: 'Secção', icon: Layout },
];

const availablePages = [
  { route: '/', title: 'Página Inicial', component: 'home' },
  { route: '/sobre', title: 'Sobre Nós', component: 'sobre' },
  { route: '/servicos', title: 'Serviços', component: 'servicos' },
  { route: '/portfolio', title: 'Portfólio', component: 'portfolio' },
  { route: '/contactos', title: 'Contactos', component: 'contactos' },
  { route: '/loja', title: 'Loja Online', component: 'loja' },
];

// Componente para renderizar página com edição visual
function VisualPageEditor({ pageRoute }: { pageRoute: string }) {
  const renderPageContent = () => {
    switch (pageRoute) {
      case '/':
        return (
          <div className="bg-[#0a0a0a]">
            <Navigation />
            
            {/* Hero Slider - Editável */}
            <EditableElement id="home-slider" className="relative">
              <DynamicSlider />
            </EditableElement>

            {/* Services Section - Editável */}
            <EditableElement id="home-services" className="py-16">
              <div className="container mx-auto px-4">
                <EditableElement id="services-title" tag="h2" className="text-4xl font-bold text-center mb-4">
                  <InlineTextEditor
                    elementId="services-title"
                    initialText="Os Nossos Serviços"
                    className="text-[#FFD700]"
                  />
                </EditableElement>
                <EditableElement id="services-subtitle" tag="div" className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
                  <InlineTextEditor
                    elementId="services-subtitle"
                    initialText="Soluções completas de comunicação visual e impressão digital"
                    multiline={true}
                  />
                </EditableElement>
                <ServicesSection />
              </div>
            </EditableElement>

            {/* Portfolio Section */}
            <EditableElement id="home-portfolio" className="py-16 bg-[#111111]">
              <div className="container mx-auto px-4">
                <EditableElement id="portfolio-title" tag="h2" className="text-4xl font-bold text-center mb-4">
                  <InlineTextEditor
                    elementId="portfolio-title"
                    initialText="Portfólio"
                    className="text-[#FFD700]"
                  />
                </EditableElement>
                <EditableElement id="portfolio-subtitle" tag="div" className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
                  <InlineTextEditor
                    elementId="portfolio-subtitle"
                    initialText="Veja alguns dos nossos trabalhos recentes"
                    multiline={true}
                  />
                </EditableElement>
                <PortfolioSection />
              </div>
            </EditableElement>

            {/* News Section */}
            <EditableElement id="home-news" className="py-16">
              <div className="container mx-auto px-4">
                <EditableElement id="news-title" tag="h2" className="text-4xl font-bold text-center mb-4">
                  <InlineTextEditor
                    elementId="news-title"
                    initialText="Notícias e Novidades"
                    className="text-[#FFD700]"
                  />
                </EditableElement>
                <EditableElement id="news-subtitle" tag="div" className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
                  <InlineTextEditor
                    elementId="news-subtitle"
                    initialText="Fique a par das últimas novidades"
                    multiline={true}
                  />
                </EditableElement>
                <NewsSection />
              </div>
            </EditableElement>

            {/* Client Logos */}
            <EditableElement id="home-clients" className="py-16 bg-[#111111]">
              <div className="container mx-auto px-4">
                <EditableElement id="clients-title" tag="h2" className="text-4xl font-bold text-center mb-12">
                  <InlineTextEditor
                    elementId="clients-title"
                    initialText="Clientes que Confiam em Nós"
                    className="text-[#FFD700]"
                  />
                </EditableElement>
                <ClientLogos />
              </div>
            </EditableElement>

            <Footer />
          </div>
        );

      case '/sobre':
        return (
          <div className="bg-[#0a0a0a] min-h-screen">
            <Navigation />
            <div className="container mx-auto px-4 py-24 mt-16">
              <EditableElement id="sobre-hero" className="text-center mb-16">
                <EditableElement id="sobre-title" tag="h1" className="text-5xl font-bold mb-6">
                  <InlineTextEditor
                    elementId="sobre-title"
                    initialText="Sobre a DOMREALCE"
                    className="text-[#FFD700]"
                  />
                </EditableElement>
                <EditableElement id="sobre-subtitle" tag="div" className="text-xl text-gray-300 max-w-3xl mx-auto">
                  <InlineTextEditor
                    elementId="sobre-subtitle"
                    initialText="40 anos de excelência em comunicação visual"
                    multiline={true}
                  />
                </EditableElement>
              </EditableElement>

              <EditableElement id="sobre-content" className="max-w-4xl mx-auto space-y-8">
                <EditableElement id="sobre-text-1" tag="div" className="text-gray-300 text-lg leading-relaxed">
                  <InlineTextEditor
                    elementId="sobre-text-1"
                    initialText="A DOMREALCE é uma empresa especializada em comunicação visual e impressão digital, com uma vasta experiência de 40 anos no mercado. Localizados em Lisboa, somos referência em soluções personalizadas de alta qualidade."
                    multiline={true}
                  />
                </EditableElement>
              </EditableElement>
            </div>
            <Footer />
          </div>
        );

      case '/servicos':
        return (
          <div className="bg-[#0a0a0a] min-h-screen">
            <Navigation />
            <div className="container mx-auto px-4 py-24 mt-16">
              <EditableElement id="servicos-hero" className="text-center mb-16">
                <EditableElement id="servicos-title" tag="h1" className="text-5xl font-bold mb-6">
                  <InlineTextEditor
                    elementId="servicos-title"
                    initialText="Os Nossos Serviços"
                    className="text-[#FFD700]"
                  />
                </EditableElement>
                <EditableElement id="servicos-subtitle" tag="div" className="text-xl text-gray-300 max-w-3xl mx-auto">
                  <InlineTextEditor
                    elementId="servicos-subtitle"
                    initialText="Soluções completas de comunicação visual para o seu negócio"
                    multiline={true}
                  />
                </EditableElement>
              </EditableElement>
              <ServicesSection />
            </div>
            <Footer />
          </div>
        );

      case '/portfolio':
        return (
          <div className="bg-[#0a0a0a] min-h-screen">
            <Navigation />
            <div className="container mx-auto px-4 py-24 mt-16">
              <EditableElement id="portfolio-hero" className="text-center mb-16">
                <EditableElement id="portfolio-page-title" tag="h1" className="text-5xl font-bold mb-6">
                  <InlineTextEditor
                    elementId="portfolio-page-title"
                    initialText="Portfólio"
                    className="text-[#FFD700]"
                  />
                </EditableElement>
                <EditableElement id="portfolio-page-subtitle" tag="div" className="text-xl text-gray-300 max-w-3xl mx-auto">
                  <InlineTextEditor
                    elementId="portfolio-page-subtitle"
                    initialText="Conheça os nossos projetos e trabalhos realizados"
                    multiline={true}
                  />
                </EditableElement>
              </EditableElement>
              <PortfolioSection />
            </div>
            <Footer />
          </div>
        );

      case '/contactos':
        return (
          <div className="bg-[#0a0a0a] min-h-screen">
            <Navigation />
            <div className="container mx-auto px-4 py-24 mt-16">
              <EditableElement id="contactos-hero" className="text-center mb-16">
                <EditableElement id="contactos-title" tag="h1" className="text-5xl font-bold mb-6">
                  <InlineTextEditor
                    elementId="contactos-title"
                    initialText="Contacte-nos"
                    className="text-[#FFD700]"
                  />
                </EditableElement>
                <EditableElement id="contactos-subtitle" tag="div" className="text-xl text-gray-300 max-w-3xl mx-auto">
                  <InlineTextEditor
                    elementId="contactos-subtitle"
                    initialText="Estamos prontos para dar vida aos seus projetos"
                    multiline={true}
                  />
                </EditableElement>
              </EditableElement>
            </div>
            <Footer />
          </div>
        );

      case '/loja':
        return (
          <div className="bg-[#0a0a0a] min-h-screen">
            <Navigation />
            <div className="container mx-auto px-4 py-24 mt-16">
              <EditableElement id="loja-hero" className="text-center mb-16">
                <EditableElement id="loja-title" tag="h1" className="text-5xl font-bold mb-6">
                  <InlineTextEditor
                    elementId="loja-title"
                    initialText="Loja Online"
                    className="text-[#FFD700]"
                  />
                </EditableElement>
                <EditableElement id="loja-subtitle" tag="div" className="text-xl text-gray-300 max-w-3xl mx-auto">
                  <InlineTextEditor
                    elementId="loja-subtitle"
                    initialText="Descubra os nossos produtos de comunicação visual"
                    multiline={true}
                  />
                </EditableElement>
              </EditableElement>
            </div>
            <Footer />
          </div>
        );

      default:
        return (
          <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
            <p className="text-gray-400">Selecione uma página para editar</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      {renderPageContent()}
    </div>
  );
}

export default function AdminEditor() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [selectedPage, setSelectedPage] = useState<string>('/');
  const [editMode, setEditMode] = useState<'visual' | 'blocks'>('visual');
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [history, setHistory] = useState<PageContent[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Acesso restrito",
        description: "É necessário fazer login para aceder ao editor administrativo.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFD700] mx-auto mb-4"></div>
          <p className="text-gray-300">A verificar autenticação...</p>
        </div>
      </div>
    );
  }

  // Show access denied if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#FFD700] mb-4">Acesso Restrito</h1>
          <p className="text-gray-300 mb-6">É necessário fazer login para aceder ao editor administrativo.</p>
          <Button 
            onClick={() => window.location.href = "/api/login"}
            className="bg-[#FFD700] text-black hover:bg-[#E6C200]"
          >
            Fazer Login
          </Button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (editMode === 'blocks') {
      loadPageContent();
    }
  }, [selectedPage, editMode]);

  const loadPageContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/editor/page${selectedPage === '/' ? '/index' : selectedPage}`);
      
      if (response.ok) {
        const data = await response.json();
        setPageContent(data);
        setHistory([data]);
        setHistoryIndex(0);
      } else {
        // Create new page if doesn't exist
        const newPage: PageContent = {
          id: crypto.randomUUID(),
          route: selectedPage,
          title: availablePages.find(p => p.route === selectedPage)?.title || 'Nova Página',
          blocks: [],
          metadata: {},
          version: 1,
          status: 'draft',
          updatedAt: new Date().toISOString()
        };
        setPageContent(newPage);
        setHistory([newPage]);
        setHistoryIndex(0);
      }
    } catch (error) {
      console.error('Error loading page:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar página",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const savePageContent = async (status: 'draft' | 'published' = 'draft') => {
    toast({
      title: "Modo Visual",
      description: "As alterações no modo visual são guardadas automaticamente no estado do editor.",
    });
  };

  return (
    <VisualEditorProvider>
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        {editMode === 'visual' && <VisualEditorToolbar />}
        
        {/* Header */}
        <div className="bg-[#111111] border-b border-[#333] fixed top-0 left-0 right-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <Link href="/admin">
                <Button variant="outline" size="sm" className="gap-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black" data-testid="button-back-dashboard">
                  <ArrowLeft className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setEditMode(editMode === 'visual' ? 'blocks' : 'visual')}
                  variant="outline"
                  size="sm"
                  className={`gap-2 ${editMode === 'visual' ? 'border-[#FFD700] text-[#FFD700]' : 'border-gray-500'}`}
                  data-testid="button-toggle-mode"
                >
                  {editMode === 'visual' ? <Pencil className="h-4 w-4" /> : <Code className="h-4 w-4" />}
                  {editMode === 'visual' ? 'Modo Visual' : 'Modo Blocos'}
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Edit3 className="h-6 w-6 text-[#FFD700]" />
                <h1 className="text-xl font-bold text-white">Editor {editMode === 'visual' ? 'Visual' : 'de Blocos'}</h1>
              </div>
              
              <Separator orientation="vertical" className="h-8 bg-[#444]" />
              
              <div className="flex items-center gap-2">
                <Label className="text-white text-sm">Página:</Label>
                <Select value={selectedPage} onValueChange={setSelectedPage}>
                  <SelectTrigger className="w-[200px] bg-[#222] border-[#444] text-white" data-testid="select-page">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#222] border-[#444]">
                    {availablePages.map((page) => (
                      <SelectItem 
                        key={page.route} 
                        value={page.route} 
                        className="text-white hover:bg-[#333]"
                        data-testid={`select-page-${page.component}`}
                      >
                        {page.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="pt-32">
          {editMode === 'visual' ? (
            <VisualPageEditor pageRoute={selectedPage} />
          ) : (
            <div className="container mx-auto px-4 py-8">
              <p className="text-gray-400 text-center">Modo de blocos em desenvolvimento. Use o Modo Visual para editar.</p>
            </div>
          )}
        </div>
      </div>
    </VisualEditorProvider>
  );
}
