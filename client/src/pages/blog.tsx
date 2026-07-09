import { useEffect } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

const SORO_SCRIPT_ID = "soro-embed-script";
const SORO_SRC = "https://app.trysoro.com/api/embed/a107b8d6-75d8-4f0f-917f-b74702a38b13?theme=dark";

export default function Blog() {
  useEffect(() => {
    if (document.getElementById(SORO_SCRIPT_ID)) return;

    const script = document.createElement("script");
    script.id = SORO_SCRIPT_ID;
    script.src = SORO_SRC;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      const existing = document.getElementById(SORO_SCRIPT_ID);
      if (existing) existing.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navigation />

      {/* Hero */}
      <section className="bg-black border-b border-white/10 pt-28 pb-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-brand-yellow/40" />
            <span className="text-brand-yellow text-xs font-semibold uppercase tracking-widest">
              Blog
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-brand-yellow/40" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center leading-tight">
            Artigos & Inspiração
          </h1>
          <p className="mt-4 text-gray-400 text-center max-w-xl mx-auto text-lg">
            Dicas, tendências e projetos de comunicação visual, impressão digital e decoração de espaços.
          </p>
        </div>
      </section>

      {/* Widget Soro */}
      <main className="flex-1 container mx-auto px-4 py-12 max-w-5xl w-full">
        <div id="soro-blog" className="min-h-[400px]" />
      </main>

      <Footer />
    </div>
  );
}
