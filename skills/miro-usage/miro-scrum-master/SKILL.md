---
name: miro-scrum-master
description: >
  Facilitate team improvement and Scrum or flow collaboration on Miro with
  evidence, explicit decisions, and actionable follow-up. Use for "Miro
  retrospective", "Sprint Planning board", "Daily Scrum board", "Sprint Review",
  "impediment workshop", "Retrospektive vorbereiten", "Sprintplanung", or
  "Teamvereinbarungen".
---

# Miro for Scrum Masters

Enable team effectiveness and self-management; do not turn the board into
manager reporting, task assignment, or a substitute for team decisions.

## Entry and prerequisites

First follow [miro-usage](../SKILL.md), including its role/framework/style kickoff.
Read [Agile foundations](../references/agile-foundations.md),
[board operations](../references/board-operations.md), and
[design and facilitation](../references/design-and-facilitation.md).
Reuse established context when routed here. Live work requires Miro MCP and the
shared approval/deletion protocol; a direct invocation does not bypass them.

Confirm the team objective, participants, session duration, current agreements,
evidence, and decision authority. In Kanban or a custom process, use team
improvement and flow playbooks without claiming Scrum events are required.
Suggested workshop budgets below are adjustable, not Scrum timebox replacements.

## Playbooks

| Playbook | Use when | Intended outcome |
|---|---|---|
| [Retrospective](#retrospective) | Improve how the team works | A small number of testable improvements |
| [Sprint Planning](#sprint-planning) | A Scrum team prepares its next Sprint | Goal, selected work, and an actionable Developers' plan |
| [Daily coordination](#daily-coordination) | Inspect the next useful team action | Adapted plan and clear impediment follow-up |
| [Sprint Review](#sprint-review) | Inspect outcomes with stakeholders | Evidence-backed adaptations |
| [Flow and working agreements](#flow-and-working-agreements) | Expose bottlenecks or clarify collaboration | Explicit policies and an improvement experiment |

## Retrospective

### Inputs and board structure

Obtain the period, objective, prior improvement actions, relevant events or flow
data, and any sensitive topics. Do not prefill participants' feelings or attribute
anonymous-looking notes to people.

Frames: purpose/agreements; prior actions; observations/timeline; themes;
possible improvements; chosen experiments; follow-up.
Choose prompts that fit the problem: recurring handoff issues need a workflow
or timeline lens, not automatically Start/Stop/Continue.

### Facilitation procedure

1. Establish respectful contribution norms and the decision method. State that
   the board is not guaranteed anonymous; minimize personal attribution.
2. Review the last improvement: what changed, what evidence exists, what remains
   unknown. Do not carry forward actions indefinitely without inspecting them.
3. Gather observations before interpretations. Offer silent/asynchronous input
   and label supplied data separately from opinions.
4. Clarify and cluster while preserving original notes. Ask about contradictions
   and outliers; do not merge away a minority concern.
5. Explore one or two high-impact themes: situation, impact, contributing
   conditions, and what the team can influence. Treat root causes as hypotheses
   until supported; repeated "why" questions are not proof.
6. Propose small experiments rather than broad mandates. For each, define
   changed behavior, expected signal, agreed owner, review point, and constraints.
7. Apply the agreed selection method and record actual decisions/dissent.
   Popularity alone does not justify unsafe or exclusionary changes.
8. Close by reading back commitments and scheduling how learning will be reviewed.

An example 60-minute budget: opening/prior actions 10, observations 10,
sense-making 15, experiments 20, close 5. Adapt to accessibility and team needs.

### Output and failure modes

Return actual improvement decisions or a ready-to-facilitate scaffold, not a
claim that the team agreed to AI-proposed actions. Include unresolved concerns.
If blame or personal conflict dominates, return to observable situations and
working conditions; do not diagnose individuals on the board.
If the issue exceeds team authority, record an escalation request with an agreed
contact instead of pretending the team can solve it locally.

## Sprint Planning

### Inputs and board structure

Confirm Scrum, Sprint length, Product Goal, current ordered backlog, proposed
value, upcoming capacity/constraints, and Definition of Done. Estimates must
come from the people doing the work, not AI-generated story points.

Frames: context/Product Goal; proposed Sprint value; candidate work;
risks/dependencies/capacity; Developers' plan; final goal and selected work.
Link the real source backlog so the Miro board is not a contradictory second one.

### Procedure

1. Make the "why" explicit: the PO proposes value; the team formulates a coherent
   Sprint Goal. Avoid replacing a goal with a list of unrelated tickets.
2. Discuss "what": Developers select work with the PO using actual capacity,
   past performance where available, and the Definition of Done.
3. Clarify examples, dependencies, quality work, and uncertainty. Leave unresolved
   selection as proposed; do not create a false commitment by moving a sticky.
4. Support "how": Developers build an actionable plan. Visualize collaboration
   and small work slices without assigning tasks or dictating implementation.
5. Check that the goal and chosen scope are coherent, critical dependencies are
   visible, and the plan includes testing/integration rather than deferring quality.
6. Record the actual Sprint Goal, selection, planning assumptions, and remaining
   decisions. If no agreed goal exists, label the artifact incomplete.

### Decision boundaries

The PO orders the Product Backlog; Developers determine selection and how work
is done. A facilitator helps these decisions, not substitutes for them.
Forecasts are not fixed-scope promises. Definition of Ready, points, velocity,
and task-assignment lanes are optional techniques, not mandatory Scrum artifacts.

### Output

The actual Sprint Goal, selected work, Developers' plan, and planning assumptions,
or an explicitly incomplete planning workspace when those decisions are pending.

## Daily coordination

### Inputs and board structure

For Scrum, inspect the actual Sprint Goal and current plan. For Kanban, inspect
the Definition of Workflow, aging/blockers, and capacity signals.
Use a compact target area, not a fresh full-board ceremony each day.

### Procedure

1. Read current goal/work state and identify relevant changes since the last
   coordination point. Do not invent yesterday/today updates for team members.
2. In Scrum, support Developers inspecting progress toward the goal and adapting
   their plan; the Daily Scrum is 15 minutes and not a report to the Scrum Master.
3. In flow-based work, start with finishing, blocked, or aging items and the pull
   policy. Do not calculate age without start timestamps.
4. Capture the next collaborative action, dependency contact if agreed, and
   longer discussions to take outside the short coordination meeting.
5. Keep the live plan authoritative. Board annotations do not update Jira unless
   the separate Jira handoff is requested and approved.

### Output

A concise adapted plan or an inspection scaffold with unresolved impediments.
Do not fabricate individual status, split everyone into utilization targets,
or treat an unchanged board as evidence that nothing happened.

## Sprint Review

### Inputs and board structure

Obtain Product/Sprint Goals, evidence of usable Done work, stakeholder context,
changed conditions, and open product questions.
Frames: goal and context; actual outcomes/evidence; stakeholder observations;
changed assumptions; possible adaptations; PO ordering decisions/follow-up.

### Procedure

1. Distinguish usable Done outcomes from prototypes, plans, and unfinished work.
   Do not present unfinished items as a completed Increment.
2. Make evidence and stakeholder questions visible. A prototype may inform
   discussion, but must not masquerade as shipped functionality.
3. Compare learning and outcomes with the Product Goal; inspect environmental
   changes and what they mean for future work.
4. Facilitate collaboration on options, not only a slide-show status update.
5. Capture actual adaptations, unresolved decisions, and PO follow-up on ordering.
   Do not make Review a mandatory release/sign-off gate.

### Output

Source-backed outcomes, stakeholder feedback, product adaptations, and open
questions. A prepared Review board is not evidence that stakeholders attended.

## Flow and working agreements

### Inputs and board structure

Use the real workflow, item types, start/finish boundaries, WIP control,
movement/exception policies, data availability, and decision participants.
Frames: current workflow; explicit policies; blockers/aging evidence;
candidate changes; agreed experiment and review.

### Procedure

1. Map what actually happens, including waiting and rework. Do not draw an
   aspirational workflow and call it current state.
2. Identify where work is blocked, accumulating, or aging. Use actual data;
   a large pile of notes alone does not reveal historical cycle time.
3. Propose a WIP/pull-policy or collaboration experiment with the team. Do not
   invent numeric limits, service-level probabilities, or escalation deadlines.
4. Clarify handoff expectations, blocker ownership, exceptions, and completion.
   Agree operational language that people can apply to a real item.
5. Record the accepted policy, rationale, review signal, and unknowns.
   In Scrum, protect the Sprint Goal and Definition of Done.

### Output and checks

An explicit workflow/policy map or a marked proposal; one inspectable experiment
with actual decision authority. Do not compare teams by velocity or reward
starting work faster while ignoring completion.

## Final quality gate

- The framework and event purpose are accurate; optional techniques are labeled.
- Participation is inclusive and decisions are not invented or attributed falsely.
- Team self-management, PO ordering, and Developer planning are preserved.
- Quality, evidence, unresolved impediments, and follow-up are visible.
- The board produces an actionable improvement or adaptation, not just notes.
- Shared live-edit/deletion and cost-transparency rules have been followed.

## Cost transparency

Apply the [shared cost note](../SKILL.md#cost-transparency) after the response,
never inside board content.
