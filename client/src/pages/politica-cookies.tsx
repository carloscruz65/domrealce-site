import ScrollToTop from "@/components/scroll-to-top";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function PoliticaCookies() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navigation />
      
      <div className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            Política de Cookies
          </h1>
          
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-gray-300 mb-8 text-center">
              Última atualização: Agosto de 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">1. O que são Cookies</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Os cookies são pequenos ficheiros de texto que são armazenados no seu dispositivo 
                quando visita o nosso website. Estes ficheiros permitem que o website reconheça 
                o seu dispositivo e armazene algumas informações sobre as suas preferências ou 
                ações passadas.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">2. Como Utilizamos os Cookies</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                O website da DOMREALCE utiliza cookies para:
              </p>
              <ul className="text-gray-300 space-y-2 ml-6">
                <li>• Melhorar a experiência de navegação no website</li>
                <li>• Lembrar as suas preferências e definições</li>
                <li>• Analisar o tráfego do website e padrões de utilização</li>
                <li>• Personalizar conteúdo e publicidade</li>
                <li>• Garantir a segurança do website</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">3. Tipos de Cookies Utilizados</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3 text-[#20B2AA]">Cookies Essenciais</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Estes cookies são necessários para o funcionamento básico do website e não 
                  podem ser desativados. Incluem cookies de sessão e segurança.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3 text-[#20B2AA]">Cookies de Performance</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Recolhem informações sobre como os visitantes utilizam o website, como as 
                  páginas mais visitadas e eventuais mensagens de erro.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3 text-[#20B2AA]">Cookies de Funcionalidade</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Permitem que o website se lembre das escolhas que faz e forneça funcionalidades 
                  melhoradas e mais personalizadas.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3 text-[#20B2AA]">Cookies de Marketing</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Utilizados para entregar anúncios mais relevantes para si e para os seus interesses.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">4. Cookies de Terceiros</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                O nosso website pode incluir cookies de terceiros, incluindo:
              </p>
              <ul className="text-gray-300 space-y-2 ml-6">
                <li>• Google Analytics (para análise de tráfego)</li>
                <li>• Redes sociais (para partilha de conteúdo)</li>
                <li>• Serviços de chat online</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">5. Gestão de Cookies</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Pode controlar e/ou eliminar cookies conforme desejar. Pode eliminar todos 
                os cookies que já estão no seu dispositivo e configurar a maioria dos navegadores 
                para bloquear a colocação de cookies.
              </p>
              
              <div className="bg-[#111111] border border-[#333] rounded-lg p-6 mt-6">
                <h3 className="text-lg font-bold mb-3 text-[#FFD700]">Como Desativar Cookies:</h3>
                <ul className="text-gray-300 space-y-2 ml-4">
                  <li>• Chrome: Definições → Privacidade e segurança → Cookies</li>
                  <li>• Firefox: Opções → Privacidade e Segurança → Cookies</li>
                  <li>• Safari: Preferências → Privacidade → Cookies</li>
                  <li>• Edge: Definições → Cookies e permissões de site</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">6. Consentimento</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Ao utilizar o nosso website, consente na utilização de cookies de acordo com 
                esta política. Se não concordar com a utilização de cookies, deve ajustar as 
                definições do seu navegador ou deixar de utilizar o website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">7. Contactos</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Se tiver questões sobre a nossa utilização de cookies:
              </p>
              <ul className="text-gray-300 space-y-2 ml-6">
                <li>• Email: info@domrealce.com</li>
                <li>• Telefone: +351 930 682 725</li>
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