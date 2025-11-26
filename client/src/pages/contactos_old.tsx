import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { insertContactSchema, type InsertContact } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { ObjectUploader } from "@/components/ObjectUploader";
import { Button } from "@/components/ui/button";
import { Shield, Upload } from "lucide-react";

export default function Contactos() {
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

      {/* Contact Information */}
      <section className="py-4 bg-black/90">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-2">
              <h3 className="text-lg font-semibold mb-2 text-brand-yellow">Telefone</h3>
              <p className="text-white/80 text-sm">+351 930 682 725</p>
            </div>

            <div className="text-center p-2">
              <h3 className="text-lg font-semibold mb-2 text-brand-turquoise">Email</h3>
              <p className="text-white/80 text-sm">carloscruz@domrealce.com</p>
            </div>

            <div className="text-center p-2">
              <h3 className="text-lg font-semibold mb-2 text-brand-coral">Morada</h3>
              <p className="text-white/80 text-sm">
                Rua de Rebolido, 42<br />
                4580-264 Gondalães, Paredes
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Simple Contact Form */}
      <section className="py-4 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-heading font-bold mb-4 text-center">
              <span className="text-brand-turquoise">Envie-nos</span> <span className="text-white">uma Mensagem</span>
            </h2>
            <p className="text-white/80 mb-4 text-center text-sm">Preencha o formulário e entraremos em contacto brevemente.</p>
            
            <form id="formulario" className="space-y-4">
              <div>
                <label className="text-white/80 mb-1 block text-sm">Nome Completo</label>
                <input 
                  type="text" 
                  className="w-full p-2 bg-black/50 border border-brand-yellow text-white rounded-lg text-sm"
                  placeholder="Nome Completo"
                />
              </div>
              
              <div>
                <label className="text-white/80 mb-1 block text-sm">Email</label>
                <input 
                  type="email" 
                  className="w-full p-2 bg-black/50 border border-brand-yellow text-white rounded-lg text-sm"
                  placeholder="seu@email.com"
                />
              </div>
              
              <div>
                <label className="text-white/80 mb-1 block text-sm">Mensagem</label>
                <textarea 
                  className="w-full p-2 bg-black/50 border border-brand-yellow text-white rounded-lg h-24 text-sm"
                  placeholder="Descreva o seu projeto..."
                ></textarea>
              </div>
              
              <button 
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-brand-yellow to-brand-coral text-black font-semibold rounded-lg hover:shadow-xl transition-all duration-300"
              >
                Enviar Mensagem
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Location Info with Map */}
      <section className="py-4 bg-black/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-heading font-bold mb-2">
              <span className="text-brand-coral">Como</span> <span className="text-white">Chegar</span>
            </h2>
          </div>
          
          {/* Mapa Google Maps */}
          <div className="max-w-3xl mx-auto mb-4">
            <div className="bg-black/30 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3006.2345678901234!2d-8.5591234567891!3d41.2234567891234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDEzJzI0LjQiTiA4wrAzMycyOC44Ilc!5e0!3m2!1spt!2spt!4v1234567890123"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização DOMREALCE - Rua de Rebolido, 42, Gondalães, Paredes"
              ></iframe>
            </div>
          </div>
          
          {/* WhatsApp Contact */}
          <div className="max-w-sm mx-auto">
            <div className="bg-black/30 rounded-lg p-4 text-center">
              <h3 className="text-lg font-semibold text-brand-turquoise mb-3">Contacto Direto</h3>
              <a 
                href="https://wa.me/351930682725?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20os%20vossos%20serviços."
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors text-sm"
              >
                💬 Contactar via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-6 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-semibold text-brand-yellow mb-3">Atendimento Personalizado</h3>
            <p className="text-white/80 mb-4 text-sm">
              Com 40 anos de experiência, oferecemos um atendimento personalizado focado na qualidade, pontualidade e honestidade.
            </p>
            <Link href="/sobre" className="text-brand-turquoise hover:text-brand-turquoise transition-colors text-sm">
              Conhecer a Nossa História
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}