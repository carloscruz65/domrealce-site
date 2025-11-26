import ScrollToTop from "@/components/scroll-to-top";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function PoliticaPrivacidade() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navigation />
      
      <div className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            Política de Privacidade
          </h1>
          
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-gray-300 mb-8 text-center">
              Última atualização: Agosto de 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">1. Informações Gerais</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                A DOMREALCE, com sede em Portugal, compromete-se a proteger e respeitar a sua privacidade. 
                Esta política explica como recolhemos, utilizamos e protegemos as suas informações pessoais 
                quando visita o nosso website ou utiliza os nossos serviços.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">2. Dados Recolhidos</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Podemos recolher e processar os seguintes dados pessoais:
              </p>
              <ul className="text-gray-300 space-y-2 ml-6">
                <li>• Nome completo e informações de contacto (email, telefone, morada)</li>
                <li>• Informações sobre os serviços solicitados</li>
                <li>• Dados de navegação no website (cookies, endereço IP, páginas visitadas)</li>
                <li>• Comunicações entre si e a DOMREALCE</li>
                <li>• Informações fornecidas em formulários de contacto ou orçamento</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">3. Finalidade do Tratamento</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Os seus dados pessoais são utilizados para:
              </p>
              <ul className="text-gray-300 space-y-2 ml-6">
                <li>• Responder aos seus pedidos de informação e orçamentos</li>
                <li>• Prestar os nossos serviços de comunicação visual</li>
                <li>• Melhorar a experiência do utilizador no website</li>
                <li>• Cumprir obrigações legais e contratuais</li>
                <li>• Marketing direto (apenas com o seu consentimento)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">4. Partilha de Dados</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                A DOMREALCE não vende, aluga ou partilha os seus dados pessoais com terceiros, 
                exceto nos seguintes casos:
              </p>
              <ul className="text-gray-300 space-y-2 ml-6">
                <li>• Com o seu consentimento explícito</li>
                <li>• Para cumprimento de obrigações legais</li>
                <li>• Com prestadores de serviços que nos auxiliam (sempre sob contrato de confidencialidade)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">5. Os Seus Direitos</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Ao abrigo do RGPD, tem o direito de:
              </p>
              <ul className="text-gray-300 space-y-2 ml-6">
                <li>• Aceder aos seus dados pessoais</li>
                <li>• Retificar dados incorretos ou incompletos</li>
                <li>• Apagar os seus dados (direito ao esquecimento)</li>
                <li>• Limitar o tratamento dos seus dados</li>
                <li>• Portabilidade dos dados</li>
                <li>• Opor-se ao tratamento dos seus dados</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">6. Segurança dos Dados</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Implementamos medidas técnicas e organizacionais adequadas para proteger 
                os seus dados pessoais contra acesso não autorizado, alteração, divulgação 
                ou destruição.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">7. Contactos</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Para exercer os seus direitos ou esclarecer dúvidas sobre esta política, 
                contacte-nos através de:
              </p>
              <ul className="text-gray-300 space-y-2 ml-6">
                <li>• Email: info@domrealce.com</li>
                <li>• Telefone: +351 930 682 725</li>
                <li>• Morada: [Inserir morada da DOMREALCE]</li>
              </ul>
            </section>
          </div>
        </div>
      </div>

      <ScrollToTop />
      <Footer />
    </div>
  );
}