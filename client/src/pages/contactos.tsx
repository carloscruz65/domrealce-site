import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import GoogleMap from "@/components/GoogleMap";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { insertContactSchema, type InsertContact } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { ObjectUploader } from "@/components/ObjectUploader";
import { Button } from "@/components/ui/button";
import { Shield, Upload, FileText, X } from "lucide-react";
// Imagem agora vem do object storage

export default function Contactos() {
  const { toast } = useToast();

  // Fetch Google Maps API key
  const { data: mapsConfig } = useQuery<{ apiKey: string }>({
    queryKey: ['/api/config/google-maps-key'],
  });

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: '',
    anexos: [] as any[]
  });

  const submitMutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      return await apiRequest('POST', '/api/contact', data);
    },
    onSuccess: (data: any) => {
      toast({
        title: "Sucesso!",
        description: data.message || "Mensagem enviada com sucesso!",
        variant: "default",
      });
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        assunto: '',
        mensagem: '',
        anexos: []
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao enviar mensagem. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Converter ficheiros para o formato correto (array de strings)
      const ficheiros = formData.anexos?.map(file => 
        `${file.originalName} (${(file.size / 1024).toFixed(1)} KB)`
      ) || [];

      const dataToSubmit = {
        ...formData,
        ficheiros
      };

      const validatedData = insertContactSchema.parse(dataToSubmit);
      submitMutation.mutate(validatedData);
    } catch (error) {
      toast({
        title: "Erro de validação",
        description: "Por favor, verifique os dados inseridos.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      {/* Hero Section with Background Image - No spacing */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat bg-black"
        style={{
          backgroundImage: `url(/public-objects/media/1758149640133_cabine_telefÃ³nica_1757173064310.webp)`,
          backgroundSize: 'cover',
          backgroundPosition: 'right center',
        }}
      >
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg mb-4">
            Contacto
          </h1>
          <p className="text-lg md:text-xl text-white/80 drop-shadow-md">
            Entre em contacto connosco. Estamos aqui para ajudar com o seu projeto!
          </p>
        </div>
      </section>
      {/* Google Maps Section - Full Width */}
      <section className="bg-black -mt-20">
        {/* Interactive Google Map - Full Width */}
        {mapsConfig?.apiKey ? (
          <GoogleMap
            apiKey={mapsConfig.apiKey}
            center={{
              lat: 41.22940,
              lng: -8.3237
            }}
            zoom={17}
            className="w-full h-[700px]"
            address="Rua de Rebolido, 42, 4580-402 Gondalães, Paredes, Portugal"
            companyName="DOMREALCE"
          />
        ) : (
          <div className="w-full h-[500px] bg-gray-900 flex items-center justify-center">
            <div className="text-center text-brand-yellow">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-yellow mx-auto mb-4"></div>
              <p>A carregar mapa...</p>
            </div>
          </div>
        )}

        {/* Map Directions Button - Below Map */}
        <div className="container mx-auto px-4 py-4">
          <div className="text-center">
            <div className="inline-flex gap-4">
              <button
                onClick={() => {
                  window.open('https://www.google.com/maps/search/?api=1&query=Rua+de+Rebolido+42%2C+4580-402+Gondalães%2C+Paredes', '_blank');
                }}
                className="px-6 py-3 bg-brand-yellow text-black rounded-lg font-semibold hover:bg-brand-yellow/90 transition-all duration-300 flex items-center gap-2"
              >
                🗺️ Ver Direções no Google Maps
              </button>
              <button
                onClick={() => {
                  window.open('https://waze.com/ul?q=Rua+de+Rebolido+42+Gondalães+Paredes', '_blank');
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 flex items-center gap-2"
              >
                🚗 Abrir no Waze
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information and Form Section */}
      <section className="py-12 bg-black/90">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

            {/* Address and Contact Info - Left Side */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-brand-yellow/30 h-full">
                <h3 className="text-xl font-bold text-brand-yellow mb-6">Morada</h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg text-white font-semibold mb-2">
                      DomRealce
                    </h4>
                    <div className="text-white/80">
                      Rua de Rebolido, 42<br />
                      4580-402 Gondalães, Paredes<br />
                      Portugal
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-brand-yellow">📞</span>
                        <div>
                          <p className="text-white/60 text-sm">Telefone</p>
                          <p className="text-white font-medium">+351 930 682 725</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-brand-turquoise">✉️</span>
                        <div>
                          <p className="text-white/60 text-sm">Email</p>
                          <p className="text-white font-medium">carloscruz@domrealce.com</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-brand-coral">🕰️</span>
                        <div>
                          <p className="text-white/60 text-sm">Horário</p>
                          <p className="text-white font-medium">Segunda a Sexta<br />9h00 - 18h00</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('Rua de Rebolido 42, 4580-402 Gondalães, Paredes');
                        toast({ title: 'Morada copiada!', description: 'A morada foi copiada para a área de transferência.' });
                      }}
                      className="w-full px-4 py-2 bg-brand-turquoise/20 text-brand-turquoise rounded-lg hover:bg-brand-turquoise/30 transition-all duration-300 text-sm font-medium"
                    >
                      📋 Copiar Morada
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form - Right Side */}
            <div className="lg:col-span-2" id="formulario">
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-brand-yellow/30">
                <h3 className="text-2xl font-bold text-brand-yellow mb-6">Formulário de Contacto</h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white/80 mb-2 font-medium">Nome *</label>
                      <input
                        type="text"
                        value={formData.nome}
                        onChange={(e) => setFormData({...formData, nome: e.target.value})}
                        className="w-full p-3 bg-gray-800/50 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow transition-all duration-300"
                        placeholder="O seu nome"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white/80 mb-2 font-medium">Email *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full p-3 bg-gray-800/50 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow transition-all duration-300"
                        placeholder="o.seu.email@exemplo.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/80 mb-2 font-medium">Telefone</label>
                    <input
                      type="tel"
                      value={formData.telefone}
                      onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                      className="w-full p-3 bg-gray-800/50 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow transition-all duration-300"
                      placeholder="+351 900 000 000 (opcional)"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 mb-2 font-medium">Assunto *</label>
                    <input
                      type="text"
                      value={formData.assunto}
                      onChange={(e) => setFormData({...formData, assunto: e.target.value})}
                      className="w-full p-3 bg-gray-800/50 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow transition-all duration-300"
                      placeholder="Qual é o assunto da sua mensagem?"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 mb-2 font-medium">Mensagem *</label>
                    <textarea
                      value={formData.mensagem}
                      onChange={(e) => setFormData({...formData, mensagem: e.target.value})}
                      rows={4}
                      className="w-full p-3 bg-gray-800/50 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow transition-all duration-300 resize-none"
                      placeholder="Descreva o seu projeto ou dúvida em detalhe..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 mb-2 font-medium">Anexos (opcional)</label>
                    <input
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,.tiff,.tif,.svg,.ai,.pdf"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const fileData = files.map(file => ({
                          originalName: file.name,
                          size: file.size,
                          uploadURL: URL.createObjectURL(file),
                          file: file
                        }));
                        setFormData(prev => ({
                          ...prev,
                          anexos: [...prev.anexos, ...fileData]
                        }));
                      }}
                      className="w-full p-3 bg-gray-800/50 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-black file:bg-brand-yellow hover:file:bg-brand-yellow/90 file:cursor-pointer"
                    />
                    
                    <div className="mt-2 text-xs text-white/60 space-y-1">
                      <p>• Máximo 3 ficheiros, até 10MB cada</p>
                      <p>• Formatos aceites: JPG, JPEG, PNG, TIFF, SVG, AI, PDF</p>
                      <p>• <strong>Importante:</strong> Fontes devem ser convertidas em linhas antes do envio</p>
                    </div>

                    {formData.anexos && formData.anexos.length > 0 && (
                      <div className="mt-3">
                        <p className="text-white/60 mb-2 text-sm">Ficheiros anexados:</p>
                        <div className="space-y-2">
                          {formData.anexos.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-800/30 p-2 rounded border border-white/10">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-brand-turquoise" />
                                <span className="text-white/80 text-sm">{file.originalName}</span>
                                <span className="text-white/40 text-xs">({(file.size / 1024).toFixed(1)} KB)</span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    anexos: formData.anexos?.filter((_, i) => i !== index)
                                  });
                                }}
                                className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={submitMutation.isPending}
                      className="w-full bg-gradient-to-r from-brand-yellow to-brand-coral text-black font-semibold py-3 px-6 rounded-lg hover:from-brand-yellow/90 hover:to-brand-coral/90 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-black/30 border-t-black"></div>
                          A enviar...
                        </>
                      ) : (
                        'Enviar Mensagem'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Motivational Quote Section */}
      <section className="py-12 bg-gradient-to-b from-black/90 to-black">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <p className="text-2xl md:text-3xl font-italic text-white/90">
              "Estamos prontos para fazer seu projeto brilhar! 
              <span className="text-brand-yellow font-semibold"> Juntos, vamos mais longe.</span>"
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}