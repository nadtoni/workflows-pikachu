# HTML Snippet Library

Ready-to-paste HTML blocks for use inside slide Markdown.  
All classes are built into the presentation CSS — no extra setup needed.

> **Component API reference**: For all valid prop values, check `.pds-cache/components.json` (auto-generated from the installed PDS version). Never guess prop names or values — always verify against this file.

---

## Slide Variants

Use `<!-- class: NAME -->` at the top of a slide.

| Class | Effect |
|---|---|
| `slide--cover` | Centred layout (title slide) |
| `slide--dark` | Forces dark background regardless of theme |
| `slide--accent` | Porsche Red gradient background |

---

## Grids

Place cards or other content in a responsive grid.

### 2 columns
```html
<div class="grid-2">
  <div class="card">Left content</div>
  <div class="card">Right content</div>
</div>
```

### 3 columns
```html
<div class="grid-3">
  <div class="card">Item A</div>
  <div class="card">Item B</div>
  <div class="card">Item C</div>
</div>
```

### 4 columns (KPI row)
```html
<div class="grid-4">
  <div class="card-frosted stat">
    <span class="stat-value">142</span>
    <span class="stat-label">Open Issues</span>
  </div>
  <div class="card-frosted stat">
    <span class="stat-value">94%</span>
    <span class="stat-label">Coverage</span>
  </div>
  <div class="card-frosted stat">
    <span class="stat-value">12ms</span>
    <span class="stat-label">Avg. Response</span>
  </div>
  <div class="card-frosted stat">
    <span class="stat-value">3.8k</span>
    <span class="stat-label">Weekly Users</span>
  </div>
</div>
```

---

## Cards

### Solid surface card
```html
<div class="card">
  <p-heading size="medium">Title</p-heading>
  <p-text>Description text goes here.</p-text>
</div>
```

### Frosted glass card
```html
<div class="card-frosted">
  <p-heading size="medium">Title</p-heading>
  <p-text>Glassmorphism card with backdrop blur.</p-text>
</div>
```

---

## Stats / KPIs

```html
<div class="stat">
  <span class="stat-value">42%</span>
  <span class="stat-delta stat-delta--up">↑ 8pp vs. Q3</span>
  <span class="stat-label">Adoption Rate</span>
</div>
```

`stat-delta--up` = green · `stat-delta--down` = red

---

## Badges

```html
<span class="badge">Default</span>
<span class="badge badge--success">Done</span>
<span class="badge badge--warning">In Progress</span>
<span class="badge badge--error">Blocked</span>
<span class="badge badge--info">New</span>
```

---

## Porsche Red Divider

A short decorative line, useful between a heading and body text.

```html
<div class="slide-divider"></div>
```

---

## PDS Tags

Status labels via `<p-tag>`. Use the `variant` prop for semantic colors.

```html
<p-tag>Default</p-tag>
<p-tag variant="info">Info</p-tag>
<p-tag variant="success">Success</p-tag>
<p-tag variant="warning">Warning</p-tag>
<p-tag variant="error">Error</p-tag>
```

Valid `variant` values: `primary` (default), `secondary`, `info`, `warning`, `success`, `error`.

With icon:

```html
<p-tag variant="success" icon="check">Approved</p-tag>
<p-tag variant="error" icon="close">Rejected</p-tag>
```

**IMPORTANT:** Do NOT use `color` prop — it does not exist on `<p-tag>` in PDS v4. Always use `variant`.

---

## PDS Icons

Inline SVG icons via `<p-icon>`. Name must be a valid PDS icon name.

```html
<p-icon name="arrow-head-right" size="medium"></p-icon>
<p-icon name="check" color="success" size="medium"></p-icon>
<p-icon name="close" color="error" size="medium"></p-icon>
<p-icon name="information" color="info" size="medium"></p-icon>
<p-icon name="warning" color="warning" size="medium"></p-icon>
```

For **custom colors**, use `color="inherit"` and set the color on a parent element:

```html
<span style="color: mediumvioletred">
  <p-icon name="heart" color="inherit" size="medium"></p-icon>
</span>
```

Common icon names: `arrow-head-right`, `arrow-head-left`, `arrow-head-up`, `arrow-head-down`,
`check`, `close`, `plus`, `minus`, `edit`, `delete`, `search`, `filter`, `settings`,
`information`, `warning`, `question`, `star`, `heart`, `share`, `download`, `upload`,
`calendar`, `clock`, `user`, `group`, `phone`, `email`, `link`, `external`, `map`,
`car-perspective`, `charging`, `fuel`, `horn`.

---

## Animations

### Fade-in on slide entry

```html
<p-heading size="xx-large" class="anim-fade-up">Big Heading</p-heading>
```

### Staggered children (cards, list items)

Wrap the container — every direct child animates in sequence with 80ms stagger.

```html
<div class="grid-3 anim-stagger">
  <div class="card">A</div>
  <div class="card">B</div>
  <div class="card">C</div>
</div>
```

> Animations replay every time the slide scrolls into view.

---

## Combining Everything — Example Slide

```markdown
<!-- class: slide--dark -->

# Highlights Q1 2025

<div class="slide-divider"></div>

<div class="grid-4 anim-stagger">
  <div class="card-frosted stat">
    <span class="stat-value">142</span>
    <span class="stat-delta stat-delta--up">↑ 12</span>
    <span class="stat-label">Components</span>
  </div>
  <div class="card-frosted stat">
    <span class="stat-value">94%</span>
    <span class="stat-delta stat-delta--up">↑ 3pp</span>
    <span class="stat-label">Coverage</span>
  </div>
  <div class="card-frosted stat">
    <span class="stat-value">3.8k</span>
    <span class="stat-delta stat-delta--down">↓ 200</span>
    <span class="stat-label">Weekly Users</span>
  </div>
  <div class="card-frosted stat">
    <span class="stat-value">12ms</span>
    <span class="stat-label">Avg. Response</span>
  </div>
</div>
```
