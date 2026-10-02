---
name: porsche-ux-design
description: "Figma-based UX design work: wireframes, mockups, concept iteration, PDS component selection, design audits, and Figma file setup. Use when the user wants to create or refine a design in Figma, translate research insights into screens, select PDS components, audit an existing design for PDS compliance, or set up a new Figma project file. Triggers on: 'Design erstellen', 'Wireframe', 'Mockup', 'Figma-Design', 'Konzept skizzieren', 'welche PDS-Komponenten', 'Screens bauen', 'Lo-Fi', 'Hi-Fi', 'Design prüfen', 'PDS-konform', 'Audit', 'Figma aufsetzen', 'Template erstellen'."
---

# UX Design

Translate research insights into Figma designs, audit existing designs for PDS compliance, and set up new Figma project files.

> **How this skill differs from related skills:**
> - `porsche-ux-design` — create, iterate, audit, and set up Figma designs (this skill)
> - `porsche-ux-prototype` — build a clickable React/code prototype from a finished Figma frame
> - `porsche-ux-handover` — generate developer handover documentation from the final design

---

## Tasks

| Task | When to use |
|------|-------------|
| [Design Screen](#design-screen) | Creating new screens or iterating existing ones from research insights |
| [Design Audit](#design-audit) | Reviewing an existing Figma design for PDS compliance and quality |
| [Create Template](#create-template) | Setting up a fresh Figma project file with proper PDS structure |
| [Code to Figma](#code-to-figma) | Translating existing PDS HTML/code into a Figma component or pattern |

---

## Shared context

### Prerequisites

- **Figma MCP** — required for all tasks
- Research output (optional but recommended): insights from `porsche-ux-interview` or `porsche-ux-data-analysis`

### PDS component reference

| UI need | PDS component |
|---------|--------------|
| Primary action | `p-button` |
| Navigation | `p-navigation`, `p-tabs` |
| Input fields | `p-text-field-wrapper`, `p-select-wrapper`, `p-checkbox-wrapper` |
| Data display | `p-table`, `p-grid` |
| Feedback / status | `p-banner`, `p-inline-notification`, `p-tag` |
| Overlay | `p-modal`, `p-flyout` |
| Media | `p-carousel`, `p-media-gallery-item` |
| Loading | `p-spinner`, `p-skeleton` |
| Typography | `p-heading`, `p-text`, `p-display` |

Full component list: [https://designsystem.porsche.com/v3/](https://designsystem.porsche.com/v3/)

**Rule:** Reach for a PDS component first. Only design custom UI if no PDS component exists — and flag it as a gap.

### Figma structure rules for MCP to code

Treat design frames as implementation specs, not static pictures.

- Use auto-layout on every structural frame. Horizontal/vertical auto-layout maps to flexbox intent.
- Use grid mode for true two-dimensional layouts. This maps to CSS Grid intent.
- Use parent `gap` and `padding` instead of spacer rectangles.
- Bind spacing (`gap`, `padding`, offsets) to variables/tokens, not raw pixels.
- Set sizing intentionally on every node: `hug`, `fill container`, or `fixed`.
- Name structural layers semantically (`Header`, `Hero / Content`, `CTA_Button`) and remove generic names (`Frame 49`, `Rectangle 23`).
- Name pages semantically (`Home / Desktop / 1440`, `Home / Tablet / 768`, `Home / Mobile / 375`), never `Page 1` / `Copy of Exploration`.
- Mark source-of-truth screens/components explicitly, e.g. `(Spec)` or `(Source)`.
- Keep production pages clean: move explorations/alternatives to a playground/archive page.

---

## Design Screen

### When to use

- "I have research insights — help me sketch screens from them"
- "Which PDS components fit this flow?"
- "Iterate this design proposal based on user feedback"
- "Create a concept proposal for [Feature]"

### Procedure

#### 1. Clarify scope

Ask the user:
- What is the user task / job-to-be-done for this design?
- Is there an existing Figma file to work in, or starting from scratch?
- Lo-Fi sketch or Hi-Fi with PDS components?
- Desktop, mobile, or responsive?
- Which Porsche product context? (Porsche.com, My Porsche, internal tool, …)

#### 2. Map the flow

Before designing screens, map the user flow:
- Entry point → key steps → success state → error states
- Flag edge cases that need a screen (empty state, loading, error, confirmation)
- Identify where PDS patterns apply (forms, navigation, data display, feedback)

Output: Flow map as a numbered Markdown list or simple table.

#### 3. Select PDS components

For each screen element, pick from the PDS component reference above.

#### 4. Design in Figma

Use Figma MCP tools to:
- `get_design_context` — read an existing frame for context
- `get_variable_defs` — check which color/spacing tokens are applied
- `search_design_system` — find existing PDS components in the shared library
- `use_figma` — create or update frames using PDS components

When creating new screens, always:
- Use PDS auto-layout grids (not free-positioning)
- Apply the correct color scheme per section (`light`, `dark`, `auto`)
- Use PDS spacing tokens (not hard-coded pixel values)

#### 5. Review before handoff

Run the [Design Audit](#design-audit) checklist before considering a screen done.

### Output

| Deliverable | Format |
|-------------|--------|
| Flow map | Markdown |
| Component selection | Markdown table |
| Figma frames | Created/updated via Figma MCP |
| Handover-ready design notes | Markdown → pass to `porsche-ux-handover` |

---

## Design Audit

### When to use

- "Check this design for PDS compliance"
- "Ist das PDS-konform?"
- "Design audit durchführen"
- "Review my Figma frame"
- "Was muss ich noch anpassen?"

### Procedure

#### 1. Get the design

Ask the user for the Figma URL (frame or page level). Then:
- `get_design_context` — read the full frame structure and token usage
- `get_variable_defs` — check which variables/tokens are applied vs. raw values

#### 2. Run the audit checklist

Score each item: 🔴 Blocking · 🟡 Recommended · 🟢 Minor

**Components**
- [ ] All interactive elements use PDS components (no custom buttons, inputs, etc.)
- [ ] Any custom components are flagged with a note explaining why no PDS equivalent exists
- [ ] Component variants match intended state (size, variant, loading, disabled …)

**Tokens & styling**
- [ ] Color values come from PDS tokens (no raw hex or opacity hacks)
- [ ] Spacing and sizing values use PDS tokens (not custom px values)
- [ ] Typography uses PDS text styles (`p-heading`, `p-text`, `p-display`)
- [ ] Color scheme applied consistently per section (`light` / `dark` / `auto`)

**States & edge cases**
- [ ] All interactive states designed: default, hover, active, focus, disabled
- [ ] Error state present for every form element
- [ ] At least one empty state included
- [ ] Loading state included where async content appears

**Accessibility**
- [ ] Text contrast meets WCAG AA (4.5:1 for body, 3:1 for large text)
- [ ] Focus order is logical and documented
- [ ] All non-decorative images have alt text noted
- [ ] Icon-only buttons have a visible or screen-reader label

**Responsive**
- [ ] Mobile breakpoint designed or explicitly noted as out of scope

**Layout semantics (MCP readiness)**
- [ ] Structural frames use auto-layout or grid mode (no free-positioned section layouts)
- [ ] Spacing is token-based via variables (`gap`/`padding`), not spacer rectangles
- [ ] Node sizing is explicit (`hug` / `fill container` / `fixed`) and consistent with intent
- [ ] Key sections and layers are semantically named (no generic frame/rectangle names)
- [ ] Page names are navigable and include breakpoint intent where relevant
- [ ] Source-of-truth frames/components are clearly marked (`(Spec)` / `(Source)`)

#### 3. Report findings

Group by severity. For each finding include:
- **Location** — frame name / layer name
- **Issue** — what's wrong
- **Fix** — concrete suggestion

### Output

| Deliverable | Format |
|-------------|--------|
| Audit report | Markdown with 🔴/🟡/🟢 findings |
| Summary line | "X blocking, Y recommended, Z minor issues found" |

---

## Create Template

### When to use

- "Neues Figma-File aufsetzen"
- "Figma-Template für [Projekt] erstellen"
- "Set up a Figma project file"
- "Figma initial template aufsetzen"

### Procedure

#### 1. Clarify setup

Ask the user:
- Project / feature name?
- Platform: desktop, mobile, or both?
- Who owns this file? (for cover page)
- Existing Figma project to place the file in, or standalone?

#### 2. Create the file

Use `create_new_file` (Figma MCP) or ask the user to share a blank file URL.

#### 3. Set up pages

Create this standard page structure:

| Page | Purpose |
|------|---------|
| `📋 Cover` | Project name, owner, date, status |
| `01 Research` | Personas, user flows, research artifacts |
| `02 Concepts` | Lo-Fi wireframes, explorations |
| `03 Design` | Hi-Fi screens, component specs |
| `04 Prototype` | Flow connections / prototype links |
| `🗄 Archive` | Superseded versions (do not delete, just move here) |

#### 4. Enable PDS library

In the file, enable the shared PDS component library:
- `get_libraries` — find the PDS library
- Enable it so `search_design_system` and component placement works in this file

#### 5. Set up Cover page

On the Cover page create a frame with:
- Project name (`p-heading` size XL)
- Owner name + team
- Date created
- Status tag (`p-tag`: Draft / In Review / Final)

#### 6. Add grid to design pages

On pages 02 and 03: add a PDS layout grid frame as the base for all screens.

### Output

| Deliverable | Format |
|-------------|--------|
| Figma file | Created via Figma MCP (or user's blank file, structured) |
| Page structure | As per standard above |
| Setup summary | Markdown: file URL, pages created, library status |

---

## Code to Figma

### When to use

- "Übersetze diesen HTML-Code nach Figma"
- "Bau dieses Pattern als Figma-Komponente"
- "Code to Figma", "HTML to Figma"
- "Ich habe ein PDS-Pattern — leg das als Library-Komponente an"
- "Figma-Pattern aus Code erstellen"

### Prerequisites

- **Figma MCP** — required
- **PDS Code Connect mapping** at `~/.copilot/skills/porsche-ux-design/pds-components-mapping/`

### Procedure

#### 1. Gather inputs

Ask the user for:
- **Code source** — file path, GitHub URL, or paste the HTML directly
- **Target Figma file** — URL of the branch/file to place the component in
- **Component name** — what the Figma frame/component should be called
- **Detachable component?** — yes (Library component to publish) or no (one-off pattern frame)

#### 2. Parse the HTML — extract PDS component inventory

For each `p-*` element in the source HTML, create a row:

| # | PDS tag | Relevant HTML attributes | Slot content |
|---|---------|-------------------------|--------------|
| 1 | `p-button-pure` | `icon="menu-lines"`, `hide-label="true"` | `Menu` |
| 2 | `p-drilldown` | — | items… |
| … | … | … | … |

Also note the **layout structure**: nesting, flex/grid classes, alignment, spacing tokens
(PDS Tailwind classes like `gap-fluid-md`, `p-static-xs`, `col-wide`).

#### 3. Resolve each component via mapping

For each `p-*` tag, read `~/.copilot/skills/porsche-ux-design/pds-components-mapping/<tag>.json`:

```
tag: p-button-pure
  → figma.componentKey  (use for importComponentByKeyAsync)
  → props: icon         → figma name "Icon#35746:0", kind INSTANCE_SWAP
  → props: hideLabel    → figma name "hideLabel", kind VARIANT, values ["false","true"]
  → deviations          → skip: size, type, name, value, underline
  → slots.figmaLayer    → "pure-label" (set text here)
```

**Handle deviations explicitly:**
- Props in `deviations` with `type: missing-prop` → do NOT try to set them as Figma properties
- Note them in a post-creation comment frame or annotation instead
- `parityScore < 0.7` → manually verify the component after creation

**If no mapping file exists for a tag:** fall back to `search_design_system` by component name.

#### 4. Check the target library

The mapping's `figma.componentKey` references the **main PDS Web Design System** file.  
If the target branch uses a different library (e.g. a fork or branch), first confirm via:
- `get_libraries` — list enabled libraries in the target file
- `search_design_system` — verify the component exists in the active library

If the componentKey resolves to a different file than what's enabled, use `search_design_system`
results as the fallback source for `importComponentByKeyAsync`.

#### 5. Build in Figma via `use_figma`

Run `use_figma` with a script that:

1. **Creates the outer frame** — Auto-layout, direction and spacing from the HTML structure
2. **For each component instance:**
   - `importComponentByKeyAsync(componentKey)` from the mapping
   - `createInstance()` and place in the frame
   - Set Variant properties (`setProperties({ 'hideLabel': 'true' })`)
   - Set INSTANCE_SWAP properties (e.g. icon) via `swapComponent` on the nested node
   - Set slot text content on the layer named in `slots[].figmaLayer`
3. **Apply color scheme** — if the HTML uses `scheme-dark` / `scheme-light-dark`, set
   the frame's fill / background accordingly
4. **Mark as component** — if the output should be a detachable Library component:
   - Wrap the outer frame as a `COMPONENT` node
   - Name it following PDS pattern naming: e.g. `Pattern/Header/1`

#### 6. Screenshot and verify

After `use_figma` completes:
- `get_screenshot` of the created frame
- Compare against a rendered version of the source HTML (if available)
- Check: component instances present, layout alignment, color scheme

#### 7. Post-creation notes

For every deviation (props skipped because they don't exist in Figma), add a Figma annotation
or sticky with:
- Which prop was omitted
- The code value (so a designer can set it manually if needed)

### Output

| Deliverable | Format |
|-------------|--------|
| Figma component/frame | Created in target file via Figma MCP |
| Component inventory table | Markdown (from step 2) |
| Deviation notes | Figma annotations or sticky notes in the frame |
| Screenshot | Captured after creation for review |

### Known limitations

- **Responsive props** (`hide-label="{base: true, s: false}"`) — Figma has no direct equivalent;
  create the primary state (base) and add a variant or annotation for the breakpoint state
- **CSS layout utilities** (`col-wide`, `grid-template`) — translate to Auto-layout frame sizing;
  exact pixel match not guaranteed without visual iteration
- **Dynamic/interactive content** (videos, drilldown menus) — represent as static placeholder
  frame with annotation noting the dynamic behaviour
- **Mapping version** — mapping reflects the PDS version at last publish date; if the
  component was redesigned since, `search_design_system` may return a newer key

---

## Transition to next phase

After design is approved:
- **For interactive validation:** Pass Figma URL to `porsche-ux-prototype` → builds a clickable React prototype
- **For usability testing:** Pass Figma URL to `porsche-ux-testing` → generates a test plan
- **For dev handover:** Pass Figma URL to `porsche-ux-handover` → generates spec + compliance report

---

## Common mistakes

- Using a generic `<button>` instead of `p-button` — always check PDS first
- Free-positioning elements instead of using PDS layout grid
- Applying brand colors with raw hex values instead of PDS color tokens
- Designing only the happy path — always add at least one error state and one empty state
- Forgetting responsive variants — check how the layout breaks on mobile
