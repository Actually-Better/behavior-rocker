const PORTABLE_STYLES = `
:host {
  display: block;
  color: var(--br-text);
  font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

* { box-sizing: border-box; }
button, input { font: inherit; }
.stage { padding: clamp(24px, 6vw, 56px); background: var(--br-canvas); border-radius: 16px; }
fieldset { min-width: 0; margin: 0; padding: 0; border: 0; }
legend { margin: 0 0 18px; padding: 0; color: var(--br-text); font-size: clamp(19px, 4vw, 27px); font-weight: 680; line-height: 1.2; letter-spacing: -.025em; }
.shell { min-width: 0; }
.shell.outside { display: grid; gap: 12px; }
.external { display: none; }
.outside .external { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.external button { min-width: 0; padding: 8px 10px; color: var(--br-text); background: transparent; border: 0; border-radius: 9px; font-size: 16px; cursor: pointer; }
.external button.selected { color: var(--accent); font-weight: 680; }
.rocker { position: relative; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); width: 100%; min-width: 0; min-height: var(--br-height); overflow: visible; color: var(--br-text); background: var(--br-surface); border: var(--br-outer-width) var(--br-outer-style) var(--br-outer-color); border-radius: var(--br-radius); isolation: isolate; }
.rocker.vertical { grid-template-columns: 1fr; grid-template-rows: repeat(2, minmax(0, 1fr)); min-height: calc(var(--br-vertical-height) * 2); }
.outside .rocker { min-height: calc(var(--br-pivot-height) + 16px); }
.outside .rocker.vertical { width: calc(var(--br-pivot-vwidth) + 18px); min-height: calc((var(--br-pivot-height) + 16px) * 2); margin-inline: auto; }
.outside:has(.rocker.vertical) { grid-template-columns: minmax(130px, 1fr) auto; align-items: stretch; }
.outside:has(.rocker.vertical) .external { grid-template-columns: 1fr; grid-template-rows: repeat(2, 1fr); }
.option { position: relative; z-index: 1; min-width: 0; display: grid; place-items: center; padding: var(--br-padding) calc(var(--br-padding) * 1.45); color: var(--br-text); background: transparent; border: 0; cursor: pointer; transition: color 100ms linear, background 100ms linear; }
.option:first-child { padding-right: calc(var(--br-pivot-width) / 2 + var(--br-padding)); border-radius: calc(var(--br-radius) - var(--br-outer-width)) 0 0 calc(var(--br-radius) - var(--br-outer-width)); }
.option:nth-child(2) { padding-left: calc(var(--br-pivot-width) / 2 + var(--br-padding)); border-left: var(--br-inner-width) var(--br-inner-style) var(--br-inner-color); border-radius: 0 calc(var(--br-radius) - var(--br-outer-width)) calc(var(--br-radius) - var(--br-outer-width)) 0; }
.vertical .option:first-child { padding-right: var(--br-padding); padding-bottom: calc(var(--br-pivot-height) / 2 + var(--br-padding)); border-radius: calc(var(--br-radius) - var(--br-outer-width)) calc(var(--br-radius) - var(--br-outer-width)) 0 0; }
.vertical .option:nth-child(2) { padding-top: calc(var(--br-pivot-height) / 2 + var(--br-padding)); padding-left: var(--br-padding); border-top: var(--br-inner-width) var(--br-inner-style) var(--br-inner-color); border-left: 0; border-radius: 0 0 calc(var(--br-radius) - var(--br-outer-width)) calc(var(--br-radius) - var(--br-outer-width)); }
.outside .option span { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
.option span { max-width: 24ch; text-align: center; text-wrap: balance; font-size: clamp(16px, 3vw, 21px); line-height: 1.25; letter-spacing: -.02em; }
.option input { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
.rocker:has(input:focus-visible) { outline: 3px solid color-mix(in srgb, #0d63ce 62%, transparent); outline-offset: 5px; }
.pivot { position: absolute; z-index: 4; top: 50%; left: 50%; width: var(--br-pivot-width); height: var(--br-pivot-height); display: flex; align-items: center; color: var(--br-pivot-color); background: var(--br-pivot-surface); border: 1px solid color-mix(in srgb, var(--br-pivot-color) 24%, var(--br-pivot-surface)); border-radius: calc(var(--br-pivot-height) * .34); box-shadow: 0 10px 28px rgb(35 38 55 / 14%), 0 2px 6px rgb(35 38 55 / 12%); transform: translate(calc(-50% + var(--br-position)), -50%); user-select: none; transition: transform 180ms cubic-bezier(.22, 1, .36, 1); }
.vertical .pivot { width: var(--br-pivot-vwidth); transform: translate(-50%, calc(-50% + var(--br-position))); }
.dragging .pivot { transition: none; }
.pivot button, .grip { height: 100%; display: grid; flex: 1 1 0; place-items: center; padding: 0; color: inherit; background: transparent; border: 0; }
.pivot button { border-radius: calc(var(--br-pivot-height) * .25); cursor: pointer; }
.pivot button:focus-visible { outline: 2px solid #0d63ce; outline-offset: -3px; }
.grip { flex: 0 0 22px; font-size: 16px; letter-spacing: -3px; touch-action: none; cursor: grab; }
.dragging .grip { cursor: grabbing; }
@media (prefers-reduced-motion: reduce) { .pivot, .option { transition: none; } }
`;

const PORTABLE_ELEMENT = String.raw`function defineBehaviorRocker() {
  if (customElements.get("behavior-rocker")) return;

  class BehaviorRockerElement extends HTMLElement {
  constructor() {
    super();
    this.config = { ...behaviorRockerConfig };
    this.selected = this.config.defaultSelection;
    this.drag = null;
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.resizeObserver = new ResizeObserver(() => this.syncAxis());
    this.resizeObserver.observe(this);
  }

  disconnectedCallback() {
    this.resizeObserver?.disconnect();
    this.removeDragListeners?.();
  }

  render() {
    const style = document.createElement("style");
    style.textContent = behaviorRockerStyles;
    const options = [this.config.optionA, this.config.optionB];
    const stage = document.createElement("div");
    stage.className = "stage";
    stage.innerHTML =
      '<fieldset><legend></legend><div class="shell"><div class="external"></div>' +
      '<div class="rocker"><label class="option"><input type="radio" name="behavior-rocker" value="0"><span></span></label>' +
      '<label class="option"><input type="radio" name="behavior-rocker" value="1"><span></span></label>' +
      '<div class="pivot"><button type="button" class="previous"></button><div class="grip" aria-hidden="true">•••</div><button type="button" class="next"></button></div>' +
      '</div></div></fieldset>';
    this.shadowRoot.replaceChildren(style, stage);
    this.els = {
      stage,
      fieldset: stage.querySelector("fieldset"),
      legend: stage.querySelector("legend"),
      shell: stage.querySelector(".shell"),
      rocker: stage.querySelector(".rocker"),
      options: [...stage.querySelectorAll(".option")],
      inputs: [...stage.querySelectorAll("input")],
      external: stage.querySelector(".external"),
      previous: stage.querySelector(".previous"),
      next: stage.querySelector(".next"),
      grip: stage.querySelector(".grip"),
    };
    this.els.legend.textContent = this.config.title;
    options.forEach((label, index) => {
      this.els.options[index].querySelector("span").textContent = label;
      this.els.inputs[index].setAttribute("aria-label", label);
      const external = document.createElement("button");
      external.type = "button";
      external.textContent = label;
      external.addEventListener("click", () => this.select(index, true));
      this.els.external.append(external);
      this.els.inputs[index].addEventListener("change", () => this.select(index));
    });
    this.els.previous.addEventListener("click", () => this.select(0, true));
    this.els.next.addEventListener("click", () => this.select(1, true));
    this.els.grip.addEventListener("pointerdown", (event) => this.startDrag(event));
    this.els.fieldset.addEventListener("keydown", (event) => this.onKeyDown(event));
    this.applyConfig();
    this.syncAxis();
    this.sync();
  }

  applyConfig() {
    const c = this.config;
    const metrics = {
      compact: [88, 92, 78, 90, 40, 14, 18],
      comfortable: [112, 118, 88, 104, 48, 16, 24],
      spacious: [144, 150, 100, 116, 56, 18, 30],
    }[c.density];
    this.metrics = { height: metrics[0], verticalHeight: metrics[1], pivotWidth: metrics[2], pivotVWidth: metrics[3], pivotHeight: metrics[4], rest: metrics[5], padding: metrics[6] };
    const root = this.els.stage.style;
    root.setProperty("--br-canvas", c.canvasColor);
    root.setProperty("--br-surface", c.controlSurface);
    root.setProperty("--br-text", c.textColor);
    root.setProperty("--br-pivot-surface", c.pivotSurface);
    root.setProperty("--br-pivot-color", c.pivotColor);
    root.setProperty("--br-radius", c.radius + "px");
    root.setProperty("--br-outer-style", c.outerBorderStyle);
    root.setProperty("--br-outer-width", c.outerBorderWidth + "px");
    root.setProperty("--br-outer-color", c.outerBorderColor);
    root.setProperty("--br-inner-style", c.innerBorderStyle);
    root.setProperty("--br-inner-width", c.innerBorderWidth + "px");
    root.setProperty("--br-inner-color", c.innerBorderColor);
    root.setProperty("--br-height", this.metrics.height + "px");
    root.setProperty("--br-vertical-height", this.metrics.verticalHeight + "px");
    root.setProperty("--br-pivot-width", this.metrics.pivotWidth + "px");
    root.setProperty("--br-pivot-vwidth", this.metrics.pivotVWidth + "px");
    root.setProperty("--br-pivot-height", this.metrics.pivotHeight + "px");
    root.setProperty("--br-padding", this.metrics.padding + "px");
    this.els.shell.classList.toggle("outside", c.textPlacement === "outside");
  }

  syncAxis() {
    if (!this.els) return;
    this.axis = this.config.axis === "auto" ? (this.clientWidth < 560 ? "vertical" : "horizontal") : this.config.axis;
    this.els.rocker.classList.toggle("vertical", this.axis === "vertical");
    this.els.previous.textContent = this.axis === "vertical" ? "↑" : "←";
    this.els.next.textContent = this.axis === "vertical" ? "↓" : "→";
    this.els.previous.setAttribute("aria-label", this.config.optionA);
    this.els.next.setAttribute("aria-label", this.config.optionB);
    this.sync();
  }

  optionColors() {
    return this.config.colorMode === "monochrome"
      ? [this.config.monoColor, this.config.monoColor]
      : [this.config.optionAColor, this.config.optionBColor];
  }

  sync(strengths) {
    if (!this.els) return;
    const colors = this.optionColors();
    const values = strengths || [this.selected === 0 ? 1 : 0, this.selected === 1 ? 1 : 0];
    this.els.options.forEach((option, index) => {
      const strength = values[index];
      option.style.background = strength ? "color-mix(in srgb, " + colors[index] + " " + Math.round(strength * 12) + "%, " + this.config.controlSurface + ")" : "transparent";
      option.style.color = strength ? colors[index] : this.config.textColor;
      option.style.fontWeight = strength > .45 ? "680" : "500";
      option.style.outline = this.config.selectionBorder && strength > .5 ? this.config.selectionBorderWidth + "px " + this.config.selectionBorderStyle + " " + colors[index] : "none";
      option.style.outlineOffset = this.config.selectionBorder && strength > .5 ? -this.config.selectionBorderWidth + "px" : "0";
      this.els.inputs[index].checked = this.selected === index;
    });
    [...this.els.external.children].forEach((button, index) => {
      button.classList.toggle("selected", this.selected === index);
      button.style.setProperty("--accent", colors[index]);
      button.setAttribute("aria-pressed", String(this.selected === index));
    });
    const position = this.drag ? this.drag.position : (this.selected === 0 ? -this.metrics.rest : this.metrics.rest);
    this.els.rocker.style.setProperty("--br-position", position + "px");
  }

  select(index, focus = false) {
    if (index === this.selected) {
      if (focus) this.els.inputs[index].focus();
      return;
    }
    this.selected = index;
    this.sync();
    if (focus) requestAnimationFrame(() => this.els.inputs[index].focus());
    this.dispatchEvent(new CustomEvent("change", { detail: { index, value: index, label: index === 0 ? this.config.optionA : this.config.optionB }, bubbles: true }));
  }

  onKeyDown(event) {
    const previous = ["ArrowLeft", "ArrowUp"];
    const next = ["ArrowRight", "ArrowDown"];
    if (previous.includes(event.key) || event.key === "Home") { event.preventDefault(); this.select(0, true); }
    if (next.includes(event.key) || event.key === "End") { event.preventDefault(); this.select(1, true); }
  }

  startDrag(event) {
    event.preventDefault();
    const rockerRect = this.els.rocker.getBoundingClientRect();
    const pivotRect = this.els.grip.parentElement.getBoundingClientRect();
    const vertical = this.axis === "vertical";
    const rockerLength = vertical ? rockerRect.height : rockerRect.width;
    const pivotLength = vertical ? pivotRect.height : pivotRect.width;
    const max = Math.max(24, (rockerLength - pivotLength) / 2 - 8);
    const start = this.selected === 0 ? -this.metrics.rest : this.metrics.rest;
    this.drag = { pointerId: event.pointerId, origin: vertical ? event.clientY : event.clientX, max, start, startSelection: this.selected, position: start };
    this.els.rocker.classList.add("dragging");
    const move = (moveEvent) => this.moveDrag(moveEvent);
    const finish = (finishEvent) => this.finishDrag(finishEvent);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", finish, { once: true });
    window.addEventListener("pointercancel", finish, { once: true });
    this.removeDragListeners = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", finish); window.removeEventListener("pointercancel", finish); };
  }

  moveDrag(event) {
    if (!this.drag || event.pointerId !== this.drag.pointerId) return;
    const coordinate = this.axis === "vertical" ? event.clientY : event.clientX;
    const offset = coordinate - this.drag.origin;
    this.drag.position = Math.max(-this.drag.max, Math.min(this.drag.max, this.drag.start + offset));
    const target = offset < 0 ? 0 : offset > 0 ? 1 : null;
    if (target === null || target === this.drag.startSelection) { this.selected = this.drag.startSelection; this.sync(); return; }
    const distance = target === 0 ? this.drag.start + this.drag.max : this.drag.max - this.drag.start;
    const threshold = distance * (this.config.threshold / 100);
    const progress = Math.min(Math.abs(offset) / threshold, 1);
    const committed = Math.abs(offset) >= threshold;
    this.selected = committed ? target : this.drag.startSelection;
    if (this.config.transition === "progressive" && !committed) {
      const strengths = [0, 0]; strengths[this.drag.startSelection] = 1 - progress; strengths[target] = progress; this.sync(strengths);
    } else this.sync();
  }

  finishDrag(event) {
    if (!this.drag || event.pointerId !== this.drag.pointerId) return;
    this.drag = null;
    this.els.rocker.classList.remove("dragging");
    this.removeDragListeners?.();
    this.sync();
    requestAnimationFrame(() => this.els.inputs[this.selected].focus());
  }
  }

  customElements.define("behavior-rocker", BehaviorRockerElement);
}`;

function runtime(config) {
  return `const behaviorRockerStyles = ${JSON.stringify(PORTABLE_STYLES)};\n\nconst behaviorRockerConfig = ${JSON.stringify(config, null, 2)};\n\n${PORTABLE_ELEMENT}`;
}

function reactCode(config) {
  return `import React from "react";\n\n${runtime(config)}\n\nif (typeof window !== "undefined") {\n  defineBehaviorRocker();\n}\n\nexport default function BehaviorRocker() {\n  return <behavior-rocker />;\n}`;
}

function vueCode(config) {
  return `<script setup>\n${runtime(config)}\n\nif (typeof window !== "undefined") {\n  defineBehaviorRocker();\n}\n</script>\n\n<template>\n  <behavior-rocker />\n</template>`;
}

function htmlCode(config, locale) {
  return `<!doctype html>\n<html lang="${locale}">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Behavior Rocker</title>\n</head>\n<body>\n  <behavior-rocker></behavior-rocker>\n\n  <script>\n${runtime(config).split("\n").map((line) => `    ${line}`).join("\n")}\n\n    defineBehaviorRocker();\n  </script>\n</body>\n</html>`;
}

export const CODE_FORMATS = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue 3" },
  { value: "html", label: "HTML + JavaScript" },
];

export function generateControlCode(format, config, locale = "en") {
  if (format === "vue") return vueCode(config);
  if (format === "html") return htmlCode(config, locale);
  return reactCode(config);
}
