#!/usr/bin/env node
/**
 * download-figma-images.mjs
 *
 * Resolves Figma IMAGE fill hashes to S3 download URLs and saves them locally.
 * Used for tile/card background images that are not exposed as MCP asset URLs
 * in get_design_context output.
 *
 * ── Mode A — hash mode (preferred: raw fill image, no UI overlay) ─────────────
 *
 *   node scripts/download-figma-images.mjs \
 *     --file-key FILE_KEY \
 *     --hashes "tile-1.jpg:abc123hash,tile-2.jpg:def456hash" \
 *     --out-dir src/assets/figma
 *
 *   API: GET /v1/files/{fileKey}/images
 *   Returns a map { imageHash → S3 url } for every fill in the file.
 *   The hash value comes from fills[].imageHash in the node data
 *   (visible in get_design_context / get_metadata output).
 *
 * ── Mode B — render mode (fallback: renders node as jpg) ─────────────────────
 *
 *   node scripts/download-figma-images.mjs \
 *     --file-key FILE_KEY \
 *     --render-ids "tile-1.jpg:1-23,tile-2.jpg:4-56" \
 *     --out-dir src/assets/figma \
 *     --scale 2
 *
 *   API: GET /v1/images/{fileKey}?ids={nodeId}&format=jpg&scale=2
 *   Renders the entire node (including UI overlays) as a jpg.
 *   Use as fallback when the imageHash is unavailable.
 *
 * ── Requirements ──────────────────────────────────────────────────────────────
 *
 *   FIGMA_ACCESS_TOKEN must be set in the environment.
 *   Node.js 18+ (uses native fetch + Buffer).
 */

import { writeFileSync, mkdirSync } from 'node:fs'
import { join }                     from 'node:path'
import { parseArgs }                from 'node:util'

const { values } = parseArgs({
  options: {
    'file-key':   { type: 'string' },
    hashes:       { type: 'string' },     // "name.jpg:hash,name.jpg:hash"
    'render-ids': { type: 'string' },     // "name.jpg:nodeId,name.jpg:nodeId"
    'out-dir':    { type: 'string', default: 'src/assets/figma' },
    format:       { type: 'string', default: 'jpg' },
    scale:        { type: 'string', default: '2' },
  },
  strict: true,
})

// ── Validation ────────────────────────────────────────────────────────────────

const TOKEN = process.env.FIGMA_ACCESS_TOKEN
if (!TOKEN) {
  console.error('✗  FIGMA_ACCESS_TOKEN is not set')
  process.exit(1)
}
if (!values['file-key']) {
  console.error('✗  --file-key is required')
  process.exit(1)
}
if (!values['hashes'] && !values['render-ids']) {
  console.error('✗  Provide --hashes (mode A) or --render-ids (mode B)')
  process.exit(1)
}

const fileKey = values['file-key']
const outDir  = values['out-dir']
const headers = { 'X-Figma-Token': TOKEN }

mkdirSync(outDir, { recursive: true })

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Parse "name:value,name:value" pairs */
function parsePairs(raw) {
  return raw.split(',').map((p) => {
    const idx = p.indexOf(':')
    if (idx === -1) throw new Error(`Invalid pair (expected "name:value"): ${p}`)
    return { name: p.slice(0, idx).trim(), id: p.slice(idx + 1).trim() }
  })
}

/** Download a URL to a local file path */
async function downloadUrl(url, destPath) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} downloading ${url}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  writeFileSync(destPath, buffer)
}

// ── Mode A: imageHash → raw fill S3 URL ──────────────────────────────────────

async function runHashMode(pairs) {
  const endpoint = `https://api.figma.com/v1/files/${fileKey}/images`
  const res = await fetch(endpoint, { headers })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Figma API /files/images error ${res.status}: ${body}`)
  }
  const data = await res.json()
  // Response shape: { meta: { images: { "<hash>": "<url>", … } } }
  const map = data?.meta?.images ?? {}

  for (const { name, id: hash } of pairs) {
    const url = map[hash]
    if (!url) {
      console.warn(`  ⚠  imageHash not found in file — skipping: ${hash}`)
      continue
    }
    const dest = join(outDir, name)
    await downloadUrl(url, dest)
    console.log(`  ✓  ${name}  ←  hash ${hash.slice(0, 8)}…`)
  }
}

// ── Mode B: nodeId → rendered jpg (fallback) ──────────────────────────────────

async function runRenderMode(pairs) {
  // Figma nodeIds use ":" internally but "-" in URLs — normalise both directions
  const canonicalIds = pairs.map((p) => p.id.replace(/-/g, ':'))
  const idsParam     = encodeURIComponent(canonicalIds.join(','))
  const endpoint     =
    `https://api.figma.com/v1/images/${fileKey}` +
    `?ids=${idsParam}&format=${values.format}&scale=${values.scale}`

  const res = await fetch(endpoint, { headers })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Figma API /images error ${res.status}: ${body}`)
  }
  const data = await res.json()
  // Response shape: { images: { "<nodeId>": "<url>", … } }
  const imgs = data?.images ?? {}

  for (const { name, id } of pairs) {
    const canonical = id.replace(/-/g, ':')
    const url = imgs[canonical]
    if (!url) {
      console.warn(`  ⚠  no render URL for nodeId — skipping: ${id}`)
      continue
    }
    const dest = join(outDir, name)
    await downloadUrl(url, dest)
    console.log(`  ✓  ${name}  ←  node ${id}`)
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

console.log(`Figma image download  →  ${outDir}`)
if (values['hashes'])       await runHashMode(parsePairs(values['hashes']))
if (values['render-ids'])   await runRenderMode(parsePairs(values['render-ids']))
console.log('Done.')
