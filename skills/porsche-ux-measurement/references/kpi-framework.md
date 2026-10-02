# KPI Framework

Reference tables for `porsche-ux-measurement`. Use these definitions when building a Measurement Plan or evaluating a Measurement Report.

Porsche's measurement wheel has exactly **6 KPIs**, split evenly across the two dimensions. Don't add other UX metrics (NPS, CSAT, generic CES, conversion rate, etc.) unless a project explicitly defines them.

## The 6 KPIs

| KPI | Dimension | Source | What it measures |
|-----|-----------|--------|-------------------|
| **Time on Task** | Behaviour | Fullstory | How long it takes users to complete a key task |
| **Success Rate** | Behaviour | Fullstory | Share of task attempts completed successfully |
| **Error Rate** | Behaviour | Fullstory | Share of task attempts that hit an error — no built-in Fullstory metric, must be defined per journey (see `fullstory-mcp.md` → "Defining Error Rate signals") |
| **Ease of Use** | Attitude | Qualtrics | Perceived simplicity of using the product/flow |
| **Excitement** | Attitude | Qualtrics | Porsche's Excitement Score — perceived delight/emotional response |
| **Usefulness** | Attitude | Qualtrics | Perceived value of the product/flow for the user's goal |

> **Note on "CES":** at Porsche this refers to the **Excitement Score** (Qualtrics), not the generic "Customer Effort Score" used elsewhere in UX literature.

## Benchmarks

No universal benchmark tiers are shipped with this skill — define baseline and target per project in the Measurement Plan (see `SKILL.md` → Procedure, step 1). Inventing generic "industry" benchmarks here would create false precision; use the project's own baseline instead.

See `fullstory-mcp.md` for how to compute Time on Task / Success Rate / Error Rate via Fullstory MCP tools, and `qualtrics.md` for the attitudinal side.
