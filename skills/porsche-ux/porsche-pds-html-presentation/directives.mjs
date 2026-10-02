/**
 * PDS Slide Directives — Registry
 *
 * Each directive is a function: (attrs, innerHtml, context) => string
 *
 * - attrs:     parsed key=value pairs from the opening line
 * - innerHtml: already-rendered HTML of the directive's children
 * - context:   { components, renderContent } — components.json data + recursive renderer
 *
 * Markdown syntax:
 *   ::: name key=value key="multi word"
 *   child content (markdown or nested :::)
 *   :::
 *
 * Adding a new directive = adding one entry to the `directives` object below.
 * The parser in build-slides.mjs never changes.
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cacheDir = join(__dirname, '.pds-cache');

// ─── Load components.json for validation ────────────────────────────────────
let componentsData = null;
function getComponents() {
  if (componentsData) return componentsData;
  const path = join(cacheDir, 'components.json');
  if (existsSync(path)) {
    componentsData = JSON.parse(readFileSync(path, 'utf-8'));
  } else {
    componentsData = { components: {}, icons: [] };
  }
  return componentsData;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Validate a PDS component prop value against components.json */
function validateProp(component, prop, value) {
  const data = getComponents();
  const comp = data.components?.[component];
  if (!comp || !comp[prop]) return true; // unknown = allow
  if (!comp[prop].includes(value)) {
    console.warn(`⚠  Directive warning: <${component} ${prop}="${value}"> — valid values: ${comp[prop].join(', ')}`);
    return false;
  }
  return true;
}

// ─── Directive Registry ─────────────────────────────────────────────────────

const directives = {

  /**
   * ::: grid cols=3
   * (children — typically ::: card blocks)
   * :::
   */
  grid(attrs, innerHtml) {
    const cols = parseInt(attrs.cols, 10) || 2;
    const gap = attrs.gap || '1.25rem';
    return `<div class="grid-${cols}" style="gap:${gap}">${innerHtml}</div>`;
  },

  /**
   * ::: card
   * ### Title
   * Content
   * :::
   */
  card(attrs, innerHtml) {
    const variant = attrs.variant || 'surface'; // surface | frosted
    const cls = variant === 'frosted' ? 'card-frosted' : 'card';
    return `<div class="${cls}">${innerHtml}</div>`;
  },

  /**
   * ::: notification state=info heading="Title"
   * Optional description text
   * :::
   * state: info | success | warning | error
   */
  notification(attrs, innerHtml, context) {
    const state = attrs.state || 'info';
    const heading = attrs.heading || '';
    let html = `<p-inline-notification state="${state}"`;
    if (heading) html += ` heading="${escapeHtml(heading)}"`;
    html += ` dismiss-button="false">`;
    if (innerHtml.trim()) html += innerHtml.trim();
    html += `</p-inline-notification>`;
    return html;
  },

  /**
   * ::: kpi value=42 label="Offene Issues" delta=+12% color=success
   */
  kpi(attrs) {
    const value = attrs.value || '—';
    const label = attrs.label || '';
    const delta = attrs.delta || '';
    const color = attrs.color || '';
    let deltaHtml = '';
    if (delta) {
      const dir = delta.startsWith('-') ? 'down' : 'up';
      const arrow = dir === 'up' ? '↑' : '↓';
      deltaHtml = ` <span class="stat-delta stat-delta--${dir}">${arrow} ${delta}</span>`;
    }
    const valueStyle = color ? ` style="color:var(--p-color-${color})"` : '';
    return `<div class="stat"><span class="stat-value"${valueStyle}>${escapeHtml(value)}</span>${deltaHtml}<span class="stat-label">${escapeHtml(label)}</span></div>`;
  },

  /**
   * ::: tags
   * tag variant=success | Fertig
   * tag variant=warning | In Arbeit
   * tag variant=error   | Blockiert
   * :::
   *
   * innerHtml is raw (unparsed) text here — we parse tag lines ourselves.
   */
  tags(attrs, innerHtml, context) {
    // innerHtml already went through renderContent, but we need the raw lines.
    // We re-parse from the raw children stored in context.rawChildren
    const lines = (context.rawChildren || innerHtml).split('\n').map(l => l.trim()).filter(Boolean);
    const gap = attrs.gap || '0.5rem';
    const items = lines.map(line => {
      const tagMatch = line.match(/^tag\s+(.*?)\s*\|\s*(.+)$/);
      if (!tagMatch) return ''; // skip non-tag lines
      const tagAttrs = parseAttrs(tagMatch[1]);
      const label = tagMatch[2].trim();
      const variant = tagAttrs.variant || 'primary';
      validateProp('p-tag', 'variant', variant);
      const color = tagAttrs.color ? ` color="${tagAttrs.color}"` : '';
      return `<p-tag variant="${variant}"${color}>${escapeHtml(label)}</p-tag>`;
    }).filter(Boolean);
    return `<div style="display:flex; flex-wrap:wrap; gap:${gap}">${items.join('\n')}</div>`;
  },

  /**
   * ::: icons cols=25 size=small
   * Renders ALL icons from components.json in a grid with hover tooltips.
   * Optional: filter="arrow" — only icons containing "arrow"
   */
  icons(attrs) {
    const data = getComponents();
    const allIcons = data.icons || [];
    const cols = parseInt(attrs.cols, 10) || 20;
    const size = attrs.size || 'small';
    const filter = attrs.filter || '';

    let icons = allIcons;
    if (filter) {
      const re = new RegExp(filter, 'i');
      icons = allIcons.filter(name => re.test(name));
    }

    const items = icons.map(name =>
      `<div class="icon-item" title="${name}"><p-icon name="${name}" size="${size}" aria='{"aria-hidden":"true"}'></p-icon></div>`
    ).join('\n');

    return `<div class="icon-grid" style="display:grid; grid-template-columns:repeat(${cols},1fr); gap:0.25rem; font-size:0.5rem">${items}</div>
<p-text size="x-small" color="contrast-medium" style="margin-top:0.75rem">${icons.length} Icons · PDS ${data._version || ''}</p-text>`;
  },

  /**
   * ::: animate type=stagger
   * (children)
   * :::
   * type: stagger | fade-up
   */
  animate(attrs, innerHtml) {
    const type = attrs.type || 'stagger';
    const cls = type === 'stagger' ? 'anim-stagger' : 'anim-fade-up';
    return `<div class="${cls}">${innerHtml}</div>`;
  },

  /**
   * ::: quote
   * „Quoted text here."
   * — Attribution
   * :::
   */
  quote(attrs, innerHtml, context) {
    const lines = (context.rawChildren || '').split('\n').map(l => l.trim()).filter(Boolean);
    let attribution = '';
    let quoteLines = [...lines];
    if (quoteLines.length > 1 && /^[—–-]/.test(quoteLines[quoteLines.length - 1])) {
      attribution = quoteLines.pop();
    }
    const quote = quoteLines.join(' ');
    const color = attrs.color || 'success';
    let html = `<div class="slide-blockquote" style="border-left-color:var(--p-color-${color})">`;
    html += `\n  <p-text size="small" style="font-style:italic">${quote}</p-text>`;
    if (attribution) {
      html += `\n  <p-text size="x-small" color="contrast-medium" class="quote-attribution">${attribution}</p-text>`;
    }
    html += '\n</div>';
    return html;
  },

  /**
   * ::: center
   * (children — centered horizontally and vertically)
   * :::
   */
  center(attrs, innerHtml) {
    return `<div style="display:flex; flex-direction:column; align-items:center; text-align:center; gap:0.75rem">${innerHtml}</div>`;
  },

  /**
   * ::: table
   * Header 1 | Header 2 | Header 3
   * Cell 1   | Cell 2   | Cell 3
   * Cell 4   | Cell 5   | Cell 6
   * :::
   */
  table(attrs, innerHtml, context) {
    const lines = (context.rawChildren || '').split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return '';
    const headerCells = lines[0].split('|').map(c => c.trim());
    const rows = lines.slice(1).map(l => l.split('|').map(c => c.trim()));
    let html = '<table style="width:100%; border-collapse:collapse">';
    html += '<thead><tr>' + headerCells.map(h =>
      `<th style="text-align:left; padding:8px 12px; border-bottom:2px solid var(--p-color-frosted-strong); font-weight:600">${h}</th>`
    ).join('') + '</tr></thead>';
    html += '<tbody>' + rows.map(cells =>
      '<tr>' + cells.map(c =>
        `<td style="padding:8px 12px; border-bottom:1px solid var(--p-color-frosted)">${c}</td>`
      ).join('') + '</tr>'
    ).join('') + '</tbody>';
    html += '</table>';
    return html;
  },
};

// ─── Attribute Parser ───────────────────────────────────────────────────────

/**
 * Parse key=value pairs from a directive line.
 * Supports: key=value  key="multi word"  key='multi word'
 */
export function parseAttrs(str) {
  const attrs = {};
  const re = /(\w[\w-]*)=(?:"([^"]*)"|'([^']*)'|(\S+))/g;
  let m;
  while ((m = re.exec(str))) {
    attrs[m[1]] = m[2] ?? m[3] ?? m[4];
  }
  return attrs;
}

// ─── Directive Processor ────────────────────────────────────────────────────

/**
 * Process ::: directives in markdown text.
 *
 * Takes raw markdown lines and returns processed markdown where all :::
 * blocks have been replaced with their rendered HTML.
 *
 * Supports nesting: use more colons for outer blocks (:::: wraps :::).
 *
 * @param {string} md — raw markdown text
 * @param {function} renderContent — the slide content renderer from build-slides
 * @returns {string} — markdown with directives replaced by HTML
 */
export function processDirectives(md, renderContent) {
  const lines = md.split('\n');
  const result = [];
  let i = 0;

  while (i < lines.length) {
    const trimmed = lines[i].trim();

    // Match opening ::: directive — count colons to support nesting
    const openMatch = trimmed.match(/^(:{3,})\s+(\w[\w-]*)\s*(.*)?$/);
    if (openMatch) {
      const colons = openMatch[1].length;
      const name = openMatch[2];
      const attrStr = (openMatch[3] || '').trim();
      const attrs = parseAttrs(attrStr);
      const directive = directives[name];

      // ── Void directive: render immediately, no children ──
      if (voidDirectives.has(name)) {
        if (directive) {
          const context = { rawChildren: '', renderContent, components: getComponents() };
          result.push(directive(attrs, '', context));
        } else {
          console.warn(`⚠  Unknown void directive: :::${name}`);
        }
        i++;
        continue;
      }

      // Collect children until matching closing fence (same colon count, nothing else)
      const children = [];
      i++;
      let depth = 0;
      while (i < lines.length) {
        const ct = lines[i].trim();
        // Nested open with same or more colons (skip void directives)
        const nestedOpen = ct.match(/^(:{3,})\s+(\w[\w-]*)/);
        if (nestedOpen && nestedOpen[1].length >= colons && !voidDirectives.has(nestedOpen[2])) {
          depth++;
        }
        // Closing fence: exact same colon count, nothing after
        const closeMatch = ct.match(/^(:{3,})\s*$/);
        if (closeMatch && closeMatch[1].length === colons) {
          if (depth === 0) {
            i++;
            break;
          }
          depth--;
        }
        children.push(lines[i]);
        i++;
      }

      const rawChildren = children.join('\n');

      if (directive) {
        // For directives that need raw text (tags, quote, table), pass rawChildren
        // For others, recursively process nested directives then render as markdown
        const needsRaw = ['tags', 'quote', 'table'].includes(name);
        let innerHtml;
        if (needsRaw) {
          innerHtml = rawChildren;
        } else {
          // Recursively process nested directives first
          const processed = processDirectives(rawChildren, renderContent);
          innerHtml = renderContent(processed);
        }

        const context = { rawChildren, renderContent, components: getComponents() };
        const html = directive(attrs, innerHtml, context);
        result.push(html);
      } else {
        // Unknown directive — pass through as-is, warn
        console.warn(`⚠  Unknown directive: :::${name} — passing through as raw HTML`);
        result.push(rawChildren);
      }
      continue;
    }

    result.push(lines[i]);
    i++;
  }

  return result.join('\n');
}

/** List all registered directive names (for documentation / validation) */
export function listDirectives() {
  return Object.keys(directives);
}

/** Directives that take no children — rendered inline, no closing ::: needed */
const voidDirectives = new Set(['kpi']);
