import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navigation from "@/components/navigation";
import { ArrowLeft, Upload, Trash2, Search, FolderOpen, Image, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface GalleryImage {
  filename: string;
  url: string;
  category: string;
  title: string;
  description: string;
}
export default function AdminPortfolio() {
  const { toast } = useToast();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleting, setDeleting] = useState<string[]>([]);
  useEffect(() => {
    fetchImages();
  }, []);
  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/gallery/images');
      const data = await response.json();
      
      const processedImages: GalleryImage[] = data.images.map((filename: string) => ({
        filename,
        url: `/public-objects/${filename}`,
        category: getCategoryFromPath(filename),
        title: generateTitle(filename),
        description: `Projeto realizado pela DOMREALCE - ${generateTitle(filename)}`
      }));
      setImages(processedImages);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar imagens do portfólio",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const getCategoryFromPath = (filename: string): string => {
    const parts = filename.split('/');
    if (parts.length >= 2) {
      return parts[1]; // portfolio/Categoria/file.jpg -> Categoria
    return "Outros";
  const generateTitle = (filename: string): string => {
    const name = parts[parts.length - 1];
    return name.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '').replace(/[_-]/g, ' ');
  const deleteImage = async (filename: string) => {
    if (!confirm(`Tem certeza que deseja remover a imagem "${generateTitle(filename)}"?`)) {
      return;
    setDeleting(prev => [...prev, filename]);
    
      const response = await fetch('/api/admin/portfolio/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename }),
      if (response.ok) {
        setImages(prev => prev.filter(img => img.filename !== filename));
        toast({
          title: "Sucesso",
          description: "Imagem removida com sucesso",
        });
      } else {
        throw new Error('Falha ao remover imagem');
      }
      console.error('Error deleting image:', error);
        description: "Falha ao remover imagem",
      setDeleting(prev => prev.filter(f => f !== filename));
  const getCategories = () => {
    const categories = Array.from(new Set(images.map(img => img.category)));
    return ["todas", ...categories.sort()];
  const filteredImages = images.filter(img => {
    const matchesCategory = selectedCategory === "todas" || img.category === selectedCategory;
    const matchesSearch = img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         img.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  const getCategoryStats = () => {
    const stats: Record<string, number> = {};
    images.forEach(img => {
      stats[img.category] = (stats[img.category] || 0) + 1;
    });
    return stats;
  if (loading) {
    return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Navigation />
        <div className="container mx-auto px-4 py-16 mt-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FFD700] mx-auto"></div>
            <p className="mt-4 text-gray-400">A carregar portfólio...</p>
          </div>
        </div>
      </div>
    );
  }
  const stats = getCategoryStats();
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navigation />
      {/* Header */}
      <div className="bg-[#111111] border-b border-[#333] mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/portfolio">
              <Button variant="outline" size="sm" className="gap-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black">
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Portfólio
              </Button>
            </Link>
          <h1 className="text-4xl font-bold text-white mb-4">
            Administração do <span className="text-[#FFD700]">Portfólio</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Gere as imagens do portfólio da DOMREALCE
          </p>
      {/* Stats */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#111111] border-[#333]">
            <CardContent className="p-6 text-center">
              <Image className="h-8 w-8 text-[#FFD700] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{images.length}</div>
              <div className="text-sm text-gray-400">Total de Imagens</div>
            </CardContent>
          </Card>
          
              <FolderOpen className="h-8 w-8 text-[#00d4aa] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{Object.keys(stats).length}</div>
              <div className="text-sm text-gray-400">Categorias</div>
              <AlertCircle className="h-8 w-8 text-[#ff6b6b] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{Math.max(...Object.values(stats), 0)}</div>
              <div className="text-sm text-gray-400">Maior Categoria</div>
              <Upload className="h-8 w-8 text-[#4dabf7] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">Object Storage</div>
              <div className="text-sm text-gray-400">Localização</div>
        {/* Controls */}
        <Card className="bg-[#111111] border-[#333] mb-8">
          <CardHeader>
            <CardTitle className="text-[#FFD700]">Filtros e Pesquisa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="search" className="text-white mb-2 block">Pesquisar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Pesquisar por nome ou categoria..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-[#222] border-[#444] text-white"
                  />
                </div>
              </div>
              
                <Label className="text-white mb-2 block">Categoria</Label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 bg-[#222] border border-[#444] rounded-md text-white"
                >
                  {getCategories().map(category => (
                    <option key={category} value={category}>
                      {category === "todas" ? "Todas as Categorias" : `${category} (${stats[category] || 0})`}
                    </option>
                  ))}
                </select>
            </div>
          </CardContent>
        </Card>
        {/* Upload Info */}
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-[#FFD700] p-3 rounded-lg">
                <Upload className="h-6 w-6 text-black" />
                <h3 className="text-lg font-semibold text-white mb-2">Como adicionar novas imagens</h3>
                <p className="text-gray-300 mb-4">
                  Para adicionar novas imagens ao portfólio, vá ao Object Storage do Replit e crie/use a pasta "portfolio" dentro de "public".
                </p>
                <div className="bg-[#222] p-4 rounded-lg">
                  <p className="text-sm text-gray-400">
                    <strong>Estrutura recomendada:</strong><br />
                    public/portfolio/NomeCategoria/imagem.jpg
                  </p>
        {/* Images Grid */}
        <Card className="bg-[#111111] border-[#333]">
            <CardTitle className="text-[#FFD700]">
              Imagens do Portfólio 
              <Badge variant="secondary" className="ml-2 bg-[#FFD700] text-black">
                {filteredImages.length} imagens
              </Badge>
            </CardTitle>
            {filteredImages.length === 0 ? (
              <div className="text-center py-12">
                <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Nenhuma imagem encontrada</p>
                <p className="text-gray-500 text-sm">Ajuste os filtros ou adicione imagens ao portfólio</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredImages.map((image) => (
                  <div key={image.filename} className="bg-[#222] rounded-lg overflow-hidden border border-[#333] hover:border-[#FFD700] transition-colors">
                    <div className="aspect-square relative">
                      <img 
                        src={image.url} 
                        alt={image.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute top-2 right-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-8 w-8 p-0"
                          onClick={() => deleteImage(image.filename)}
                          disabled={deleting.includes(image.filename)}
                        >
                          {deleting.includes(image.filename) ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <Badge variant="outline" className="mb-2 border-[#FFD700] text-[#FFD700]">
                        {image.category}
                      </Badge>
                      <h3 className="text-white font-medium text-sm mb-1 truncate">
                        {image.title}
                      </h3>
                      <p className="text-gray-400 text-xs">
                        {image.filename.split('/').pop()}
                      </p>
                  </div>
                ))}
            )}
    </div>
  );
