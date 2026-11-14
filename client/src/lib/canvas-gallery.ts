export interface CanvasGalleryImage {
  name: string;
  path: string;
  category: string;
}

function decode(value: string): string {
  try { return decodeURIComponent(value); } catch { return value; }
}

// As capas, pastas e URLs antigas podem diferir em acentos, maiúsculas e separadores.
// Normalizar só a comparação; o caminho do ficheiro mantém-se intacto.
export function normalizeCanvasCategory(value: string): string {
  return decode(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function canvasCategoryImages(paths: readonly string[], category?: string): CanvasGalleryImage[] {
  const key = normalizeCanvasCategory(category || "");
  if (!key) return [];
  const seen = new Set<string>();
  return paths.flatMap((path) => {
    if (!/\.(jpg|jpeg|png|gif|webp)$/i.test(path) || seen.has(path)) return [];
    const parts = path.split("/");
    const root = parts.findIndex((part) => normalizeCanvasCategory(part) === "quadrosemcanvas");
    if (root < 0) return [];
    let folderIndex = root + 1;
    if (normalizeCanvasCategory(parts[folderIndex] || "") === "quadrosemcanvas") folderIndex++;
    const folder = parts[folderIndex];
    if (!folder || folderIndex >= parts.length - 1 || normalizeCanvasCategory(folder) !== key) return [];
    seen.add(path);
    return [{
      name: parts[parts.length - 1].replace(/\.(jpg|jpeg|png|gif|webp)$/i, ""),
      path: `/public-objects/${path}`,
      category: folder,
    }];
  }).sort((a, b) => a.name.localeCompare(b.name));
}
