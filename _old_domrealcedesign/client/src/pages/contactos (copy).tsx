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
    empresa: '',
    mensagem: '',
    ficheiros: [] as string[]
  });

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      return await apiRequest('/api/contact', 'POST', data);
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
        empresa: '',
        mensagem: '',
        ficheiros: []
      });
      setUploadedFiles([]);
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao enviar mensagem. Tente novamente.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dataToSubmit = {
        ...formData,
        ficheiros: uploadedFiles
      };

      const validatedData = insertContactSchema.parse(dataToSubmit);
      mutation.mutate(validatedData);
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: "Erro de validação",
        description: "Por favor, verifique os dados inseridos.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = async () => {
    try {
      const response = await apiRequest('/api/objects/upload', 'POST');
      return {
        method: 'PUT' as const,
        url: (response as any).uploadURL,
      };
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao preparar upload. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleUploadComplete = (result: any) => {
    const newFiles = result.successful.map((file: any) => file.uploadURL);
    setUploadedFiles(prev => [...prev, ...newFiles]);
    toast({
      title: "Ficheiros enviados",
      description: `${result.successful.length} ficheiro(s) enviado(s) com sucesso.`,
      variant: "default",
    });
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-28 pb-4 bg-black">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            <span className="text-brand-yellow">Contacto</span>
          </h1>
          <p className="text-lg text-white/90 mb-4 max-w-2xl mx-auto">
            Entre em contacto connosco. Estamos aqui para ajudar com o seu projeto de comunicação visual.
          </p>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="py-6 bg-black/90">
        <div className="container mx-auto px-4">
          <h3 className="text-xl font-semibold text-brand-yellow mb-6 text-center">Onde Estamos</h3>

          {/* Interactive Google Map */}
          {mapsConfig?.apiKey ? (
            <GoogleMap
              apiKey={mapsConfig.apiKey}
              center={{
                lat: 41.229460, // Latitude da morada
                lng: -8.323721, // Longitude da morada
              }}
              zoom={17}
              className="w-full h-[500px] mb-6" // Mapa com largura total e altura ajustada
              address="Rua de Rebolido, 42, 4580-402 Gondalães, Paredes, Portugal"
              companyName="DOMREALCE"
              options={{
                styles: [
                  {
                    "elementType": "geometry",
                    "stylers": [
                      {
                        "color": "#ffffff" // Cor de fundo clara
                      }
                    ]
                  },
                  {
                    "elementType": "labels.icon",
                    "stylers": [
                      {
                        "visibility": "off"
                      }
                    ]
                  },
                  {
                    "featureType": "administrative",
                    "elementType": "geometry",
                    "stylers": [
                      {
                        "color": "#b0b0b0" // Cor mais suave para o texto
                      }
                    ]
                  },
                  {
                    "featureType": "road",
                    "elementType": "geometry",
                    "stylers": [
                      {
                        "color": "#dcdcdc" // Cor clara para as estradas
                      }
                    ]
                  },
                  {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [
                      {
                        "color": "#b0e0e6" // Cor clara para áreas de água
                      }
                    ]
                  }
                ]
              }}
            />
          ) : (
            <div className="w-full h-[500px] mb-6 bg-gray-900 rounded-lg border-2 border-brand-yellow/30 flex items-center justify-center">
              <div className="text-center text-brand-yellow">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-yellow mx-auto mb-4"></div>
                <p>A carregar mapa...</p>
              </div>
            </div>
          )}

          {/* Address Info Below Map */}
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-brand-yellow/30">
              <div className="space-y-4">
                <div className="text-lg text-white font-semibold">
                  📍 DOMREALCE
                </div>
                <div className="text-white/80">
                  Rua de Rebolido, 42<br />
                  4580-402 Gondalães, Paredes<br />
                  Portugal
                </div>
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-2">
                    <h4 className="text-md font-semibold mb-2 text-brand-yellow">Telefone</h4>
                    <p className="text-white/80 text-sm">+351 930 682 725</p>
                  </div>
                  <div className="text-center p-2">
                    <h4 className="text-md font-semibold mb-2 text-brand-turquoise">Email</h4>
                    <p className="text-white/80 text-sm">carloscruz@domrealce.com</p>
                  </div>
                  <div className="text-center p-2">
                    <h4 className="text-md font-semibold mb-2 text-brand-coral">Horário</h4>
                    <p className="text-white/80 text-sm">Seg-Sex: 9h-18h</p>
                  </div>
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('Rua de Rebolido 42, 4580-402 Gondalães, Paredes');
                      alert('Morada copiada para a área de transferência!');
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-yellow/20 border border-brand-yellow text-brand-yellow rounded-lg hover:bg-brand-yellow hover:text-black transition-all duration-300"
                  >
                    📋 Copiar Morada
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}