---
name: porsche-ux-prototype
description: "[Phase 3 — Prototype & Test] Generate a runnable React prototype in the Porsche Design System stack (Vite + React 19 + TS + Tailwind 4 + @porsche-design-system/components-react) from a Figma frame URL. Use when the user provides a Figma URL and asks for a 'prototype', 'React prototype', 'React-Prototyp', 'klickbarer Prototyp', 'PDS prototype', 'PDS Prototyp', 'Prototyp aus Figma', or to 'scaffold a PDS React app from Figma'."
---

# PDS Prototype

Generate a **runnable React prototype** in the official Porsche Design System
stack from a **Figma frame URL**.

This file has two parts:

- **Part 1 — Procedure** (below): the operational steps. Follow top to bottom.
- **Part 2 — Reference** (after the procedure): lookup tables for tokens, grid,
  chrome patterns, templates. **Consult on demand during the procedure** — do
  not read it front-to-back before starting.

## When to use

User provides a `figma.com/design/...` URL and asks for any of:
- "Turn this Figma design into a React prototype"
- "Scaffold a PDS React app from this frame"
- "Clickable prototype with PDS"
- "Generate a working prototype from Figma"

Do **NOT** use for:
- Single-file HTML tools/dashboards → use `pds-tool` skill
- Single React component snippets without a full project → just call `mcp_figma_get_design_context` with `clientFrameworks: react` and paste the snippet
- HTML presentations / slide decks → use `porsche-pds-html-presentation`

## Stack (fixed, do not improvise)

- Vite + React 19 + TypeScript
- Tailwind 4 with PDS tokens via `@porsche-design-system/components-react/tailwindcss`
- `@porsche-design-system/components-react@4.2.0-rc.2`
- Boilerplate is vendored under `skills/porsche-ux/porsche-ux-prototype/template/` and pinned to PDS RC2 (`4.2.0-rc.2`).

## Global rules (always apply)

1. **Figma is the only source of truth.** Every visible text, every component
   prop value, and every layout decision comes from the Figma MCP output —
   never from memory, npm type declarations, or invention. (Full statement in
   Step 2, *Fidelity Contract*.)
2. **`clientFrameworks: 'react'`** is mandatory on every Figma MCP call.
   Without it the MCP returns generic HTML and all Code Connect mappings are lost.
3. **Never edit `template/`** to fulfil a request. It's the shared base —
   changes must be deliberate (re-`degit` from upstream or an intentional patch).
4. **Always vendor the boilerplate locally** — never `npx degit` at generation
   time. Reproducibility matters.
5. **PDS components win over custom layout.** If a Figma layer maps to a PDS
   component via Code Connect, use it — do not re-implement the UI in raw Tailwind.
6. **Annotations are AI context only.** Never render them as visible UI. If they
   influence the code, drop a short `{/* a11y: ... */}` JSX comment.
7. **One prototype = one folder.** Never mutate an existing `prototypes/<slug>/`
   to "update" it — generate a new slug (`<slug>-v2`) so the user can diff.
8. **No invented chrome.** Do not add header, footer, navigation, or any page
   wrapper that is not present in the Figma frame. If the frame contains only
   ComponentCards, the output contains only ComponentCards — nothing more.
   Chrome that isn't in Figma is invented content, same as an invented prop value.

---

# Part 1 — Procedure

### 0. Run preflight hygiene gate

Evaluate the target frame against the *Preflight criteria* (Part 2). If there
are blocking issues, return a concise fail report and a cleanup plan **before**
generating code. Generate code only after the frame passes or the user
explicitly accepts lower-fidelity output.

### 1. Parse the Figma URL

Extract `fileKey` and `nodeId` from URLs of the form
`figma.com/design/:fileKey/:fileName?node-id=:nodeId`. Convert `-` to `:` in
`nodeId` (Figma encodes `:` as `-` in URLs).

If the user provided no node-id, ask for the specific frame URL — never guess.

### 2. Pull design context from Figma (React mode!)

> **Fidelity Contract — nothing is invented, ever:**
> Every visible text (headings, labels, descriptions, placeholders, button copy),
> every component prop value, and every layout decision MUST come verbatim from
> the `get_design_context` CC output of that specific node.
> **If a value is absent from the CC output → emit `{/* TODO: copy from Figma */}`.**
> Do NOT fill gaps from memory, from sibling nodes, from npm type declarations,
> or from screenshots. Screenshots are for layout debugging only, never for
> reading text or prop values.
>
> **No-CC rule:** When a component has no Code Connect snippet (the CC block is
> absent or returns only an empty wrapper), emit **only** `<PComponentName />`
> with **zero props**. Do not infer prop names or values by analogy from other
> components (e.g. `PSpinner` has `size="medium"` → do NOT apply that to
> `PWordmark`). Invented props are caught by `tsc --noEmit` in the validate step
> — but it is better never to invent them.

#### 2a. Root frame — initial parallel fetch

Call **in parallel** in a single tool-use block:

```
mcp_figma_get_design_context({ nodeId, fileKey, clientFrameworks: 'react', excludeScreenshot: true })
mcp_figma_get_metadata({ nodeId })
```

**`excludeScreenshot: true` is MANDATORY on every `get_design_context` call** — set it unconditionally on the root frame and on every child node.

**Why:** the MCP always attaches a screenshot unless explicitly told not to. When Code Connect snippets are present (which is the case for all PDS components), the screenshot adds latency and token cost with zero benefit. Screenshots are only useful as a last resort when CC returns no snippets at all (raw hex / absolute positioning only).

**The only exception:** call `get_design_context` *without* `excludeScreenshot: true` (i.e. let it default to including the screenshot) when:
- The CC output for this specific node contains **no** component snippets (raw HTML / hex only), AND
- You need the screenshot to debug layout structure.

Never call `mcp_figma_get_screenshot` as a standalone tool by default — it is fully redundant when `excludeScreenshot` is not set on `get_design_context`.

#### 2b. Child-node fetching (frames with multiple children)

From the `get_metadata` response, extract the `nodeId` for every direct child
you will render individually (sections, cards, tiles).

**Call `get_design_context` on EVERY child node — no exceptions:**

1. Collect all child `nodeId` values.
2. Call `get_design_context` on **every** child nodeId, in parallel batches — always with `excludeScreenshot: true`.
3. Use the returned CC snippets verbatim: prop values, text content, children.
4. **Also call `get_design_context` on the shared wrapper component** (e.g. the
   ComponentCard frame) to read its layout tokens (`bg-*`, `gap-*`, `p-*`,
   `rounded-*`). Never copy a wrapper from a previous prototype — its classes
   may differ. Map the raw Figma token classes to PDS utilities using the
   *Figma → Grid translation* table in Part 2.

**Why no deduplication:** Even when two nodes share the same `componentKey`,
their CC output contains the **actual content** (text, prop values) of that
specific instance. Deduplicating by componentKey and reusing one representative's
CC output silently drops the real content of all other instances — which leads
to invented text, wrong prop values, and fidelity violations.

The token/latency cost of fetching all nodes is the correct trade-off for
accurate output: render N distinct instances → make N `get_design_context`
calls. Do not reduce that count by sampling or deduplicating.

> **Token optimization for large frames (≥ ~15 children) — delegate the bulk
> fetch to a subagent.** Each `get_design_context` response carries a large,
> repeated boilerplate footer ("SUPER CRITICAL…", node-id notes, component
> descriptions). Across 40+ nodes that boilerplate dominates the main context
> for zero value. Instead, dispatch ONE subagent (`runSubagent`, or the
> `Explore` agent) that:
> 1. Receives the full list of child nodeIds + `fileKey`.
> 2. Calls `get_design_context` on every node (`clientFrameworks: 'react'`,
>    `excludeScreenshot: true`) **and** `mcp_figma_download_assets` on every
>    tile instance node — all inside its own context.
> 3. Returns ONLY a compact map: per node `{ tag, props (verbatim),
>    text (verbatim), childSnippets (verbatim), assetUrls, tileRawImages }`.
>
> Instruct the subagent **explicitly**: *"Copy every prop value and text string
> character-for-character. Never paraphrase, translate, shorten, or invent. If a
> value is absent, write `MISSING`."* This preserves the Fidelity Contract
> (every instance is still read verbatim) while keeping the 40× boilerplate out
> of the main context — typically an 80–90% main-context token saving.
>
> For small frames (< ~15 children) the subagent round-trip isn't worth it —
> fetch inline as above.

**No CC snippet returned:** If a node returns no Code Connect snippet (raw
HTML only), emit `{/* TODO: copy from Figma */}` for any missing text or props.
Do NOT use a screenshot to read text — screenshots are not a reliable text
source and introduce the same invention risk. Never invent content.

#### 2c. Scheme detection — skip when uniform

Call `mcp_figma_get_variable_defs` for a section **only if**:
- The metadata shows different `background` token values across sections, OR
- At least one section has a `scheme` annotation or a visibly distinct background token.

If the root frame has a single scheme token and no section overrides it:
**skip `get_variable_defs` entirely.** The root scheme applies everywhere.
Do not run it "just to be sure" — it adds a round-trip per section for zero gain.

When you do call it, map the returned tokens with the *Scheme decision table* (Part 2).

#### 2d. Complete ALL fetches before writing a single line of App.tsx

Wait for every `get_design_context` call to finish. Assemble a complete
component map before touching any file:

```
componentKey (or nodeId) → { snippet, props, text content, asset URLs }
```

**Do not interleave Figma calls and code writing.** Iterative
CC → partial code → CC → patch cycles are the primary cause of prop-name
mismatches, invented text, and build-error loops. They waste 3–5× the tokens
of a single write-once pass.

> **MANDATORY pre-write gates — evaluate the assembled map before Step 6.**
> These are not optional polish; skipping them produces broken output that the
> Step 8 validator will reject anyway. Do them now, not after.
>
> 1. **Tile gate.** If the map contains ANY `PLinkTile`, `PButtonTile`, or
>    `PLinkTileProduct` → Step 5b-ii (`mcp_figma_download_assets` on each tile
>    instance node) is **required before writing App.tsx**. There is no path to
>    Step 6 that skips it. Each tile must end up with EITHER a real `<img>`
>    child OR an explicit `{/* no-fill: … */}` marker. The validator
>    (`validate:pds`) hard-fails on a tile that has neither — treat that as a
>    build error, never as a warning to defer.
> 2. **Asset gate.** Every `const imgXxx = "…/api/mcp/asset/…"` constant in the
>    map must be downloaded (Step 5b) before it is referenced. Never ship a
>    raw `api/mcp/asset` URL in JSX — it expires in 7 days.
> 3. **Zero-invention gate.** Run the Zero-invention checklist (Step 2e).
>
> **BLOCKED rule — never silently degrade to placeholders.** If ANY image node
> or tile exists in the map but the asset step cannot complete — the download
> tool errors, a URL 404s/expires, or `rawImages` can't be resolved — **STOP
> before writing App.tsx and report `BLOCKED`**. State exactly which asset/node
> failed and why. Do NOT continue with gradient backgrounds, `bg-*` fills, stock
> photos, or any other placeholder in place of a real Figma asset. Shipping a
> prototype with invented imagery is a fidelity violation, not a graceful
> fallback. Only proceed once every image node is either downloaded + wired or
> confirmed (via Step 5b-ii) to have no real fill in Figma.

#### 2e. How to interpret CC output

- **Code Connect snippets** → use **verbatim**. Prop names, prop values, and
  child content all come from the CC snippet of that specific node — never from
  memory, never by analogy with other components, never from npm type
  declarations. If the snippet shows `state="error"`, that is the correct prop.
  Do not second-guess it.
- **Text content** → copy character-for-character as it appears in the CC
  snippet. Do not rephrase, translate, shorten, or substitute with filler.
  If text is absent from the CC output, emit `{/* TODO: copy from Figma */}`.
- **Tailwind classes with `prose-*`, `bg-*`, `gap-fluid-*`, `text-*-md`** →
  keep as-is, they resolve to PDS tokens via the Tailwind plugin.
- **Raw hex / absolute positioning** → loosely structured area; map to
  PDS grid tokens (see *Figma → Grid translation*, Part 2). Do NOT call
  `get_screenshot` to read text from layout-only nodes.
- **Annotations / a11y notes** → use as code context only (`aria-label`,
  semantic tags, focus order). Do NOT render them visibly.
- **Token name mapping**: Figma uses `xx-small / x-small / small / medium /
  large / x-large / xx-large`; code uses `2xs / xs / sm / md / lg / xl / 2xl`.
  Values match 1:1.

> **Zero-invention checklist** — before writing a single JSX line, verify:
> 1. Every prop value in the file comes from a CC snippet (`get_design_context` result).
> 2. Every text string in the file comes from a CC snippet.
> 3. No prop was inferred from a sibling component, npm docs, or memory.
> 4. Any gap is marked `{/* TODO: copy from Figma */}` — not filled with a guess.

### 3. Choose a master template

Follow the *Master templates decision tree* (Part 2) — do **not** roll a custom
header/footer/grid. The shells handle Porsche-Grid wiring, brand marks, scheme
handling, header overlay, and footer chrome.

Override via user flag (`shell=canvas | landing-simple | landing-overlay | landing-shop`).

### 4. Theme / viewport

The boilerplate ships `<html class="scheme-light-dark bg-canvas">` and wraps
the app in `<ColorSchemeProvider>` (system-aware light/dark). **Do not change
the provider config** unless the design explicitly forces one scheme.

If the Figma frame is locked to one scheme (e.g. a dark-only marketing page),
apply the override on the outermost shell element instead (`<LandingPage>` will
pass it through) — never edit `main.tsx`.

Viewport: the boilerplate is fully responsive (320–2560px). Frame widths in
Figma are reference snapshots, not a target — `grid-template` adapts.

### 5. Slugify and create the prototype folder

- `slug` = kebab-case of the Figma frame name, or user-provided. Strip emoji.
  Limit to 60 chars. Must be unique under `prototypes/` — if exists, append
  `-2`, `-3`, …
- Copy `<SKILL_ROOT>/template/**` → `<SKILL_ROOT>/prototypes/<slug>/`
  (everything **except** `node_modules/`, `dist/`, `.vite/`).
- Use `cp -R` via terminal. Do not symlink.

### 5b. Download Figma image assets (content imagery) — PARALLEL

The `mcp_figma_get_design_context` response includes asset URLs of the form
`https://www.figma.com/api/mcp/asset/<uuid>`. They are valid for **only 7
days** — never reference them directly in the prototype.

Download all content images (hero backgrounds, tile/card images, carousel
slides, content-block images) into the prototype **before** writing `App.tsx`:

1. `mkdir -p src/assets/figma`
2. From the design-context output, locate each `const imgXxx = "https://www.figma.com/api/mcp/asset/…"` constant and trace its usage to find which Figma layer it belongs to (`data-name`). Map to semantic filenames:
   - `hero.png`, `tile-1.png`, `tile-2.png`, `carousel-1.png`, `content-1.png`, …
3. Download all assets **in parallel** via a single shell command:
   ```bash
   curl -sSfL -o src/assets/figma/hero.png    "<url-1>" &
   curl -sSfL -o src/assets/figma/tile-1.png  "<url-2>" &
   curl -sSfL -o src/assets/figma/tile-2.png  "<url-3>" &
   wait
   ```
   Figma exports raster images as PNG by default; verify with
   `curl -sI <url> | grep -i content-type` only if a render breaks.
4. In `App.tsx`, import them as Vite ES-module assets (Vite hashes +
   fingerprints them, they survive the 7-day expiry, and ship in `dist/`):
   ```tsx
   import heroImg from './assets/figma/hero.png'
   ```

**Skip** the `imgVector*` / `imgIcon*` / `imgFlag*` constants — those are SVG
glyphs already covered by `<PIcon>`, `<PWordmark>`, `<PCrest>` etc. Only
download photographic / illustrative imagery.

**Never** fall back to Unsplash or other stock URLs when Figma assets are
available — the prototype must mirror the original design's content.

**If a download fails** (curl non-zero, 404, expired URL) → do **not** proceed
to write `App.tsx` with a gradient/placeholder in that image's place. Stop and
report `BLOCKED` per the pre-write BLOCKED rule (Step 2d), naming the failed
asset. Retry the download once; if it still fails, surface the block to the user
rather than shipping invented imagery.

#### 5b-ii. Tile IMAGE fills — `mcp_figma_download_assets`

Applies to `<PLinkTile>`, `<PButtonTile>`, and `<PLinkTileProduct>`: these
components require an `<img>` child as their background image.

> **This sub-step is MANDATORY, not conditional.** If the component map contains
> any tile component, you MUST run `mcp_figma_download_assets` for each tile
> instance node — regardless of whether the CC snippet happened to include an
> `imgXxx` constant. The HTML Code Connect parser frequently omits image-fill
> constants for tiles (verified June 2026: both gallery tiles had real JPEG
> fills but zero `imgXxx` constants in their CC output). The ONLY reliable way
> to know whether a tile has a real fill is to call `download_assets` and
> inspect `rawImages`. Do not infer "no image" from a missing `imgXxx`.
>
> The Step 8 validator enforces this: any tile without an `<img>` child or an
> explicit `{/* no-fill: … */}` marker fails the build.

**Fast path:** if the CC output already contains an `imgXxx` constant for the
tile, you may use Step 5b directly — but still confirm via the validator that
the `<img>` child is present.

**Step 1 — Find the tile instance nodeIds.**

The tile nodes are the **instance** nodes (`<instance name="button-tile" …>` /
`<instance name="link-tile" …>`), NOT the ComponentCard wrapper frame. Get
them from `mcp_figma_get_metadata` on the parent frame, or read them from the
`data-node-id` attribute in the CC snippet. Example shape from metadata output:

```
<instance id="<TILE_NODE_ID>" name="button-tile" …>
<instance id="<TILE_NODE_ID>" name="link-tile" …>
```

**Step 2 — Call `mcp_figma_download_assets` on each tile instance nodeId.**

Call in parallel for all tile nodeIds. Use the **tile instance nodeId**, not
the parent/root frame — that returns all images from the whole subtree.

```
mcp_figma_download_assets({ fileKey, nodeId: "<TILE_NODE_ID>" })
```

Response structure:
```json
{
  "export": { "url": "…" },
  "rawImages": [
    { "url": "https://www.figma.com/api/mcp/asset/…", "format": "jpeg" }
  ]
}
```

- **`export.url`** → rendered screenshot WITH UI layers (gradient, text, button)
  on top. **Never use this as the `<img>` src.**
- **`rawImages[n].url`** → raw fill only, no overlays. This is the correct source.

**Step 3 — Detect placeholder checker vs. real image.**

**Preflight before any candidate download:** check the tile/node metadata fills
first. If `fills` has no `{ type: "IMAGE", imageHash: "…" }`, mark the node as
`no-fill` and skip network/download entirely for that node.

There is a **deterministic** signal — do not guess from file size. Figma renders
a fixed **64×64 px** transparency-checker tile whenever an image-fill *slot*
exists on a node but **no real image is assigned**. A real fill is always full
resolution (hundreds–thousands of px on the long edge). So the **pixel
dimensions** are the reliable, format-independent test:

```bash
TMP_RAW_DIR="$(mktemp -d)"
curl -sSfL "<rawImages[0].url>" -o "$TMP_RAW_DIR/tile-1-check.img"
file "$TMP_RAW_DIR/tile-1-check.img"   # prints "PNG image data, 64 x 64" or "JPEG … 1366x2048"
```

| `file` output | Meaning | Action |
|---|---|---|
| dimensions are **exactly 64×64** | Figma placeholder checker — no real fill assigned | **No `<img>` child** (see note) |
| dimensions are anything larger (e.g. 753×1000, 1366×2048) | Real photo / illustration | Use it ✓ |
| `rawImages` array is empty | Node has no image fill at all | **No `<img>` child** |

> The 64×64 checker is byte-identical every time (~284 B RGBA PNG), but match on
> **dimensions**, not byte count — that's robust across Figma versions and never
> mistakes a small-but-real thumbnail for a placeholder.

> **Cross-check (optional, most authoritative):** the tile node's `fills` array
> in `get_metadata` / `get_design_context`. A real fill is
> `{ type: "IMAGE", imageHash: "<hash>" }`. No IMAGE entry → no fill → no `<img>`.
> Use this if the `file` dimension check is ambiguous.

> **If no real fill (empty, or 64×64 checker):** The tile has no image fill.
> **Do not add an `<img>` child** to `<PLinkTile>` / `<PButtonTile>`. The
> component renders with a solid background colour and its text/button content
> only. Do NOT substitute with a CDN URL, Unsplash, Lorem Picsum, or any other
> stock photo — the prototype must reflect the actual Figma design.

**Step 4 — Choose the correct rawImage entry.**

When multiple `rawImages` entries are returned (Figma returns up to 20 fills
from the whole subtree), download each, run `file` on it, and discard any that
are 64×64 placeholders. Among the real ones, pick the largest by pixel
dimensions — that's the full-bleed tile image (icons/tags return smaller fills).

**Storage rule:** candidate downloads are **temporary only**. Use a temp folder
(`mktemp -d`) while selecting candidates. Never persist candidate batches under
`src/assets/figma/_raw` in the generated prototype.

**Step 5 — Download and save locally.**

Name the file after the tile variant (e.g. `tile-button-1.jpg`,
`tile-link-1.jpg`). Always use the correct extension from `rawImages[n].format`.

```bash
mkdir -p src/assets/figma
TMP_RAW_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_RAW_DIR"' EXIT

# 1) Download candidates to temp only
curl -sSfL "<rawImages[0].url>" -o "$TMP_RAW_DIR/candidate-1.jpg"
curl -sSfL "<rawImages[1].url>" -o "$TMP_RAW_DIR/candidate-2.jpg"

# 2) Pick largest non-64x64 candidate (using `file` output)
# 3) Persist ONLY the final selected image:
cp "$TMP_RAW_DIR/candidate-2.jpg" src/assets/figma/tile-button-1.jpg

# 4) Temp files are deleted automatically by trap
```

Keep exactly one final file per mapped image component in `src/assets/figma/`.
If selection fails (no non-placeholder candidate), mark `no-fill` and do not
persist candidate files.

**Step 6 — Import and inject in App.tsx.**

```tsx
import tileButton1Img from './assets/figma/tile-button-1.jpg'

<PButtonTile …>
  <img src={tileButton1Img} alt="" />   {/* must be first child */}
  …slots…
</PButtonTile>
```

The `<img>` must be the **first child** — PDS slots it into the background layer.
Never hardcode the Figma asset URL directly in JSX — always import via Vite.

### 6. Replace `src/App.tsx`

> **Prerequisite:** The component map from Step 2d must be complete.
> Do not start this step with pending Figma calls or unresolved CC results.

Write the entire file in one pass:

- Build the React component from the CC snippets in the component map.
- Every prop value and every text string MUST come from the CC snippet of that
  specific node (Step 2b). **Never write content from memory, from a sibling
  node, or by analogy.** If a node's CC snippet is missing text, emit
  `{/* TODO: copy from Figma */}` — not a placeholder, not a pangram, not a
  German label you recognise from a different component.
- Top-level export = `App` (default export).
- Keep imports tidy: PDS components from `@porsche-design-system/components-react`.
- Wrap in the chosen shell from Step 3.
- Re-use boilerplate utilities where applicable (`useColorScheme`,
  `ColorSchemeSelect`) — only when the design has a theme switcher.

#### Tile background image injection

`<PLinkTile>`, `<PButtonTile>`, and `<PLinkTileProduct>` require an `<img>` as
their **first child** for the background image — **only when a real fill exists**
(Step 5b-ii confirmed a non-64×64 image). If no real fill was found, omit the
`<img>` entirely. Never substitute with a stock photo or CDN URL. All prop
values below are placeholders — copy the real `label` / `description` / `href`
verbatim from each tile's CC snippet:

```tsx
// Only when Step 5b-ii found a real fill:
import tileImg1 from './assets/figma/tile-button-1.jpg'

// Tile WITH a real fill → <img> as first child
<PLinkTile label="<from CC>" description="<from CC>" href="<from CC>">
  <img src={tileImg1} alt="" />   {/* first child */}
</PLinkTile>

// Tile with NO fill → no <img> at all
<PButtonTile label="<from CC>" description="<from CC>">
  {/* no <img> — Figma tile has no image fill */}
</PButtonTile>
```

Do **not** touch `src/main.tsx`, `src/index.css`, `vite.config.ts` unless the
prototype genuinely needs it (e.g. add a route library). Document any deviation
in the prototype's README.

### 7. Write `prototypes/<slug>/README.md`

Include:
- Source Figma URL + frame name + node-id
- Generation timestamp
- Shell choice + scheme choice
- Section-scheme map (which section is `scheme-dark` / `scheme-light` per Figma)
- Asset list (filename → original Figma layer)
- `npm install && npm run dev` quickstart
- **Note**: `prototypes/` is gitignored — local-only; share by re-running the
  skill from the Figma URL.

### 8. Validate generated Tailwind classes & component props

After writing `src/App.tsx` (and any other generated `.tsx`), run the PDS
validator. It checks **two** classes of silent failures:

1. **Tailwind tokens that look right but aren't defined** in
   `@porsche-design-system/components-react/tailwindcss/index.css` — Tailwind 4
   emits no CSS and no error for these.
2. **PDS component string-prop values not in the typed enum** — e.g.
   `<PHeading size="2x-small">` (correct is `xx-small`/`2xs` depending on the
   prop), `<PIcon name="recycling">` (no such icon),
   `<PHeading tag="p">` (must be `h1`–`h6`).

It also enforces asset-completion gates so a skipped Step 5b/5b-ii can't ship
silently:

3. **Tile image/no-fill rule** — every `PLinkTile` / `PButtonTile` /
   `PLinkTileProduct` must have either an `<img>` child or an explicit
   `{/* no-fill: … */}` marker.
4. **Asset wiring rule** — no raw `figma.com/api/mcp/asset/…` URL may remain in
   source (it expires in 7 days → download was skipped), and every
   `./assets/figma/…` import must resolve to a file that exists on disk (no
   dangling imports).
5. **No persistent candidate dump rule** — `src/assets/figma/_raw` must not
  exist after generation (unless explicit debug mode is enabled via
  `PUX_DEBUG_RAW_ASSETS=1`).

Optional strict mode:
- `PUX_STRICT_ASSET_MAPPING=1 npm run validate:pds` enforces a 1:1 parity check
  between imported `./assets/figma/*` files and files present in
  `src/assets/figma/` (excluding `_raw` and dotfiles).

The prop check uses a meta whitelist built at runtime from the installed
`@porsche-design-system/components-react` typings — always in sync with the
locked version. Runtime overhead is ~50 ms.

```bash
cd "prototypes/<slug>"
# only works after `npm install` has run once (validator reads node_modules)
npm run validate:pds
```

If `node_modules` doesn't exist yet, **skip silently** and remind the user to
run it after `npm install`. If it runs and reports issues, fix them
immediately (the report includes suggestions). Common rewrites:

| Wrong (silently broken) | Correct |
|---|---|
| `bg-base` | `bg-canvas` |
| `bg-notification-error` | `bg-error-frosted` |
| `text-utility-xs` | `prose-text-xs` |
| `text-prose-text-md` | `prose-text-md` (drop leading `text-`) |
| `text-base` (as a color) | use a real color: `text-primary` etc. |

### 9. Install dependencies, validate, and start dev server

After writing `App.tsx`, run these steps automatically — do not wait for the
user to ask.

> **CRITICAL — terminal tool `cd` is unreliable for ALL steps 9a–9c.**
> The `run_in_terminal` tool frequently **silently ignores** a `cd` prefix and
> runs from the previous cwd (e.g. the VS Code workspace root or the last
> opened folder). This causes `npm error ENOENT … package.json` because `npm`
> runs from the wrong directory.
>
> **Mandatory rule for every npm command in Step 9:** use `pushd <ABSOLUTE_PATH>`
> (not `cd`) for every command. Never rely on the shell's cwd being correct.
> If you see any `npm error ENOENT` or `npm error Missing script`, the command
> ran from the wrong directory — do not retry the same form, switch to `pushd`.

**Step 9a — install:**
```bash
pushd "<ABSOLUTE_PATH_TO_PROTOTYPE>" && npm install
```
(~30–120 s on first run; subsequent runs are near-instant thanks to npm cache)

**Step 9b — validate:**
```bash
pushd "<ABSOLUTE_PATH_TO_PROTOTYPE>" && npm run validate:pds
```
Fix any reported issues before starting the server (see Step 8 for common
rewrites). If the validator itself fails (missing binary), skip and note it.

**Step 9c — start dev server (async / background):**
```bash
pushd "<ABSOLUTE_PATH_TO_PROTOTYPE>" && npm run dev
```
> Always supply the **absolute path** of the prototype folder — not a relative path.
> Example: `pushd <WORKSPACE_ROOT>/prototypes/<slug> && npm run dev`

Use `mode=async` so the terminal does not block. Wait for the initial output, then
read stdout to extract the local URL (typically `http://localhost:5173/` or the
next free port Vite prints).

**Step 9d — report the URL in chat:**

```
✓ Prototyp läuft unter [http://localhost:5173](http://localhost:5173)
Ordner: prototypes/<slug>/
```

If the port is in use, Vite picks the next free one — read the actual printed
URL, do not hard-code 5173.

## Phase 2 (not yet implemented — do not promise)

- Multi-page prototypes from Figma prototype connections (flows)
- Route generation via `react-router`
- Auto-screenshot diff vs. Figma frame

If the user asks for any of the above, scaffold what we can (one page per flow
start) and note the missing pieces in the prototype README.

---

# Part 2 — Reference

Lookup tables. Consult the relevant section when a procedure step points here.

## Reference: PDS Tailwind utility cheat-sheet (verified from 4.2.0-rc.2 docs)

Only these class families come from PDS — anything else is plain Tailwind 4
or an invalid token. **Do not invent new ones.**

| Family | Valid values | Notes |
|---|---|---|
| Background | `bg-canvas`, `bg-surface`, `bg-frosted`, `bg-frosted-soft`, `bg-frosted-strong`, `bg-backdrop`, `bg-fade-to-b`, `bg-fade-to-t`, `bg-{success,warning,error,info}-frosted`, `bg-{success,warning,error,info}-frosted-soft` | No solid `bg-primary`/`bg-error` — status colors only come as frosted variants. Page bg is `bg-canvas`, cards/panels use `bg-surface`. `bg-fade-to-b/t` is for header/footer overlays. |
| Text color | `text-primary`, `text-contrast-higher`, `text-contrast-high`, `text-contrast-medium`, `text-success`, `text-warning`, `text-error`, `text-info` | **No `text-contrast-low`** — text only goes down to `medium`. (Borders go lower.) |
| Border color | `border-primary`, `border-contrast-{higher,high,medium,low,lower}`, `border-{success,warning,error,info}-{medium,low}` | |
| Typography | `prose-display-*`, `prose-heading-*`, `prose-text-*` with sizes `5xl, 4xl, 3xl, 2xl, xl, lg, md, sm, xs, 2xs` | **Use as standalone utilities** (`prose-text-md`), NOT `text-prose-text-md`. No `text-utility-*` family exists. |
| Spacing fluid | `{m,p,w,h,gap}-fluid-{xs,sm,md,lg,xl,2xl}` | For vertical spacing + intrinsic sizing. |
| Spacing static | `{m,p,w,h,gap}-static-{2xs,xs,sm,md,lg,xl,2xl}` | For horizontal spacing. |
| Color scheme | `scheme-light`, `scheme-dark`, `scheme-light-dark` | Applied on `<html>` (boilerplate ships `scheme-light-dark`). |

### Common token mistakes to avoid (caught May 2026)

- ❌ `bg-base` → ✅ `bg-canvas`
- ❌ `text-contrast-low` → ✅ `text-contrast-medium` (text only goes to medium)
- ❌ `bg-notification-error` → ✅ `bg-error-frosted` (no solid status bg)
- ❌ `text-utility-sm` / `text-utility-xxs` → ✅ `prose-text-sm` / `prose-text-2xs`
- ❌ `text-prose-text-md` → ✅ `prose-text-md` (no `text-` prefix)
- ❌ `text-base` for color (it's a font-size in Tailwind) → use a real color token

## Reference: Porsche Grid (use for ALL page layouts)

PDS ships a custom CSS Grid layout system via the `grid-template` utility and
predefined area classes. **Always use this for page-level layout** — never
substitute with `max-w-[…] mx-auto px-…` or arbitrary `grid-cols-[…]`.

### Areas (use as direct children of a `grid-template`)

| Area | Columns (≥760px / <760px) | When to use |
|---|---|---|
| `col-narrow` | 8 / 6 | Narrow body content (articles, reading-width forms) |
| `col-basic` | 12 / 6 | **Default for productive content** — body copy, graphics, descriptive imagery |
| `col-extended` | 14 / 6 | Clusters of cards, hero copy, footer content |
| `col-wide` | 16 / 6 | Productive apps with sidebar; navigation header |
| `col-full` | full viewport | Immersive media, full-bleed backgrounds, hero video |

### Subdivisions (only inside a subgridded `col-basic`)

- `col-span-one-half`, `col-span-one-third`, `col-span-two-thirds`
- `one-half` also works in `col-narrow|extended|wide`; thirds are `basic`-only.

### Canonical structure (from official landing-page template)

```tsx
<html class="scheme-light bg-canvas">
  <body>
    {/* one grid-template per top-level region — header, main, footer */}
    <header class="grid-template …">
      <div class="col-wide …">…nav…</div>
    </header>

    <main class="grid-template gap-y-0">
      {/* Sections own their own py-* — main has NO row gap, otherwise
          the canvas color shows through between adjacent full-bleed sections */}
      <section class="col-full bg-surface scheme-dark py-fluid-xl">…</section>

      {/* Cards inside basic, split one-half | one-half */}
      <section class="col-full grid grid-cols-subgrid …">
        <div class="col-basic grid grid-cols-subgrid gap-y-fluid-md">
          <Card class="col-span-full sm:col-span-one-half" />
          <Card class="col-span-full sm:col-span-one-half" />
        </div>
      </section>

      {/* Plain content body */}
      <section class="col-basic grid grid-cols-subgrid gap-y-fluid-xl">…</section>
    </main>

    <footer class="grid-template py-fluid-lg bg-surface">
      <nav class="col-extended grid xs:grid-cols-2 md:grid-cols-3 gap-fluid-md">…</nav>
    </footer>
  </body>
</html>
```

### Figma → Grid translation (deterministic, do not improvise)

The Figma MCP output already encodes the grid intent via CSS custom
properties. Map them mechanically — do **not** guess:

| Figma raw class on a `<div>` | Translation |
|---|---|
| `w-full` + `bg-[var(--background/...)]` | The div is a **full-bleed section background**. Outer wrapper = `col-full bg-{token}`. |
| `px-[var(--grid/offsets/grid-basic-offset,...)]` | Content is constrained to **`col-basic`**. Wrap content in a nested `<div class="grid-template"><div class="col-basic grid grid-cols-subgrid …">…</div></div>`. |
| `px-[var(--grid/offsets/grid-wide-offset,...)]` | Content is constrained to **`col-wide`** (same nesting pattern). |
| `px-[var(--grid/offsets/grid-extended-offset,...)]` | Content is constrained to **`col-extended`**. |
| `px-[var(--grid/offsets/grid-narrow-offset,...)]` | Content is constrained to **`col-narrow`**. |
| `py-[var(--fluid/spacing-fluid-{size},...)]` | Vertical padding on the outer `col-full` wrapper: `py-fluid-{size}`. |
| `gap-[var(--fluid/spacing-fluid-{size},...)]` | `gap-fluid-{size}` on the grid. |
| `gap-[var(--gap/gap-{size},...)]` | `gap-static-{size}` on the flex/grid. |
| `h-[800px]` + `w-full` + `bg-... / <img>` | **Hero** = `col-full relative h-[...] overflow-hidden` with absolutely positioned bg/img. |
| Nothing of the above on a section | Plain content section: pick `col-basic` (default) and skip the full-bleed wrapper. |

**Combined pattern — the canonical full-bleed-with-constrained-content section:**

```tsx
{/* Figma: <div className="bg-[var(--background/pds-surface,...)] w-full
                            px-[var(--grid/offsets/grid-basic-offset,...)]
                            py-[var(--fluid/spacing-fluid-x-large,...)]"> */}
<section className="col-full bg-surface py-fluid-xl">
  <div className="grid-template">
    <div className="col-basic grid grid-cols-subgrid gap-fluid-md">
      {/* tiles, cards, copy go here */}
    </div>
  </div>
</section>
```

**Common mistake (caught May 2026):** putting `bg-surface` directly on a
`col-basic` section. The background only paints the narrow column area, the
canvas color shows left/right. Fix: move `bg-*` to a `col-full` wrapper.

### Scheme decision table (for Step 2c)

When `get_variable_defs` is called for a section, map the returned tokens:

| `Foreground/pds-primary` | `Background/pds-canvas` / `surface` | Section className |
|---|---|---|
| `#fbfcff` (light text) | `#19191a` (canvas) | `scheme-dark bg-canvas` |
| `#fbfcff` (light text) | `#010205` (surface) | `scheme-dark bg-surface` |
| `#010205` (dark text)  | `#ffffff` (canvas) | `scheme-light bg-canvas` |
| `#010205` (dark text)  | other light surface | `scheme-light bg-{matching token}` |

**Never infer the scheme from a screenshot.** A dark hero image inside a light
section is still a light section — only the image is dark.

**Common mistake (caught May 2026):** translated three Figma sections
(Teaser/Carousel/Content Blocks) as `scheme-dark bg-surface` because the
screenshot looked dark. The Carousel and Content Blocks were actually
`scheme-light bg-canvas` per Figma tokens. Always trust the tokens.

### Grid rules

1. **`grid-template` is applied ONCE per top-level region** (`<header>`,
   `<main>`, `<footer>`) — it cannot be nested, **except** inside a `col-full`
   full-bleed wrapper (then a single nested `grid-template` is OK to re-anchor
   constrained content).
2. **Every direct child of a `grid-template` must use a `col-*` area class.**
3. To place content INSIDE an area, give the area `grid grid-cols-subgrid` and
   then use `col-span-*` on children (this inherits the parent column tracks).
4. For full-bleed backgrounds with content centered, follow the *Figma → Grid
   translation* table above (`col-full` wrapper + nested `grid-template` +
   `col-{basic|wide|extended}` inner).
5. **Do NOT use `max-w-[…] mx-auto px-…`** for page containers. The grid already
   handles safe zones and fluid breakpoints from 320px to 2560px.
6. **No row gap on `<main>`.** The `grid-template` utility sets
   `gap: --spacing-fluid-md` for BOTH columns and rows. Between adjacent
   `col-full` sections this paints a row gap in canvas color. Always set
   `gap-y-0` on the wrapping `grid-template` (`<main>`, `<header>`). Each
   section provides its own `py-fluid-*`.

### React conversion notes

- React JSX uses `className`, not `class`.
- Tailwind responsive prefixes work identically (`sm:`, `md:`, `xs:`).
- PDS responsive object syntax (`hide-label="{base: true, s: false}"`) is a
  Web Component prop, not a Tailwind class — write it as
  `hideLabel={{ base: true, s: false }}` in React.

## Reference: Preflight criteria (for Step 0)

Before generating code, verify the frame is implementation-ready.

### Pass criteria

- Structural containers use auto-layout or grid mode (no free-positioned section skeleton).
- Layout spacing uses parent `gap`/`padding` with variables/tokens.
- No spacer rectangles used only for spacing.
- Sizing is intentional on key nodes: `hug`, `fill container`, or `fixed`.
- Section/layer names are semantic (`Header`, `Hero / Title`, `CTA Row`, `ProductImage`, `CTA_Button`).
- No generic structural names (`Frame 247`, `Rectangle 3`, `Text 1`) on production frames.
- Breakpoints are separated and named when responsive behavior matters (`Home / Desktop / 1440`, `... / Tablet / 768`, `... / Mobile / 375`).
- Source-of-truth frames/components are explicitly marked (`(Spec)` or `(Source)`).

### Fail handling

If preflight fails, do not jump straight into code generation.

1. Report blocking hygiene issues first.
2. Propose a cleanup plan (auto-layout normalization, naming cleanup, spacing tokenization).
3. Generate code only after the frame passes or after the user explicitly accepts lower-fidelity output.

### Why this matters

Auto-layout and grid are parsed as layout intent by Figma MCP. Semantic names,
tokenized spacing, and explicit sizing reduce hallucinated structure and produce
cleaner React + Tailwind output.

## Reference: Page chrome patterns (header & footer)

Use these as **structural scaffolds only** — they show the correct PDS grid
wiring, icon-button arrangement, and class tokens. They come from
`porsche-design-system/examples` patterns (`src/{header,footer}`) aligned with PDS RC2.

> **These are NOT content templates.** Every concrete value in the snippets
> below — labels (`Search`, `Favorites`, `Shopping Cart`…), `href="#"`,
> `value="de"`, region/category names, info-bar text — is a **placeholder**.
> Per Rule 8 (*No invented chrome*) and the Fidelity Contract:
> - Only include a header/footer at all **if the Figma frame contains one**.
> - Replace every label, icon, link, and text with the value from the matching
>   Figma layer's CC snippet.
> - **Drop** any icon-button or row that the Figma chrome does not have — do not
>   keep `Search`/`User`/`Favorites` just because the scaffold lists them.
> - Keep only the grid structure and class tokens verbatim — never the copy.

### Header — marketing / landing (transparent over hero)

Use when the page opens with a full-bleed hero video/image and the nav floats
over it. The fade-to-bottom backdrop keeps text legible.

```tsx
<header className="z-1 grid-template absolute inset-x-0 before:absolute before:inset-[0_0_-60px_0] before:-z-1 before:pointer-events-none before:bg-fade-to-b">
  <div className="col-wide grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-fluid-md items-center min-h-[80px]">
    <div className="flex flex-wrap gap-static-md items-center justify-start">
      <nav aria-label="Main">
        <PButtonPure className="scheme-dark p-static-xs -m-static-xs" type="button" icon="menu-lines" hideLabel={{ base: true, s: false }}>
          Menu
        </PButtonPure>
        {/* <PDrilldown> goes here if needed */}
      </nav>
    </div>
    <PCrest className="scheme-dark sm:hidden" href="#" />
    <PWordmark className="scheme-dark max-sm:hidden" href="#" />
    <div className="scheme-dark flex flex-wrap gap-static-md items-center justify-end">
      <PButtonPure className="p-static-xs -m-static-xs" title="Search" icon="search" hideLabel>Search</PButtonPure>
      <PButtonPure className="p-static-xs -m-static-xs" title="User" icon="user" hideLabel>User</PButtonPure>
    </div>
  </div>
</header>
```

### Header — shop (3 rows: info bar / nav / categories)

Use for product detail / category / checkout pages where promo info, cart
access and a category tab-bar are all needed.

```tsx
<header className="grid-template gap-y-0">
  {/* Row 1: optional info bar */}
  <div className="scheme-dark col-full flex justify-center py-static-xs px-static-md bg-surface">
    <PText size="xs">All sizes shown for Porsche Lifestyle products are EU sizes</PText>
  </div>

  {/* Row 2: main nav */}
  <div className="col-wide grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-fluid-md items-center min-h-[80px]">
    <div className="flex flex-wrap gap-static-md items-center justify-start">
      <nav aria-label="Main">
        <PButtonPure className="p-static-xs -m-static-xs" type="button" icon="menu-lines" hideLabel={{ base: true, s: false }}>
          Menu
        </PButtonPure>
      </nav>
      <PButtonPure className="p-static-xs -m-static-xs sm:hidden" title="Search" icon="search" hideLabel>Search</PButtonPure>
    </div>
    <PCrest className="sm:hidden" href="#" />
    <PWordmark className="max-sm:hidden" href="#" />
    <div className="flex flex-wrap gap-static-md items-center justify-end">
      <PButtonPure className="p-static-xs -m-static-xs max-sm:hidden" title="Search" icon="search" hideLabel>Search</PButtonPure>
      <PLinkPure className="p-static-xs -m-static-xs max-sm:hidden" title="Favorites" href="#" icon="heart" hideLabel>Favorites</PLinkPure>
      <PLinkPure className="p-static-xs -m-static-xs" title="Shopping Cart" href="#" icon="shopping-cart" hideLabel>Shopping Cart</PLinkPure>
      <PButtonPure className="p-static-xs -m-static-xs" title="User" icon="user" hideLabel>User</PButtonPure>
    </div>
  </div>

  {/* Row 3: categories tab bar */}
  <div className="col-full flex justify-center p-static-md border-t-thin border-contrast-low">
    <PTabsBar compact>
      <a href="#">All categories</a>
      <PDivider className="mx-static-md" direction="vertical" />
      <a href="#">Timepieces</a>
      <a href="#">Bags & Luggage</a>
      <a href="#">Heritage</a>
    </PTabsBar>
  </div>
</header>
```

### Footer (single canonical pattern)

```tsx
<footer className="grid-template py-fluid-lg bg-surface">
  {/* Country selector */}
  <form className="col-extended grid xs:grid-cols-2 md:grid-cols-3 gap-fluid-md" aria-label="Change your delivery country">
    <PSelect name="region" value="de" label="Change your delivery country">
      {/* <p-optgroup> + <p-select-option> with <p-flag> */}
    </PSelect>
  </form>

  {/* Link columns */}
  <nav className="col-extended grid xs:grid-cols-2 md:grid-cols-3 gap-x-fluid-md gap-y-fluid-lg mt-fluid-sm mb-fluid-lg" aria-label="Footer">
    {COLUMNS.map((col) => (
      <div key={col.title} className="flex flex-col gap-fluid-sm">
        <PHeading tag="h3" size="2xs" color="contrast-medium">{col.title}</PHeading>
        <ul className="grid gap-fluid-sm">
          {col.links.map((l) => (
            <li key={l.href}><PLinkPure icon="none"><a href={l.href}>{l.label}</a></PLinkPure></li>
          ))}
        </ul>
      </div>
    ))}
  </nav>

  {/* Social + payment row */}
  <article className="col-extended grid sm:grid-cols-[auto_minmax(0,1fr)] items-center gap-x-fluid-lg gap-y-static-lg" aria-label="Social media and payment service providers">
    <div className="flex gap-fluid-md">
      {/* PLinkPure with icon="logo-instagram" | "logo-facebook" | "logo-x" | "logo-pinterest" | "logo-youtube" */}
    </div>
    <div className="flex gap-fluid-xs">
      {/* payment provider <img> with focus-visible:outline outline-focus outline-offset-2 rounded-sm */}
    </div>
  </article>

  {/* Optional disclaimer paragraphs */}
  <article className="col-extended grid gap-fluid-md mt-fluid-md" aria-label="Disclaimer">
    <PText size="2xs" color="contrast-medium">…WLTP / CO₂ / DSA copy…</PText>
  </article>

  {/* Bottom row */}
  <div className="col-extended grid gap-fluid-md justify-items-center mt-fluid-md">
    <PWordmark />
    <PText size="2xs" color="contrast-medium">© 2026 Porsche Sales and Marketplace, Inc.</PText>
    <ul className="flex flex-wrap justify-center gap-fluid-md">
      <li><PLinkPure icon="none" size="xs" underline><a href="#">Legal notice</a></PLinkPure></li>
      <li><PLinkPure icon="none" size="xs" underline><a href="#">Privacy notice</a></PLinkPure></li>
      <li><PLinkPure icon="none" size="xs" underline><a href="#">Accessibility Statement</a></PLinkPure></li>
    </ul>
  </div>
</footer>
```

### Pattern selection rules

| Page type | Header | Footer |
|---|---|---|
| Landing / marketing / campaign | marketing (transparent, scheme-dark over hero) | full footer |
| Product detail / category / cart / checkout | shop (3 rows, with categories) | full footer or trimmed bottom row only |
| Internal app / admin (with `<PCanvas>`) | **none** — `PCanvas` provides its own chrome | none |
| Single-page tool / dashboard | use `pds-tool` skill, not this one | — |

## Reference: Master templates (USE FIRST)

Two ready-made template components are vendored under `template/src/templates/`
and copied into every new prototype. **Always use one of these as the page
shell** instead of hand-rolling header/footer/grid wiring. The Tailwind classes,
slots, brand marks, scheme handling and Porsche-Grid placement are already correct.

> **Prop *values* in the examples below are illustrative** (`'search'`,
> `'Free shipping over €100'`, `'Sneakers'`, `'Customer overview'` …). They show
> the prop *shape*, not content to copy. Pass only the actions/announcement/
> submenu/title that the Figma frame actually shows — omit the prop entirely if
> the frame's chrome doesn't include it. Never add chrome actions Figma lacks.

```tsx
import { LandingPage, AdminPanel } from './templates'
```

### Decision tree

1. Figma frame contains `<PCanvas>` (sidebar + header app shell) → **`<AdminPanel>`**
2. Full-bleed hero with image / video behind the header → **`<LandingPage headerVariant="simple" header={{ variant: 'overlay' }}>`** (transparent, sits over hero in `scheme-dark`)
3. Shop / category / product / cart / checkout (announcement bar + categories) → **`<LandingPage headerVariant="with-submenu">`**
4. Everything else (marketing, content, detail pages without overlay hero) → **`<LandingPage headerVariant="simple">`** (default `variant="solid"`)

### `LandingPage` — usage

```tsx
// 1. Simple overlay header (hero pages — MUST be paired with a full-bleed dark hero as first section)
<LandingPage headerVariant="simple" header={{ variant: 'overlay' }}>
  <section className="col-full scheme-dark relative h-[800px]">{/* hero with bg image */}</section>
  <section className="col-basic grid grid-cols-subgrid">{/* content */}</section>
</LandingPage>

// 2. Simple solid header (default — most marketing / content pages)
<LandingPage
  headerVariant="simple"
  header={{ actions: ['search', 'user'] }}
>
  …
</LandingPage>

// 3. Shop header with announcement + categories
<LandingPage
  headerVariant="with-submenu"
  header={{
    announcement: 'Free shipping over €100',
    actions: ['search', 'favorites', 'cart', 'user'],
    submenu: [
      { label: 'Sneakers', current: true },
      { label: 'Bags & Luggage' },
      { label: 'Sale' },
    ],
  }}
>
  …
</LandingPage>
```

- `footer` defaults to `<FooterFull>` with PDS legal links. Pass `footer="none"` to skip, or a `FooterFullProps` object to customise.
- `header.brandMark`: `'auto'` (PCrest on mobile, PWordmark from `sm`), `'wordmark'`, or `'crest'`.
- `header.actions`: any combination of `'search' | 'favorites' | 'cart' | 'user'`.
- For navigation, pass `header.menuSlot={<YourPMenu/>}` (rendered in the centre zone).

### `AdminPanel` — usage

```tsx
<AdminPanel
  title="Customer overview"
  sidebar={<PFlyoutMultilevel>…</PFlyoutMultilevel>}
  topRight={<PButtonGroup>…</PButtonGroup>}
>
  {/* page body — placed inside PCanvas main slot */}
</AdminPanel>
```

`AdminPanel` wraps `<PCanvas>` with the title in `slot="header-start"`, optional
`topRight` in `slot="header-end"`, and `sidebar` in `slot="sidebar-start"`. Do
**not** combine with `<LandingPage>` or render your own header — PCanvas owns the chrome.

### What goes in `children`

Use the Porsche Grid section above. Every direct child of `<LandingPage>` should
be a `<section>` (or fragment of sections) whose outer class is one of the area
utilities — `col-full`, `col-extended`, `col-wide`, `col-basic`, `col-narrow` —
optionally with `grid grid-cols-subgrid` to inherit the parent grid columns for
nested layouts.

### Don't

- Don't import `HeaderSimple` / `HeaderWithSubmenu` / `FooterFull` directly
  unless you're composing a new template — they're internal parts.
- Don't add `max-w-…`, `mx-auto` or custom `px-…` wrappers around `LandingPage`.
- Don't replace the templates with a hand-written `<header>`/`<main>`/`<footer>`
  for a "quick" version — the templates already are the quick version.

## Reference: Skill repo layout

```
├── install.sh
├── README.md
├── template/                 ← vendored boilerplate (DO NOT modify per-prototype)
│   ├── package.json
│   ├── vite.config.ts
│   ├── index.html
│   └── src/
│       ├── App.tsx           ← demo content; gets REPLACED per prototype
│       ├── main.tsx          ← keep as-is (wraps in PorscheDesignSystemProvider + ColorSchemeProvider)
│       ├── index.css
│       ├── templates/        ← LandingPage + AdminPanel master templates (DO NOT modify per-prototype)
│       │   ├── index.ts
│       │   ├── LandingPage.tsx
│       │   ├── AdminPanel.tsx
│       │   └── parts/        ← HeaderSimple, HeaderWithSubmenu, FooterFull
│       ├── providers/ColorSchemeProvider.tsx
│       ├── hooks/useColorScheme.ts
│       ├── models/colorScheme.ts
│       └── components/common/ColorSchemeSelect.tsx
├── prototypes/<slug>/        ← generated output, one folder per prototype
└── skills/porsche-ux/porsche-ux-prototype/SKILL.md  ← this file
```

The skill repo lives at the workspace root. Resolve `<SKILL_ROOT>` as the
absolute path to it. Generated output goes into `<SKILL_ROOT>/prototypes/<slug>/`.
