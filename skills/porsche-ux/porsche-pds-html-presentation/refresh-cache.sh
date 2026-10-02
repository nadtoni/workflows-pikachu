#!/usr/bin/env bash
# Rebuild the PDS partials cache to the latest PDS version.
# Run this from your project root after a PDS update.
#
# Usage:
#   # Claude Code:
#   bash .claude/commands/porsche-os/pds/html-presentation/refresh-cache.sh
#
#   # GitHub Copilot:
#   bash .github/skills/html-presentation/refresh-cache.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "→ Installing @porsche-design-system/components-js..."
npm install --prefix "$SCRIPT_DIR" @porsche-design-system/components-js@4.2.0-rc.2 --no-save 2>&1 | tail -3

echo "→ Rebuilding .pds-cache/..."
node "$SCRIPT_DIR/pds-partials.mjs" --head > "$SCRIPT_DIR/.pds-cache/head.html"
node "$SCRIPT_DIR/pds-partials.mjs" --body > "$SCRIPT_DIR/.pds-cache/body.html"
node "$SCRIPT_DIR/pds-partials.mjs" --css  > "$SCRIPT_DIR/.pds-cache/global.css"

echo "→ Indexing component APIs..."
node "$SCRIPT_DIR/index-components.cjs"

PDS_VERSION=$(node -e "console.log(require('$SCRIPT_DIR/node_modules/@porsche-design-system/components-js/package.json').version)")
echo "✓ Cache rebuilt — PDS $PDS_VERSION"
