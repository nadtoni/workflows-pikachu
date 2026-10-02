---
name: miro-developer
description: >
  Map systems, plan delivery slices, document technical decisions, and investigate
  operational issues collaboratively on Miro. Use for "architecture board",
  "system diagram", "implementation planning", "ADR workshop", "incident map",
  "Architekturdiagramm", "technische Planung", or "Abhaengigkeiten darstellen".
---

# Miro for Developers

Use diagrams to reason about verified behavior and trade-offs, not to imply
that an attractive architecture has been implemented or tested.

## Entry and prerequisites

Follow [miro-framework](../SKILL.md), including framework, objective, audience,
artifact type, and style. Read
[Agile foundations](../references/agile-foundations.md),
[board operations](../references/board-operations.md), and
[design and facilitation](../references/design-and-facilitation.md).
Direct entry still requires the shared MCP, approval, and deletion protocol.

Confirm system boundary, current versus proposed state, source artifacts,
technical constraints, and the decision the map must support. Never invent
services, API contracts, repository paths, performance numbers, or root causes.

## Playbooks

| Playbook | Use when | Intended outcome |
|---|---|---|
| [System and interaction mapping](#system-and-interaction-mapping) | Understand boundaries and behavior | A precise, source-linked model at one useful level |
| [Incremental delivery planning](#incremental-delivery-planning) | Turn scope into implementable slices | Thin, testable work with dependency/quality visibility |
| [Technical decisions](#technical-decisions) | Compare implementation options | A transparent proposed or accepted decision record |
| [Incident and failure analysis](#incident-and-failure-analysis) | Diagnose an issue or learn from failure | Facts, hypotheses, validation steps and improvements |

## System and interaction mapping

### Inputs and layout

Obtain user/business scenario, systems/actors, responsibilities, boundaries,
interfaces, storage, trust boundaries, source links, and known failure conditions.
Ask which level the audience needs: context, containers/services, components,
data relationships, or a scenario sequence. Do not mix every level in one diagram.

Frames: scope/legend; current model; scenario behavior; risks/unknowns;
proposed changes if requested. Keep current and proposed state clearly separate.

### Procedure

1. Inventory verified actors and elements with responsibility and evidence.
   Unknown components remain questions, not plausible boxes.
2. Define arrow semantics before drawing: request, response, data flow, dependency,
   or asynchronous event. Label direction and important protocol/context.
3. Choose a supported format. Load diagramming guidance and the appropriate
   flowchart, ERD, UML class/sequence, or free-form notation after composer setup.
   Prefer structured widgets when they express the model well.
4. For sequence behavior, map ordering, sync/async boundaries, state changes,
   timeouts/retries, and failure paths only as established or marked proposals.
5. Surface relevant trust boundaries, ownership, data sensitivity, and dependency
   assumptions without publishing secrets or sensitive payloads.
6. Check diagram consistency: every relationship has known endpoints, labels
   mean the same thing, and proposed elements are visibly distinct.
7. Ask the people responsible for the system to validate unresolved facts.
   Link evidence and record open questions rather than claiming validation.

### Output

A readable model with level, legend, sources, unknowns, and decision implications.
Do not report architectural approval or executable behavior from a diagram.
If the tool cannot represent the needed notation, disclose the limitation and
offer an agreed simpler representation.

## Incremental delivery planning

### Inputs and layout

Use the intended user outcome, requirements, acceptance examples, current
architecture, dependencies, quality obligations, and integration/release constraints.
In Scrum include the Sprint Goal and Definition of Done; in Kanban use the
agreed workflow and pull/WIP policies.

Frames: outcome/scope; candidate vertical slices; dependency map; quality work;
uncertainty/spikes; actual plan/decisions.

### Procedure

1. Start from observable behavior or a risk-reduction outcome, not component
   tasks divorced from value.
2. Split into the smallest coherent increments with meaningful verification.
   A database/UI/testing phase chain is not automatically incremental delivery.
3. Identify required contracts, migrations, compatibility, rollout/rollback
   considerations, observability, and environments where relevant.
4. Co-design acceptance examples with product/design/QA. Include integration,
   failure handling, and testability instead of appending a generic "QA later" task.
5. Separate known implementation work from uncertainty. A spike needs a question,
   proposed time budget, evidence/output, and a decision it should enable;
   the time budget requires team agreement.
6. Visualize dependencies and blockers without assigning owners or estimates
   for the team. Developers doing the work size and plan it.
7. Align the selection with goal, capacity, workflow controls, and quality.
   Leave unaccepted selection as proposed.
8. Trace requirements to slices and verification. Record what is deferred and why.

### Output and checks

Candidate slices with scope, examples, dependencies, quality/operability needs,
and open decisions. A Miro work card does not create a Jira issue or update its
status. Use the main skill's Jira handoff if requested.
Do not reduce the Definition of Done to meet a forecast.

## Technical decisions

### Inputs and layout

Confirm decision scope, actual authority, context, constraints, evidence,
alternatives, evaluation criteria, and reversibility.
Frames: question/context; options; comparison; experiments/unknowns;
decision record; follow-up.

### Procedure

1. State the decision and its boundaries in one sentence. Avoid comparing
   technologies without a concrete problem.
2. Include credible alternatives, including keeping the current approach where
   viable. Do not construct a straw-man option to force a favorite.
3. Compare fit, complexity, operability, migration, security/privacy implications,
   accessibility where relevant, and maintainability using supplied context.
4. Label missing measurements and benchmark needs. Do not invent latency,
   throughput, cost, or effort to fill a comparison matrix.
5. Identify irreversible/high-impact assumptions and the smallest validation
   experiment that could change the choice.
6. Capture the selected option only when the authority decides. Record status
   such as proposed, accepted, rejected, or superseded, plus rationale and risks.
7. Define review triggers and implementation implications. Keep prior decisions
   traceable rather than deleting inconvenient history.

### Output

An ADR-like record with actual status, evidence, alternatives, consequences,
open risks, and validation steps. Do not call an AI recommendation an accepted ADR.

## Incident and failure analysis

### Inputs and layout

Obtain sanitized observations, time zone/timestamps, affected behavior,
user/system impact, verified events, mitigations, and constraints.
Distinguish active mitigation from a later learning review.

Frames: impact and scope; factual timeline; hypothesis map; validation/mitigation
options; actual findings; corrective/preventive experiments.

### Procedure

1. Build the timeline from supplied facts and mark gaps. Separate detection,
   onset, mitigation, and recovery when known.
2. Record hypotheses with supporting/contradicting evidence and confidence.
   Correlation, a log line, or a five-whys chain alone does not establish cause.
3. Identify safe next observations or experiments. A board exercise does not
   authorize production commands, data modification, or destructive testing.
4. Preserve mitigation status accurately: proposed, attempted, observed result.
   Do not invent recovery metrics or claim the issue is resolved.
5. Inspect system/process conditions without individual blame. Keep independent
   causes and unknowns rather than forcing one narrative.
6. Define proportionate improvements tied to the evidence, with agreed owners,
   review signals, and operational constraints.

### Output

Source-backed timeline, bounded hypotheses, validation steps, actual findings,
and improvement proposals. A diagnostic map is not production incident closure.

## Final quality gate

- Current/proposed models and facts/hypotheses are distinct and traceable.
- Diagram level and relationship semantics fit the audience.
- Slices include quality, integration, and operational concerns when relevant.
- Authority, accepted decisions, estimates, and implementation status are not invented.
- Sensitive data and production actions remain outside unauthorized board work.
- Shared live-edit/deletion and cost-transparency rules are followed.

## Cost transparency

Apply the [shared cost note](../SKILL.md#cost-transparency) after the response,
never inside board content.
