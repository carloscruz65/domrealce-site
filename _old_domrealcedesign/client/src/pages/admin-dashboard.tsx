import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/navigation";
import { ArrowLeft, Monitor, Package, FileText, Image, Users, Palette, Store, FolderOpen, Wand2 } from "lucide-react";
import { Link } from "wouter";

const adminSections = [
  {
    title: "Slider Homepage",
    description: "Gere as imagens e textos do slider principal",
    href: "/admin/slider",
    icon: Monitor,
    color: "text-[#FFD700]",
    bg: "hover:bg-[#FFD700]/10",
  },
  {
    title: "Configurações de Páginas",
    description: "Edite textos, cores, tamanhos e imagens de todas as páginas",
    href: "/admin/pages",
    icon: Palette,
    color: "text-[#e84b5e]",
    bg: "hover:bg-[#e84b5e]/10",
  },
  {
    title: "Produtos em Destaque",
    description: "Administre os produtos exibidos na homepage",
    href: "/admin/produtos",
    icon: Package,
    color: "text-[#00d4aa]",
    bg: "hover:bg-[#00d4aa]/10",
  },
  {
    title: "Notícias & Artigos",
    description: "Crie e edite notícias para o site",
    href: "/admin/noticias",
    icon: FileText,
    color: "text-[#4dabf7]",
    bg: "hover:bg-[#4dabf7]/10",
  },
  {
    title: "Portfólio",
    description: "Gerencie imagens do portfólio por categoria",
    href: "/admin/portfolio",
    icon: Image,
    color: "text-[#ff6b35]",
    bg: "hover:bg-[#ff6b35]/10",
  },
  {
    title: "Contactos",
    description: "Visualize mensagens de contacto recebidas",
    href: "/admin/contactos",
    icon: Users,
    color: "text-purple-400",
    bg: "hover:bg-purple-400/10",
  },
  {
    title: "Loja Online",
    description: "Administre produtos e texturas da loja",
    href: "/admin/loja",
    icon: Store,
    color: "text-pink-400",
    bg: "hover:bg-pink-400/10",
  },
  {
    title: "Editor Visual",
    description: "Editor WYSIWYG para criar páginas com drag & drop",
    href: "/admin/editor",
    icon: Wand2,
    color: "text-[#FFD700]",
    bg: "hover:bg-[#FFD700]/10",
  },
  {
    title: "Gestor de Mídia",
    description: "Centralize e organize todas as imagens do site",
    href: "/admin/media",
    icon: FolderOpen,
    color: "text-[#4dabf7]",
    bg: "hover:bg-[#4dabf7]/10",
  },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navigation />
      
      {/* Header */}
      <div className="bg-[#111111] border-b border-[#333] mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black">
                <ArrowLeft className="h-4 w-4" />
                Voltar à Homepage
              </Button>
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Administração <span className="text-[#FFD700]">DOMREALCE</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Central de gestão de conteúdo do site. Gerencie todas as secções numa só plataforma.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-[#111111] border-[#333]">
            <CardContent className="p-6 text-center">
              <Monitor className="h-8 w-8 text-[#FFD700] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">3</div>
              <div className="text-sm text-gray-400">Slides Ativos</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#111111] border-[#333]">
            <CardContent className="p-6 text-center">
              <Image className="h-8 w-8 text-[#00d4aa] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">160+</div>
              <div className="text-sm text-gray-400">Imagens Portfólio</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#111111] border-[#333]">
            <CardContent className="p-6 text-center">
              <Package className="h-8 w-8 text-[#4dabf7] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">12</div>
              <div className="text-sm text-gray-400">Produtos Destaque</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#111111] border-[#333]">
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 text-[#ff6b35] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">8</div>
              <div className="text-sm text-gray-400">Notícias Ativas</div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <Link key={section.href} href={section.href}>
                <Card className={`bg-[#111111] border-[#333] transition-all duration-300 cursor-pointer ${section.bg} hover:border-[#555] hover:scale-105`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <IconComponent className={`h-8 w-8 ${section.color}`} />
                      <div>
                        <CardTitle className="text-white text-lg">{section.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-400 leading-relaxed">
                      {section.description}
                    </CardDescription>
                    <Button 
                      variant="outline" 
                      className="mt-4 w-full border-[#333] text-gray-300 hover:bg-[#222]"
                    >
                      Aceder
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <Card className="bg-[#111111] border-[#333]">
            <CardHeader>
              <CardTitle className="text-[#FFD700]">Acções Rápidas</CardTitle>
              <CardDescription className="text-gray-400">
                Operações frequentes para gestão do conteúdo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Link href="/admin/editor">
                  <Button variant="outline" className="w-full gap-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black">
                    <Wand2 className="h-4 w-4" />
                    Editor Visual
                  </Button>
                </Link>
                
                <Link href="/admin/pages">
                  <Button variant="outline" className="w-full gap-2 border-[#e84b5e] text-[#e84b5e] hover:bg-[#e84b5e] hover:text-black">
                    <Palette className="h-4 w-4" />
                    Config. Páginas
                  </Button>
                </Link>
                
                <Link href="/admin/media">
                  <Button variant="outline" className="w-full gap-2 border-[#4dabf7] text-[#4dabf7] hover:bg-[#4dabf7] hover:text-black">
                    <FolderOpen className="h-4 w-4" />
                    Gestor Mídia
                  </Button>
                </Link>
                
                <Link href="/admin/slider">
                  <Button variant="outline" className="w-full gap-2 border-[#00d4aa] text-[#00d4aa] hover:bg-[#00d4aa] hover:text-black">
                    <Monitor className="h-4 w-4" />
                    Novo Slide
                  </Button>
                </Link>
                
                <Link href="/admin/produtos">
                  <Button variant="outline" className="w-full gap-2 border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35] hover:text-black">
                    <Package className="h-4 w-4" />
                    Novo Produto
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}