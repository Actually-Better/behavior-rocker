import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

export type BehaviorRockerValue = string | number;
export type BehaviorRockerOrientation = "auto" | "horizontal" | "vertical";
export type BehaviorRockerTransition = "progressive" | "instant";
export type BehaviorRockerDensity = "compact" | "comfortable" | "spacious";
export type BehaviorRockerBorderStyle =
  | "none"
  | "solid"
  | "dashed"
  | "dotted"
  | "double";
export type BehaviorRockerChangeSource =
  | "option"
  | "arrow"
  | "keyboard"
  | "drag";

export interface BehaviorRockerOption<T extends BehaviorRockerValue> {
  value: T;
  label: string;
  color?: string;
}

export interface BehaviorRockerBorder {
  style: BehaviorRockerBorderStyle;
  width: number;
  color: string;
}

export interface BehaviorRockerAppearance {
  monochromeColor: string;
  controlSurface: string;
  textColor: string;
  pivotSurface: string;
  pivotColor: string;
  focusColor: string;
  radius: number;
  pivotShadow: string;
  outerBorder: BehaviorRockerBorder;
  innerBorder: BehaviorRockerBorder;
  selectionBorder: BehaviorRockerBorder & { enabled: boolean };
}

export interface BehaviorRockerDensityMetrics {
  horizontalHeight: number;
  verticalOptionHeight: number;
  pivotWidth: number;
  pivotVerticalWidth: number;
  pivotHeight: number;
  restOffset: number;
  optionPadding: number;
}

export interface BehaviorRockerChangeDetails<T extends BehaviorRockerValue> {
  index: 0 | 1;
  previousValue: T;
  source: BehaviorRockerChangeSource;
}

export type BehaviorRockerAppearanceOverrides = Omit<
  Partial<BehaviorRockerAppearance>,
  "outerBorder" | "innerBorder" | "selectionBorder"
> & {
  outerBorder?: Partial<BehaviorRockerBorder>;
  innerBorder?: Partial<BehaviorRockerBorder>;
  selectionBorder?: Partial<BehaviorRockerBorder & { enabled: boolean }>;
};

export interface BehaviorRockerProps<T extends BehaviorRockerValue> {
  title: string;
  options: readonly [BehaviorRockerOption<T>, BehaviorRockerOption<T>];
  value?: T;
  defaultValue?: T;
  onChange?: (value: T, details: BehaviorRockerChangeDetails<T>) => void;
  orientation?: BehaviorRockerOrientation;
  responsiveBreakpoint?: number;
  labelPlacement?: "inside" | "outside";
  density?: BehaviorRockerDensity;
  densityMetrics?: Partial<BehaviorRockerDensityMetrics>;
  colorMode?: "monochrome" | "per-option";
  commitThreshold?: number;
  transition?: BehaviorRockerTransition;
  appearance?: BehaviorRockerAppearanceOverrides;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
  style?: CSSProperties;
  getOptionAriaLabel?: (
    option: BehaviorRockerOption<T>,
    index: 0 | 1,
  ) => string;
}

export const DEFAULT_BEHAVIOR_ROCKER_APPEARANCE: BehaviorRockerAppearance = {
  monochromeColor: "#3538e8",
  controlSurface: "#fffefa",
  textColor: "#171a21",
  pivotSurface: "#fffefa",
  pivotColor: "#646a75",
  focusColor: "#3538e8",
  radius: 24,
  pivotShadow: "0 8px 22px rgb(35 38 55 / 14%), 0 2px 6px rgb(35 38 55 / 10%)",
  outerBorder: {
    style: "solid",
    width: 1,
    color: "#cfd0d4",
  },
  innerBorder: {
    style: "solid",
    width: 1,
    color: "#cfd0d4",
  },
  selectionBorder: {
    enabled: false,
    style: "solid",
    width: 2,
    color: "#3538e8",
  },
};

export const DEFAULT_BEHAVIOR_ROCKER_DENSITIES: Record<
  BehaviorRockerDensity,
  BehaviorRockerDensityMetrics
> = {
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

interface DragState {
  pointerId: number;
  origin: number;
  maxTravel: number;
  startPosition: number;
  startSelection: 0 | 1;
  currentSelection: 0 | 1;
}

type RockerStyle = CSSProperties & Record<`--br-${string}`, string | number>;

export function clampCommitThreshold(value: number): number {
  if (!Number.isFinite(value)) return 35;
  return Math.min(90, Math.max(10, value));
}

function useResponsiveOrientation(
  containerRef: React.RefObject<HTMLElement | null>,
  orientation: BehaviorRockerOrientation,
  breakpoint: number,
) {
  const [resolved, setResolved] = useState<"horizontal" | "vertical">(
    orientation === "vertical" ? "vertical" : "horizontal",
  );

  useEffect(() => {
    if (orientation !== "auto") {
      setResolved(orientation);
      return undefined;
    }

    const element = containerRef.current;
    if (!element || typeof ResizeObserver === "undefined") return undefined;

    const observer = new ResizeObserver(([entry]) => {
      setResolved(
        entry.contentRect.width < breakpoint ? "vertical" : "horizontal",
      );
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [breakpoint, containerRef, orientation]);

  return resolved;
}

function ArrowIcon({ direction }: { direction: "previous" | "next" }) {
  const points = direction === "previous" ? "10 4 6 8 10 12" : "6 4 10 8 6 12";
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GripIcon({ vertical }: { vertical: boolean }) {
  const dots = vertical
    ? [
        [5, 4],
        [11, 4],
        [5, 8],
        [11, 8],
        [5, 12],
        [11, 12],
      ]
    : [
        [4, 5],
        [4, 11],
        [8, 5],
        [8, 11],
        [12, 5],
        [12, 11],
      ];

  return (
    <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true">
      {dots.map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.1" fill="currentColor" />
      ))}
    </svg>
  );
}

export function BehaviorRocker<T extends BehaviorRockerValue>({
  title,
  options,
  value,
  defaultValue,
  onChange,
  orientation = "auto",
  responsiveBreakpoint = 560,
  labelPlacement = "inside",
  density = "compact",
  densityMetrics,
  colorMode = "monochrome",
  commitThreshold = 35,
  transition = "progressive",
  appearance: appearanceOverrides,
  disabled = false,
  name,
  id,
  className,
  style,
  getOptionAriaLabel = (option) => `Select ${option.label}`,
}: BehaviorRockerProps<T>) {
  if (options.length !== 2) {
    throw new Error("BehaviorRocker requires exactly two options.");
  }
  if (Object.is(options[0].value, options[1].value)) {
    throw new Error("BehaviorRocker options must have distinct values.");
  }

  const generatedName = useId();
  const groupName = name ?? `behavior-rocker-${generatedName}`;
  const containerRef = useRef<HTMLElement>(null);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const dragState = useRef<DragState | null>(null);
  const initialValue = defaultValue ?? options[0].value;
  const [internalValue, setInternalValue] = useState<T>(initialValue);
  const [dragPosition, setDragPosition] = useState<number | null>(null);
  const [dragProgress, setDragProgress] = useState(0);
  const [previewTarget, setPreviewTarget] = useState<0 | 1 | null>(null);
  const [dragSelection, setDragSelection] = useState<0 | 1 | null>(null);
  const [dragging, setDragging] = useState(false);
  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : internalValue;
  const selectedIndex = (options.findIndex((option) =>
    Object.is(option.value, selectedValue),
  ) === 1
    ? 1
    : 0) as 0 | 1;
  const visibleSelection = dragging && dragSelection !== null ? dragSelection : selectedIndex;
  const resolvedOrientation = useResponsiveOrientation(
    containerRef,
    orientation,
    responsiveBreakpoint,
  );
  const metrics = useMemo(
    () => ({ ...DEFAULT_BEHAVIOR_ROCKER_DENSITIES[density], ...densityMetrics }),
    [density, densityMetrics],
  );
  const appearance = useMemo<BehaviorRockerAppearance>(
    () => ({
      ...DEFAULT_BEHAVIOR_ROCKER_APPEARANCE,
      ...appearanceOverrides,
      outerBorder: {
        ...DEFAULT_BEHAVIOR_ROCKER_APPEARANCE.outerBorder,
        ...appearanceOverrides?.outerBorder,
      },
      innerBorder: {
        ...DEFAULT_BEHAVIOR_ROCKER_APPEARANCE.innerBorder,
        ...appearanceOverrides?.innerBorder,
      },
      selectionBorder: {
        ...DEFAULT_BEHAVIOR_ROCKER_APPEARANCE.selectionBorder,
        ...appearanceOverrides?.selectionBorder,
      },
    }),
    [appearanceOverrides],
  );
  const threshold = clampCommitThreshold(commitThreshold);
  const optionColors: [string, string] =
    colorMode === "monochrome"
      ? [appearance.monochromeColor, appearance.monochromeColor]
      : [
          options[0].color ?? appearance.monochromeColor,
          options[1].color ?? appearance.monochromeColor,
        ];

  useEffect(() => {
    if (!isControlled && !options.some((option) => Object.is(option.value, internalValue))) {
      setInternalValue(options[0].value);
    }
  }, [internalValue, isControlled, options]);

  const focusOption = useCallback((index: 0 | 1) => {
    const focus = () => inputRefs.current[index]?.focus();
    if (typeof requestAnimationFrame === "function") requestAnimationFrame(focus);
    else setTimeout(focus, 0);
  }, []);

  const applySelection = useCallback(
    (
      index: 0 | 1,
      source: BehaviorRockerChangeSource,
      previousIndex: 0 | 1 = selectedIndex,
      focus = false,
    ) => {
      if (disabled) return;
      if (index !== previousIndex) {
        if (!isControlled) setInternalValue(options[index].value);
        onChange?.(options[index].value, {
          index,
          previousValue: options[previousIndex].value,
          source,
        });
      }
      if (focus) focusOption(index);
    },
    [disabled, focusOption, isControlled, onChange, options, selectedIndex],
  );

  const coordinateForEvent = useCallback(
    (event: ReactPointerEvent) =>
      resolvedOrientation === "vertical" ? event.clientY : event.clientX,
    [resolvedOrientation],
  );

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);

    const rocker = event.currentTarget.closest<HTMLElement>(".br-control");
    const pivot = event.currentTarget.closest<HTMLElement>(".br-pivot");
    if (!rocker || !pivot) return;

    const rockerRect = rocker.getBoundingClientRect();
    const pivotRect = pivot.getBoundingClientRect();
    const rockerLength =
      resolvedOrientation === "vertical" ? rockerRect.height : rockerRect.width;
    const pivotLength =
      resolvedOrientation === "vertical" ? pivotRect.height : pivotRect.width;
    const maxTravel = Math.max(24, (rockerLength - pivotLength) / 2 - 8);
    const startPosition =
      selectedIndex === 0 ? -metrics.restOffset : metrics.restOffset;

    dragState.current = {
      pointerId: event.pointerId,
      origin: coordinateForEvent(event),
      maxTravel,
      startPosition,
      startSelection: selectedIndex,
      currentSelection: selectedIndex,
    };
    setDragPosition(startPosition);
    setDragProgress(0);
    setPreviewTarget(null);
    setDragSelection(selectedIndex);
    setDragging(true);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = dragState.current;
    if (!state || state.pointerId !== event.pointerId) return;

    const rawOffset = coordinateForEvent(event) - state.origin;
    const position = Math.max(
      -state.maxTravel,
      Math.min(state.maxTravel, state.startPosition + rawOffset),
    );
    const target = rawOffset < 0 ? 0 : rawOffset > 0 ? 1 : null;
    const movingTowardAlternative = target !== null && target !== state.startSelection;

    setDragPosition(position);

    if (!movingTowardAlternative) {
      if (state.currentSelection !== state.startSelection) {
        const previous = state.currentSelection;
        state.currentSelection = state.startSelection;
        applySelection(state.startSelection, "drag", previous);
      }
      setDragSelection(state.startSelection);
      setDragProgress(0);
      setPreviewTarget(null);
      return;
    }

    const distanceToEdge =
      target === 0
        ? state.startPosition + state.maxTravel
        : state.maxTravel - state.startPosition;
    const commitDistance = distanceToEdge * (threshold / 100);
    const progress = Math.min(Math.abs(rawOffset) / commitDistance, 1);
    const nextSelection = (Math.abs(rawOffset) >= commitDistance
      ? target
      : state.startSelection) as 0 | 1;

    if (state.currentSelection !== nextSelection) {
      const previous = state.currentSelection;
      state.currentSelection = nextSelection;
      applySelection(nextSelection, "drag", previous);
    }
    setDragSelection(nextSelection);

    if (transition === "progressive" && nextSelection === state.startSelection) {
      setDragProgress(progress);
      setPreviewTarget(target as 0 | 1);
    } else {
      setDragProgress(0);
      setPreviewTarget(null);
    }
  };

  const finishDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = dragState.current;
    if (!state || state.pointerId !== event.pointerId) return;

    const finalSelection = state.currentSelection;
    dragState.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    setDragging(false);
    setDragPosition(null);
    setDragProgress(0);
    setPreviewTarget(null);
    setDragSelection(null);
    focusOption(finalSelection);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLFieldSetElement>) => {
    if (disabled) return;

    const previousKeys =
      resolvedOrientation === "vertical"
        ? ["ArrowUp", "ArrowLeft"]
        : ["ArrowLeft", "ArrowUp"];
    const nextKeys =
      resolvedOrientation === "vertical"
        ? ["ArrowDown", "ArrowRight"]
        : ["ArrowRight", "ArrowDown"];

    if (previousKeys.includes(event.key) || event.key === "Home") {
      event.preventDefault();
      applySelection(0, "keyboard", selectedIndex, true);
    } else if (nextKeys.includes(event.key) || event.key === "End") {
      event.preventDefault();
      applySelection(1, "keyboard", selectedIndex, true);
    }
  };

  const rockerStyle: RockerStyle = {
    "--br-pivot-position": `${
      dragging && dragPosition !== null
        ? dragPosition
        : visibleSelection === 0
          ? -metrics.restOffset
          : metrics.restOffset
    }px`,
    "--br-source-strength": (1 - dragProgress) ** 2,
    "--br-target-strength": dragProgress ** 2,
    "--br-horizontal-height": `${metrics.horizontalHeight}px`,
    "--br-vertical-option-height": `${metrics.verticalOptionHeight}px`,
    "--br-pivot-width": `${metrics.pivotWidth}px`,
    "--br-pivot-vertical-width": `${metrics.pivotVerticalWidth}px`,
    "--br-pivot-height": `${metrics.pivotHeight}px`,
    "--br-option-padding": `${metrics.optionPadding}px`,
    "--br-radius": `${appearance.radius}px`,
    "--br-control-surface": appearance.controlSurface,
    "--br-text-color": appearance.textColor,
    "--br-outer-border-style": appearance.outerBorder.style,
    "--br-outer-border-width": `${appearance.outerBorder.width}px`,
    "--br-outer-border-color": appearance.outerBorder.color,
    "--br-inner-border-style": appearance.innerBorder.style,
    "--br-inner-border-width": `${appearance.innerBorder.width}px`,
    "--br-inner-border-color": appearance.innerBorder.color,
    "--br-selection-border-width": appearance.selectionBorder.enabled
      ? `${appearance.selectionBorder.width}px`
      : "0px",
    "--br-selection-border-style": appearance.selectionBorder.style,
    "--br-selection-border-color": appearance.selectionBorder.color,
    "--br-pivot-surface": appearance.pivotSurface,
    "--br-pivot-color": appearance.pivotColor,
    "--br-pivot-shadow": appearance.pivotShadow,
    "--br-focus-color": appearance.focusColor,
    ...style,
  };

  return (
    <section
      id={id}
      className={["behavior-rocker-root", className].filter(Boolean).join(" ")}
      ref={containerRef}
      style={rockerStyle}
      data-orientation={resolvedOrientation}
      data-label-placement={labelPlacement}
      data-density={density}
    >
      <fieldset className="br-fieldset" disabled={disabled} onKeyDown={onKeyDown}>
        <legend className="br-title">{title}</legend>
        <div
          className={`br-composite br-composite--${resolvedOrientation}${
            labelPlacement === "outside" ? " br-has-external-labels" : ""
          }`}
        >
          {labelPlacement === "outside" && (
            <div className="br-external-options" aria-label={`${title} options`}>
              {options.map((option, index) => (
                <button
                  type="button"
                  className={`br-external-option${
                    visibleSelection === index ? " br-is-selected" : ""
                  }`}
                  style={{ "--br-option-color": optionColors[index] } as RockerStyle}
                  aria-pressed={visibleSelection === index}
                  onClick={() => applySelection(index as 0 | 1, "option", selectedIndex, true)}
                  disabled={disabled}
                  key={String(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}

          <div
            className={`br-control br-control--${resolvedOrientation}${
              dragging ? " br-is-dragging" : ""
            }${disabled ? " br-is-disabled" : ""}`}
          >
            {options.map((option, index) => (
              <label
                className={`br-option${
                  visibleSelection === index ? " br-is-selected" : ""
                }${previewTarget === index ? " br-is-preview-target" : ""}${
                  dragging &&
                  visibleSelection === index &&
                  previewTarget !== null &&
                  previewTarget !== index
                    ? " br-is-drag-source"
                    : ""
                }`}
                style={{ "--br-option-color": optionColors[index] } as RockerStyle}
                key={String(option.value)}
              >
                <input
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  type="radio"
                  name={groupName}
                  value={String(option.value)}
                  checked={visibleSelection === index}
                  onChange={() => applySelection(index as 0 | 1, "option")}
                />
                <span className={labelPlacement === "outside" ? "br-visually-hidden" : ""}>
                  {option.label}
                </span>
              </label>
            ))}

            <div className="br-pivot">
              <button
                type="button"
                className="br-pivot-arrow"
                aria-label={getOptionAriaLabel(options[0], 0)}
                onClick={() => applySelection(0, "arrow", selectedIndex, true)}
                disabled={disabled}
              >
                <ArrowIcon direction="previous" />
              </button>
              <div
                className="br-pivot-grip"
                aria-hidden="true"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={finishDrag}
                onPointerCancel={finishDrag}
              >
                <GripIcon vertical={resolvedOrientation === "vertical"} />
              </div>
              <button
                type="button"
                className="br-pivot-arrow"
                aria-label={getOptionAriaLabel(options[1], 1)}
                onClick={() => applySelection(1, "arrow", selectedIndex, true)}
                disabled={disabled}
              >
                <ArrowIcon direction="next" />
              </button>
            </div>
          </div>
        </div>
      </fieldset>
    </section>
  );
}
