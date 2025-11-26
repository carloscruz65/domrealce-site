import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import "./ClientLogos.css";

interface ClientLogo {
  id: string;
  url: string;
  clientName: string;
  fileName: string;
}

interface LogosResponse {
  logos: ClientLogo[];
}

const fallbackLogos: ClientLogo[] = [
  { id: "placeholder-1", url: "", clientName: "COLE O NOME DO CLIENTE AQUI", fileName: "placeholder-1" },
  { id: "placeholder-2", url: "", clientName: "COLE O NOME DO CLIENTE AQUI", fileName: "placeholder-2" },
  { id: "placeholder-3", url: "", clientName: "COLE O NOME DO CLIENTE AQUI", fileName: "placeholder-3" },
  { id: "placeholder-4", url: "", clientName: "COLE O NOME DO CLIENTE AQUI", fileName: "placeholder-4" },
  { id: "placeholder-5", url: "", clientName: "COLE O NOME DO CLIENTE AQUI", fileName: "placeholder-5" },
  { id: "placeholder-6", url: "", clientName: "COLE O NOME DO CLIENTE AQUI", fileName: "placeholder-6" },
];

export default function ClientLogos() {
  const [translateX, setTranslateX] = useState(0);
  const [mousePosition, setMousePosition] = useState(0.5); // 0.5 = centro
  const [isMouseOver, setIsMouseOver] = useState(false);
  const animationRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Carregar logótipos da API (object storage)
  const { data: logosData, isLoading } = useQuery<LogosResponse>({
    queryKey: ['/api/client-logos'],
    refetchInterval: 10000, // Atualizar a cada 10 segundos para novos logótipos
  });

  // Usar logótipos reais ou fallback
  const clientLogos = (logosData?.logos && logosData.logos.length > 0) ? logosData.logos : fallbackLogos;
  
  // Duplicar os logos para criar o efeito infinito
  const duplicatedLogos = [...clientLogos, ...clientLogos, ...clientLogos];

  // Controlar movimento baseado na posição do rato ou movimento automático
  useEffect(() => {
    const animate = () => {
      if (isMouseOver) {
        // Rato sobre os logótipos - controlo manual
        if (mousePosition < 0.4) {
          // Rato à esquerda - mover logótipos para a direita
          setTranslateX(prev => prev + 2);
        } else if (mousePosition > 0.6) {
          // Rato à direita - mover logótipos para a esquerda
          setTranslateX(prev => prev - 2);
        }
        // Entre 0.4 e 0.6 (centro) - não mexer
      } else {
        // Sem rato - movimento automático para a esquerda
        setTranslateX(prev => {
          const newTranslateX = prev - 1;
          // Resetar quando completamos um ciclo completo
          // Cada logo tem aprox. 200px de largura (incluindo gap)
          const logoWidth = 200;
          const totalWidth = clientLogos.length * logoWidth;
          
          if (Math.abs(newTranslateX) >= totalWidth) {
            return 0;
          }
          return newTranslateX;
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePosition, isMouseOver, clientLogos.length]);

  // Detectar posição do rato
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    setMousePosition(x / width); // Normalizar entre 0 e 1
  };

  // Detectar quando rato entra e sai
  const handleMouseEnter = () => {
    setIsMouseOver(true);
  };

  const handleMouseLeave = () => {
    setIsMouseOver(false);
    setMousePosition(0.5); // Voltar ao centro
  };

  if (isLoading) {
    return (
      <section data-scroll className="py-16 px-4 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto text-center">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section data-scroll className="py-16 bg-[#0a0a0a] w-full">
      {/* Título */}
      <div className="text-center mb-12 px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          Clientes que Confiam em Nós
        </h2>
      </div>

      {/* Linha Horizontal de Logótipos com Movimento */}
      <div 
        ref={containerRef}
        className="relative overflow-hidden cursor-none w-full"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
          <div 
            className="flex items-center gap-8 transition-transform duration-100 ease-linear"
            style={{
              transform: `translateX(${translateX}px)`,
              width: 'fit-content'
            }}
          >
            {duplicatedLogos.map((logo, index) => (
              <div
                key={`${logo.id}-${index}`}
                className="flex-shrink-0 animate-fade-in-scale"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Container do Logótipo */}
                <div className="flex items-center justify-center group">
                  {/* IMAGEM DO LOGÓTIPO */}
                  {logo.url ? (
                    <div className="flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                      <img 
                        src={logo.url} 
                        alt={`Logótipo ${logo.clientName}`}
                        className="max-h-32 w-auto object-contain transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          console.log('Erro ao carregar logótipo:', logo.url);
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) {
                            fallback.classList.remove('hidden');
                          }
                        }}
                      />
                      {/* Fallback para erro de imagem */}
                      <div className="hidden bg-gray-800 rounded-lg p-4 border-2 border-dashed border-gray-600">
                        <span className="text-gray-400 text-sm font-medium text-center">
                          COLE LOGO AQUI
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-800 rounded-lg p-6 border-2 border-dashed border-gray-600 group-hover:border-brand-yellow transition-colors">
                      <span className="text-gray-400 text-sm font-medium text-center">
                        COLE LOGO AQUI
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
    </section>
  );
}