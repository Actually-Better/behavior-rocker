# Behavior Rocker

Behavior Rocker is a customizable two-choice UI control for decisions that go beyond on/off. It keeps both outcomes visible, supports direct and gestural interaction, and previews a change before it commits. Customize it in the configurator, download the generated code, and use it on any website or app.

## Why it exists

Checkboxes work when users confirm a statement. Toggles work when they switch a feature on or off. Both become ambiguous when the setting changes a behavior and a single label no longer explains the consequence of each state.

Behavior Rocker makes both outcomes explicit. Users can select either option directly, use the directional controls, navigate with the keyboard, or drag the center handle across the full rail. A configurable threshold determines when the new choice commits.

## Features

- Two complete, permanently visible behavior labels.
- Horizontal, vertical, or responsive automatic orientation.
- Labels inside the control or outside a compact rail.
- Direct click and tap selection for either outcome.
- Directional arrow controls that change the selection.
- Full-range pointer dragging with a configurable 10–90% commit threshold.
- Progressive crossfade feedback or an immediate color change.
- Monochrome or per-option color systems.
- Compact, comfortable, and spacious density presets.
- Configurable radius, surfaces, text, handle, and icon colors.
- Independent outer border, inner divider, and optional selection border.
- Live wide and mobile previews.
- Reset to the approved default configuration.
- Copy the current configuration as English-language JSON.
- Generate and copy standalone, customized components for React, Vue 3, or HTML with JavaScript.
- English, Spanish, French, Italian, and Portuguese interfaces with a remembered language preference.

## Accessibility

- Native radio-group semantics.
- Directly clickable labels and controls.
- Arrow keys, Home, and End selection.
- Visible focus states.
- Color-independent selection cues through fill, border, weight, and handle position.
- Reduced-motion support.

## Run locally

Requirements: Node.js 20 or later and npm.

```bash
npm install
npm run dev
```

## Build and validate

```bash
npm run build
npm test
```

The production build is written to `dist/client/` and is ready to serve as a static Cloudflare application.

## Cloudflare deployment

Behavior Rocker is prepared for Cloudflare Pages or Workers Builds connected to GitHub:

- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist/client`
- Node.js version: 20 or later

The included `wrangler.jsonc` can also publish the same static build with `npx wrangler deploy`. It follows the same static-assets pattern as Dice Roller and declares `behavior-rocker.actually-better.com` as its custom domain.

## Project structure

```text
src/App.jsx                    Configurator and Behavior Rocker component
src/components/BrandHeader.jsx Shared Actually Better product header and language menu
src/i18n.jsx                   Locale dictionaries, persistence, metadata and translation API
src/styles.css                 Application and control styles
worker/index.js                Cloudflare asset worker
tests/cloudflare-worker.test.mjs Cloudflare routing tests
design-qa.md                   Visual and interaction QA record
```

## Status

This repository contains a working product-design prototype and configurator. It is not yet published as a standalone component package.

## License

Behavior Rocker is available under the [MIT License](LICENSE).
