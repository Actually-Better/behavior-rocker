# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Cloudflare is the deployment target. Keep `wrangler.jsonc`, `worker/index.js`, and `tests/cloudflare-worker.test.mjs` aligned with the static Vite build. Before a Cloudflare handoff, run `npm run build`, `npm test`, and a Wrangler dry run; the build must leave `dist/client/index.html`.

## Approved Behavior Rocker decisions

- Use the component only for a binary choice between two distinct behaviors, not for a simple enabled/disabled setting.
- Keep a stable setting title and two complete behavior labels permanently visible.
- Do not show helper copy or visible state labels such as “Current”, “Alternative”, or “Selected”.
- Communicate selection through surface fill, border, typographic weight, and pivot position so color is not the only cue.
- Use a horizontal rocker on wide containers and a vertical rocker below 600 px.
- Both behavior zones are directly clickable. Dragging the center pivot is an additional interaction, never the only one.
- The directional arrows inside the pivot are direct controls and must select the behavior they point toward.
- During dragging toward the alternative, tint and outline that destination progressively before committing the change.
- Let the pivot travel across the full available rail. Commit the alternative at 35% of that directional travel, while allowing the gesture to continue to the edge.
- Keep both horizontal and vertical option zones dense: approximately 88 px high horizontally and 92–98 px per option vertically.
- During pre-commit drag feedback, crossfade the full selected treatment from the source to the destination so both options never read as fully selected.
- Preserve native radio-group semantics and standard keyboard behavior.
- Treat the site as a reusable Behavior Rocker configurator, not a single fixed demo. Every exposed property must update the live preview immediately.
- Support monochrome and per-option color systems, configurable outer, inner, and selection borders, inside or outside labels, responsive orientation, density, radius, default selection, threshold, and progressive or instant change feedback.
- When labels are outside, collapse the rocker to a thin rail: reduce horizontal height and vertical width instead of leaving empty label-sized option zones.
- Keep the approved compact monochrome control as the reset/default configuration and allow copying the current settings as JSON.
- Localize the complete visible and accessible configurator experience in English, Spanish, French, Italian, and Portuguese. Keep copied configuration keys and enum values in English so the JSON API remains stable.
- Open with a short explanation that positions Behavior Rocker as a two-choice control for distinct outcomes when a conventional on/off toggle would be ambiguous.
- The opening description should be commercially persuasive and explicitly cover existing checkboxes and toggles, the ambiguity they create for behavioral choices, and Behavior Rocker's visible-outcome solution.
- Use the compact Actually Better editorial header approved for small products: A/B mark, centered product name, lower-contrast “an Actually Better product” endorsement, and a coral center seam whose slanted body matches the logo, whose top is cut horizontally, and whose base closes flush against the lower coral rule.
- Treat product names, the official “an Actually Better product” endorsement, and the abbreviated “by Actually Better” signature as untranslated brand strings. Every product header must share the same regular-weight system sans-serif product-name typography and Actually Better paper, ink, muted-ink, and coral tokens.
- Use `/actually-better-symbol-approved.png` as the canonical A/B mark. Do not recreate or substitute it with the former flat SVG.
