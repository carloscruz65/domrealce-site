import DynamicSlider from "@/components/DynamicSlider";

export default function HeroSection() {
  return (
    <section className="h-screen w-full relative">
      <DynamicSlider />

      {/* 
        Caso queira manter algum texto/botões fixos por cima de todos os slides,
        pode descomentar esta div abaixo e personalizar.
      */}
      {/*
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 px-4">
        <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight text-white drop-shadow-lg">
          <span className="text-brand-yellow">Realce</span> sua marca com<br />
          <span className="text-brand-yellow">criatividade</span><br />
          <span className="text-white">e alta definição</span>
        </h1>
        <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto">
          Texto opcional que ficará sempre visível acima do slider
        </p>
      </div>
      */}
    </section>
  );
}
