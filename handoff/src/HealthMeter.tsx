import styles from "./HealthMeter.module.css";

export type HealthState = "comfortable" | "tight" | "at-risk";

export interface HealthThresholds {
  /** Minimum € left per month to count as Comfortable. */
  comfortable: number;
  /** Minimum € left per month to count as Tight (below = At risk). */
  tight: number;
}

export interface HealthMeterProps {
  /** Average money free each month after bills and everyday spending. */
  free: number;
  /** Money this plan commits each month (transfer + estimated round-ups). */
  committed: number;
  thresholds?: HealthThresholds;
  currency?: string;
  locale?: string;
}

export const DEFAULT_THRESHOLDS: HealthThresholds = { comfortable: 250, tight: 100 };

/** Pure rule shared with the recommender, so the UI never disagrees with the AI. */
export function getHealthState(left: number, t: HealthThresholds = DEFAULT_THRESHOLDS): HealthState {
  if (left >= t.comfortable) return "comfortable";
  if (left >= t.tight) return "tight";
  return "at-risk";
}

/** Copy per state, matching the Figma variants (State=Comfortable | Tight | At risk). */
const COPY: Record<HealthState, { badge: string; label: string }> = {
  comfortable: { badge: "Comfortable", label: "Left each month" },
  tight: { badge: "Tight", label: "Left each month" },
  "at-risk": { badge: "Over budget", label: "Shortfall" },
};

export function HealthMeter({
  free,
  committed,
  thresholds = DEFAULT_THRESHOLDS,
  currency = "EUR",
  locale = "en-IE",
}: HealthMeterProps) {
  // Not clamped: a negative value is the shortfall, and it must be shown (e.g. −€390).
  const left = free - committed;
  const overBudget = left < 0;
  const pct = free > 0 ? Math.round((committed / free) * 100) : 100;
  const state = getHealthState(left, thresholds);
  const copy = COPY[state];

  // Default sign display already renders negatives with a minus sign ("-€390").
  const money = new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 });

  // Bar = 100% of the reference amount.
  // Within budget: reference = free money → committed part + what stays free.
  // Over budget:   reference = what the plan needs → the part free money covers + the shortfall (red).
  const committedBasis = overBudget ? (free / committed) * 100 : pct;

  const caption = overBudget
    ? `You'd need ${pct}% of your free money`
    : `${pct}% of your free money goes to this goal`;

  return (
    <div className={styles.root} data-state={state}>
      <div className={styles.row}>
        <span className={`${styles.label} lume-type-body-m`}>{copy.label}</span>
        <span className={`${styles.value} lume-type-numeric-m`}>{money.format(left)}</span>
        {/* State is always spelled out, so colour is never the only signal. */}
        <span className={`${styles.badge} lume-type-label-s`}>{copy.badge}</span>
      </div>

      <div
        className={styles.bar}
        role="meter"
        aria-label="Share of your free money this goal needs"
        aria-valuemin={0}
        aria-valuemax={Math.max(100, pct)}
        aria-valuenow={pct}
        aria-valuetext={
          overBudget
            ? `${pct}% of your free money needed, ${money.format(-left)} short each month, ${copy.badge}`
            : `${pct}% committed, ${money.format(left)} left each month, ${copy.badge}`
        }
      >
        <span className={styles.committed} style={{ flexBasis: `${committedBasis}%` }} />
        <span className={styles.rest} />
      </div>

      <p className={`${styles.caption} lume-type-body-s`}>{caption}</p>
    </div>
  );
}
