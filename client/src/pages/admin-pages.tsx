import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/navigation";
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Palette, Monitor, Settings, Upload, Image, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface ImageSelectorProps {
  value: string;
  onChange: (value: string) => void;
}
function ImageSelector({ value, onChange }: ImageSelectorProps) {
  const [showGallery, setShowGallery] = useState(false);
  const { toast } = useToast();
  const { data: galleryData } = useQuery({
    queryKey: ['/api/gallery/images'],
    enabled: showGallery
  });
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor selecione apenas imagens",
        variant: "destructive",
      });
      return;
    }
    try {
      const formData = new FormData();
      formData.append('files', file);
      formData.append('folder', 'pages');
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      if (response.ok) {
        const result = await response.json();
        if (result.files && result.files.length > 0) {
          onChange(result.files[0].url);
          toast({
            title: "Sucesso",
            description: "Imagem carregada com sucesso",
          });
        }
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
        description: "Falha no upload da imagem",
  };
  const allImages = ((galleryData as any)?.images || []).map((img: string) => `/public-objects/${img}`);
  return (
    <ProtectedRoute>
    <div className="space-y-4">
      {/* Current Image Preview */}
      {value && (
        <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg border border-gray-600">
          <img 
            src={value} 
            alt="Preview" 
            className="w-16 h-16 object-cover rounded border border-gray-500"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="flex-1">
            <p className="text-white text-sm font-medium">Imagem Selecionada:</p>
            <p className="text-gray-300 text-xs truncate">{value}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChange('')}
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
      {/* Input Field */}
      <div className="flex gap-2">
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="URL da imagem ou caminho..."
          className="flex-1 bg-gray-800 border-gray-600 text-white"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowGallery(!showGallery)}
          className="border-[#4dabf7] text-[#4dabf7] hover:bg-[#4dabf7] hover:text-white"
        >
          <Image className="h-4 w-4" />
        </Button>
      </div>
      {/* Upload Button */}
        <label className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            type="button"
            className="w-full border-[#00d4aa] text-[#00d4aa] hover:bg-[#00d4aa] hover:text-black"
            onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
            <Upload className="h-4 w-4 mr-2" />
            Fazer Upload de Nova Imagem
        </label>
      {/* Gallery */}
      {showGallery && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-600">
          <h4 className="text-white font-medium mb-3">Selecionar da Galeria:</h4>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 max-h-64 overflow-y-auto">
            {allImages.map((imgUrl: string, index: number) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  onChange(imgUrl);
                  setShowGallery(false);
                }}
                className="aspect-square border border-gray-600 rounded hover:border-[#4dabf7] transition-colors group"
              >
                <img
                  src={imgUrl}
                  alt={`Gallery ${index}`}
                  className="w-full h-full object-cover rounded group-hover:opacity-80"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </button>
            ))}
          {allImages.length === 0 && (
            <p className="text-gray-400 text-center py-4">Nenhuma imagem encontrada</p>
          )}
    </div>
  );
interface PageConfig {
  id: string;
  page: string;
  section: string;
  element: string;
  type: "text" | "color" | "size" | "image" | "number";
  defaultValue?: string;
  metadata?: string;
  updatedAt: string;
  createdAt: string;
const pages = [
  { value: "home", label: "Página Inicial" },
  { value: "about", label: "Sobre Nós" },
  { value: "services", label: "Serviços" },
  { value: "portfolio", label: "Portfólio" },
  { value: "contact", label: "Contactos" },
  { value: "loja", label: "Loja Online" },
];
const configTypes = [
  { value: "text", label: "Texto" },
  { value: "color", label: "Cor" },
  { value: "size", label: "Tamanho" },
  { value: "image", label: "Imagem" },
  { value: "number", label: "Número" },
export default function AdminPages() {
  const [configs, setConfigs] = useState<PageConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<string>("home");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editForm, setEditForm] = useState({
    page: "",
    section: "",
    element: "",
    type: "text" as "text" | "color" | "size" | "image" | "number",
    value: "",
    defaultValue: "",
    metadata: "",
  useEffect(() => {
    fetchConfigs();
  }, [selectedPage]);
  const fetchConfigs = async () => {
      setLoading(true);
      const response = await fetch(`/api/admin/pages/${selectedPage}`);
      const data = await response.json();
      setConfigs(data.configs || []);
      console.error('Error fetching configs:', error);
        description: "Falha ao carregar configurações",
    } finally {
      setLoading(false);
  const saveConfig = async (configData: Omit<PageConfig, 'id' | 'createdAt' | 'updatedAt'>, configId?: string) => {
      const url = configId ? `/api/admin/pages/${configId}` : '/api/admin/pages';
      const method = configId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configData),
        await fetchConfigs();
        setEditingId(null);
        setShowAddForm(false);
        resetForm();
        toast({
          title: "Sucesso",
          description: configId ? "Configuração atualizada" : "Configuração criada",
        });
        throw new Error('Falha ao salvar');
      console.error('Error saving config:', error);
        description: "Falha ao salvar configuração",
  const deleteConfig = async (id: string) => {
      const response = await fetch(`/api/admin/pages/${id}`, {
        method: 'DELETE',
          description: "Configuração eliminada",
        throw new Error('Falha ao eliminar');
      console.error('Error deleting config:', error);
        description: "Falha ao eliminar configuração",
  const startEdit = (config: PageConfig) => {
    setEditingId(config.id);
    setEditForm({
      page: config.page,
      section: config.section,
      element: config.element,
      type: config.type,
      value: config.value,
      defaultValue: config.defaultValue || "",
      metadata: config.metadata || "",
    });
  const startAdd = () => {
    setShowAddForm(true);
      page: selectedPage,
      section: "",
      element: "",
      type: "text" as "text" | "color" | "size" | "image" | "number",
      value: "",
      defaultValue: "",
      metadata: "",
  const resetForm = () => {
      page: "",
  const handleSave = () => {
    if (editingId) {
      saveConfig(editForm, editingId);
    } else {
      saveConfig(editForm);
  const renderConfigValue = (config: PageConfig) => {
    switch (config.type) {
      case 'color':
        return (
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded border border-gray-600"
              style={{ backgroundColor: config.value }}
            />
            <span className="text-sm text-gray-300">{config.value}</span>
        );
      case 'image':
            {config.value && config.value.startsWith('/') ? (
              <img 
                src={config.value} 
                alt="Preview" 
                className="w-8 h-8 object-cover rounded border border-gray-600"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
              />
            ) : (
              <Monitor className="h-4 w-4 text-gray-400" />
            )}
            <span className="text-sm text-gray-300 truncate max-w-[200px]">{config.value}</span>
      default:
          <span className="text-sm text-gray-300 truncate max-w-[300px]">
            {config.value}
          </span>
  const renderFormInput = () => {
    switch (editForm.type) {
          <div className="flex gap-2">
            <Input
              type="color"
              value={editForm.value}
              onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
              className="w-16 h-10 p-1 bg-gray-800 border-gray-600"
              type="text"
              placeholder="#ffffff"
              className="flex-1 bg-gray-800 border-gray-600 text-white"
      case 'text':
          <Textarea
            value={editForm.value}
            onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
            placeholder="Texto da configuração"
            className="bg-gray-800 border-gray-600 text-white"
            rows={3}
        return <ImageSelector value={editForm.value} onChange={(value) => setEditForm({ ...editForm, value })} />;
      case 'number':
          <Input
            type="number"
            placeholder="0"
            type="text"
            placeholder="Valor da configuração"
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navigation />
      {/* Header */}
      <div className="bg-[#111111] border-b border-[#333] mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/admin">
              <Button variant="outline" size="sm" className="gap-2 border-[#e84b5e] text-[#e84b5e] hover:bg-[#e84b5e] hover:text-white">
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Dashboard
              </Button>
            </Link>
          <div className="flex items-center gap-3 mb-4">
            <Palette className="h-8 w-8 text-[#e84b5e]" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Configurações de Páginas
            </h1>
          <p className="text-gray-400 text-lg">
            Edite textos, cores, tamanhos e imagens de todas as páginas do website
          </p>
      {/* Page Selector */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-4 mb-6">
            <Label htmlFor="page-select" className="text-white font-medium">
              Página:
            </Label>
            <Select value={selectedPage} onValueChange={setSelectedPage}>
              <SelectTrigger className="w-[200px] bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {pages.map((page) => (
                  <SelectItem key={page.value} value={page.value} className="text-white hover:bg-gray-700">
                    {page.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            onClick={startAdd}
            className="bg-[#e84b5e] hover:bg-[#d63951] text-white gap-2"
            <Plus className="h-4 w-4" />
            Nova Configuração
        {/* Add/Edit Form */}
        {(showAddForm || editingId) && (
          <Card className="bg-[#111111] border-[#333] mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {editingId ? "Editar Configuração" : "Nova Configuração"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="section" className="text-white">Secção</Label>
                  <Input
                    id="section"
                    value={editForm.section}
                    onChange={(e) => setEditForm({ ...editForm, section: e.target.value })}
                    placeholder="hero, features, about, etc."
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                  <Label htmlFor="element" className="text-white">Elemento</Label>
                    id="element"
                    value={editForm.element}
                    onChange={(e) => setEditForm({ ...editForm, element: e.target.value })}
                    placeholder="title, subtitle, description, etc."
                  <Label htmlFor="type" className="text-white">Tipo</Label>
                  <Select value={editForm.type} onValueChange={(value: "text" | "color" | "size" | "image" | "number") => setEditForm({ ...editForm, type: value })}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {configTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value} className="text-white hover:bg-gray-700">
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
              </div>
              
              <div>
                <Label htmlFor="value" className="text-white">Valor</Label>
                {renderFormInput()}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Label htmlFor="defaultValue" className="text-white">Valor Padrão (opcional)</Label>
                    id="defaultValue"
                    value={editForm.defaultValue}
                    onChange={(e) => setEditForm({ ...editForm, defaultValue: e.target.value })}
                    placeholder="Valor padrão"
                  <Label htmlFor="metadata" className="text-white">Metadata (JSON opcional)</Label>
                    id="metadata"
                    value={editForm.metadata}
                    onChange={(e) => setEditForm({ ...editForm, metadata: e.target.value })}
                    placeholder='{"unit": "px", "min": 10, "max": 100}'
              <div className="flex gap-2">
                <Button 
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white gap-2"
                >
                  <Save className="h-4 w-4" />
                  Guardar
                </Button>
                  onClick={() => {
                    setEditingId(null);
                    setShowAddForm(false);
                    resetForm();
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 gap-2"
                  <X className="h-4 w-4" />
                  Cancelar
            </CardContent>
          </Card>
        )}
        {/* Configs List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-400">A carregar configurações...</div>
            </div>
          ) : configs.length === 0 ? (
            <Card className="bg-[#111111] border-[#333]">
              <CardContent className="py-8 text-center">
                <Settings className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">
                  Nenhuma configuração encontrada
                </p>
                <p className="text-gray-500 text-sm">
                  Crie a primeira configuração para a página {pages.find(p => p.value === selectedPage)?.label}
              </CardContent>
            </Card>
          ) : (
            configs.map((config) => (
              <Card key={config.id} className="bg-[#111111] border-[#333]">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Secção / Elemento</div>
                        <div className="text-white font-medium">
                          {config.section} / {config.element}
                        </div>
                      </div>
                        <div className="text-sm text-gray-500">Tipo</div>
                        <Badge variant="secondary" className="bg-gray-700 text-gray-200">
                          {configTypes.find(t => t.value === config.type)?.label || config.type}
                        </Badge>
                      <div className="md:col-span-1">
                        <div className="text-sm text-gray-500">Valor</div>
                        {renderConfigValue(config)}
                      <div className="flex gap-2 justify-end">
                        <Button
                          onClick={() => startEdit(config)}
                          size="sm"
                          variant="outline"
                          className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                          onClick={() => deleteConfig(config.id)}
                          className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                          <Trash2 className="h-4 w-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
