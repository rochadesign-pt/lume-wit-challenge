# Handoff

Two reusable components, mapped from Figma to production React. Both share the same generated tokens.

| Component | Why it matters | Code | Code Connect |
|---|---|---|---|
| [Health Meter](#health-meter) | Shows the AI's judgement (Comfortable / Tight / At risk) | `src/HealthMeter.tsx` | `src/HealthMeter.figma.tsx` |
| [Segmented Control](#segmented-control) | The main "adjust" control: every option shows its consequence | `src/SegmentedControl.tsx` | `src/SegmentedControl.figma.tsx` |

## Health Meter

**Figma:** [Health Meter component set](https://www.figma.com/design/TZgxPpajwUGLZ275fLfyJv/WIT-ASSESSMENT?node-id=9-75) · page `Cards & Data`
**Code:** `src/HealthMeter.tsx` · `src/HealthMeter.module.css` · Code Connect: `src/HealthMeter.figma.tsx`
**Tokens:** `src/tokens.css` (CSS) · `tokens/tokens.json` (W3C Design Tokens) · both generated from `tokens/figma-export.json`

### Why this component
It is where the AI's judgement becomes visible. The same rule that makes Lume call a plan *Tight* drives the colour, the badge and the copy. If design and code disagreed, the assistant would contradict the UI. So the state is **derived from data, never passed as a prop**.

### API
| Prop | Type | Default | Notes |
|---|---|---|---|
| `free` | `number` | — | Avg. money free per month after bills + everyday spending (€610 in the journey) |
| `committed` | `number` | — | Monthly transfer + estimated round-ups |
| `thresholds` | `{ comfortable, tight }` | `{ 250, 100 }` | € left per month. Shared with the recommender via `getHealthState()` |
| `currency` / `locale` | `string` | `EUR` / `en-IE` | `Intl.NumberFormat`, no decimals |

Derived: `left = free − committed` (**not clamped**: a negative value is the shortfall), `pct = committed / free` (**not capped**: can exceed 100%), `state = getHealthState(left)`.

### Figma variant ↔ code (all three designed and implemented)
| Figma `State` | Rule | Label · value | Badge | Bar | Caption | Example (free €610) |
|---|---|---|---|---|---|---|
| Comfortable | left ≥ €250 | Left each month · €275 | "Comfortable" `bg/positive-subtle` + `text/positive` | committed `chart/fixed` + left `status/positive` | "55% of your free money goes to this goal" | committed €335 |
| Tight | €100 ≤ left < €250 | Left each month · €180 | "Tight" `bg/caution-subtle` + `text/caution` | committed + left `status/caution` | "70% of your free money goes to this goal" | committed €430 |
| At risk | left < €100 | **Shortfall · −€390** | "Over budget" `bg/negative-subtle` + `text/negative` | the part free money covers + **shortfall `status/negative`** | "You'd need 164% of your free money" | committed €1,000 (the "by Christmas" case, screen 04c) |

**Bar logic.** Within budget, the bar is 100% of free money: committed part + what stays free. Over budget, the bar is 100% of what the plan needs: the part free money covers (`free / committed`, 61%) + the shortfall in red. Lume never sets up an At-risk plan; the Shortfall Card offers alternatives.

### Anatomy & tokens (mirrors Auto Layout)
- **Root:** vertical stack, gap `space/16`.
- **Row:** horizontal, gap `space/8`, centred. Label `.lume-type-body-m` `text/secondary` (fill) · value `.lume-type-numeric-m` `text/primary` (tabular figures) · badge `.lume-type-label-s`, h 26, `radius/full`.
- **Bar:** h 8, gap `space/4`. Committed segment `chart/fixed` (committed money uses the same colour as *Bills & rent* in the Cashflow card). The rest is coloured by state.
- **Caption:** `.lume-type-body-s` `text/tertiary`.
- No raw values for colour or type in the component: everything resolves through `tokens.css`. Light and Dark come from the same semantic names (Figma modes ↔ `prefers-color-scheme` / `data-theme="dark"`).

### Tokens (shared by both components)
Generated, not hand-written, so design and code share one source:

```bash
python3 handoff/tokens/build.py
```

| Group | In Figma | In `tokens.css` | In `tokens.json` (DTCG) |
|---|---|---|---|
| Primitives | `Primitives` collection (hidden) | `--lume-blue-500` … | `primitive.blue.500` |
| Semantic colour | `Color` collection, modes Light / Dark | `--lume-text-primary` (Light in `:root`, Dark via media query or `data-theme`) | `color.text.primary` + `$extensions.mode.dark` |
| Spacing & radius | `Spacing`, `Radius` | `--lume-space-16`, `--lume-radius-lg` | `space.16`, `radius.lg` |
| Typography | 15 text styles | `--lume-type-body-m` (+ `-tracking`) and `.lume-type-body-m` classes | `typography.Body.M` |
| Elevation | 8 effect styles | `--lume-shadow-elevation-1-card` … | `shadow.elevation-1-card` |

`tokens.json` follows the W3C Design Tokens format, so Style Dictionary or Tokens Studio can generate iOS (Swift) and Android (Compose) outputs from the same file. Exploration-only tokens (the `warm/*` primitives and the "Explore · Warm v0.1" mode) are excluded on purpose.

**Known limit:** effect styles don't switch with Figma variable modes, so shadows are the same in Light and Dark. A dark-mode shadow set is a follow-up.

### Behaviour
- When Plan Editor inputs change, the committed width animates 350 ms `cubic-bezier(.2,0,0,1)`. This is the Smart Animate transition between 04a → 04b in the prototype. Disabled under `prefers-reduced-motion`.
- Never blocks an action. *Tight* pairs with a Lume note explaining the trade-off, and the person still decides. *At risk* is never set up; alternatives are offered instead.

### Accessibility
- `role="meter"`; `aria-valuemax` grows with the value when over budget (164%), and `aria-valuetext` spells out the meaning ("164% of your free money needed, €390 short each month, Over budget").
- State is always spelled out in the badge, so colour is never the only signal. Contrast checked by script: badge pairs 6.1–9.6:1; `text/tertiary` was 4.26:1 (fails AA), so it was darkened to 4.9:1 in Light and moved to `neutral/400` (7.6:1) in Dark.

### Verification
- Type-checked with TypeScript `strict` against ES2020 (caught an ES2023-only `Intl` option, since removed).
- Rendered with `react-dom/server` for all three variants. Output matches Figma: €275 / 55% · €180 / 70% · -€390 / 164% with "Shortfall" and "Over budget" (Intl renders a hyphen-minus; Figma uses the typographic minus −).
- Not yet integrated into a production repo or visual-regression tested.

### Code Connect
`HealthMeter.figma.tsx` maps all three Figma `State` variants to the *data* that produces them (`committed` 335 / 430 / 1000 with `free` 610), so Dev Mode shows a real, runnable example instead of a hard-coded state prop. Publish with `npx figma connect publish` (requires a Figma access token and an Org/Enterprise Dev Mode seat).

## Segmented Control

**Figma:** [Segment](https://www.figma.com/design/TZgxPpajwUGLZ275fLfyJv/WIT-ASSESSMENT?node-id=12-220) (variant `Selected`) and [Segmented Control](https://www.figma.com/design/TZgxPpajwUGLZ275fLfyJv/WIT-ASSESSMENT?node-id=12-221) · page `Navigation & Controls`
**Code:** `src/SegmentedControl.tsx` · `src/SegmentedControl.module.css` · Code Connect: `src/SegmentedControl.figma.tsx`

### Why this component
It is the "Shape it" moment: the target-month picker in the Plan Editor. Each option shows its consequence (*Apr · €385*), so the trade-off is visible before the person picks. The same control is driven by conversation too ("What if I go in April?" selects April), which is why selection lives in one `value`, not in each segment.

### API (compound)
```tsx
<SegmentedControl label="Have it by the end of" value={month} onChange={setMonth}>
  <Segment value="apr" label="Apr" sub="€385" />
  <Segment value="may" label="May" sub="€330" />
  <Segment value="jun" label="Jun" sub="€290" />
  <Segment value="jul" label="Jul" sub="€255" />
</SegmentedControl>
```
| Prop | Type | Notes |
|---|---|---|
| `SegmentedControl.label` | `string` | Accessible name of the group (the visible caption above it) |
| `SegmentedControl.value` / `onChange` | `string` / `(value) => void` | Controlled. The Plan Editor and the chat both write to the same state |
| `Segment.value` / `label` | `string` | |
| `Segment.sub` | `string?` | Consequence preview. Optional, so the control also works as a plain switch |
| `Segment.disabled` | `boolean?` | e.g. months that can't reach the goal |

### Figma ↔ code
| Figma | Code |
|---|---|
| Segment `Label` / `Sub` text properties | `label` / `sub` props |
| Segment variant `Selected=true` | **Derived:** `value === segment.value`. Not a prop, so two segments can never be selected at once |
| Segmented Control children (Segment instances) | `children` (`figma.children("Segment")` in Code Connect) |

### Anatomy & tokens (mirrors Auto Layout)
- **Group:** horizontal, padding `space/4`, gap `space/2`, `radius/lg`, fill `bg/subtle`.
- **Segment:** padding `space/8` × `space/12`, fills the width, height hugs the content, `radius/md`. No fixed sizes and no clipping, so the selected shadow is never cropped. Label `.lume-type-label-m` + sub `.lume-type-body-s`.
- **Unselected:** label `text/secondary`, sub `text/tertiary`, no fill.
- **Selected:** fill `bg/surface-raised` + shadow `elevation-1-selected`, label `text/primary`, sub `text/accent`.
- Focus ring `text/accent`, 2px, offset 2. Background and shadow transition 200 ms (off under `prefers-reduced-motion`).

### Accessibility
- `role="radiogroup"` with `aria-label`; each segment is `role="radio"` + `aria-checked`. Label and consequence are both in the accessible name ("Apr €385").
- One tab stop (roving `tabindex`). Arrow keys move the selection and wrap; Home / End jump to the ends, like native radio groups.

### Verification
- Type-checked with TypeScript `strict`.
- Rendered and driven in jsdom: initial `jun` selected (only it has `tabindex=0`); ← selects May and moves focus; Home selects Apr; ← from the first wraps to Jul; click selects May.
- Every token and type class it uses exists in `tokens.css` (checked by script).
- Not yet visually regression-tested in a browser.
