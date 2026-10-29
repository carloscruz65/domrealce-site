import { ArrowRight } from "lucide-react";

const products = [
  {
    path: "/etiquetas",
    title: "Etiquetas com corte de contorno",
    description: "Para produtos, embalagens, copos, garrafas e eventos. Etiquetas redondas, quadradas ou com um formato personalizado.",
    image: "https://calcular.domrealce.com/images/etiquetas-recortadas.webp",
    alt: "Etiquetas personalizadas com corte de contorno aplicadas num copo",
    examples: ["Produtos e embalagens", "Copos e garrafas", "Festas e eventos"],
    action: "Calcular etiquetas",
  },
  {
    path: "/vinil-impresso",
    title: "Vinil impresso em rolo",
    description: "Para montras, publicidade e decoração de superfícies. Impressão de imagens, fundos e mensagens à medida do seu projeto.",
    image: "https://calcular.domrealce.com/images/vinil-em-rolo.webp",
    alt: "Rolos de vinil impresso para publicidade e decoração",
    examples: ["Montras e promoções", "Publicidade", "Decoração de superfícies"],
    action: "Calcular vinil impresso",
  },
];

export function AutocolantesProductLinks({ calculatorUrl }: { calculatorUrl: string }) {
  return (
    <div className="flex flex-col justify-center gap-3 sm:flex-row">
      {products.map((product) => {
        const url = new URL(calculatorUrl);
        url.pathname = product.path;
        return (
          <a key={product.path} href={url.toString()} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-brand-yellow px-6 py-3 text-center font-bold text-black hover:bg-brand-yellow/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            {product.action}<ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </a>
        );
      })}
    </div>
  );
}

export default function AutocolantesProductChoices({ calculatorUrl }: { calculatorUrl: string }) {
  return (
    <section id="escolher-autocolantes" aria-labelledby="autocolantes-products-title" className="scroll-mt-28 border-y border-gray-900 bg-gray-900/40 py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-4">
        <h2 id="autocolantes-products-title" className="text-center font-heading text-2xl font-bold text-white md:text-3xl">O que pretende encomendar?</h2>
        <p className="mx-auto mb-8 mt-3 max-w-2xl text-center text-gray-300">Escolha etiquetas com corte de contorno ou vinil impresso em rolo. Cada opção abre diretamente a respetiva calculadora.</p>
        <div className="grid gap-6 md:grid-cols-2">
          {products.map((product) => {
            const url = new URL(calculatorUrl);
            url.pathname = product.path;
            return (
              <article key={product.path} className="flex flex-col overflow-hidden rounded-2xl border border-gray-800 bg-black">
                <img src={product.image} alt={product.alt} width={640} height={360} loading="lazy" className="aspect-video w-full object-cover" />
                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <h3 className="text-xl font-bold text-brand-yellow">{product.title}</h3>
                  <p className="mb-4 mt-3 text-gray-300">{product.description}</p>
                  <ul className="mb-6 space-y-1 text-sm text-gray-400">{product.examples.map((example) => <li key={example}>{example}</li>)}</ul>
                  <a href={url.toString()} className="mt-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-brand-yellow px-5 py-3 text-center font-bold text-black hover:bg-brand-yellow/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">{product.action}<ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" /></a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
