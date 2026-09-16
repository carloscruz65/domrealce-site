export const ATTRIBUTION_KEYS = [
  "gclid", "gbraid", "wbraid", "utm_source", "utm_medium",
  "utm_campaign", "utm_content", "utm_term",
] as const;

const STORAGE_KEY = "domrealce.calculator-attribution";
let memory: Record<string, string> = {};

export function captureAttribution(search: string) {
  if (typeof window !== "undefined") {
    try {
      const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
      for (const key of ATTRIBUTION_KEYS) {
        if (typeof stored?.[key] === "string" && stored[key]) memory[key] = stored[key];
      }
    } catch {
      // Storage may be unavailable; retain attribution for this page session.
    }
  }
  const params = new URLSearchParams(search);
  let changed = false;
  for (const key of ATTRIBUTION_KEYS) {
    const value = params.get(key);
    if (value?.trim()) {
      memory[key] = value;
      changed = true;
    }
  }
  if (changed && typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
    } catch {
      // In-memory attribution still works when browser storage is blocked.
    }
  }
  return { ...memory };
}

export function buildCalculatorUrl(
  search = typeof window === "undefined" ? "" : window.location.search,
) {
  const attribution = captureAttribution(search);
  const url = new URL("https://calcular.domrealce.com/");
  for (const key of ATTRIBUTION_KEYS) {
    if (attribution[key]) url.searchParams.set(key, attribution[key]);
  }
  return url.toString();
}