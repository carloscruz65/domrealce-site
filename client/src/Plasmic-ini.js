import { initPlasmicLoader } from "@plasmicapp/loader";

export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: "bJiUdmAiCWS7r9Wd2tXLcT", // seu Project ID
      token: "6UBGsWJcSpMH7zkHP009TkEBQbJtadfjwEhONKPrIEgJQvuZQW8sFKDXcSoQn4x4W53Eaf1nCAJbo76T0jg" // seu Token
    }
  ],
  preview: true, // mantém as mudanças em rascunho visíveis
});
