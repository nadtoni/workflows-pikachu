# workflows-pikachu
This is a repository of AI workflows for the Pikachu Team.

## Skills

| Skill | Purpose |
|---|---|
| [jira-writing](skills/jira-writing/SKILL.md) | Draft and clarify Pikachu stories, or propose work breakdowns, using observed team conventions. Supports paste-ready text and explicitly approved Jira-Skyway MCP writes. |
| [miro-usage](skills/miro-usage/SKILL.md) | Main Miro kickoff and router: board, working role, Agile approach, objective, and style. Live changes use Miro MCP with scoped approval and explicit deletion confirmation. |
| [Miro: Scrum Master](skills/miro-usage/miro-scrum-master/SKILL.md) | Retrospectives, Sprint collaboration, flow, and working agreements. |
| [Miro: Product Owner](skills/miro-usage/miro-product-owner/SKILL.md) | Discovery, story mapping, prioritization, and outcome roadmaps. |
| [Miro: Designer](skills/miro-usage/miro-designer/SKILL.md) | Research synthesis, journeys, ideation, flows, critique, and usability study planning. |
| [Miro: Developer](skills/miro-usage/miro-developer/SKILL.md) | System diagrams, delivery slices, technical decisions, and incident analysis. |
| [Miro: QA](skills/miro-usage/miro-qa/SKILL.md) | Risk-based coverage, acceptance examples, exploratory charters, and quality evidence. |
| [Porsche UX collection](skills/porsche-ux/README.md) | UX skills and their authoring conventions. |

The Miro collection is framework-neutral: kickoff asks whether the team uses
Scrum, Kanban, a hybrid, or another approach. Detailed role playbooks reuse shared
[Agile foundations](skills/miro-usage/references/agile-foundations.md),
[Miro operations](skills/miro-usage/references/board-operations.md), and
[design/facilitation guidance](skills/miro-usage/references/design-and-facilitation.md).
The main skill loads the nested role files explicitly; nesting alone does not
guarantee host auto-discovery. Keep the references and role folders together.
Without a connected Miro MCP and board URL, the output is an offline plan, not
a board edit. Deletion requires confirmation of exact items and cannot be undone
through the tool. No Jira writes are implied by Miro changes.

`jira-writing` is a standalone Pikachu skill, not part of the Porsche UX bundle.
It operates only on `PIKACHU`/`C3PO` tickets, with the Pikachu board as its board
context. Every AI-created or rewritten ticket requires a leading `(PAI)` title
marker and the exact `Pikachu` label, including tickets in C3PO. New titles use
known bracketed workstreams, such as `(PAI) [Design] ...`; rewrites preserve
existing notation. Existing labels are retained, and other observed tag additions
require approval. Example board links are not fixed filters; the current MCP
cannot verify board membership.

Ticket drafting works without MCP. Reading or publishing tickets requires an
authenticated Jira-Skyway connection; publishing always requires approval of the
exact content and target. Bug, epic, and subtask templates are not yet established
from the sampled stories and require relevant examples or explicit instructions.
