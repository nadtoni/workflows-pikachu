---
name: miro-framework
description: >
  Use a Miro board through Miro MCP with role-specific Agile playbooks. Ask the
  user's working role, framework, objective, and style before routing to Scrum
  Master, Product Owner, Designer, Developer, or QA guidance. Use for "use Miro",
  "edit this Miro board", "design a workshop", "add to the board", "remove board
  items", "Miro nutzen", "Miro-Board bearbeiten", or "Workshop vorbereiten".
---

# Miro Framework

Build useful collaboration spaces and evidence-based artifacts on the user's
board, not decorative templates or invented team decisions.

## Entry point and role routing

This is the main skill. The nested role folders each contain a separate skill;
read the selected `SKILL.md` explicitly. Do not assume nested folders are
automatically discovered, installed, or invoked by the host.

| Working role | Load | Primary lens |
|---|---|---|
| Scrum Master / facilitator | [miro-scrum-master](miro-scrum-master/SKILL.md) | Team effectiveness, facilitation, inspection and adaptation |
| Product Owner / PO | [miro-product-owner](miro-product-owner/SKILL.md) | Outcomes, product decisions, ordering and scope |
| Designer / researcher | [miro-designer](miro-designer/SKILL.md) | User evidence, exploration, journeys and interaction |
| Developer / engineer | [miro-developer](miro-developer/SKILL.md) | System behavior, delivery, trade-offs and operability |
| QA / tester | [miro-qa](miro-qa/SKILL.md) | Quality risks, examples, test coverage and evidence |

Roles are working perspectives, not access permissions or organizational
hierarchies. The same person may switch roles. In Scrum, the Developer
accountability can include designers and testers contributing to the Increment;
these folders do not create separate Scrum sub-teams.

### Direct role-skill entry

If a role skill is invoked directly, it must first read this main skill and the
required references below, complete missing kickoff fields, then execute its
own playbook. If arriving through this router, reuse the established context.
Routing means reading instructions, not launching a subagent.

## Kickoff: first interaction

Ask for missing essentials in one focused interaction before inspecting or
changing board content. Use the host's question tool when available.

1. **Board and target:** board URL, frame/area if known, and whether to create,
   extend, reorganize, synthesize, critique, or remove content.
2. **Working role:** Scrum Master, PO, Designer, Developer, QA, or a deliberate
   combination. Ask for the role, not their name or employment details.
3. **Operating model:** Scrum, Kanban, hybrid, another approach, or undecided.
   This skill is framework-neutral; a retrospective request does not prove Scrum.
4. **Outcome and audience:** what should participants understand, decide, learn,
   or do; who contributes; who makes the decision.
5. **Working and visual style:** facilitative/exploratory, decision-focused,
   technical/evidence-heavy, or stakeholder-summary; workshop workspace versus
   synthesis; visual tone, language, and expected detail.
6. **Constraints when relevant:** session length, synchronous/asynchronous use,
   participant count, accessibility needs, existing conventions, evidence,
   sensitive content, and areas that must remain untouched.

Do not repeat answers already supplied in the current conversation. If the user
has said "I am a designer", use Designer for this task and ask only the missing
framework, goal, style, and board context. Reconfirm when they switch roles or
boards. Do not persist identity or personal details.

If they do not know their role or framework, explain the relevant options and
offer a neutral outcome-oriented playbook. Do not force Scrum terminology or
delay a simple edit with an unnecessary full workshop questionnaire.

## Required references

Read once per task and reuse; the role files add domain instructions on top.

| Reference | Read for |
|---|---|
| [Agile foundations](references/agile-foundations.md) | Framework rules, optional practices, quality and evidence |
| [Board operations](references/board-operations.md) | Miro MCP navigation, updates, approvals, deletion and verification |
| [Design and facilitation](references/design-and-facilitation.md) | Layout, accessible style, workshop structure and decision records |

## Procedure

### 1. Establish the task contract

Capture the kickoff answers in a short working brief:

```text
Board / target:
Role / selected playbook:
Framework / team agreements:
Objective / intended decision:
Audience / facilitator / decision authority:
Artifact: workspace or synthesis
Style / language / detail:
Evidence / unknowns:
Constraints / protected areas:
Proposed operations:
```

Keep unknowns visible. A role is not authorization to edit a board, decide for
the team, or publish to Jira.

### 2. Inspect the relevant area

Use Miro MCP and the operations reference to find and read only the target.
Understand existing layout, content, connectors, ownership/read-only signals,
and nearby space. Report permission or capability errors explicitly.

Without MCP or a board link, produce a clearly labeled offline board plan from
supplied material. Do not claim a board was inspected or changed, invent widget
IDs, or silently create a replacement board. Request the board link for execution.

### 3. Load the role playbook

Select the smallest workflow that achieves the objective. Read its inputs,
board structure, facilitation steps, decision rules, outputs, and failure modes.
If a cross-functional task needs another role, explain the handoff and load only
the additional relevant playbook; preserve one objective and shared context.

### 4. Design and approve the change

Prepare a useful artifact, not every possible template in the role file.
Preview proposed frames, actual content versus participant blanks, style,
placement, and additions/changes. Identify any unresolved product decisions.
Obtain approval of the scoped change before writing.

Deletion needs separate confirmation of the exact items and their impact.
Moving items is not archiving; omission from an SVG is not deletion.

### 5. Execute and verify

Follow the operations reference, preserve live IDs and unaffected content,
repair reported expansion/overlap within the approved composition, and inspect
the resulting scoped content. Distinguish draft, applied, partially applied,
failed, and unverified outcomes.

### 6. Close with an actionable result

Return the board/area link, meaningful changes, decision/learning artifacts,
open questions, and agreed follow-up owners if known. Do not invent ownership,
votes, consensus, estimates, or test results. A created board is not a completed
workshop or a delivered software Increment.

For Jira handoff, use [jira-writing](../jira-writing/SKILL.md) with its project,
`(PAI)`, `Pikachu`, and approval rules. A Miro request does not authorize Jira writes.
Do not automatically add Jira title markers to Miro notes.

## Quality gate

- Role, framework, objective, artifact type, and style are established.
- The chosen workflow is useful for the goal, not imposed from a role stereotype.
- Real evidence, assumptions, proposals, and decisions are visibly distinct.
- The board is legible, navigable, editable, and appropriately empty or populated.
- Shared content and protected areas remain intact; destructive actions are explicit.
- The outcome contains a decision, learning, or next action, not only attractive frames.
- Live changes are verified; limitations are disclosed instead of hidden.

## Cost transparency

Append a cost note outside board content. Use reliable active-model usage/rates
if available; otherwise state that a reliable estimate is unavailable.
Never invent credit conversions or apply another model's pricing.
