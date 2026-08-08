import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  BehaviorRocker,
  clampCommitThreshold,
  type BehaviorRockerOption,
} from "../src";

const options: readonly [BehaviorRockerOption<string>, BehaviorRockerOption<string>] = [
  { value: "keep", label: "Keep the original", color: "#2457d6" },
  { value: "replace", label: "Replace it", color: "#d43b72" },
];

describe("BehaviorRocker", () => {
  it("renders exactly two native radios with a labelled group", () => {
    render(<BehaviorRocker title="After upload" options={options} />);

    expect(screen.getByRole("group", { name: "After upload" })).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(2);
    expect(screen.getByRole("radio", { name: "Keep the original" })).toBeChecked();
  });

  it("supports uncontrolled direct selection and reports its source", () => {
    const onChange = vi.fn();
    render(
      <BehaviorRocker title="After upload" options={options} onChange={onChange} />,
    );

    fireEvent.click(screen.getByRole("radio", { name: "Replace it" }));

    expect(screen.getByRole("radio", { name: "Replace it" })).toBeChecked();
    expect(onChange).toHaveBeenCalledWith("replace", {
      index: 1,
      previousValue: "keep",
      source: "option",
    });
  });

  it("lets both pivot arrows change the selection", () => {
    const onChange = vi.fn();
    render(
      <BehaviorRocker title="After upload" options={options} onChange={onChange} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Select Replace it" }));
    expect(screen.getByRole("radio", { name: "Replace it" })).toBeChecked();
    expect(onChange).toHaveBeenLastCalledWith("replace", expect.objectContaining({ source: "arrow" }));

    fireEvent.click(screen.getByRole("button", { name: "Select Keep the original" }));
    expect(screen.getByRole("radio", { name: "Keep the original" })).toBeChecked();
  });

  it("supports standard directional keyboard selection", () => {
    const onChange = vi.fn();
    render(
      <BehaviorRocker title="After upload" options={options} onChange={onChange} />,
    );

    fireEvent.keyDown(screen.getByRole("group", { name: "After upload" }), {
      key: "ArrowRight",
    });

    expect(screen.getByRole("radio", { name: "Replace it" })).toBeChecked();
    expect(onChange).toHaveBeenLastCalledWith("replace", expect.objectContaining({ source: "keyboard" }));
  });

  it("keeps outside labels actionable while preserving radio semantics", () => {
    render(
      <BehaviorRocker
        title="After upload"
        options={options}
        labelPlacement="outside"
        orientation="vertical"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Replace it" }));

    expect(screen.getByRole("radio", { name: "Replace it" })).toBeChecked();
    expect(screen.getByRole("group", { name: "After upload" })).toBeInTheDocument();
  });

  it("respects controlled values and disabled state", () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <BehaviorRocker
        title="After upload"
        options={options}
        value="keep"
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole("radio", { name: "Replace it" }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("radio", { name: "Keep the original" })).toBeChecked();

    rerender(
      <BehaviorRocker
        title="After upload"
        options={options}
        value="replace"
        onChange={onChange}
        disabled
      />,
    );

    expect(screen.getByRole("radio", { name: "Replace it" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Keep the original" })).toBeDisabled();
  });

  it("previews before the threshold, commits after it, and keeps full drag travel", () => {
    const onChange = vi.fn();
    const { container } = render(
      <BehaviorRocker
        title="After upload"
        options={options}
        commitThreshold={35}
        onChange={onChange}
      />,
    );
    const control = container.querySelector<HTMLElement>(".br-control")!;
    const pivot = container.querySelector<HTMLElement>(".br-pivot")!;
    const grip = container.querySelector<HTMLElement>(".br-pivot-grip")!;
    const root = container.querySelector<HTMLElement>(".behavior-rocker-root")!;
    control.getBoundingClientRect = () =>
      ({ width: 400, height: 88 } as DOMRect);
    pivot.getBoundingClientRect = () =>
      ({ width: 78, height: 40 } as DOMRect);

    fireEvent.pointerDown(grip, { pointerId: 7, clientX: 100 });
    fireEvent.pointerMove(grip, { pointerId: 7, clientX: 140 });

    expect(onChange).not.toHaveBeenCalled();
    expect(container.querySelector(".br-option.br-is-preview-target")).toBeInTheDocument();

    fireEvent.pointerMove(grip, { pointerId: 7, clientX: 200 });
    expect(onChange).toHaveBeenCalledWith(
      "replace",
      expect.objectContaining({ source: "drag" }),
    );

    fireEvent.pointerMove(grip, { pointerId: 7, clientX: 400 });
    expect(root.style.getPropertyValue("--br-pivot-position")).toBe("153px");
    fireEvent.pointerUp(grip, { pointerId: 7, clientX: 400 });
    expect(screen.getByRole("radio", { name: "Replace it" })).toBeChecked();
  });

  it("applies appearance tokens and consumer styles at the component root", () => {
    const { container } = render(
      <BehaviorRocker
        title="After upload"
        options={options}
        appearance={{ textColor: "#102030", radius: 12 }}
        style={{ maxWidth: 720 }}
      />,
    );
    const root = container.querySelector<HTMLElement>(".behavior-rocker-root")!;

    expect(root.style.getPropertyValue("--br-text-color")).toBe("#102030");
    expect(root.style.getPropertyValue("--br-radius")).toBe("12px");
    expect(root.style.maxWidth).toBe("720px");
  });

  it("clamps drag commit thresholds to the supported range", () => {
    expect(clampCommitThreshold(5)).toBe(10);
    expect(clampCommitThreshold(35)).toBe(35);
    expect(clampCommitThreshold(95)).toBe(90);
    expect(clampCommitThreshold(Number.NaN)).toBe(35);
  });
});
