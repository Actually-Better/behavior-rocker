# Behavior Rocker

Behavior Rocker is an accessible, fully customizable two-choice React control for decisions that go beyond on or off. Both outcomes remain visible, users can select either outcome directly, and a full-range drag gesture can preview the alternative before committing it.

Use a checkbox to confirm a statement and a toggle to enable a feature. Use Behavior Rocker when each side represents a different behavior that must be understood before it is selected.

## Install

```bash
npm install behavior-rocker
```

React 18 or later is required as a peer dependency.

## Basic use

```tsx
import { useState } from "react";
import { BehaviorRocker } from "behavior-rocker";
import "behavior-rocker/styles.css";

const options = [
  { value: "keep", label: "Keep the original" },
  { value: "replace", label: "Replace it with the new version" },
] as const;

export function UploadPreference() {
  const [value, setValue] = useState<(typeof options)[number]["value"]>("keep");

  return (
    <BehaviorRocker
      title="After uploading a file"
      options={options}
      value={value}
      onChange={setValue}
    />
  );
}
```

The component also works uncontrolled with `defaultValue`.

## Interaction

- Click or tap either option.
- Use either directional button in the center pivot.
- Use arrow keys, `Home`, or `End` while the radio group is focused.
- Drag the center grip across the full rail. The alternative commits after the configurable threshold is crossed.
- Progressive feedback crossfades emphasis from the source to the destination without making both look selected.

## API

| Prop | Type | Default | Purpose |
|---|---|---|---|
| `title` | `string` | required | Stable group label. |
| `options` | tuple of exactly two options | required | Values, labels, and optional per-option colors. |
| `value` | `string \| number` | uncontrolled | Controlled selected value. |
| `defaultValue` | `string \| number` | first option | Initial uncontrolled value. |
| `onChange` | `(value, details) => void` | none | Reports value, index, previous value, and interaction source. |
| `orientation` | `auto \| horizontal \| vertical` | `auto` | Responsive or forced layout. |
| `responsiveBreakpoint` | `number` | `560` | Container width at which automatic layout becomes vertical. |
| `labelPlacement` | `inside \| outside` | `inside` | Places labels inside the options or beside a compact rail. |
| `density` | `compact \| comfortable \| spacious` | `compact` | Geometry preset. |
| `densityMetrics` | partial metrics object | preset | Overrides every size in the selected density. |
| `colorMode` | `monochrome \| per-option` | `monochrome` | Uses one accent or each option's color. |
| `commitThreshold` | `number` | `35` | Percentage of directional travel required to change selection, clamped to 10–90. |
| `transition` | `progressive \| instant` | `progressive` | Crossfades during drag or changes appearance only after commitment. |
| `appearance` | partial appearance object | exported defaults | Colors, radius, pivot, focus, and border configuration. |
| `disabled` | `boolean` | `false` | Disables all interactions. |
| `name`, `id`, `className`, `style` | standard values | generated/empty | Integration and styling hooks. |
| `getOptionAriaLabel` | function | `Select {label}` | Localizes or customizes pivot button labels. |

## Appearance

Every visual token can be overridden without changing the component:

```tsx
<BehaviorRocker
  title="After uploading a file"
  options={[
    { value: "keep", label: "Keep the original", color: "#2457d6" },
    { value: "replace", label: "Replace it", color: "#d43b72" },
  ]}
  colorMode="per-option"
  labelPlacement="outside"
  commitThreshold={42}
  transition="instant"
  appearance={{
    controlSurface: "#ffffff",
    textColor: "#111827",
    pivotSurface: "#111827",
    pivotColor: "#ffffff",
    radius: 16,
    outerBorder: { style: "solid", width: 1, color: "#d1d5db" },
    innerBorder: { style: "dashed", width: 1, color: "#9ca3af" },
    selectionBorder: {
      enabled: true,
      style: "solid",
      width: 2,
      color: "#111827",
    },
  }}
/>
```

All component selectors are scoped below `.behavior-rocker-root`, and all internal CSS custom properties use the `--br-` prefix.

## Accessibility

- Native fieldset, legend, and radio semantics.
- Directly clickable labels and controls.
- Keyboard navigation and visible focus states.
- Selection cues use fill, text weight, pivot position, and optional borders instead of color alone.
- Reduced-motion support.
- Pointer dragging is optional; every choice remains available through standard controls.

## Development

```bash
npm install
npm run check
```

`npm run check` runs interaction tests and builds ESM, CommonJS, CSS, and type declarations.
`npm run pack:check` lists the exact files that would be included in the published package.

## Publishing

The package metadata is prepared for a public npm release. Review the version and package name, then publish with your normal npm release process.

## License

[MIT](LICENSE)
