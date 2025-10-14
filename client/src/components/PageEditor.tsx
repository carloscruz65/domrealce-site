import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Save, Plus } from "lucide-react";

interface PageConfig {
  id: string;
  page: string;
  section: string;
  element: string;
  type: string;
  value: string;
  defaultValue?: string;
}

const PAGES = [
  { value: "home", label: "Página Inicial" },
  { value: "servicos", label: "Serviços" },
  { value: "contactos", label: "Contactos" },
  { value: "sobre", label: "Sobre Nós" },
];

const CONFIG_TYPES = [
  { value: "text", label: "Texto" },
  { value: "color", label: "Cor" },
  { value: "size", label: "Tamanho" },
  { value: "image", label: "Imagem (URL)" },
  { value: "number", label: "Número" },
];

export default function PageEditor() {
  const { toast } = useToast();
  const [selectedPage, setSelectedPage] = useState("home");
  const [adding, setAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<PageConfig>>({});

  const { data, isLoading } = useQuery<{ configs: PageConfig[] }>({
    queryKey: ['/api/admin/pages'],
  });
  
  const configs = data?.configs || [];

  const createMutation = useMutation({
    mutationFn: (data: Partial<PageConfig>) => apiRequest('/api/admin/pages', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pages'] });
      toast({ title: "Configuração criada!" });
      setFormData({});
      setAdding(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PageConfig> }) => 
      apiRequest(`/api/admin/pages/${id}`, 'PUT', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pages'] });
      toast({ title: "Configuração atualizada!" });
    },
  });

  const handleSaveConfig = (config: PageConfig, newValue: string) => {
    updateMutation.mutate({
      id: config.id,
      data: { ...config, value: newValue }
    });
  };

  const handleCreateConfig = () => {
    if (!formData.page || !formData.section || !formData.element || !formData.type || !formData.value) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }
    createMutation.mutate(formData);
  };

  const pageConfigs = configs?.filter(c => c.page === selectedPage) || [];
  
  // Group by section
  const groupedConfigs = pageConfigs.reduce((acc, config) => {
    if (!acc[config.section]) acc[config.section] = [];
    acc[config.section].push(config);
    return acc;
  }, {} as Record<string, PageConfig[]>);

  if (isLoading) return <div className="p-4">A carregar...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Editor Visual de Páginas</h2>
          <p className="text-muted-foreground">Editar textos, cores e espaçamentos</p>
        </div>
        <Button onClick={() => setAdding(!adding)} data-testid="button-add-config">
          <Plus className="mr-2 h-4 w-4" /> Nova Configuração
        </Button>
      </div>

      {adding && (
        <Card>
          <CardHeader>
            <CardTitle>Nova Configuração</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Página</Label>
                <Select value={formData.page} onValueChange={(v) => setFormData({ ...formData, page: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a página" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGES.map(p => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tipo</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de configuração" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONFIG_TYPES.map(t => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Secção</Label>
                <Input 
                  placeholder="Ex: hero, features, cta"
                  value={formData.section || ''}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                />
              </div>
              <div>
                <Label>Elemento</Label>
                <Input 
                  placeholder="Ex: title, subtitle, bgColor"
                  value={formData.element || ''}
                  onChange={(e) => setFormData({ ...formData, element: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Valor</Label>
              {formData.type === 'text' ? (
                <Textarea 
                  value={formData.value || ''}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                />
              ) : (
                <Input 
                  type={formData.type === 'color' ? 'color' : formData.type === 'number' ? 'number' : 'text'}
                  value={formData.value || ''}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                />
              )}
            </div>
            <Button onClick={handleCreateConfig} data-testid="button-save-config">
              <Save className="mr-2 h-4 w-4" /> Guardar
            </Button>
          </CardContent>
        </Card>
      )}

      <Tabs value={selectedPage} onValueChange={setSelectedPage}>
        <TabsList>
          {PAGES.map(page => (
            <TabsTrigger key={page.value} value={page.value}>{page.label}</TabsTrigger>
          ))}
        </TabsList>

        {PAGES.map(page => (
          <TabsContent key={page.value} value={page.value}>
            {Object.entries(groupedConfigs).map(([section, sectionConfigs]) => (
              <Card key={section} className="mb-4">
                <CardHeader>
                  <CardTitle className="capitalize">{section}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sectionConfigs.map((config) => (
                    <div key={config.id} className="flex items-center gap-4">
                      <Label className="w-40 capitalize">{config.element}</Label>
                      {config.type === 'text' ? (
                        <Textarea
                          defaultValue={config.value}
                          onBlur={(e) => handleSaveConfig(config, e.target.value)}
                          className="flex-1"
                        />
                      ) : (
                        <Input
                          type={config.type === 'color' ? 'color' : config.type === 'number' ? 'number' : 'text'}
                          defaultValue={config.value}
                          onBlur={(e) => handleSaveConfig(config, e.target.value)}
                          className={config.type === 'color' ? 'w-20 h-10' : 'flex-1'}
                        />
                      )}
                      <span className="text-xs text-muted-foreground">{config.type}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
