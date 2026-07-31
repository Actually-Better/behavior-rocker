# Behavior Rocker

Behavior Rocker is a customizable two-choice UI control for decisions that go beyond on/off. It keeps both outcomes visible, supports direct and gestural interaction, and previews a change before it commits.

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
npm run test:sites
```

The production build is written to `dist/`. The Sites-compatible worker entry point and hosting manifest are prepared automatically by the build script.

## Project structure

```text
src/App.jsx                    Configurator and Behavior Rocker component
src/styles.css                 Application and control styles
worker/index.js                Sites-compatible worker
scripts/prepare-sites-build.mjs Production build preparation
tests/sites-worker.test.mjs    Worker and artifact tests
design-qa.md                   Visual and interaction QA record
```

## Status

This repository contains a working product-design prototype and configurator. It is not yet published as a standalone component package.
