import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import Navigation from "@/components/navigation";
import { 
  ArrowLeft, Upload, Search, FolderOpen, Image, Trash2, 
  Copy, Download, RefreshCw, Settings, AlertCircle, 
  FileImage, Folder, Eye, Edit, Move
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface MediaFile {
  key: string;
  name: string;
  url: string;
  size: number;
  type: string;
  dimensions?: { width: number; height: number };
  pageRoute?: string;
  category?: string;
  alt?: string;
  tags?: string[];
  hash: string;
  uploadedAt: string;
}

interface MediaFolder {
  name: string;
  path: string;
  count: number;
  lastModified: string;
}

interface SyncResult {
  newFiles: number;
  updatedFiles: number;
  ignoredFiles: number;
  errors: string[];
}

export default function AdminMedia() {
  const { toast } = useToast();
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    loadMediaIndex();
    loadFolders();
  }, []);

  const loadMediaIndex = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/media');
      if (response.ok) {
        const data = await response.json();
        setMediaFiles(data.files || []);
      }
    } catch (error) {
      console.error('Error loading media:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar índice de mídia",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadFolders = async () => {
    try {
      const response = await fetch('/api/admin/media/folders');
      if (response.ok) {
        const data = await response.json();
        setFolders(data.folders || []);
      }
    } catch (error) {
      console.error('Error loading folders:', error);
    }
  };

  const syncGlobalImages = async () => {
    try {
      setSyncing(true);
      const response = await fetch('/api/admin/media/sync-global', {
        method: 'POST'
      });

      if (response.ok) {
        const result: SyncResult = await response.json();
        
        toast({
          title: "Sincronização Concluída",
          description: `${result.newFiles} novas, ${result.updatedFiles} atualizadas, ${result.ignoredFiles} ignoradas`,
        });

        if (result.errors.length > 0) {
          console.warn('Sync errors:', result.errors);
        }

        await loadMediaIndex();
        await loadFolders();
      } else {
        throw new Error('Falha na sincronização');
      }
    } catch (error) {
      console.error('Error syncing:', error);
      toast({
        title: "Erro",
        description: "Falha ao sincronizar imagens",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  const uploadFiles = async (files: FileList) => {
    try {
      setUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });

      // Add current folder context
      formData.append('folder', selectedFolder === 'all' ? 'media' : selectedFolder);

      const response = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        
        toast({
          title: "Upload Concluído",
          description: `${result.uploaded} ficheiros enviados com sucesso`,
        });

        await loadMediaIndex();
        await loadFolders();
      } else {
        throw new Error('Falha no upload');
      }
    } catch (error) {
      console.error('Error uploading:', error);
      toast({
        title: "Erro",
        description: "Falha ao enviar ficheiros",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteFiles = async (fileKeys: string[]) => {
    if (!confirm(`Eliminar ${fileKeys.length} ficheiro(s)? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      const response = await fetch('/api/admin/media/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keys: fileKeys }),
      });

      if (response.ok) {
        setMediaFiles(prev => prev.filter(file => !fileKeys.includes(file.key)));
        setSelectedFiles([]);
        
        toast({
          title: "Sucesso",
          description: `${fileKeys.length} ficheiro(s) eliminado(s)`,
        });
      } else {
        throw new Error('Falha ao eliminar');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      toast({
        title: "Erro",
        description: "Falha ao eliminar ficheiros",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Copiado",
      description: "URL copiado para a área de transferência",
    });
  };

  const filteredFiles = mediaFiles.filter(file => {
    const matchesFolder = selectedFolder === 'all' || 
      file.key.startsWith(`${selectedFolder}/`) ||
      file.category === selectedFolder;
    
    const matchesSearch = !searchTerm || 
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.alt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesFolder && matchesSearch;
  });

  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (file: MediaFile) => {
    if (file.type.startsWith('image/')) {
      return <FileImage className="h-5 w-5 text-blue-400" />;
    }
    return <FileImage className="h-5 w-5 text-gray-400" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Navigation />
        <div className="container mx-auto px-4 py-16 mt-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FFD700] mx-auto"></div>
            <p className="mt-4 text-gray-400">A carregar gestor de mídia...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
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
                onClick={syncGlobalImages}
                disabled={syncing}
                variant="outline"
                size="sm"
                className="gap-2 border-green-500 text-green-400"
              >
                <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Sincronizando...' : 'Sincronizar Imagens'}
              </Button>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => e.target.files && uploadFiles(e.target.files)}
                className="hidden"
                id="file-upload"
              />
              <Button
                asChild
                size="sm"
                className="gap-2 bg-blue-600 hover:bg-blue-700"
                disabled={uploading}
              >
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-4 w-4" />
                  {uploading ? 'Enviando...' : 'Upload'}
                </label>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <Image className="h-6 w-6 text-[#FFD700]" />
            <h1 className="text-2xl font-bold text-white">
              Gestor de Mídia Global
            </h1>
            <Badge variant="secondary" className="bg-[#FFD700] text-black">
              {filteredFiles.length} ficheiros
            </Badge>
          </div>

          {uploading && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Upload className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-300">A enviar ficheiros...</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-[#111111] border-[#333] mb-6">
              <CardHeader>
                <CardTitle className="text-[#FFD700] text-lg flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" />
                  Pastas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => setSelectedFolder('all')}
                  variant={selectedFolder === 'all' ? 'default' : 'outline'}
                  className="w-full justify-start gap-2"
                >
                  <Folder className="h-4 w-4" />
                  Todas ({mediaFiles.length})
                </Button>
                
                {folders.map((folder) => (
                  <Button
                    key={folder.path}
                    onClick={() => setSelectedFolder(folder.path)}
                    variant={selectedFolder === folder.path ? 'default' : 'outline'}
                    className="w-full justify-start gap-2 border-[#444] text-gray-300 hover:bg-[#222]"
                  >
                    <Folder className="h-4 w-4" />
                    {folder.name} ({folder.count})
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Sync Info */}
            <Card className="bg-[#111111] border-[#333]">
              <CardHeader>
                <CardTitle className="text-[#FFD700] text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Sincronização
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Padrão de Pastas:</p>
                      <p className="text-xs text-gray-400">
                        public/pages/&lt;rota&gt;/<br />
                        public/portfolio/&lt;categoria&gt;/<br />
                        public/media/
                      </p>
                    </div>
                  </div>
                  
                  <Separator className="bg-[#333]" />
                  
                  <div>
                    <p className="font-medium mb-1">Última sincronização:</p>
                    <p className="text-xs text-gray-400">
                      {new Date().toLocaleString('pt-PT')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Controls */}
            <Card className="bg-[#111111] border-[#333] mb-6">
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Pesquisar por nome, alt text ou tags..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-[#222] border-[#444] text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                      variant="outline"
                      size="sm"
                      className="border-[#444]"
                    >
                      {viewMode === 'grid' ? 'Lista' : 'Grid'}
                    </Button>

                    {selectedFiles.length > 0 && (
                      <Button
                        onClick={() => deleteFiles(selectedFiles)}
                        variant="outline"
                        size="sm"
                        className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Eliminar ({selectedFiles.length})
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Files Grid/List */}
            {filteredFiles.length === 0 ? (
              <Card className="bg-[#111111] border-[#333]">
                <CardContent className="py-12 text-center">
                  <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg mb-2">Nenhum ficheiro encontrado</p>
                  <p className="text-gray-500 text-sm">
                    {searchTerm ? 'Ajuste a pesquisa ou' : 'Sincronize imagens ou'} faça upload de novos ficheiros
                  </p>
                </CardContent>
              </Card>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredFiles.map((file) => (
                  <Card key={file.key} className="bg-[#111111] border-[#333] hover:border-[#FFD700] transition-colors">
                    <div className="aspect-square relative overflow-hidden rounded-t-lg">
                      {file.type.startsWith('image/') ? (
                        <img 
                          src={file.url} 
                          alt={file.alt || file.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#222] flex items-center justify-center">
                          {getFileIcon(file)}
                        </div>
                      )}
                      
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-6 w-6 p-0 bg-black/50 hover:bg-black/70"
                          onClick={() => copyToClipboard(file.url)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-6 w-6 p-0"
                          onClick={() => deleteFiles([file.key])}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="absolute top-2 left-2">
                        <input
                          type="checkbox"
                          checked={selectedFiles.includes(file.key)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFiles(prev => [...prev, file.key]);
                            } else {
                              setSelectedFiles(prev => prev.filter(k => k !== file.key));
                            }
                          }}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                      </div>
                    </div>
                    
                    <CardContent className="p-3">
                      <h3 className="text-white font-medium text-sm mb-1 truncate" title={file.name}>
                        {file.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs border-[#FFD700] text-[#FFD700]">
                          {file.category || 'media'}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {formatFileSize(file.size)}
                        </span>
                      </div>
                      {file.dimensions && (
                        <p className="text-xs text-gray-400">
                          {file.dimensions.width} × {file.dimensions.height}
                        </p>
                      )}
                      {file.pageRoute && (
                        <p className="text-xs text-blue-400 truncate">
                          → {file.pageRoute}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-[#111111] border-[#333]">
                <CardContent className="p-0">
                  <div className="divide-y divide-[#333]">
                    {filteredFiles.map((file) => (
                      <div key={file.key} className="p-4 hover:bg-[#1a1a1a] transition-colors">
                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            checked={selectedFiles.includes(file.key)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedFiles(prev => [...prev, file.key]);
                              } else {
                                setSelectedFiles(prev => prev.filter(k => k !== file.key));
                              }
                            }}
                            className="w-4 h-4 rounded border-gray-300"
                          />
                          
                          <div className="w-12 h-12 rounded overflow-hidden bg-[#222] flex items-center justify-center">
                            {file.type.startsWith('image/') ? (
                              <img 
                                src={file.url} 
                                alt={file.alt || file.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              getFileIcon(file)
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-medium truncate">{file.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs border-[#FFD700] text-[#FFD700]">
                                {file.category || 'media'}
                              </Badge>
                              <span className="text-xs text-gray-400">
                                {formatFileSize(file.size)}
                              </span>
                              {file.dimensions && (
                                <span className="text-xs text-gray-400">
                                  {file.dimensions.width} × {file.dimensions.height}
                                </span>
                              )}
                            </div>
                            {file.pageRoute && (
                              <p className="text-xs text-blue-400 mt-1">
                                Página: {file.pageRoute}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(file.url)}
                              className="border-[#444] text-gray-300"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteFiles([file.key])}
                              className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}