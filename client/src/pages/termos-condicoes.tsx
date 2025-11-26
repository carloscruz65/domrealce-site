import Navigation from "@/components/navigation";
import ScrollToTop from "@/components/scroll-to-top";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";

export default function TermosCondicoes() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navigation />
      
      <div className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            Termos e Condições
          </h1>
          
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-gray-300 mb-8 text-center">
              Última atualização: Agosto de 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">1. Âmbito de Aplicação</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Os presentes termos e condições aplicam-se a todos os serviços prestados pela 
                DOMREALCE, incluindo design gráfico, impressão digital, decoração de viaturas, 
                papel de parede personalizado e outros serviços de comunicação visual.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">2. Serviços Prestados</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                A DOMREALCE presta serviços nas seguintes áreas:
              </p>
              <ul className="text-gray-300 space-y-2 ml-6">
                <li>• Design gráfico e criação de identidade visual</li>
                <li>• Impressão digital em diversos materiais</li>
                <li>• Decoração de viaturas e frotas comerciais</li>
                <li>• Papel de parede personalizado</li>
                <li>• Telas artísticas e canvas</li>
                <li>• Autocolantes e etiquetas</li>
                <li>• Decoração de espaços comerciais</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">3. Orçamentos e Contratação</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Todos os orçamentos são gratuitos e válidos por 30 dias. A contratação dos 
                serviços implica a aceitação expressa destes termos e condições. Os preços 
                apresentados incluem IVA à taxa legal em vigor.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">4. Pagamento</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                As condições de pagamento são acordadas caso a caso, podendo incluir:
              </p>
              <ul className="text-gray-300 space-y-2 ml-6">
                <li>• Pagamento antecipado de 50% para projetos de grande dimensão</li>
                <li>• Pagamento à entrega para projetos standard</li>
                <li>• Pagamento a 30 dias para clientes corporativos (sujeito a aprovação)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">5. Prazos de Execução</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Os prazos de execução variam conforme o tipo de serviço e são sempre acordados 
                previamente com o cliente. A DOMREALCE compromete-se a cumprir os prazos estabelecidos, 
                salvo circunstâncias excecionais ou casos de força maior.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">6. Propriedade Intelectual</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                A propriedade intelectual dos trabalhos criados é transferida para o cliente 
                mediante o pagamento integral do serviço. A DOMREALCE reserva o direito de 
                utilizar os trabalhos realizados no seu portfólio, salvo acordo em contrário.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">7. Produtos Personalizados e Trocas</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                <strong>IMPORTANTE:</strong> Devido à natureza personalizada dos nossos produtos, aplicam-se as seguintes condições:
              </p>
              <ul className="text-gray-300 space-y-3 ml-6 mb-4">
                <li>• <strong>Produtos personalizados:</strong> Não são aceites trocas ou devoluções de produtos personalizados com logótipos, textos ou designs específicos do cliente</li>
                <li>• <strong>Papel de parede personalizado:</strong> Uma vez cortado nas medidas solicitadas, não pode ser trocado ou devolvido</li>
                <li>• <strong>Decoração de viaturas:</strong> Serviços já aplicados não são reversíveis nem reembolsáveis</li>
                <li>• <strong>Impressões personalizadas:</strong> Produtos com design específico do cliente não podem ser reutilizados</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mb-4">
                O cliente deve verificar cuidadosamente todos os detalhes (medidas, cores, textos, logótipos) 
                antes da aprovação final para produção.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">8. Garantias e Defeitos</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                A DOMREALCE garante:
              </p>
              <ul className="text-gray-300 space-y-2 ml-6 mb-4">
                <li>• Qualidade dos materiais utilizados</li>
                <li>• Execução profissional dos trabalhos</li>
                <li>• Correção gratuita de defeitos de fabrico no prazo de 30 dias</li>
                <li>• Substituição gratuita em caso de erro da nossa responsabilidade</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mb-4">
                <strong>Não cobertos pela garantia:</strong> Erros resultantes de informações incorretas 
                fornecidas pelo cliente ou aprovações de prova final incorretas.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">9. Responsabilidades do Cliente</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                O cliente é responsável por:
              </p>
              <ul className="text-gray-300 space-y-2 ml-6 mb-4">
                <li>• Fornecer informações precisas e completas (medidas, cores, textos)</li>
                <li>• Verificar e aprovar todas as provas antes da produção</li>
                <li>• Confirmar que possui direitos de utilização de logótipos e imagens fornecidos</li>
                <li>• Aceitar que produtos personalizados não podem ser trocados ou devolvidos</li>
                <li>• Disponibilizar acesso adequado para instalação/aplicação quando necessário</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mb-4">
                A DOMREALCE não se responsabiliza por erros resultantes de informações 
                incorretas fornecidas pelo cliente ou por direitos de autor de materiais fornecidos.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">10. Direito de Retratação</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                De acordo com o Decreto-Lei nº 24/2014, o direito de retratação de 14 dias 
                <strong>não se aplica</strong> aos seguintes serviços da DOMREALCE:
              </p>
              <ul className="text-gray-300 space-y-2 ml-6 mb-4">
                <li>• Produtos personalizados com especificações do cliente</li>
                <li>• Papel de parede cortado em medidas específicas</li>
                <li>• Serviços de aplicação já executados</li>
                <li>• Produtos com logótipos ou designs personalizados</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">11. Lei Aplicável</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Os presentes termos e condições regem-se pela lei portuguesa. 
                Qualquer litígio será resolvido pelos tribunais competentes de Portugal.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">12. Contactos</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Para esclarecimentos sobre estes termos e condições:
              </p>
              <ul className="text-gray-300 space-y-2 ml-6">
                <li>• Email: info@domrealce.com</li>
                <li>• Telefone: +351 930 682 725</li>
                <li>• Website: www.domrealce.com</li>
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