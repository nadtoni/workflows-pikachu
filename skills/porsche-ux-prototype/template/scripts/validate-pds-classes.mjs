#!/usr/bin/env node
/**
 * validate-pds-classes.mjs
 *
 * Scans src/**\/*.{ts,tsx,html} for `className="…"` / `class="…"` strings and
 * warns when a class looks like a PDS Tailwind token but isn't defined in the
 * installed `@porsche-design-system/components-react/tailwindcss/index.css`.
 *
 * Tailwind 4 silently emits NO CSS for unknown utilities — this is the safety net.
 *
 * It also gates two more silent failures:
 *   - tile components (PLinkTile/PButtonTile/PLinkTileProduct) with neither an
 *     <img> fill nor an explicit {/* no-fill *\/} marker (see 7b), and
 *   - the asset gate (7c): raw `figma.com/api/mcp/asset/…` URLs left in source
 *     (expire in 7 days → download step skipped) and dangling local
 *     `./assets/figma/…` imports whose file is missing on disk.
 *   - persisted raw-candidate dumps in `src/assets/figma/_raw` (7d), which must
 *     not survive generation outside explicit debug mode.
 *
 * Logic:
 *   1. Parse the PDS theme CSS → build whitelists for color/spacing/radius/shadow/
 *      text-size tokens and `@utility` names.
 *   2. For each class, strip variants (`sm:hover:`) and opacity modifier (`/90`).
 *   3. Only check classes that use a KNOWN PDS-relevant prefix
 *      (`bg-`, `gap-`, `rounded-`, `prose-text-`, …) AND whose suffix contains a
 *      PDS-specific hint (`canvas`, `fluid`, `contrast`, `prose`, …).
 *   4. Stock Tailwind utilities (`flex`, `items-center`, `p-4`, `backdrop-blur`)
 *      are never touched → no false positives.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { loadPdsMeta } from './load-pds-meta.mjs'

const ROOT = process.cwd()
const SRC = join(ROOT, 'src')
const CSS = join(
  ROOT,
  'node_modules/@porsche-design-system/components-react/tailwindcss/index.css'
)

// --- 1. Parse PDS theme CSS ---------------------------------------------------

let css
try {
  css = readFileSync(CSS, 'utf8')
} catch {
  console.error(
    `\u001b[31m✗ PDS Tailwind theme not found at ${relative(ROOT, CSS)}\u001b[0m`
  )
  console.error('  Run `npm install` first.')
  process.exit(2)
}

const collect = (re) => {
  const out = new Set()
  for (const m of css.matchAll(re)) out.add(m[1])
  return out
}

const colorTokens   = collect(/--color-([a-z0-9-]+):/g)
const radiusTokens  = collect(/--radius-([a-z0-9-]+):/g)
const shadowTokens  = collect(/--shadow-([a-z0-9-]+):/g)
const textTokens    = collect(/--text-([a-z0-9-]+)(?:--line-height)?:/g)
const spacingTokens = collect(/--spacing-([a-z0-9-]+):/g)
const utilities     = collect(/^@utility ([a-z0-9-]+) /gm)

// --- 2. Build whitelists ------------------------------------------------------

const COLOR_PREFIXES = [
  'bg', 'text', 'border', 'border-t', 'border-r', 'border-b', 'border-l',
  'border-x', 'border-y', 'outline', 'fill', 'stroke', 'ring',
  'from', 'via', 'to', 'divide', 'accent', 'decoration', 'caret', 'placeholder',
]
const SPACING_PREFIXES = [
  'p', 'px', 'py', 'pt', 'pr', 'pb', 'pl', 'ps', 'pe',
  'm', 'mx', 'my', 'mt', 'mr', 'mb', 'ml', 'ms', 'me',
  'gap', 'gap-x', 'gap-y',
  'space-x', 'space-y',
  'w', 'h', 'size', 'min-w', 'min-h', 'max-w', 'max-h',
  'top', 'right', 'bottom', 'left', 'start', 'end',
  'inset', 'inset-x', 'inset-y',
  'translate-x', 'translate-y',
  'scroll-m', 'scroll-mx', 'scroll-my', 'scroll-mt', 'scroll-mr', 'scroll-mb', 'scroll-ml',
  'scroll-p', 'scroll-px', 'scroll-py', 'scroll-pt', 'scroll-pr', 'scroll-pb', 'scroll-pl',
]

const valid = new Set()
for (const p of COLOR_PREFIXES)   for (const t of colorTokens)   valid.add(`${p}-${t}`)
for (const p of SPACING_PREFIXES) for (const t of spacingTokens) valid.add(`${p}-${t}`)
for (const t of radiusTokens)  valid.add(`rounded-${t}`)
for (const t of shadowTokens)  valid.add(`shadow-${t}`)
for (const t of textTokens)    valid.add(`text-${t}`)
for (const u of utilities)     valid.add(u)

const PDS_PREFIX_RE = new RegExp(
  '^(' +
    [
      ...COLOR_PREFIXES, ...SPACING_PREFIXES,
      'rounded', 'shadow', 'text',
      'prose-text', 'prose-heading', 'prose-display',
      'col', 'col-start', 'col-end', 'col-span',
    ].join('|') +
    ')-'
)

const PDS_HINT = /(canvas|surface|frosted|backdrop|contrast|primary|success|warning|error|info|focus|fluid|static|prose|utility|notification|base)/

// --- 3. Walk src/ -------------------------------------------------------------

const files = []
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const s = statSync(p)
    if (s.isDirectory()) walk(p)
    else if (/\.(tsx|ts|jsx|js|html)$/.test(name)) files.push(p)
  }
}
try { walk(SRC) } catch {
  console.error(`\u001b[31m✗ src/ not found at ${SRC}\u001b[0m`)
  process.exit(2)
}

// --- 4. Extract & check class names ------------------------------------------

const CLASS_ATTR = /\bclass(?:Name)?\s*=\s*(?:"([^"]+)"|'([^']+)'|\{`([^`]+)`\})/g

const issues = []
for (const file of files) {
  const src = readFileSync(file, 'utf8')
  for (const m of src.matchAll(CLASS_ATTR)) {
    const value = m[1] ?? m[2] ?? m[3]
    const line = src.slice(0, m.index).split('\n').length
    for (const raw of value.split(/\s+/)) {
      if (!raw) continue
      if (/\[/.test(raw)) continue
      const cls = (raw.split(':').pop() ?? raw).split('/')[0]
      if (!PDS_PREFIX_RE.test(cls)) continue
      if (!PDS_HINT.test(cls)) continue
      if (valid.has(cls)) continue
      issues.push({ file: relative(ROOT, file), line, raw, cls })
    }
  }
}

// --- 5. Suggestions -----------------------------------------------------------

const SUGGEST = new Map([
  ['bg-base', 'bg-canvas'],
  ['bg-notification-error', 'bg-error-frosted'],
  ['bg-notification-success', 'bg-success-frosted'],
  ['bg-notification-warning', 'bg-warning-frosted'],
  ['bg-notification-info', 'bg-info-frosted'],
])
const suggest = (cls) => {
  if (SUGGEST.has(cls)) return SUGGEST.get(cls)
  if (cls.startsWith('text-utility-')) return 'prose-text-' + cls.slice('text-utility-'.length)
  if (cls.startsWith('text-prose-')) return cls.slice('text-'.length)
  return null
}

// --- 6. Report ----------------------------------------------------------------

// --- 7. JSX prop validation ---------------------------------------------------
//
// Loads the PDS meta whitelist and scans every `<PXxx ... prop="value" ...>` in
// the JSX. Reports values that are not in the enum the prop is typed against.
// Suggestion uses simple Damerau-Levenshtein over the allowed values.

const meta = loadPdsMeta()

const propIssues = []

// Match JSX opening tag for any PDS component:  <PHeading ... > or <PHeading ... />
const JSX_TAG_RE = /<(P[A-Z][A-Za-z0-9]+)\b([^>]*?)\/?>/g
// Static string attr inside the tag:  prop="value"
const ATTR_RE = /\b([a-zA-Z][a-zA-Z0-9]*)\s*=\s*"([^"]+)"/g
// Responsive object attr:  prop={{ base: "value", s: "other" }}
const ATTR_OBJ_RE = /\b([a-zA-Z][a-zA-Z0-9]*)\s*=\s*\{\{([^{}]*)\}\}/g

const dist = (a, b) => {
  const m = a.length, n = b.length
  if (!m) return n
  if (!n) return m
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)])
  for (let j = 1; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
    const cost = a[i - 1] === b[j - 1] ? 0 : 1
    dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost)
  }
  return dp[m][n]
}

const suggestValue = (bad, allowed) => {
  let best = null, bestD = Infinity
  for (const v of allowed) {
    const d = dist(bad, v)
    if (d < bestD) { bestD = d; best = v }
  }
  return bestD <= Math.max(2, Math.ceil(bad.length / 2)) ? best : null
}

for (const file of files) {
  const src = readFileSync(file, 'utf8')
  for (const tag of src.matchAll(JSX_TAG_RE)) {
    const comp = tag[1]
    const attrs = tag[2]
    const compMeta = meta.components?.[comp]
    if (!compMeta) continue
    const tagOffset = tag.index
    const line = src.slice(0, tagOffset).split('\n').length

    // static string attrs
    for (const a of attrs.matchAll(ATTR_RE)) {
      const [, prop, value] = a
      const typeName = compMeta[prop]
      if (!typeName) continue
      const allowed = meta.enums[typeName]
      if (!allowed || allowed.includes(value)) continue
      propIssues.push({ file: relative(ROOT, file), line, comp, prop, value, allowed, typeName })
    }

    // responsive object attrs:  prop={{ base: "x", s: "y" }}
    for (const a of attrs.matchAll(ATTR_OBJ_RE)) {
      const [, prop, body] = a
      const typeName = compMeta[prop]
      if (!typeName) continue
      const allowed = meta.enums[typeName]
      if (!allowed) continue
      for (const v of body.matchAll(/['"]([^'"]+)['"]/g)) {
        const value = v[1]
        if (allowed.includes(value)) continue
        propIssues.push({ file: relative(ROOT, file), line, comp, prop, value, allowed, typeName })
      }
    }
  }
}

// --- 7b. Tile image-fill gate -------------------------------------------------
//
// PLinkTile / PButtonTile / PLinkTileProduct render an <img> child as their
// background image. Step 5b-ii of the prototype skill MUST run for every tile:
// `mcp_figma_download_assets` → then EITHER inject the real <img> child, OR
// (only when Figma genuinely has no image fill) leave an explicit marker
// comment so the decision is on record. A tile with NEITHER means Step 5b-ii
// was silently skipped — fail loudly instead of shipping an empty tile.
//
// Opt out (no fill in Figma): place a marker anywhere inside the tile body:
//   <PButtonTile …>{/* no-fill: Figma tile has no image */}…</PButtonTile>

const TILE_TAGS = ['PButtonTile', 'PLinkTile', 'PLinkTileProduct']
const tileIssues = []

for (const file of files) {
  const src = readFileSync(file, 'utf8')
  for (const tagName of TILE_TAGS) {
    // self-closing <PButtonTile … /> can carry neither an <img> nor a marker
    const selfClose = new RegExp(`<${tagName}\\b[^>]*\\/>`, 'g')
    for (const m of src.matchAll(selfClose)) {
      const line = src.slice(0, m.index).split('\n').length
      tileIssues.push({ file: relative(ROOT, file), line, tagName, selfClose: true })
    }
    // paired <PButtonTile …> … </PButtonTile> — must contain <img> or a marker
    const paired = new RegExp(`<${tagName}\\b[^>]*?>([\\s\\S]*?)<\\/${tagName}>`, 'g')
    for (const m of src.matchAll(paired)) {
      const inner = m[1]
      const line = src.slice(0, m.index).split('\n').length
      const hasImg = /<img\b/.test(inner)
      const hasMarker = /no-fill/.test(inner)
      if (!hasImg && !hasMarker) {
        tileIssues.push({ file: relative(ROOT, file), line, tagName, selfClose: false })
      }
    }
  }
}

// --- 7c. Asset completion gate ------------------------------------------------
//
// Step 5b of the prototype skill downloads every Figma content image into
// src/assets/figma/ and imports it via a Vite ES-module import. Two silent
// failures mean the asset gate was skipped:
//
//   1. A raw MCP asset URL (`figma.com/api/mcp/asset/…`) left in any source
//      file — it expires in 7 days and proves the download/wire step never ran.
//   2. An `import … from './assets/figma/<file>'` that points at a file which
//      does not exist on disk — a dangling import that breaks the Vite build.
//
// Both are deterministic and format-independent, so they belong in the gate.

const assetIssues = []
const MCP_ASSET_RE = /https?:\/\/[^"'`\s)]*\/api\/mcp\/asset\/[A-Za-z0-9-]+/g
const FIGMA_IMPORT_RE = /import\s+[A-Za-z0-9_$]+\s+from\s+['"](\.\.?\/[^'"]*assets\/figma\/[^'"]+)['"]/g
const importedAssets = new Set()

for (const file of files) {
  const src = readFileSync(file, 'utf8')

  // 1. leftover raw MCP asset URLs
  for (const m of src.matchAll(MCP_ASSET_RE)) {
    const line = src.slice(0, m.index).split('\n').length
    assetIssues.push({ file: relative(ROOT, file), line, kind: 'raw-url', detail: m[0] })
  }

  // 2. dangling local Figma asset imports
  for (const m of src.matchAll(FIGMA_IMPORT_RE)) {
    const spec = m[1]
    importedAssets.add(spec)
    const abs = join(file, '..', spec)
    let exists = true
    try { statSync(abs) } catch { exists = false }
    if (!exists) {
      const line = src.slice(0, m.index).split('\n').length
      assetIssues.push({ file: relative(ROOT, file), line, kind: 'dangling-import', detail: spec })
    }
  }
}

// --- 7d. Raw candidate dump gate + strict mapping (optional) -----------------
//
// Candidate downloads for tile/rawImages must be temporary. Persisting
// src/assets/figma/_raw makes the project ambiguous and bloated.
//
// Escape hatch for intentional diagnostics:
//   PUX_DEBUG_RAW_ASSETS=1 npm run validate:pds
//
// Optional strict mapping check:
//   PUX_STRICT_ASSET_MAPPING=1 npm run validate:pds
// Enforces 1:1 parity between imported ./assets/figma/* files and files that
// actually exist in src/assets/figma/ (excluding _raw and dotfiles).

const assetsDir = join(SRC, 'assets', 'figma')
const rawDir = join(assetsDir, '_raw')
const debugRaw = process.env.PUX_DEBUG_RAW_ASSETS === '1'
const strictAssetMapping = process.env.PUX_STRICT_ASSET_MAPPING === '1'

let rawDirExists = false
try {
  rawDirExists = statSync(rawDir).isDirectory()
} catch {
  rawDirExists = false
}

const strictAssetIssue = []
if (strictAssetMapping) {
  let assetFiles = []
  try {
    assetFiles = readdirSync(assetsDir)
      .filter((name) => name !== '_raw' && !name.startsWith('.'))
  } catch {
    assetFiles = []
  }

  const importedNames = new Set(
    [...importedAssets]
      .map((spec) => spec.split('/').pop())
      .filter(Boolean)
  )
  const fileNames = new Set(assetFiles)

  const importedButMissing = [...importedNames].filter((name) => !fileNames.has(name))
  const existingButUnused = [...fileNames].filter((name) => !importedNames.has(name))

  if (importedButMissing.length || existingButUnused.length) {
    strictAssetIssue.push({ importedButMissing, existingButUnused })
  }
}

// --- 8. Combined report -------------------------------------------------------

if (
  issues.length === 0 &&
  propIssues.length === 0 &&
  tileIssues.length === 0 &&
  assetIssues.length === 0 &&
  (!rawDirExists || debugRaw) &&
  strictAssetIssue.length === 0
) {
  console.log('\u001b[32m✓ PDS class validation passed\u001b[0m')
  console.log(`\u001b[2m  (${files.length} files · ${Object.keys(meta.components || {}).length} components in whitelist)\u001b[0m`)
  process.exit(0)
}

if (issues.length) {
  console.error(
    `\u001b[31m✗ Found ${issues.length} unknown PDS-style class${issues.length === 1 ? '' : 'es'}:\u001b[0m\n`
  )
  for (const { file, line, raw, cls } of issues) {
    const tip = suggest(cls)
    const tipStr = tip ? `  \u001b[33m→ try \`${tip}\`\u001b[0m` : ''
    console.error(`  ${file}:${line}  \u001b[31m${raw}\u001b[0m${tipStr}`)
  }
  console.error(
    '\n  These classes are not defined in @porsche-design-system/components-react/tailwindcss/index.css'
  )
  console.error('  and Tailwind 4 will silently emit NO CSS for them.\n')
}

if (propIssues.length) {
  console.error(
    `\u001b[31m✗ Found ${propIssues.length} invalid PDS component prop value${propIssues.length === 1 ? '' : 's'}:\u001b[0m\n`
  )
  for (const { file, line, comp, prop, value, allowed, typeName } of propIssues) {
    const tip = suggestValue(value, allowed)
    const tipStr = tip ? `  \u001b[33m→ try \`${tip}\`\u001b[0m` : `  \u001b[2m(${typeName}: ${allowed.slice(0, 6).join(', ')}${allowed.length > 6 ? ', …' : ''})\u001b[0m`
    console.error(`  ${file}:${line}  \u001b[31m<${comp} ${prop}="${value}">\u001b[0m${tipStr}`)
  }
  console.error('')
}

if (tileIssues.length) {
  console.error(
    `\u001b[31m✗ Found ${tileIssues.length} tile${tileIssues.length === 1 ? '' : 's'} without an image fill or an explicit no-fill marker:\u001b[0m\n`
  )
  for (const { file, line, tagName, selfClose } of tileIssues) {
    const why = selfClose
      ? 'self-closing — rewrite as paired <' + tagName + '>…</' + tagName + '>'
      : 'no <img> child and no {/* no-fill */} marker'
    console.error(`  ${file}:${line}  \u001b[31m<${tagName}>\u001b[0m  \u001b[2m(${why})\u001b[0m`)
  }
  console.error(
    '\n  Tiles render an <img> as their background. Run Step 5b-ii of the skill'
  )
  console.error(
    '  (mcp_figma_download_assets on each tile instance node), then either inject'
  )
  console.error(
    '  the real <img src={…} /> as the first child, or — only if Figma has no fill —'
  )
  console.error(
    '  add a {/* no-fill: <reason> */} marker inside the tile to record the decision.\n'
  )
}

if (assetIssues.length) {
  const rawUrls = assetIssues.filter((a) => a.kind === 'raw-url')
  const dangling = assetIssues.filter((a) => a.kind === 'dangling-import')

  if (rawUrls.length) {
    console.error(
      `\u001b[31m✗ Found ${rawUrls.length} raw Figma MCP asset URL${rawUrls.length === 1 ? '' : 's'} left in source:\u001b[0m\n`
    )
    for (const { file, line, detail } of rawUrls) {
      console.error(`  ${file}:${line}  \u001b[31m${detail}\u001b[0m`)
    }
    console.error(
      '\n  These URLs expire in 7 days — their presence means Step 5b (asset download'
    )
    console.error(
      '  + wire) was skipped. Download each into src/assets/figma/ and import it via'
    )
    console.error(
      "  a Vite ES-module import (`import img from './assets/figma/<file>'`).\n"
    )
  }

  if (dangling.length) {
    console.error(
      `\u001b[31m✗ Found ${dangling.length} dangling Figma asset import${dangling.length === 1 ? '' : 's'} (file missing on disk):\u001b[0m\n`
    )
    for (const { file, line, detail } of dangling) {
      console.error(`  ${file}:${line}  \u001b[31m${detail}\u001b[0m`)
    }
    console.error(
      '\n  The imported file does not exist — download the asset before referencing it.\n'
    )
  }
}

if (rawDirExists && !debugRaw) {
  console.error(
    '\u001b[31m✗ Found persisted raw asset dump at src/assets/figma/_raw\u001b[0m\n'
  )
  console.error(
    '  Raw candidate files must be temporary only. Move candidate downloads to a'
  )
  console.error(
    '  temp directory, keep exactly one final image per mapped component in'
  )
  console.error(
    '  src/assets/figma/, and delete temp files immediately after selection.\n'
  )
  console.error(
    '  If you intentionally keep _raw for diagnostics, rerun with'
  )
  console.error(
    '  PUX_DEBUG_RAW_ASSETS=1 npm run validate:pds\n'
  )
}

if (strictAssetIssue.length) {
  const { importedButMissing, existingButUnused } = strictAssetIssue[0]
  console.error(
    '\u001b[31m✗ Strict asset mapping failed (PUX_STRICT_ASSET_MAPPING=1)\u001b[0m\n'
  )
  if (importedButMissing.length) {
    console.error('  Imported in source but missing in src/assets/figma/:')
    for (const name of importedButMissing) console.error(`    - ${name}`)
  }
  if (existingButUnused.length) {
    console.error('  Present in src/assets/figma/ but unused in imports:')
    for (const name of existingButUnused) console.error(`    - ${name}`)
  }
  console.error('')
}

process.exit(1)
