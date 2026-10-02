---
name: porsche-ux-figma-edit
description: "Safely applies an explicitly approved change to a Figma design through Figma MCP. Use when the user asks to apply, implement, update, or fix a specific Figma change after review. Triggers: 'apply this review finding in Figma', 'update this Figma screen', 'edit this Figma text', 'Figma Änderung umsetzen', 'diesen Figma Fix anwenden', 'Figma Screen anpassen'."
---

# Porsche UX Figma Edit

Apply one explicitly approved Figma change safely through the remote Figma MCP, in a user-created Figma branch.

> **This skill vs. `porsche-ux-design-review`:** Review identifies and prioritises findings. This skill changes a Figma file only after the user explicitly selects a concrete fix. Never edit while reviewing.

## When To Use

Use this skill only when all of the following are clear:

- The user explicitly asks to change a Figma file.
- A user-created Figma branch URL and target frame are available.
- The requested change is specific enough to verify, such as replacing one text value, correcting a label, or applying one named review finding.

If the user asks to review, assess, or suggest improvements, use `porsche-ux-design-review` instead. If the requested outcome is a runnable React prototype, use `porsche-ux-prototype`.

## Prerequisites

- Figma MCP is configured and authenticated. See `porsche-ux-workflow`, **MCP Setup → Figma MCP**.
- The user has edit access to the target Figma file.
- The requested change is explicitly approved.
- The user created a Figma branch and supplied its URL. Figma MCP cannot create branches.
- The user selected the target layer in that branch, then used **Copy link to selection** in Figma and supplied that URL. Do not ask the MCP to search for an unspecified target.

## Safety Rules

- Never edit the main Figma file. The user must create and provide the target branch; Figma MCP cannot create branches, inspect diffs, or roll back changes.
- Modify only the approved target and leave adjacent layers, properties, and components unchanged.
- Never use raw node IDs from `get_metadata` to address a layer inside a component instance. Resolve it by layer-name traversal from a known ancestor instance instead.

## Procedure

### 1. Validate The Target Link

Check that the supplied URL contains both a `node-id` and a Figma branch path (`/branch/`). A `node-id` alone does not prove that the user used **Copy link to selection**: ordinary file links can include one too.

Call `get_metadata` for the URL and confirm that it resolves to the stated target layer, not the document, page, canvas, or another broad container. If the link has no branch path, no `node-id`, or resolves to an unspecified container, explain that this can reduce speed and target accuracy. Ask the user to select the intended layer in the Figma branch and use **Copy link to selection** again.

### 2. Confirm The Exact Change

State the target branch and frame, the current value to be changed, and the intended new value. If any one is unclear, ask one focused question before modifying Figma.

### 3. Inspect Before Editing

1. Call `get_metadata` to identify the containing frame or instance and its layer names.
2. Read the current target value and confirm it matches the approved change.

If the first Figma MCP call returns a generic transient error, retry that same lightweight call once. Do not interpret it as an authentication failure unless the retry also fails.

### 4. Resolve The Target Safely

In `use_figma`, start from the known ancestor frame or instance. Find the intended layer by its stable name and type; for example, find a `TEXT` layer by name inside its known instance.

Do not call `figma.getNodeByIdAsync()` with a raw ID returned for a layer nested inside an instance: the remote write context may not resolve it.

### 5. Apply Only The Approved Change

Before setting `characters` on a text layer, load its existing font:

```js
const fontName = textNode.fontName
if (fontName === figma.mixed) {
	throw new Error('Text has mixed fonts; inspect its styled ranges before editing.')
}
await figma.loadFontAsync(fontName)
textNode.characters = 'Approved replacement'
```

For other properties, preserve the existing node and change only the approved property. Do not detach instances, replace components, or restructure auto layout unless explicitly requested.

### 6. Verify And Hand Off

1. Re-read the edited property and confirm it contains the approved value.
2. Leave the Figma branch ready for the user to inspect its visual diff and merge or reject it in Figma.
3. Report exactly what changed and that visual diff review remains with the user.

## Output

```md
## Figma Change Applied

- **Target:** [branch / frame / layer]
- **Change:** [old value] → [new value]
- **Verification:** Edited property re-read; visual diff review pending in Figma
- **Not changed:** [adjacent content intentionally left untouched]
```

## Related Skills

- Review a screen and produce prioritised fixes → `porsche-ux-design-review`
- Turn a Figma frame into a local React prototype → `porsche-ux-prototype`
- Configure Figma MCP → `porsche-ux-workflow`

## Cost Transparency

At the end of every completed task using this skill, append the cost estimate block.
Formula and format live in `porsche-ux-workflow/SKILL.md` (section **Cost Transparency**).

```md
---
💰 ≈X,XXX In / ≈X,XXX Out Tokens · ≈X.XX Credits · **≈$X.XX** _(Claude Sonnet 4.6, inkl. 30% Puffer)_
```