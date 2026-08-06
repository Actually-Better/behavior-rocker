import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

test("Actually Better brand signatures stay untranslated", async () => {
  const [i18nSource, headerSource, appSource] = await Promise.all([
    readFile(new URL("src/i18n.jsx", projectRoot), "utf8"),
    readFile(new URL("src/components/BrandHeader.jsx", projectRoot), "utf8"),
    readFile(new URL("src/App.jsx", projectRoot), "utf8"),
  ]);

  assert.doesNotMatch(i18nSource, /endorsement:/);
  assert.doesNotMatch(
    i18nSource,
    /un producto de Actually Better|un produit Actually Better|un prodotto Actually Better|um produto Actually Better/,
  );
  assert.match(headerSource, />an Actually Better product</);
  assert.match(appSource, /Behavior Rocker · by Actually Better/);
});
