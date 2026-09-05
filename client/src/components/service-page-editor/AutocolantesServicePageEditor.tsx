import { useEffect, useId, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, ChevronDown, ChevronUp, Eye, EyeOff, GripVertical, Image as ImageIcon, Loader2, Plus, RefreshCw, Save, Trash2, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "@/components/ImageUploader";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type Item = Record<string, unknown> & { id: string; position: number; visible: boolean };
type Section = { id: string; key: string; type: string; position: number; visible: boolean; version: number; content: Record<string, unknown> };
type Page = { serviceId: string; sections: Section[]; seo: { title: string; description: string; ogImage: string | null; version: number } };
type GalleryImage = { src: string; alt: string; title: string };

const labels: Record<string, string> = {
  hero: "Hero principal", "ordering-steps": "Passos de encomenda", "application-examples": "Exemplos de aplicação",
  "feature-accordions": "Destaques em acordeão", gallery: "Galeria", "materials-applications-production": "Materiais e produção",
  audiences: "Públicos", trust: "Confiança", video: "Vídeo", "final-cta": "Chamada final",
};
const fieldLabels: Record<string, string> = {
  badge: "Etiqueta", title: "Título", subtitle: "Subtítulo", description: "Descrição", imageSrc: "Imagem", imageAlt: "Texto alternativo",
  highlights: "Destaques", titleTop: "Título — início", titleHighlight: "Título — destaque", titleBottom: "Título — fim",
  materialsTitle: "Título dos materiais", applicationsTitle: "Título das aplicações", productionTitle: "Título da produção",
  eyebrow: "Sobretítulo", footnote: "Nota final", url: "URL do vídeo", poster: "Poster do vídeo", columns: "Colunas",
  text: "Texto", name: "Nome", category: "Categoria", step: "Passo", linkText: "Texto da ligação", intro: "Introdução",
  key: "Chave", icon: "Ícone", defaultOpenKey: "Acordeão aberto por defeito", legacyServiceGalleryKey: "Chave da galeria",
};
const imageFields = new Set(["imageSrc", "poster"]);
const longFields = new Set(["description", "highlights", "intro", "footnote"]);
const arrayLabels: Record<string, string> = { steps: "Passos", assurances: "Garantias", items: "Itens", fallbackImages: "Imagens de recurso", materials: "Materiais", applications: "Aplicações", production: "Produção", points: "Pontos" };
const accordionIcons = ["scissors", "sticker", "palette", "settings", "zap", "check-circle"];

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));
const readError = async (response: Response) => `${response.status}: ${await response.text()}`;
const sameValue = (left: unknown, right: unknown) => JSON.stringify(left) === JSON.stringify(right);

function valueText(value: unknown) { return value === null || value === undefined ? "" : String(value); }

export default function AutocolantesServicePageEditor({ serviceId = "autocolantes", onDirtyChange }: { serviceId?: string; onDirtyChange?: (dirty: boolean) => void }) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(
    new URLSearchParams(window.location.search).get("section") || "content",
  );
  const [drafts, setDrafts] = useState<Record<string, Record<string, unknown>>>({});
  const [openSection, setOpenSection] = useState<string | null>(
    new URLSearchParams(window.location.search).get("open") || "hero",
  );
  const [orderDraft, setOrderDraft] = useState<Section[]>([]);
  const [orderDirty, setOrderDirty] = useState(false);
  const [seoDraft, setSeoDraft] = useState<Page["seo"] | null>(null);
  const [galleryDraft, setGalleryDraft] = useState<GalleryImage[]>([]);
  const [galleryDirty, setGalleryDirty] = useState(false);
  const [conflict, setConflict] = useState<string | null>(null);

  const pageQuery = useQuery<Page>({
    queryKey: ["/api/admin/service-pages", serviceId],
    queryFn: async () => {
      let response = await fetch(`/api/admin/service-pages/${serviceId}`, { credentials: "include" });
      if (response.status === 404 && serviceId === "autocolantes") {
        response = await fetch(`/api/admin/service-pages/${serviceId}/initialize`, {
          method: "POST",
          credentials: "include",
        });
      }
      if (!response.ok) throw new Error(await readError(response));
      return response.json() as Promise<Page>;
    },
  });
  const galleryQuery = useQuery<{ images: GalleryImage[] }>({ queryKey: ["/api/service-galleries", serviceId] });
  const page = pageQuery.data;
  const sections = useMemo(() => [...(page?.sections ?? [])].sort((a, b) => a.position - b.position), [page?.sections]);
  const hasUnsaved = Object.keys(drafts).length > 0 || orderDirty || !!seoDraft || galleryDirty;

  useEffect(() => { if (page && !hasUnsaved) { setOrderDraft(clone(sections)); setSeoDraft(null); } }, [page, sections, hasUnsaved]);
  useEffect(() => { if (galleryQuery.data && !galleryDirty) setGalleryDraft(clone(galleryQuery.data.images)); }, [galleryQuery.data, galleryDirty]);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (hasUnsaved) { event.preventDefault(); event.returnValue = ""; } };
    window.addEventListener("beforeunload", warn); return () => window.removeEventListener("beforeunload", warn);
  }, [hasUnsaved]);
  useEffect(() => {
    onDirtyChange?.(hasUnsaved);
    return () => onDirtyChange?.(false);
  }, [hasUnsaved, onDirtyChange]);

  const reload = () => {
    setDrafts({}); setOrderDirty(false); setSeoDraft(null); setGalleryDirty(false); setConflict(null);
    queryClient.invalidateQueries({ queryKey: ["/api/admin/service-pages", serviceId] });
    queryClient.invalidateQueries({ queryKey: ["/api/service-galleries", serviceId] });
  };
  const handleError = (error: unknown, area: string) => {
    const message = error instanceof Error ? error.message : "Não foi possível guardar.";
    if (message.startsWith("409:")) setConflict(area);
    toast({ title: message.startsWith("409:") ? "Alteração pendente noutro editor" : "Erro ao guardar", description: message.startsWith("409:") ? "O seu rascunho foi preservado. Recarregue para reconciliar versões." : message, variant: "destructive" });
  };
  const sectionMutation = useMutation({
    mutationFn: async ({ section, changes }: { section: Section; changes: Record<string, unknown> }) => {
      const response = await fetch(`/api/admin/service-pages/${serviceId}/sections/${section.key}`, { method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: section.type, version: section.version, content: changes }) });
      if (!response.ok) throw new Error(await readError(response)); return response.json() as Promise<Section>;
    },
    onSuccess: (updated, { changes: submittedChanges }) => { queryClient.setQueryData<Page>(["/api/admin/service-pages", serviceId], old => old ? { ...old, sections: old.sections.map(s => s.key === updated.key ? updated : s) } : old); setOrderDraft(current => current.map(section => section.key === updated.key ? { ...section, version: updated.version } : section)); setDrafts(current => { const currentDraft = current[updated.key]; if (!currentDraft) return current; const remaining = Object.fromEntries(Object.entries(currentDraft).filter(([field, value]) => !(field in submittedChanges) || !sameValue(value, submittedChanges[field]))); const next = { ...current }; if (Object.keys(remaining).length) next[updated.key] = remaining; else delete next[updated.key]; return next; }); toast({ title: "Secção guardada", description: `${labels[updated.key] ?? updated.key} está atualizada.` }); },
    onError: (error) => handleError(error, "conteúdo"),
  });
  const seoMutation = useMutation({
    mutationFn: async (changes: Partial<Page["seo"]>) => { const response = await fetch(`/api/admin/service-pages/${serviceId}/seo`, { method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ version: page!.seo.version, ...changes }) }); if (!response.ok) throw new Error(await readError(response)); return response.json() as Promise<Page["seo"]>; },
    onSuccess: (seo, submittedChanges) => { queryClient.setQueryData<Page>(["/api/admin/service-pages", serviceId], old => old ? { ...old, seo } : old); setSeoDraft(current => { if (!current) return null; const changedAfterSubmit = (["title", "description", "ogImage"] as const).filter(field => field in submittedChanges && !sameValue(current[field], submittedChanges[field])); return changedAfterSubmit.length ? { ...seo, ...Object.fromEntries(changedAfterSubmit.map(field => [field, current[field]])) } : null; }); toast({ title: "SEO guardado", description: "Os metadados foram atualizados." }); }, onError: (error) => handleError(error, "SEO"),
  });
  const orderMutation = useMutation({
    mutationFn: async (submittedOrder: Section[]) => {
      const response = await apiRequest("PATCH", `/api/admin/service-pages/${serviceId}/order`, { sections: submittedOrder.map((s, position) => ({ key: s.key, position, visible: s.visible, version: s.version })) });
      return response.json() as Promise<{ serviceId: string; sections: Section[] }>;
    },
    onSuccess: async ({ sections: updatedSections }, submittedOrder) => { setOrderDraft(current => { const changedAfterSubmit = current.some((section, index) => section.key !== submittedOrder[index]?.key || section.visible !== submittedOrder[index]?.visible); const withVersions = current.map((section, index) => { const updated = updatedSections.find(item => item.key === section.key); return updated ? { ...section, position: changedAfterSubmit ? index : updated.position, visible: changedAfterSubmit ? section.visible : updated.visible, version: updated.version } : section; }); setOrderDirty(changedAfterSubmit); return changedAfterSubmit ? withVersions : withVersions.sort((a, b) => a.position - b.position); }); await queryClient.invalidateQueries({ queryKey: ["/api/admin/service-pages", serviceId] }); toast({ title: "Estrutura guardada", description: "A ordem e visibilidade da página foram atualizadas." }); }, onError: (error) => handleError(error, "estrutura"),
  });
  const galleryMutation = useMutation({
    mutationFn: async (submittedGallery: GalleryImage[]) => {
      if (submittedGallery.length === 0 || submittedGallery.some(image => !image.src.trim())) {
        throw new Error("Adicione pelo menos uma imagem e confirme que todas têm um ficheiro ou URL.");
      }
      return apiRequest("PUT", `/api/admin/service-galleries/${serviceId}`, { images: submittedGallery });
    },
    onSuccess: async (_, submittedGallery) => { setGalleryDraft(current => { setGalleryDirty(!sameValue(current, submittedGallery)); return current; }); await queryClient.invalidateQueries({ queryKey: ["/api/service-galleries", serviceId] }); toast({ title: "Galeria guardada", description: "As imagens públicas mantêm-se ligadas à galeria histórica." }); }, onError: (error) => handleError(error, "galeria"),
  });

  const sectionContent = (section: Section) => ({ ...section.content, ...(drafts[section.key] ?? {}) });
  const update = (section: Section, field: string, value: unknown) => setDrafts(current => ({ ...current, [section.key]: { ...(current[section.key] ?? {}), [field]: value } }));
  const saveSection = (section: Section) => { const changes = drafts[section.key]; if (changes && Object.keys(changes).length) sectionMutation.mutate({ section, changes }); };
  const moveSection = (index: number, direction: -1 | 1) => { const target = index + direction; if (target < 0 || target >= orderDraft.length) return; const next = [...orderDraft]; [next[index], next[target]] = [next[target], next[index]]; setOrderDraft(next); setOrderDirty(true); };

  if (pageQuery.isLoading) return <EditorSkeleton />;
  if (pageQuery.isError || !page) return <Card className="border-red-900 bg-zinc-950"><CardContent className="py-12 text-center"><p className="text-lg font-medium">Não foi possível carregar o editor.</p><Button className="mt-4" onClick={() => pageQuery.refetch()}><RefreshCw className="mr-2 h-4 w-4" />Tentar novamente</Button></CardContent></Card>;

  const seo = seoDraft ?? page.seo;
  return <div className="mx-auto max-w-7xl space-y-5 text-zinc-100">
    <header className="rounded-xl border border-zinc-800 bg-zinc-950 px-5 py-5 shadow-2xl shadow-black/20 sm:px-7">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div><div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-yellow-400"><span className="h-2 w-2 rounded-full bg-yellow-400" />Serviços / Autocolantes</div><h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Editor da página de serviço</h1><p className="mt-1 text-sm text-zinc-400">Conteúdo estruturado, media público e metadados num só espaço de trabalho.</p></div>
        <div className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm ${hasUnsaved ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-200" : "border-emerald-800/60 bg-emerald-950/30 text-emerald-300"}`}>{hasUnsaved ? <><span className="h-2 w-2 rounded-full bg-yellow-400" />Alterações por guardar</> : <><Check className="h-4 w-4" />Tudo guardado</>}</div>
      </div>
    </header>
    <div className="rounded-xl border border-sky-900/70 bg-sky-950/35 px-4 py-3 text-sm text-sky-100"><strong>CMS ligado à página pública.</strong> As alterações guardadas de conteúdo, ordem, visibilidade e SEO ficam disponíveis na página de autocolantes. A galeria histórica mantém a sua fonte pública existente.</div>
    {conflict && <div className="flex flex-col gap-3 rounded-xl border border-amber-600/50 bg-amber-500/10 p-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-amber-100"><strong>Conflito de versão em {conflict}.</strong> O rascunho local foi preservado. Para obter a versão atual do CMS terá de descartar este rascunho.</p><Button variant="outline" className="border-amber-500/60 text-amber-100 hover:bg-amber-500/20" onClick={() => { if (window.confirm("Descartar todas as alterações locais e recarregar a versão guardada? Esta ação não pode ser revertida.")) reload(); }}><RefreshCw className="mr-2 h-4 w-4" />Descartar rascunho e recarregar</Button></div>}
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid h-auto w-full grid-cols-3 rounded-xl bg-zinc-900 p-1">
        <TabsTrigger value="content" className="gap-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-zinc-950">Conteúdo</TabsTrigger>
        <TabsTrigger value="media" className="gap-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-zinc-950">Media</TabsTrigger>
        <TabsTrigger value="seo" className="gap-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-zinc-950">SEO</TabsTrigger>
      </TabsList>
      <TabsContent value="content" className="mt-5 space-y-5">
        <Card className="border-zinc-800 bg-zinc-950"><CardHeader className="flex-row items-center justify-between space-y-0"><div><CardTitle className="text-base">Estrutura da página</CardTitle><CardDescription>Defina a ordem e a visibilidade preparada para cada bloco.</CardDescription></div><Button onClick={() => orderMutation.mutate(clone(orderDraft))} disabled={!orderDirty || orderMutation.isPending}><Save className="mr-2 h-4 w-4" />Guardar estrutura</Button></CardHeader><CardContent className="space-y-2">{orderDraft.map((section, index) => <div key={section.key} className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2"><GripVertical className="h-4 w-4 text-zinc-600" /><span className="min-w-0 flex-1 truncate text-sm font-medium">{index + 1}. {labels[section.key] ?? section.key}</span><Button variant="ghost" size="icon" aria-label="Mover secção acima" disabled={index === 0} onClick={() => moveSection(index, -1)}><ChevronUp className="h-4 w-4" /></Button><Button variant="ghost" size="icon" aria-label="Mover secção abaixo" disabled={index === orderDraft.length - 1} onClick={() => moveSection(index, 1)}><ChevronDown className="h-4 w-4" /></Button><Button variant="ghost" size="icon" aria-label={section.visible ? "Ocultar secção" : "Mostrar secção"} onClick={() => { setOrderDraft(old => old.map(s => s.key === section.key ? { ...s, visible: !s.visible } : s)); setOrderDirty(true); }}>{section.visible ? <Eye className="h-4 w-4 text-yellow-400" /> : <EyeOff className="h-4 w-4 text-zinc-500" />}</Button></div>)}</CardContent></Card>
        {sections.map(section => <SectionEditor key={section.key} section={section} content={sectionContent(section)} dirty={!!drafts[section.key]} open={openSection === section.key} onToggle={() => setOpenSection(openSection === section.key ? null : section.key)} onUpdate={(field, value) => update(section, field, value)} onSave={() => saveSection(section)} saving={sectionMutation.isPending} />)}
      </TabsContent>
      <TabsContent value="media" className="mt-5 space-y-5">
        {sections.filter(s => s.key === "hero" || s.key === "video").map(section => <SectionEditor key={section.key} section={section} content={sectionContent(section)} dirty={!!drafts[section.key]} open onToggle={() => undefined} onUpdate={(field, value) => update(section, field, value)} onSave={() => saveSection(section)} saving={sectionMutation.isPending} mediaOnly />)}
        <GalleryEditor images={galleryDraft} dirty={galleryDirty} saving={galleryMutation.isPending} onChange={(images) => { setGalleryDraft(images); setGalleryDirty(true); }} onSave={() => galleryMutation.mutate(clone(galleryDraft))} />
      </TabsContent>
      <TabsContent value="seo" className="mt-5"><Card className="border-zinc-800 bg-zinc-950"><CardHeader><CardTitle>Pesquisa e partilha</CardTitle><CardDescription>Pré-visualize os dados que motores de pesquisa e redes sociais vão receber.</CardDescription></CardHeader><CardContent className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px]"><div className="space-y-4"><Field label="Título SEO" value={seo.title} onChange={v => setSeoDraft({ ...seo, title: v })} /><Field label="Meta descrição" value={seo.description} onChange={v => setSeoDraft({ ...seo, description: v })} long /><ImageUploader label="Imagem Open Graph" value={seo.ogImage ?? ""} onChange={v => setSeoDraft({ ...seo, ogImage: v || null })} folder="servicos" /><Button onClick={() => { const changed = Object.fromEntries((["title", "description", "ogImage"] as const).filter(k => seo[k] !== page.seo[k]).map(k => [k, seo[k]])); if (Object.keys(changed).length) seoMutation.mutate(changed); }} disabled={!seoDraft || seoMutation.isPending}><Save className="mr-2 h-4 w-4" />Guardar SEO</Button></div><article className="overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900"><div className="aspect-[1.91/1] bg-zinc-800">{seo.ogImage ? <img src={seo.ogImage} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-zinc-600"><ImageIcon /></div>}</div><div className="space-y-1 p-4"><p className="text-xs uppercase tracking-wider text-zinc-500">domrealce.com</p><h3 className="line-clamp-2 font-semibold">{seo.title || "Título da página"}</h3><p className="line-clamp-3 text-sm text-zinc-400">{seo.description || "Descrição da página"}</p></div></article></CardContent></Card></TabsContent>
    </Tabs>
  </div>;
}

function SectionEditor({ section, content, dirty, open, onToggle, onUpdate, onSave, saving, mediaOnly = false }: { section: Section; content: Record<string, unknown>; dirty: boolean; open: boolean; onToggle: () => void; onUpdate: (field: string, value: unknown) => void; onSave: () => void; saving: boolean; mediaOnly?: boolean }) {
  const fields = Object.entries(content).filter(([key, value]) => key !== "legacyServiceGalleryKey" && !Array.isArray(value) && (value === null || typeof value !== "object") && (!mediaOnly || ["imageSrc", "imageAlt", "title", "description", "url", "poster"].includes(key)));
  return <Card id={`section-${section.key}`} className={`scroll-mt-4 border-zinc-800 bg-zinc-950 transition-colors ${dirty ? "border-yellow-500/40" : ""}`}><CardHeader className="cursor-pointer select-none py-4" role="button" tabIndex={0} aria-expanded={open} onClick={onToggle} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onToggle(); } }}><div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-800 text-yellow-400">{section.key === "video" ? <Video className="h-4 w-4" /> : <span className="text-xs font-bold">{String(section.position + 1).padStart(2, "0")}</span>}</div><div className="min-w-0 flex-1"><CardTitle className="text-base">{labels[section.key] ?? section.key}</CardTitle><CardDescription>{dirty ? "Rascunho com alterações por guardar" : section.visible ? "Visível na página pública" : "Oculta na página pública"}</CardDescription></div>{dirty && <span className="hidden text-xs font-medium text-yellow-300 sm:block">Por guardar</span>}{open ? <ChevronUp className="h-5 w-5 text-zinc-400" /> : <ChevronDown className="h-5 w-5 text-zinc-400" />}</div></CardHeader>
    {open && <CardContent className="border-t border-zinc-800 pt-5"><div className="grid gap-4 md:grid-cols-2">{fields.map(([key, value]) => <div key={key} className={longFields.has(key) || imageFields.has(key) ? "md:col-span-2" : ""}>{key === "defaultOpenKey" ? <div className="space-y-2"><Label htmlFor={`${section.key}-default-open`} className="text-zinc-300">{fieldLabels[key]}</Label><select id={`${section.key}-default-open`} value={valueText(value)} onChange={event => onUpdate(key, event.target.value || null)} className="flex h-10 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"><option value="">Nenhum</option>{((content.items as Item[] | undefined) ?? []).map(item => <option key={item.id} value={valueText(item.key)}>{valueText(item.title) || valueText(item.key)}</option>)}</select></div> : imageFields.has(key) ? <ImageUploader label={fieldLabels[key] ?? key} value={valueText(value)} onChange={v => onUpdate(key, v || (key === "poster" ? null : ""))} folder="servicos" /> : <Field label={fieldLabels[key] ?? key} value={valueText(value)} type={typeof value === "number" ? "number" : "text"} long={longFields.has(key)} onChange={v => onUpdate(key, typeof value === "number" ? Number(v) : (value === null ? v || null : v))} />}</div>)}</div>
      {!mediaOnly && Object.entries(content).filter(([, value]) => value !== null && typeof value === "object" && !Array.isArray(value)).map(([key, value]) => <div key={key} className="mt-5 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4"><h3 className="mb-3 text-sm font-semibold">{key === "primaryCta" ? "Chamada principal" : key === "secondaryCta" ? "Chamada secundária" : fieldLabels[key] ?? key}</h3><div className="grid gap-3 md:grid-cols-2">{Object.entries(value as Record<string, unknown>).map(([nestedKey, nestedValue]) => <Field key={nestedKey} label={nestedKey === "href" ? "Destino (URL)" : "Texto"} value={valueText(nestedValue)} onChange={v => onUpdate(key, { ...(value as Record<string, unknown>), [nestedKey]: v })} />)}</div></div>)}
      {!mediaOnly && Object.entries(content).filter(([, value]) => Array.isArray(value)).map(([key, value]) => <ArrayEditor key={key} name={key} items={value as Item[]} onChange={items => onUpdate(key, items)} />)}
      {section.key === "video" && <><VideoPreview url={content.url as string | null} poster={content.poster as string | null} title={valueText(content.title)} /><p className="mt-4 rounded-md border border-zinc-800 bg-zinc-900 p-3 text-xs text-zinc-400">O vídeo permanece fora da página pública enquanto esta secção estiver oculta. Para o publicar, configure uma URL válida e ative a visibilidade na estrutura.</p></>}
      <div className="mt-6 flex justify-end"><Button onClick={(e) => { e.stopPropagation(); onSave(); }} disabled={!dirty || saving}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Guardar secção</Button></div>
    </CardContent>}</Card>;
}

function Field({ label, value, onChange, long = false, type = "text" }: { label: string; value: string; onChange: (value: string) => void; long?: boolean; type?: string }) { const id = useId(); return <div className="space-y-2"><Label htmlFor={id} className="text-zinc-300">{label}</Label>{long ? <Textarea id={id} value={value} onChange={e => onChange(e.target.value)} className="min-h-24 border-zinc-700 bg-zinc-900 text-zinc-100" /> : <Input id={id} type={type} value={value} onChange={e => onChange(e.target.value)} className="border-zinc-700 bg-zinc-900 text-zinc-100" />}</div>; }

function ArrayEditor({ name, items, onChange }: { name: string; items: Item[]; onChange: (items: Item[]) => void }) {
  const updateItem = (index: number, field: string, value: unknown) => onChange(items.map((item, i) => i === index ? { ...item, [field]: value } : item));
  const move = (index: number, direction: -1 | 1) => { const target = index + direction; if (target < 0 || target >= items.length) return; const next = clone(items); [next[index], next[target]] = [next[target], next[index]]; onChange(next.map((item, position) => ({ ...item, position }))); };
  return <section className="mt-6 border-t border-zinc-800 pt-5"><div className="mb-3"><h3 className="font-medium">{arrayLabels[name] ?? name}</h3><p className="mt-1 text-xs text-zinc-500">Edite, reordene ou ajuste a visibilidade dos itens existentes.</p></div><div className="space-y-3">{items.map((item, index) => <div key={item.id} className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3"><div className="mb-3 flex items-center gap-1"><GripVertical className="mr-1 h-4 w-4 text-zinc-600" /><span className="flex-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">Item {index + 1}</span><Button variant="ghost" size="icon" aria-label="Subir item" disabled={index === 0} onClick={() => move(index, -1)}><ChevronUp className="h-4 w-4" /></Button><Button variant="ghost" size="icon" aria-label="Descer item" disabled={index === items.length - 1} onClick={() => move(index, 1)}><ChevronDown className="h-4 w-4" /></Button></div><div className="grid gap-3 md:grid-cols-2">{Object.entries(item).filter(([key, value]) => !["id", "position", "visible"].includes(key) && !Array.isArray(value)).map(([key, value]) => key === "icon" ? <div key={key} className="space-y-2"><Label htmlFor={`${item.id}-icon`} className="text-zinc-300">{fieldLabels[key]}</Label><select id={`${item.id}-icon`} value={valueText(value)} onChange={event => updateItem(index, key, event.target.value)} className="flex h-10 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100">{accordionIcons.map(icon => <option key={icon} value={icon}>{icon}</option>)}</select></div> : <Field key={key} label={fieldLabels[key] ?? key} value={valueText(value)} long={longFields.has(key) || key === "content"} onChange={v => updateItem(index, key, v)} />)}{Object.entries(item).filter(([, value]) => Array.isArray(value)).map(([key, value]) => <div key={key} className="md:col-span-2"><Label className="text-zinc-300">{fieldLabels[key] ?? key} <span className="text-zinc-500">(uma linha por item)</span></Label><Textarea value={(value as string[]).join("\n")} onChange={e => updateItem(index, key, e.target.value.split("\n").filter(Boolean))} className="mt-2 border-zinc-700 bg-zinc-900 text-zinc-100" /></div>)}</div><div className="mt-3 flex items-center gap-2"><Switch id={`${item.id}-visible`} checked={item.visible} onCheckedChange={v => updateItem(index, "visible", v)} /><Label htmlFor={`${item.id}-visible`} className="text-xs text-zinc-400">Visível</Label></div></div>)}</div></section>;
}

function GalleryEditor({ images, dirty, saving, onChange, onSave }: { images: GalleryImage[]; dirty: boolean; saving: boolean; onChange: (images: GalleryImage[]) => void; onSave: () => void }) { const update = (index: number, field: keyof GalleryImage, value: string) => onChange(images.map((image, i) => i === index ? { ...image, [field]: value } : image)); const move = (index: number, direction: -1 | 1) => { const target = index + direction; if (target < 0 || target >= images.length) return; const next = [...images]; [next[index], next[target]] = [next[target], next[index]]; onChange(next); }; return <Card className="border-zinc-800 bg-zinc-950"><CardHeader className="flex-row items-center justify-between space-y-0"><div><CardTitle>Galeria pública</CardTitle><CardDescription>Esta é a galeria histórica atualmente usada no site público.</CardDescription></div><Button onClick={onSave} disabled={!dirty || saving}><Save className="mr-2 h-4 w-4" />Guardar galeria</Button></CardHeader><CardContent className="space-y-4">{images.map((image, index) => <div key={`${image.src}-${index}`} className="grid gap-4 rounded-lg border border-zinc-800 p-3 md:grid-cols-[150px_1fr_auto]"><div className="aspect-square overflow-hidden rounded bg-zinc-900">{image.src ? <img src={image.src} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-zinc-600"><ImageIcon /></div>}</div><div className="grid gap-3"><ImageUploader label={`Imagem ${index + 1}`} value={image.src} onChange={v => update(index, "src", v)} folder="servicos" /><Field label="Texto alternativo" value={image.alt} onChange={v => update(index, "alt", v)} /><Field label="Título" value={image.title} onChange={v => update(index, "title", v)} /></div><div className="flex self-start"><Button variant="ghost" size="icon" aria-label="Mover imagem acima" disabled={index === 0} onClick={() => move(index, -1)}><ChevronUp className="h-4 w-4" /></Button><Button variant="ghost" size="icon" aria-label="Mover imagem abaixo" disabled={index === images.length - 1} onClick={() => move(index, 1)}><ChevronDown className="h-4 w-4" /></Button><Button variant="ghost" size="icon" aria-label="Remover imagem" onClick={() => { if (window.confirm("Remover esta imagem da galeria?")) onChange(images.filter((_, i) => i !== index)); }}><Trash2 className="h-4 w-4 text-red-400" /></Button></div></div>)}<Button variant="outline" onClick={() => onChange([...images, { src: "", alt: "", title: "" }])}><Plus className="mr-2 h-4 w-4" />Adicionar imagem</Button></CardContent></Card>; }

function VideoPreview({ url, poster, title }: { url: string | null; poster: string | null; title: string }) { if (!url && !poster) return null; return <div className="mt-5 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900"><div className="aspect-video bg-zinc-950">{url ? <video controls poster={poster ?? undefined} className="h-full w-full" aria-label={title || "Pré-visualização de vídeo"}><source src={url} />O seu navegador não suporta a pré-visualização de vídeo.</video> : poster ? <img src={poster} alt={title || "Poster do vídeo"} className="h-full w-full object-cover" /> : null}</div><div className="border-t border-zinc-800 px-3 py-2 text-xs text-zinc-400">Pré-visualização de media</div></div>; }

function EditorSkeleton() { return <div className="mx-auto max-w-7xl space-y-5 animate-pulse"><div className="h-32 rounded-xl bg-zinc-900" /><div className="h-12 rounded-xl bg-zinc-900" />{[1, 2, 3].map(i => <div key={i} className="h-20 rounded-xl bg-zinc-900" />)}</div>; }