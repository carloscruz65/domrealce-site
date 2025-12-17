import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Download, FileText, Image as ImageIcon, Folder, CheckCircle, AlertCircle, Copy, ExternalLink, ChevronDown, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MediaFile {
  path: string;
  url: string;
  folder: string;
}

export default function ExportarSite() {
  const { toast } = useToast();
  const [downloading, setDownloading] = useState(false);
  const [downloadedCount, setDownloadedCount] = useState(0);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const { data: mediaData, isLoading } = useQuery<{ files: Record<string, string[]>; total: number }>({
    queryKey: ['/api/media/list'],
  });

  const allFiles: MediaFile[] = [];
  if (mediaData?.files) {
    Object.entries(mediaData.files).forEach(([folder, files]) => {
      files.forEach(filePath => {
        allFiles.push({
          path: filePath,
          url: `/public-objects/${filePath}`,
          folder
        });
      });
    });
  }

  const folders = mediaData?.files ? Object.keys(mediaData.files) : [];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado!" });
  };

  const toggleFolder = (folder: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folder)) {
      newExpanded.delete(folder);
    } else {
      newExpanded.add(folder);
    }
    setExpandedFolders(newExpanded);
  };

  const downloadAllImages = async () => {
    setDownloading(true);
    setDownloadedCount(0);

    try {
      for (let i = 0; i < allFiles.length; i++) {
        const file = allFiles[i];
        try {
          const response = await fetch(file.url);
          const blob = await response.blob();
          
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = file.path.split('/').pop() || 'image';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
          
          setDownloadedCount(i + 1);
          
          await new Promise(resolve => setTimeout(resolve, 300));
        } catch (err) {
          console.error(`Erro ao baixar ${file.path}:`, err);
        }
      }
      
      toast({ title: "Download concluído!", description: `${allFiles.length} ficheiros baixados.` });
    } catch (error) {
      toast({ title: "Erro no download", variant: "destructive" });
    } finally {
      setDownloading(false);
    }
  };

  const generateImageList = () => {
    let content = "LISTA DE IMAGENS - DOMREALCE\n";
    content += "=" .repeat(50) + "\n\n";
    content += `Total de ficheiros: ${allFiles.length}\n`;
    content += `Data de exportação: ${new Date().toLocaleString('pt-PT')}\n\n`;

    folders.forEach(folder => {
      const folderFiles = allFiles.filter(f => f.folder === folder);
      content += `\n📁 ${folder.toUpperCase()} (${folderFiles.length} ficheiros)\n`;
      content += "-".repeat(40) + "\n";
      folderFiles.forEach(f => {
        content += `  - ${f.path}\n`;
        content += `    URL: ${window.location.origin}${f.url}\n`;
      });
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lista-imagens-domrealce.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({ title: "Lista gerada!" });
  };

  const generateMigrationGuide = () => {
    const baseUrl = window.location.origin;
    
    let content = `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Guia de Migração - DOMREALCE para Hostinger</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 40px 20px; line-height: 1.6; color: #333; }
    h1 { color: #1a1a1a; border-bottom: 3px solid #FFD700; padding-bottom: 10px; }
    h2 { color: #333; margin-top: 40px; border-left: 4px solid #FFD700; padding-left: 15px; }
    h3 { color: #555; }
    .step { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff; }
    .warning { background: #fff3cd; border-color: #ffc107; }
    .success { background: #d4edda; border-color: #28a745; }
    .code { background: #2d2d2d; color: #f8f8f2; padding: 15px; border-radius: 6px; font-family: 'Courier New', monospace; font-size: 14px; overflow-x: auto; }
    .folder-list { background: #e9ecef; padding: 15px; border-radius: 6px; }
    .folder-list li { margin: 8px 0; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    th { background: #1a1a1a; color: white; }
    tr:nth-child(even) { background: #f8f9fa; }
    .image-count { background: #FFD700; color: #1a1a1a; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
    @media print { body { max-width: 100%; } .no-print { display: none; } }
  </style>
</head>
<body>
  <h1>🚀 Guia de Migração - DOMREALCE</h1>
  <p><strong>De:</strong> Replit → <strong>Para:</strong> Hostinger</p>
  <p><strong>Data:</strong> ${new Date().toLocaleDateString('pt-PT')}</p>

  <h2>📋 Resumo da Migração</h2>
  <table>
    <tr><th>Item</th><th>Quantidade</th><th>Ação Necessária</th></tr>
    <tr><td>Total de Imagens</td><td><span class="image-count">${allFiles.length}</span></td><td>Fazer upload para Hostinger</td></tr>
    <tr><td>Pastas de Imagens</td><td>${folders.length}</td><td>Recriar estrutura</td></tr>
    <tr><td>Base de Dados</td><td>PostgreSQL</td><td>Exportar e importar</td></tr>
    <tr><td>Variáveis de Ambiente</td><td>6+</td><td>Configurar no Hostinger</td></tr>
  </table>

  <h2>📁 Estrutura de Pastas das Imagens</h2>
  <p>Crie a seguinte estrutura de pastas no Hostinger em <code>public_html/images/</code>:</p>
  <div class="folder-list">
    <ul>
${folders.map(folder => {
  const count = allFiles.filter(f => f.folder === folder).length;
  return `      <li><strong>${folder}/</strong> <span class="image-count">${count} ficheiros</span></li>`;
}).join('\n')}
    </ul>
  </div>

  <h2>🔧 Passo 1: Baixar Todas as Imagens</h2>
  <div class="step">
    <h3>Opção A - Download Individual (Recomendado)</h3>
    <ol>
      <li>Aceda ao painel de administração: <code>${baseUrl}/admin</code></li>
      <li>Vá a "Media" → Clique em cada pasta → Download das imagens</li>
      <li>Organize num computador local mantendo a estrutura de pastas</li>
    </ol>
    
    <h3>Opção B - Lista de URLs</h3>
    <p>Use esta lista para baixar com um gestor de downloads:</p>
    <div class="code" style="max-height: 300px; overflow-y: auto;">
${allFiles.slice(0, 50).map(f => `${baseUrl}${f.url}`).join('\n')}
${allFiles.length > 50 ? `\n... e mais ${allFiles.length - 50} ficheiros (ver lista completa)` : ''}
    </div>
  </div>

  <h2>🔧 Passo 2: Fazer Upload para Hostinger</h2>
  <div class="step">
    <ol>
      <li>Aceda ao <strong>File Manager</strong> do Hostinger (hPanel)</li>
      <li>Navegue até <code>public_html/images/</code></li>
      <li>Crie as subpastas conforme a estrutura acima</li>
      <li>Faça upload das imagens para cada pasta correspondente</li>
    </ol>
  </div>

  <h2>🔧 Passo 3: Atualizar URLs no Código</h2>
  <div class="step warning">
    <h3>⚠️ Importante</h3>
    <p>Precisa alterar todas as referências de <code>/public-objects/</code> para <code>/images/</code></p>
    
    <h4>Ficheiros a editar:</h4>
    <ul>
      <li><code>client/src/components/StaticHero.tsx</code></li>
      <li><code>client/src/components/ServiceHeroTwoColumn.tsx</code></li>
      <li><code>client/src/components/dynamic-gallery.tsx</code></li>
      <li><code>client/src/pages/*.tsx</code> (páginas de serviços e loja)</li>
    </ul>

    <h4>Exemplo de alteração:</h4>
    <div class="code">
// ANTES (Replit):
src="/public-objects/homepage/bem-vindo-domrealce.webp"

// DEPOIS (Hostinger):
src="/images/homepage/bem-vindo-domrealce.webp"
    </div>
  </div>

  <h2>🔧 Passo 4: Configurar Base de Dados</h2>
  <div class="step">
    <ol>
      <li>No Hostinger, crie uma base de dados PostgreSQL (ou MySQL)</li>
      <li>Exporte a base de dados do Replit usando o painel de Database</li>
      <li>Importe para o Hostinger via phpMyAdmin ou pgAdmin</li>
      <li>Atualize as variáveis de ambiente com as novas credenciais</li>
    </ol>
  </div>

  <h2>🔧 Passo 5: Variáveis de Ambiente</h2>
  <div class="step">
    <p>Configure estas variáveis no Hostinger:</p>
    <div class="code">
DATABASE_URL=postgresql://user:pass@host:5432/database
PGHOST=host
PGUSER=user
PGPASSWORD=password
PGDATABASE=database
PGPORT=5432

# Pagamentos IfthenPay (copiar do Replit)
IFTHENPAY_MBWAY_KEY=xxx
IFTHENPAY_MB_KEY=xxx
IFTHENPAY_PAYSHOP_KEY=xxx
IFTHENPAY_ANTI_PHISHING_KEY=xxx
    </div>
  </div>

  <h2>🔧 Passo 6: Build e Deploy</h2>
  <div class="step">
    <ol>
      <li>No terminal local, execute: <code>npm run build</code></li>
      <li>Faça upload da pasta <code>dist/</code> para <code>public_html/</code></li>
      <li>Configure o servidor Node.js no Hostinger (se aplicável)</li>
      <li>Ou use a opção de Static Hosting se for apenas frontend</li>
    </ol>
  </div>

  <h2>✅ Checklist Final</h2>
  <div class="step success">
    <ul>
      <li>☐ Todas as imagens foram carregadas</li>
      <li>☐ URLs atualizadas no código</li>
      <li>☐ Base de dados migrada</li>
      <li>☐ Variáveis de ambiente configuradas</li>
      <li>☐ DNS apontado para Hostinger</li>
      <li>☐ SSL/HTTPS ativado</li>
      <li>☐ Teste todas as páginas</li>
      <li>☐ Teste o checkout/pagamentos</li>
    </ul>
  </div>

  <h2>📞 Suporte</h2>
  <p>Se tiver dúvidas durante a migração, contacte o suporte Hostinger ou reveja a documentação em <a href="https://support.hostinger.com">support.hostinger.com</a></p>

  <div class="no-print" style="margin-top: 40px; padding: 20px; background: #f0f0f0; border-radius: 8px;">
    <p><strong>Para guardar como PDF:</strong> Prima Ctrl+P (ou Cmd+P no Mac) → Selecione "Guardar como PDF"</p>
  </div>
</body>
</html>`;

    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    window.open(url, '_blank');
    
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = url;
      link.download = 'guia-migracao-hostinger.html';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, 500);

    toast({ 
      title: "Guia gerado!", 
      description: "Abriu numa nova aba. Guarde como PDF (Ctrl+P → Guardar como PDF)" 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-yellow"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Exportar Site para Hostinger</h1>
          <p className="text-muted-foreground">
            Ferramentas para migrar o site DOMREALCE para outro alojamento
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-6 text-center">
              <ImageIcon className="h-8 w-8 mx-auto mb-2 text-brand-yellow" />
              <div className="text-3xl font-bold">{allFiles.length}</div>
              <p className="text-sm text-muted-foreground">Imagens</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-6 text-center">
              <Folder className="h-8 w-8 mx-auto mb-2 text-brand-yellow" />
              <div className="text-3xl font-bold">{folders.length}</div>
              <p className="text-sm text-muted-foreground">Pastas</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-6 text-center">
              <FileText className="h-8 w-8 mx-auto mb-2 text-brand-yellow" />
              <div className="text-3xl font-bold">1</div>
              <p className="text-sm text-muted-foreground">Base de Dados</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-brand-yellow" />
                Guia de Migração
              </CardTitle>
              <CardDescription>
                Instruções completas passo a passo para migrar para Hostinger
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={generateMigrationGuide}
                className="w-full bg-brand-yellow text-black hover:bg-yellow-500"
                data-testid="button-generate-guide"
              >
                <Download className="mr-2 h-4 w-4" />
                Gerar Guia PDF
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Abre um HTML que pode guardar como PDF
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-brand-yellow" />
                Lista de Imagens
              </CardTitle>
              <CardDescription>
                Ficheiro TXT com todos os caminhos das imagens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={generateImageList}
                variant="outline"
                className="w-full"
                data-testid="button-generate-list"
              >
                <Download className="mr-2 h-4 w-4" />
                Exportar Lista (.txt)
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-zinc-900 border-zinc-800 mb-8">
          <CardHeader>
            <CardTitle>Estrutura de Pastas</CardTitle>
            <CardDescription>
              Recrie esta estrutura em <code className="bg-zinc-800 px-2 py-1 rounded">public_html/images/</code> no Hostinger
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {folders.map(folder => {
                const count = allFiles.filter(f => f.folder === folder).length;
                return (
                  <div 
                    key={folder}
                    className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Folder className="h-4 w-4 text-brand-yellow" />
                      <span className="font-medium">{folder}</span>
                    </div>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-brand-yellow" />
              Lista Completa de Ficheiros
            </CardTitle>
            <CardDescription>
              Clique numa pasta para ver todos os ficheiros. Copie os URLs para usar num gestor de downloads.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[500px] overflow-y-auto">
            {folders.map(folder => {
              const folderFiles = allFiles.filter(f => f.folder === folder);
              const isOpen = expandedFolders.has(folder);
              
              return (
                <Collapsible key={folder} open={isOpen} onOpenChange={() => toggleFolder(folder)}>
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors">
                      <div className="flex items-center gap-3">
                        {isOpen ? (
                          <ChevronDown className="h-4 w-4 text-brand-yellow" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                        <Folder className="h-4 w-4 text-brand-yellow" />
                        <span className="font-medium">{folder}</span>
                      </div>
                      <Badge variant="secondary">{folderFiles.length}</Badge>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="ml-8 mt-2 space-y-1">
                      {folderFiles.map((file, idx) => (
                        <div 
                          key={idx}
                          className="flex items-center justify-between p-2 bg-zinc-900 rounded text-sm group hover:bg-zinc-800"
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <ImageIcon className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                            <span className="truncate">{file.path.split('/').pop()}</span>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(`${window.location.origin}${file.url}`);
                              }}
                              data-testid={`button-copy-${idx}`}
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              URL
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(file.url, '_blank');
                              }}
                              data-testid={`button-view-${idx}`}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Próximos Passos</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-yellow text-black flex items-center justify-center font-bold">1</span>
                <div>
                  <strong>Baixe o guia PDF</strong>
                  <p className="text-sm text-muted-foreground">Clique em "Gerar Guia PDF" e guarde o ficheiro</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-yellow text-black flex items-center justify-center font-bold">2</span>
                <div>
                  <strong>Baixe as imagens do Object Storage</strong>
                  <p className="text-sm text-muted-foreground">Vá a Admin → Media e baixe cada pasta</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-yellow text-black flex items-center justify-center font-bold">3</span>
                <div>
                  <strong>Exporte a base de dados</strong>
                  <p className="text-sm text-muted-foreground">Use o painel Database do Replit para exportar</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-yellow text-black flex items-center justify-center font-bold">4</span>
                <div>
                  <strong>Siga o guia passo a passo</strong>
                  <p className="text-sm text-muted-foreground">O PDF contém todas as instruções detalhadas</p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
