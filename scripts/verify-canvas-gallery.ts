import assert from "node:assert/strict";
import fs from "node:fs";
import { canvasCategoryImages, normalizeCanvasCategory } from "../client/src/lib/canvas-gallery";

const base = "loja/quadros-em-canvas/Quadros-em-canvas/";
const marble = `${base}Textura_mármore/quadro.webp`;
const geometric = `${base}Mármore_geométrico/quadro.webp`;
const contemporary = `${base}Arte_ContemporâNea/quadro.webp`;
const files = [marble, geometric, contemporary, `${base}Abstratos/primeiro.jpg`,
  "loja/quadros-em-canvas/Capas-quadros-em-canvas/Textura_marmore.webp", marble];

for (const alias of ["Textura_marmore", "Textura_mármore", "TEXTURA-MÁRMORE", "Textura_ma\u0301rmore", "Textura_m%C3%A1rmore"]) {
  const images = canvasCategoryImages(files, alias);
  assert.equal(images.length, 1, alias);
  assert.equal(images[0].path, `/public-objects/${marble}`, "Preservar caminho com acentos");
  assert.equal(images[0].category, "Textura_mármore");
}
assert.equal(canvasCategoryImages(files, "Marmore_geometrico").length, 1);
assert.equal(canvasCategoryImages(files, "Arte_Contempor%C3%A2Nea").length, 1);
assert.equal(canvasCategoryImages(files, "Abstratos").length, 1);
assert.equal(canvasCategoryImages(files, "nao-existe").length, 0);
assert.equal(canvasCategoryImages(files, "").length, 0);
assert.doesNotThrow(() => canvasCategoryImages(files, "%invalido"));
assert.equal(canvasCategoryImages(["loja/quadros-em-canvas/Abstratos/quadro.PNG"], "abstratos").length, 1);
assert.equal(canvasCategoryImages([`${base}Abstratos/notas.txt`], "Abstratos").length, 0);

// Opcional: verificar o inventário real obtido por GET /api/loja/images.
if (process.argv[2]) {
  const inventory: string[] = JSON.parse(fs.readFileSync(process.argv[2], "utf8")).images;
  const covers = inventory.filter(p => p.toLowerCase().includes("quadros-em-canvas/capas-quadros-em-canvas/") && /\.webp$/i.test(p));
  const categories = new Map<string, number>();
  for (const cover of covers) {
    const name = cover.split("/").pop()!.replace(/\.webp$/i, "");
    const images = canvasCategoryImages(inventory, name);
    if (!images.length) continue;
    categories.set(normalizeCanvasCategory(name), images.length);
    const linkedCategory = encodeURIComponent(images[0].category);
    assert.equal(canvasCategoryImages(inventory, linkedCategory).length, images.length, name);
  }
  console.log(`Inventário: ${categories.size} categorias; ${[...categories.values()].reduce((a, b) => a + b, 0)} quadros associados.`);
  console.log(`Textura Mármore: ${canvasCategoryImages(inventory, "Textura_marmore").length}; Mármore Geométrico: ${canvasCategoryImages(inventory, "Marmore_geometrico").length}.`);
}
console.log("OK: acentos, URLs codificados, maiúsculas, separadores, duplicados e exclusão de capas.");
