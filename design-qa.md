# Design QA

## Evidence

- Approved component direction: `/workspace/scratch/bec9614c8028/generated_images/call_zRr9rJmaXFZvNM104ioaB2CW.png`
- Previously approved default implementation: `/workspace/scratch/bec9614c8028/behavior-rocker-prototype/implementation-desktop.png`
- Current English configurator, default and mobile vertical external-label states: inspected in the cloud browser on 2026-07-31.
- Browser viewport: `1363 × 980`, device pixel ratio `1`.

## Visual comparison

The default preview preserves the approved Behavior Rocker anatomy: stable title, two complete behaviors, compact horizontal control, selected surface, central draggable pivot, directional arrow actions, single internal divider, and no duplicated selection outline. The configurator shell deliberately extends the original composition but follows the same warm neutral canvas, editorial spacing, restrained radii, cobalt default accent, and production icon family.

The configuration panel uses a dense, scrollable property inspector so the preview remains continuously visible at desktop widths. At tablet widths it moves below the preview and becomes part of normal page flow. At phone widths the shell becomes a single column.

The opening description now frames the product through the familiar checkbox and toggle, identifies the ambiguity that appears when a binary choice changes behavior, and positions Behavior Rocker's visible outcomes and preview-before-commit interaction as the solution.

## Customization coverage

- Content: title, both option labels, and inside or outside placement.
- Geometry: automatic, horizontal, or vertical orientation; compact, medium, or spacious density; configurable radius.
- Color: monochrome or per-option accents; control surface, text, canvas, pivot surface, and pivot icon colors.
- Borders: independent exterior and interior style, width, and color; optional selection border with style and width.
- Behavior: default selection, 10–90% commitment threshold, progressive crossfade or immediate color change.
- Utility: live preview size, reset to approved defaults, and JSON configuration copy.
- Language: all visible copy, accessibility labels, default values, configuration keys, and enum values are English.

## Interaction verification

- Every segmented property control updates its pressed state and the preview: passed.
- Mobile preview plus automatic orientation renders the vertical rocker: passed.
- Outside labels remain directly clickable and preserve native radio semantics: passed.
- Outside-label horizontal and vertical controls collapse to a thin rail instead of retaining empty text-sized zones: passed.
- Monochrome and per-option color modes reveal the correct property fields: passed.
- Enabling the selection border reveals its style and width controls and updates the preview: passed.
- Commitment range responds to keyboard input and updates from `35%` to `90%`: passed.
- Full vertical drag at a `90%` threshold changes the native radio selection only near the endpoint: passed.
- Progressive and immediate change modes update the preview metadata and drag behavior: passed.
- Copy configuration reports `Copied` after writing the current JSON: passed.
- Reset restores the approved compact monochrome defaults, wide preview, and initial option selection: passed.
- Directional arrow controls, direct option selection, full-rail drag, keyboard selection, and focus styling remain functional: passed.
- Browser console warnings or errors from `terminal.local`: none.

## Findings and fixes

1. P2: native fieldset legends sat too close to the top edge of configuration cards.
   - Fix: configuration groups now use semantic labelled sections with explicit heading spacing.
2. P2: external labels initially left the original large empty option zones in place.
   - Fix: external-label mode now derives a thin rail from pivot size, reducing horizontal height and vertical width while keeping labels aligned and clickable.
3. P2: clipboard permission failure could leave the copy action without feedback.
   - Fix: added a local fallback copy path and verified the `Copied` success state.
4. P2: desktop could show both document and property-panel scrollbars.
   - Fix: capped the desktop inspector to the space below the header; smaller layouts return to normal page flow.
5. P2: reset restored configuration values but could preserve the current preview size and an interaction-only selection.
   - Fix: reset now remounts the control and restores the wide preview together with all default configuration values.

## Follow-up polish

- P3: custom user colors are intentionally not contrast-corrected automatically because the configurator must reproduce exact design-system tokens. A production package could optionally add contrast warnings without changing the chosen values.

## Final result

final result: passed
