import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useToast } from "@/hooks/use-toast";

export default function AdminTexturas() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  const handleAutoGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/auto-generate-covers', {
        method: 'POST'
      });
      
      const result = await response.json();
      setLastResult(result);
      
      if (response.ok) {
        toast({
          title: "Geração automática concluída!",
          description: `${result.coversGenerated?.length || 0} novas capas geradas.`,
        });
      } else {
        toast({
          title: "Erro na geração",
          description: result.error || "Erro desconhecido",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha na comunicação com o servidor",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navigation />
      
      {/* Header */}
      <div className="bg-[#111111] border-b border-[#333] mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/loja">
              <Button variant="outline" size="sm" className="gap-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black">
                <ArrowLeft className="h-4 w-4" />
                Voltar à Loja
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Administração de <span className="text-[#FFD700]">Texturas</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Gere automaticamente capas para novas categorias de texturas
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Auto Generation Card */}
          <Card className="bg-[#111111] border-[#333] mb-8">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-[#FFD700] mb-4">
                  Geração Automática de Capas
                </h2>
                <p className="text-gray-300 mb-6">
                  Sempre que adicionar uma nova pasta em texturas, clique no botão abaixo para gerar automaticamente a capa correspondente na loja.
                </p>
                
                <Button
                  onClick={handleAutoGenerate}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-[#FFD700] to-[#20B2AA] text-black font-bold py-3 px-8 hover:opacity-90 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      A Gerar Capas...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2" />
                      Gerar Capas Automaticamente
                    </>
                  )}
                </Button>
              </div>

              {/* Instructions */}
              <div className="bg-[#0a0a0a] rounded-lg p-6 border border-[#333]">
                <h3 className="text-lg font-semibold text-[#FFD700] mb-4">Como Funciona:</h3>
                <ol className="text-gray-300 space-y-2 list-decimal list-inside">
                  <li>Adicione uma nova pasta em <code className="bg-[#333] px-2 py-1 rounded">loja/papel-de-parede/texturas/</code></li>
                  <li>Coloque as imagens das texturas dentro da nova pasta</li>
                  <li>Execute o upload das texturas individuais</li>
                  <li>Clique no botão "Gerar Capas Automaticamente"</li>
                  <li>O sistema detecta automaticamente novas categorias e cria as capas</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {lastResult && (
            <Card className="bg-[#111111] border-[#333]">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-[#FFD700] mb-4">
                  Último Resultado
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Categories Found */}
                  <div>
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      Categorias Encontradas ({lastResult.categoriesFound?.length || 0})
                    </h4>
                    <div className="space-y-2">
                      {lastResult.categoriesFound?.map((category: string) => (
                        <div key={category} className="bg-[#0a0a0a] p-3 rounded border border-[#333]">
                          <span className="text-gray-300">{category}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Generated Covers */}
                  <div>
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      {lastResult.coversGenerated?.length > 0 ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                      )}
                      Capas Geradas ({lastResult.coversGenerated?.length || 0})
                    </h4>
                    <div className="space-y-2">
                      {lastResult.coversGenerated?.length > 0 ? (
                        lastResult.coversGenerated.map((cover: any) => (
                          <div key={cover.category} className="bg-[#0a0a0a] p-3 rounded border border-[#333]">
                            <div className="text-[#FFD700] font-semibold">{cover.category}</div>
                            <div className="text-xs text-gray-400">Fonte: {cover.source}</div>
                          </div>
                        ))
                      ) : (
                        <div className="bg-[#0a0a0a] p-3 rounded border border-[#333] text-center">
                          <span className="text-gray-400">Todas as capas já existem</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-[#0a0a0a] rounded border border-[#333]">
                  <p className="text-sm text-gray-300">
                    <strong>Resultado:</strong> {lastResult.message}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}