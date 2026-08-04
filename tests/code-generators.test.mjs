import assert from "node:assert/strict";
import test from "node:test";
import { CODE_FORMATS, generateControlCode } from "../src/codeGenerators.js";

const config = {
  title: "Choose storage behavior",
  optionA: "Keep both files",
  optionB: "Replace the existing file",
  textPlacement: "outside",
  axis: "vertical",
  density: "comfortable",
  radius: 18,
  colorMode: "dual",
  monoColor: "#3538e8",
  optionAColor: "#126c45",
  optionBColor: "#b43f52",
  canvasColor: "#f4f7f5",
  controlSurface: "#ffffff",
  textColor: "#161b18",
  pivotSurface: "#ffffff",
  pivotColor: "#56615b",
  outerBorderStyle: "solid",
  outerBorderWidth: 2,
  outerBorderColor: "#bac5bf",
  innerBorderStyle: "dashed",
  innerBorderWidth: 1,
  innerBorderColor: "#a6b2ac",
  selectionBorder: true,
  selectionBorderStyle: "double",
  selectionBorderWidth: 3,
  threshold: 42,
  transition: "progressive",
  defaultSelection: 1,
};

test("offers the three supported common formats", () => {
  assert.deepEqual(CODE_FORMATS.map(({ value }) => value), ["react", "vue", "html"]);
});

test("embeds every customization in each generated format", () => {
  for (const format of CODE_FORMATS.map(({ value }) => value)) {
    const source = generateControlCode(format, config);
    for (const [key, value] of Object.entries(config)) {
      assert.match(source, new RegExp(`"${key}"\\s*:\\s*${JSON.stringify(value).replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}`));
    }
  }
});

test("generates parseable standalone browser JavaScript", () => {
  const html = generateControlCode("html", config, "es");
  assert.match(html, /<html lang="es">/);
  const script = html.match(/<script>([\s\S]*)<\/script>/)?.[1];
  assert.ok(script);
  assert.doesNotThrow(() => new Function(script));
});
