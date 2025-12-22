import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUploader from "@/components/ImageUploader";
import { Save, ArrowLeft, Image as ImageIcon, Type, Palette, Maximize2, Smartphone, Eye, Monitor, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface HeroData {
  id?: string;
  serviceId: string;
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  backgroundImage: string;
  backgroundColor?: string;
  textColor?: string;
  overlayOpacity?: string;
  height?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  mobileTitleSize?: string;
  mobileDescSize?: string;
  mobileBadgeSize?: string;
  mobileSpacing?: string;
  mobileButtonLabels?: {
    primary?: string;
    secondary?: string;
    portfolio?: string;
  };
  mobileHeight?: string;
  mobileContentAlign?: string;
}

interface HeroEditorProps {
  serviceId: string;
  serviceName: string;
  onBack?: () => void;
}

interface ValidationErrors {
  title?: string;
  backgroundImage?: string;
}

// Defaults para cada serviço quando não há dados na base de dados
const serviceDefaults: Record<string, Partial<HeroData>> = {
  'design-grafico': {
    title: 'Design Gráfico',
    subtitle: 'Identidade visual profissional',
    description: 'Criação de logótipos, materiais gráficos e branding completo para a sua marca.',
    badge: 'Criatividade',
    backgroundImage: '/public-objects/servicos/design-grafico.webp',
  },
  'impressao-digital': {
    title: 'Impressão Digital',
    subtitle: 'Qualidade superior em todos os formatos',
    description: 'Impressão de alta qualidade em diversos materiais e formatos.',
    badge: 'Qualidade',
    backgroundImage: '/public-objects/servicos/impressao-digital.webp',
  },
  'papel-parede': {
    title: 'Papel de Parede',
    subtitle: 'Transforme os seus espaços',
    description: 'Grande variedade de texturas e padrões em catálogo interativo.',
    badge: 'Decoração',
    backgroundImage: '/public-objects/servicos/papel-parede.webp',
  },
  'telas-artisticas': {
    title: 'Telas Artísticas',
    subtitle: 'Arte para as suas paredes',
    description: 'Transforme fotografias em obras de arte impressas em tela de alta qualidade.',
    badge: 'Arte',
    backgroundImage: '/public-objects/servicos/telas-artisticas.webp',
  },
  'autocolantes': {
    title: 'Autocolantes',
    subtitle: 'Personalização versátil',
    description: 'Autocolantes personalizados com corte de contorno para diversas aplicações.',
    badge: 'Versatilidade',
    backgroundImage: '/public-objects/servicos/autocolantes.webp',
  },
  'decoracao-viaturas': {
    title: 'Decoração de Viaturas',
    subtitle: 'Transforme a sua frota',
    description: 'Car wrapping e personalização de frotas para empresas e particulares.',
    badge: 'Mobilidade',
    backgroundImage: '/public-objects/servicos/decoracao-viaturas.webp',
  },
  'decoracao-viaturas-particulares': {
    title: 'Viaturas Particulares',
    subtitle: 'Personalização exclusiva',
    description: 'Trabalhos personalizados em viaturas particulares, avaliados individualmente.',
    badge: 'Particulares',
    backgroundImage: '/public-objects/servicos/decoracao-viaturas/particulares.webp',
  },
  'decoracao-viaturas-comerciais': {
    title: 'Veículos Comerciais',
    subtitle: 'Publicidade móvel',
    description: 'Rotulagem e publicidade móvel para empresas e frotas comerciais.',
    badge: 'Comercial',
    backgroundImage: '/public-objects/servicos/decoracao-viaturas/comerciais.webp',
  },
  'decoracao-viaturas-competicao': {
    title: 'Viaturas de Competição',
    subtitle: 'Design de alta performance',
    description: 'Decoração profissional para desportos motorizados e competição.',
    badge: 'Competição',
    backgroundImage: '/public-objects/servicos/decoracao-viaturas/competicao.webp',
  },
  'decoracao-viaturas-motos': {
    title: 'Motociclos',
    subtitle: 'Personalização de duas rodas',
    description: 'Personalização de depósitos, carenagens e acessórios para motociclos.',
    badge: 'Motos',
    backgroundImage: '/public-objects/servicos/decoracao-viaturas/motos.webp',
  },
  'decoracao-viaturas-camioes': {
    title: 'Camiões e Atrelados',
    subtitle: 'Grande formato',
    description: 'Rotulagem e identificação para transporte e logística.',
    badge: 'Transporte',
    backgroundImage: '/public-objects/servicos/decoracao-viaturas/camioes.webp',
  },
  'decoracao-viaturas-maquinas': {
    title: 'Máquinas Industriais',
    subtitle: 'Sinalização industrial',
    description: 'Identificação e sinalização de equipamentos industriais.',
    badge: 'Industrial',
    backgroundImage: '/public-objects/servicos/maquinas/hero.webp',
  },
  'espacos-comerciais': {
    title: 'Espaços Comerciais',
    subtitle: 'Sinalização profissional',
    description: 'Sinalização e decoração para negócios, lojas e escritórios.',
    badge: 'Negócio',
    backgroundImage: '/public-objects/servicos/espacos-comerciais.webp',
  },
  'peliculas-protecao-solar': {
    title: 'Películas de Proteção Solar',
    subtitle: 'Conforto e eficiência',
    description: 'Proteção UV e controlo térmico para vidros de edifícios e viaturas.',
    badge: 'Proteção',
    backgroundImage: '/public-objects/servicos/peliculas-solar-protecao.webp',
  },
};

function getDefaultHeroData(serviceId: string, serviceName: string): HeroData {
  const defaults = serviceDefaults[serviceId] || {};
  return {
    serviceId,
    title: defaults.title || serviceName,
    subtitle: defaults.subtitle || '',
    description: defaults.description || '',
    badge: defaults.badge || '',
    backgroundImage: defaults.backgroundImage || '/public-objects/servicos/default.webp',
    primaryCtaText: 'Falar connosco',
    primaryCtaHref: '/contacto',
    secondaryCtaText: 'Ver Portfolio',
    secondaryCtaHref: '/portfolio',
  };
}

interface ApiResponse {
  hero: HeroData | null;
  requestId: string;
}

export default function HeroEditor({ serviceId, serviceName, onBack }: HeroEditorProps) {
  const [heroData, setHeroData] = useState<HeroData>(() => getDefaultHeroData(serviceId, serviceName));
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [showPreview, setShowPreview] = useState(true);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const { toast } = useToast();

  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: ['/api/service-heroes', serviceId],
  });

  useEffect(() => {
    if (data?.hero) {
      // Merge dados da API com defaults
      setHeroData({ ...getDefaultHeroData(serviceId, serviceName), ...data.hero });
    } else if (data && !data.hero) {
      // Sem dados na API, usar defaults
      setHeroData(getDefaultHeroData(serviceId, serviceName));
    }
  }, [data, serviceId, serviceName]);

  const validateFields = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    if (!heroData.title.trim()) {
      newErrors.title = "Título é obrigatório";
    }
    
    if (!heroData.backgroundImage.trim()) {
      newErrors.backgroundImage = "Imagem de fundo é obrigatória";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveMutation = useMutation({
    mutationFn: async (updatedHero: HeroData) => {
      return await apiRequest(
        "PUT",
        `/api/admin/service-heroes/${serviceId}`,
        updatedHero
      );
    },
    onSuccess: () => {
      toast({
        title: "Hero guardado!",
        description: "As alterações foram guardadas com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/service-heroes', serviceId] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao guardar",
        description: "Não foi possível guardar as alterações.",
        variant: "destructive",
      });
      console.error("Error saving hero:", error);
    },
  });

  const handleUpdateField = (field: keyof HeroData, value: string) => {
    setHeroData({ ...heroData, [field]: value });
    if (errors[field as keyof ValidationErrors]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleSave = () => {
    if (!validateFields()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    saveMutation.mutate(heroData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">A carregar hero...</p>
        </div>
      </div>
    );
  }

  const LivePreview = () => {
    const isMobile = previewMode === "mobile";
    const containerWidth = isMobile ? "375px" : "100%";
    const containerHeight = isMobile 
      ? (heroData.mobileHeight || "400px") 
      : (heroData.height || "400px");
    
    const titleSize = isMobile 
      ? (heroData.mobileTitleSize || "1.5rem") 
      : "2.5rem";
    const descSize = isMobile 
      ? (heroData.mobileDescSize || "0.875rem") 
      : "1.125rem";
    const badgeSize = isMobile 
      ? (heroData.mobileBadgeSize || "0.75rem") 
      : "0.875rem";
    
    const contentAlign = isMobile 
      ? heroData.mobileContentAlign || "center" 
      : "center";
    
    const alignItemsClass = contentAlign === "top" 
      ? "items-start" 
      : contentAlign === "bottom" 
        ? "items-end" 
        : "items-center";
    
    const justifyClass = contentAlign === "top" 
      ? "justify-start pt-8" 
      : contentAlign === "bottom" 
        ? "justify-end pb-8" 
        : "justify-center";

    return (
      <div 
        className="relative overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/30"
        style={{ 
          width: containerWidth, 
          height: containerHeight,
          maxWidth: "100%",
          margin: isMobile ? "0 auto" : undefined,
        }}
      >
        {heroData.backgroundImage ? (
          <img 
            src={heroData.backgroundImage} 
            alt="Preview" 
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div 
            className="absolute inset-0" 
            style={{ backgroundColor: heroData.backgroundColor || "#000000" }}
          />
        )}
        
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: parseFloat(heroData.overlayOpacity || "0.5") }}
        />
        
        <div className={`relative z-10 h-full flex flex-col ${justifyClass} ${alignItemsClass} px-4 md:px-8`}>
          <div className="text-center max-w-2xl mx-auto">
            {heroData.badge && (
              <span 
                className="inline-block px-3 py-1 rounded-full bg-yellow-500 text-black font-medium mb-3"
                style={{ fontSize: badgeSize }}
              >
                {heroData.badge}
              </span>
            )}
            
            <h1 
              className="font-bold mb-2"
              style={{ 
                fontSize: titleSize, 
                color: heroData.textColor || "#ffffff",
                lineHeight: 1.2,
              }}
            >
              {heroData.title || "Título do Hero"}
            </h1>
            
            {heroData.subtitle && (
              <p 
                className="mb-2 opacity-90"
                style={{ 
                  fontSize: descSize, 
                  color: heroData.textColor || "#ffffff" 
                }}
              >
                {heroData.subtitle}
              </p>
            )}
            
            {heroData.description && (
              <p 
                className="mb-4 opacity-80"
                style={{ 
                  fontSize: descSize, 
                  color: heroData.textColor || "#ffffff" 
                }}
              >
                {heroData.description}
              </p>
            )}
            
            <div className="flex gap-2 justify-center flex-wrap">
              {heroData.primaryCtaText && (
                <button 
                  className="px-4 py-2 bg-yellow-500 text-black font-medium rounded hover:bg-yellow-400 transition-colors"
                  style={{ fontSize: isMobile ? "0.875rem" : "1rem" }}
                >
                  {isMobile && heroData.mobileButtonLabels?.primary 
                    ? heroData.mobileButtonLabels.primary 
                    : heroData.primaryCtaText}
                </button>
              )}
              {heroData.secondaryCtaText && (
                <button 
                  className="px-4 py-2 border border-white text-white font-medium rounded hover:bg-white/10 transition-colors"
                  style={{ fontSize: isMobile ? "0.875rem" : "1rem" }}
                >
                  {isMobile && heroData.mobileButtonLabels?.secondary 
                    ? heroData.mobileButtonLabels.secondary 
                    : heroData.secondaryCtaText}
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {isMobile ? "📱 Mobile Preview" : "🖥️ Desktop Preview"}
        </div>
      </div>
    );
  };

  const RequiredLabel = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => (
    <Label htmlFor={htmlFor} className="flex items-center gap-1">
      {children}
      <span className="text-destructive">*</span>
    </Label>
  );

  const FieldError = ({ message }: { message?: string }) => {
    if (!message) return null;
    return (
      <p className="text-sm text-destructive flex items-center gap-1 mt-1">
        <AlertCircle className="h-3 w-3" />
        {message}
      </p>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button
              variant="outline"
              size="icon"
              onClick={onBack}
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <h2 className="text-2xl font-bold" data-testid="text-service-title">
              Hero Section: {serviceName}
            </h2>
            <p className="text-sm text-muted-foreground">
              ID do serviço: <code className="bg-muted px-2 py-1 rounded">{serviceId}</code>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            data-testid="button-toggle-preview"
          >
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? "Ocultar Preview" : "Mostrar Preview"}
          </Button>
          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            data-testid="button-save"
          >
            <Save className="h-4 w-4 mr-2" />
            {saveMutation.isPending ? "A guardar..." : "Guardar Alterações"}
          </Button>
        </div>
      </div>

      {showPreview && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Preview em Tempo Real
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  variant={previewMode === "desktop" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewMode("desktop")}
                  data-testid="button-preview-desktop"
                >
                  <Monitor className="h-4 w-4 mr-1" />
                  Desktop
                </Button>
                <Button
                  variant={previewMode === "mobile" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewMode("mobile")}
                  data-testid="button-preview-mobile"
                >
                  <Smartphone className="h-4 w-4 mr-1" />
                  Mobile
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <LivePreview />
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="content" data-testid="tab-content">
            <Type className="h-4 w-4 mr-2" />
            Conteúdo
          </TabsTrigger>
          <TabsTrigger value="image" data-testid="tab-image">
            <ImageIcon className="h-4 w-4 mr-2" />
            Imagem
          </TabsTrigger>
          <TabsTrigger value="colors" data-testid="tab-colors">
            <Palette className="h-4 w-4 mr-2" />
            Cores
          </TabsTrigger>
          <TabsTrigger value="layout" data-testid="tab-layout">
            <Maximize2 className="h-4 w-4 mr-2" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="mobile" data-testid="tab-mobile">
            <Smartphone className="h-4 w-4 mr-2" />
            Mobile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Textos do Hero</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="badge">Badge (opcional)</Label>
                <Input
                  id="badge"
                  value={heroData.badge || ""}
                  onChange={(e) => handleUpdateField("badge", e.target.value)}
                  placeholder="Ex: Novo Serviço"
                  data-testid="input-badge"
                />
              </div>

              <div className="space-y-2">
                <RequiredLabel htmlFor="title">Título</RequiredLabel>
                <Input
                  id="title"
                  value={heroData.title}
                  onChange={(e) => handleUpdateField("title", e.target.value)}
                  placeholder="Título principal do hero"
                  data-testid="input-title"
                  className={errors.title ? "border-destructive" : ""}
                />
                <FieldError message={errors.title} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtítulo (opcional)</Label>
                <Input
                  id="subtitle"
                  value={heroData.subtitle || ""}
                  onChange={(e) => handleUpdateField("subtitle", e.target.value)}
                  placeholder="Subtítulo do hero"
                  data-testid="input-subtitle"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  value={heroData.description || ""}
                  onChange={(e) => handleUpdateField("description", e.target.value)}
                  placeholder="Descrição detalhada"
                  rows={4}
                  data-testid="input-description"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryCtaText">Texto Botão Primário</Label>
                  <Input
                    id="primaryCtaText"
                    value={heroData.primaryCtaText || ""}
                    onChange={(e) => handleUpdateField("primaryCtaText", e.target.value)}
                    placeholder="Ex: Pedir Orçamento"
                    data-testid="input-primary-cta-text"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primaryCtaHref">Link Botão Primário</Label>
                  <Input
                    id="primaryCtaHref"
                    value={heroData.primaryCtaHref || ""}
                    onChange={(e) => handleUpdateField("primaryCtaHref", e.target.value)}
                    placeholder="/contactos"
                    data-testid="input-primary-cta-href"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="secondaryCtaText">Texto Botão Secundário</Label>
                  <Input
                    id="secondaryCtaText"
                    value={heroData.secondaryCtaText || ""}
                    onChange={(e) => handleUpdateField("secondaryCtaText", e.target.value)}
                    placeholder="Ex: Ver Galeria"
                    data-testid="input-secondary-cta-text"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryCtaHref">Link Botão Secundário</Label>
                  <Input
                    id="secondaryCtaHref"
                    value={heroData.secondaryCtaHref || ""}
                    onChange={(e) => handleUpdateField("secondaryCtaHref", e.target.value)}
                    placeholder="/portfolio"
                    data-testid="input-secondary-cta-href"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="image" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Imagem de Fundo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={errors.backgroundImage ? "border border-destructive rounded-lg p-4" : ""}>
                <ImageUploader
                  label="Imagem de Fundo *"
                  value={heroData.backgroundImage}
                  onChange={(url) => handleUpdateField("backgroundImage", url)}
                  folder="servicos"
                />
                <FieldError message={errors.backgroundImage} />
              </div>
              {heroData.backgroundImage && (
                <div className="border rounded-lg overflow-hidden bg-muted">
                  <img 
                    src={heroData.backgroundImage} 
                    alt="Preview do hero" 
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/1200x400?text=Erro+ao+carregar+imagem";
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="colors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cores e Overlay</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backgroundColor">Cor de Fundo (Fallback)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={heroData.backgroundColor || "#000000"}
                      onChange={(e) => handleUpdateField("backgroundColor", e.target.value)}
                      className="w-20 h-10"
                      data-testid="input-bg-color"
                    />
                    <Input
                      value={heroData.backgroundColor || "#000000"}
                      onChange={(e) => handleUpdateField("backgroundColor", e.target.value)}
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="textColor">Cor do Texto</Label>
                  <div className="flex gap-2">
                    <Input
                      id="textColor"
                      type="color"
                      value={heroData.textColor || "#ffffff"}
                      onChange={(e) => handleUpdateField("textColor", e.target.value)}
                      className="w-20 h-10"
                      data-testid="input-text-color"
                    />
                    <Input
                      value={heroData.textColor || "#ffffff"}
                      onChange={(e) => handleUpdateField("textColor", e.target.value)}
                      placeholder="#ffffff"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="overlayOpacity">Opacidade Overlay (0-1)</Label>
                  <Input
                    id="overlayOpacity"
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={heroData.overlayOpacity || "0.5"}
                    onChange={(e) => handleUpdateField("overlayOpacity", e.target.value)}
                    placeholder="0.5"
                    data-testid="input-overlay-opacity"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Layout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="height">Altura (CSS)</Label>
                <Input
                  id="height"
                  value={heroData.height || ""}
                  onChange={(e) => handleUpdateField("height", e.target.value)}
                  placeholder="Ex: 500px, 60vh, 100%"
                  data-testid="input-height"
                />
                <p className="text-xs text-muted-foreground">
                  Valores válidos: px, vh, %, rem. Deixe vazio para usar o padrão.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mobile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Responsividade Mobile (320px-375px)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>Controle total da responsividade mobile!</strong> Ajuste tamanhos de fonte e espaçamentos para garantir que todo o conteúdo cabe em ecrãs pequenos (320px-375px).
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mobileTitleSize">Tamanho Título Mobile</Label>
                  <Input
                    id="mobileTitleSize"
                    value={heroData.mobileTitleSize || ""}
                    onChange={(e) => handleUpdateField("mobileTitleSize", e.target.value)}
                    placeholder="Ex: 1rem, 0.9rem"
                    data-testid="input-mobile-title-size"
                  />
                  <p className="text-xs text-muted-foreground">
                    Padrão: clamp(1rem, 3.5vw, 3.5rem)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobileDescSize">Tamanho Descrição Mobile</Label>
                  <Input
                    id="mobileDescSize"
                    value={heroData.mobileDescSize || ""}
                    onChange={(e) => handleUpdateField("mobileDescSize", e.target.value)}
                    placeholder="Ex: 0.625rem, 0.7rem"
                    data-testid="input-mobile-desc-size"
                  />
                  <p className="text-xs text-muted-foreground">
                    Padrão: clamp(0.625rem, 1.75vw, 1.125rem)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobileBadgeSize">Tamanho Badge Mobile</Label>
                  <Input
                    id="mobileBadgeSize"
                    value={heroData.mobileBadgeSize || ""}
                    onChange={(e) => handleUpdateField("mobileBadgeSize", e.target.value)}
                    placeholder="Ex: 0.5rem, 0.6rem"
                    data-testid="input-mobile-badge-size"
                  />
                  <p className="text-xs text-muted-foreground">
                    Padrão: clamp(0.5rem, 1.5vw, 0.875rem)
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobileSpacing">Espaçamento Mobile</Label>
                <select
                  id="mobileSpacing"
                  value={heroData.mobileSpacing || "compact"}
                  onChange={(e) => handleUpdateField("mobileSpacing", e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  data-testid="select-mobile-spacing"
                >
                  <option value="compact">Compacto (mb-0.5, mb-1)</option>
                  <option value="normal">Normal (mb-2, mb-4)</option>
                </select>
                <p className="text-xs text-muted-foreground">
                  Compacto reduz margens entre elementos para economizar espaço vertical
                </p>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-semibold">Labels dos Botões em Mobile</Label>
                <p className="text-sm text-muted-foreground -mt-2">
                  Use textos curtos para botões em mobile (ex: "Projeto" em vez de "Iniciar Meu Projeto")
                </p>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mobilePrimaryLabel">Botão Primário</Label>
                    <Input
                      id="mobilePrimaryLabel"
                      value={heroData.mobileButtonLabels?.primary || ""}
                      onChange={(e) => {
                        const labels = { ...heroData.mobileButtonLabels, primary: e.target.value };
                        setHeroData({ ...heroData, mobileButtonLabels: labels });
                      }}
                      placeholder="Ex: Projeto"
                      data-testid="input-mobile-primary-label"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobileSecondaryLabel">Botão Secundário</Label>
                    <Input
                      id="mobileSecondaryLabel"
                      value={heroData.mobileButtonLabels?.secondary || ""}
                      onChange={(e) => {
                        const labels = { ...heroData.mobileButtonLabels, secondary: e.target.value };
                        setHeroData({ ...heroData, mobileButtonLabels: labels });
                      }}
                      placeholder="Ex: Contactar"
                      data-testid="input-mobile-secondary-label"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobilePortfolioLabel">Botão Portfolio</Label>
                    <Input
                      id="mobilePortfolioLabel"
                      value={heroData.mobileButtonLabels?.portfolio || ""}
                      onChange={(e) => {
                        const labels = { ...heroData.mobileButtonLabels, portfolio: e.target.value };
                        setHeroData({ ...heroData, mobileButtonLabels: labels });
                      }}
                      placeholder="Ex: Portfolio"
                      data-testid="input-mobile-portfolio-label"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="mobileHeight">Altura Mínima em Mobile</Label>
                  <Input
                    id="mobileHeight"
                    value={heroData.mobileHeight || ""}
                    onChange={(e) => handleUpdateField("mobileHeight", e.target.value)}
                    placeholder="Ex: 500px, 60vh, 100%"
                    data-testid="input-mobile-height"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use isto para garantir que a imagem tenha altura suficiente em mobile (ex: "600px", "70vh")
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobileContentAlign">Alinhamento Vertical do Conteúdo</Label>
                  <select
                    id="mobileContentAlign"
                    value={heroData.mobileContentAlign || "center"}
                    onChange={(e) => handleUpdateField("mobileContentAlign", e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    data-testid="select-mobile-content-align"
                  >
                    <option value="top">Topo (items-start)</option>
                    <option value="center">Centro (items-center)</option>
                    <option value="bottom">Baixo (items-end)</option>
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Use "bottom" se o texto estiver cortado no topo da imagem
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
