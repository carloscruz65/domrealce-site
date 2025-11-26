import Navigation from "@/components/navigation";
import ScrollToTop from "@/components/scroll-to-top";
import DynamicSlider from "@/components/DynamicSlider";
import ScrollToTop from "@/components/scroll-to-top";
import ServicesSection from "@/components/services-section";
import ScrollToTop from "@/components/scroll-to-top";
import PortfolioSection from "@/components/portfolio-section";
import ScrollToTop from "@/components/scroll-to-top";
import NewsSection from "@/components/news-section";
import ScrollToTop from "@/components/scroll-to-top";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";
import Testimonials from "@/components/testimonials";
import ScrollToTop from "@/components/scroll-to-top";
import CredibilityBadges from "@/components/credibility-badges";
import ScrollToTop from "@/components/scroll-to-top";
import SocialLinks from "@/components/social-links";
import ScrollToTop from "@/components/scroll-to-top";
import { SEOHead } from "@/components/seo-head";
import ScrollToTop from "@/components/scroll-to-top";
import { usePageConfig } from "@/hooks/use-page-config";
import ClientLogos from "@/components/ClientLogos";
import ScrollToTop from "@/components/scroll-to-top";
import { EditableConfigText } from "@/components/EditableConfigText";
import ScrollToTop from "@/components/scroll-to-top";

export default function Home() {
  const { getConfig, isLoading } = usePageConfig("home");

  return (
    <div
      className="overflow-x-hidden"
      style={{ background: "none", backgroundColor: "transparent" }}
    >
      <SEOHead
        title="Comunicação Visual e Impressão Digital ! Portugal"
        description="DOMREALCE - Especialista em comunicação visual, impressão digital, papel de parede, decoração de viaturas e sinalética comercial. 40 anos de experiência em Lisboa."
        keywords="comunicação visual, impressão digital, papel de parede, decoração viaturas, sinalética, publicidade, Portugal, DOMREALCE"
        canonicalUrl="https://www.domrealce.com/"
      />

      <Navigation />
      
      <DynamicSlider />
      
      <ServicesSection />
      <PortfolioSection />
      
      {/* Credibility Section */}
      <section data-scroll className="py-16 px-4 bg-black border-t border-gray-900">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading mb-2">
              Porque <span className="text-brand-yellow">confiar</span> em nós
            </h2>
          </div>
          <CredibilityBadges />
        </div>
      </section>

      <Testimonials />
      <NewsSection />
      <ClientLogos />
      
      {/* Social & Contact Section */}
      <section data-scroll className="py-12 px-4 bg-gray-900 border-t border-gray-800">
        <div className="container mx-auto text-center">
          <p className="text-gray-400 mb-6">Siga-nos nas redes sociais e fique atualizado</p>
          <SocialLinks orientation="horizontal" />
        </div>
      </section>

      <ScrollToTop />
      <Footer />
    </div>
  );
}
