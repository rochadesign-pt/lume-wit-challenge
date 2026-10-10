import { createContext, useContext, useRef, type KeyboardEvent, type ReactNode } from "react";
import styles from "./SegmentedControl.module.css";

interface SegmentedContextValue {
  value: string;
  onChange: (value: string) => void;
}

const SegmentedContext = createContext<SegmentedContextValue | null>(null);

export interface SegmentedControlProps {
  /** Accessible name for the group, e.g. "Have it by the end of". */
  label: string;
  /** Value of the selected segment. Must match one Segment's value. */
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}

const NAV_KEYS = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];

/**
 * A single choice where every option shows its consequence (Figma: Segmented Control + Segment).
 * Behaves like a native radio group: one tab stop, arrow keys move the selection.
 */
export function SegmentedControl({ label, value, onChange, children }: SegmentedControlProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!NAV_KEYS.includes(e.key)) return;
    const radios = Array.from(
      ref.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]:not(:disabled)') ?? [],
    );
    if (!radios.length) return;
    const current = radios.findIndex((r) => r.dataset.value === value);
    const step = e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 1;
    const next =
      e.key === "Home" ? 0 : e.key === "End" ? radios.length - 1 : (current + step + radios.length) % radios.length;
    e.preventDefault();
    const target = radios[next];
    if (target?.dataset.value) {
      onChange(target.dataset.value);
      target.focus();
    }
  };

  return (
    <SegmentedContext.Provider value={{ value, onChange }}>
      <div ref={ref} role="radiogroup" aria-label={label} className={styles.root} onKeyDown={onKeyDown}>
        {children}
      </div>
    </SegmentedContext.Provider>
  );
}

export interface SegmentProps {
  value: string;
  label: string;
  /** Consequence preview, e.g. the monthly amount this option implies ("€385"). */
  sub?: string;
  disabled?: boolean;
}

export function Segment({ value, label, sub, disabled }: SegmentProps) {
  const ctx = useContext(SegmentedContext);
  if (!ctx) throw new Error("<Segment> must be used inside <SegmentedControl>");
  // Selection is derived from the group's value, never passed per segment (Figma "Selected" variant).
  const selected = ctx.value === value;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      tabIndex={selected ? 0 : -1}
      data-value={value}
      data-selected={selected}
      disabled={disabled}
      className={styles.segment}
      onClick={() => ctx.onChange(value)}
    >
      <span className={`${styles.label} lume-type-label-m`}>{label}</span>
      {sub && <span className={`${styles.sub} lume-type-body-s`}>{sub}</span>}
    </button>
  );
}
