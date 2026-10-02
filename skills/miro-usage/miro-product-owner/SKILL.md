---
name: miro-product-owner
description: >
  Build evidence-based product discovery, story maps, prioritization, and
  outcome roadmaps on Miro. Use for "product discovery board", "story map",
  "prioritize the backlog", "outcome roadmap", "Product Owner workshop",
  "Produktziele", "Backlog priorisieren", or "Roadmap erstellen".
---

# Miro for Product Owners

Connect work to user and business outcomes; make uncertainty, trade-offs, and
actual product decisions explicit.

## Entry and prerequisites

Follow [miro-usage](../SKILL.md) and its framework-neutral kickoff first.
Read [Agile foundations](../references/agile-foundations.md),
[board operations](../references/board-operations.md), and
[design and facilitation](../references/design-and-facilitation.md).
Reuse the established brief. Direct entry does not bypass Miro MCP, approval,
or explicit deletion confirmation.

Confirm the product boundary, users, current evidence, intended decision,
decision authority, constraints, and source backlog. In Scrum, the PO remains
accountable for ordering; stakeholder voting does not transfer that accountability.

## Playbooks

| Playbook | Use when | Intended outcome |
|---|---|---|
| [Problem and opportunity discovery](#problem-and-opportunity-discovery) | The team is unsure what problem to pursue | Evidence-linked opportunities and a learning plan |
| [Story mapping and slicing](#story-mapping-and-slicing) | A journey needs incremental delivery | Coherent end-to-end slices, not component batches |
| [Prioritization and refinement](#prioritization-and-refinement) | Options compete for capacity | Transparent ordering proposals and explicit decisions |
| [Outcome roadmap](#outcome-roadmap) | Stakeholders need direction under uncertainty | Outcomes, learning, dependencies and confidence |

## Problem and opportunity discovery

### Inputs and layout

Gather product context, user groups, business objective, current behavior,
research/analytics/support evidence, constraints, and existing assumptions.
Ask what decision must be made now rather than drawing an entire discovery system.

Frames: objective and scope; evidence; user problems/opportunities; hypotheses;
options; learning experiments; decision and follow-up.
If there is no evidence, use research questions instead of invented personas,
pain scores, conversion baselines, or market facts.

### Procedure

1. State the outcome in terms of who benefits and how. Separate a desired outcome
   from a feature request; a feature can be an option, not the objective itself.
2. Record current signals with definitions, time period, source, limitations,
   and confidence. Preserve uncertainty around causal explanations.
3. Cluster user problems without losing traceability to their evidence. Expose
   contradictory signals and underserved users, not only frequent requests.
4. Generate multiple plausible options with design, engineering, and QA input.
   Label them hypotheses; do not fill a tree with supposedly validated branches.
5. Identify the riskiest assumption: value, usability, feasibility, viability,
   or operational/regulatory constraint, when supported.
6. Define the smallest learning activity: question, method, audience/data,
   success/failure signal, agreed owner, and observation window.
7. Record whether to explore, defer, pursue, or stop, with actual authority and
   rationale. Do not let a diagram imply a decision that has not been made.

### Output and pitfalls

An evidence-to-opportunity map and a focused learning plan, or a sparse discovery
workspace. Keep outcome targets unresolved if no baseline or desired change was
provided. Do not reuse a metric from another product as a benchmark.
Avoid solution-first trees, invented customer demand, and discovery as a gate
that permanently separates design from delivery.

## Story mapping and slicing

### Inputs and layout

Obtain actor, scenario, intended outcome, scope boundaries, known user steps,
constraints, and quality needs. A list of Jira tickets alone may not describe
the real user journey; ask what connects them.

Arrange the journey horizontally: activities above steps; candidate work below.
Use horizontal slices for coherent increments, with explicit exclusions,
dependencies, and unresolved risks beside the map.
Do not use a row per department as the default delivery slice.

### Procedure

1. Map a specific end-to-end user scenario in the user's language.
   Separate happy path, alternatives, and recoverable failure paths.
2. Place existing requirements under relevant steps and distinguish known needs
   from proposed opportunities. Retain source links.
3. Define the smallest useful end-to-end result. Ask which paths, users, or
   variants can be excluded without making it unusable or misleading.
4. Slice by behavior, scenario, or limited but coherent capability. Horizontal
   component layers such as "database first, UI next, tests later" rarely provide
   an inspectable user outcome on their own.
5. Include quality, integration, accessibility, and failure behavior relevant to
   the selected slice. Do not defer all testing to a final row.
6. Collaboratively clarify acceptance examples, dependencies, and open questions.
   Developers size the work if the team uses estimates; AI does not manufacture them.
7. Check every requirement is covered or explicitly deferred. Record the actual
   selected slice and its rationale; proposed future rows are not delivery promises.

### Output

An actor/scenario map, candidate slices, traceable coverage, and unresolved
decisions. For ticket drafting, hand off to
[jira-writing](../../jira-writing/SKILL.md); board approval is not Jira-write
approval, and that skill's allowed projects, `(PAI)`, and `Pikachu` rules apply.

## Prioritization and refinement

### Inputs and layout

Collect candidate options, objective, evidence, dependencies, constraints,
capacity assumptions, and decision authority. Ask which criteria should determine
the trade-off before choosing a scoring framework.

Frames: objective/criteria; candidates and evidence; constraints/dependencies;
comparison; ordering proposal; actual decision and follow-up.

### Procedure

1. Remove ambiguity about the decision: explore next, deliver next, sequence
   dependencies, or allocate a fixed budget. These are different problems.
2. Agree relevant criteria, definitions, and weights only if needed. Separate
   mandatory constraints from scored preferences.
3. Choose a proportionate method: explicit qualitative trade-offs for sparse
   evidence, impact/effort discussion when rough effort exists, or a quantitative
   method only when its inputs are credible.
4. If using RICE, record reach period/units, impact scale, confidence convention,
   and nonzero effort units. Unknown inputs remain unknown; do not rank missing
   values as zero or invent scores to produce a complete table.
5. Inspect dependency order and uncertainty. A high numerical score cannot
   remove a prerequisite or justify unaccepted safety/compliance risk.
6. Discuss the proposed order with the actual authority. In Scrum, support the
   PO decision while preserving Developer sizing and team collaboration.
7. Refine near-term items with examples, scope boundaries, quality risks, and
   open questions. Do not demand fully detailed far-future work or make a
   readiness checklist a rigid universal Scrum rule.
8. Record the final order only when accepted, including rationale, alternatives,
   dissent, and a trigger to revisit it.

### Output and pitfalls

Comparison with explicit inputs/unknowns, an ordering proposal, and actual
decisions where provided. Dot votes focus discussion; they do not prove value.
Avoid fake precision, popularity masquerading as evidence, and silent backlog
reordering through a visual cleanup.

## Outcome roadmap

### Inputs and layout

Confirm product direction, audience, planning horizon, known dependencies,
evidence, confidence, fixed obligations, and decision status.
Use outcome lanes or Now/Next/Later only if the labels match stakeholder needs.
Do not create calendar commitments from a request for a roadmap.

### Procedure

1. Connect each candidate initiative to an outcome and user/business problem.
   Unconnected work needs rationale, not an invented metric.
2. Show the learning or delivery objective, confidence, dependencies, and
   validation signal. Separate opportunities from selected commitments.
3. Distinguish fixed external constraints from forecasts and aspirations.
   If dates are supplied, preserve their basis and uncertainty.
4. Include discovery and quality/operational work where necessary; do not make
   the roadmap a feature-only list that hides risk-reduction activities.
5. Discuss sequencing and trade-offs rather than filling every time slot.
   Empty future space can honestly represent unresolved options.
6. Agree review triggers based on evidence, changes, or a supplied cadence.
   Record ownership only when accepted.

### Output

An outcome-oriented roadmap with status/confidence legend, dependencies,
assumptions, decision records, and next learning/review points.
Do not label it "committed" without authorization or use velocity alone to promise dates.

## Final quality gate

- Outcomes, options, constraints, evidence, and actual decisions are distinct.
- Ordering authority and Developer sizing are not replaced by AI or voting.
- Slices produce coherent value and include relevant quality work.
- Scores, estimates, metrics, and dates have real inputs or visible uncertainty.
- The board does not become an unapproved second source of backlog truth.
- Shared operations, deletion approvals, and cost transparency are followed.

## Cost transparency

Apply the [shared cost note](../SKILL.md#cost-transparency) after the response,
never inside board content.
