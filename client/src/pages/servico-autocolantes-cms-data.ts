export type PublicGalleryImage = {
  src: string;
  alt: string;
  title: string;
};

export function selectPublicGalleryImages(
  historicalImages: PublicGalleryImage[],
  embeddedHistoricalImages: PublicGalleryImage[] | undefined,
  cmsFallbackImages: PublicGalleryImage[],
) {
  if (historicalImages.length) return historicalImages;
  if (embeddedHistoricalImages?.length) return embeddedHistoricalImages;
  return cmsFallbackImages;
}

/** Os seis exemplos atuais usam destinos explícitos por imagem, não pela ordem.
 * Imagens novas mantêm uma escolha neutra de produto até se definir o destino. */
export function linkAutocolantesGallery(images: PublicGalleryImage[], calculatorUrl: string) {
  return images.map(image => {
    let src = image.src.toLowerCase().split(/[?#]/)[0];
    try { src = decodeURIComponent(src); } catch { /* Mantém caminhos com escapes inválidos. */ }
    let path: string | null = null;
    if (src.includes("eventos-festivos") || src.includes("saldos-promocoes-montras")) path = "/vinil-impresso";
    if (src.includes("copos-garrafas-gelados") || src.includes("motos-carros-eletrodomesticos") || src.includes("pastel_com_flores_e_etiquetas")) path = "/etiquetas";
    if (path) {
      const url = new URL(calculatorUrl);
      url.pathname = path;
      return { ...image, href: url.toString(), action: "Calcular preço" };
    }
    if (src.includes("moveis-paredes-texturas")) {
      return { ...image, href: `/servico-espacos-comerciais${new URL(calculatorUrl).search}`, action: "Ver opções" };
    }
    return { ...image, href: "#escolher-autocolantes", action: "Ver opções" };
  });
}
