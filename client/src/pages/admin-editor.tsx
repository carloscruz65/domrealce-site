import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/navigation";
import { 
  ArrowLeft, Edit3, Eye, Save, Undo, Redo, Plus, Trash2, 
  Image, Type, Layout, Palette, Upload, Download, Monitor,
  Move, Copy, Settings, RefreshCw
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { VisualEditorProvider } from "@/components/visual-editor";

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
  { route: '/', title: 'Página Inicial' },
  { route: '/sobre', title: 'Sobre Nós' },
  { route: '/servicos', title: 'Serviços' },
  { route: '/portfolio', title: 'Portfólio' },
  { route: '/contactos', title: 'Contactos' },
  { route: '/loja', title: 'Loja Online' },
];

export default function AdminEditor() {
  const { toast } = useToast();
  const [selectedPage, setSelectedPage] = useState<string>('/');
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [history, setHistory] = useState<PageContent[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    loadPageContent();
  }, [selectedPage]);

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
    if (!pageContent) return;

    try {
      const updatedContent = {
        ...pageContent,
        status,
        version: pageContent.version + 1,
        updatedAt: new Date().toISOString()
      };

      const response = await fetch('/api/editor/page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContent),
      });

      if (response.ok) {
        setPageContent(updatedContent);
        addToHistory(updatedContent);
        toast({
          title: "Sucesso",
          description: status === 'published' ? "Página publicada!" : "Rascunho guardado",
        });
      }
    } catch (error) {
      console.error('Error saving page:', error);
      toast({
        title: "Erro",
        description: "Falha ao guardar página",
        variant: "destructive",
      });
    }
  };

  const addToHistory = (content: PageContent) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(content);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setPageContent(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setPageContent(history[historyIndex + 1]);
    }
  };

  const addBlock = (type: Block['type']) => {
    if (!pageContent) return;

    const newBlock: Block = {
      id: crypto.randomUUID(),
      type,
      content: getDefaultContent(type),
      styles: getDefaultStyles(type),
      position: pageContent.blocks.length
    };

    const updatedContent = {
      ...pageContent,
      blocks: [...pageContent.blocks, newBlock]
    };

    setPageContent(updatedContent);
    addToHistory(updatedContent);
  };

  const deleteBlock = (blockId: string) => {
    if (!pageContent) return;

    const updatedContent = {
      ...pageContent,
      blocks: pageContent.blocks.filter(block => block.id !== blockId)
    };

    setPageContent(updatedContent);
    addToHistory(updatedContent);
  };

  const duplicateBlock = (blockId: string) => {
    if (!pageContent) return;

    const blockToDuplicate = pageContent.blocks.find(b => b.id === blockId);
    if (!blockToDuplicate) return;

    const newBlock: Block = {
      ...blockToDuplicate,
      id: crypto.randomUUID(),
      position: blockToDuplicate.position + 1
    };

    const updatedBlocks = [...pageContent.blocks];
    updatedBlocks.splice(blockToDuplicate.position + 1, 0, newBlock);
    
    // Update positions
    updatedBlocks.forEach((block, index) => {
      block.position = index;
    });

    const updatedContent = {
      ...pageContent,
      blocks: updatedBlocks
    };

    setPageContent(updatedContent);
    addToHistory(updatedContent);
  };

  const moveBlock = (blockId: string, direction: 'up' | 'down') => {
    if (!pageContent) return;

    const blocks = [...pageContent.blocks];
    const blockIndex = blocks.findIndex(b => b.id === blockId);
    
    if (blockIndex === -1) return;
    
    const newIndex = direction === 'up' ? blockIndex - 1 : blockIndex + 1;
    
    if (newIndex < 0 || newIndex >= blocks.length) return;

    // Swap blocks
    [blocks[blockIndex], blocks[newIndex]] = [blocks[newIndex], blocks[blockIndex]];
    
    // Update positions
    blocks.forEach((block, index) => {
      block.position = index;
    });

    const updatedContent = {
      ...pageContent,
      blocks
    };

    setPageContent(updatedContent);
    addToHistory(updatedContent);
  };

  const getDefaultContent = (type: Block['type']) => {
    switch (type) {
      case 'hero':
        return {
          title: 'Título Principal',
          subtitle: 'Subtítulo opcional',
          description: 'Descrição do hero banner',
          backgroundImage: '',
          ctaText: 'Botão de Acção',
          ctaLink: '#'
        };
      case 'text':
        return {
          content: '<p>Insira o seu texto aqui...</p>'
        };
      case 'image':
        return {
          src: '',
          alt: 'Descrição da imagem',
          caption: '',
          link: ''
        };
      case 'gallery':
        return {
          images: [],
          layout: 'grid',
          columns: 3
        };
      case 'grid':
        return {
          title: 'Grid de Cards',
          cards: [
            { title: 'Card 1', description: 'Descrição', image: '', link: '' }
          ]
        };
      case 'cta':
        return {
          text: 'Botão de Acção',
          link: '#',
          style: 'primary'
        };
      case 'separator':
        return {
          style: 'line',
          color: '#333'
        };
      case 'section':
        return {
          title: 'Nova Secção',
          content: 'Conteúdo da secção'
        };
      default:
        return {};
    }
  };

  const getDefaultStyles = (type: Block['type']) => {
    const baseStyles = {
      padding: '2rem',
      margin: '0',
      textAlign: 'left' as const,
    };

    switch (type) {
      case 'hero':
        return {
          ...baseStyles,
          backgroundColor: '#000000',
          textColor: '#ffffff',
          fontSize: '3rem',
          fontWeight: 'bold',
          textAlign: 'center' as const,
          padding: '4rem 2rem'
        };
      case 'text':
        return {
          ...baseStyles,
          textColor: '#ffffff',
          fontSize: '1rem'
        };
      case 'cta':
        return {
          ...baseStyles,
          textAlign: 'center' as const,
          backgroundColor: '#FFD700',
          textColor: '#000000',
          fontWeight: 'bold'
        };
      default:
        return baseStyles;
    }
  };

  const renderBlockEditor = (block: Block) => {
    return (
      <Card key={block.id} className="bg-[#111111] border-[#333] mb-4">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-[#FFD700] text-[#FFD700]">
                {blockTypes.find(bt => bt.value === block.type)?.label || block.type}
              </Badge>
              <span className="text-sm text-gray-400">Posição {block.position + 1}</span>
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => moveBlock(block.id, 'up')}
                disabled={block.position === 0}
                className="h-8 w-8 p-0"
              >
                ↑
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => moveBlock(block.id, 'down')}
                disabled={block.position === pageContent!.blocks.length - 1}
                className="h-8 w-8 p-0"
              >
                ↓
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => duplicateBlock(block.id)}
                className="h-8 w-8 p-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => deleteBlock(block.id)}
                className="h-8 w-8 p-0 border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderBlockContent(block)}
        </CardContent>
      </Card>
    );
  };

  const renderBlockContent = (block: Block) => {
    switch (block.type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <Label>Título</Label>
              <Input
                value={block.content.title || ''}
                onChange={(e) => updateBlockContent(block.id, 'title', e.target.value)}
                className="bg-[#222] border-[#444] text-white"
              />
            </div>
            <div>
              <Label>Subtítulo</Label>
              <Input
                value={block.content.subtitle || ''}
                onChange={(e) => updateBlockContent(block.id, 'subtitle', e.target.value)}
                className="bg-[#222] border-[#444] text-white"
              />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea
                value={block.content.description || ''}
                onChange={(e) => updateBlockContent(block.id, 'description', e.target.value)}
                className="bg-[#222] border-[#444] text-white"
                rows={3}
              />
            </div>
            <div>
              <Label>Imagem de Fundo</Label>
              <Input
                value={block.content.backgroundImage || ''}
                onChange={(e) => updateBlockContent(block.id, 'backgroundImage', e.target.value)}
                placeholder="URL da imagem ou /public-objects/..."
                className="bg-[#222] border-[#444] text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Texto do Botão</Label>
                <Input
                  value={block.content.ctaText || ''}
                  onChange={(e) => updateBlockContent(block.id, 'ctaText', e.target.value)}
                  className="bg-[#222] border-[#444] text-white"
                />
              </div>
              <div>
                <Label>Link do Botão</Label>
                <Input
                  value={block.content.ctaLink || ''}
                  onChange={(e) => updateBlockContent(block.id, 'ctaLink', e.target.value)}
                  className="bg-[#222] border-[#444] text-white"
                />
              </div>
            </div>
          </div>
        );
      
      case 'text':
        return (
          <div>
            <Label>Conteúdo</Label>
            <Textarea
              value={block.content.content || ''}
              onChange={(e) => updateBlockContent(block.id, 'content', e.target.value)}
              className="bg-[#222] border-[#444] text-white"
              rows={6}
              placeholder="Suporta HTML básico: <p>, <strong>, <em>, <a>, etc."
            />
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <Label>URL da Imagem</Label>
              <Input
                value={block.content.src || ''}
                onChange={(e) => updateBlockContent(block.id, 'src', e.target.value)}
                placeholder="/public-objects/imagem.jpg"
                className="bg-[#222] border-[#444] text-white"
              />
            </div>
            <div>
              <Label>Texto Alternativo</Label>
              <Input
                value={block.content.alt || ''}
                onChange={(e) => updateBlockContent(block.id, 'alt', e.target.value)}
                className="bg-[#222] border-[#444] text-white"
              />
            </div>
            <div>
              <Label>Legenda (opcional)</Label>
              <Input
                value={block.content.caption || ''}
                onChange={(e) => updateBlockContent(block.id, 'caption', e.target.value)}
                className="bg-[#222] border-[#444] text-white"
              />
            </div>
            <div>
              <Label>Link (opcional)</Label>
              <Input
                value={block.content.link || ''}
                onChange={(e) => updateBlockContent(block.id, 'link', e.target.value)}
                className="bg-[#222] border-[#444] text-white"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-gray-400 text-center py-4">
            Editor para {block.type} em desenvolvimento
          </div>
        );
    }
  };

  const updateBlockContent = (blockId: string, field: string, value: any) => {
    if (!pageContent) return;

    const updatedBlocks = pageContent.blocks.map(block => {
      if (block.id === blockId) {
        return {
          ...block,
          content: {
            ...block.content,
            [field]: value
          }
        };
      }
      return block;
    });

    const updatedContent = {
      ...pageContent,
      blocks: updatedBlocks
    };

    setPageContent(updatedContent);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Navigation />
        <div className="container mx-auto px-4 py-16 mt-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FFD700] mx-auto"></div>
            <p className="mt-4 text-gray-400">A carregar editor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <VisualEditorProvider>
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Navigation />
      
      {/* Header */}
      <div className="bg-[#111111] border-b border-[#333] mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <Link href="/admin">
              <Button variant="outline" size="sm" className="gap-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black">
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={undo}
                disabled={historyIndex <= 0}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Undo className="h-4 w-4" />
                Desfazer
              </Button>
              <Button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Redo className="h-4 w-4" />
                Refazer
              </Button>
              <Button
                onClick={() => savePageContent('draft')}
                variant="outline"
                size="sm"
                className="gap-2 border-blue-500 text-blue-400"
              >
                <Save className="h-4 w-4" />
                Guardar Rascunho
              </Button>
              <Button
                onClick={() => savePageContent('published')}
                size="sm"
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                <Upload className="h-4 w-4" />
                Publicar
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <Edit3 className="h-6 w-6 text-[#FFD700]" />
            <h1 className="text-2xl font-bold text-white">
              Editor Visual
            </h1>
            {pageContent && (
              <Badge variant={pageContent.status === 'published' ? 'default' : 'secondary'}>
                {pageContent.status === 'published' ? 'Publicado' : 'Rascunho'}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label className="text-white">Página:</Label>
              <Select value={selectedPage} onValueChange={setSelectedPage}>
                <SelectTrigger className="w-[200px] bg-[#222] border-[#444] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#222] border-[#444]">
                  {availablePages.map((page) => (
                    <SelectItem key={page.route} value={page.route} className="text-white hover:bg-[#333]">
                      {page.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button
              onClick={() => setShowPreview(!showPreview)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              {showPreview ? 'Editor' : 'Preview'}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {!showPreview ? (
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Block Palette */}
            <div className="lg:col-span-1">
              <Card className="bg-[#111111] border-[#333] sticky top-24">
                <CardHeader>
                  <CardTitle className="text-[#FFD700] text-lg flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Adicionar Bloco
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {blockTypes.map((blockType) => {
                    const IconComponent = blockType.icon;
                    return (
                      <Button
                        key={blockType.value}
                        onClick={() => addBlock(blockType.value as Block['type'])}
                        variant="outline"
                        className="w-full justify-start gap-2 border-[#444] text-gray-300 hover:bg-[#222]"
                      >
                        <IconComponent className="h-4 w-4" />
                        {blockType.label}
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Editor Area */}
            <div className="lg:col-span-3">
              {pageContent && pageContent.blocks.length === 0 ? (
                <Card className="bg-[#111111] border-[#333]">
                  <CardContent className="py-12 text-center">
                    <Layout className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg mb-2">
                      Página vazia
                    </p>
                    <p className="text-gray-500 text-sm">
                      Adicione blocos usando o painel à esquerda
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {pageContent?.blocks
                    .sort((a, b) => a.position - b.position)
                    .map(block => renderBlockEditor(block))}
                </div>
              )}
            </div>
          </div>
        ) : (
          // Preview Mode
          <div className="max-w-6xl mx-auto">
            <Card className="bg-[#111111] border-[#333]">
              <CardHeader>
                <CardTitle className="text-[#FFD700] flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Preview da Página
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-black rounded-lg p-6">
                  <div className="text-center text-gray-400 py-8">
                    Preview em desenvolvimento - Ver versão publicada na página real
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
    </VisualEditorProvider>
  );
}