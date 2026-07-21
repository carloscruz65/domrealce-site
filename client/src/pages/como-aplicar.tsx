import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, AlertCircle, Download } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { trackWhatsAppConversion } from "@/utils/trackWhatsApp";

export default function ComoAplicarPapelParede() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navigation />
      
      {/* Header */}
      <div className="bg-[#111111] border-b border-[#333] mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/loja/papel-parede">
              <Button variant="outline" size="sm" className="gap-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black">
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Papel de Parede
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Manuais de <span className="text-[#FFD700]">Aplicação</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Faça download dos manuais de instruções de aplicação profissional
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        
        {/* Manuais de Aplicação */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#FFD700] mb-6 text-center">
            📚 Manuais de Instrução de Aplicação
          </h2>
          <p className="text-gray-300 text-center mb-8">
            Faça download dos nossos manuais detalhados para aplicação profissional de papel de parede
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Manual Vinil Autocolante */}
            <Card className="bg-[#111111] border-[#20B2AA] hover:border-[#20B2AA]/80 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-[#20B2AA]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-8 text-[#20B2AA]" />
                </div>
                <h3 className="text-xl font-bold text-[#20B2AA] mb-3">
                  Manual Vinil Autocolante
                </h3>
                <p className="text-gray-300 mb-4 text-sm">
                  Guia completo para aplicação de vinil autocolante em tiles de grande formato com emenda invisível
                </p>
                <ul className="text-xs text-gray-400 space-y-1 mb-6 text-left">
                  <li>• Aplicação a seco (sem água)</li>
                  <li>• Técnica de sobreposição 5mm</li>
                  <li>• Ferramentas necessárias</li>
                  <li>• Preparação da superfície</li>
                  <li>• Acabamentos profissionais</li>
                </ul>
                <Button 
                  className="w-full bg-[#20B2AA] text-black hover:bg-[#20B2AA]/90"
                  onClick={() => window.open('/manuais/manual-vinil-autocolante.pdf', '_blank')}
                >
                  📥 Download PDF
                </Button>
              </CardContent>
            </Card>

            {/* Manual Papel Tradicional */}
            <Card className="bg-[#111111] border-[#FFD700] hover:border-[#FFD700]/80 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-[#FFD700]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-8 text-[#FFD700]" />
                </div>
                <h3 className="text-xl font-bold text-[#FFD700] mb-3">
                  Manual Papel Tradicional
                </h3>
                <p className="text-gray-300 mb-4 text-sm">
                  Guia completo para aplicação de papel de parede tradicional com cola, passo a passo profissional
                </p>
                <ul className="text-xs text-gray-400 space-y-1 mb-6 text-left">
                  <li>• Preparação da cola</li>
                  <li>• Aplicação com rolo</li>
                  <li>• Emendas perfeitas</li>
                  <li>• Preparação da parede</li>
                  <li>• Cortes e acabamentos</li>
                </ul>
                <Button 
                  className="w-full bg-[#FFD700] text-black hover:bg-[#FFD700]/90"
                  onClick={() => window.open('/manuais/manual-papel-parede-tradicional.pdf', '_blank')}
                >
                  📥 Download PDF
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Dicas Rápidas */}
        <Card className="bg-[#111111] border-[#FF6347] mb-12">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-[#FF6347] mb-4 text-center">
              💡 Dicas Importantes
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-white mb-3">⚠️ Antes de Começar</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• <strong>Vinil:</strong> Aplicação a seco, sem água</li>
                  <li>• <strong>Papel tradicional:</strong> Teste área pequena primeiro</li>
                  <li>• Trabalhe com boa iluminação</li>
                  <li>• Mantenha temperatura ambiente estável</li>
                  <li>• Tenha todas as ferramentas preparadas</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-white mb-3">⚠️ Problemas Comuns</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• <strong>Vinil:</strong> Sobreposição inadequada (mín. 5mm)</li>
                  <li>• <strong>Papel:</strong> Bolhas - alisar imediatamente</li>
                  <li>• Juntas visíveis: pressionar bem</li>
                  <li>• Padrão desalinhado: medir com precisão</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Aplicação Profissional */}
        <Card className="bg-gradient-to-r from-[#FFD700]/10 to-[#20B2AA]/10 border-[#FFD700]">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">
              🔧 Aplicação Profissional Recomendada
            </h2>
            <p className="text-gray-300 mb-6">
              Para garantir resultado perfeito, recomendamos aplicação profissional. Contacte-nos para orçamento sem compromisso.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contactos#formulario">
                <Button className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90 px-6 py-3">
                  💬 Contactar para Orçamento
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="border-[#20B2AA] text-[#20B2AA] hover:bg-[#20B2AA] hover:text-black px-6 py-3"
                onClick={() => trackWhatsAppConversion('https://wa.me/351910014140')}
              >
                📱 WhatsApp: 910 014 140
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>

      <Footer />
    </div>
  );
}