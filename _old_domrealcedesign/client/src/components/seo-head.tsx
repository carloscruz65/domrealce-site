import { useEffect } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  heroImage?: string; // imagem principal da página (ex: hero da home)
}

export function SEOHead({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage = "https://www.domrealce.com/og-image.jpg",
  heroImage,
}: SEOHeadProps) {
  useEffect(() => {
    const { head } = document;

    // TITLE
    if (title) {
      document.title = `${title} | DOMREALCE`;
    }

    // META DESCRIPTION
    if (description) {
      let metaDesc = head.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", description);
    }

    // META KEYWORDS
    if (keywords) {
      let metaKeywords = head.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.setAttribute("name", "keywords");
        head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute("content", keywords);
    }

    // CANONICAL URL
    if (canonicalUrl) {
      let canonicalLink = head.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement("link");
        canonicalLink.setAttribute("rel", "canonical");
        head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute("href", canonicalUrl);
    }

    // OPEN GRAPH BASE
    if (title) {
      let ogTitle = head.querySelector('meta[property="og:title"]');
      if (!ogTitle) {
        ogTitle = document.createElement("meta");
        ogTitle.setAttribute("property", "og:title");
        head.appendChild(ogTitle);
      }
      ogTitle.setAttribute("content", title);
    }

    if (description) {
      let ogDesc = head.querySelector('meta[property="og:description"]');
      if (!ogDesc) {
        ogDesc = document.createElement("meta");
        ogDesc.setAttribute("property", "og:description");
        head.appendChild(ogDesc);
      }
      ogDesc.setAttribute("content", description);
    }

    if (canonicalUrl) {
      let ogUrl = head.querySelector('meta[property="og:url"]');
      if (!ogUrl) {
        ogUrl = document.createElement("meta");
        ogUrl.setAttribute("property", "og:url");
        head.appendChild(ogUrl);
      }
      ogUrl.setAttribute("content", canonicalUrl);
    }

    // OPEN GRAPH IMAGE
    if (ogImage) {
      let ogImg = head.querySelector('meta[property="og:image"]');
      if (!ogImg) {
        ogImg = document.createElement("meta");
        ogImg.setAttribute("property", "og:image");
        head.appendChild(ogImg);
      }
      ogImg.setAttribute("content", ogImage);

      // Twitter image
      let twImg = head.querySelector('meta[name="twitter:image"]');
      if (!twImg) {
        twImg = document.createElement("meta");
        twImg.setAttribute("name", "twitter:image");
        head.appendChild(twImg);
      }
      twImg.setAttribute("content", ogImage);
    }

    // Twitter card básico
    let twCard = head.querySelector('meta[name="twitter:card"]');
    if (!twCard) {
      twCard = document.createElement("meta");
      twCard.setAttribute("name", "twitter:card");
      head.appendChild(twCard);
    }
    twCard.setAttribute("content", "summary_large_image");

    // PRELOAD DA IMAGEM PRINCIPAL (HERO)
    if (heroImage) {
      let preloadLink = head.querySelector(
        'link[data-hero-preload="true"]'
      ) as HTMLLinkElement | null;

      if (!preloadLink) {
        preloadLink = document.createElement("link");
        preloadLink.setAttribute("rel", "preload");
        preloadLink.setAttribute("as", "image");
        preloadLink.setAttribute("data-hero-preload", "true");
        head.appendChild(preloadLink);
      }

      preloadLink.setAttribute("href", heroImage);
    }
  }, [title, description, keywords, canonicalUrl, ogImage, heroImage]);

  return null;
}
