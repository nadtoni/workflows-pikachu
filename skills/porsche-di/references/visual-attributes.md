# Visual Attributes

Porsche DI's refreshed visual expression — modernized while strengthening brand identity. Delivered progressively through the design systems.

> These attributes define brand **direction** (the *why*). For the operational review checklist that enforces them with PDS v4 thresholds (grid, radius, ratios, elevation), see the `porsche-ux-design-review` skill.

---

## Layout

Interfaces combine two modes — always in rhythm, never one without the other:

| Mode | Character |
|---|---|
| **Full-bleed hero stage** | Immersive, spacious, singular focus |
| **Mosaic grid** | Structured, dense, each element properly staged |

Crisp negative space between elements creates precision and tension. The transition between spacious stages and functional mosaic layouts is itself a design tool.

For complex interactions: use **layered, nested interface patterns** — makes UI behavior traceable and transparent.

**Canonical Layout Patterns (from wireframes)**

**Pattern 1 — Hero + Stacked Content (card-contained)**
```
┌─────────────────┬──────────────────────┐
│                 │  Title               │
│   HERO IMAGE    │  Subtitle            │
│   (car/product) │                [CTA] │
│                 ├──────────────────────┤
│                 │                      │
│                 │                      │
│                 │                [CTA] │
└─────────────────┴──────────────────────┘
```
Hero occupies left ~50%. Right side: two stacked content cards, each with its own CTA. Rounded corners, subtle border. Use for product overview + action contexts.

---

**Pattern 2 — Hero + Open Mosaic (edge-to-edge)**
```
┌──────────────────┬──────────┬──────────┐
│                  │          │          │
│   HERO           │  CELL A  │  CELL B  │
│   (car/product)  ├──────────┴──────────┤
│                  │                     │
│                  │     WIDE CELL       │
└──────────────────┴─────────────────────┘
```
No card containers — full-bleed, edge-to-edge grid. Hero left ~50%, right side: 2-column mosaic top + full-width cell below. More structural, less intimate. Use for exploratory or catalogue contexts.

---

**Pattern 3 — Full-Bleed Hero + Bottom Mosaic Strip**
```
┌─────────────────────────────────────────┐
│  [label]                   [btn] [btn]  │
│                                         │
│           FULL-BLEED HERO               │
│           (car centered)                │
│                                         │
├──────────────┬──────────────────────────┤
│   CELL A     │   CELL B                 │
└──────────────┴──────────────────────────┘
```
Hero takes full width, maximum stage. Minimal top bar (wordmark/label left, 1-2 actions right). Bottom strip: 2-column mosaic anchors the content below. Use for hero landing moments, product reveals.

---

**Rules**
- ✅ Alternate between hero stages and mosaic — rhythm is intentional
- ✅ Negative space is active, not leftover
- ✅ Hierarchy is always clear within the mosaic
- ✅ CTAs anchored to their content card, bottom-right
- ✅ Hero always left or center — never right-aligned
- ❌ Flat, uniform grids with no focal points
- ❌ Everything hero-sized — contrast is required
- ❌ Floating CTAs detached from their content

---

## Colors

Soft grey scale is the foundation — it sets the stage for impactful content.

**Color serves two purposes:**
1. Visual clarity and structure for orientation
2. Strong contrasts that create tension

**Rules**
- ✅ Grey scale as the standard UI palette
- ✅ Additional colors only for themed moments (see Tailor Moments)
- ✅ All UI colors defined in the respective design systems (PDS)
- ❌ Colorful UI as default
- ❌ Color used decoratively rather than structurally

---

## Themes

Used only in **selected, highly immersive product experiences** (e.g. in-car interface, product launches, customization features).

- Themes are always **curated and distributed by Porsche** — customization within a defined range
- **Neutral (light/dark) is always the standard baseline**
- Colorful themes = special purpose only, never default

---

## Typography

**Porsche Next — no exceptions, across all interfaces.**

Typography is a core brand asset, not just a utility. Used confidently with strong size contrasts to steer tension, reading flow and structure.

| Context | Rule |
|---|---|
| Web headlines | 2XL as standard (per web design system) |
| Weight standard | Porsche Next Regular |
| Graphical use | Type as visual element — allowed and encouraged in emotion-driven moments |
| Expressive use | Iconic typeface used more expressively in emotion-driven, selected moments |

**Rules**
- ✅ Strong size contrast between hierarchy levels
- ✅ Typography as a graphical element where appropriate
- ❌ Mixed typefaces
- ❌ Flat type hierarchy — every level must be clearly distinct

---

## Materials

**Solid surfaces as standard** — clarity and precision above all.

**No physical material imitation** in interfaces — no faux metal textures, no leather, no skeuomorphic depth, no decorative glassmorphism.

Transparency and blur are **not** material imitation: the PDS **frosted glass** pattern is allowed when components overlay visually complex layers (artistic visuals, ambient images) and solid surfaces would interfere — as defined in the design systems. Apply it sparingly and per the PDS rules (heterogeneous background, parent-level only). For the enforcement checklist, see the `porsche-ux-design-review` skill, Rule 9 (Frosted Glass).

**Rules**
- ✅ Solid backgrounds as default
- ✅ PDS frosted glass only over complex imagery, sparingly (not decoratively)
- ❌ Glassmorphism as a default / decorative style
- ❌ Faux material textures (metal, leather, imitation glass) in UI components
- ❌ Overusing transparency — it degrades clarity and orientation

---

## Imagery

**Four visual content categories:**

| Category | Character |
|---|---|
| **Atmospheric** | Pure, calm product stagings in inspiring sceneries. Strong emotional mood. |
| **Lifestyle** | Editorial-style series telling human stories. Products in authentic environments of target groups. |
| **Artistic** | Artistic interpretations of products and features. Inspiring, beautiful, versatile. |
| **Technical** | Monochrome/reduced setups with extreme product focus. Close-ups, precision shots, high-detail renderings. |

**Usage rules**
- Ambient/artistic images used as backdrops or within highlight sections — **spacious, pure, staging the legend**
- Images fade into solid backgrounds through **soft gradients**
- In mosaic layout: images **framed and presented in cards** — applies to photos and monochromatic cards alike
- **Ambient content** (short animations, video loops) used as backdrop or within mosaic — creates vivid, immersive experience, emotional investment

**Rules**
- ✅ Full-bleed for hero moments
- ✅ Card-framed in mosaic contexts
- ✅ Ambient loops to add life without noise
- ✅ Soft gradient fade at image boundaries
- ❌ Images with hard cuts into solid UI
- ❌ Decorative imagery that doesn't contribute to the message
- ❌ Mixing content categories without intention
