import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  ArrowCounterClockwise,
  CaretDown,
  CaretLeft,
  CaretRight,
  CaretUp,
  Check,
  Copy,
  DotsSix,
  DotsSixVertical,
} from "@phosphor-icons/react";

const DEFAULT_CONFIG = {
  title: "After uploading a file",
  optionA: "Keep the original",
  optionB: "Replace it with the new version",
  textPlacement: "inside",
  axis: "auto",
  density: "compact",
  radius: 24,
  colorMode: "monochrome",
  monoColor: "#3538e8",
  optionAColor: "#3538e8",
  optionBColor: "#d34476",
  canvasColor: "#f8f6f1",
  controlSurface: "#fffefa",
  textColor: "#171a21",
  pivotSurface: "#fffefa",
  pivotColor: "#646a75",
  outerBorderStyle: "solid",
  outerBorderWidth: 1,
  outerBorderColor: "#cfd0d4",
  innerBorderStyle: "solid",
  innerBorderWidth: 1,
  innerBorderColor: "#cfd0d4",
  selectionBorder: false,
  selectionBorderStyle: "solid",
  selectionBorderWidth: 2,
  threshold: 35,
  transition: "progressive",
  defaultSelection: 0,
};

const DENSITY_METRICS = {
  compact: {
    horizontalHeight: 88,
    verticalOptionHeight: 92,
    pivotWidth: 78,
    pivotVerticalWidth: 90,
    pivotHeight: 40,
    restOffset: 14,
    optionPadding: 18,
  },
  comfortable: {
    horizontalHeight: 112,
    verticalOptionHeight: 118,
    pivotWidth: 88,
    pivotVerticalWidth: 104,
    pivotHeight: 48,
    restOffset: 16,
    optionPadding: 24,
  },
  spacious: {
    horizontalHeight: 144,
    verticalOptionHeight: 150,
    pivotWidth: 100,
    pivotVerticalWidth: 116,
    pivotHeight: 56,
    restOffset: 18,
    optionPadding: 30,
  },
};

const BORDER_STYLES = [
  { value: "none", label: "None" },
  { value: "solid", label: "Solid" },
  { value: "dashed", label: "Dashed" },
  { value: "dotted", label: "Dotted" },
  { value: "double", label: "Double" },
];

function useResponsiveAxis(containerRef, forcedAxis) {
  const [axis, setAxis] = useState(forcedAxis ?? "horizontal");

  useEffect(() => {
    if (forcedAxis) {
      setAxis(forcedAxis);
      return undefined;
    }

    const element = containerRef.current;
    if (!element) return undefined;

    const updateAxis = ([entry]) => {
      setAxis(entry.contentRect.width < 560 ? "vertical" : "horizontal");
    };

    const observer = new ResizeObserver(updateAxis);
    observer.observe(element);
    return () => observer.disconnect();
  }, [containerRef, forcedAxis]);

  return axis;
}

function BehaviorRocker({ config, disabled = false }) {
  const groupName = useId();
  const containerRef = useRef(null);
  const inputRefs = useRef([]);
  const dragState = useRef(null);
  const [selected, setSelected] = useState(config.defaultSelection);
  const [dragPosition, setDragPosition] = useState(null);
  const [dragProgress, setDragProgress] = useState(0);
  const [previewTarget, setPreviewTarget] = useState(null);
  const [dragging, setDragging] = useState(false);
  const forcedAxis = config.axis === "auto" ? undefined : config.axis;
  const axis = useResponsiveAxis(containerRef, forcedAxis);
  const metrics = DENSITY_METRICS[config.density];
  const options = [config.optionA, config.optionB];
  const optionColors =
    config.colorMode === "monochrome"
      ? [config.monoColor, config.monoColor]
      : [config.optionAColor, config.optionBColor];

  useEffect(() => {
    setSelected(config.defaultSelection);
  }, [config.defaultSelection]);

  const select = useCallback(
    (index, { focus = false } = {}) => {
      if (disabled) return;
      setSelected(index);
      if (focus) {
        requestAnimationFrame(() => inputRefs.current[index]?.focus());
      }
    },
    [disabled],
  );

  const coordinateForEvent = useCallback(
    (event) => (axis === "vertical" ? event.clientY : event.clientX),
    [axis],
  );

  const onPointerDown = (event) => {
    if (disabled) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    const rocker = event.currentTarget.closest(".behavior-rocker");
    const pivot = event.currentTarget.closest(".rocker-pivot");
    const rockerRect = rocker.getBoundingClientRect();
    const pivotRect = pivot.getBoundingClientRect();
    const rockerLength = axis === "vertical" ? rockerRect.height : rockerRect.width;
    const pivotLength = axis === "vertical" ? pivotRect.height : pivotRect.width;
    const maxTravel = Math.max(24, (rockerLength - pivotLength) / 2 - 8);
    const startPosition =
      selected === 0 ? -metrics.restOffset : metrics.restOffset;

    dragState.current = {
      pointerId: event.pointerId,
      origin: coordinateForEvent(event),
      maxTravel,
      startPosition,
      startSelection: selected,
      currentSelection: selected,
    };
    setDragPosition(startPosition);
    setDragProgress(0);
    setPreviewTarget(null);
    setDragging(true);
  };

  const onPointerMove = (event) => {
    if (!dragState.current || dragState.current.pointerId !== event.pointerId) {
      return;
    }

    const state = dragState.current;
    const rawOffset = coordinateForEvent(event) - state.origin;
    const position = Math.max(
      -state.maxTravel,
      Math.min(state.maxTravel, state.startPosition + rawOffset),
    );
    const target = rawOffset < 0 ? 0 : rawOffset > 0 ? 1 : null;
    const movingTowardAlternative =
      target !== null && target !== state.startSelection;

    setDragPosition(position);

    if (!movingTowardAlternative) {
      state.currentSelection = state.startSelection;
      setSelected(state.startSelection);
      setDragProgress(0);
      setPreviewTarget(null);
      return;
    }

    const distanceToEdge =
      target === 0
        ? state.startPosition + state.maxTravel
        : state.maxTravel - state.startPosition;
    const threshold = distanceToEdge * (config.threshold / 100);
    const progress = Math.min(Math.abs(rawOffset) / threshold, 1);
    const hasCommitted = Math.abs(rawOffset) >= threshold;

    state.currentSelection = hasCommitted ? target : state.startSelection;
    setSelected(state.currentSelection);

    if (config.transition === "progressive" && !hasCommitted) {
      setDragProgress(progress);
      setPreviewTarget(target);
    } else {
      setDragProgress(0);
      setPreviewTarget(null);
    }
  };

  const finishDrag = (event) => {
    if (!dragState.current || dragState.current.pointerId !== event.pointerId) {
      return;
    }

    const finalSelection = dragState.current.currentSelection;
    dragState.current = null;
    setDragging(false);
    setDragPosition(null);
    setDragProgress(0);
    setPreviewTarget(null);
    requestAnimationFrame(() => inputRefs.current[finalSelection]?.focus());
  };

  const onKeyDown = (event) => {
    if (disabled) return;

    const previousKeys =
      axis === "vertical" ? ["ArrowUp", "ArrowLeft"] : ["ArrowLeft", "ArrowUp"];
    const nextKeys =
      axis === "vertical"
        ? ["ArrowDown", "ArrowRight"]
        : ["ArrowRight", "ArrowDown"];

    if (previousKeys.includes(event.key)) {
      event.preventDefault();
      select(0, { focus: true });
    } else if (nextKeys.includes(event.key)) {
      event.preventDefault();
      select(1, { focus: true });
    } else if (event.key === "Home") {
      event.preventDefault();
      select(0, { focus: true });
    } else if (event.key === "End") {
      event.preventDefault();
      select(1, { focus: true });
    }
  };

  const style = {
    "--pivot-position": `${
      dragging && dragPosition !== null
        ? dragPosition
        : selected === 0
          ? -metrics.restOffset
          : metrics.restOffset
    }px`,
    "--source-strength": (1 - dragProgress) ** 2,
    "--target-strength": dragProgress ** 2,
    "--horizontal-height": `${metrics.horizontalHeight}px`,
    "--vertical-option-height": `${metrics.verticalOptionHeight}px`,
    "--pivot-width": `${metrics.pivotWidth}px`,
    "--pivot-vertical-width": `${metrics.pivotVerticalWidth}px`,
    "--pivot-height": `${metrics.pivotHeight}px`,
    "--option-padding": `${metrics.optionPadding}px`,
    "--outer-radius": `${config.radius}px`,
    "--control-surface": config.controlSurface,
    "--control-ink": config.textColor,
    "--outer-border-style": config.outerBorderStyle,
    "--outer-border-width": `${config.outerBorderWidth}px`,
    "--outer-border-color": config.outerBorderColor,
    "--inner-border-style": config.innerBorderStyle,
    "--inner-border-width": `${config.innerBorderWidth}px`,
    "--inner-border-color": config.innerBorderColor,
    "--selection-border-width": config.selectionBorder
      ? `${config.selectionBorderWidth}px`
      : "0px",
    "--selection-border-style": config.selectionBorderStyle,
    "--pivot-surface": config.pivotSurface,
    "--pivot-color": config.pivotColor,
  };
  const PreviousArrow = axis === "vertical" ? CaretUp : CaretLeft;
  const NextArrow = axis === "vertical" ? CaretDown : CaretRight;
  const GripIcon = axis === "vertical" ? DotsSix : DotsSixVertical;

  return (
    <section className="rocker-section" ref={containerRef}>
      <fieldset
        className="rocker-fieldset"
        disabled={disabled}
        onKeyDown={onKeyDown}
      >
        <legend className="rocker-title">{config.title}</legend>
        <div
          className={`rocker-composite rocker-composite--${axis}${
            config.textPlacement === "outside" ? " has-external-labels" : ""
          }`}
          style={style}
        >
          {config.textPlacement === "outside" && (
            <div className="external-option-list" aria-label="Options">
              {options.map((option, index) => (
                <button
                  type="button"
                  className={`external-option${
                    selected === index ? " is-selected" : ""
                  }`}
                  style={{ "--option-accent": optionColors[index] }}
                  aria-pressed={selected === index}
                  onClick={() => select(index, { focus: true })}
                  key={`${index}-${option}`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
          <div
            className={`behavior-rocker behavior-rocker--${axis}${
              dragging ? " is-dragging" : ""
            }${disabled ? " is-disabled" : ""}`}
            data-axis={axis}
          >
            {options.map((option, index) => (
              <label
                className={`rocker-option${
                  selected === index ? " is-selected" : ""
                }${previewTarget === index ? " is-preview-target" : ""}${
                  dragging &&
                  selected === index &&
                  previewTarget !== null &&
                  previewTarget !== index
                    ? " is-drag-source"
                    : ""
                }`}
                style={{ "--option-accent": optionColors[index] }}
                key={`${index}-${option}`}
              >
                <input
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  type="radio"
                  name={groupName}
                  value={option}
                  checked={selected === index}
                  onChange={() => select(index)}
                />
                <span
                  className={
                    config.textPlacement === "outside" ? "visually-hidden" : ""
                  }
                >
                  {option}
                </span>
              </label>
            ))}
            <div className="rocker-pivot">
              <button
                type="button"
                className="pivot-arrow"
                aria-label={`Select ${options[0]}`}
                onClick={() => select(0, { focus: true })}
                disabled={disabled}
              >
                <PreviousArrow aria-hidden="true" size={16} weight="bold" />
              </button>
              <div
                className="pivot-grip"
                aria-hidden="true"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={finishDrag}
                onPointerCancel={finishDrag}
              >
                <GripIcon aria-hidden="true" size={18} weight="bold" />
              </div>
              <button
                type="button"
                className="pivot-arrow"
                aria-label={`Select ${options[1]}`}
                onClick={() => select(1, { focus: true })}
                disabled={disabled}
              >
                <NextArrow aria-hidden="true" size={16} weight="bold" />
              </button>
            </div>
          </div>
        </div>
      </fieldset>
    </section>
  );
}

function ConfigSection({ title, children }) {
  const titleId = useId();

  return (
    <section className="config-section" aria-labelledby={titleId}>
      <h3 id={titleId}>{title}</h3>
      <div className="config-section__body">{children}</div>
    </section>
  );
}

function TextField({ label, value, onChange }) {
  return (
    <label className="field field--stacked">
      <span>{label}</span>
      <input type="text" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function SelectField({ label, value, options, onChange }) {
  return (
    <label className="field field--inline">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function RangeField({ label, value, min, max, suffix = "", onChange }) {
  return (
    <label className="field field--range">
      <span>{label}</span>
      <output>{value}{suffix}</output>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function ColorField({ label, value, onChange }) {
  const [draft, setDraft] = useState(value.toUpperCase());

  useEffect(() => {
    setDraft(value.toUpperCase());
  }, [value]);

  const commitDraft = () => {
    if (/^#[0-9a-fA-F]{6}$/.test(draft)) {
      onChange(draft);
    } else {
      setDraft(value.toUpperCase());
    }
  };

  return (
    <label className="field field--color">
      <span>{label}</span>
      <span className="color-control">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label={`${label}: color picker`}
        />
        <input
          type="text"
          value={draft}
          maxLength={7}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commitDraft}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.currentTarget.blur();
          }}
          aria-label={`${label}: hexadecimal value`}
        />
      </span>
    </label>
  );
}

function SegmentedField({ label, value, options, onChange }) {
  return (
    <div className="field field--stacked">
      <span>{label}</span>
      <div className="segmented-control">
        {options.map((option) => (
          <button
            type="button"
            className={value === option.value ? "is-selected" : ""}
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            key={option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ToggleField({ label, checked, onChange }) {
  return (
    <label className="field field--toggle">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}

export function App() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [previewSize, setPreviewSize] = useState("wide");
  const [copied, setCopied] = useState(false);
  const [rockerInstance, setRockerInstance] = useState(0);

  const update = (key, value) => {
    setConfig((current) => ({ ...current, [key]: value }));
    setCopied(false);
  };

  const resetConfiguration = () => {
    setConfig(DEFAULT_CONFIG);
    setPreviewSize("wide");
    setCopied(false);
    setRockerInstance((current) => current + 1);
  };

  const copyConfiguration = async () => {
    const serialized = JSON.stringify(config, null, 2);
    let didCopy = false;

    try {
      await navigator.clipboard.writeText(serialized);
      didCopy = true;
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = serialized;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.append(textarea);
      textarea.select();
      didCopy = document.execCommand("copy");
      textarea.remove();
    }

    if (didCopy) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <main className="configurator-app">
      <header className="app-header">
        <div>
          <p className="eyebrow">Behavior Rocker</p>
          <h1>Configurator</h1>
          <p className="app-description">
            Checkboxes confirm a statement. Toggles turn a feature on or off.
            Both are familiar, but neither works well when the choice changes
            behavior: a single label hides the consequence, and users must
            decode what “on” really means. Behavior Rocker keeps both outcomes
            visible, supports direct selection and full-range dragging, and
            previews the change before it commits. Two choices, zero ambiguity.
          </p>
        </div>
        <div className="header-actions">
          <button
            type="button"
            className="button button--quiet"
            onClick={resetConfiguration}
          >
            <ArrowCounterClockwise aria-hidden="true" size={17} />
            Reset
          </button>
          <button type="button" className="button" onClick={copyConfiguration}>
            {copied ? (
              <Check aria-hidden="true" size={17} weight="bold" />
            ) : (
              <Copy aria-hidden="true" size={17} />
            )}
            {copied ? "Copied" : "Copy configuration"}
          </button>
        </div>
      </header>

      <div className="configurator-layout">
        <section className="preview-panel" aria-labelledby="preview-title">
          <div className="preview-toolbar">
            <div>
              <p className="panel-kicker">Live preview</p>
              <h2 id="preview-title">Try the control</h2>
            </div>
            <SegmentedField
              label="Preview size"
              value={previewSize}
              options={[
                { value: "wide", label: "Wide" },
                { value: "mobile", label: "Mobile" },
              ]}
              onChange={setPreviewSize}
            />
          </div>
          <div
            className={`preview-stage preview-stage--${previewSize}`}
            style={{ background: config.canvasColor }}
          >
            <div className="preview-viewport">
              <BehaviorRocker config={config} key={rockerInstance} />
            </div>
          </div>
          <div className="preview-meta" aria-live="polite">
            <span>{config.threshold}% to commit</span>
            <span>{config.transition === "progressive" ? "Progressive transition" : "Instant change"}</span>
            <span>{config.textPlacement === "inside" ? "Inside labels" : "Outside labels"}</span>
          </div>
        </section>

        <aside className="config-panel" aria-label="Control properties">
          <ConfigSection title="Content">
            <TextField label="Title" value={config.title} onChange={(value) => update("title", value)} />
            <TextField label="Option A" value={config.optionA} onChange={(value) => update("optionA", value)} />
            <TextField label="Option B" value={config.optionB} onChange={(value) => update("optionB", value)} />
            <SegmentedField
              label="Label placement"
              value={config.textPlacement}
              options={[
                { value: "inside", label: "Inside" },
                { value: "outside", label: "Outside" },
              ]}
              onChange={(value) => update("textPlacement", value)}
            />
          </ConfigSection>

          <ConfigSection title="Geometry">
            <SegmentedField
              label="Orientation"
              value={config.axis}
              options={[
                { value: "auto", label: "Auto" },
                { value: "horizontal", label: "Horizontal" },
                { value: "vertical", label: "Vertical" },
              ]}
              onChange={(value) => update("axis", value)}
            />
            <SegmentedField
              label="Density"
              value={config.density}
              options={[
                { value: "compact", label: "Compact" },
                { value: "comfortable", label: "Comfortable" },
                { value: "spacious", label: "Spacious" },
              ]}
              onChange={(value) => update("density", value)}
            />
            <RangeField label="Radius" value={config.radius} min={0} max={40} suffix=" px" onChange={(value) => update("radius", value)} />
          </ConfigSection>

          <ConfigSection title="Color">
            <SegmentedField
              label="Scheme"
              value={config.colorMode}
              options={[
                { value: "monochrome", label: "Monochrome" },
                { value: "dual", label: "Per option" },
              ]}
              onChange={(value) => update("colorMode", value)}
            />
            {config.colorMode === "monochrome" ? (
              <ColorField label="Active color" value={config.monoColor} onChange={(value) => update("monoColor", value)} />
            ) : (
              <>
                <ColorField label="Option A color" value={config.optionAColor} onChange={(value) => update("optionAColor", value)} />
                <ColorField label="Option B color" value={config.optionBColor} onChange={(value) => update("optionBColor", value)} />
              </>
            )}
            <div className="field-grid">
              <ColorField label="Surface" value={config.controlSurface} onChange={(value) => update("controlSurface", value)} />
              <ColorField label="Text" value={config.textColor} onChange={(value) => update("textColor", value)} />
              <ColorField label="Canvas" value={config.canvasColor} onChange={(value) => update("canvasColor", value)} />
              <ColorField label="Handle" value={config.pivotSurface} onChange={(value) => update("pivotSurface", value)} />
              <ColorField label="Icons" value={config.pivotColor} onChange={(value) => update("pivotColor", value)} />
            </div>
          </ConfigSection>

          <ConfigSection title="Outer border">
            <SelectField label="Style" value={config.outerBorderStyle} options={BORDER_STYLES} onChange={(value) => update("outerBorderStyle", value)} />
            <RangeField label="Width" value={config.outerBorderWidth} min={0} max={6} suffix=" px" onChange={(value) => update("outerBorderWidth", value)} />
            <ColorField label="Color" value={config.outerBorderColor} onChange={(value) => update("outerBorderColor", value)} />
          </ConfigSection>

          <ConfigSection title="Inner divider">
            <SelectField label="Style" value={config.innerBorderStyle} options={BORDER_STYLES} onChange={(value) => update("innerBorderStyle", value)} />
            <RangeField label="Width" value={config.innerBorderWidth} min={0} max={6} suffix=" px" onChange={(value) => update("innerBorderWidth", value)} />
            <ColorField label="Color" value={config.innerBorderColor} onChange={(value) => update("innerBorderColor", value)} />
          </ConfigSection>

          <ConfigSection title="Selection border">
            <ToggleField label="Show border" checked={config.selectionBorder} onChange={(value) => update("selectionBorder", value)} />
            {config.selectionBorder && (
              <>
                <SelectField label="Style" value={config.selectionBorderStyle} options={BORDER_STYLES.filter((option) => option.value !== "none")} onChange={(value) => update("selectionBorderStyle", value)} />
                <RangeField label="Width" value={config.selectionBorderWidth} min={1} max={6} suffix=" px" onChange={(value) => update("selectionBorderWidth", value)} />
              </>
            )}
          </ConfigSection>

          <ConfigSection title="Behavior">
            <RangeField label="Commit threshold" value={config.threshold} min={10} max={90} suffix="%" onChange={(value) => update("threshold", value)} />
            <SegmentedField
              label="Color transition"
              value={config.transition}
              options={[
                { value: "progressive", label: "Progressive" },
                { value: "instant", label: "Instant" },
              ]}
              onChange={(value) => update("transition", value)}
            />
            <SegmentedField
              label="Initial selection"
              value={config.defaultSelection}
              options={[
                { value: 0, label: "Option A" },
                { value: 1, label: "Option B" },
              ]}
              onChange={(value) => update("defaultSelection", value)}
            />
          </ConfigSection>
        </aside>
      </div>
    </main>
  );
}
