import { useEffect } from 'react';
import { useLocation } from 'wouter';

interface ProductStructuredData {
  name: string;
  description: string;
  price?: number;
  currency?: string;
  image?: string;
  category?: string;
  brand?: string;
}

interface ServiceStructuredData {
  name: string;
  description: string;
  provider: string;
  areaServed: string;
  serviceType: string;
}

export default function StructuredData() {
  const [location] = useLocation();
  
  useEffect(() => {
    // Remove existing structured data
    const existingScript = document.querySelector('script[data-structured-data="page"]');
    if (existingScript) {
      existingScript.remove();
    }
    
    // Add page-specific structured data
    const structuredData = getStructuredDataForPage(location);
    if (structuredData) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-structured-data', 'page');
      script.textContent = JSON.stringify(structuredData, null, 2);
      document.head.appendChild(script);
    }
  }, [location]);
  
  return null;
}

function getStructuredDataForPage(path: string): any {
  const baseUrl = 'https://www.domrealce.com';
  
  switch (path) {
    case '/':
      return {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "DOMREALCE",
        "url": baseUrl,
        "description": "Comunicação visual, impressão digital e aplicação de papel de parede em Portugal.",
        "image": `${baseUrl}/og-image.jpg`,
        "logo": `${baseUrl}/logo.png`,
        "telephone": "+351930682725",
        "email": "carloscruz@domrealce.com",
        "priceRange": "€€",
        "paymentAccepted": "MB WAY, Multibanco, PayShop, Transferência Bancária",
        "currenciesAccepted": "EUR",
        "openingHours": [
          "Mo-Fr 09:00-18:00",
          "Sa 09:00-13:00"
        ],
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Rua de Rebolido, 42",
          "addressLocality": "Gondalães, Paredes",
          "postalCode": "4580-402",
          "addressCountry": "PT",
          "addressRegion": "Porto"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 41.2033,
          "longitude": -8.3867
        },
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "telephone": "+351930682725",
            "contactType": "Customer Service",
            "areaServed": "PT",
            "availableLanguage": ["Portuguese"]
          },
          {
            "@type": "ContactPoint",
            "email": "carloscruz@domrealce.com",
            "contactType": "Customer Service"
          }
        ],
        "sameAs": [
          "https://www.facebook.com/DomrealcePublicidade/",
          "https://www.linkedin.com/company/51830077/"
        ],
        "serviceArea": {
          "@type": "Country",
          "name": "Portugal"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Serviços DOMREALCE",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Design Gráfico",
                "description": "Criação de logótipos e material publicitário"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Impressão Digital",
                "description": "Impressão em grande formato e vinil"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Papel de Parede Personalizado",
                "description": "Papel de parede com as suas imagens"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Decoração de Viaturas",
                "description": "Publicidade móvel e decoração de frotas"
              }
            }
          ]
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${baseUrl}/loja?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      };
      
    case '/servico-design-grafico':
      return {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Design Gráfico",
        "name": "Serviços de Design Gráfico Profissional",
        "description": "Criação de logótipos, material publicitário, branding e identidade visual profissional",
        "provider": {
          "@type": "Organization",
          "name": "DOMREALCE",
          "url": baseUrl
        },
        "areaServed": {
          "@type": "Place",
          "name": "Paredes, Portugal"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Serviços de Design Gráfico",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Criação de Logótipos"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Material Publicitário"
              }
            }
          ]
        }
      };
      
    case '/servico-papel-parede':
      return {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Papel de Parede Personalizado",
        "name": "Papel de Parede Personalizado",
        "description": "Papel de parede personalizado com as suas imagens, texturas exclusivas e aplicação profissional",
        "provider": {
          "@type": "Organization",
          "name": "DOMREALCE",
          "url": baseUrl
        },
        "areaServed": {
          "@type": "Place",
          "name": "Paredes, Portugal"
        },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "EUR",
          "priceSpecification": {
            "@type": "PriceSpecification",
            "minPrice": 25.00,
            "priceCurrency": "EUR",
            "unitText": "m²"
          }
        }
      };
      
    case '/loja/papel-parede':
      return {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Papel de Parede Personalizado",
        "description": "Papel de parede personalizado com centenas de texturas disponíveis. Medidas e designs personalizados.",
        "brand": {
          "@type": "Brand",
          "name": "DOMREALCE"
        },
        "category": "Decoração Interior",
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "EUR",
          "lowPrice": 25.00,
          "highPrice": 45.00,
          "offerCount": 50,
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "Organization",
            "name": "DOMREALCE"
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "127",
          "bestRating": "5"
        }
      };
      
    case '/contactos':
      return {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "mainEntity": {
          "@type": "Organization",
          "name": "DOMREALCE",
          "telephone": "+351930682725",
          "email": "info@domrealce.com",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "PT",
            "addressLocality": "Paredes"
          },
          "openingHours": [
            "Mo-Fr 09:00-18:00"
          ],
          "contactPoint": [
            {
              "@type": "ContactPoint",
              "telephone": "+351930682725",
              "contactType": "Customer Service"
            },
            {
              "@type": "ContactPoint",
              "email": "info@domrealce.com",
              "contactType": "Customer Service"
            }
          ]
        }
      };
      
    case '/noticias':
      return {
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "Notícias DOMREALCE",
        "description": "Últimas notícias, projetos e inovações da DOMREALCE",
        "url": `${baseUrl}/noticias`,
        "publisher": {
          "@type": "Organization",
          "name": "DOMREALCE",
          "url": baseUrl
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `${baseUrl}/noticias`
        }
      };
      
    default:
      return null;
  }
}