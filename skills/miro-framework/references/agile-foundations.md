# Agile Foundations

Use this reference to select appropriate practices without equating Agile with
Scrum, mistaking optional methods for rules, or inventing evidence.

## Authority and sources

These instructions summarize principles and provide original operating advice;
they do not reproduce the source guides. Follow confirmed team agreements and
identify deviations from a named framework honestly.

| Source | What it supports | Boundary |
|---|---|---|
| [Agile Manifesto principles](https://agilemanifesto.org/principles.html) | Value, collaboration, feedback, sustainable pace, simplicity and technical excellence | Principles, not a prescribed process |
| [Scrum Guide](https://scrumguides.org/scrum-guide.html) | Scrum accountabilities, events, artifacts and commitments | Applies when the team chooses Scrum |
| [The Kanban Guide](https://kanbanguides.org/the-kanban-guide/) | Definition of Workflow, active flow management, improvement and flow metrics | Applies when operating Kanban; a column board alone is insufficient |
| [GOV.UK research planning](https://www.gov.uk/service-manual/user-research/plan-user-research-for-your-service) | Questions, recruitment, inclusive research and ongoing learning | Useful service-design guidance, not universal legal policy |
| [GOV.UK prototypes](https://www.gov.uk/service-manual/design/making-prototypes) | Choosing fidelity to explore and test before committing | GOV.UK-specific obligations are not automatically this team's rules |
| [ISTQB Agile Tester](https://istqb.org/certifications/certified-tester-foundation-level-agile-tester-ctfl-at/) | Whole-team testing, testable requirements and quality-risk thinking | Professional guidance, not a mandatory Agile framework |

When exact regulatory, accessibility, or contractual obligations matter, obtain
the applicable standard and context. Do not turn generic guidance into a legal
claim. Recheck the primary source when a disputed framework rule affects a task.

## Common Agile operating principles

1. Start with user/business value and a learning or delivery objective. A populated
   Miro board is an aid to collaboration, not a measure of delivered value.
2. Use short feedback loops. Prefer the smallest useful experiment, work slice,
   or improvement that can yield evidence.
3. Separate fact, interpretation, hypothesis, proposed action, and decision.
   Attach source/date/context to evidence and expose missing information.
4. Encourage daily collaboration across product, design, engineering, and QA.
   Specialist perspectives do not justify sequential departmental handoffs.
5. Make quality and technical excellence part of work, not a last-stage cleanup.
6. Optimize sustainable team flow, not individual utilization or note counts.
7. Adapt plans when evidence changes. Preserve the rationale and learning instead
   of rewriting history to make an earlier plan appear correct.
8. Keep the artifact as small as the decision needs. More lanes and ceremonies
   do not compensate for unclear goals or missing decision authority.

## If the team uses Scrum

### Accountabilities and decision boundaries

- The Product Owner is accountable for maximizing value and effective Product
  Backlog management, including its ordering and Product Goal.
- Developers plan the Sprint work, size the work they will do, adapt the plan,
  and adhere to the Definition of Done. Do not assign tasks or estimates for them.
- The Scrum Master enables effective Scrum and team improvement, including
  self-management and causing impediments to be removed.
- Designers and QA contributing to the Increment can be Developers in Scrum's
  broad sense. Avoid boards that create isolated design/dev/test sub-teams.
- Facilitation and AI assistance do not transfer these accountabilities.

### Artifacts and commitments

| Artifact | Commitment | What the board must preserve |
|---|---|---|
| Product Backlog | Product Goal | Ordered work connected to a future product outcome |
| Sprint Backlog | Sprint Goal | Goal, selected work, and an actionable Developers' plan |
| Increment | Definition of Done | Usable, verified work satisfying agreed product quality |

Do not confuse item-specific acceptance criteria with the product Definition of
Done. A QA checklist or PO approval alone is not the Definition of Done.
The team cannot lower quality to make a Sprint appear complete. Unfinished work
must not be relabeled Done or presented as a usable Increment.

### Events: purpose before template

| Event | Facilitation objective | Avoid |
|---|---|---|
| Sprint Planning | Agree why the Sprint matters, what can be Done, and how the Developers will approach it | A task-assignment meeting or fixed-scope promise |
| Daily Scrum | Inspect progress toward the Sprint Goal and adapt the next plan | Reporting to a manager or mandatory three-question script |
| Sprint Review | Inspect the outcome with stakeholders and adapt future direction | A sign-off/release gate or presentation-only meeting |
| Retrospective | Improve effectiveness and quality through concrete changes | Blame, fabricated consensus, or an unowned wish list |

Formal timeboxes: Sprint at most one month; Daily Scrum 15 minutes. For a
one-month Sprint, Planning is at most eight hours, Review four, Retrospective
three; shorter Sprints usually use shorter events. Example agendas in role
playbooks are adjustable facilitation budgets, not new Scrum rules.

Refinement is ongoing work, not a required named event. Scope can be clarified
with the PO without endangering the Sprint Goal. Release need not wait for Review.
Only the PO can cancel a Sprint whose goal becomes obsolete.

### Optional techniques

Story points, velocity, planning poker, story mapping, Definition of Ready,
RICE, MoSCoW, impact/effort matrices, and particular retrospective formats are
not required by Scrum. Recommend them only when they solve an identified problem.
A team's readiness checklist must not become a rigid gate that blocks learning.
Do not compare individuals or teams by velocity or promise a delivery date from it.

## If the team uses Kanban

### Establish the Definition of Workflow

Before drawing columns, agree:

1. What the unit of value/work item is.
2. Where work starts and finishes, including any relevant multiple boundaries.
3. The states between those boundaries.
4. How WIP is controlled across the workflow.
5. Explicit movement, pull, blocker, exception, and completion policies.
6. A service level expectation: elapsed time plus a probability.

Controls can be represented differently; per-column numeric limits are not the
only acceptable form. Make exceptions explicit rather than hiding excess WIP.
Do not assume a blocked item leaves WIP or that a new column fixes a bottleneck.

### Metrics and forecasting

| Metric | Definition | Required data |
|---|---|---|
| WIP | Started, not yet finished items | Current state and agreed boundaries |
| Throughput | Count finished per time unit | Finish timestamps and a defined time window |
| Work item age | Elapsed time since start for unfinished items | Start timestamp and observation time |
| Cycle time | Elapsed time from start to finish | Start and finish timestamps |

These are the four flow metrics in the Kanban Guide. An SLE is part of the
Definition of Workflow, not a fifth metric or a guaranteed deadline.
Use historical cycle times for an SLE when available. Without history, the Guide
permits a best guess: obtain a team-agreed provisional value, label it clearly,
and plan validation. Do not generate a plausible-looking probability from nothing.

Never infer historical metrics from a static board's positions. Do not multiply
ordinal estimates into precise delivery promises. Explain date/time conventions,
sample size, comparable item types, and uncertainty in any forecast.

### Active management and improvement

Inspect aging items and blockers; finish or unblock before starting more work.
Make capacity signals and pull rules visible. Review the workflow when evidence
shows a problem, not only at a formal ceremony. Scrum events may coexist with
Kanban controls; name the actual combination rather than prescribing a hybrid.

## Discovery, delivery, and quality together

- Discovery reduces uncertainty about users, value, usability, feasibility, and
  viability. Delivery turns validated or explicitly risk-accepted options into
  working value. These activities can overlap; do not create a mandatory phase gate.
- Use designer, developer, QA, and PO perspectives early when clarifying examples,
  constraints, states, risks, and the smallest useful slice.
- Test as soon as there is something to inspect: assumptions, examples, designs,
  contracts, code, environments, or working behavior.
- Record residual risk and the authorized decision maker. A facilitator or AI
  does not accept production risk on behalf of stakeholders.

## Evidence and decisions

Use a short evidence record: observation, source, date/context, limitation,
interpretation, confidence, and next question. Keep participant quotes unchanged.
Use a decision record: issue, options, criteria, decision authority, actual
decision/status, rationale, dissent, owner, follow-up date, and validation signal.
Unknown ownership or agreement stays unknown. Empty spaces invite contribution;
AI-generated votes, quotes, research participants, test results, or consensus do not.
