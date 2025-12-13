import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, ArrowRight, Shield } from "lucide-react";
import React, { useMemo, useState } from "react";

type FormState = {
  nome: string;
  empresa: string;
  telefone: string;
  email: string;

  categoria: string;
  marca: string;
  modelo: string;
  ano: string;

  trabalho: {
    identificacao: boolean;
    numeracao: boolean;
    seguranca: boolean;
    decoracao: boolean;
    outro: boolean;
  };

  urgencia: string;
  localizacao: string;

  vinisAntigos: string; // "sim" | "nao" | ""
  mensagem: string;
};

export default function ContactosMaquinas() {
  const [form, setForm] = useState<FormState>({
    nome: "",
    empresa: "",
    telefone: "",
    email: "",
    categoria: "",
    marca: "",
    modelo: "",
    ano: "",
    trabalho: {
      identificacao: true,
      numeracao: false,
      seguranca: false,
      decoracao: false,
      outro: false,
    },
    urgencia: "normal",
    localizacao: "",
    vinisAntigos: "",
    mensagem: "",
  });

  const mailtoHref = useMemo(() => {
    const trabalhos = Object.entries(form.trabalho)
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join(", ") || "—";

    const body = [
      `Nome: ${form.nome || "—"}`,
      `Empresa: ${form.empresa || "—"}`,
      `Telefone: ${form.telefone || "—"}`,
      `Email: ${form.email || "—"}`,
      ``,
      `Categoria: ${form.categoria || "—"}`,
      `Marca: ${form.marca || "—"}`,
      `Modelo: ${form.modelo || "—"}`,
      `Ano: ${form.ano || "—"}`,
      ``,
      `Trabalho pretendido: ${trabalhos}`,
      `Urgência: ${form.urgencia || "—"}`,
      `Localização: ${form.localizacao || "—"}`,
      `Tem vinis antigos: ${form.vinisAntigos || "—"}`,
      ``,
      `Mensagem:`,
      `${form.mensagem || "—"}`,
      ``,
      `Notas: Não remover vinis antigos antes do levantamento técnico.`,
      `Fotos: Enviar 3–6 fotos (frente, trás, laterais e detalhes) por email ou WhatsApp.`,
    ].join("\n");

    const subject = encodeURIComponent("Pedido de orçamento — Máquinas industriais");
    const bodyEnc = encodeURIComponent(body);

    // Troca este email pelo teu (se necessário)
    return `mailto:geral@domrealce.pt?subject=${subject}&body=${bodyEnc}`;
  }, [form]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function setWork(key: keyof FormState["trabalho"], value: boolean) {
    setForm((prev) => ({ ...prev, trabalho: { ...prev.trabalho, [key]: value } }));
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <section className="pt-12 pb-10">
        <div className="container mx-auto px-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-yellow/40 bg-black/40 px-3 py-1 text-sm text-brand-yellow">
            <Settings className="w-4 h-4" />
            Pedido de orçamento
          </div>

          <div className="mt-6 grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-[1.05]">
                <span className="text-white">Máquinas industriais</span>{" "}
                <span className="text-brand-yellow">& equipamentos pesados</span>
              </h1>

              <p className="mt-5 text-brand-yellow text-xl md:text-2xl font-semibold">
                Formulário dedicado para levantamento técnico
              </p>

              <p className="mt-5 text-gray-300 text-base md:text-lg leading-relaxed max-w-xl">
                Este formulário ajuda-nos a preparar o levantamento e acelerar o planeamento.
                Quanto mais completa for a informação, mais rápido conseguimos avançar.
              </p>

              <div className="mt-8 rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-brand-yellow mt-0.5" />
                  <div>
                    <p className="text-white font-semibold">
                      Importante antes do levantamento
                    </p>
                    <p className="text-gray-300 text-sm mt-1">
                      Não remova vinis/autocolantes antigos antes de medirmos e fotografarmos a máquina.
                      Eles servem de referência para dimensões e posicionamento.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-400">
                Para fotos, podes enviar por WhatsApp:
                <a
                  className="text-brand-yellow hover:underline ml-2"
                  href="https://wa.me/351930682725?text=Olá!%20Quero%20um%20orçamento%20para%20máquina%20industrial.%20Vou%20enviar%20fotos%20e%20detalhes."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  930 682 725
                </a>
              </div>
            </div>

            {/* Form */}
            <Card className="bg-gray-900/60 border border-gray-800" id="formulario">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl md:text-2xl font-semibold text-white">
                    Dados para orçamento
                  </h2>
                  <Badge variant="outline" className="border-brand-yellow text-brand-yellow">
                    Máquinas
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input label="Nome" value={form.nome} onChange={(v) => set("nome", v)} />
                  <Input label="Empresa (opcional)" value={form.empresa} onChange={(v) => set("empresa", v)} />
                  <Input label="Telefone" value={form.telefone} onChange={(v) => set("telefone", v)} />
                  <Input label="Email" value={form.email} onChange={(v) => set("email", v)} />

                  <Select
                    label="Tipo de equipamento"
                    value={form.categoria}
                    onChange={(v) => set("categoria", v)}
                    options={[
                      { value: "", label: "Selecionar..." },
                      { value: "Terraplenagem e construção", label: "Terraplenagem e construção" },
                      { value: "Elevação e acesso", label: "Elevação e acesso" },
                      { value: "Logística e armazém", label: "Logística e armazém" },
                      { value: "Outros", label: "Outros" },
                    ]}
                  />

                  <Input label="Marca (ex: Volvo, Komatsu, Haulotte)" value={form.marca} onChange={(v) => set("marca", v)} />
                  <Input label="Modelo" value={form.modelo} onChange={(v) => set("modelo", v)} />
                  <Input label="Ano (opcional)" value={form.ano} onChange={(v) => set("ano", v)} />

                  <Select
                    label="Urgência"
                    value={form.urgencia}
                    onChange={(v) => set("urgencia", v)}
                    options={[
                      { value: "normal", label: "Normal" },
                      { value: "urgente", label: "Urgente" },
                      { value: "a-planear", label: "Ainda a planear" },
                    ]}
                  />

                  <Input label="Localização (cidade/concelho)" value={form.localizacao} onChange={(v) => set("localizacao", v)} />

                  <Select
                    label="A máquina tem vinis/autocolantes antigos?"
                    value={form.vinisAntigos}
                    onChange={(v) => set("vinisAntigos", v)}
                    options={[
                      { value: "", label: "Selecionar..." },
                      { value: "sim", label: "Sim" },
                      { value: "nao", label: "Não" },
                    ]}
                  />
                </div>

                <div className="mt-6">
                  <p className="text-sm text-gray-400 mb-3">O que precisa?</p>
                  <div className="flex flex-wrap gap-2">
                    <Chip checked={form.trabalho.identificacao} onClick={() => setWork("identificacao", !form.trabalho.identificacao)}>
                      Identificação / Logótipos
                    </Chip>
                    <Chip checked={form.trabalho.numeracao} onClick={() => setWork("numeracao", !form.trabalho.numeracao)}>
                      Numeração / Frota
                    </Chip>
                    <Chip checked={form.trabalho.seguranca} onClick={() => setWork("seguranca", !form.trabalho.seguranca)}>
                      Segurança / Informação
                    </Chip>
                    <Chip checked={form.trabalho.decoracao} onClick={() => setWork("decoracao", !form.trabalho.decoracao)}>
                      Decoração parcial
                    </Chip>
                    <Chip checked={form.trabalho.outro} onClick={() => setWork("outro", !form.trabalho.outro)}>
                      Outro
                    </Chip>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm text-gray-400 mb-2">
                    Mensagem / detalhes adicionais
                  </label>
                  <textarea
                    className="w-full min-h-[120px] rounded-xl bg-black/40 border border-gray-800 px-4 py-3 text-white outline-none focus:border-brand-yellow/60"
                    value={form.mensagem}
                    onChange={(e) => set("mensagem", e.target.value)}
                    placeholder="Ex: queremos identidade completa + numeração, temos urgência, a máquina trabalha no exterior, etc."
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Fotos: envia 3–6 fotos (frente, trás, laterais e detalhes) por email ou WhatsApp.
                  </p>
                </div>

                <div className="mt-7 flex flex-col sm:flex-row gap-3">
                  <Button asChild className="bg-brand-yellow text-black font-bold px-6 py-6 hover:bg-brand-yellow/90">
                    <a href={mailtoHref}>
                      Enviar pedido por email
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </a>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-black px-6 py-6"
                  >
                    <a
                      href="https://wa.me/351930682725?text=Olá!%20Quero%20um%20orçamento%20para%20máquina%20industrial.%20Vou%20enviar%20fotos%20e%20detalhes."
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Enviar por WhatsApp
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Input(props: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2">{props.label}</label>
      <input
        className="w-full rounded-xl bg-black/40 border border-gray-800 px-4 py-3 text-white outline-none focus:border-brand-yellow/60"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
}

function Select(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2">{props.label}</label>
      <select
        className="w-full rounded-xl bg-black/40 border border-gray-800 px-4 py-3 text-white outline-none focus:border-brand-yellow/60"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      >
        {props.options.map((o) => (
          <option key={o.value} value={o.value} className="bg-black">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Chip(props: { checked: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={[
        "rounded-full px-4 py-2 text-sm border transition",
        props.checked
          ? "bg-brand-yellow text-black border-brand-yellow"
          : "bg-black/30 text-white border-gray-800 hover:border-brand-yellow/60",
      ].join(" ")}
    >
      {props.children}
    </button>
  );
}
