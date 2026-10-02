/**
 * PDS Partials Helper
 *
 * Generates the HTML snippets needed to bootstrap PDS components
 * in a standalone HTML file (no bundler required).
 *
 * Usage:
 *   node pds-partials.mjs              → prints JSON with head/body partials
 *   node pds-partials.mjs --head       → prints only <head> partials
 *   node pds-partials.mjs --body       → prints only <body> partials
 *   node pds-partials.mjs --css        → prints the global stylesheet content
 *   node pds-partials.mjs --full-html  → prints a complete minimal HTML skeleton
 */

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  getLoaderScript,
  getFontLinks,
  getMetaTagsAndIconLinks,
} from '@porsche-design-system/components-js/partials';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Resolve CSS from the script dir first (refresh-cache.sh installs there),
// then fall back to project root (cwd). PDS v4.2 moved global styles from
// global-styles/index.css to stylesheets/index.css — try both.
const PDS_CSS_RELS = [
  'node_modules/@porsche-design-system/components-js/stylesheets/index.css',
  'node_modules/@porsche-design-system/components-js/global-styles/index.css',
];
const cssCandidates = [__dirname, process.cwd()].flatMap((base) =>
  PDS_CSS_RELS.map((rel) => join(base, rel))
);
const cssPath = cssCandidates.find(existsSync);
if (!cssPath) {
  console.error('Error: @porsche-design-system/components-js not found.\nRun: npm install @porsche-design-system/components-js');
  process.exit(1);
}
const globalCSS = readFileSync(cssPath, 'utf-8');

const fontFace = `<style>
@font-face {
  font-family: "Porsche Next";
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  src: url("https://cdn.ui.porsche.com/porsche-design-system/fonts/porsche-next-latin-regular.b8f1c20.woff2") format("woff2");
}
@font-face {
  font-family: "Porsche Next";
  font-weight: 600;
  font-style: normal;
  font-display: swap;
  src: url("https://cdn.ui.porsche.com/porsche-design-system/fonts/porsche-next-latin-semi-bold.b5f6fca.woff2") format("woff2");
}
</style>`;

const headPartials = [
  fontFace,
  getFontLinks(),
  getMetaTagsAndIconLinks({ appTitle: 'UX Dashboard' }),
].join('\n');

const bodyPartials = getLoaderScript();

const flag = process.argv[2];

if (flag === '--head') {
  process.stdout.write(headPartials);
} else if (flag === '--body') {
  process.stdout.write(bodyPartials);
} else if (flag === '--css') {
  process.stdout.write(globalCSS);
} else if (flag === '--full-html') {
  const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UX Dashboard</title>
  ${headPartials}
  <style>
    ${globalCSS}
    :not(:defined) { visibility: hidden; }
  </style>
</head>
<body>
  <!-- PDS components go here -->
  ${bodyPartials}
</body>
</html>`;
  process.stdout.write(html);
} else {
  // Default: JSON output
  console.log(JSON.stringify({ headPartials, bodyPartials, globalCSS }, null, 2));
}
