# AI workflow log — Lume (WIT challenge)

Running log of what AI generated, what was changed, and how quality was judged.
Tools: Claude Code (Opus) + Figma MCP (Plugin API via `use_figma`).

## 1. Concept & framing
- **AI generated:** problem framing ("Say it → See it → Shape it → Sign it"), 6-screen journey, 4 trust principles (AI proposes / show the maths / two-way adjust / reversible).
- **Human decisions:** build in own Figma file, fictional brand, "calm premium" direction, English.
- **Judgement:** mapped every screen 1:1 to the five "should demonstrate" bullets in the brief; anything that didn't map was cut.

## 2. Story numbers
- **AI generated:** persona finances (income €2,450, fixed €1,140, everyday €700 → €610 free) and plan maths for each target month.
- **Checked:** recalculated every option (Apr €385 / May €330 / Jun €290 / Jul €255, round-ups ≈ €45) so the numbers agree on every screen.
- **Caught:** 25 Oct 2026 is a **Sunday**, so payday/transfer moved to **Mon 26 Oct**. AI output tends to sound plausible without being true, so dates were verified with code.

## 3. Foundations
- **AI generated:** 34 primitives → 31 semantic colour tokens (Light/Dark), spacing and radius scales, 15 text styles, 4 effect styles, web code syntax on every variable.
- **Rejected:** the first type pairing (Geist + Instrument Serif). Design review flagged it as a cliché of AI-generated design. Replaced with **Geist only**: display sizes use Medium with tight tracking. This is more sober and more "bank", and it's one family to ship.

## 4. Components (built with Auto Layout, variants, properties, variable bindings)
Icon set (29), Button (12 variants), Icon Button, Chip, Badge, Toggle, Lume Mark, Message/User, Message/AI, Analysis Step, Composer (3 states), Context Event, Health Meter, Cashflow Card, Plan Card (Comfortable/Tight), Status/Nav/Tab bars, Account Card, Segment + Segmented Control, Setting Row, Toggle Row, Review Row, Sheet Handle, Timeline Item.

**AI mistakes caught in visual review (screenshot after every build step):**
- `resize()` silently froze hug sizing, which made buttons the same width, clipped badges and overflowed the composer. Fixed at component level, and every screen inherited the fix (the payoff of building from the system).
- Badge text property defaulted to "Label" on every variant.
- Health Meter: committed and buffer were both amber, so the Tight state change was illegible. Committed money is now ink (same semantics as "Bills & rent"), and the buffer is green or amber.
- Plan Card: the AI badge truncated the date. Provenance moved to its own row with **"Why this?"**, and the edited version reads **"Edited by you · Undo"** so it's always clear who authored the current plan.
- 04b clone edited the underlay (same-named layers) instead of the sheet. Caught on screenshot, and edits were scoped.
- 07 Done: the AI note was hidden behind the CTA. Removed the redundant "Back to home" (✕ already exists).
- Coin icon: the first SVG was illegible, so it was redrawn.

## 5. Screens & prototype
- 7 screens + 3 states, all instances of the system.
- 24 prototype interactions: Smart Animate for state changes (01→01b, 04a↔04b), Push for navigation, a move-in sheet for Adjust, and Face ID auto-advancing (after-delay) to Done. Native Back actions.


## 6. Research with Mobbin MCP (AI-assisted reference search)
Queries: "AI assistant chat in banking app…", "savings goal setup with amount/date/monthly preview", "Wise/Revolut recurring transfer review".
Findings → decisions:
- Existing banking assistants (Quicken https://mobbin.com/screens/3d044e0c-1721-466a-a6b0-dfff2e67b0a6, Fidelity https://mobbin.com/screens/57ee741f-5360-496b-b97a-de78070f98e7, PayPal https://mobbin.com/screens/781b27f4-3cd9-4d74-90e5-8f9d203ee487, Nutmeg, Zing) are **routing chatbots**: they answer with text, links and menu buttons, never with an action that has visible consequences. → Lume answers with **objects** (Intent Card, Plan Card) that can be edited and approved.
- Cash App https://mobbin.com/screens/56ff5f1d-e0ad-4657-90e3-ab6ba37081e2 has an "I want to…" prompt with suggestions → validates intent-first home.
- Goal setup is **form-first** everywhere (Lloyds https://mobbin.com/screens/313689d0-ee4f-4117-9942-0ef1006f55a3, Monzo https://mobbin.com/screens/3321502f-b505-463a-aed4-890ffb6f8235, PayPal https://mobbin.com/screens/3560b262-5505-4363-b002-01fd0da632a4). Starling's auto-transfer https://mobbin.com/screens/5a745454-9f0e-4559-9533-4a42e006e3e5 needs **6 manual fields**. → Lume infers 5 of 6 (payday, account, amount, repeat, end) and only surfaces assumptions.
- Lloyds shows the consequence ("you'll need £16.67 a month") → kept consequence preview on every month option.
- Wise review https://mobbin.com/screens/fbc2e7c1-2b32-4a3f-b464-47538434590c: consequence rows with inline "Change", neutral palette, bold numerals. → inline "Change" on review rows; palette moved from warm to neutral.

## 7. Iteration 2 (design review): more AI-native, more neutral
- Warm beige neutrals felt "yellowish". Swapped the primitive ramp to true neutral greys, and the accent from amber to a clean blue. Amber is kept **only** as the caution semantic. One change at variable level re-themed every component and screen.
- Removed the clarifying-question step: the AI now **assumes, shows and lets you correct** (Intent Card with "assumed from 'next summer'") while it analyses in real time.
- Conversation drives the controls: asking "What if I go in April?" inside Adjust moves the month picker (Chat → GUI), and GUI edits are logged in the thread (GUI → Chat).

## 8. Cleo reference (design reference)
- Adopted: suggested replies **in the user's voice** (right-aligned one-tap chips), e.g. "What if I go in April?" in 03 leads straight to the Tight state. Conversation is now a third path to edit the plan.
- Rejected: meme/GIF personality and data written as jokey text ("$170 on Bills 💀", https://mobbin.com/screens/c9fc6adc-37a7-435b-baff-5ca70c720ea4). A bank needs calm trust, and the brief asks for meaningful visuals.

## 9. Verification pass
- Contrast measured by script: badges 6.1–9.6:1 ✓. `text/tertiary` was 4.26:1 (fails AA), so `neutral/500` was darkened to #666A73 (4.9:1) and Dark tertiary moved to `neutral/400` (7.6:1).
- AI completion pattern: once the answer arrives, the Intent Card and analysis trail collapse to one line each, so the recommendation reaches the first viewport.

## 10. Handoff
- Tokens exported straight from Figma variables → `handoff/src/tokens.css` (Light + Dark, names = Figma code syntax).
- `HealthMeter.tsx` + CSS module: state is derived from data by `getHealthState()` (shared with the recommender).
- `HealthMeter.figma.tsx` Code Connect file. Publishing via MCP failed: it needs an Org/Enterprise Dev seat, so the file ships ready to publish, plus a spec page in Figma (05 · Handoff).

## 11. Iteration 3 (design review): "too crowded", smoother motion, more conversational
References: Revolut (spacing, borderless cards, centred balance), Claude iOS voice mode (empty canvas, large live transcript, waveform composer), Superpower (floating pill nav + separate always-on assistant button).
- System: radii up (md 18, lg 24, xl 32), all cards borderless with soft two-layer shadow, card padding 24, chips filled instead of outlined, nav buttons as soft circles. Cascaded to every screen.
- Content diet: Plan Card lost the schedule line (lives in Review), Cashflow lost the Income row and source footer (already in Analysis Summary), and the "Here's what I understood" line was dropped (the Intent Card carries the Lume mark). The Lume mark shows only on the first AI message of each turn.
- Home rebuilt conversation-first: centred balance, one open question, two-line starters, Floating Nav with Lume always one tap away (new components: Floating Nav, Suggestion Card).
- Voice: new Composer state "Listening" (cancel · waveform · confirm). 01b is now the voice moment, with the transcript rendered large and the unconfirmed words in tertiary.
- Suggested replies moved from the fixed dock into the thread (after the answer). The dock version covered the €610 insight.
- Motion: every transition moved to Figma springs (Gentle for enter/smart-animate, Quick for dismiss). The Smart Animate pairs are Home↔Listening, Understanding→Recommendation (intent card collapses) and Adjust→Tight (meter width morphs).

## 12. Elevation pass
- Replaced ad-hoc shadows with 8 effect styles applied at component level: layered, cool-tinted (ink #0F1729, not black), a 1px spread "ring" instead of borders for crisp edges, and a top inner highlight on primary buttons and the Lume mark.
- Only Lume gets colour in its shadow (blue glow), so the assistant has its own presence without gradients.
- Known limit: effect styles don't switch with variable modes, so dark-mode shadows would need their own style set.

## 13. Documentation pass
- New "00 · Read me" page: token architecture (Primitives → Semantic → Components), naming conventions, our 8-step method with owners per step, contribution checklist, status legend, and a changelog v0.1 → v1.0 built from the real iterations.
- Foundations: "Variables & modes" section with live counts per collection, scopes, code syntax, and a live demo where the same 3 screens render Light vs Dark by changing only the frame's mode. Fixed the last hard-coded colour first: the composer fade is now an alpha mask over a variable-bound fill.
- "Component Docs" page: 31 doc cards **generated from the components themselves**: properties read from componentPropertyDefinitions, tokens/text/effect styles read from bindings, so docs can't drift from the source. Hand-written Do/Don't for the key components. Tab Bar and Account Card marked Deprecated with the reason (governance, not just creation).
- Screen count reframed to match the brief: 6 screens + 4 states.

## 14. Auto Layout pass + user flow
- Design review found that screens were composed with absolute positions (components were AL, screens weren't). Rebuilt all 10 frames as Auto Layout: Status → Nav → Scroll (nested scroll frame replaces the "fixed children" hack) → Dock → Home Indicator. Absolute only where it is semantically an overlay: dock fade, sheet underlay, Face ID HUD. Verified by a script audit: 0 non-AL containers left in screens.
- Home uses a flexible "Stage" (fills free space): greeting centred in 01, transcript bottom-aligned in 01b. Suggestions scroll horizontally.
- Slide and cover roots converted too; thumbnails re-cloned from the AL screens.
- New page "03a · User Flow": swimlane flowchart (Tiago / Lume / Bank systems × Say/See/Shape/Sign) with 23 nodes, 31 labelled edges (primary, alternative, after-journey) and a journey map (does / thinks / feels curve / Lume does / screens / trust moments / opportunities).

## 15. Self-review against the brief → v1.0
- Browser-tested every alternative path. Found and fixed: the Smart Animate overlap of the Lume note (04b→04a), the composer copy sticking during Smart Animate (distinct layer names), and the underline lost on componentization.
- Loose screen frames → pattern components: Lume Note, Live Summary (Comfortable/Tight; the note grows from h=0), Replaced Plan, Goal Card. 35 components total, with docs cards generated for the new ones.
- Explorations page: colour (Warm v0.1 recreated as a live variable mode vs Cool vs Dark), type (Instrument Serif vs Geist), interaction (ask vs assume), navigation (tab bar vs floating nav + Lume). Each one has a verdict and the reason.
- Process page: v0.1 → v1.0 timeline with each review finding → decision, a table of AI mistakes and how they were caught, toolchain, quality loop, next steps.
- Final audits: 33 interactions, 0 missing destinations, 0 unreachable screens, 0 non-AL containers.

## 16. Error state: "Not enough margin" (04c)
- Scenario: "Can I have it by Christmas?" → 3 paydays left → €955/mo + ~€45 round-ups = €1,000 vs €610 free.
- Caught my own maths slip before shipping: the first draft showed −€345 / 157% (round-ups ignored), inconsistent with the Health Meter rule (committed = transfer + round-ups). Corrected to −€390 / 164%; the "keep December" option recomputed to €315 + round-ups (exactly €250 left = Comfortable).
- System additions: Badge · Negative, Health Meter · At risk (already specified in code), Alternative Option, Shortfall Card. Bug caught: the cloned Negative badge variant lost its text-property binding (labels showed "Comfortable"), so the binding was re-linked.
- Wired: 03 reply "Can I have it by Christmas?" → 04c → June/April options → Plan Editor. Audit: reachable, 0 missing destinations, 0 non-AL.

## 17. Identity: Lume as a character (goal: a more defined identity)
- Judgement: rejected the face/blob mascot (as in Vertuz and most AI apps). It infantilises a bank and is already generic. Proposed instead "Lume is light": the sunrise mark becomes a character with 5 states (Idle, Listening, Thinking, Careful in amber, Celebrating), carried by motion and voice, not a face.
- Narrative tie-in: the goal is a sunrise. The sun waits on the horizon and rises when the plan goes live (07 Done), which suits a summer-holiday goal.
- Built: Lume Mark → 5-state component set (existing instances kept as Idle), Lume Hero (96px halo) with the same states, and a Brand page (lockup + tagline "See clearly. Decide calmly.", construction grid, states with use + motion specs, voice & tone with do/don't copy, app icon sizes, character don'ts).
- Applied: Home (Idle hero), Listening (Listening hero), Understanding (Thinking in the Intent Card), Tight note + 04c (Careful), Done (Celebrating hero replaces the badge).
- Also considered and declined: importing the Cushion UI kit (the brief asks for our own system; licence and originality risk). The kit's ideas were noted but not adopted, as a design decision.

## 18. Brand reset: from character to monogram
- Review: the 5-state "light character" went too far for a bank. New direction: a geometric monogram in the spirit of WIT's identity, an L.
- Explored 3 L monograms (pill terminals + dot), then 4 block-style variants after a new reference (blocks joined by a 45° cut, softer corners). Chosen: **D · split blocks**, an L made of two rounded blocks separated by a 45° cut, sharing the segmented logic of the "wit" letterforms.
- Simplified the system: Lume Mark = Tone Default / Careful only. Removed Listening, Thinking, Celebrating and the Lume Hero, after swapping every instance across all pages first (no orphans).
- Caught a scaling bug: corner radii were absolute px, so the mark looked sharp-cornered at 200px. Fixed by baking proportional rounded corners into the glyph and container paths; verified at 24 and 240px.
- Brand page rebuilt: lockup, construction grid, tones, app icon sizes, voice & tone, misuse rules.

## 19. Edge states by flow
- New components: State Message (Tone Default = empty / Careful = problem) and Banner (Caution / Neutral).
- New page "03c · Edge states", grouped by stage. Say it: no account linked, voice not understood. See it: short history (estimate), bank unreachable. Shape it: offline draft, plus a reference to 04c. Sign it: Face ID failed, setup failed, no goals yet.
- One rule for all: the money is safe, what happened, the next step. Not wired into the prototype (coverage, not journey).
- Caught: the "short history" screen still said "6-month average" on the cashflow card, contradicting the banner. Changed to a Caution "3-week estimate".

## 20. Handoff completed (code review)
- Review found that the Health Meter's third case (over budget) wasn't really in the code, and that tokens weren't fully handed over. Both confirmed:
  - The code had an "at-risk" state but clamped `left` to 0 (−€390 rendered as €0) and capped the percentage at 100%. Labels and the Code Connect mapping were also missing the At-risk variant, and the README still said "design TBD".
  - tokens.css had colour, spacing and radius only: no typography, no shadows, some amber primitives missing.
- Fixes: a token pipeline (Figma export → build.py → tokens.css + W3C tokens.json with type and shadows); HealthMeter rewritten to match all 3 Figma variants (unclamped shortfall, uncapped %, covered + shortfall bar, "Shortfall"/"Over budget" copy, aria updates), styled only via tokens; Code Connect maps 3 variants; README and Figma handoff page updated.
- Verified for the first time: `tsc --strict` (caught an ES2023-only Intl option) + server render of all 3 states matching Figma values.

## 21. Final QA pass (2026-10-10)
Checked by script across all 14 pages and by running the published prototype in a browser.
- System: 39 components (= stated), 29 icons, 107 variables with scopes and code syntax, 0 broken aliases, 15 text + 8 effect styles. Fixed: 2 components missing descriptions (Home Indicator, Sheet Handle); Component Docs had 37/39 cards, so added State Message and Banner.
- Content: 0 missing fonts, 0 orphan instances, no leftover persona or character copy, no stale counts. Fixed: slide 2 "25+ prototype links" → "38 prototype interactions". Remaining on purpose: "[add hours]".
- Screens: 38 interactions, 0 missing destinations, 0 unreachable screens, 0 dead ends, 0 non-AL containers, no text overflowing the frame.
- Found and fixed: Plan Card month labels clipped by 2px (fixed-height row); projection bars 72px in a 64px frame, so the tops were cut under the dashed goal line; the 03 suggested-reply row didn't grow when wrapping, so the Christmas chip overlapped the disclaimer (caught in the browser); the Done screen needed scrolling after the brand change (mark + badge now share a row, fits in 590/596px).
- Code: tokens rebuild is byte-identical; every token used by the component exists; tsc strict ✓; render of all 3 states matches Figma; README file references exist.
- Browser: full path including the Christmas branch (Home → voice → 02 → 03 → 04c → 30 Apr → 04b → 05 → 06 → Face ID → 07) ✓.

## 22. Submission structure
- Trimmed the file to what the brief asks for, plus the user flow, explorations and process. The talk deck, brand page, edge states and read me were removed from the submission file (they're kept in a separate working copy).
- Pages grouped into three sections (Design system · Experience · Summary & handoff), each with a divider and a section cover built from the system's variables and text styles.
- Components split into one page per category (02a–02f). Each doc card now sits next to its component instead of on a separate docs page, as in production libraries. Component IDs are unchanged, so the Code Connect and handoff links still resolve.
- Caught while moving: 11 doc texts and 14 component descriptions showed raw HTML entities (`&quot;`, `&amp;`, `&#39;`) from the generation script, so they were decoded. 3 variable-bound fills held stale cached colours (Chip default rendered black in exports), so they were re-bound.
- Consistency pass: every page now follows one template: a board with 96 padding and 72 between blocks, and a header with a breadcrumb overline (e.g. "Design system · 02b"), a Display/XL title and a Body/L description. Screens and slides stay top-level (the prototype and presentation need them), with the same header above them. Uniform page background.
- Component pages: header → "Components" card holding the main components → "Documentation" in two balanced columns, with deprecated cards last. Every doc card now has the same anatomy (title, description, preview, specs, Do/Don't). 7 cards were missing a description or Do/Don't (Nav Bar, Segment, Status Bar, Home Indicator, Sheet Handle, Tab Bar, Account Card), so those were written. 2 cards (Button, Badge) had their sections out of order.
- Re-audited after the move: 39 components, 0 orphan instances, 0 stale labels or entities, prototype 38 interactions / 0 missing / 0 unreachable.

## 23. Type & spacing normalisation (design review: even values only, 14 minimum, 12 for nav-style labels, more breathing room)
- Type scale moved to even values: Body 16/24, Body/S 14/20, Body/L and Heading/M 18, Labels 16/18, Overline 12/16, Numeric/M 18/24. 12 stays only for Label/S (nav labels, badges) and Overline. Unstyled spec text in the docs (mono 10–11px) moved to 12.
- Spacing snapped to the 4-pt scale of the Spacing variables (3→4, 6→8, 10→12, 14→16, 18→20, 22→24), and vertical gaps between fields went up one step (8→12, 12→16, 16→20, 20→24, 24→32). Values bound to variables were re-bound, not overwritten. Horizontal gaps were only snapped.
- Mobbin MCP wasn't authorised in this session, so references came from known patterns (Revolut/Wise/Monzo: 16 body, 14 secondary, 12 captions).
- Regressions caught in screenshot review and fixed:
  - Lume Note and Replaced Plan main components had been stretched to 378px when moved into the auto-layout components card (their vertical sizing was FILL), and every instance inherited it. Set to HUG at the source.
  - Nested instance text rendered the main component's text ("Jun" on every month) after the style change, although the data was right. Fixed by re-applying text properties on all instances.
  - 18px composer placeholder wrapped onto two lines and pushed Home's stage into the balance; inputs now use Body/M 16 (iOS input standard).
  - Done no longer fitted; shortened the hero line and set the body gap to 20, so it fits again with no scroll.
  - Shortened 3 strings that now truncated (intent summary, analysis trail, replaced plan).
  - Foundations type-scale labels were stale (e.g. "15/22"); they're now regenerated from the styles. My first attempt read the wrong text node and wrote "16/22" everywhere, so it was caught and redone from the row's own style.
  - 21 screen thumbnails (cover, Light/Dark demo, explorations, slide 1) re-cloned from the updated screens.
- Code: figma-export.json updated (it also had a stale Label/S at 13px), tokens rebuilt; Health Meter CSS now uses space tokens for gap 16, bar gap 4 and badge padding 12/8.
- Audit: 38 interactions / 0 missing / 0 unreachable; no screen overflows its frame.

## 24. First draft made visibly different + prototype entry
- Review: the Warm v0.1 exploration read as a colour swap only. It was the v1.0 screens in another mode, so it misrepresented the first draft. Rebuilt it as the AI's actual first proposal, from the same components: Instrument Serif headlines and amounts, classic dark Account Card and Tab Bar (the deprecated components), bordered flat cards with smaller radii, warm mode. Section retitled "First draft vs v1.0", copy rewritten to name each difference.
- Instance text in the v0.1 thumbnail ignored a font override, so that one summary instance was detached (thumbnail only, not the system).
- "▶ Play the prototype" link added to the Cover file guide and the Screens page header (starts at 01 · Home, flow "Core journey · Save for a holiday").

## 25. Process page tone
- The Process timeline quoted raw review messages (PT + EN). Rewritten as "Review finding → Decision": each iteration states the problem found and the principle behind the change, in neutral product language. "Me" in the slide 2 legend became "Designer". The public log is now generated from this one by `publish_log.py` with the same neutral wording.
- Page references aligned with the renamed pages (no numbers): cover guide, section covers, header overlines, board names, slide 2 link, repo READMEs.
- "What the AI got wrong" table rewritten in plain language (what went wrong / how we noticed / what we did), with no tool or code jargon; slide 2 rows rewritten the same way.

## 26. Second handoff component + making the AI draft visible
- Added the Segmented Control (target-month picker) to the handoff: compound React API (`SegmentedControl` + `Segment`), selection derived from one `value` (the Figma "Selected" variant isn't a prop), radio-group semantics with roving tabindex, arrows/Home/End with wrap-around. Styled only with generated tokens. Code Connect maps Segment's Label/Sub and the control's children. Verified: tsc strict, every token exists, and jsdom drives click and keyboard behaviour as expected. The Handoff page now shows both components with the same three-card structure.
- Review: the "AI draft vs v1.0" comparison still read as small changes. New Explorations section "AI first draft → v1.0" with four before/after pairs, each one a real structural change from the log: dashboard → conversation-first home; ask-first → assume, show, let correct; replies pinned over the insight → replies in the thread; all-amber Tight meter → committed money as ink. "Colour direction" is back to its original purpose (same v1.0 screens, three modes).
- Review: the Segment had no padding of its own (fixed 72×52) and the selected shadow was cropped by fixed sizes and a clipping component set. Segment now pads space/8 × space/12, hugs its height and fills the width in the control; nothing in the chain clips. CSS and README updated to match (padding tokens instead of a fixed height). The same pass caught the Comfortable Live Summary at 4px bottom padding (a leftover from the hidden note), so it now matches Tight at 20. All 8 thumbnails of 04b re-cloned.

- Submission: hours set to 7 (slide 2, README). Repository published publicly at github.com/rochadesign-pt/lume-wit-challenge and linked from slide 2 and the cover.
