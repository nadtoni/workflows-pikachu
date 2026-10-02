---
name: porsche-ux-workflow
description: "Cross-phase orchestrator and setup skill for the Porsche UX workflow. Activated by the prefix 'pux' (e.g. 'pux wie funktioniert UX bei Porsche', 'pux Figma MCP einrichten', 'pux welcher Skill'). Also use when the user asks which skill to use, wants a workflow overview, needs guidance on 'Was soll ich nutzen?', 'Welcher Skill?', 'UX Workflow starten', MCP setup, or any general UX process question spanning multiple phases. Also handles 'reinstall skills', 'update skills', 'skills aktualisieren' → run: npx github:porsche-code/porsche-ux install"
---

# Porsche UX Workflow

Overview of the official Porsche UX process and the skills available for each phase.

## Official Phases

| # | Phase | Goal | Key Question | Outcome |
|---|-------|------|--------------|---------|
| 1 | **Discover & Understand** | Understand user needs, motivations and challenges | What do our users need and what drives them? | User Insights |
| 2 | **Idea & Solution Generation** | Generate feasible, creative, user-centered ideas | Which solutions best address the users' needs? | Prioritized ideas |
| 3 | **Prototype & Test** | Create tangible models, validate and refine through user testing | Does our solution work for the user? | Validated solutions |
| 4 | **Implement** | Execute the validated concepts and bring them into production | Is the concept being successfully implemented? | Consistent, brand-appropriate product |
| 5 | **Measure** | Evaluate the success and impact of the product post-launch and improve continually | Does the product meet the defined goals? | Use Insights |

---

## Phase-to-Skill Mapping

A phase can have one or more skills. Some skills are useful across multiple phases.

| Skill | Phase(s) | Status |
|-------|----------|--------|
| `porsche-ux-workflow` *(this skill)* | Cross-phase — setup & orchestration | ✅ Available |
| `porsche-di` | Cross-phase — brand guidance for any Porsche-facing digital output | ✅ Available |
| `porsche-ux-prototype` | Phase 3 — Prototype & Test | ✅ Available |
| `porsche-ux-design-review` | Phase 3–4 — review a design against PDS & brand rules | ✅ Available |
| `porsche-ux-figma-edit` | Phase 3–4 — apply one explicitly approved Figma change | ✅ Available |
| `porsche-pds-html-presentation` | Cross-phase — any output as visual HTML | ✅ Available |
| `porsche-ux-github` | Cross-phase — bug reports & feature requests | ✅ Available |
| `porsche-ux-measurement` | Phase 5 — Measure (behavioural + attitudinal KPI tracking) | ✅ Available |
| Phase 1 skills | Discover & Understand | *(in development)* |
| Phase 2 skills | Idea & Solution Generation | *(in development)* |
| Phase 4 skills | Implement | *(in development)* |

> **Rule:** When a user asks "which skill should I use?", always consult this table first. If no skill exists for the requested phase, say so and offer the cross-phase alternatives.

---

## Phase-to-Tool & MCP Mapping

Tools and MCPs relevant per phase. See [Tool Overview](#tool-overview) below for access details.

| Phase | Tools | MCPs |
|-------|-------|------|
| 1 — Discover & Understand | Qualtrics, Fullstory, Condens | Fullstory MCP |
| 2 — Idea & Solution Generation | — | — |
| 3 — Prototype & Test | Figma, Porsche Design System | Figma MCP |
| 4 — Implement | Figma, Porsche Design System | Figma MCP |
| 5 — Measure | Qualtrics, Fullstory | Fullstory MCP |
| Cross-phase — Community | GitHub Issues / Project Board | — |

---

## Tool Overview

### Qualtrics
Run **open and standardized surveys** — from custom research studies to benchmarks like the Customer Excitement Score (CES). Analyze responses and automate feedback workflows to support data-driven UX decisions.
- **Phases:** 1 — Discover & Understand, 5 — Measure
- **Access:** Contact [christian.pottiez@porsche.de](mailto:christian.pottiez@porsche.de) or the [Research Teams channel](https://teams.microsoft.com/l/channel/19%3Aac88c61e7d7d49c691d3c84fcd480413%40thread.tacv2/Research?groupId=872d0e4d-c7a8-4d61-81ab-ff251dd0c8a3&tenantId=56564e0f-83d3-4b52-92e8-a6bb9ea36564)

### Condens
**Research repository for user interviews and usability tests** — upload session recordings, auto-transcribe, and anonymize. Tag and cluster insights across studies, then share findings with stakeholders in a structured, searchable format. Scales qualitative research without losing the original source material.
- **Phases:** 1 — Discover & Understand
- **Access:** Contact [christian.pottiez@porsche.de](mailto:christian.pottiez@porsche.de) or the [Research Teams channel](https://teams.microsoft.com/l/channel/19%3Aac88c61e7d7d49c691d3c84fcd480413%40thread.tacv2/Research?groupId=872d0e4d-c7a8-4d61-81ab-ff251dd0c8a3&tenantId=56564e0f-83d3-4b52-92e8-a6bb9ea36564)

### Fullstory
**Experience analytics platform** — records and replays user sessions, surfaces friction points, and helps optimize conversion and UX quality.
- **Phases:** 1 — Discover & Understand, 5 — Measure
- **MCP available:** Yes — [Fullstory MCP](#fullstory-mcp) for AI-supported session and behavior analysis
- **Access:** Contact [ux@porsche.de](mailto:ux@porsche.de), [Slack #fullstory](https://porscheag.enterprise.slack.com/archives/C01EJ572H1B), or the [Fullstory Teams channel](https://teams.microsoft.com/l/channel/19%3Ad7d8b46fb1be4940840147f038a119ca%40thread.tacv2/Fullstory?groupId=872d0e4d-c7a8-4d61-81ab-ff251dd0c8a3&tenantId=56564e0f-83d3-4b52-92e8-a6bb9ea36564)
- **App:** [app.fullstory.com/login](https://app.fullstory.com/login/)

### Figma
**Collaborative UI/UX design tool** — create, prototype, and share designs in real time. Bridges designers, developers, and stakeholders.
- **Phases:** 3 — Prototype & Test, 4 — Implement
- **MCP available:** Yes — [Figma MCP](#figma-mcp) lets the AI read Figma frames directly and, with explicit approval, apply a targeted change
- **Access:** [Request via form](https://forms.office.com/Pages/ResponsePage.aspx?id=ibfxMeOQKkSs0taujIvaMQljYg3y7TFCrnr_-RWVMFVUNVRERzI0UlQyWjBJTTVNUzRZSVVHTUswTS4u)
- **Onboarding:** [designsystem.porsche.com — Designing Introduction](https://designsystem.porsche.com/v4/designing/introduction/)

### Porsche Design System (PDS)
**All-in-one design & development toolkit** — Figma libraries, Web Components, and guidelines built to Porsche quality standards. Use for both design files and coded prototypes.
- **Phases:** 3 — Prototype & Test, 4 — Implement
- **Access:** Publicly available at [designsystem.porsche.com/v4](https://designsystem.porsche.com/v4/)

### GitHub Issues & Project Board
**Community feedback channel** — file bug reports and feature requests for the porsche-ux skills repo. Issues are tracked on a shared [project board](https://github.com/orgs/porsche-code/projects/162/views/1).
- **Phases:** Cross-phase — Community
- **CLI flow:** use `gh issue create` via the `porsche-ux-github` skill
- **Access:** Publicly available at [github.com/porsche-code/porsche-ux](https://github.com/porsche-code/porsche-ux)


---

## Phase 3 — Prototype & Test

**Goal:** Build a clickable, production-quality React prototype from a finalized Figma frame for interactive validation.

### porsche-ux-prototype
- **Trigger:** User provides a Figma URL and asks for "React-Prototyp", "klickbaren Prototyp", or "PDS Prototype"
- **Stack:** Vite + React 19 + TypeScript + Tailwind 4 + `@porsche-design-system/components-react@4.x`
- **Output:** Runnable prototype in `prototypes/<slug>/` — opens in browser via `npm run dev`
- **Command:** "Turn this Figma frame into a clickable prototype"
- **Requires:** Figma MCP — see [MCP Setup](#mcp-setup) below

---

## Phase 3–4 — Design Review & Figma Changes

**Goal:** Evaluate designs against Porsche and PDS rules, then apply explicitly approved corrections to the source design.

### porsche-ux-design-review
- **Trigger:** "review this design", "Designreview", "check this screen", "prüfe das Design"
- **Output:** Prioritised findings against PDS and Porsche brand rules
- **Command:** "Review this Figma screen against the Porsche UX rules"
- **Requires:** Figma MCP for Figma URLs — see [MCP Setup](#mcp-setup) below
- **Safety:** Read-only; it never changes the Figma file

### porsche-ux-figma-edit
- **Trigger:** "apply this review finding in Figma", "update this Figma screen", "Figma Änderung umsetzen"
- **Output:** One explicitly approved, property-verified change in a user-created Figma branch, ready for visual diff review
- **Command:** "Apply the approved label correction in this Figma frame"
- **Requires:** Figma MCP — see [MCP Setup](#mcp-setup) below
- **Safety:** No automatic edits from a review; never edit main, and use only after the user confirms one concrete change

---

## Phase 5 — Measure

**Goal:** Evaluate whether a shipped product meets its defined UX goals, using both behavioural (Fullstory) and attitudinal (Qualtrics) data.

### porsche-ux-measurement
- **Trigger:** "Measurement Framework", "UX KPIs", "Journey Analyse", "Funnel Analyse", "sind wir erfolgreich?", "Nutzerverhalten analysieren", "Reibungspunkte finden"
- **Output:** Measurement Plan (before launch) or Measurement Report (post-launch) — Markdown, or HTML via `porsche-pds-html-presentation`
- **Command:** "Define a measurement framework for the configurator" / "Build a funnel for the checkout flow and show me where users drop off"
- **Requires:** Fullstory MCP for behavioural workflows — see [MCP Setup](#mcp-setup) below

---

## Cross-phase — Presentations & Reports

### porsche-pds-html-presentation
- **Phases:** usable in all phases whenever a visual output is needed
- **Trigger:** Any output that should become a visual HTML presentation, slide deck, or dashboard
- **Output:** Standalone HTML file with PDS styling — open in browser, share as file
- **Command:** "Create an HTML presentation from this" / "Make a slide deck version of this"

---

## Cross-phase — Community Feedback

### porsche-ux-github
- **Phases:** usable any time a user hits a bug or wants to request a feature
- **Trigger:** "report a bug", "I found a bug", `/bug`, "feature request", `/feature`, "create an issue", "bug report workflow", "bug ticket via workflow", "als Issue/Ticket", "nicht im Skill-Ordner"
- **Output:** A GitHub issue in [porsche-ux](https://github.com/porsche-code/porsche-ux), auto-added to the [project board](https://github.com/orgs/porsche-code/projects/162/views/1)
- **Command:** "Report a bug in the prototype skill" / "Request a new skill for …"
- **Routing:** A request to file a bug/feature "via the workflow" or "as an issue" goes **straight to GitHub issue creation** — never start with local `skills/` edits.
- **Requires:** GitHub CLI (`gh`) authenticated on the machine

---

## MCP Setup

MCPs connect the AI to external tools. In this workflow, Figma MCP and Fullstory MCP are used depending on the task.

Set up MCP only when a skill requires it.

---

### Figma MCP

**Required by:** `porsche-ux-prototype`, `porsche-ux-design-review` (for Figma URLs), and `porsche-ux-figma-edit`

**1. Add the server config**

Global (all workspaces, recommended) — `~/Library/Application Support/Code/User/mcp.json` on macOS:

```json
{
  "servers": {
    "figma": {
      "type": "http",
      "url": "https://mcp.figma.com/mcp"
    }
  }
}
```

**2. Enable auto-approve in VS Code settings**

Add to VS Code `settings.json` — prevents per-session tool confirmation blocks:
```json
"github.copilot.chat.mcp.autoApprove": true
```

**3. Authenticate**

Restart VS Code, switch Copilot to **Agent mode**, then ask:
*"Can you connect to Figma and tell me who I'm logged in as?"*

VS Code will open a browser window for Figma OAuth login — log in once and you're done. The `figma_whoami` tool confirms the connection.

**Response Contract**
- Do NOT mention PATs, Desktop Bridge, WebSocket, or localhost plugin — not supported here.
- Always configure globally (user-level `mcp.json`), not workspace-level.
- Apply `mcp.json` and `settings.json` in one pass, never split into separate steps.
- Keep wording practical for non-developers.

**Troubleshooting**
- *Tools blocked / unavailable* → you're in **Chat mode**, not **Agent mode** — switch and retry
- *Node not found* → the Figma URL needs a `node-id` (use "Copy link to selection")
- *File not accessible* → your Figma account must have access to that file/team

---

### Fullstory MCP

**Required by:** Discover/Measure workflows that analyze Fullstory data

**1. Add the server config**

Global (all workspaces, recommended) — `~/Library/Application Support/Code/User/mcp.json` on macOS:

```json
{
  "servers": {
    "fullstory-eu1": {
      "type": "http",
      "url": "https://api.eu1.fullstory.com/mcp/fullstory"
    }
  }
}
```

**2. Enable auto-approve in VS Code settings**

Add to VS Code `settings.json`:
```json
"github.copilot.chat.mcp.autoApprove": true
```

**3. Authenticate**

Restart VS Code, switch Copilot to **Agent mode**, then ask:
*"Which tools does Fullstory MCP provide?"*

VS Code opens Fullstory OAuth. Approve the requested scopes.

**4. Verify the connection and check the active org**

Ask one concrete query, for example:
*"Welche Fullstory Org ist mit dem Fullstory MCP verknüpft?"*

If tools are available and a query returns data, setup is complete. Any Fullstory MCP result (segment, metric, funnel, session) includes a URL — the org id is the `o-...` segment in that URL path (`.../ui/o-.../`). Use that to confirm you're connected to the intended org.

**5. Switch to another org (re-auth required)**

Fullstory MCP is connected to one org at a time per OAuth session.
To switch orgs:
1. Sign out from the Fullstory auth session in VS Code (Account icon -> Authentication Sessions -> `https://auth.eu1.fullstory.com`)
2. Run `MCP: Reset Cached Tools`
3. Run `Developer: Reload Window`
4. Trigger a Fullstory MCP prompt again and select the target org in OAuth

**Important finding from setup demo**
- Use `https://api.eu1.fullstory.com/mcp/fullstory` (this endpoint authenticated in our VS Code setup)
- Do not use `.../mcp/subtext` for this workflow documentation

**Troubleshooting**
- *OAuth completes but 403 Forbidden* → likely org/account permissions issue in Fullstory (admin check required)
- *Connected but no tools visible* → verify StoryAI Features are enabled in Fullstory org settings
- *Unexpected org data appears* → ask "Welche Fullstory Org ist mit dem Fullstory MCP verknüpft?", then re-auth and explicitly pick the target org
- *Still failing after config change* → run `MCP: Reset Cached Tools`, then `Developer: Reload Window`

---

> Add a new subsection here whenever a skill starts requiring another MCP.

---

## Quick Reference

Prefix **`pux`** routes any question through this skill first.

`pux` is the deterministic first hop to `porsche-ux-workflow`; this skill then routes to the best matching downstream skill.

```
User input type                          → Skill to use
─────────────────────────────────────────────────────────
pux <any question>                       → porsche-ux-workflow (this skill, then delegates)
pux Figma MCP einrichten                 → porsche-ux-workflow → MCP Setup section
pux Fullstory MCP einrichten             → porsche-ux-workflow → Fullstory MCP section
"Welche Fullstory Org ist verknüpft?" / "Fullstory Verbindung prüfen" → porsche-ux-workflow → Fullstory MCP section (step 4)
"Welche Funnels/Journeys gibt es in Fullstory?" → porsche-ux-measurement (references/fullstory-mcp.md)
pux report a bug                         → porsche-ux-github (CLI issue flow)
pux welcher Skill                        → porsche-ux-workflow → Phase-to-Skill Mapping
pux reinstall skills / update skills     → run: npx github:porsche-code/porsche-ux install
Figma URL + "React prototype"            → porsche-ux-prototype
"apply this review finding in Figma" / "Figma Änderung umsetzen" → porsche-ux-figma-edit
"Measurement Framework" / "UX KPIs" / "Funnel Analyse" / "Journey Analyse" → porsche-ux-measurement
"HTML presentation" / "Slide deck"       → porsche-pds-html-presentation
"review this design" / "Designreview" / "bewerte diesen Screen" → porsche-ux-design-review
"Which skill should I use?"              → porsche-ux-workflow (this skill)
"is this on-brand?" / "does this feel Porsche?" → porsche-di
"report a bug" / "/bug" / "/feature"    → porsche-ux-github
"bug report workflow" / "bug ticket"     → porsche-ux-github (GitHub issue, NOT local edits)
"nicht im skill ordner" / "als issue"    → porsche-ux-github (GitHub issue, NOT local edits)
"feature request workflow"               → porsche-ux-github (GitHub issue, NOT local edits)
```

> **Routing rule — bug/feature "workflow" requests go straight to GitHub.**
> When a user asks to file a bug or feature "via the workflow", "as an issue",
> "als Issue/Ticket", or says it should "nicht im Skill-Ordner" / "not as local
> changes", route **immediately** to `porsche-ux-github` and create a GitHub
> issue. Do **not** start editing files under `skills/` as a first step — that
> is a different task (fixing a skill) and causes avoidable friction. If it is
> genuinely ambiguous whether the user wants a GitHub issue *or* a local skill
> fix, ask **one** short clarification question before doing anything.

---

## Cost Transparency (applies to ALL skills)

**At the end of every completed skill task**, output a cost estimate block using the formula below. This gives the user visibility into LLM costs.

### Model pricing (Claude Sonnet 4.6)
| Direction | Credits per 1M tokens | Cost per 1M tokens |
|-----------|----------------------|-------------------|
| Input     | 300                  | $3.00             |
| Output    | 1,500                | $15.00            |

_Rate: 50,000 credits = $500 → 1 credit = $0.01_

### Estimation formula

```
input_tokens  ≈ (total chars in full conversation context) / 4
output_tokens ≈ (chars in this skill's response/output)   / 4

credits_raw    = (input_tokens × 0.0003) + (output_tokens × 0.0015)
credits        = credits_raw × 1.3          ← 30% safety buffer
cost_usd       = credits × 0.01
```

### Output format

Always append this block at the very end of the skill output (after all deliverables):

```
---
💰 ≈X,XXX In / ≈X,XXX Out Tokens · ≈X.XX Credits · **≈$X.XX** _(Claude Sonnet 4.6, inkl. 30% Puffer)_
```

### Rules
- Round token counts to the nearest 100, credits to 2 decimal places, costs to 3 decimal places.
- If the output includes generated files (HTML, code), count their character length toward output tokens.
- Never skip this block — even for short tasks.
