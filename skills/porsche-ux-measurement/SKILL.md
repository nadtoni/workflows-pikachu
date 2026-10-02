---
name: porsche-ux-measurement
description: "Post-launch UX measurement combining behavioural data (Fullstory) and attitudinal data (Qualtrics) to track Porsche's 6 UX KPIs (Time on Task, Success Rate, Error Rate, Ease of Use, Excitement, Usefulness) against goals. Use when defining a measurement framework, analyzing user journeys/funnels, investigating frustration signals, or creating a post-launch measurement report. Triggers: 'Measurement Framework', 'UX KPIs', 'Journey Analyse', 'Funnel Analyse', 'sind wir erfolgreich?', 'Nutzerverhalten analysieren', 'Reibungspunkte finden', Fullstory data, funnel drop-off."
---

# UX Measurement

Measure whether a product is achieving its defined UX goals post-launch, combining **behavioural data** (what users do) and **attitudinal data** (what users think).

> **Difference to `porsche-ux-data-analysis`:**
> - `porsche-ux-data-analysis` (Phase 1): "What do users say?" — raw survey/feedback input, affinity clustering
> - `porsche-ux-measurement` (Phase 5): "Are we meeting our goals?" — KPI tracking against predefined success criteria

## The two measurement dimensions

Porsche's measurement wheel has exactly **6 KPIs**, split evenly across the two dimensions. Don't add other UX metrics (NPS, CSAT, generic CES, conversion rate, etc.) unless a project explicitly defines them — see `references/kpi-framework.md`.

| Dimension | Question | Source | KPIs |
|---|---|---|---|
| **Behaviour** | What do users do? | Fullstory (MCP) | Time on Task, Success Rate, Error Rate |
| **Attitude** | What do users think? | Qualtrics | Ease of Use, Excitement, Usefulness |

Both dimensions matter and often diverge — always report which one a number comes from. Fullstory MCP also surfaces supporting signals (funnel drop-off, rage clicks, session evidence) used to explain these KPIs, not as additional KPIs — see `references/fullstory-mcp.md`.

## References

Read the relevant file before producing output:

| File | Read it when you need… |
|---|---|
| `references/fullstory-concepts.md` | Plain-language explainer of Fullstory's building blocks (Page, Element, Event, Metric, Funnel, Heatmap, Segment) — start here if any of these words are unfamiliar |
| `references/fullstory-mcp.md` | Fullstory MCP tool capabilities, Porsche-relevant workflows (funnel analysis, frustration discovery, session deep-dives), ready-to-use prompts |
| `references/kpi-framework.md` | The 6 KPI definitions (no invented benchmarks) |
| `references/qualtrics.md` | Attitude-side KPIs (Ease of Use, Excitement, Usefulness) — brief for now, will expand |

> **MCP setup lives elsewhere.** Adding/configuring the Fullstory MCP server in VS Code is documented in `porsche-ux-workflow/SKILL.md` → [Fullstory MCP](../porsche-ux-workflow/SKILL.md#fullstory-mcp). Don't duplicate setup steps here — link to it.

## What is a "User Journey" here?

A **User Journey** is simply an action sequence through pages/screens in the app or website — e.g. "the booking process" or "the configurator flow." In this skill, a User Journey is measured by building a **Funnel** in Fullstory (an ordered chain of steps with conversion between them) — not Fullstory's separate, same-named "Journeys" feature (which is a different, exploratory tool we don't use here). See `references/fullstory-concepts.md` if any of these words are new.

## When to use

- Post-launch: "How are we performing against our UX goals?"
- Before launch: "Define a measurement framework for this feature"
- Ad hoc: "Where do users drop off in the configurator?" / "What's frustrating users this week?"
- Quarterly: "Create a KPI report for the UX team"

## Procedure

### 1. Define the measurement framework (before launch)

Ask the user:
- What are the 2–3 most important user tasks for this product/feature?
- What does "success" look like for each task? (baseline, target)
- What is the timeframe? (weekly / monthly / quarterly)
- Which data sources are available? (Fullstory, Qualtrics, manual input)

Output: **Measurement Plan** (Markdown table)

```markdown
| Task / Goal | KPI | Baseline | Target | Data Source | Owner |
|-------------|-----|----------|--------|-------------|-------|
| User completes configurator | Success Rate | — | > 80% | Fullstory | UX |
| User finds a model | Time on Task | 45s avg | < 30s | Fullstory | UX |
| Overall ease of use | Ease of Use | 3.2 / 5 | > 4.0 / 5 | Qualtrics | UX |
```

Use `references/kpi-framework.md` for the full KPI definitions. There is no shipped universal benchmark — baseline/target come from the project itself.

### 2. Collect data

- **Behavioural data (Fullstory MCP):** Time on Task, Success Rate, Error Rate, plus supporting signals (funnel drop-off, rage clicks, session evidence). See `references/fullstory-mcp.md` for the concrete tool workflows and ready-to-use prompts.
- **Attitudinal data (Qualtrics):** Ease of Use, Excitement, Usefulness from surveys. See `references/qualtrics.md`.
- **Manual input:** paste numbers directly into the prompt when no MCP/API is available.

### 3. Generate the Measurement Report

```
# UX Measurement Report — [Product/Feature Name]
Period: [Date range]

## Executive Summary
3-sentence summary: goal, main finding, recommendation

## KPI Overview (table with baseline → current → target)

## Goal Achievement
For each goal: ✓ on track / ⚠ at risk / ✗ not achieved

## Deep Dives
For each underperforming KPI: root cause hypothesis + recommendation (cite the
Fullstory session/funnel evidence, not just the number)

## Trends
Time series if multiple periods are available

## Next Steps
Prioritised action list
```

### 4. Output format

- **Markdown** (default): structured report for GitHub / Confluence
- **HTML dashboard:** pass the Markdown report to the `porsche-pds-html-presentation` skill

## Quality rules

1. **Always compare against a goal, not just show a number.** "Success Rate = 62%" means nothing without context — "Success Rate = 62%, target was > 80%, previous period was 55%" is actionable.
2. **Separate behavioural data from attitudinal data.** What users DO (Fullstory) vs. what users SAY (Qualtrics) often diverge. Report both, labeled.
3. **Cite real evidence, not just aggregates.** For any funnel drop-off or frustration signal, pull at least one real session (`get_funnel_sessions`, `get_sessions_for_opportunity`) before writing a root-cause hypothesis.
4. **Flag data quality issues.** Low sample sizes (< 30), short time windows, or non-representative user groups must be called out explicitly.
5. **One recommendation per underperforming KPI.** The report is only useful if it drives action.
6. **Stick to the 6-KPI framework.** Don't introduce NPS, CSAT, generic CES, or other metrics unless a project explicitly defines them as additional goals.
7. **Always compare over time, never report a number in isolation.** Track the same KPI before/after a change (e.g. this quarter vs. last quarter). Fullstory MCP supports this directly: `discover_groups(compare_to_previous=true)` and `update_metric(compare_to_past=true)`.

## Common mistakes

- Confusing Porsche's Excitement Score with the generic "Customer Effort Score" — they are not the same metric
- Treating Ease of Use and Usefulness as interchangeable — one measures perceived simplicity, the other perceived value
- Measuring at the wrong granularity: aggregate page-level metrics miss flow-level problems (measure per key task/funnel, not per page)
- Writing a root-cause hypothesis from a metric alone, without opening a real session to confirm it
- Inventing benchmark numbers instead of using the project's own baseline/target

## Related Skills

- For visualising a report as a dashboard → use the `porsche-pds-html-presentation` skill
- For raw qualitative feedback before launch (interviews, open surveys) → use `porsche-ux-data-analysis`
- For the overall UX process & which skill to use → use the `porsche-ux-workflow` skill

---

## Cost Transparency

At the end of every completed measurement task using this skill, append the cost estimate block.
Formula and format live in `porsche-ux-workflow/SKILL.md` (section **Cost Transparency**):

```
---
💰 ≈X,XXX In / ≈X,XXX Out Tokens · ≈X.XX Credits · **≈$X.XX** _(Claude Sonnet 4.6, inkl. 30% Puffer)_
```
