# Lume · AI-native savings, from intent to approved plan

WIT Software · AI-Assisted Design Challenge

> *"I want to save €3,000 for a holiday next summer, but I don't know how much I can afford to save every month."*

Lume turns that sentence into a plan the person can see, shape and approve. Lume proposes, the maths is always visible, conversation and controls edit the same plan, and nothing moves without explicit approval.

## Start here
| | Link |
|---|---|
| **Figma file** (design system, screens, handoff, process) | [Open in Figma](https://www.figma.com/design/TZgxPpajwUGLZ275fLfyJv/WIT-ASSESSMENT?node-id=0-1) |
| **Interactive prototype** (core journey) | [Play prototype](https://www.figma.com/proto/TZgxPpajwUGLZ275fLfyJv/WIT-ASSESSMENT?node-id=14-79&starting-point-node-id=14%3A79&scaling=scale-down) |
| **Summary slides** | [Slide 1](https://www.figma.com/design/TZgxPpajwUGLZ275fLfyJv/WIT-ASSESSMENT?node-id=32-2) · [Slide 2](https://www.figma.com/design/TZgxPpajwUGLZ275fLfyJv/WIT-ASSESSMENT?node-id=34-944) |
| **User flow & journey map** | [User Flow](https://www.figma.com/design/TZgxPpajwUGLZ275fLfyJv/WIT-ASSESSMENT?node-id=51-647) |
| **Design-to-code handoff** (Health Meter, Segmented Control) | [handoff/](handoff/README.md) |
| **AI-assisted workflow** (what AI generated, what was changed, how it was judged) | [process/ai-workflow-log.md](process/ai-workflow-log.md) |

**Prototype path:** tap the mic on Home → Lume understands → recommendation → *Adjust* (or the "What if I go in April?" reply) → plan updated → review → Face ID → done. Alternative branch: *"Can I have it by Christmas?"* → not enough margin → alternatives.

## What's in this repo
```
handoff/
  README.md                 Specs for both components: API, variant ↔ code mapping, tokens, a11y, verification
  src/HealthMeter.tsx       React + TypeScript; state is derived from data, never passed as a prop
  src/HealthMeter.module.css   Styled only through design tokens
  src/HealthMeter.figma.tsx    Code Connect mapping (all 3 Figma variants)
  src/SegmentedControl.tsx     Compound radio group; selection derived from one value
  src/SegmentedControl.module.css
  src/SegmentedControl.figma.tsx  Code Connect mapping (Segment + Segmented Control)
  src/tokens.css            Generated: CSS custom properties, Light + Dark
  tokens/figma-export.json  Source: Figma variables and styles
  tokens/tokens.json        Generated: W3C Design Tokens (for Style Dictionary / Tokens Studio)
  tokens/build.py           Figma export → tokens.css + tokens.json
process/
  ai-workflow-log.md        Iteration-by-iteration log of the AI-assisted workflow
```

Regenerate tokens:
```bash
python3 handoff/tokens/build.py
```

## Tools
Figma (Auto Layout, variants, variables with Light/Dark modes, prototyping) · Claude Code + Figma MCP (building, auditing and exporting from the Figma file) · Mobbin MCP (reference research) · TypeScript / React for the handoff component.

## Time
**7 hours** in total.
