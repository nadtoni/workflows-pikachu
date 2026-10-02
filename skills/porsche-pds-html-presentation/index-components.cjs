#!/usr/bin/env node
/**
 * PDS Component API Indexer
 *
 * Extracts component prop enums from the installed PDS jsdom-polyfill bundle
 * and generates a components.json reference file.
 *
 * Run via refresh-cache.sh or standalone:
 *   node index-components.cjs
 *
 * Output: .pds-cache/components.json
 */

const fs = require('fs');
const path = require('path');

const SCRIPT_DIR = __dirname;

// Resolve PDS package root — try SCRIPT_DIR first, then walk up
function findPdsRoot() {
  let dir = SCRIPT_DIR;
  for (let i = 0; i < 5; i++) {
    const candidate = path.join(dir, 'node_modules/@porsche-design-system/components-js');
    if (fs.existsSync(candidate)) return candidate;
    dir = path.dirname(dir);
  }
  return null;
}

const pdsRoot = findPdsRoot();
if (!pdsRoot) {
  console.error('ERROR: @porsche-design-system/components-js not found. Run refresh-cache.sh first.');
  process.exit(1);
}

const polyfillPath = path.join(pdsRoot, 'jsdom-polyfill/index.cjs');
const partialsPath = path.join(pdsRoot, 'partials/cjs/index.cjs');
const pkgPath = path.join(pdsRoot, 'package.json');

if (!fs.existsSync(polyfillPath)) {
  console.error('ERROR: PDS jsdom-polyfill not found at', polyfillPath);
  process.exit(1);
}

const src = fs.readFileSync(polyfillPath, 'utf-8');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

// ─── Extract named enum arrays (handles multi-line + spread operators) ──────
function extractEnums(source) {
  // Match: CONST_NAME = [ ... ]  (single-line or multi-line, may contain ...SPREAD)
  const re = /\b([A-Z][A-Z_0-9]+)\s*=\s*\[/g;
  const enums = {};
  let m;
  while ((m = re.exec(source))) {
    const name = m[1];
    // Find matching closing bracket (track nesting)
    let depth = 1;
    let i = m.index + m[0].length;
    while (i < source.length && depth > 0) {
      if (source[i] === '[') depth++;
      else if (source[i] === ']') depth--;
      i++;
    }
    const body = source.substring(m.index + m[0].length, i - 1);
    // Extract string values
    const values = [];
    const strRe = /'([a-z0-9][\w-]*)'/g;
    let sv;
    while ((sv = strRe.exec(body))) values.push(sv[1]);
    // Extract spread references (e.g. ...HEADING_SIZES_DEPRECATED)
    const spreads = [];
    const spreadRe = /\.\.\.(\w+)/g;
    let sp;
    while ((sp = spreadRe.exec(body))) spreads.push(sp[1]);

    if (values.length === 0 && spreads.length === 0) continue;
    // Keep first non-empty occurrence per name
    if (!enums[name]) {
      enums[name] = { values, spreads };
    }
  }
  return enums;
}

// ─── Resolve spread references ──────────────────────────────────────────────
function resolveEnums(enums) {
  const resolved = {};
  const resolve = (name, visited = new Set()) => {
    if (resolved[name]) return resolved[name];
    if (visited.has(name)) return [];
    visited.add(name);
    const entry = enums[name];
    if (!entry) return [];
    let vals = [...entry.values];
    for (const spread of entry.spreads) {
      vals.push(...resolve(spread, visited));
    }
    resolved[name] = [...new Set(vals)];
    return resolved[name];
  };
  for (const name of Object.keys(enums)) resolve(name);
  return resolved;
}

// ─── Extract icon names ─────────────────────────────────────────────────────
function extractIconNames() {
  try {
    const partialsSrc = fs.readFileSync(partialsPath, 'utf-8');
    const { getIconLinks } = require(partialsPath);
    const fnSrc = getIconLinks.toString();
    const m = fnSrc.match(/supportedIconNames\s*=\s*(\[[^\]]+\])/s);
    if (m) return JSON.parse(m[1].replace(/'/g, '"'));
  } catch (e) { /* fallback below */ }

  // Fallback: extract from bundle
  const m = src.match(/supportedIconNames\s*=\s*\[([^\]]+)\]/);
  if (m) {
    return m[1].match(/'([^']+)'/g).map(s => s.replace(/'/g, ''));
  }
  return [];
}


// ─── Build component index ──────────────────────────────────────────────────
const rawEnums = extractEnums(src);
const enums = resolveEnums(rawEnums);
const iconNames = extractIconNames();
const tagNames = enums['TAG_NAMES'] || [];

// Map enum names to component.prop structure
// Convention: COMPONENT_PROP_NAME → p-component prop="value"
const componentMap = {
  'p-accordion': {
    background: enums['ACCORDIONS_BACKGROUNDS'],
    size: enums['ACCORDION_SIZES'],
    'align-marker': enums['ACCORDION_ALIGN_MARKERS'],
  },
  'p-banner': {
    state: enums['BANNER_STATES'],
    position: enums['BANNER_POSITIONS'],
  },
  'p-button': {
    type: enums['BUTTON_TYPES'],
    variant: enums['LINK_BUTTON_VARIANTS'],
  },
  'p-button-pure': {
    type: enums['BUTTON_TYPES'],
    size: enums['BUTTON_PURE_SIZES'] || enums['BUTTON_PURE_SIZES_DEPRECATED'],
    color: enums['BUTTON_PURE_COLORS'],
  },
  'p-button-tile': {
    size: enums['TILE_SIZES'],
    weight: enums['TILE_WEIGHTS'],
    align: enums['TILE_ALIGNS'],
  },
  'p-canvas': {
    background: enums['CANVAS_BACKGROUNDS'],
  },
  'p-carousel': {
    width: enums['CAROUSEL_WIDTHS'],
    'align-header': enums['CAROUSEL_ALIGN_HEADERS'],
    'heading-size': enums['CAROUSEL_HEADING_SIZES'],
    'align-controls': enums['CAROUSEL_ALIGN_CONTROLS'],
  },
  'p-display': {
    tag: enums['DISPLAY_TAGS'],
    size: enums['DISPLAY_SIZES'],
    color: enums['DISPLAY_COLORS'],
    align: enums['DISPLAY_ALIGNS'],
  },
  'p-divider': {
    color: enums['DIVIDER_COLORS'],
    direction: enums['DIVIDER_DIRECTIONS'],
  },
  'p-flyout': {
    background: enums['FLYOUT_BACKGROUNDS'],
    position: enums['FLYOUT_POSITIONS'],
    'footer-behavior': enums['FLYOUT_FOOTER_BEHAVIOR'],
  },
  'p-heading': {
    tag: enums['HEADING_TAGS'],
    size: enums['HEADING_SIZES'],
    color: enums['HEADING_COLORS'],
    weight: enums['HEADING_WEIGHTS'],
    align: enums['HEADING_ALIGNS'],
    hyphens: enums['HEADING_HYPHENS'],
  },
  'p-icon': {
    size: enums['ICON_SIZES'],
    color: enums['ICON_COLORS'],
  },
  'p-inline-notification': {
    state: enums['INLINE_NOTIFICATION_STATES'],
  },
  'p-link': {
    variant: enums['LINK_BUTTON_VARIANTS'],
  },
  'p-link-pure': {
    size: enums['LINK_PURE_SIZES'] || enums['LINK_PURE_SIZES_DEPRECATED'],
    color: enums['LINK_PURE_COLORS'],
  },
  'p-link-tile': {
    size: enums['TILE_SIZES'],
    weight: enums['TILE_WEIGHTS'],
    align: enums['TILE_ALIGNS'],
  },
  'p-modal': {
    background: enums['MODAL_BACKGROUNDS'],
  },
  'p-model-signature': {
    size: enums['MODEL_SIGNATURE_SIZES'],
    'fetch-priority': enums['MODEL_SIGNATURE_FETCH_PRIORITY'],
  },
  'p-popover': {
    direction: enums['POPOVER_DIRECTIONS'],
  },
  'p-radio-group': {
    direction: enums['GROUP_DIRECTIONS'],
  },
  'p-segmented-control': {},
  'p-select': {},
  'p-sheet': {
    background: enums['SHEET_BACKGROUNDS'],
  },
  'p-spinner': {
    size: enums['SPINNER_SIZES_DEPRECATED'],
    color: enums['SPINNER_COLORS'],
  },
  'p-stepper-horizontal-item': {
    state: enums['STEPPER_ITEM_STATES'],
  },
  'p-tabs': {
    size: enums['TABS_SIZES'],
    background: enums['TABS_BACKGROUNDS'],
    weight: enums['TABS_WEIGHTS'],
  },
  'p-tabs-bar': {
    size: enums['TABS_BAR_SIZES'],
    background: enums['TABS_BAR_BACKGROUNDS'],
    weight: enums['TABS_BAR_WEIGHTS'],
  },
  'p-tag': {
    variant: enums['TAG_VARIANTS'],
    _note: 'Use "variant" for colors. Do NOT use "color" — it does not exist. Use "icon" prop for icon name.',
  },
  'p-tag-dismissible': {
    variant: enums['TAG_VARIANTS'],
  },
  'p-text': {
    tag: enums['TEXT_TAGS'],
    size: enums['TEXT_SIZES'],
    color: enums['TEXT_COLORS'],
    align: enums['TEXT_ALIGNS'],
    hyphens: enums['TEXT_HYPHENS'],
  },
  'p-text-list': {
    type: enums['TEXT_LIST_TYPES'],
  },
  'p-textarea': {
    wrap: enums['TEXTAREA_WRAPS'],
    resize: enums['TEXTAREA_RESIZE'],
  },
  'p-toast': {
    _note: 'Use addMessage() API. State: info | success | warning | error.',
  },
  'p-wordmark': {
    size: enums['WORDMARK_SIZES'],
  },
};

// Clean out undefined props
for (const [comp, props] of Object.entries(componentMap)) {
  for (const [prop, val] of Object.entries(props)) {
    if (val === undefined) delete props[prop];
  }
}

const output = {
  _generated: new Date().toISOString(),
  _version: pkg.version,
  _note: 'Auto-generated from @porsche-design-system/components-js. Do NOT edit manually. Re-run refresh-cache.sh to update.',
  components: componentMap,
  icons: iconNames,
  allTags: tagNames,
};

const outPath = path.join(SCRIPT_DIR, '.pds-cache', 'components.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(output, null, 2));

console.log(
  `✓ Indexed ${Object.keys(componentMap).length} components, ${iconNames.length} icons → .pds-cache/components.json (PDS ${pkg.version})`
);
