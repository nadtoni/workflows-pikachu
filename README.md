# workflows-pikachu
This is a repository of AI workflows for the Pikachu Team.

## Skills

| Skill | Purpose |
|---|---|
| [jira-writing](skills/jira-writing/SKILL.md) | Draft and clarify Pikachu stories, or propose work breakdowns, using observed team conventions. Supports paste-ready text and explicitly approved Jira-Skyway MCP writes. |
| [Porsche UX collection](skills/porsche-ux/README.md) | UX skills and their authoring conventions. |

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
