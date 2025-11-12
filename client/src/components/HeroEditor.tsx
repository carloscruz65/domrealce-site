import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUploader from "@/components/ImageUploader";
import { Save, ArrowLeft, Image as ImageIcon, Type, Palette, Maximize2, Smartphone } from "lucide-react";
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

export default function HeroEditor({ serviceId, serviceName, onBack }: HeroEditorProps) {
  const [heroData, setHeroData] = useState<HeroData>({
    serviceId,
    title: "",
    backgroundImage: "",
  });
  const { toast } = useToast();

  // Load existing hero
  const { data, isLoading } = useQuery<HeroData>({
    queryKey: ['/api/service-heroes', serviceId],
  });

  // Initialize hero data when loaded
  useEffect(() => {
    if (data) {
      setHeroData(data);
    }
  }, [data]);

  // Save mutation
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
  };

  const handleSave = () => {
    if (!heroData.title.trim() || !heroData.backgroundImage.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Título e imagem de fundo são obrigatórios.",
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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
        <Button
          onClick={handleSave}
          disabled={saveMutation.isPending}
          data-testid="button-save"
        >
          <Save className="h-4 w-4 mr-2" />
          {saveMutation.isPending ? "A guardar..." : "Guardar Alterações"}
        </Button>
      </div>

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
                <Label htmlFor="title">
                  Título <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  value={heroData.title}
                  onChange={(e) => handleUpdateField("title", e.target.value)}
                  placeholder="Título principal do hero"
                  data-testid="input-title"
                  required
                />
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
              <ImageUploader
                label="Imagem de Fundo *"
                value={heroData.backgroundImage}
                onChange={(url) => handleUpdateField("backgroundImage", url)}
                folder="servicos"
              />
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

              <div className="p-4 border rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground mb-2">Preview de cores:</p>
                <div 
                  className="rounded p-6 flex items-center justify-center"
                  style={{
                    backgroundColor: heroData.backgroundColor || "#000000",
                    color: heroData.textColor || "#ffffff",
                  }}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">Título de Exemplo</div>
                    <div className="text-lg opacity-90">Subtítulo de exemplo</div>
                  </div>
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
                    ⚠️ IMPORTANTE: Use isto para garantir que a imagem tenha altura suficiente em mobile (ex: "600px", "70vh")
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
                    ⚠️ IMPORTANTE: Use "bottom" se o texto estiver cortado no topo da imagem
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-sm text-amber-900 dark:text-amber-100">
                  <strong>Dica:</strong> Deixe os campos vazios para usar os valores padrão responsivos. Preencha apenas se precisar de controle total para um serviço específico.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
