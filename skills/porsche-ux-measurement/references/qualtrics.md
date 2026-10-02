# Qualtrics — Attitudinal Metrics

Brief reference for the "Attitude" side of `porsche-ux-measurement`. This file is intentionally light for now — the current focus is the Fullstory MCP workflows in `fullstory-mcp.md`. Expand this file once Qualtrics API/MCP access is set up the same way.

## What Qualtrics covers here

The 3 attitudinal KPIs of Porsche's 6-KPI measurement wheel (see `kpi-framework.md`) — what users **say**, not what they do:

| KPI | What it measures | When to trigger |
|---|---|---|
| **Ease of Use** | Perceived simplicity of using the product/flow | Right after completing a specific flow (e.g. checkout, configurator) |
| **Excitement** | Porsche's Excitement Score — perceived delight/emotional response | After a consistent trigger (e.g. after a key task) — not a one-off popup |
| **Usefulness** | Perceived value of the product/flow for the user's goal | Right after completing a specific flow |

> **Note on "CES":** at Porsche this refers to the **Excitement Score**, not the generic "Customer Effort Score" used elsewhere in UX literature. Don't conflate the two.

Don't add NPS, CSAT, or other generic survey metrics unless a project explicitly defines them outside this 6-KPI framework.

## Access

- Contact [christian.pottiez@porsche.de](mailto:christian.pottiez@porsche.de) or the [Research Teams channel](https://teams.microsoft.com/l/channel/19%3Aac88c61e7d7d49c691d3c84fcd480413%40thread.tacv2/Research?groupId=872d0e4d-c7a8-4d61-81ab-ff251dd0c8a3&tenantId=56564e0f-83d3-4b52-92e8-a6bb9ea36564) for a Qualtrics account.
- No MCP integration is set up for Qualtrics yet — data is currently collected manually (export/paste into the prompt) until an integration exists.

## Common mistakes

- Confusing Porsche's Excitement Score with the generic "Customer Effort Score" — they are not the same metric
- Running Excitement surveys too frequently — use a consistent, low-frequency trigger per user
- Treating Ease of Use and Usefulness as interchangeable — one measures perceived simplicity, the other perceived value

*(To be expanded: Qualtrics survey setup at Porsche, standard question wording, and — if available — an MCP/API integration mirroring the Fullstory MCP workflow.)*
