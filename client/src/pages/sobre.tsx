import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { usePageConfig } from "@/hooks/use-page-config";
import { EditableConfigText } from "@/components/EditableConfigText";
import {
  Target,
  PenTool,
  Clock3,
  Layers,
  MonitorSmartphone,
  MapPin,
  Sparkles,
} from "lucide-react";

export default function Sobre() {
  const { getConfig, updateConfig } = usePageConfig("about");

  // Conteúdos editáveis principais
  const pageTitle = getConfig("hero", "title", "Sobre a DOMREALCE");
  const heroDescription = getConfig(
    "hero",
    "description",
    "Atelier de comunicação visual e decoração no norte de Portugal, com mais de 40 anos de experiência, onde cada projeto é pensado ao detalhe — do primeiro esboço à instalação final."
  );

  const whoWeAreTitle = getConfig("who", "title", "Quem somos");
  const whoWeAreText1 = getConfig(
    "who",
    "text_1",
    "A DOMREALCE é um atelier de comunicação visual e decoração localizado em Paredes, no norte de Portugal. Somos uma estrutura pequena, flexível e extremamente cuidada em cada detalhe do processo."
  );
  const whoWeAreText2 = getConfig(
    "who",
    "text_2",
    "Com mais de 40 anos de experiência acumulada, aliamos o know-how tradicional à tecnologia atual: impressão digital de grande formato, corte e acabamento profissional, sempre com foco na durabilidade e na estética."
  );

  const howWeWorkTitle = getConfig("work", "title", "Como trabalhamos");
  const howWeWorkIntro = getConfig(
    "work",
    "intro",
    "Cada projeto começa com uma boa conversa. Quer se trate de uma viatura, um espaço comercial ou papel de parede personalizado, o objetivo é sempre o mesmo: perceber exatamente o que o cliente precisa e apresentar uma solução clara, realista e bem simulada."
  );

  const spaceTitle = getConfig("space", "title", "O nosso espaço");
  const spaceText = getConfig(
    "space",
    "text",
    "Trabalhamos num espaço acolhedor de cerca de 80 m², preparado para receber clientes, desenvolver maquetes, produzir e finalizar o trabalho no mesmo fluxo. Tudo está organizado para que o processo seja eficiente, limpo e controlado."
  );

  const quoteText = getConfig(
    "company",
    "quote",
    "Mais do que fazer um trabalho bonito, queremos que o cliente sinta confiança desde o primeiro esboço até ao resultado final."
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <SEOHead
        title="Sobre a DOMREALCE - Atelier de Comunicação Visual em Paredes"
        description="Saiba mais sobre a DOMREALCE: atelier de comunicação visual em Paredes, especializado em impressão digital, decoração de viaturas, espaços comerciais, papel de parede e telas personalizadas."
        keywords="DOMREALCE, comunicação visual, impressão digital, decoração viaturas, papel de parede, Paredes, grande Porto"
        canonicalUrl="https://www.domrealce.com/sobre"
      />

      <Navigation />

      {/* HERO */}
      <section className="pt-32 pb-12 px-4 bg-gradient-to-b from-black via-[#0a0a0a] to-[#0a0a0a]">
        <div className="max-w-5xl mx-auto text-center">
          <EditableConfigText
            value={pageTitle}
            onSave={(value) => updateConfig("hero", "title", value)}
            tag="h1"
            className="text-4xl md:text-6xl font-bold mb-6"
            dataTestId="page-title"
          />
          <EditableConfigText
            value={heroDescription}
            onSave={(value) => updateConfig("hero", "description", value)}
            tag="p"
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            multiline
            dataTestId="hero-description"
          />
        </div>
      </section>

      {/* QUEM SOMOS */}
      <section className="pt-8 pb-12 px-4 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-start">
          <div>
            <EditableConfigText
              value={whoWeAreTitle}
              onSave={(value) => updateConfig("who", "title", value)}
              tag="h2"
              className="text-3xl md:text-4xl font-bold mb-4 text-[#FFD700]"
            />
            <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
              <EditableConfigText
                value={whoWeAreText1}
                onSave={(value) => updateConfig("who", "text_1", value)}
                tag="p"
                multiline
              />
              <EditableConfigText
                value={whoWeAreText2}
                onSave={(value) => updateConfig("who", "text_2", value)}
                tag="p"
                multiline
              />
              <p>
                A DOMREALCE é conduzida diariamente por um profissional
                autodidata, com décadas de experiência em publicidade,
                impressão, decoração de viaturas, espaços comerciais e projetos
                personalizados. Essa experiência, aliada a uma enorme vontade de
                aprender, permite-nos abraçar projetos muito diferentes, sempre
                com o mesmo rigor.
              </p>
            </div>
          </div>

          {/* BLOCO "COM QUEM VAI TRABALHAR" – sem grande destaque pessoal */}
          <Card className="bg-[#0f0f0f] border-[#333]">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-bold text-[#FFD700]">
                Com quem vai trabalhar
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Por trás da DOMREALCE está alguém que faz “um pouco de tudo”:
                desenha, prepara ficheiros, acompanha a produção, faz a
                aplicação e ainda trata da gestão de prazos e tarefas. Essa
                visão completa do processo evita falhas de comunicação e garante
                que o que foi combinado é exatamente o que é entregue.
              </p>
              <p className="text-gray-400 text-xs">
                Ferramentas do dia a dia: Illustrator, Photoshop, software de
                corte, gestão de tarefas e ferramentas de maquetização para
                apresentar ao cliente uma pré-visualização muito próxima do
                resultado final.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* COMO TRABALHAMOS */}
      <section className="py-12 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <EditableConfigText
              value={howWeWorkTitle}
              onSave={(value) => updateConfig("work", "title", value)}
              tag="h2"
              className="text-3xl md:text-4xl font-bold mb-4"
            />
            <EditableConfigText
              value={howWeWorkIntro}
              onSave={(value) => updateConfig("work", "intro", value)}
              tag="p"
              className="text-gray-300 max-w-3xl mx-auto"
              multiline
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-[#0a0a0a] border-[#333]">
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/50 flex items-center justify-center mb-4">
                  <Target className="w-5 h-5 text-[#FFD700]" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[#FFD700]">
                  1. Escuta e briefing
                </h3>
                <p className="text-gray-300 text-sm">
                  Primeiro ouvimos: qual é o objetivo, onde vai ser aplicado, o
                  que já existe no espaço, que limitação há em termos de tempo,
                  orçamento e durabilidade.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#0a0a0a] border-[#333]">
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-full bg-[#20B2AA]/10 border border-[#20B2AA]/50 flex items-center justify-center mb-4">
                  <PenTool className="w-5 h-5 text-[#20B2AA]" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[#20B2AA]">
                  2. Desenho e maquetes
                </h3>
                <p className="text-gray-300 text-sm">
                  Criamos maquetes e simulações muito próximas da realidade,
                  para que o cliente veja “antes de fazer”. Este cuidado evita
                  surpresas e é uma das grandes mais-valias da DOMREALCE.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#0a0a0a] border-[#333]">
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-full bg-[#FF6347]/10 border border-[#FF6347]/50 flex items-center justify-center mb-4">
                  <Clock3 className="w-5 h-5 text-[#FF6347]" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[#FF6347]">
                  3. Produção e instalação
                </h3>
                <p className="text-gray-300 text-sm">
                  Acompanhamos todo o processo: impressão, corte, laminação e
                  aplicação. Usamos ferramentas de gestão de tarefas para
                  garantir prazos cumpridos e trabalho bem coordenado.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* TECNOLOGIA E EQUIPAMENTO */}
      <section className="py-12 px-4 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tecnologia e equipamento
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto">
              A experiência é importante, mas o resultado depende também das
              máquinas e dos materiais certos. Na DOMREALCE trabalhamos com
              equipamento profissional e materiais de qualidade, escolhidos em
              função de cada projeto.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-[#111111] border-[#333]">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-[#FFD700] mb-2">
                  Impressão
                </h3>
                <p className="text-gray-300 text-sm mb-3">
                  Impressora Ricoh L5160 Pro (latex)
                </p>
                <ul className="text-gray-400 text-xs space-y-1">
                  <li>• Impressão de grande formato</li>
                  <li>• Tintas látex com boa durabilidade</li>
                  <li>• Ideal para interiores e exteriores</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-[#111111] border-[#333]">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-[#20B2AA] mb-2">
                  Corte e acabamento
                </h3>
                <p className="text-gray-300 text-sm mb-3">
                  Plotter de corte CG130 FX e laminadora Decal 160 cm
                </p>
                <ul className="text-gray-400 text-xs space-y-1">
                  <li>• Corte de vinil com precisão</li>
                  <li>• Laminação para proteção UV e maior resistência</li>
                  <li>• Acabamento cuidado para aplicações duradouras</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-[#111111] border-[#333]">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-[#FF6347] mb-2">
                  Software e preparação
                </h3>
                <p className="text-gray-300 text-sm mb-3">
                  Fluxo completo de preparação de ficheiros
                </p>
                <ul className="text-gray-400 text-xs space-y-1">
                  <li>• Adobe Illustrator e Photoshop</li>
                  <li>• Softwares específicos de corte e impressão</li>
                  <li>• Gestão de tarefas para cumprir prazos</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* O NOSSO ESPAÇO – COM LUGAR PARA FOTO DO INTERIOR */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <EditableConfigText
              value={spaceTitle}
              onSave={(value) => updateConfig("space", "title", value)}
              tag="h2"
              className="text-3xl md:text-4xl font-bold mb-4 text-[#FFD700]"
            />
            <EditableConfigText
              value={spaceText}
              onSave={(value) => updateConfig("space", "text", value)}
              tag="p"
              className="text-gray-300 text-lg leading-relaxed mb-6"
              multiline
            />
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4 text-[#FFD700]" />
              <span>
                Paredes, norte de Portugal — a servir sobretudo a zona do Grande
                Porto.
              </span>
            </div>
          </div>

          {/* AQUI FICA A FOTO DO INTERIOR DO ESPAÇO */}
          <div className="relative">
            <div className="rounded-lg overflow-hidden border border-[#333] bg-[#0a0a0a]">
              <img
                src="/public-objects/sobre/interior-domrealce.webp"
                alt="Interior do atelier DOMREALCE em Paredes"
                className="w-full h-full max-h-[420px] object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute bottom-3 left-3 bg-black/70 px-3 py-1 rounded text-xs text-gray-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#FFD700]" />
              <span>Interior do nosso espaço de 80 m²</span>
            </div>
          </div>
        </div>
      </section>

      {/* FRASE / QUOTE */}
      <section className="py-12 px-4 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#111111] border border-[#333] rounded-lg p-8 text-center">
            <EditableConfigText
              value={quoteText}
              onSave={(value) => updateConfig("company", "quote", value)}
              tag="p"
              className="text-xl md:text-2xl font-semibold text-gray-100 italic"
              multiline
            />
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para falar sobre o seu projeto?
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Se procura alguém que trate do seu projeto do início ao fim — com
            atenção ao detalhe, prazos cumpridos e soluções pensadas para
            durar — será um gosto trabalhar consigo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-[#FFD700] hover:bg-[#e6c200] text-black font-bold">
              <Link href="/contactos#formulario">Contactar a DOMREALCE</Link>
            </Button>
            <Button
              variant="outline"
              className="border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black"
            >
              <Link href="/servicos">Ver serviços</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
