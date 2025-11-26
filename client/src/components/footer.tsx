import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
// Logo agora vem do object storage

export default function Footer() {
  return (
    <footer id="contactos" className="bg-black border-t border-brand-turquoise py-16">
      <div className="container mx-auto px-4">
        {/* Logo centralizado */}
        <div className="text-center mb-12">
          <img 
            src="/public-objects/essenciais/1758147535288_domrealce-logo.png" 
            alt="DOMREALCE Logo" 
            className="h-16 w-auto mx-auto"
          />
        </div>

        {/* Informações principais em linha */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Telefone e Email */}
          <div className="text-left">
            <div className="flex items-center mb-4">
              <Phone className="text-brand-yellow mr-3" size={20} />
              <p className="text-white/80">+351 930 682 725</p>
            </div>
            <div className="flex items-center">
              <Mail className="text-brand-turquoise mr-3 flex-shrink-0" size={20} />
              <p className="text-white/80">carloscruz@domrealce.com</p>
            </div>
          </div>

          {/* Morada */}
          <div className="text-left">
            <div className="flex items-start">
              <MapPin className="text-brand-coral mr-3 mt-1" size={20} />
              <p className="text-white/80">
                Rua de Rebolido, 42<br />
                4580-402 Gondalães, Paredes
              </p>
            </div>
          </div>

          {/* Horário */}
          <div className="text-left">
            <div className="flex items-start">
              <Clock className="text-brand-yellow mr-3 mt-1" size={20} />
              <div className="text-white/80 text-sm">
                <p>Segunda-Sexta: 9h00-18h00</p>
                <p>Sábado: 9h00-13h00</p>
                <p>Domingo: Encerrado</p>
              </div>
            </div>
          </div>
        </div>

        {/* Redes Sociais */}
        <div className="text-center mb-8">
          <div className="flex justify-center space-x-4">
            <a 
              href="https://www.facebook.com/DomrealcePublicidade/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 bg-brand-blue rounded-full text-white hover:bg-blue-600 transition-colors flex items-center justify-center"
            >
              <span className="sr-only">Facebook</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <Button
              size="icon"
              className="w-10 h-10 bg-brand-coral rounded-full text-white hover:bg-red-500 transition-colors"
            >
              <span className="sr-only">Instagram</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </Button>
            <a
              href="https://www.linkedin.com/company/51830077/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button
                size="icon"
                className="w-10 h-10 bg-brand-turquoise rounded-full text-black hover:bg-cyan-400 transition-colors"
              >
                <span className="sr-only">LinkedIn</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </Button>
            </a>
            <a 
              href="https://wa.me/351930682725?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20os%20vossos%20serviços."
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button
                size="icon"
                className="w-10 h-10 bg-brand-yellow rounded-full text-black hover:bg-yellow-400 transition-colors"
              >
                <span className="sr-only">WhatsApp</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </Button>
            </a>
          </div>
        </div>

        {/* WhatsApp CTA */}
        <div className=" from-brand-turquoise to-brand-blue rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-black font-heading font-semibold mb-2">Fale connosco via WhatsApp</h4>
              <p className="text-black/80">Resposta rápida e atendimento personalizado</p>
            </div>
            <a 
              href="https://wa.me/351930682725?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20os%20vossos%20serviços."
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button className="bg-black text-brand-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-coral hover:text-white transition-colors">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                Contactar via WhatsApp
              </Button>
            </a>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-brand-blue pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 mb-4 md:mb-0">
            &copy; 2024 DOMREALCE. Todos os direitos reservados.
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-end text-sm">
            <Link href="/politica-privacidade" className="text-white/60 hover:text-brand-turquoise transition-colors">Política de Privacidade</Link>
            <Link href="/termos-condicoes" className="text-white/60 hover:text-brand-turquoise transition-colors">Termos e Condições</Link>
            <Link href="/politica-cookies" className="text-white/60 hover:text-brand-turquoise transition-colors">Política de Cookies</Link>
            <Link href="/aviso-legal" className="text-white/60 hover:text-brand-turquoise transition-colors">Aviso Legal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
