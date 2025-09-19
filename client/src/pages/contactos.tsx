import { PhoneCall, Clock, MapPin, Mail, Upload, X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { insertContactSchema, type InsertContact } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { ObjectUploader } from "@/components/ObjectUploader";
import { Button } from "@/components/ui/button";

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  assunto: string;
  empresa?: string;
  mensagem: string;
  anexos: any[];
}

export default function ContactosPage() {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    empresa: '',
    mensagem: '',
    anexos: []
  });

  // Fetch Google Maps API key
  const { data: configData } = useQuery({
    queryKey: ['/api/config/google-maps-key'],
  });

  const submitMutation = useMutation({
    mutationFn: (data: InsertContact) => apiRequest('/api/contact', 'POST', data),
    onSuccess: () => {
      toast({
        title: "Mensagem enviada!",
        description: "Obrigado pelo seu contacto. Responderemos brevemente.",
      });
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        assunto: '',
        empresa: '',
        mensagem: '',
        anexos: []
      });
    },
    onError: (error: any) => {
      console.error('Erro ao enviar:', error);
      toast({
        title: "Erro ao enviar",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Construir payload apenas com campos aceites pelo schema
      const payload: InsertContact = {
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        telefone: formData.telefone?.trim() || undefined,
        empresa: formData.empresa?.trim() || undefined,
        mensagem: formData.mensagem.trim(),
        ficheiros: formData.anexos?.map(file => file.uploadURL) || []
      };

      const validatedData = insertContactSchema.parse(payload);
      submitMutation.mutate(validatedData);
    } catch (error) {
      console.error('Erro de validação:', error);
      toast({
        title: "Erro de validação",
        description: "Por favor, verifique os dados inseridos.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-brand-yellow via-brand-coral to-brand-turquoise pt-20 pb-32">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Contactos
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Estamos aqui para transformar as suas ideias em realidade. 
              Entre em contacto connosco para orçamentos gratuitos e soluções personalizadas.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="container mx-auto px-4 py-2 -mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/10">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Envie a sua mensagem
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 mb-2 font-medium">Nome *</label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    className="w-full p-3 bg-gray-700/50 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-brand-yellow"
                    placeholder="O seu nome completo"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/80 mb-2 font-medium">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-3 bg-gray-700/50 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-brand-yellow"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 mb-2 font-medium">Telefone</label>
                  <input
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                    className="w-full p-3 bg-gray-700/50 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-brand-yellow"
                    placeholder="+351 900 000 000"
                  />
                </div>
                <div>
                  <label className="block text-white/80 mb-2 font-medium">Assunto</label>
                  <input
                    type="text"
                    value={formData.assunto}
                    onChange={(e) => setFormData(prev => ({ ...prev, assunto: e.target.value }))}
                    className="w-full p-3 bg-gray-700/50 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-brand-yellow"
                    placeholder="Assunto da mensagem"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 mb-2 font-medium">Empresa</label>
                <input
                  type="text"
                  value={formData.empresa}
                  onChange={(e) => setFormData(prev => ({ ...prev, empresa: e.target.value }))}
                  className="w-full p-3 bg-gray-700/50 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-brand-yellow"
                  placeholder="Nome da sua empresa"
                />
              </div>

              <div>
                <label className="block text-white/80 mb-2 font-medium">Mensagem *</label>
                <textarea
                  value={formData.mensagem}
                  onChange={(e) => setFormData(prev => ({ ...prev, mensagem: e.target.value }))}
                  rows={5}
                  className="w-full p-3 bg-gray-700/50 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-brand-yellow resize-vertical"
                  placeholder="Descreva o seu projeto ou dúvida..."
                  required
                />
              </div>

              <div>
                <label className="block text-white/80 mb-2 font-medium">Anexos (opcional)</label>
                <ObjectUploader
                  maxNumberOfFiles={3}
                  maxFileSize={10485760}
                  onGetUploadParameters={async () => {
                    try {
                      const response = await fetch('/api/objects/upload', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' }
                      });
                      if (!response.ok) {
                        throw new Error(`Erro HTTP: ${response.status}`);
                      }
                      const data = await response.json();
                      return {
                        method: 'PUT' as const,
                        url: data.uploadURL,
                      };
                    } catch (error) {
                      console.error('Erro ao obter URL de upload:', error);
                      throw error;
                    }
                  }}
                  onComplete={(result) => {
                    try {
                      const uploadedFiles = result.successful?.map(file => ({
                        originalName: file.name,
                        size: file.size,
                        uploadURL: file.uploadURL,
                      })) || [];
                      setFormData(prev => ({
                        ...prev,
                        anexos: [...prev.anexos, ...uploadedFiles]
                      }));
                    } catch (error) {
                      console.error('Erro ao processar ficheiros carregados:', error);
                    }
                  }}
                  buttonClassName="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Anexar Ficheiros
                </ObjectUploader>
                
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
                        <div key={index} className="flex items-center justify-between bg-gray-700/30 p-2 rounded">
                          <div className="flex items-center text-white/80 text-sm">
                            <Upload className="w-4 h-4 mr-2" />
                            <span>{file.originalName}</span>
                            <span className="ml-2 text-white/50">({(file.size / 1024).toFixed(1)} KB)</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              anexos: prev.anexos.filter((_, i) => i !== index)
                            }))}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full bg-gradient-to-r from-brand-yellow to-brand-coral text-black font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {submitMutation.isPending ? "A enviar..." : "Enviar Mensagem"}
              </button>
            </form>
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-8">
            {/* Contact Info */}
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Contacte-nos directamente</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-brand-yellow rounded-lg flex items-center justify-center flex-shrink-0">
                    <PhoneCall className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Telefone</p>
                    <p className="text-white/70">+351 930 682 725</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-brand-turquoise rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Email</p>
                    <p className="text-white/70">carloscruz@domrealce.com</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-brand-coral rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Morada</p>
                    <p className="text-white/70">Rua de Rebolido, 42<br />4580-402 Gondalães, Paredes</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-brand-blue rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Horário</p>
                    <p className="text-white/70">Segunda a Sexta: 9h - 18h</p>
                  </div>
                </div>
              </div>

              {/* Cabine Telefónica */}
              <div className="mt-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
                  <PhoneCall className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Contacto Direto</h4>
                <a 
                  href="https://wa.me/351930682725?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20os%20vossos%20serviços."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                >
                  💬 WhatsApp
                </a>
              </div>
            </div>

            {/* Map */}
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <div className="h-64">
                {configData?.apiKey ? (
                  <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3006.2345678901234!2d-8.5591234567891!3d41.2234567891234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDEzJzI0LjQiTiA4wrAzMycyOC44Ilc!5e0!3m2!1spt!2spt!4v1234567890123&q=Rua+de+Rebolido,+42,+4580-402+Gondalães,+Paredes`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localização DOMREALCE - Rua de Rebolido, 42, Gondalães, Paredes"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <div className="text-center text-white/70">
                      <MapPin className="w-12 h-12 mx-auto mb-2" />
                      <p>Rua de Rebolido, 42</p>
                      <p>4580-402 Gondalães, Paredes</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}