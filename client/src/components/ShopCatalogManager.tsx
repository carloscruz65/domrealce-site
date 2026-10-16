import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  categoryInput,
  productInput,
  settingsInput,
  slugify,
  type ShopCatalog,
  type ShopCategory,
  type ShopProduct,
} from "@shared/shop-catalog";

const button = "bg-[#FFD700] text-black hover:bg-[#e6c200]";
const money = (cents: number) => (cents / 100).toFixed(2);
const euroCents = (value: FormDataEntryValue | null) =>
  Math.round(Number(String(value).replace(",", ".")) * 100);
function Field({
  name,
  label,
  value,
  type = "text",
  min,
  step,
  required = true,
}: {
  name: string;
  label: string;
  value?: string | number;
  type?: string;
  min?: number;
  step?: number;
  required?: boolean;
}) {
  return (
    <Label className="block space-y-2">
      {label}
      <Input
        name={name}
        defaultValue={value}
        type={type}
        min={min}
        step={step}
        required={required}
      />
    </Label>
  );
}
function ImageField({ value }: { value?: string }) {
  const [image, setImage] = useState(value || "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <div className="space-y-2">
      <Label>
        Fotografia (URL ou ficheiro)
        <Input
          name="image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="/public-objects/... ou https://..."
        />
      </Label>
      <Input
        aria-label="Carregar fotografia"
        type="file"
        accept="image/*"
        disabled={busy}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setBusy(true);
          setError("");
          try {
            const data = new FormData();
            data.append("file", file);
            data.append("folder", "loja/catalogo");
            const response = await fetch("/api/objects/upload-file", {
              method: "POST",
              body: data,
              credentials: "include",
            });
            const result = await response.json();
            if (!response.ok)
              throw new Error(
                result.error || "Não foi possível carregar a imagem.",
              );
            setImage(result.url);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Erro no upload.");
          } finally {
            setBusy(false);
          }
        }}
      />
      {busy && <p role="status">A carregar fotografia…</p>}
      {error && <p role="alert">{error}</p>}
      {image && (
        <img
          src={image}
          alt="Pré-visualização"
          className="h-32 w-40 rounded object-contain"
        />
      )}
      <input type="hidden" name="imageUploading" value={busy ? "yes" : "no"} />
    </div>
  );
}

export default function ShopCatalogManager() {
  const { data, isLoading, error } = useQuery<ShopCatalog>({
    queryKey: ["/api/admin/shop"],
  });
  const [mode, setMode] = useState<"categories" | "products" | "settings">(
    "products",
  );
  const [editing, setEditing] = useState<
    ShopCategory | ShopProduct | "new" | null
  >(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setBusy(true);
    try {
      const f = new FormData(event.currentTarget);
      if (f.get("imageUploading") === "yes")
        throw new Error("Aguarde pelo carregamento da fotografia.");
      let path = "/api/admin/shop/" + mode;
      let method = "POST";
      let input: unknown;
      if (mode === "settings") {
        const prices = Object.fromEntries(
          Object.keys(data!.settings.canvasPricesCents).map((size) => [
            size,
            euroCents(f.get(size)),
          ]),
        );
        input = settingsInput.parse({
          shippingCents: euroCents(f.get("shipping")),
          freeShippingFromCents: euroCents(f.get("free")),
          wallpaperPriceCentsM2: euroCents(f.get("wallpaper")),
          wallpaperLaminationCentsM2: euroCents(f.get("lamination")),
          canvasPricesCents: prices,
        });
        method = "PUT";
      } else {
        const common = {
          name: f.get("name"),
          slug: f.get("slug") || slugify(String(f.get("name"))),
          description: f.get("description"),
          image: f.get("image"),
          published: f.get("published") === "on",
          position: Number(f.get("position")),
        };
        input =
          mode === "categories"
            ? categoryInput.parse(common)
            : productInput.parse({
                ...common,
                categoryId: f.get("categoryId"),
                specifications: f.get("specifications"),
                personalizationLabel: f.get("personalizationLabel"),
                priceCents: euroCents(f.get("price")),
                minimumQuantity: Number(f.get("minimumQuantity")),
                quantityStep: Number(f.get("quantityStep")),
                unit: f.get("unit"),
              });
        if (editing && editing !== "new") {
          method = "PUT";
          path += "/" + editing.id;
        }
      }
      const response = await fetch(path, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Erro ao guardar.");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["/api/admin/shop"] }),
        queryClient.invalidateQueries({ queryKey: ["/api/shop/catalog"] }),
      ]);
      setEditing(null);
      setMessage("Guardado com sucesso.");
    } catch (err: any) {
      setMessage(
        err?.issues?.map((i: any) => i.message).join(" ") ||
          err.message ||
          "Erro ao guardar.",
      );
    } finally {
      setBusy(false);
    }
  };
  if (isLoading) return <p>A carregar a loja…</p>;
  if (error || !data)
    return (
      <p role="alert">
        Não foi possível carregar a loja. Confirme a instalação da atualização
        da base de dados.
      </p>
    );
  const selected = editing && editing !== "new" ? editing : undefined;
  const product = selected as ShopProduct | undefined;
  const settings = data.settings;
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          Loja: categorias, produtos e preços
        </h2>
        <p className="text-gray-300">
          Produtos compráveis no carrinho da loja. Os cartões da homepage são
          geridos em Destaques.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["products", "Produtos"],
            ["categories", "Categorias"],
            ["settings", "Preços e portes"],
          ] as const
        ).map(([key, title]) => (
          <Button
            key={key}
            variant={mode === key ? "default" : "outline"}
            className={mode === key ? button : ""}
            onClick={() => {
              setMode(key);
              setEditing(null);
              setMessage("");
            }}
          >
            {title}
          </Button>
        ))}
      </div>
      {message && (
        <p role="status" className="border p-3 rounded whitespace-pre-wrap">
          {message}
        </p>
      )}
      {mode !== "settings" && !editing && (
        <>
          <Button
            className={button}
            onClick={() => setEditing("new")}
            disabled={mode === "products" && !data.categories.length}
          >
            Criar {mode === "categories" ? "categoria" : "produto"}
          </Button>
          {mode === "products" && !data.categories.length && (
            <p>Crie primeiro uma categoria.</p>
          )}
          {(mode === "categories" ? data.categories : data.products).map(
            (entry) => {
              const productEntry = "priceCents" in entry;
              const publicPath = productEntry
                ? `/loja/produto/${entry.slug}`
                : `/loja/categoria/${entry.slug}`;
              const visible =
                entry.published &&
                (!productEntry ||
                  data.categories.some(
                    (c) =>
                      c.id === (entry as ShopProduct).categoryId && c.published,
                  ));
              return (
                <div
                  key={entry.id}
                  className="flex flex-wrap items-center justify-between gap-3 border rounded p-4"
                >
                  <div>
                    <strong>{entry.name}</strong>
                    <p className="text-sm text-gray-300">
                      {visible
                        ? "Publicado"
                        : entry.published
                          ? "Categoria em rascunho — produto ainda não visível"
                          : "Rascunho"}
                      {productEntry
                        ? ` · €${money((entry as ShopProduct).priceCents)} sem IVA / ${(entry as ShopProduct).unit}`
                        : ""}
                    </p>
                    <a
                      className="text-[#FFD700] underline break-all"
                      href={publicPath}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Abrir ligação{" "}
                      {visible ? "pública" : "(disponível após publicar)"}
                    </a>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={!visible}
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(
                            new URL(publicPath, window.location.origin).href,
                          );
                          setMessage(
                            "Ligação copiada. Pode utilizá-la num cartão, botão ou mensagem.",
                          );
                        } catch {
                          setMessage(
                            "Não foi possível copiar automaticamente. Abra a ligação e copie o endereço na barra do navegador.",
                          );
                        }
                      }}
                    >
                      Copiar ligação
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditing(entry);
                        setMessage("");
                      }}
                    >
                      Editar
                    </Button>
                  </div>
                </div>
              );
            },
          )}
          {!data.categories.length && (
            <p>
              A loja existente de papel de parede e canvas mantém as suas
              categorias. Aqui pode acrescentar novas categorias de artigos.
            </p>
          )}
        </>
      )}
      {(editing || mode === "settings") && (
        <form
          key={`${mode}-${selected?.id || "new"}`}
          onSubmit={save}
          className="space-y-5 max-w-3xl border rounded p-5"
        >
          {mode === "settings" ? (
            <>
              <p>
                Valores sem IVA. O IVA é aplicado uma única vez no checkout. Os
                portes não recebem descontos.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  name="shipping"
                  label="Portes (€ sem IVA)"
                  type="number"
                  min={0}
                  step={0.01}
                  value={money(settings.shippingCents)}
                />
                <Field
                  name="free"
                  label="Portes grátis a partir de (€ sem IVA)"
                  type="number"
                  min={0}
                  step={0.01}
                  value={money(settings.freeShippingFromCents)}
                />
                <Field
                  name="wallpaper"
                  label="Papel de parede / m² (€ sem IVA)"
                  type="number"
                  min={0.01}
                  step={0.01}
                  value={money(settings.wallpaperPriceCentsM2)}
                />
                <Field
                  name="lamination"
                  label="Laminação / m² (€ sem IVA)"
                  type="number"
                  min={0}
                  step={0.01}
                  value={money(settings.wallpaperLaminationCentsM2)}
                />
                {Object.entries(settings.canvasPricesCents).map(
                  ([size, price]) => (
                    <Field
                      key={size}
                      name={size}
                      label={`Canvas ${size} cm (€ sem IVA)`}
                      type="number"
                      min={0.01}
                      step={0.01}
                      value={money(price)}
                    />
                  ),
                )}
              </div>
            </>
          ) : (
            <>
              <Field name="name" label="Nome" value={selected?.name} />
              <Field
                name="slug"
                label="Endereço da página (opcional; criado automaticamente a partir do nome)"
                value={selected?.slug}
                required={false}
              />
              <Label className="block">
                Descrição
                <Textarea
                  name="description"
                  defaultValue={selected?.description}
                />
              </Label>
              <ImageField value={selected?.image} />
              {mode === "products" && (
                <>
                  <Label className="block">
                    Categoria
                    <select
                      name="categoryId"
                      required
                      defaultValue={product?.categoryId || ""}
                      className="block w-full bg-background border p-2 rounded"
                    >
                      <option value="" disabled>
                        Escolher categoria
                      </option>
                      {data.categories.map((c) => (
                        <option value={c.id} key={c.id}>
                          {c.name}
                          {c.published ? "" : " (rascunho)"}
                        </option>
                      ))}
                    </select>
                  </Label>
                  <Label className="block">
                    Material, medidas e conteúdo do conjunto
                    <Textarea
                      name="specifications"
                      defaultValue={product?.specifications}
                      placeholder="Ex.: vinil; 17 × 25 cm; conjunto de 3 autocolantes"
                    />
                  </Label>
                  <div className="space-y-2">
                    <Field
                      name="personalizationLabel"
                      label="Campo de personalização (opcional)"
                      value={product?.personalizationLabel || ""}
                      required={false}
                    />
                    <p className="text-sm text-muted-foreground">
                      Ex.: Número do alvará, matrícula ou nome. Ao preencher, o
                      cliente terá de indicar esse texto antes de comprar. Deixe
                      vazio para não pedir personalização. Máximo: 100
                      caracteres no nome do campo e 200 na resposta.
                    </p>
                  </div>
                  <Field
                    name="price"
                    label="Preço por unidade/conjunto (€ sem IVA)"
                    type="number"
                    min={0.01}
                    step={0.01}
                    value={product ? money(product.priceCents) : ""}
                  />
                  <Label className="block">
                    Vendido por
                    <select
                      name="unit"
                      defaultValue={product?.unit || "unidade"}
                      className="block bg-background border p-2 rounded"
                    >
                      <option value="unidade">Unidade</option>
                      <option value="conjunto">Conjunto</option>
                    </select>
                  </Label>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field
                      name="minimumQuantity"
                      label="Quantidade mínima"
                      type="number"
                      min={1}
                      step={1}
                      value={product?.minimumQuantity ?? 1}
                    />
                    <Field
                      name="quantityStep"
                      label="Incremento de quantidade"
                      type="number"
                      min={1}
                      step={1}
                      value={product?.quantityStep ?? 1}
                    />
                  </div>
                </>
              )}
              <Field
                name="position"
                label="Ordem de apresentação"
                type="number"
                min={0}
                step={1}
                value={selected?.position ?? 0}
              />
              <Label className="flex gap-3 items-center">
                <input
                  name="published"
                  type="checkbox"
                  defaultChecked={selected?.published ?? false}
                />
                Publicado na loja
              </Label>
              <p className="text-sm text-gray-300">
                Desmarque para retirar da loja. Os pedidos antigos mantêm o
                registo do que foi comprado. Um produto só aparece se a sua
                categoria também estiver publicada.
              </p>
            </>
          )}
          <div className="flex gap-3">
            <Button type="submit" disabled={busy} className={button}>
              {busy ? "A guardar…" : "Guardar"}
            </Button>
            {mode !== "settings" && (
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={() => setEditing(null)}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
