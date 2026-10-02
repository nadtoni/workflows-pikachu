---
name: porsche-ux-design-review
description: "Evaluates a Porsche digital interface design against the defined brand, layout, and PDS rules and returns a structured, prioritised review. Use when reviewing Figma screens, UI mockups, screenshots, web links, or design descriptions for compliance with Porsche design principles, PDS usage, grid, typography, colour, elevation, frosted glass, and visual quality. Triggers: 'review this design', 'design review', 'is this rule-compliant?', 'check this screen', 'Designreview', 'bewerte diesen Screen', 'prüfe das Design', 'ist das regelkonform?', 'check gegen die Porsche-Regeln'."
---

# Porsche UX Design Review

Evaluate a Porsche digital interface design against the defined design rules and deliver clear, actionable, prioritised feedback. Input can be Figma screens (via MCP), screenshots, images, web links, or written descriptions of a design.

> **This skill vs. `porsche-di`:** `porsche-di` holds the *why* — brand promise, design codes, voice & tone. **This skill is the operational reviewer**: it checks a concrete design against 14 measurable rules and reports violations. Use `porsche-di` to *understand or generate*; use this skill to *evaluate*. For brand-intent or copy questions, consult `porsche-di`.

> **Requires (optional):** Figma MCP — only for reviewing Figma frames directly (see `porsche-ux-workflow` skill, section **MCP Setup**). Screenshots, images, and web links need no MCP.

> **Read-only by default:** This skill identifies findings; it never changes Figma. When a user explicitly approves one concrete finding for implementation, hand off to `porsche-ux-figma-edit`.

## Goal

Identify violations, weaknesses, and strengths in a design relative to the Porsche design language, PDS guidelines, and established layout rules. Deliver clear, actionable feedback.

## Required Input

- One or more design screens (image, Figma link, screenshot, or description)
- Context: product type, target viewport(s), user journey step (optional but helpful)

If context is missing, evaluate with explicit assumptions and state them upfront.

## Review Process (Vorgehen)

This skill is the **method**, not the rulebook. It applies two sources of truth and never redefines them:

- **Brand rules** → the `porsche-di` skill (brand promise, design codes, visual attributes, voice & tone) — the *why*
- **Measurable values** → **PDS v4** tokens (spacing, grid, radius, elevation, type styles, colour) — the *numbers*

Run a review in six steps:

1. **Intake** — identify what is reviewed (screen / flow), the target viewport(s) and journey step. If context is missing, state explicit assumptions.
2. **Collect evidence** — for a Figma URL, call `get_screenshot` and `get_metadata`. These are the sufficient, lightweight inputs for a visual, copy, and structure review. Do not call `get_design_context` unless the user explicitly requests code generation; route that request to `porsche-ux-prototype` instead.
3. **Characterise** — pick 2–4 adjectives from the Design Character Vocabulary to frame the design's intent.
4. **Evaluate** — walk the 14 rules below. For each finding, cite the brand *why* (`porsche-di`) and check measurable values against PDS v4. See [Rule Sources](#rule-sources--brand-rulebook--pds-values) for where each rule's truth lives.
5. **Rate** — assign severity: 🔴 Violation / 🟡 Warning / 🟢 Strength.
6. **Report** — output per the template: Context & Assumptions, Strengths, Violations, Warnings, Recommendations (P1–P3).

If the first Figma MCP evidence call returns a generic transient error, retry that same call once before reporting a connection problem.

## Design Character Vocabulary

Use these adjectives to characterize the visual style and design approach of the screen under review. Include 2–4 that best describe the design in the **Context & Assumptions** section of the output.

| Adjective | Meaning in context |
|---|---|
| `light-based` | Predominantly light backgrounds; relies on white space and brightness |
| `editorial` | Strong typographic hierarchy; structured like a magazine layout |
| `fashion-forward` | Trend-driven aesthetic; high visual energy, lifestyle appeal |
| `lifestyle-driven` | Content focuses on aspirational use contexts rather than product specs |
| `commerce-structured` | Layout optimised for browse/buy flows; product grids, filters, CTAs |
| `mixed-contrast` | Light and dark sections alternate within the same screen or flow |
| `product-dense` | High number of product items or data points per screen |
| `model-centric` | Dominated by vehicle imagery; model visuals are the primary element |
| `structured` | Clear section-by-section organisation; predictable layout rhythm |
| `dark-tinted` | Dark or black backgrounds; high-contrast against light elements |
| `accent-driven` | Strong use of a single colour accent (e.g. Porsche Red) as a focal point |
| `content-dense` | High information load; many text blocks, labels, or data fields per screen |
| `stark` | Minimal, stripped-back; almost no decorative or supporting elements |
| `reductive` | Actively removes elements until only the essential remains |
| `immersive` | Full-bleed media; designed to surround the user in content |
| `campaign-driven` | Aligned with a marketing campaign; strong visual storytelling |
| `monochrome-anchored` | Black/white/grey base palette; colour used sparingly if at all |

**Combination notes** – these adjectives operate on different dimensions and can be combined:
- `light-based` + `dark-tinted` → use `mixed-contrast` instead to describe a screen that has both
- `stark` / `reductive` + `content-dense` / `product-dense` → valid combination: visual style (stark) is independent of information density (content-dense)
- `reductive` + `commerce-structured` → valid combination: commerce-structured describes the function/purpose, reductive describes the visual treatment

---

## Output Format

For each screen or design area evaluated:

1. **Context & Assumptions** – what was evaluated, at which viewport, with which assumptions
2. **Strengths** – what the design does well (2–5 points)
3. **Violations** – clear rule breaches with reference to the specific rule
4. **Warnings** – potential issues or edge cases to watch
5. **Recommendations** – concrete, prioritised action items (P1 = must fix / P2 = should fix / P3 = nice to have)

---

## Rule Sources — brand rulebook & PDS values

The 14 rules below are the operational checklist. Their **truth lives elsewhere** — this table keeps it single-sourced: the brand *why* in `porsche-di`, the exact *values* in PDS v4. Cite these when reporting; don't redefine them here.

| Rule | Brand why → `porsche-di` | Measurable values |
|---|---|---|
| 1 · Reduction & Focus | Design Code “Keep the Focus” | — |
| 2 · White Space | Visual Attributes → Layout | PDS spacing / grid |
| 3 · Grid & Placement | Visual Attributes → Layout | PDS grid |
| 4 · Aspect Ratios | Visual Attributes → Imagery | PDS ratios |
| 5 · Border Radius | Visual Attributes → Materials | PDS radius tokens (≤ 24px) |
| 6 · Typography | Visual Attributes → Typography | PDS type styles |
| 7 · Colour | Visual Attributes → Colors | PDS colour tokens |
| 8 · Elevation | Visual Attributes → Materials | PDS elevation tokens |
| 9 · Frosted Glass | Visual Attributes → Materials | PDS frosted glass |
| 10 · PDS Compliance | (whole skill) | PDS v4 components / tokens |
| 11 · Brand Elements | Brand Promise (Building Blocks) | PDS brand assets |
| 12 · Vehicle Proportions | Design Code “Stage the Legend” | — |
| 13 · Model Signatures | Design Code “Stage the Legend” | — |
| 14 · Button Hierarchy | Design Code “Boost Interaction” | PDS button (v4) |

---

## Design Rules

---

### Rule 1 – Reduction & Focus

Jeder Screen hat genau einen primären Fokus. Informationen und Interaktionen werden nicht auf einem View gestapelt, sondern über die Scroll-Länge der Seite verteilt. Struktur entsteht durch Abstände und visuelle Hierarchie – nicht durch dekorative Elemente.

**Evaluation Questions:**
- Is there a single clear primary content or action?
- Are competing information blocks split into separate sections?
- Is the number of interaction elements per visible area limited?
- Are decorative elements (dividers, borders, illustrative shapes, icons as decoration) replaced by gap or contrast hierarchy?
- Is visual hierarchy created through grey contrast tokens (`contrast-low`, `contrast-medium`, `contrast-high`) rather than decorative elements?

**Red Flags:**
- Multiple equally-weighted CTAs or primary actions on one screen
- Information density that forces the user to actively filter what is relevant
- Modals or overlays that force complex decisions in a confined space
- Use of decorative elements (dividers, borders, illustrative shapes) where gap or contrast hierarchy would suffice
- Missing or inconsistent contrast hierarchy (all text equally prominent)

---

### Rule 2 – White Space & Spatial Generosity

Großzügige Abstände verleihen dem Interface Raffinesse und emotionale Wirkung. Whitespace ist kein leerer Raum, sondern ein aktives Gestaltungsmittel das Hierarchie erzeugt und Inhalte atmen lässt.

**Evaluation Questions:**
- Does the layout use the PDS grid gutter consistently as minimum spacing between sections (fluid, approx. 24–36px)?
- Are media elements (images, videos) used at full width rather than squeezed into tight containers?
- Is the number of container levels limited to a maximum of two?
- Are no more than 3 elements displayed horizontally on desktop (1300–1920px)?
- Are no more than 2 elements displayed horizontally on medium desktop (760–1300px)?
- On mobile (< 760px) are elements stacked in single-column layout?
- Does the layout feel generous and refined, or cluttered?

**Red Flags:**
- Spacing below the grid gutter between content sections
- Media in multiple nested or unnecessarily tight containers
- More than two container levels on a screen
- More than 3 elements horizontal on desktop – especially if they appear small and cramped
- More than 2 elements horizontal on medium desktop (760–1300px)
- Multiple elements side by side on mobile (<760px) instead of stacking

---

### Rule 3 – Grid & Content Placement

Relevanter Content muss sich immer im Basic Grid befinden. Produktiver Content muss im Narrow Grid positioniert werden. Medien und immersive Momente dürfen Extended, Wide oder Full nutzen.

**Grid Structure (Desktop ≥ 760px, always 16 columns):**

| Grid | Columns (Desktop) | Columns (Mobile <760px) | Use For |
|------|-------------------|------------------------|---------|
| Narrow | Middle 8 (5–12) | All 6 | Forms, tables, productive/focused content |
| Basic | Middle 12 (3–14) | All 6 | All relevant content, copy, CTAs |
| Extended | Middle 14 (2–15) | All 6 | Large teasers, image grids, immersive moments |
| Wide | All 16 | All 6 | Productive apps with sidebars |
| Full | Viewport width | Viewport width | Background media, immersive full-bleed |

**Minimum Element Widths:**

| Viewport | Max elements side by side | Min column width per element |
|----------|--------------------------|------------------------------|
| 1300–1920px | 3 | 4 of 12 basic columns (33%) |
| 760–1300px | 2 | 6 of 12 basic columns (50%) |
| 320–760px | 1 (stacked) | Full 6 columns |

This minimum applies across all grid areas (basic, extended, wide). Elements may be wider but never narrower. Aspect ratios must also be respected at the resulting dimensions.

**Evaluation Questions:**
- Is all relevant content (copy, CTAs, key information) placed within the basic grid?
- Are forms, tables, and productive content placed within the narrow grid?
- Do media and immersive elements use extended/wide/full as appropriate?
- Do elements respect minimum column widths per viewport?
- Is there a clear layout shift between small (390/760px) and large (1300/1920px) viewports?
- Are exceptions (hero headlines, navigation, header interactions) intentional and justified?

**Red Flags:**
- Important content (copy, CTAs, key information) placed outside the basic grid
- Forms or tables extending beyond the narrow grid without justification
- Elements narrower than the defined minimums for their viewport
- No layout shift between mobile and desktop
- 3 elements side by side on 760–1300px viewport

---

### Rule 4 – Aspect Ratios

Alle visuellen Elemente (Bilder, Videos, Assets, Container) verwenden ausschließlich die definierten Seitenverhältnisse.

**Permitted Ratios:**
- `4:3` / `3:4`
- `16:9` / `9:16`
- `1:1`

Layout shifts between small (320/760px) and large (1300/1920px) viewports may include ratio changes to optimise screen usage (e.g. `16:9` → `1:1` on mobile).

**Evaluation Questions:**
- Do all images, videos, and containers use one of the defined ratios?
- Are ratio adjustments on small viewports consistent and purposeful?
- Are the same element types using consistent ratios on the same screen?

**Red Flags:**
- Elements with undefined or non-standard ratios (e.g. `2:1`, `5:3`, free-form)
- Inconsistent ratios for the same element type on one screen
- No ratio adaptation when elements would become too small on mobile

---

### Rule 5 – Border Radius

Abgerundete Ecken machen das Interface zugänglicher. Die Abrundung ist auf maximal 24px begrenzt – aus Alignment-Gründen mit der Fahrzeugdesignsprache.

**Token Mapping:**

| Element Type | Token | Max Value |
|---|---|---|
| Interactive elements (buttons, inputs) | `$pds-border-radius-small` | — |
| Nested elements | `$pds-border-radius-medium` | — |
| Containers / cards | `$pds-border-radius-large` | **24px max** |

**Evaluation Questions:**
- Are the correct radius tokens applied per element type?
- Does any element exceed 24px border radius?
- Are nested elements using medium radius and containers using large radius?

**Red Flags:**
- Border radius exceeding 24px on any element
- Using large radius on interactive elements or small radius on containers
- Custom / hardcoded radius values instead of PDS tokens

---

### Rule 6 – Typography

Nur Porsche Next. Nur PDS Typografie-Styles. Keine custom Schriftgrößen oder statische px-Werte.

**Font Variants:**
- **Porsche Next** → Web & App interfaces only
- **Porsche Next TT** → Office applications only (Word, PowerPoint etc.)
- **Porsche Next Auto** → In-car displays only
- Any other font → **hard violation**

**PDS Typography Styles (all fluid, scale with viewport):**

| Category | Styles | Use |
|---|---|---|
| Display | `display-large`, `display-medium`, `display-small` | Hero intros, stats, emotional moments |
| Heading | `heading-xx-large`, `heading-x-large`, `heading-large`, `heading-medium`, `heading-small` | Section headings, structure |
| Text | `text-x-large`, `text-large`, `text-medium`, `text-small`*, `text-x-small`, `text-xx-small`** | Body copy, labels, disclaimers |

*`text-small` is the default and remains constant across all viewports (does not scale).
**`text-xx-small` only for disclaimers / consumption data.

**Pairing Rule:** Always pair a heading style with a text style 1–2 steps below (e.g. `heading-large` + `text-medium`).

**Additional Rules:**
- No thin or italic Porsche Next styles
- Section headings should be centre-aligned
- Left-aligned headlines must align on one vertical grid line
- No static font sizes (hardcoded px values)

**Evaluation Questions:**
- Is Porsche Next (web variant) the only typeface used?
- Are only the defined PDS fluid styles used?
- Are heading/text styles correctly paired?
- Is `text-small` used as the default for body text?
- Are `display` styles reserved for hero/emotional moments?
- Is `text-xx-small` only used for disclaimers?

**Red Flags:**
- Any font other than Porsche Next (web) in a web/app interface
- Custom or hardcoded font sizes
- Static font styles instead of fluid
- Thin or italic type styles
- `display` styles used for functional/body content
- `text-xx-small` used for regular content

---

### Rule 7 – Color & Monochrome Appearance

Interfaces werden mit Grautönen gebaut. Farbe ist Medien, Assets und Status-Notifikationen vorbehalten. Keine zusätzlichen Farben einführen.

**Background Color Layers:**

| Layer | Token | Use |
|---|---|---|
| Base | `canvas` | Default background – always |
| Structure | `surface` | Clustering content, section backgrounds |
| Depth | `frosted` (transparent) | Overlay on heterogeneous backgrounds only |

**Surface Rules:**
- Maximum **2 containers** with surface background in the same focus area
- For views with many containers: use full-bleed surface background + containers on canvas on top
- No small containers with surface backgrounds scattered throughout (visually distracting)

**Visual Hierarchy (Grey Scale):**
- Use `contrast-low`, `contrast-medium`, `contrast-high` to create eye guidance
- No decorative elements to separate content – use contrast and spacing

**Monochrome Rule:**
- No additional UI colours beyond the PDS grey scale
- Colour appears only in: media (images/video), vehicle assets, status notifications
- Linked/token-bound colour values only – flag any hardcoded colour values
- Colour values that closely resemble PDS tokens must be replaced with the matching token

**Themed Interfaces:**
- Vehicle colour may be used as background (e.g. matching paint finish)
- Interface elements remain monochrome; frosted transparency allows bg colour to subtly influence UI
- Avoid saturated, loud, or complementary colours as background
- Accessibility contrast must still be maintained (team's responsibility with custom colours)
- Custom background colours remove PDS contrast guarantees – must be manually verified (WCAG AA: 4.5:1 for text)

**Evaluation Questions:**
- Is the interface monochrome (greys only) outside of media and status elements?
- Are canvas/surface/frosted used correctly and in the right hierarchy?
- Are there more than 2 surface-background containers in the same focus area?
- Are all colour values linked to PDS tokens?
- In themed interfaces: is the background colour subtle and accessible?

**Red Flags:**
- Non-grey UI colours introduced outside of media/assets/status
- Hardcoded colour values that match or are near PDS tokens
- More than 2 surface containers in the same focus area
- Saturated or complementary background colours in themed interfaces
- No contrast check for text on custom/frosted backgrounds

---

### Rule 8 – Drop Shadow & Elevation

Drop Shadow nur über die definierten PDS Elevation-Tokens. Kein freies Vergeben von Shadows.

**Elevation Mapping:**

| Element | Elevation Token |
|---|---|
| Banner | `elevation-high` |
| Toast / Interaction Elements / Tooltips | `elevation-medium` |
| Navigation | `elevation-medium` |
| Sticky Bar | `elevation-medium` |
| Drag | `elevation-low` |
| Content / Interactive Elements / Divider / Box / Cards | `elevation-default` |
| Card / Area (Full-bleed) | `elevation-default` |
| Background / Surface | `elevation-default` |

**Evaluation Questions:**
- Are elevation tokens applied correctly per element type?
- Are there custom or free shadows not based on PDS elevation tokens?
- Is drop shadow used sparingly and only where defined?

**Red Flags:**
- Custom drop shadows outside the defined elevation tokens
- Wrong elevation level applied to an element type (e.g. `elevation-high` on a card)
- Drop shadow used purely decoratively with no elevation context

---

### Rule 9 – Frosted Glass

Frosted Glass sparsam einsetzen. Nur auf heterogenen Hintergründen. Parent/Child-Regel beachten.

> **Brand intent:** see `porsche-di` → Visual Attributes → Materials. Frosted glass is a *sanctioned PDS pattern*, not decorative glassmorphism — the Materials rule bans material *imitation*, not this pattern.

**Definition:** "Frosted" = always the **combination** of Frosted Color (transparent fill) + Frosted Glass Effect. Never one without the other.

**Rules:**
- Use only on heterogeneous backgrounds (images, videos, patterns) – ineffective on flat mono colours
- Apply to **parent elements only** – child elements within a frosted parent must not receive the frosted effect (browser limitation: effects cannot stack)
- Default/base colour as fill base; colour must be detached for opacity reduction
- Use sparingly for performance reasons (browser rendering cost)
- Accessibility risk: contrast may be compromised – always verify

**Evaluation Questions:**
- Is frosted used on a heterogeneous background?
- Is the frosted effect applied to the parent element, not its children?
- Is frosted colour (transparent) combined with the frosted glass effect?
- Is frosted used sparingly (not on every surface)?
- Is contrast of text/content on frosted backgrounds verified?

**Red Flags:**
- Frosted effect on a flat monochrome background (no visual value)
- Frosted effect on a child element inside a frosted parent
- Frosted effect without frosted colour, or frosted colour without the effect
- Excessive use of frosted across many elements (performance risk)
- No contrast verification for content on frosted surfaces

---

### Rule 10 – PDS Components & Design System Compliance

Alle Interfaces werden ausschließlich mit **PDS v4**-Komponenten, -Tokens, -Styles und -Spacing gebaut. PDS v3 Patterns (z.B. Button mit Outline) sind nicht erlaubt.

**Rules:**
- Only PDS components – no custom replacements for available components
- Only Porsche Next (web variant) as typeface
- Only PDS spacing, gap, and padding tokens – no hardcoded values
- Only PDS colour tokens – hardcoded values that match or approximate tokens must be replaced
- Custom components only as absolute last resort:
  - First check whether the flow can be adjusted to use PDS components
  - When a custom component is unavoidable, explicitly flag: PDS components provide accessibility (ARIA), browser compatibility, and quality assurance that a single team cannot replicate

**Evaluation Questions:**
- Are all UI elements built with PDS components?
- Are all spacing values from PDS tokens (no hardcoded px)?
- Are all colours linked to PDS tokens?
- Are any custom components present – and are they justified?

**Red Flags:**
- Custom components replacing available PDS components
- Hardcoded spacing values instead of PDS spacing tokens
- Non-PDS components used for buttons, inputs, navigation, etc.
- Custom components present without explicit justification

---

### Rule 11 – Brand Elements

Markenelemente (Wordmark, Crest, Farbpalette) sparsam und gezielt einsetzen. Immer nur ein Element pro View.

**Wordmark:**
- Primary placement: **global navigation only**
- Additional appearances outside navigation: **not permitted**
- Always centre-aligned
- Sufficient safe zone must be maintained
- Fallback on viewports ≤ 760px: **Porsche Crest** instead of Wordmark

**Brand Element Principle:**
- Only one brand element (Wordmark, Crest, or colour palette) per view/focus area – no combinations
- Brand character is communicated through subtlety, not accumulation
- No alteration or misrepresentation of any brand identifier
- Crest and colour palette are the only permitted brand elements outside the navigation

**Evaluation Questions:**
- Is the Wordmark placed only in the global navigation?
- Is the Crest used as a fallback on ≤ 760px viewports?
- Is there more than one brand element in any focus area?
- Are brand identifiers used unaltered?

**Red Flags:**
- Wordmark appearing outside the navigation
- Wordmark and Crest used together on the same screen
- Multiple brand elements combined in one focus area
- Brand identifiers altered, distorted, or misrepresented

---

### Rule 12 – Vehicle Visualisation & Proportions

Fahrzeugvisualisierungen müssen in realistischer Größenrelation zueinander stehen.

**Rules:**
- When multiple vehicles appear on one screen, they must reflect real-world size relationships (e.g. 718 appears smaller than 911, which appears smaller than Cayenne)
- Use rim sizes as a reference point for balancing proportions
- This rule applies even when only a single vehicle is shown (proportions must feel correct in context)
- Signatures follow the same proportional logic as vehicle assets

**Evaluation Questions:**
- Do multiple vehicles on the same screen reflect correct real-world proportions?
- Is a 718 visually smaller than a 911 / Cayenne where shown together?
- Are rim sizes used as a balancing reference?

**Red Flags:**
- A smaller vehicle model appearing the same size or larger than a bigger model
- Vehicles scaled arbitrarily without reference to real-world proportions

---

### Rule 13 – Model Signatures

Signaturen sind Modellschriftzüge die als Logo-ähnliche Identifikationselemente genutzt werden.

**Rules:**
- **Top-level / overview pages:** Only model series signatures (e.g. `911`, `Cayenne`, `Taycan`) – no derivative-specific signatures
- **Sub-level pages** (e.g. derivative comparison within one model line): Derivative signatures are permitted (e.g. `911 Targa`, `911 4S`)
- **Never mix** derivative signatures of different model lines on the same screen (e.g. `Taycan 4S` + `911 Cabrio` = ❌)
- **No duplicates:** Each signature appears only once per screen
- Signatures may be combined with vehicle cut-out images as background watermarks; overlapping is permitted
- Signatures follow the same proportional sizing rules as vehicle assets (Rule 12)

**Evaluation Questions:**
- On top-level pages: are only model series signatures used?
- On sub-level pages: are derivative signatures restricted to one model line?
- Are derivative signatures from different model lines mixed on the same screen?
- Does the same signature appear more than once on the screen?

**Red Flags:**
- Derivative-specific signatures on a top-level overview
- Signatures from different model derivatives mixed (e.g. `911 Cabrio` + `Taycan 4S`)
- Same signature duplicated multiple times on one screen

---

### Rule 14 – Interactive Elements & Button Hierarchy

Einfache, klare Interaktionen. Kurze Labels. Icons nur für funktionale Aktionen.

**PDS v4 Button Hierarchy:**
1. Primary Button (filled, high emphasis)
2. Secondary Button (no outline/border – v4 only; a button with outline is a v3 pattern and must not be used)
3. Link-pure / Button-pure (lowest emphasis)

**Rules:**
- Never place two buttons of the same hierarchy level side by side – highlight the most relevant action
- Button labels must be short and descriptive
- Icons only for specific functional actions: download, send, export, settings, document etc.
- **No arrow icon** as a generic interaction indicator – this contradicts the Reduction principle
- When multiple buttons are visible, they must not all carry the same icon – if no meaningful icon is available, omit it
- These rules apply **consistently across the entire journey**, not just per screen
- All buttons must be PDS v4 components – PDS v3 button styles (e.g. outline/border Secondary) are not permitted

**Evaluation Questions:**
- Are button hierarchy levels correctly applied and not duplicated side by side?
- Are button labels short and descriptive?
- Are icons used only for specific functional actions?
- Is the arrow icon avoided as a generic CTA indicator?
- Do multiple visible buttons carry different or no icons (no repetition)?
- Is icon usage consistent across all screens in the journey?
- Do any buttons have an outline/border styling (v3 pattern)?

**Red Flags:**
- Two primary or two secondary buttons side by side
- Long, vague, or generic button labels
- Arrow icon as a button or CTA indicator
- Multiple buttons on the same screen all using the same icon
- Icon usage inconsistent across screens in the journey
- Button with outline/border styling → v3 pattern, not permitted in v4

---

## Severity Levels

| Level | Label | Meaning |
|---|---|---|
| 🔴 | **Violation** | Clear rule breach – must be fixed |
| 🟡 | **Warning** | Potential issue or edge case – should be reviewed |
| 🟢 | **Strength** | Design does this well |

---

## Output Template

```
## Design Review: [Screen / Flow Name]

**Viewport evaluated:** [e.g. 1920px Desktop]
**Assumptions:** [list if context was missing]

---

### Strengths 🟢
- ...

### Violations 🔴
- [Rule X – Rule Name]: [specific observation] → [recommended fix]

### Warnings 🟡
- [Rule X – Rule Name]: [potential issue] → [suggested action]

### Recommendations
- P1 (Must Fix): ...
- P2 (Should Fix): ...
- P3 (Nice to Have): ...
```

---

## Related Skills

- For the brand *why* behind these rules (promise, design codes, voice & tone) → consult the `porsche-di` skill
- For component-level decisions → consult the Porsche Design System ([designsystem.porsche.com/v4](https://designsystem.porsche.com/v4/))
- For PDS class validation in a coded prototype → see `validate-pds-classes.mjs` in the `porsche-ux-prototype` skill
- For the overall UX process & which skill to use → use the `porsche-ux-workflow` skill
- To apply one explicitly approved review finding in Figma → use `porsche-ux-figma-edit`

---

## Cost Transparency

At the end of every completed review using this skill, append the cost estimate block.
Formula and format live in `porsche-ux-workflow/SKILL.md` (section **Cost Transparency**):

```
---
💰 ≈X,XXX In / ≈X,XXX Out Tokens · ≈X.XX Credits · **≈$X.XX** _(Claude Sonnet 4.6, inkl. 30% Puffer)_
```
