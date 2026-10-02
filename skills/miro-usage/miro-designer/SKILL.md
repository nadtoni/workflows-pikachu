---
name: miro-designer
description: >
  Use Miro for evidence-based research synthesis, journey maps, ideation,
  interaction flows, design critique, and usability study planning. Use for
  "research synthesis", "journey map", "ideation workshop", "design a user flow",
  "design critique", "Research auswerten", "Nutzerreise", or "Designworkshop".
---

# Miro for Designers

Make user evidence, uncertainty, interaction behavior, and learning visible.
Beautiful boards must not turn assumptions into research findings.

## Entry and prerequisites

Follow [miro-usage](../SKILL.md) first, including working role, framework,
objective, artifact type, and style. Read
[Agile foundations](../references/agile-foundations.md),
[board operations](../references/board-operations.md), and
[design and facilitation](../references/design-and-facilitation.md).
Reuse confirmed Designer context; direct invocation still requires shared
Miro MCP and approval/deletion rules.

Confirm target users/task, evidence availability, product/design stage,
constraints, participants, and intended decision. Research, design, engineering,
and QA should collaborate; do not prescribe "design one Sprint ahead" as a
universal rule or turn a prototype into a production-ready claim.

## Playbooks

| Playbook | Use when | Intended outcome |
|---|---|---|
| [Research synthesis](#research-synthesis) | Observations need meaning and traceability | Supported findings, tensions, and next questions |
| [Journey mapping](#journey-mapping) | Understand a user's end-to-end experience | Evidence-linked steps and improvement opportunities |
| [Ideation and concept selection](#ideation-and-concept-selection) | Explore ways to solve a defined problem | Diverse options and a reasoned validation plan |
| [Flows, prototypes, and critique](#flows-prototypes-and-critique) | Clarify behavior or evaluate design alternatives | Explicit states, actionable critique, and testable options |
| [Usability study planning](#usability-study-planning) | A design hypothesis needs user evidence | Neutral tasks and an executable research plan |

## Research synthesis

### Inputs and layout

Obtain research questions, method, participant/sample context, observations,
consented shareable excerpts, dates, and limitations. Remove personal identifiers
from shared content; do not upload raw recordings or sensitive transcripts.

Frames: research scope/limitations; source observations; clusters/themes;
findings and counterevidence; opportunities; next research/decisions.
For a workshop, keep clustering areas open; for a synthesis, populate only from
provided material. Do not invent quotes to demonstrate a finished affinity map.

### Procedure

1. Separate observed behavior and participant words from analyst interpretation.
   Preserve exact supplied quotes unless the user requests a clearly labeled paraphrase.
2. Give each observation a source reference and context without unnecessary identity.
   Keep repeated observations traceable; duplicates are not automatically stronger evidence.
3. Cluster by meaning while retaining originals and outliers. Ask about unclear
   notes rather than silently changing their meaning.
4. Name themes descriptively, not as premature solutions. Record contradictions
   and alternative explanations.
5. Create findings with evidence, scope, confidence/limitations, user impact,
   and unanswered questions. Do not infer population prevalence from a small
   qualitative sample or causality from a funnel drop-off.
6. Translate supported findings into opportunities or research questions. Label
   AI-generated interpretations and possible next steps as proposals.
7. Decide with the team what to investigate, act on, or defer; do not automatically
   turn every observation into a backlog item.

### Output and checks

Traceable themes/findings, contradictory evidence, limitations, and next learning
questions. If only opinions are supplied, call the result assumption mapping,
not research synthesis. A cluster's note count is not validated importance.

## Journey mapping

### Inputs and layout

Clarify actor/user group, scenario, start/end boundary, channels, context,
current versus proposed future state, and evidence.
Use separate maps or clearly separated sections for current and future state.

Suggested lanes: stages; user goal/actions; touchpoints; evidence;
problems/constraints; opportunities. Add emotions only if supported, with source
or a visible "hypothesis" marker. Add backstage/service dependencies only when
they help the decision; do not call an unlabeled journey a service blueprint.

### Procedure

1. Choose one coherent scenario. Avoid a generic map covering every persona
   and every possible interaction.
2. Lay out observed steps chronologically, including relevant waits, channel
   changes, failures, retries, and recovery.
3. Attach evidence to problematic moments. Keep gaps visible instead of filling
   them with plausible user feelings or invented satisfaction scores.
4. Connect user problems to constraints and possible opportunities. Do not
   silently make future-state behavior part of current-state evidence.
5. Discuss which moment matters most for the agreed outcome using user impact,
   evidence, frequency when known, and feasibility input.
6. Define a learning or improvement action and validation signal. If no decision
   authority is present, return a prioritized proposal rather than consensus.

### Output

A scoped, labeled journey with source-backed pain points, hypotheses, and next
questions/actions. A future-state map is an intention, not evidence it will work.
Offer a textual journey summary when participants cannot use the visual map easily.

## Ideation and concept selection

### Inputs and layout

Start from a supported problem or an explicitly unvalidated assumption.
Confirm target user/task, constraints, participants, intended decision, and
selection criteria. Techniques such as HMW prompts or Crazy 8s are optional.

Frames: problem/evidence; constraints and HMW; individual ideas; concept
families; comparison; chosen hypotheses and validation plan.

### Procedure

1. Frame a question broad enough for alternatives but specific about the user
   need. Avoid a leading HMW that embeds the preferred feature as the answer.
2. Restate constraints and separate genuine obligations from team assumptions.
   Invite development/QA feasibility and risk input without prematurely shutting
   down exploration.
3. Begin with individual reflection or asynchronous ideas to reduce anchoring.
   AI suggestions must be labeled; never present them as participant contributions.
4. Combine ideas into coherent concepts with user benefit, key interaction,
   assumptions, constraints, and likely trade-offs.
5. Compare concepts against agreed criteria, not only aesthetics or votes.
   Unknown effort, value, and accessibility implications stay unknown.
6. Keep viable alternatives and dissent. Select what to learn about next, not
   automatically what to build.
7. Define the smallest test for the riskiest assumption and how results will
   alter the decision. Record who actually accepted the plan.

An example 60-minute budget: framing 10, individual ideas 10, clustering 10,
concept building 15, comparison/test planning 10, close 5. Adjust for access needs.

### Output and pitfalls

Concept options with rationale, uncertainties, and a validation plan.
Avoid fake workshop votes, a single inevitable concept, and impact/effort
scores generated without inputs.

## Flows, prototypes, and critique

### Inputs and layout

Obtain the user task, entry/exit points, platform, roles/permissions, known
business rules, states, dependencies, reference design links, and review question.
For critique, inspect supplied artifacts rather than pretending to have seen
an inaccessible Figma file.

Use a flow frame with a legend, separate state coverage, and a critique/decision
area. Confirm whether the task is behavior mapping, low-fidelity screens, a
supported interactive prototype, or critique; these are different deliverables.

### Procedure

1. Define actors, system boundaries, entry conditions, and successful outcomes.
   A decision node needs an actual condition and labeled outgoing paths.
2. Map the happy path, then applicable alternatives: empty/loading/error,
   invalid input, permissions, cancellation, retry, and offline/recovery.
   Mark unknown behavior as a question; do not expand committed product scope.
3. Distinguish user actions, system responses, external services, and states.
   Keep technical details only to the level needed for the design decision.
4. Include interaction/accessibility questions such as focus progression,
   feedback, understandable error messages, and non-color status cues when relevant.
   Confirm applicable standards; do not claim compliance from a board diagram.
5. Choose fidelity to answer the question. Use low fidelity for structure/options;
   use realistic interactions when evaluating behavior. Load Miro's prototyping
   format guidance only if that capability is available. An inert screen sketch
   must not be reported as an interactive prototype.
6. For critique, establish goals and criteria, collect observations before
   recommendations, and connect each issue to user impact/evidence.
   Separate taste, usability risk, inconsistency, and missing requirements.
7. Prioritize critique by agreed impact/risk and confidence. Keep rationale,
   alternative options, actual decisions, and unresolved points.
8. Define a thin implementation/learning slice with PO, developer, and QA input.
   A design-only completion criterion should not require shipped app behavior.

### Output and checks

Readable flows, relevant state matrix, prototype fidelity/capability disclosure,
and actionable critique with evidence. Avoid unlabeled spaghetti arrows,
invented screens that imply accepted requirements, and design/dev/test silos.

## Usability study planning

### Inputs and layout

Ask which hypothesis or decision the study should inform, target user groups,
method, prototype fidelity, recruitment/access constraints, and consent/privacy
requirements. Do not prescribe a universal participant count or promise statistical
confidence from a handful of interviews.

Frames: research questions; participant/context criteria; tasks and probes;
observation measures; session logistics; analysis/decision plan.

### Procedure

1. Convert assumptions into answerable research questions. Choose a method
   appropriate to behavior, motivation, prevalence, or a comparative claim.
2. Define recruitment and inclusion needs, including relevant disabilities,
   assistive technology, digital skills, and contextual constraints.
3. Write neutral, realistic task scenarios without revealing the solution.
   Separate success criteria from the instructions participants hear.
4. Record observable task outcomes, errors, assistance, and uncertainty as
   appropriate. Do not invent success rates or benchmark thresholds.
5. Establish facilitator probes that do not lead participants or teach the
   interface. Agree how consent, recording, secure storage, and sharing are handled.
6. Plan a pilot for unclear tasks or unreliable prototypes. Note which limitations
   could confound the findings.
7. Define analysis and decision triggers before claiming success. Capture actual
   results only after the study; empty result areas are correct in a plan.

### Output

A study plan and task/observation structure, not completed research findings.
Use de-identified evidence for later synthesis. Never populate participant quotes,
emotions, or task results with believable AI examples unless visibly labeled fiction.

## Final quality gate

- Current evidence, interpretations, hypotheses, and future intentions are distinct.
- User scenarios and source limitations are explicit; quotes remain traceable.
- Relevant states, recovery paths, accessibility questions, and constraints appear.
- Workshop seeds are labeled; votes, participants, metrics, and results are not invented.
- Critique leads to a decision or validation activity rather than taste-based verdicts.
- Shared Miro operations, deletion approval, and cost transparency are followed.

## Cost transparency

Apply the [shared cost note](../SKILL.md#cost-transparency) after the response,
never inside board content.
