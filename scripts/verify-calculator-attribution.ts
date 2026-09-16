import assert from "node:assert/strict";
import { ATTRIBUTION_KEYS, buildCalculatorUrl, captureAttribution } from "../client/src/utils/calculatorAttribution";

const storage = new Map<string, string>();
Object.assign(globalThis, {
  window: {
    location: { search: "" },
    localStorage: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    },
  },
});

const incoming = new URLSearchParams(ATTRIBUTION_KEYS.map(key => [key, `${key} teste + &`]));
captureAttribution(`?${incoming}&unrelated=not-forwarded`);
captureAttribution(""); // Internal navigation.
const href = buildCalculatorUrl("");
const destination = new URL(href);
assert.equal(destination.origin, "https://calcular.domrealce.com");
assert.equal(destination.pathname, "/");
for (const key of ATTRIBUTION_KEYS) assert.equal(destination.searchParams.get(key), incoming.get(key));
assert.equal(destination.searchParams.has("unrelated"), false);

// A new tab receives attribution from the href, not from a click handler.
const newTabUrl = new URL(href);
assert.equal(newTabUrl.search, destination.search);
const saved = [...storage.values()][0];
captureAttribution("");
captureAttribution("?gclid=&utm_source=");
assert.equal([...storage.values()][0], saved);
assert.equal(buildCalculatorUrl(""), href);
assert.equal(new URL(buildCalculatorUrl("?utm_campaign=new")).searchParams.get("utm_campaign"), "new");
assert.equal(new URL(buildCalculatorUrl("")).searchParams.get("gclid"), incoming.get("gclid"));
console.log("PASS: all attribution keys, internal navigation, later href, new-tab URL, empty visits, and partial updates.");