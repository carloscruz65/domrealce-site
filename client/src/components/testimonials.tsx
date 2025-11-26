import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Testimonial {
  id: string;
  name: string;
  company: string;
  role: string;
  content: string;
  rating: number;
  image?: string;
}

interface TestimonialsProps {
  testimonials?: Testimonial[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'João Silva',
    company: 'Silva & Associados',
    role: 'Diretor Executivo',
    content: 'Qualidade excepcional e prazos cumpridos. A DOMREALCE transformou a identidade visual da nossa empresa.',
    rating: 5,
    image: '👨‍💼'
  },
  {
    id: '2',
    name: 'Maria Santos',
    company: 'Boutique Premium',
    role: 'Proprietária',
    content: 'Os impressos da DOMREALCE destacam-se pela qualidade. Nossos clientes notam a diferença imediatamente.',
    rating: 5,
    image: '👩‍💼'
  },
  {
    id: '3',
    name: 'Carlos Ferreira',
    company: 'Transportes Ferreira',
    role: 'Gestor de Frota',
    content: 'A decoração das nossas viaturas chamou muito a atenção. Ótimo retorno no investimento publicitário.',
    rating: 5,
    image: '👨‍💻'
  },
  {
    id: '4',
    name: 'Ana Costa',
    company: 'Hotel Costa Dourada',
    role: 'Diretora de Marketing',
    content: 'Os sinalizadores e decoração dos espaços ficaram espetaculares. Recomendo vivamente!',
    rating: 5,
    image: '👩‍💼'
  }
];

export default function Testimonials({ testimonials = defaultTestimonials, autoPlay = true, autoPlayInterval = 5000 }: TestimonialsProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, testimonials.length]);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const testimonial = testimonials[current];

  return (
    <section className="py-16 px-4 bg-black border-t border-gray-900">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-heading mb-3">
            Testemunhos de <span className="text-brand-yellow">Clientes</span>
          </h2>
          <p className="text-gray-400 text-lg">Veja o que nossos clientes dizem sobre nosso trabalho</p>
        </div>

        <div className="relative">
          <Card className="bg-transparent border border-gray-700 min-h-[280px] flex items-center" data-testid="testimonial-card">
            <CardContent className="p-8 w-full">
              {/* Rating Stars */}
              <div className="flex gap-1 mb-4" data-testid="testimonial-rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-brand-yellow text-brand-yellow" />
                ))}
              </div>

              {/* Content */}
              <p className="text-xl text-white mb-6 italic leading-relaxed" data-testid="testimonial-content">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4" data-testid="testimonial-author">
                {testimonial.image && (
                  <div className="text-4xl">{testimonial.image}</div>
                )}
                <div>
                  <p className="font-semibold text-white text-lg" data-testid={`testimonial-name-${testimonial.id}`}>
                    {testimonial.name}
                  </p>
                  <p className="text-brand-yellow text-sm" data-testid={`testimonial-company-${testimonial.id}`}>
                    {testimonial.role} @ {testimonial.company}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <Button
              onClick={prev}
              variant="outline"
              className="border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-black"
              data-testid="button-prev-testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            {/* Dots Indicator */}
            <div className="flex gap-2" data-testid="testimonial-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === current ? 'bg-brand-yellow w-6' : 'bg-gray-600'
                  }`}
                  data-testid={`dot-testimonial-${index}`}
                />
              ))}
            </div>

            <Button
              onClick={next}
              variant="outline"
              className="border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-black"
              data-testid="button-next-testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
