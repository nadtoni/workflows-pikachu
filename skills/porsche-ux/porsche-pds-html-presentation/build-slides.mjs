/**
 * PDS Slide Builder
 *
 * Converts a Markdown file into a standalone PDS HTML presentation.
 *
 * Usage (run from PDS Presentation (Skill)/ root):
 *   node skills/porsche-ux/porsche-pds-html-presentation/build-slides.mjs presentations/test.md
 *
 * Markdown format:
 *   - `---` on its own line = slide separator
 *   - `<!-- class: cover -->` = slide CSS class (optional, first line of slide)
 *   - `# ` heading → <p-heading size="xx-large">
 *   - `## ` heading → <p-heading size="large">
 *   - `### ` heading → <p-heading size="medium">
 *   - `::: name key=value` → directive (see directives.mjs)
 *   - Lines starting with `<` → passed through as raw HTML
 *   - Regular text → <p-text>
 *   - Empty lines → gap between blocks
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';
import { processDirectives } from './directives.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cacheDir = join(__dirname, '.pds-cache');

// ─── Load PDS partials from cache ───────────────────────────────────────────
const headHtml = readFileSync(join(cacheDir, 'head.html'), 'utf-8');
const bodyHtml = readFileSync(join(cacheDir, 'body.html'), 'utf-8');
const globalCss = readFileSync(join(cacheDir, 'global.css'), 'utf-8');

// ─── Parse input ────────────────────────────────────────────────────────────
const inputFile = process.argv[2];
if (!inputFile) {
  console.error('Usage: node build-slides.mjs <input.md>');
  process.exit(1);
}

const markdown = readFileSync(inputFile, 'utf-8');
const outputFile = inputFile.replace(/\.md$/, '.html');

// ─── Markdown → HTML conversion ─────────────────────────────────────────────

/**
 * Convert a single slide's markdown content to HTML.
 * HTML blocks (lines starting with `<`) are passed through untouched.
 */
/** Process inline Markdown: `code`, **bold**, *italic* */
function renderInline(text) {
  return text
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
}

function renderSlideContent(md) {
  const lines = md.split('\n');
  const output = [];
  let paragraphLines = [];
  let inHtmlBlock = false;
  let htmlBuffer = [];
  let htmlBlockCloseTag = null; // for script/style/pre: exact close tag to match
  let htmlBlockRootTag = null;  // for regular blocks: root tag name
  let htmlBlockDepth = 0;       // nesting depth for root tag
  let inList = false;
  let listItems = [];
  let inBlockquote = false;
  let blockquoteLines = [];

  const flushParagraph = () => {
    const text = paragraphLines.join(' ').trim();
    if (text) output.push(`<p-text>${renderInline(text)}</p-text>`);
    paragraphLines = [];
  };

  const flushList = () => {
    if (listItems.length === 0) return;
    output.push('<p-text-list>');
    listItems.forEach(item => {
      output.push(`  <p-text-list-item>${renderInline(item)}</p-text-list-item>`);
    });
    output.push('</p-text-list>');
    listItems = [];
    inList = false;
  };

  const flushBlockquote = () => {
    if (blockquoteLines.length === 0) return;
    // Last line starting with "—" or "-" is attribution
    let attribution = '';
    let quoteLines = [...blockquoteLines];
    if (quoteLines.length > 1 && /^[—–-]/.test(quoteLines[quoteLines.length - 1])) {
      attribution = quoteLines.pop();
    }
    const quote = quoteLines.join(' ').trim();
    output.push(`<div class="slide-blockquote">`);
    output.push(`  <p-text size="small" style="font-style: italic">${renderInline(quote)}</p-text>`);
    if (attribution) output.push(`  <p-text size="x-small" color="contrast-medium" class="quote-attribution">${renderInline(attribution)}</p-text>`);
    output.push(`</div>`);
    blockquoteLines = [];
    inBlockquote = false;
  };

  const flushHtmlBlock = () => {
    if (htmlBuffer.length > 0) {
      output.push(htmlBuffer.join('\n'));
      htmlBuffer = [];
    }
    inHtmlBlock = false;
    htmlBlockCloseTag = null;
    htmlBlockRootTag = null;
    htmlBlockDepth = 0;
  };

  let inCodeFence = false;
  let codeFenceLines = [];
  let inHtmlCodeFence = false;   // code fence detected while inside an HTML block
  let htmlCodeFenceLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // ── Continuation of a multi-line HTML block ──────────────────────────
    // Code fences inside HTML blocks (e.g. inside <p-tabs-item>) are converted
    // to <pre class="code"> before being added to the buffer.
    if (inHtmlBlock) {
      // Handle nested code fence
      if (inHtmlCodeFence) {
        if (trimmed === '```') {
          htmlBuffer.push('<pre class="code">' + htmlCodeFenceLines.join('\n') + '</pre>');
          inHtmlCodeFence = false;
          htmlCodeFenceLines = [];
        } else {
          htmlCodeFenceLines.push(line);
        }
        continue;
      }
      if (trimmed.startsWith('```')) {
        inHtmlCodeFence = true;
        htmlCodeFenceLines = [];
        continue;
      }

      htmlBuffer.push(line);
      if (htmlBlockCloseTag) {
        // Raw blocks (script/style/pre): only close on exact closing tag
        if (trimmed.toLowerCase() === htmlBlockCloseTag) {
          flushHtmlBlock();
        }
      } else if (htmlBlockRootTag) {
        // Track nesting depth for the root tag only
        const rt = htmlBlockRootTag.replace(/[-]/g, '\\-');
        if (new RegExp(`^<${rt}[\\s>]`, 'i').test(trimmed)) htmlBlockDepth++;
        if (new RegExp(`^<\\/${rt}\\s*>`, 'i').test(trimmed)) {
          htmlBlockDepth--;
          if (htmlBlockDepth === 0) flushHtmlBlock();
        }
      }
      continue;
    }

    // ── Fenced code block (``` ... ```) → <pre class="code"> ─────────────
    if (!inCodeFence && trimmed.startsWith('```')) {
      flushParagraph(); flushList();
      inCodeFence = true;
      codeFenceLines = [];
      continue;
    }
    if (inCodeFence) {
      if (trimmed === '```') {
        output.push('<pre class="code">' + codeFenceLines.join('\n') + '</pre>');
        inCodeFence = false;
        codeFenceLines = [];
      } else {
        codeFenceLines.push(line);
      }
      continue;
    }

    // ── Blockquote ───────────────────────────────────────────────────────
    if (trimmed.startsWith('> ')) {
      flushParagraph(); flushList();
      inBlockquote = true;
      blockquoteLines.push(trimmed.slice(2));
      continue;
    } else if (inBlockquote && trimmed !== '') {
      // continuation line without > prefix (attribution line like "— source")
      blockquoteLines.push(trimmed);
      continue;
    } else if (inBlockquote && trimmed === '') {
      flushBlockquote();
      // fall through to empty-line handling below
    }

    // ── Headings ─────────────────────────────────────────────────────────
    const h1 = trimmed.match(/^# (.+)/);
    const h2 = trimmed.match(/^## (.+)/);
    const h3 = trimmed.match(/^### (.+)/);

    if (h1) {
      flushParagraph(); flushList(); flushBlockquote();
      output.push(`<p-heading tag="h1" size="xx-large">${renderInline(h1[1])}</p-heading>`);
      continue;
    }
    if (h2) {
      flushParagraph(); flushList(); flushBlockquote();
      output.push(`<p-heading tag="h2" size="large">${renderInline(h2[1])}</p-heading>`);
      continue;
    }
    if (h3) {
      flushParagraph(); flushList(); flushBlockquote();
      output.push(`<p-heading tag="h3" size="medium">${renderInline(h3[1])}</p-heading>`);
      continue;
    }

    // ── List items ───────────────────────────────────────────────────────
    const listItem = trimmed.match(/^[-*] (.+)/);
    if (listItem) {
      flushParagraph(); flushBlockquote();
      inList = true;
      listItems.push(listItem[1]);
      continue;
    } else if (inList && trimmed !== '') {
      flushList();
    }

    // ── Raw HTML block ───────────────────────────────────────────────────
    if (trimmed.startsWith('<') && !trimmed.startsWith('<!--')) {
      flushParagraph(); flushList();
      // Check if single-line (self-closing or open+close on same line)
      const isSingleLine =
        trimmed.endsWith('/>') ||
        (trimmed.match(/<\/[a-z]/i) && trimmed.match(/^<[a-z]/i)) ||
        trimmed.match(/^<(br|hr|img|input|link|meta|source)/i);

      if (isSingleLine) {
        output.push(line);
      } else {
        inHtmlBlock = true;
        htmlBuffer = [line];
        // Raw blocks (script/style/pre) close only on their exact closing tag
        const rawTagMatch = trimmed.match(/^<(script|style|pre)[\s>]/i);
        if (rawTagMatch) {
          htmlBlockCloseTag = `</${rawTagMatch[1].toLowerCase()}>`;
        } else {
          // Regular blocks: track nesting by root tag name
          const rootTagMatch = trimmed.match(/^<([a-z][a-z0-9-]*)[\s>]/i);
          htmlBlockRootTag = rootTagMatch ? rootTagMatch[1].toLowerCase() : null;
          htmlBlockDepth = 1;
        }
      }
      continue;
    }

    // ── Empty line ───────────────────────────────────────────────────────
    if (trimmed === '') {
      flushParagraph();
      flushList();
      if (output.length > 0) output.push('<div style="height: var(--p-spacing-static-md)"></div>');
      continue;
    }

    // ── Regular text ─────────────────────────────────────────────────────
    paragraphLines.push(trimmed);
  }

  flushParagraph();
  flushList();
  flushBlockquote();
  if (inHtmlBlock) flushHtmlBlock();

  return output.join('\n');
}

/**
 * Parse all slides from markdown.
 * Returns array of { cls, content }
 */
function parseSlides(md) {
  // Split on `---` that appears on its own line
  const rawSlides = md.split(/\n---\n|\n---$/);

  return rawSlides.map(raw => {
    const trimmed = raw.trim();
    if (!trimmed) return null;

    let cls = '';
    let body = trimmed;

    // Extract <!-- class: xxx --> directive from first line (supports multiple space-separated classes)
    const classMatch = trimmed.match(/^<!--\s*class:\s*([^>]+?)\s*-->\s*\n?/);
    if (classMatch) {
      cls = classMatch[1];
      body = trimmed.slice(classMatch[0].length).trim();
    }

    // Extract <!-- layout: xxx --> for layout variant
    const layoutMatch = body.match(/^<!--\s*layout:\s*([^\s>]+)\s*-->\s*\n?/);
    if (layoutMatch) {
      cls = (cls + ' slide--' + layoutMatch[1]).trim();
      body = body.slice(layoutMatch[0].length).trim();
    }

    // Process ::: directives before markdown rendering
    const expanded = processDirectives(body, renderSlideContent);
    return { cls, content: renderSlideContent(expanded) };
  }).filter(Boolean);
}

// ─── Build HTML ─────────────────────────────────────────────────────────────

// Detect optional <!-- lang: xx --> directive at the top of the file
const langMatch = markdown.match(/<!--\s*lang:\s*([a-z-]{2,5})\s*-->/);
const lang = langMatch ? langMatch[1] : 'de';

const slides = parseSlides(markdown);
const slideCount = slides.length;

const rawSlideHtml = slides.map((slide, i) => {
  const classes = ['slide', slide.cls].filter(Boolean).join(' ');
  return `
    <section class="${classes}" data-index="${i}">
      <div class="slide-body">
        ${slide.content}
      </div>
    </section>`;
}).join('\n');

// Hoist <style> and <script> blocks out of slide bodies into <head> / before </body>
let slideHeadCss = '';
let slideBodyJs = '';
const slideHtml = rawSlideHtml
  .replace(/<style[\s\S]*?<\/style>/gi, match => { slideHeadCss += '\n' + match; return ''; })
  .replace(/<script[\s\S]*?<\/script>/gi, match => { slideBodyJs += '\n' + match; return ''; });

const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Presentation</title>
  ${headHtml}
  ${slideHeadCss}
  <style>
    ${globalCss}

    /* ── Base ── */
    :not(:defined) { visibility: hidden; }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --p-color-canvas:           light-dark(#fff, hsl(225 66.7% 1.2%));
      --p-color-surface:          light-dark(hsl(240 10% 95%), hsl(240 2% 10%));
      --p-color-frosted:          light-dark(hsl(240 5% 70% / 0.148), hsl(240 2% 43% / 0.228));
      --p-color-frosted-strong:   light-dark(hsl(236 6.5% 42% / 0.236), hsl(240 1.5% 61.8% / 0.302));
      --p-color-contrast-medium:  light-dark(hsl(240 6.1% 7% / 0.6), hsl(240 12.5% 96.9% / 0.56));
      --p-color-contrast-lower:   light-dark(hsl(234 6% 32.9% / 0.324), hsl(240 1.5% 61.8% / 0.302));
      --p-color-primary:          light-dark(hsl(225 66.7% 1.2%), hsl(225 100% 99%));
      --p-color-success:          light-dark(hsl(115 77.5% 27.8%), hsl(157 84.9% 41.6%));
      --p-color-warning:          light-dark(hsl(28 97.7% 34.1%), hsl(28 90.2% 56.1%));
      --p-color-error:            light-dark(hsl(357 78% 41%), hsl(0 96.9% 62%));
      --p-color-info:             light-dark(hsl(228 83.2% 51%), hsl(210 100% 54.5%));
      --porsche-red:              light-dark(#c4001a, #ff4d6a);
      --footer-h: var(--p-spacing-static-xl);
    }

    html, body {
      font-family: "Porsche Next", "Arial Narrow", Arial, sans-serif;
      height: 100%;
      overflow: hidden;
      background: var(--p-color-canvas);
      color: var(--p-color-primary);
      font-size: 118%;
    }

    /* ── Slide Deck ── */
    .slide-deck {
      height: 100vh;
      width: 100vw;
      display: flex;
      flex-direction: row;
      overflow-x: scroll;
      overflow-y: hidden;
      scroll-snap-type: x mandatory;
      scroll-behavior: smooth;
    }
    .slide-deck::-webkit-scrollbar { display: none; }
    .slide-deck { -ms-overflow-style: none; scrollbar-width: none; }

    /* ── Single Slide ── */
    section.slide {
      height: 100vh;
      width: 100vw;
      flex-shrink: 0;
      scroll-snap-align: start;
      scroll-snap-stop: always;
      display: flex;
      flex-direction: column;
      padding: var(--p-spacing-static-xl) clamp(var(--p-spacing-static-lg), 5vw, var(--p-spacing-static-2xl)) var(--p-spacing-static-md);
      position: relative;
      background: var(--p-color-canvas);
      overflow: hidden;
    }
    /* Scroll-snap needs the full viewport height on the snap container child */
    section.slide::after {
      content: '';
      display: block;
      height: var(--footer-h);
      flex-shrink: 0;
    }

    .slide-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      gap: var(--p-spacing-static-sm);
      overflow-y: auto;
      min-height: 0;
      padding-top: var(--p-spacing-static-md);
      padding-bottom: var(--p-spacing-static-md);
    }

    /* Default spacing for PDS text elements so they never stick together */
    p-text, p-heading, p-text-list { display: block; }
    p-text + p-text { margin-top: var(--p-spacing-static-xs); }
    p-heading + p-text { margin-top: var(--p-spacing-static-sm); }
    p-text + p-heading { margin-top: var(--p-spacing-static-md); }

    /* ── Code blocks ── */
    /* Follow light/dark theme of the presentation */
    pre.code, div.code {
      font-family: 'SFMono-Regular', 'Consolas', 'Menlo', monospace;
      font-size: .72rem;
      line-height: 1.9;
      background: light-dark(#f6f8fa, #0d1117);
      color:      light-dark(#1f2328, #e6edf3);
      border-radius: 7px;
      padding: .75rem 1rem;
      white-space: pre;
      overflow-x: auto;
    }
    /* Syntax highlight helpers — add class to <span> inside pre.code */
    pre.code .kw  { color: light-dark(#8250df, #c084fc) }  /* keyword   */
    pre.code .fn  { color: light-dark(#0550ae, #79c0ff) }  /* function  */
    pre.code .str { color: light-dark(#0a3069, #fbbf24) }  /* string    */
    pre.code .val { color: light-dark(#116329, #7ee787) }  /* value     */
    pre.code .com { color: light-dark(#6e7781, #6e7681); font-style: italic } /* comment */
    pre.code .ann { color: light-dark(#cf222e, #ff7b72) }  /* annotation */
    pre.code .hl  { background: light-dark(rgba(251,191,36,.15), rgba(251,191,36,.1));
                    display: block; margin: 0 -1rem; padding: 0 1rem;
                    border-left: 2px solid #fbbf24 }  /* highlight yellow */
    pre.code .hlg { background: light-dark(rgba(31,136,61,.1), rgba(126,231,135,.1));
                    display: block; margin: 0 -1rem; padding: 0 1rem;
                    border-left: 2px solid #7ee787 }  /* highlight green  */
    pre.code .diff-del { color: light-dark(#cf222e, #ff7b72) }
    pre.code .diff-add { color: light-dark(#116329, #7ee787) }

    /* ── Blockquote ── */
    .slide-blockquote {
      border-left: 3px solid var(--p-color-success);
      padding: var(--p-spacing-static-md) 24px;
      background: var(--p-color-surface);
      border-radius: 0 8px 8px 0;
    }
    .quote-attribution { display: block; margin-top: var(--p-spacing-static-sm); }

    /* ── Slide Variants ── */
    section.slide:not(.slide--cover) {
      text-align: left;
    }
    section.slide.slide--cover {
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    section.slide.slide--cover .slide-body {
      align-items: center;
      justify-content: center;
    }

    /* ── Fixed Footer ── */
    .deck-footer {
      position: fixed;
      bottom: 0; left: 0; right: 0;
      height: auto;
      min-height: var(--footer-h);
      background: var(--p-color-frosted);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--p-spacing-static-xs) var(--p-spacing-static-lg);
      z-index: 100;
    }
    /* Auto-scheme the footer independently of the global theme */
    .deck-footer.scheme-light { color-scheme: light; }
    .deck-footer.scheme-dark  { color-scheme: dark; }

    .footer-left { display: flex; align-items: center; gap: var(--p-spacing-static-sm); min-width: 80px; }

    .footer-center { position: absolute; left: 50%; transform: translateX(-50%); display: flex; align-items: center; }
    .footer-right { display: flex; align-items: center; gap: var(--p-spacing-static-sm); }

    /* ── Fullscreen: hide nav buttons, keep theme toggle ── */
    :fullscreen .footer-nav { display: none; }
    :-webkit-full-screen .footer-nav { display: none; }

    .footer-page {
      font-size: 12px;
      color: var(--p-color-primary);
      font-variant-numeric: tabular-nums;
    }

    /* ── Keyboard hint ── */
    .key-hint {
      position: fixed;
      bottom: calc(var(--footer-h) + 12px);
      left: 50%;
      transform: translateX(-50%);
      background: var(--p-color-surface);
      border: 1px solid var(--p-color-frosted-strong);
      border-radius: 8px;
      padding: var(--p-spacing-static-xs) var(--p-spacing-static-sm);
      font-size: 11px;
      color: var(--p-color-contrast-medium);
      opacity: 1;
      transition: opacity 0.6s;
      z-index: 101;
      pointer-events: none;
      white-space: nowrap;
    }
    .key-hint.hidden { opacity: 0; }
    .key-hint kbd {
      display: inline-block;
      padding: 2px var(--p-spacing-static-xs);
      border: 1px solid var(--p-color-frosted-strong);
      border-radius: 4px;
      font-family: inherit;
      font-size: 10px;
      background: var(--p-color-canvas);
    }

    /* ── Extra Slide Variants ── */
    section.slide.slide--dark {
      background: hsl(225 66.7% 1.2%);
      color-scheme: dark;
    }
    section.slide.slide--accent {
      background: linear-gradient(135deg, hsl(357 78% 35%) 0%, hsl(357 78% 22%) 100%);
      color-scheme: dark;
    }

    /* ── Overflow / Scrollable Slides ── */
    section.slide.slide--overflow {
      overflow: hidden;
    }
    section.slide.slide--overflow .slide-body {
      justify-content: flex-start;
      overflow-y: auto;
      min-height: 0;
      overscroll-behavior: contain;
      padding-bottom: var(--p-spacing-static-md);
    }

    /* ── Content Grids ── */
    .grid-2, .grid-3, .grid-4 { margin-top: var(--p-spacing-static-md); }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: var(--p-spacing-static-md); }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--p-spacing-static-md); }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--p-spacing-static-md); }
    @media (max-width: 960px) {
      .grid-3, .grid-4 { grid-template-columns: 1fr 1fr; }
    }

    /* ── Cards ── */
    .card {
      background: var(--p-color-surface);
      border-radius: 24px;
      padding: var(--p-spacing-static-md);
    }
    .card p-text, .card p-heading { margin-top: 0; margin-bottom: 0; }
    p-inline-notification { display: block; margin-top: var(--p-spacing-static-md); }
    .card-frosted {
      background: var(--p-color-frosted);
      border-radius: 24px;
      padding: var(--p-spacing-static-md);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
    }

    /* ── Stats / KPIs ── */
    .stat { display: flex; flex-direction: column; gap: var(--p-spacing-static-xs); }
    .stat-value {
      font-size: clamp(2rem, 5vw, 3.5rem);
      line-height: 1;
      letter-spacing: -0.02em;
    }
    .stat-delta {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.8125rem;
    }
    .stat-delta--up   { color: var(--p-color-success); }
    .stat-delta--down { color: var(--p-color-error); }
    .stat-label {
      font-size: 0.875rem;
      color: var(--p-color-contrast-medium);
    }

    /* ── Badges ── */
    .badge {
      display: inline-flex; align-items: center; gap: var(--p-spacing-static-xs);
      font-size: 0.75rem;
      padding: var(--p-spacing-static-xs) var(--p-spacing-static-sm);
      border-radius: 100px;
      background: var(--p-color-surface);
    }
    .badge--success { background: light-dark(hsl(115 77.5% 90%), hsl(115 20% 12%)); color: var(--p-color-success); border-color: var(--p-color-success); }
    .badge--warning { background: light-dark(hsl(40 97% 93%), hsl(40 40% 12%));     color: var(--p-color-warning); border-color: var(--p-color-warning); }
    .badge--error   { background: light-dark(hsl(357 78% 93%), hsl(357 40% 12%));   color: var(--p-color-error);   border-color: var(--p-color-error);   }
    .badge--info    { background: light-dark(hsl(228 83% 93%), hsl(228 40% 12%));   color: var(--p-color-info);    border-color: var(--p-color-info);    }

    /* ── Animations ── */
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(var(--p-spacing-static-md)); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    /* Elements only animate when their slide becomes active (via IntersectionObserver) */
    .anim-fade-up { opacity: 0; }
    section.slide.is-active .anim-fade-up {
      animation: fadeInUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    /* Stagger all direct children inside .anim-stagger */
    .anim-stagger > * { opacity: 0; }
    section.slide.is-active .anim-stagger > *:nth-child(1) { animation: fadeInUp 0.45s 0.00s cubic-bezier(0.16, 1, 0.3, 1) both; }
    section.slide.is-active .anim-stagger > *:nth-child(2) { animation: fadeInUp 0.45s 0.08s cubic-bezier(0.16, 1, 0.3, 1) both; }
    section.slide.is-active .anim-stagger > *:nth-child(3) { animation: fadeInUp 0.45s 0.16s cubic-bezier(0.16, 1, 0.3, 1) both; }
    section.slide.is-active .anim-stagger > *:nth-child(4) { animation: fadeInUp 0.45s 0.24s cubic-bezier(0.16, 1, 0.3, 1) both; }
    section.slide.is-active .anim-stagger > *:nth-child(5) { animation: fadeInUp 0.45s 0.32s cubic-bezier(0.16, 1, 0.3, 1) both; }
    section.slide.is-active .anim-stagger > *:nth-child(6) { animation: fadeInUp 0.45s 0.40s cubic-bezier(0.16, 1, 0.3, 1) both; }
  </style>
</head>
<body>

  <div class="slide-deck" id="deck">
    ${slideHtml}
  </div>

  <!-- Fixed navigation footer -->
  <footer class="deck-footer">
    <div class="footer-left">
      <span class="footer-page" id="pageLabel">1 / ${slideCount}</span>
      <p-button id="btnTheme" size="small" hide-label="true" variant="secondary" compact="true"
        icon-source="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E%3Cpath%20d%3D%22M12.5%2020a8.5%208.5%200%201%201-.01-16.99A8.5%208.5%200%200%201%2012.5%2020m0-16C8.4%204%205%207.4%205%2011.5S8.4%2019%2012.5%2019z%22%2F%3E%3C%2Fsvg%3E"
        aria="{'aria-label': 'Farbschema wechseln'}">Theme</p-button>
      <p-select id="fontSizeSelect" name="fontSize" hide-label="true" compact="true" value="1" style="width:7rem">
        <p-select-option value="1">100%</p-select-option>
        <p-select-option value="1.5">150%</p-select-option>
      </p-select>
    </div>
    <div class="footer-center">
      <p-wordmark size="inherit" style="height: 10px;"></p-wordmark>
    </div>
    <div class="footer-right">
      <span class="footer-nav" style="display:flex;align-items:center;gap:0.5rem">
        <p-button id="btnFirst" size="small" hide-label="true" disabled variant="secondary" compact="true"
          icon="arrow-first"
          aria="{'aria-label': 'Erste Slide'}">Erste</p-button>
        <p-button id="btnPrev" size="small" hide-label="true" disabled variant="secondary" compact="true"
          icon-source="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E%3Cpath%20d%3D%22m8.88%2012%205.48-6.5.76.64L10.2%2012l4.93%205.86-.76.64z%22%2F%3E%3C%2Fsvg%3E"
          aria="{'aria-label': 'Vorherige Slide'}">Zurück</p-button>
        <p-button id="btnNext" size="small" hide-label="true" variant="secondary" compact="true"
          icon-source="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E%3Cpath%20d%3D%22M15.12%2012%209.64%205.5l-.77.64L13.83%2012l-4.94%205.86.76.64z%22%2F%3E%3C%2Fsvg%3E"
          aria="{'aria-label': 'Nächste Slide'}">Weiter</p-button>
        <p-button id="btnLast" size="small" hide-label="true" variant="secondary" compact="true"
          icon="arrow-last"
          aria="{'aria-label': 'Letzte Slide'}">Letzte</p-button>
      </span>
    </div>
  </footer>

  <div class="key-hint" id="keyHint">
    <kbd>←</kbd> <kbd>→</kbd> navigieren &nbsp;·&nbsp; <kbd>F</kbd> Vollbild
  </div>

  ${bodyHtml}
  ${slideBodyJs}

  <script>
    const deck = document.getElementById('deck');
    const btnFirst = document.getElementById('btnFirst');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const btnLast = document.getElementById('btnLast');
    const pageLabel = document.getElementById('pageLabel');
    const keyHint = document.getElementById('keyHint');
    const slides = deck.querySelectorAll('section.slide');
    const total = slides.length;
    let current = 0;

    // ── Contrast-aware footer theming ───────────────────────────────────────
    function getLuminance(r, g, b) {
      return [r, g, b].reduce((sum, c, i) => {
        c /= 255;
        c = c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        return sum + c * [0.2126, 0.7152, 0.0722][i];
      }, 0);
    }
    const footer = document.querySelector('.deck-footer');
    function updateFooterScheme(slideEl) {
      const bg = getComputedStyle(slideEl).backgroundColor;
      const m  = bg.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)/);
      let scheme;
      if (m) {
        const aMatch = bg.match(/,\\s*([\\d.]+)\\)$/);
        const alpha  = aMatch ? +aMatch[1] : 1;
        if (!(+m[1] === 0 && +m[2] === 0 && +m[3] === 0 && alpha === 0)) {
          scheme = getLuminance(+m[1], +m[2], +m[3]) > 0.35 ? 'light' : 'dark';
        }
      }
      if (!scheme) {
        scheme = slideEl.classList.contains('slide--dark') || slideEl.classList.contains('slide--accent')
          ? 'dark'
          : (document.documentElement.classList.contains('scheme-dark') ? 'dark' : 'light');
      }
      footer.classList.remove('scheme-light', 'scheme-dark');
      footer.classList.add('scheme-' + scheme);
    }

    function goTo(n) {
      n = Math.max(0, Math.min(total - 1, n));
      current = n;
      slides[n].scrollIntoView({ behavior: 'smooth' });
      pageLabel.textContent = (current + 1) + ' / ' + total;
      current === 0 ? btnFirst.setAttribute('disabled', '') : btnFirst.removeAttribute('disabled');
      current === 0 ? btnPrev.setAttribute('disabled', '')  : btnPrev.removeAttribute('disabled');
      current === total - 1 ? btnNext.setAttribute('disabled', '')  : btnNext.removeAttribute('disabled');
      current === total - 1 ? btnLast.setAttribute('disabled', '')  : btnLast.removeAttribute('disabled');
      updateFooterScheme(slides[n]);
    }

    btnFirst.addEventListener('click', () => goTo(0));
    btnPrev.addEventListener('click',  () => goTo(current - 1));
    btnNext.addEventListener('click',  () => goTo(current + 1));
    btnLast.addEventListener('click',  () => goTo(total - 1));

    const btnTheme = document.getElementById('btnTheme');
    const schemes = ['scheme-light', 'scheme-dark'];
    let schemeIdx = window.matchMedia('(prefers-color-scheme: dark)').matches ? 1 : 0;
    function applyScheme() {
      document.documentElement.classList.remove(...schemes);
      document.documentElement.classList.add(schemes[schemeIdx]);
    }
    applyScheme();
    btnTheme.addEventListener('click', () => {
      schemeIdx = (schemeIdx + 1) % schemes.length;
      applyScheme();
      updateFooterScheme(slides[current]);
    });

    // ── Font size scaling ────────────────────────────────────────────────────
    const fontSizeSelect = document.getElementById('fontSizeSelect');
    fontSizeSelect.addEventListener('change', (e) => {
      document.documentElement.style.fontSize = (parseFloat(e.detail.value) * 100) + '%';
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault(); goTo(current + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault(); goTo(current - 1);
      } else if (e.key === 'f' || e.key === 'F') {
        document.fullscreenElement
          ? document.exitFullscreen()
          : document.documentElement.requestFullscreen();
      }
    });

    // Sync current index when scrolling manually; drive entry animations via .is-active
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = parseInt(entry.target.dataset.index, 10);
          current = idx;
          pageLabel.textContent = (current + 1) + ' / ' + total;
          current === 0 ? btnFirst.setAttribute('disabled', '') : btnFirst.removeAttribute('disabled');
          current === 0 ? btnPrev.setAttribute('disabled', '')  : btnPrev.removeAttribute('disabled');
          current === total - 1 ? btnNext.setAttribute('disabled', '')  : btnNext.removeAttribute('disabled');
          current === total - 1 ? btnLast.setAttribute('disabled', '')  : btnLast.removeAttribute('disabled');
          entry.target.classList.add('is-active');
          updateFooterScheme(entry.target);
          restartSlideAnimations(entry.target);
        } else {
          entry.target.classList.remove('is-active');
          pauseSlideAnimations(entry.target);
        }
      });
    }, { threshold: 0.6 });

    // Custom looping animations (SVG SMIL + CSS keyframe) should always start
    // fresh from the beginning when a slide becomes active, rather than
    // continuing to run in the background or resuming mid-cycle.
    function restartSlideAnimations(slide) {
      slide.querySelectorAll('svg.flow-svg').forEach(svg => {
        if (typeof svg.unpauseAnimations === 'function') svg.unpauseAnimations();
        if (typeof svg.setCurrentTime === 'function') svg.setCurrentTime(0);
      });
      slide.querySelectorAll('.js-restart-on-active').forEach(el => {
        el.style.animationName = 'none';
        void el.offsetWidth; // force reflow so the animation restarts from 0
        el.style.animationName = '';
      });
    }
    function pauseSlideAnimations(slide) {
      slide.querySelectorAll('svg.flow-svg').forEach(svg => {
        if (typeof svg.pauseAnimations === 'function') svg.pauseAnimations();
      });
    }

    slides.forEach(s => observer.observe(s));
    // Pause any custom SVG animations that live outside the first slide so
    // they don't silently run in the background before the user reaches them.
    slides.forEach((s, i) => { if (i !== 0) pauseSlideAnimations(s); });
    // Activate first slide immediately so animations play on load
    if (slides.length > 0) {
      slides[0].classList.add('is-active');
      updateFooterScheme(slides[0]);
      restartSlideAnimations(slides[0]);
    }

    // Fade out keyboard hint after 3s
    setTimeout(() => keyHint.classList.add('hidden'), 3000);

    // ── Semi-bold headings inside cards ─────────────────────────────────────
    customElements.whenDefined('p-heading').then(() => {
      document.querySelectorAll('.card p-heading').forEach(el => {
        if (el.shadowRoot) {
          const s = document.createElement('style');
          s.textContent = 'h1,h2,h3,h4,h5,h6{font-weight:600!important}';
          el.shadowRoot.appendChild(s);
        }
      });
    });
  </script>
</body>
</html>`;

writeFileSync(outputFile, html, 'utf-8');
console.log(`✓ Built: ${outputFile} (${slideCount} slide${slideCount !== 1 ? 's' : ''})`);
