import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function AvisoLegal() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navigation />
      
      <div className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            Aviso Legal
          </h1>
          
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-gray-300 mb-8 text-center">
              Última atualização: Agosto de 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">1. Identificação da Entidade</h2>
              <div className="text-gray-300 leading-relaxed">
                <p className="mb-2"><strong>Denominação:</strong> DOMREALCE</p>
                <p className="mb-2"><strong>Atividade:</strong> Comunicação Visual e Publicidade</p>
                <p className="mb-2"><strong>Sede:</strong> [Inserir morada completa]</p>
                <p className="mb-2"><strong>Número de Contribuinte:</strong> [Inserir NIF]</p>
                <p className="mb-2"><strong>Email:</strong> info@domrealce.com</p>
                <p className="mb-2"><strong>Telefone:</strong> +351 930 682 725</p>
                <p className="mb-2"><strong>Website:</strong> www.domrealce.com</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">2. Objeto do Website</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Este website tem como objetivo apresentar os serviços da DOMREALCE na área 
                da comunicação visual e publicidade, permitir o contacto com clientes, 
                apresentação de portfólio e disponibilização de informações sobre a empresa.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">3. Condições de Utilização</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                A utilização deste website implica a aceitação plena dos presentes termos. 
                Os utilizadores comprometem-se a:
              </p>
              <ul className="text-gray-300 space-y-2 ml-6">
                <li>• Utilizar o website de forma lícita e adequada</li>
                <li>• Não danificar, inutilizar ou sobrecarregar o website</li>
                <li>• Não introduzir vírus ou código malicioso</li>
                <li>• Respeitar os direitos de propriedade intelectual</li>
                <li>• Não utilizar o website para fins comerciais não autorizados</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">4. Propriedade Intelectual</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Todos os conteúdos deste website, incluindo textos, imagens, gráficos, logótipos, 
                ícones, fotografias, vídeos e software, são propriedade da DOMREALCE ou dos seus 
                licenciadores e estão protegidos por direitos de autor e outras leis de propriedade intelectual.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">5. Ligações para Sites Externos</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Este website pode conter ligações para websites de terceiros. A DOMREALCE não 
                controla esses websites externos e não se responsabiliza pelo seu conteúdo, 
                políticas de privacidade ou práticas.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">6. Limitação de Responsabilidade</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                A DOMREALCE não se responsabiliza por:
              </p>
              <ul className="text-gray-300 space-y-2 ml-6">
                <li>• Interrupções temporárias no acesso ao website</li>
                <li>• Erros ou omissões no conteúdo</li>
                <li>• Danos diretos ou indiretos resultantes da utilização do website</li>
                <li>• Vírus ou outros elementos nocivos que possam afetar o equipamento informático</li>
                <li>• Uso indevido das informações por parte de terceiros</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">7. Disponibilidade do Serviço</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                A DOMREALCE envidará os melhores esforços para garantir a disponibilidade 
                contínua do website, mas não pode garantir que esteja sempre acessível. 
                Poderão ocorrer interrupções para manutenção ou melhoramentos.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">8. Modificações</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                A DOMREALCE reserva-se o direito de modificar, a qualquer momento e sem aviso prévio, 
                o presente aviso legal, bem como as condições de utilização do website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">9. Lei Aplicável e Jurisdição</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                O presente aviso legal rege-se pela lei portuguesa. Para a resolução de 
                qualquer litígio são competentes os tribunais da comarca da sede da DOMREALCE.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">10. Contactos</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Para questões relacionadas com este aviso legal:
              </p>
              <ul className="text-gray-300 space-y-2 ml-6">
                <li>• Email: info@domrealce.com</li>
                <li>• Telefone: +351 930 682 725</li>
                <li>• Morada: [Inserir morada completa]</li>
              </ul>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}