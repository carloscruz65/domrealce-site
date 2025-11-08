import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProtectedAdminLayout from "@/components/ProtectedAdminLayout";
import MediaManager from "@/components/MediaManager";
import SliderManager from "@/components/SliderManager";
import ProdutosManager from "@/components/ProdutosManager";
import NoticiasManager from "@/components/NoticiasManager";
import PortfolioManager from "@/components/PortfolioManager";
import EncomendasManager from "@/components/EncomendasManager";
import PageEditor from "@/components/PageEditor";
import ServiceGalleryEditor from "@/components/ServiceGalleryEditor";
import HeroEditor from "@/components/HeroEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Settings, 
  Package, 
  FileText, 
  Image as ImageIcon, 
  FolderOpen,
  LogOut,
  Monitor,
  Users,
  Store,
  ShoppingCart,
  Briefcase
} from "lucide-react";

const serviceNames: Record<string, string> = {
  'design-grafico': 'Design Gráfico',
  'impressao-digital': 'Impressão Digital',
  'papel-parede': 'Papel de Parede',
  'telas-artisticas': 'Telas Artísticas',
  'autocolantes': 'Autocolantes',
  'decoracao-viaturas': 'Decoração de Viaturas',
  'espacos-comerciais': 'Espaços Comerciais'
};

function getServiceName(serviceId: string): string {
  return serviceNames[serviceId] || serviceId;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [serviceSubTab, setServiceSubTab] = useState<"gallery" | "hero">("gallery");

  const { data: authStatus } = useQuery<{ authenticated: boolean; user?: { name: string } }>({
    queryKey: ["/api/auth/status"],
  });

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <ProtectedAdminLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Painel Administrativo</h1>
                <p className="text-sm text-muted-foreground">
                  Bem-vindo, {authStatus?.user?.name || "Admin"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => window.location.href = "/"}>
                  <Monitor className="h-4 w-4 mr-2" />
                  Ver Site
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-9 mb-8">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="editor" className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="conteudos" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Slider
              </TabsTrigger>
              <TabsTrigger value="produtos" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Produtos
              </TabsTrigger>
              <TabsTrigger value="noticias" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Notícias
              </TabsTrigger>
              <TabsTrigger value="portfolio" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Portfolio
              </TabsTrigger>
              <TabsTrigger value="servicos" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Serviços
              </TabsTrigger>
              <TabsTrigger value="encomendas" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Encomendas
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                Media
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardCard
                  title="Slider Homepage"
                  description="Gere as imagens e textos do slider principal"
                  icon={Monitor}
                  onClick={() => setActiveTab("conteudos")}
                  color="text-[#FFD700]"
                />
                <DashboardCard
                  title="Produtos em Destaque"
                  description="Administre os produtos exibidos na homepage"
                  icon={Package}
                  onClick={() => setActiveTab("produtos")}
                  color="text-[#00d4aa]"
                />
                <DashboardCard
                  title="Notícias & Artigos"
                  description="Crie e edite notícias para o site"
                  icon={FileText}
                  onClick={() => setActiveTab("noticias")}
                  color="text-[#4dabf7]"
                />
                <DashboardCard
                  title="Portfolio"
                  description="Gerencie imagens do portfólio por categoria"
                  icon={ImageIcon}
                  onClick={() => setActiveTab("portfolio")}
                  color="text-[#ff6b35]"
                />
                <DashboardCard
                  title="Loja Online"
                  description="Administre produtos e texturas da loja"
                  icon={Store}
                  onClick={() => setActiveTab("produtos")}
                  color="text-pink-400"
                />
                <DashboardCard
                  title="Gestão de Media"
                  description="Upload e organização automática de imagens"
                  icon={FolderOpen}
                  onClick={() => setActiveTab("media")}
                  color="text-purple-400"
                />
                <DashboardCard
                  title="Galerias de Serviços"
                  description="Edite as galerias de imagens dos 7 serviços"
                  icon={Briefcase}
                  onClick={() => setActiveTab("servicos")}
                  color="text-orange-400"
                />
              </div>
            </TabsContent>

            {/* Conteúdos Tab */}
            <TabsContent value="conteudos">
              <SliderManager />
            </TabsContent>

            {/* Produtos Tab */}
            <TabsContent value="produtos">
              <ProdutosManager />
            </TabsContent>

            {/* Notícias Tab */}
            <TabsContent value="noticias">
              <NoticiasManager />
            </TabsContent>

            {/* Portfolio Tab */}
            <TabsContent value="portfolio">
              <PortfolioManager />
            </TabsContent>

            {/* Serviços Tab */}
            <TabsContent value="servicos">
              {selectedService ? (
                <div>
                  <Button 
                    variant="outline" 
                    className="mb-4" 
                    onClick={() => setSelectedService(null)}
                    data-testid="button-back-services"
                  >
                    ← Voltar à Lista de Serviços
                  </Button>
                  <Tabs value={serviceSubTab} onValueChange={(val) => setServiceSubTab(val as "gallery" | "hero")} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="gallery">Galeria de Imagens</TabsTrigger>
                      <TabsTrigger value="hero">Hero Section</TabsTrigger>
                    </TabsList>
                    <TabsContent value="gallery">
                      <ServiceGalleryEditor 
                        serviceId={selectedService} 
                        serviceName={getServiceName(selectedService)}
                        onBack={() => setSelectedService(null)}
                      />
                    </TabsContent>
                    <TabsContent value="hero">
                      <HeroEditor 
                        serviceId={selectedService} 
                        serviceName={getServiceName(selectedService)}
                        onBack={() => setSelectedService(null)}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <ServicesGalleryList onSelectService={setSelectedService} />
              )}
            </TabsContent>

            {/* Encomendas Tab */}
            <TabsContent value="encomendas">
              <EncomendasManager />
            </TabsContent>

            {/* Editor Tab */}
            <TabsContent value="editor">
              <PageEditor />
            </TabsContent>

            {/* Media Tab */}
            <TabsContent value="media">
              <MediaManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedAdminLayout>
  );
}

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  onClick: () => void;
  color: string;
}

function DashboardCard({ title, description, icon: Icon, onClick, color }: DashboardCardProps) {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all hover:scale-105" 
      onClick={onClick}
      data-testid={`card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <Icon className={`h-10 w-10 ${color}`} />
        </div>
        <CardTitle className="mt-4">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}

interface ServicesGalleryListProps {
  onSelectService: (serviceId: string) => void;
}

function ServicesGalleryList({ onSelectService }: ServicesGalleryListProps) {
  const services = [
    { id: 'design-grafico', name: 'Design Gráfico', description: 'Criação de identidade visual e materiais gráficos' },
    { id: 'impressao-digital', name: 'Impressão Digital', description: 'Impressão de alta qualidade em diversos materiais' },
    { id: 'papel-parede', name: 'Papel de Parede', description: 'Grande variedade de texturas em catálogo interativo' },
    { id: 'telas-artisticas', name: 'Telas Artísticas', description: 'Transforme fotografias em obras de arte' },
    { id: 'autocolantes', name: 'Autocolantes', description: 'Autocolantes personalizados com corte de contorno' },
    { id: 'decoracao-viaturas', name: 'Decoração de Viaturas', description: 'Car wrapping e personalização de frotas' },
    { id: 'espacos-comerciais', name: 'Espaços Comerciais', description: 'Sinalização e decoração para negócios' }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gestão de Serviços</h2>
      <p className="text-muted-foreground mb-8">
        Selecione um serviço para editar a galeria de imagens e hero section
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card 
            key={service.id}
            className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
            onClick={() => onSelectService(service.id)}
            data-testid={`card-service-${service.id}`}
          >
            <CardHeader>
              <CardTitle>{service.name}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" data-testid={`button-edit-${service.id}`}>
                Editar Galeria
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
