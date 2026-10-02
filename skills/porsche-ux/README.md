# Authoring Skills

Contributor reference for **creating and extending** Porsche UX skills.
For setup and usage, see the [main README](../../README.md).
For the live list of available skills, see [porsche-ux-workflow](./porsche-ux-workflow/SKILL.md).

> **Naming convention:** every Porsche skill folder starts with `porsche-` so it
> stays clearly separable from your own and public (e.g. skills.sh) skills in the
> same skills folder. Filter them with `ls ~/.copilot/skills/porsche-*`.
>
> Skills not yet ready keep their concept in an `idea.md` (not installed) until it
> becomes a full `SKILL.md`.

---

## MCP setup guides

MCP setup lives in **[porsche-ux-workflow/SKILL.md](./porsche-ux-workflow/SKILL.md)** under the **MCP Setup** section — not in separate tool files.

This means setup instructions are versioned, installed together with the skills, and reachable by simply asking the AI *"How do I set up the Figma MCP?"*.

**When a skill requires a new MCP:**
1. Add a setup subsection to the **MCP Setup** section in `porsche-ux-workflow/SKILL.md` (token/config/verify/troubleshoot).
2. Note the requirement in the skill's own `SKILL.md` (e.g. `- **Requires:** X MCP — see porsche-ux-workflow skill, section MCP Setup`).
3. Add an entry in `CHANGELOG.md` under `[Unreleased]`.

---

## Skill anatomy

Use this as the reference when creating or extending a skill.

### Single-task skill

One clear workflow per skill. Structure:

```
---
name: porsche-<name>
description: "One sentence + German trigger words."
---

# Title

One-liner summary.

> Differentiation callout (when closely related skills exist)

## When to use
## Prerequisites
## Procedure
### 1. …
### 2. …
## Output
## Transition to next phase  ← optional
## Common mistakes           ← optional
```

### Multi-task skill

Multiple distinct workflows in one skill (shared tool setup, shared domain knowledge). Structure:

```
---
name: porsche-<name>
description: "Covers all tasks. Include trigger words for every task."
---

# Title

One-liner summary.

> Differentiation callout

## Tasks
| Task | When to use |
|------|-------------|
| [Task A](#task-a) | … |
| [Task B](#task-b) | … |

## Shared context
### Prerequisites
### <shared reference table / rules>

## Task A
### When to use
### Procedure
#### 1. …
#### 2. …
### Output

## Task B
### When to use
### Procedure
#### 1. …
### Output

## Transition to next phase
## Common mistakes
```

**When to split into a separate skill vs. adding a task:**

| Add a task | Create a separate skill |
|------------|------------------------|
| Same tools / prerequisites | Different tools or no overlap |
| Same domain, different workflow | Clearly different domain |
| Shared reference data (tables, rules) | Would require duplicating context |
| 2–4 tasks max | More tasks → harder to maintain one file |

### Terminology

| Term | Meaning |
|------|---------|
| **Skill** | A folder with `SKILL.md`; auto-triggered by the `description` |
| **Task** | A distinct workflow within a multi-task skill; has its own H2 block |
| **Task router** | The `## Tasks` table that maps trigger phrases to H2 anchors |
| **Shared context** | Prerequisites + reference data reused across tasks in one skill |
| **Trigger phrases** | Words in `description:` that cause AI auto-matching. Include German for Porsche internal users |
| **Stub** | A skill with `idea.md` but no full procedure yet |
| **Agent** | A manually selected AI work mode; do not treat it like a skill because it does not auto-match |

### Trigger and routing conventions

Keep triggers and routing predictable across all Porsche skills.

- **Bilingual triggers in `description:` are required.** Always include both English and German high-intent phrases for the same use case (e.g. `design review` + `Designreview`, `is this on-brand?` + `ist das on-brand?`).
- **Keep trigger sets compact.** Use 6-12 strong phrases, not a long keyword cloud. The model can generalize semantically, but explicit DE/EN phrasing improves reliability and consistency.
- **`pux` routing is first-hop deterministic.** Inputs with `pux` should route to `porsche-ux-workflow` first; this skill then delegates to the best matching skill.
- **Do not use `pux` as a replacement for skill triggers.** Each skill still needs a precise `description:` so it can auto-match without the prefix.

### Reference style conventions

When skills overlap, references should be explicit and minimal.

- Add one clear differentiation callout near the top, e.g. `This skill vs. porsche-di: ...`.
- Prefer one explicit statement over multiple vague tags.
- Keep `Related Skills` short and actionable: one line per linked skill, each line says when to use it.
- Link to the single source of truth instead of restating rules across multiple files.

---

## Shipping a new skill — checklist

When promoting an `idea.md` draft to a real `SKILL.md`, complete every applicable item before requesting review:

- [ ] Create `skills/porsche-ux/porsche-<name>/SKILL.md` with valid YAML frontmatter (`name`, `description`)
- [ ] Add the skill name to `SKILL_NAMES` in `bin/cli.mjs` — **without this the skill is never installed**
- [ ] Add the skill to the `skills:` list in `agents/porsche-ux.agent.md` so the bundled agent includes it
- [ ] Add the skill to the active list in the root `README.md` with a short user-facing description
- [ ] Add the skill to the phases table and the appropriate detailed phase section in `porsche-ux-workflow/SKILL.md`; align its tools and MCP prerequisites with that phase
- [ ] If the skill requires an MCP, add a setup subsection to the **MCP Setup** section in `porsche-ux-workflow/SKILL.md`
- [ ] Add a cost transparency block at the end (see below)
- [ ] Add one `.changeset/<short-slug>.md` fragment; do not edit `CHANGELOG.md` or `package.json` by hand
- [ ] Run the verification commands below and resolve every new error before requesting review

### Required verification

Run these commands from the repository root for every added or materially changed skill:

```bash
node --check bin/cli.mjs
node bin/cli.mjs list
git diff --check
```

`list` must show the skill with its intended user-facing label. For a new skill, also run `node bin/cli.mjs install` and confirm it is shown as installed afterwards. Use the repository's available Markdown and test checks where applicable; do not leave new diagnostics or test failures for a reviewer to discover.

### PR discipline (required)

To avoid missed release housekeeping, every PR must confirm changelog + version intent.

- Use the repository PR template checklist (`.github/pull_request_template.md`).
- User-visible changes: add a `.changeset/` fragment with the correct type and semantic-version bump.
- No user-visible change: explicitly check "no changelog required" in the PR template.
- CI owns the version bump, dated `CHANGELOG.md` entry, tag, and GitHub Release. Do not duplicate these changes manually.

---

## Cost transparency block (required in every skill)

Every skill must append a cost estimate at the end of its output. The formula and format live in `porsche-ux-workflow/SKILL.md` (section **Cost Transparency**) — copy the rules there when writing a new skill.

The output line looks like this:

```
---
💰 ≈X,XXX In / ≈X,XXX Out Tokens · ≈X.XX Credits · **≈$X.XX** _(Claude Sonnet 4.6, inkl. 30% Puffer)_
```

Never skip it, even for short tasks.

---

## Single source of truth — don't duplicate these

Some things have a deliberate home. If you need to reference them, **link, don't copy**:

| Content | Lives in |
|---------|---------|
| Active skill list + phase overview | `porsche-ux-workflow/SKILL.md` |
| MCP setup instructions | `porsche-ux-workflow/SKILL.md` → MCP Setup section |
| Cost transparency formula + rules | `porsche-ux-workflow/SKILL.md` → Cost Transparency section |
| Authoring conventions | `skills/porsche-ux/README.md` (this file) |
| User-facing setup + onboarding | root `README.md` |

Repeating these elsewhere creates maintenance debt — the next update will miss the copy.
