---
name: miro-qa
description: >
  Use Miro for collaborative quality-risk analysis, acceptance examples,
  exploratory test charters, coverage, and release evidence. Use for "test
  strategy board", "risk-based testing", "example mapping", "test coverage",
  "exploratory testing", "Teststrategie", "Testabdeckung", or "Qualitaetsrisiken".
---

# Miro for QA

Make quality risks and evidence inspectable throughout delivery. Testing is
whole-team work, not a final lane where QA absorbs every unknown.

## Entry and prerequisites

Follow [miro-usage](../SKILL.md), including role/framework/style kickoff.
Read [Agile foundations](../references/agile-foundations.md),
[board operations](../references/board-operations.md), and
[design and facilitation](../references/design-and-facilitation.md).
Reuse the brief; direct invocation still requires Miro MCP and the shared
approval/deletion protocol.

Confirm user/business outcome, requirements, quality obligations, supported
platforms/environments, current evidence, and decision authority.
The board can plan and summarize tests; it does not execute tests or prove a
release safe. Ask for actual results when an evidence summary is requested.

## Playbooks

| Playbook | Use when | Intended outcome |
|---|---|---|
| [Risk and coverage strategy](#risk-and-coverage-strategy) | Decide what deserves test attention | Risk-linked coverage and explicit gaps |
| [Acceptance examples and state coverage](#acceptance-examples-and-state-coverage) | Clarify behavior before/during implementation | Shared rules, examples, and unresolved questions |
| [Exploratory testing](#exploratory-testing) | Investigate uncertain behavior | Focused charters and an evidence/debrief structure |
| [Quality and release evidence](#quality-and-release-evidence) | Inspect readiness or residual risk | Accurate evidence, unresolved risk, and authorized decisions |

## Risk and coverage strategy

### Inputs and layout

Gather scope, intended users/tasks, business impact, architecture/dependencies,
quality standards, environments, historical issues, and known change risks.
Ask what decision the strategy supports and which constraints are real.

Frames: scope/quality context; risks; coverage map; environment/data needs;
gaps; accepted plan and follow-up.

### Procedure

1. Describe risks as a failure condition and consequence for a user/system,
   not a generic "high risk" label.
2. Assess impact and likelihood with agreed qualitative definitions and evidence.
   Mark uncertainty. Multiplying ordinal categories does not create a scientific
   probability or financial risk estimate.
3. Identify relevant quality dimensions: functional behavior, integration,
   reliability/recovery, accessibility, performance, security/privacy, compatibility,
   and operability. Include only applicable requirements or proposed questions.
4. Map each material risk to prevention/inspection/testing activities and a useful
   test level. A large end-to-end suite is not automatically the best coverage.
5. Decide automation versus exploratory/manual work by repeatability, feedback
   speed, maintenance, stability, and risk. Do not mandate an arbitrary automation
   percentage or claim ROI without cost/benefit evidence.
6. Identify environment, device/platform, data, observability, and access needs.
   Link approved references; never put account passwords on the board.
7. Record meaningful gaps, constraints, and residual risk. Agree who can accept
   the remaining risk; neither QA nor AI silently decides on behalf of the business.

### Output and checks

Risk/coverage matrix: risk, evidence/impact, activity/level, environment,
planned coverage, actual evidence if any, gap, and decision/owner if agreed.
Distinguish planned, designed, executed, passed, failed, blocked, and unverified.
Do not infer coverage quality from test count alone.

## Acceptance examples and state coverage

### Inputs and layout

Obtain user scenario, rules, UI/API behavior, design links, constraints,
dependencies, Definition of Done when applicable, and known ambiguous cases.
Invite product, design, and developer perspectives; example mapping is an
optional collaborative technique, not a compulsory Scrum artifact.

Frames: story/outcome; rules; examples/counterexamples; state transitions;
questions; actual decisions and tests to derive.

### Procedure

1. Start with the intended behavior and known rules. Preserve source wording
   and separate assumptions from accepted requirements.
2. Use concrete examples at relevant boundaries: valid/invalid values,
   permissions, missing data, state transitions, and recovery.
3. Cover relevant empty/loading/error/offline/retry/cancellation and accessibility
   cases with design/development input. Missing behavior becomes a question,
   not an AI-authored product commitment.
4. Write clear Given/When/Then when preconditions and sequence matter; use a
   checklist or table for independent rules. Do not enforce one syntax everywhere.
5. Check example consistency and look for counterexamples. Clarify terms such as
   "fast", "correct", or "supported" using real criteria.
6. Trace each example to a rule, state, and test activity. Separate item-specific
   acceptance criteria from the product-wide Definition of Done.
7. Record accepted behavior only after the appropriate decision. Hand unresolved
   product decisions to the PO and technical facts to Developers rather than
   deciding them through a test-case spreadsheet.

### Output

Rules, illustrative examples, state coverage, and unresolved questions.
Predicted expected outcomes are specifications, not observed test results.
Do not label example scenarios "passed" simply because they look complete.

## Exploratory testing

### Inputs and layout

Define the risk/unknown to investigate, system scope/build, relevant users,
test environment, access/data constraints, and actual session participants.
Obtain a team-agreed time budget; this is not a framework-mandated timebox.

Frames: mission/charters; setup and boundaries; observations/evidence;
questions/defects; debrief and next tests.

### Procedure

1. Write a focused charter: explore a specific area using relevant interactions
   or data to learn about a risk. Avoid "test everything".
2. Include scope exclusions, setup, build/environment, authorized accounts,
   safety constraints, and how observations will be recorded.
3. Choose useful heuristics: boundaries, interruptions, sequences, alternative
   roles, data variation, recovery, compatibility, or accessibility as applicable.
4. Provide a blank observation structure: action/context, actual result, expected
   behavior source, evidence, reproducibility, and new question.
5. For a session plan, leave results empty. For a debrief, synthesize only supplied
   observations and retain inconclusive/blocked investigations.
6. Separate suspected defects from confirmed deviations. Capture reproduction
   information and impact without inventing severity or acceptance by stakeholders.
7. Debrief coverage, learning, residual risk, and focused next charters.
   A charter timebox does not cap necessary follow-up on a serious finding.

### Output and checks

Executable charters or an evidence-based debrief, clearly labeled.
Never imply the AI executed the session through Miro. Do not authorize destructive
tests, production changes, or sensitive data collection through a board request.
Jira defect drafting follows the separate Jira handoff and its approval rules.

## Quality and release evidence

### Inputs and layout

Obtain actual build/release scope, applicable quality policy/Definition of Done,
requirements and risks, environment details, observed test evidence, open
defects, limitations, and authorized release/risk decision makers.
Missing evidence is not a pass.

Frames: scope/build and criteria; evidence by risk/requirement; defects/blockers;
coverage gaps/residual risk; authorized decision and follow-up.

### Procedure

1. Verify that each result refers to the relevant build, environment, time,
   test scope, and source. Older evidence is not automatically valid after a change.
2. Distinguish actual passed/failed/blocked/not-run evidence from planned tests
   and unverified assertions. Link real reports where supplied.
3. Map evidence to material requirements/risks and completion policy.
   Do not fabricate traceability or infer pass status from a green sticky.
4. Surface missing regression, integration, accessibility, or operational evidence
   when relevant, without inventing requirements that were never agreed.
5. Show unresolved defects, workarounds, residual impact, and uncertainty.
   "No defects found" does not prove absence of defects.
6. Facilitate the actual decision maker reviewing readiness and residual risk.
   Record the decision only when supplied; AI cannot approve a release.
7. In Scrum, do not mark work Done unless it meets the Definition of Done, lower
   quality to meet a Sprint forecast, or treat Sprint Review as a release gate.

### Output

An evidence summary with actual status, gaps, limitations, authorized decision
if made, and follow-up. If evidence is incomplete, state that readiness cannot
be established rather than returning a success-shaped "QA sign-off".

## Final quality gate

- Risks connect to user/system consequences and appropriate coverage.
- Accepted rules, proposals, expected outcomes, and observed results are distinct.
- Data/build/environment context and evidence limitations are explicit.
- Quality is whole-team work; unresolved behavior and risk authority are visible.
- No credentials, invented passes, unauthorized test execution, or release approval.
- Shared MCP operations, deletion approval, and cost transparency are followed.

## Cost transparency

Apply the [shared cost note](../SKILL.md#cost-transparency) after the response,
never inside board content.
