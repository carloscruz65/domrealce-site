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