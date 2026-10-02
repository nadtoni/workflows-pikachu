---
name: porsche-pds-html-presentation
description: "[Cross-phase] Generate standalone HTML presentations, dashboards, and reports using the Porsche Design System. Use when: any skill or task needs to produce a visual HTML output — dashboards, reports, slide decks, posters, or any structured presentation. Triggers include: 'HTML presentation', 'slide deck', 'dashboard', 'report', 'HTML Präsentation', 'Folien', 'Präsentation', 'Bericht'. Applicable in all UX phases (Discover, Ideation, Prototype & Test, Implement, Measure)."
---

# PDS HTML Presentation

Shared skill for generating standalone HTML files with the Porsche Design System (PDS).

## Quick Start

This skill covers two output types:

| Type | Use when |
|------|----------|
| **Slide deck** | Multi-slide presentation, step through with keyboard |
| **Dashboard / Report** | Scrollable single-page layout with charts |

### For slide decks → use the Slide Builder

1. Write content in `presentations/[name].md`
2. Run: `node skills/pds-html-presentation/build-slides.mjs presentations/[name].md`
3. Output: `presentations/[name].html` — open in browser

### For dashboards / reports → assemble HTML manually

1. Read the cached PDS partials from `skills/pds-html-presentation/.pds-cache/`:
   - `head.html` — `@font-face` declarations + font preloads + meta tags (inject into `<head>`)
   - `body.html` — PDS loader script (inject before closing `</body>`)
   - `global.css` — design tokens + base styles (inject into `<style>`)
2. Assemble HTML using the template below
3. Save to `presentations/[slug].html`
4. Open in browser

If `.pds-cache/` is missing, regenerate (run from `` root):
```bash
SKILL=skills/pds-html-presentation
node $SKILL/pds-partials.mjs --head > $SKILL/.pds-cache/head.html
node $SKILL/pds-partials.mjs --body > $SKILL/.pds-cache/body.html
node $SKILL/pds-partials.mjs --css  > $SKILL/.pds-cache/global.css
```

---

## Slide Builder (`build-slides.mjs`)

Located at `skills/pds-html-presentation/build-slides.mjs`.

### Run
```bash
# From porsche-ux/ root:
node skills/pds-html-presentation/build-slides.mjs presentations/my-deck/my-deck.md
# → outputs: presentations/my-deck/my-deck.html
```

### Markdown syntax

```markdown
<!-- class: slide--cover -->   ← optional CSS class for this slide
# Heading xx-large             → <p-heading size="xx-large">
## Heading large               → <p-heading size="large">
### Heading medium             → <p-heading size="medium">

Regular text becomes <p-text>. → <p-text>

- List items                   → <p-text-list> + <p-text-list-item>
- Like this

> „Quoted text here."         → styled blockquote card
> — Attribution               → attribution line (starts with — or -)

<div style="display: flex; gap: 1rem">
  <p-tag variant="success">Raw HTML blocks pass through untouched</p-tag>
  <p-tag variant="warning">Use for grids, cards, progress bars</p-tag>
</div>

---                            ← next slide
```

### Directives (`:::`)

Instead of writing raw HTML for layouts, use `:::` directives — they produce the same output but are simpler to write (and for AI to generate reliably).

Defined in `directives.mjs` — new directives = new entries in the registry object.

#### Syntax

```markdown
::: name key=value key="multi word"
child content (markdown or nested directives)
:::
```

For nesting, use more colons on the outer block:
```markdown
:::: grid cols=3
::: card
Content
:::
::::
```

#### Available directives

| Directive | Type | Description |
|-----------|------|-------------|
| `grid`    | block | CSS grid container. `cols=2\|3\|4`, optional `gap=1rem` |
| `card`    | block | Surface card. Optional `variant=frosted`. No side borders — always uses 24px border-radius and `--p-spacing-fluid-md` padding |
| `notification` | block | `<p-inline-notification>`. `state=info\|success\|warning\|error`, `heading="Title"`. Body text becomes description |
| `kpi`     | void  | Stat display. `value=42 label="Text"`, optional `delta=+12% color=success` |
| `tags`    | block | Tag row. Children: `tag variant=success \| Label` (one per line) |
| `icons`   | void  | Icon grid from components.json. `cols=20 size=small`, optional `filter="arrow"` |
| `quote`   | block | Styled blockquote. Last line starting with `—` = attribution. Optional `color=success` |
| `center`  | block | Centers children horizontally |
| `table`   | block | Pipe-separated table. First line = header, rest = rows |
| `animate` | block | Entry animation. `type=stagger\|fade-up` |

**void** = self-closing, no `:::` closer needed. **block** = requires closing `:::`.

#### Examples

```markdown
## KPI Dashboard

::: grid cols=4
::: kpi value=42 label="Issues" color=success
::: kpi value=89% label="Coverage" delta=+5%
::: kpi value=3 label="Blockers" color=error
::: kpi value=12 label="PRs Open"
:::

## Status Tags

::: tags
tag variant=success | Fertig
tag variant=warning | In Arbeit
tag variant=error   | Blockiert
:::

## All PDS Icons

::: icons cols=25 size=small
```

Props like `variant`, `color`, `size` are validated against `components.json` at build time.

### Folder structure

Each presentation lives in its own folder under `presentations/`:
```
presentations/
  my-deck/
    my-deck.md          ← source markdown
    my-deck.html        ← built output
    data-source.md      ← optional: raw data used to create the presentation
```

### Slide class variants

| Class | Layout |
|-------|--------|
| *(none)* | Default: vertically centered content |
| `slide--cover` | Centered, text-align center |

### Navigation (in browser)
- `←` `→` or `Space` — navigate slides
- `F` — fullscreen
- Footer left: Wordmark + page counter, theme toggle, font-size selector (100% / 150% / 200%)
- Footer right: prev/next navigation buttons

## HTML Template (for dashboards/reports)

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Title]</title>
  {{.pds-cache/head.html}}
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    {{.pds-cache/global.css}}

    /* Follow system light/dark preference */
    :root { color-scheme: light dark; }
    :not(:defined) { visibility: hidden; }

    .pds-layout { max-width: 1200px; margin: 0 auto; padding: 2rem; }

    /* Custom styles for this page */
  </style>
</head>
<body>
  <div class="pds-layout">
    <!-- Content -->
  </div>

  {{.pds-cache/body.html}}

  <script>
    // === PDS Color Resolver ===
    // PDS tokens use light-dark() which only resolves when applied to a DOM element.
    // This probe forces the browser to compute the actual rgb() value.
    const _probe = document.createElement('div');
    _probe.style.display = 'none';
    document.body.appendChild(_probe);
    function pds(token) {
      _probe.style.backgroundColor = 'var(' + token + ')';
      return getComputedStyle(_probe).backgroundColor;
    }

    // === Chart.js Setup ===
    Chart.defaults.font.family = '"Porsche Next", "Arial Narrow", Arial, sans-serif';

    function createCharts() {
      Object.values(Chart.instances).forEach(c => c.destroy());
      Chart.defaults.color = pds('--p-color-primary');

      // ... charts here ...
    }

    createCharts();

    // Re-create charts when system theme changes (light ↔ dark)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      requestAnimationFrame(() => createCharts());
    });
  </script>
</body>
</html>
```

### Template Rules

- `{{...}}` placeholders = read file content and paste inline
- Chart.js from CDN is the **only** allowed external JS dependency
- No Tailwind CSS (requires build step)
- All charts inside `createCharts()` so dark mode re-creation works
- Set `animation: false` on all charts for instant rendering

## PDS Color Tokens

All tokens use `light-dark()` — they auto-switch with `color-scheme: light dark`.

| Token | Use for |
|-------|---------|
| `--p-color-primary` | Text, headings, chart bars |
| `--p-color-canvas` | Page background |
| `--p-color-surface` | Card backgrounds |
| `--p-color-frosted` | Subtle borders |
| `--p-color-frosted-strong` | Stronger borders |
| `--p-color-contrast-medium` | Secondary text |
| `--p-color-contrast-lower` | Quote borders |
| `--p-color-success` | Positive / green |
| `--p-color-warning` | Caution / gold |
| `--p-color-error` | Negative / red |
| `--p-color-info` | Informational / blue |

**In CSS**: `color: var(--p-color-primary)` — works directly.

**In Chart.js**: Use the `pds()` helper: `pds('--p-color-primary')` — resolves `light-dark()` to actual `rgb()`.

## PDS Web Components

**IMPORTANT**: Before using any PDS component prop, check the auto-generated API reference at:
`skills/pds-html-presentation/.pds-cache/components.json`

This file is generated from the installed PDS package and contains all valid prop values for every component.
Re-run `refresh-cache.sh` to update after a PDS version change.

| Component | Example |
|-----------|---------|
| `<p-wordmark>` | `<p-wordmark></p-wordmark>` |
| `<p-heading>` | `<p-heading tag="h2" size="medium">Title</p-heading>` |
| `<p-text>` | `<p-text>Body text</p-text>` |
| `<p-text size="xs" color="contrast-medium">` | Footnotes |
| `<p-tag>` | `<p-tag variant="success">Done</p-tag>` |
| `<p-button-pure>` | See below — icon-source required for file:// |

### Common mistakes to avoid
- `<p-tag color="...">` — **WRONG**. Use `variant`, not `color`. `color` does not exist on `p-tag`.
- `<p-icon color="notification-success">` — **WRONG**. Use `color="success"` (no `notification-` prefix in v4).
- `<p-heading size="xx-large">` — **DEPRECATED**. Use `size="5xl"` (new token scale in v4).
- Custom `<span class="badge">` — **WRONG**. Use `<p-tag variant="...">` instead.

## Icons in standalone HTML (file://)

**Problem**: PDS `p-icon` (used inside `p-button-pure`, `p-button`, etc.) loads SVGs via `fetch()` from CDN.
`fetch()` from `file://` is blocked by the browser — this is a browser security policy, not a PDS bug.

**What works on file://**:
- `<script src="https://...">` ✅  (script loading has no same-origin restriction)
- `@font-face` with CDN URLs ✅
- All PDS text/layout components (`p-heading`, `p-text`, `p-wordmark`, `p-tag`, etc.) ✅
- `p-button-pure` with `icon-source="data:image/svg+xml,..."` ✅

**Rule**: Never use `icon="arrow-head-right"` in standalone HTML. Always use `icon-source` with a data URI.

### Generating data URIs for icons

```js
// Run once to get data URIs for needed icons:
const https = require('https');
const { getIconLinks } = require('@porsche-design-system/components-js/partials');

const icons = ['arrow-head-left', 'arrow-head-right']; // add more as needed
const urls = [...getIconLinks({ icons }).matchAll(/href=([^ ]+)/g)].map(m => m[1]);

(async () => {
  for (const url of urls) {
    const name = url.match(/icons\/([^.]+)/)[1];
    const svg = await fetch(url).then(r => r.text());
    console.log(name + ':', 'data:image/svg+xml,' + encodeURIComponent(svg));
  }
})();
```

### Pre-baked data URIs (PDS v4.2.0-rc.2)

```
arrow-head-left:  data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E%3Cpath%20d%3D%22m8.88%2012%205.48-6.5.76.64L10.2%2012l4.93%205.86-.76.64z%22%2F%3E%3C%2Fsvg%3E
arrow-head-right: data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E%3Cpath%20d%3D%22M15.12%2012%209.64%205.5l-.77.64L13.83%2012l-4.94%205.86.76.64z%22%2F%3E%3C%2Fsvg%3E
arrow-head-up:    data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E%3Cpath%20d%3D%22m12%208.88-6.5%205.48.64.76L12%2010.2l5.86%204.94.64-.77z%22%2F%3E%3C%2Fsvg%3E
arrow-head-down:  data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E%3Cpath%20d%3D%22M12%2015.13%205.5%209.64l.64-.76L12%2013.8l5.86-4.93.64.76z%22%2F%3E%3C%2Fsvg%3E
close:            data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E%3Cpath%20d%3D%22M18%206.7%2012.7%2012l5.3%205.3-.7.7-5.3-5.3L6.7%2018l-.7-.7%205.3-5.3L6%206.7l.7-.7%205.3%205.3L17.3%206z%22%2F%3E%3C%2Fsvg%3E
check:            data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E%3Cpath%20d%3D%22m10%2016.02-4.24-4.14-.76.74%205%204.88%2010-9.76-.76-.74z%22%2F%3E%3C%2Fsvg%3E
arrow-right:      data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E%3Cpath%20d%3D%22m13.75%206.14%204.52%205.36H4v1h14.27l-4.52%205.36.77.64%205.47-6.5H20l-5.48-6.5z%22%2F%3E%3C%2Fsvg%3E
arrow-left:       data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E%3Cpath%20d%3D%22M10.25%2017.86%205.73%2012.5H20v-1H5.73l4.52-5.36-.77-.64L4.01%2012H4l5.48%206.5z%22%2F%3E%3C%2Fsvg%3E
```

### Usage
```html
<p-button-pure type="button"
  icon-source="data:image/svg+xml,%3Csvg%20..."
  hide-label="true"
  aria="{'aria-label': 'Nächste Slide'}">
  Weiter
</p-button-pure>
```

## Building Blocks

### Header
```html
<header style="text-align: center; margin-bottom: 2rem; border-bottom: 3px solid var(--p-color-primary); padding-bottom: 1.5rem;">
  <p-wordmark></p-wordmark>
  <p-heading tag="h1" size="x-large" style="margin-top: 2rem;">[Title]</p-heading>
  <p-text color="contrast-medium" style="margin-top: 0.5rem;">[Meta]</p-text>
</header>
```

### Card
```html
<div style="background: var(--p-color-surface); border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem;">
  <p-heading tag="h2" size="medium">[Title]</p-heading>
  <p-text style="margin-top: 0.75rem;">[Content]</p-text>
</div>
```

### KPI Grid
```html
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
  <div style="background: var(--p-color-surface); border-radius: 8px; padding: 1.5rem; text-align: center;">
    <div style="font-size: 2.5rem; font-weight: 600; color: var(--p-color-primary);">[VALUE]</div>
    <div style="color: var(--p-color-contrast-medium); margin-top: 0.25rem;">[Label]</div>
  </div>
</div>
```

### Two-Column Grid
```html
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
  <div style="background: var(--p-color-surface); border-radius: 8px; padding: 1.5rem;">
    <!-- Left -->
  </div>
  <div style="background: var(--p-color-surface); border-radius: 8px; padding: 1.5rem;">
    <!-- Right -->
  </div>
</div>
```

### Theme List (positive/negative)
```html
<div style="background: var(--p-color-surface); border-radius: 8px; padding: 1.5rem; border-left: 4px solid var(--p-color-success);">
  <p-heading tag="h3" size="small">[Title]</p-heading>
  <div style="margin-top: 0.75rem;">
    <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--p-color-frosted);">
      <span>[Theme]</span> <p-tag color="success">[Count]×</p-tag>
    </div>
  </div>
</div>
```
Border color: `--p-color-success` (positive), `--p-color-error` (negative), `--p-color-warning` (opportunity).

### Insight Card
```html
<div style="background: var(--p-color-surface); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; border-left: 4px solid var(--p-color-success);">
  <div style="display: flex; justify-content: space-between; align-items: center;">
    <p-heading tag="h3" size="small">[Title]</p-heading>
    <p-tag color="success">[Type]</p-tag>
  </div>
  <p-text style="margin-top: 0.75rem;">[Description]</p-text>
</div>
```

### Quote Block
```html
<blockquote style="border-left: 4px solid var(--p-color-contrast-lower); padding: 1rem 1.5rem; margin-bottom: 1rem; background: var(--p-color-surface); border-radius: 0 8px 8px 0; font-style: italic;">
  "[Quote]"
  <footer style="font-style: normal; color: var(--p-color-contrast-medium); margin-top: 0.5rem; font-size: 0.875rem;">— [Attribution]</footer>
</blockquote>
```

### Priority Table
```html
<table style="width: 100%; border-collapse: collapse;">
  <thead>
    <tr><th style="text-align: left; padding: 0.75rem; border-bottom: 2px solid var(--p-color-frosted-strong); font-weight: 600;">[Col]</th></tr>
  </thead>
  <tbody>
    <tr><td style="padding: 0.75rem; border-bottom: 1px solid var(--p-color-frosted); color: var(--p-color-error); font-weight: 600;">P1</td><td style="padding: 0.75rem; border-bottom: 1px solid var(--p-color-frosted);">[Text]</td></tr>
    <tr><td style="padding: 0.75rem; border-bottom: 1px solid var(--p-color-frosted); color: var(--p-color-warning); font-weight: 600;">P2</td><td style="padding: 0.75rem; border-bottom: 1px solid var(--p-color-frosted);">[Text]</td></tr>
    <tr><td style="padding: 0.75rem; color: var(--p-color-contrast-medium); font-weight: 600;">P3</td><td style="padding: 0.75rem;">[Text]</td></tr>
  </tbody>
</table>
```

### Footer
```html
<footer style="text-align: center; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--p-color-frosted);">
  <p-text size="x-small" color="contrast-medium">[Notes]</p-text>
</footer>
```

## Chart.js Patterns

Always use `pds()` for colors. Always set `animation: false`.

### Donut (NPS)
```js
new Chart(document.getElementById('id'), {
  type: 'doughnut',
  data: { labels: [...], datasets: [{ data: [...], backgroundColor: [pds('--p-color-success'), pds('--p-color-warning'), pds('--p-color-error')], borderWidth: 0 }] },
  options: { responsive: true, animation: false, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { color: pds('--p-color-primary') } } } },
  plugins: [{ id: 'centerText', afterDraw(chart) {
    const { ctx, width, height } = chart;
    ctx.save();
    ctx.font = 'bold 2rem "Porsche Next", sans-serif';
    ctx.fillStyle = pds('--p-color-primary');
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('[VAL]', width / 2, height / 2 - 10);
    ctx.font = '0.875rem "Porsche Next", sans-serif';
    ctx.fillStyle = pds('--p-color-contrast-medium');
    ctx.fillText('[LABEL]', width / 2, height / 2 + 18);
    ctx.restore();
  }}]
});
```

### Horizontal Bar (Likert, CES)
```js
new Chart(document.getElementById('id'), {
  type: 'bar',
  data: { labels: [...], datasets: [{ data: [...], backgroundColor: pds('--p-color-primary'), borderWidth: 0, borderRadius: 4 }] },
  options: { indexAxis: 'y', responsive: true, animation: false, plugins: { legend: { display: false } },
    scales: { x: { min: 0, max: 5, grid: { display: false }, ticks: { color: pds('--p-color-primary') } }, y: { grid: { display: false }, ticks: { color: pds('--p-color-primary') } } } }
});
```

### Line (Trend)
```js
new Chart(document.getElementById('id'), {
  type: 'line',
  data: { labels: [...], datasets: [{ label: '...', data: [...], borderColor: pds('--p-color-primary'), backgroundColor: 'transparent', tension: 0.3, pointRadius: 5, pointBackgroundColor: pds('--p-color-primary') }] },
  options: { responsive: true, animation: false, scales: { y: { beginAtZero: false, ticks: { color: pds('--p-color-primary') } }, x: { grid: { display: false }, ticks: { color: pds('--p-color-primary') } } } }
});
```

## Responsive

- Max `1200px` centered
- Two-column → single column at `768px`: add `@media (max-width: 768px) { [grid-selector] { grid-template-columns: 1fr; } }`
- Charts: `max-height: 300px`

## Output Rules

- Save to `UX Designer (Agent)/guides/[slug].html`
- Naming: `dashboard-[topic].html`, `report-[topic].html`, `presentation-[topic].html`
- Always open after saving: `open "UX Designer (Agent)/guides/[slug].html"`
- Match language of input data / user request
- No Chart.js `<script>` tag if page has no charts
