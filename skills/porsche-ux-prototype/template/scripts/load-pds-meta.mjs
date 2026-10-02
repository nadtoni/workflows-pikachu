/**
 * load-pds-meta.mjs
 *
 * Reads the installed PDS React typings and produces a whitelist of allowed
 * string-literal values for every component prop that is typed as a union of
 * string literals.
 *
 * Sources (all in node_modules):
 *   - components-react/esm/lib/types.d.ts       → type aliases + const arrays
 *   - components-react/esm/lib/components/*.d.ts → PXxxProps prop→type map
 *
 * Output shape:
 *   {
 *     enums: { HeadingSize: ['2xs','xs',...], IconName: [...], ... },
 *     components: { PHeading: { size: 'HeadingSize', tag: 'HeadingTag', ... }, ... }
 *   }
 *
 * Pure parse — runs in ~30ms on first call, then cached in module scope.
 */

import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const LIB = join(ROOT, 'node_modules/@porsche-design-system/components-react/esm/lib')

let cache = null

export function loadPdsMeta() {
  if (cache) return cache

  const typesPath = join(LIB, 'types.d.ts')
  const compDir = join(LIB, 'components')

  let typesSrc
  try {
    typesSrc = readFileSync(typesPath, 'utf8')
  } catch {
    return { enums: {}, components: {}, error: `not found: ${typesPath}` }
  }

  // --- 1. Extract `declare const FOO: readonly [ "a", "b", ... ]` -----------
  const constArrays = new Map() // FOO → [a,b,...]
  const CONST_RE = /declare const ([A-Z0-9_]+): readonly \[([\s\S]*?)\]/g
  for (const m of typesSrc.matchAll(CONST_RE)) {
    const name = m[1]
    const values = [...m[2].matchAll(/"([^"]+)"/g)].map((x) => x[1])
    constArrays.set(name, values)
  }

  // --- 2. Extract `export type X = (typeof FOO)[number]` --------------------
  const enums = {} // typeName → values
  const ALIAS_RE = /export type ([A-Za-z0-9]+) = \(?typeof ([A-Z0-9_]+)\)?\[number\]/g
  for (const m of typesSrc.matchAll(ALIAS_RE)) {
    const [, typeName, constName] = m
    if (constArrays.has(constName)) enums[typeName] = constArrays.get(constName)
  }

  // Plain unions like `export type X = "a" | "b" | "c"`
  const UNION_RE = /export type ([A-Za-z0-9]+) = ((?:"[^"]+"\s*\|\s*)+"[^"]+")\s*;/g
  for (const m of typesSrc.matchAll(UNION_RE)) {
    if (enums[m[1]]) continue
    enums[m[1]] = [...m[2].matchAll(/"([^"]+)"/g)].map((x) => x[1])
  }

  // Alias chains:
  //   `type ButtonIcon = LinkButtonIconName;`              (pure alias)
  //   `type LinkButtonIconName = IconName | "none";`      (alias + extras)
  //   `type InlineNotificationActionIcon = IconName;`     (pure alias)
  const ALIAS_TO_ALIAS_RE =
    /export type ([A-Za-z0-9]+) = ([A-Za-z0-9]+)((?:\s*\|\s*"[^"]+")*)\s*;/g
  // Three passes to resolve longer chains.
  for (let pass = 0; pass < 3; pass++) {
    for (const m of typesSrc.matchAll(ALIAS_TO_ALIAS_RE)) {
      const [, name, ref, extras] = m
      if (enums[name]) continue
      if (!enums[ref]) continue
      const extra = [...extras.matchAll(/"([^"]+)"/g)].map((x) => x[1])
      enums[name] = [...enums[ref], ...extra]
    }
  }

  // --- 3. Walk components/*.wrapper.d.ts ------------------------------------
  const components = {} // PHeading → { propName: typeName }
  let compFiles = []
  try {
    compFiles = readdirSync(compDir).filter((f) => f.endsWith('.wrapper.d.ts'))
  } catch {
    return { enums, components, error: `not found: ${compDir}` }
  }

  // Match `export type PXxxProps = ... & { ... };` — capture the prop block.
  const PROP_BLOCK_RE = /export type (P[A-Za-z0-9]+)Props\b[^{]*\{([\s\S]*?)\n\};/g
  const PROP_LINE_RE =
    /^\s*([a-zA-Z][a-zA-Z0-9-]*)\??:\s*(?:BreakpointCustomizable<\s*([A-Za-z0-9]+)\s*>|([A-Za-z0-9]+))\s*;/gm

  for (const file of compFiles) {
    let src
    try { src = readFileSync(join(compDir, file), 'utf8') } catch { continue }
    for (const block of src.matchAll(PROP_BLOCK_RE)) {
      const compName = 'P' + block[1].slice(1) // already starts with P
      const body = block[2]
      const props = {}
      for (const p of body.matchAll(PROP_LINE_RE)) {
        const propName = p[1]
        const typeName = p[2] || p[3]
        if (!typeName) continue
        if (enums[typeName]) props[propName] = typeName
      }
      if (Object.keys(props).length) components[compName] = props
    }
  }

  cache = { enums, components }
  return cache
}

// CLI inspection: `node scripts/load-pds-meta.mjs PHeading`
if (import.meta.url === `file://${process.argv[1]}`) {
  const meta = loadPdsMeta()
  if (meta.error) {
    console.error(meta.error)
    process.exit(2)
  }
  const arg = process.argv[2]
  if (!arg) {
    console.log(JSON.stringify({
      enumCount: Object.keys(meta.enums).length,
      componentCount: Object.keys(meta.components).length,
      sampleComponents: Object.keys(meta.components).slice(0, 5),
    }, null, 2))
  } else if (meta.components[arg]) {
    const out = {}
    for (const [prop, type] of Object.entries(meta.components[arg])) {
      out[prop] = { type, values: meta.enums[type] }
    }
    console.log(JSON.stringify(out, null, 2))
  } else if (meta.enums[arg]) {
    console.log(JSON.stringify(meta.enums[arg], null, 2))
  } else {
    console.error(`Unknown component or enum: ${arg}`)
    process.exit(1)
  }
}
