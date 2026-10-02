# Fullstory MCP — Tool Reference & Porsche Workflows

Grounded in the official Fullstory MCP tools ([developer.fullstory.com/mcp/tools-reference](https://developer.fullstory.com/mcp/tools-reference/)). Use this file when running measurement tasks with Fullstory MCP.

> **Setup:** adding the Fullstory MCP server to VS Code is documented in `porsche-ux-workflow/SKILL.md` → **Fullstory MCP** section. This file assumes the MCP is already connected — it does not repeat setup steps. That section also covers checking which **org** is currently active, and how to switch — verify this first if numbers look unexpected.

> **New to Fullstory's vocabulary?** Read `references/fullstory-concepts.md` first — it explains Page, Element, Event, Metric, Funnel, Heatmap, and Segment in plain language with examples.

## Prerequisites (recap)

- Fullstory MCP is in **private beta** — the org must have MCP beta access.
- **StoryAI Features must be enabled** for the org (Fullstory → Settings > Account Management > StoryAI Features). If disabled, the client connects successfully but returns zero tools.
- **Opportunity Lookup tools** (`get_opportunities`, `get_opportunity`, `get_sessions_for_opportunity`) additionally require **StoryAI Premium SKU**.

## Tool categories

### Analytics — turn questions into numbers

| Tool | Purpose |
|---|---|
| `build_segment` | Natural language → saved segment (a group of users/sessions) |
| `update_segment` | Refine an existing segment ("add iOS users only") |
| `get_segment` | Look up saved segments by id or name |
| `build_metric` | Natural language → metric definition (`single_number`, `top_n`, or `trend`) |
| `update_metric` | Refine an existing metric |
| `compute_metric` | Execute a metric, optionally scoped to a segment/time range |
| `get_metric` | Look up saved metrics by id or name |

### Funnels — journey / step analysis

| Tool | Purpose |
|---|---|
| `build_funnel` | Natural language → ordered funnel (e.g. "config page → CTA click → dealer form submit") |
| `get_funnel` | Look up saved funnels by id or name |
| `compute_funnel` | Run a funnel: count + conversion at each step |
| `get_funnel_sessions` | Real sessions for a specific step — pass `did_not_complete=true` for drop-off evidence |

### Sessions — evidence & lookup

| Tool | Purpose |
|---|---|
| `get_sessions` | Sessions matching a metric or segment |
| `get_session_events` | Full chronological event transcript for one session |
| `get_pages` | Look up page definitions/IDs to scope other tools |

### Agentic Session Review — stateful, visual drill-down

| Tool | Purpose |
|---|---|
| `session_open` | Open a session → returns `client_id` (call first) |
| `session_screenshot` | Render what the user saw at a timestamp |
| `session_get_a11y_tree` | Accessibility tree at a timestamp (roles, labels, hierarchy) |
| `session_diff` | Diff the a11y tree between two timestamps — what changed |
| `session_close` | **Required** — always close when done, or it blocks further `session_open` calls |

`session_view` is deprecated — use `session_screenshot` (visual) + `session_get_a11y_tree` (structure) instead.

### StoryAI Opportunities — frustration discovery

| Tool | Purpose |
|---|---|
| `discover_groups` | Top frustration signals — org-wide or scoped to page/domain/segment/funnel; `compare_to_previous=true` surfaces regressions |
| `get_opportunity_stats` | Live stats for one signal: affected users, breakdowns, rate of change |
| `classify_opportunity` | Triage a signal by sampling real sessions (noise, angry-highlight, 3rd-party attribution) |
| `get_opportunities`* | Pre-ranked opportunities for the org |
| `get_opportunity`* | Full record for one opportunity |
| `get_sessions_for_opportunity`* | Real sessions for one opportunity |

\* Requires StoryAI Premium SKU. `discover_groups`, `get_opportunity_stats`, `classify_opportunity` do **not** require Premium.

## Porsche-relevant workflows

These map directly onto the **Behaviour** half of Porsche's 6-KPI measurement wheel (Time on Task, Success Rate, Error Rate — see `kpi-framework.md`).

### KPI → MCP tool cheat sheet (verified)

| KPI | How to get it via MCP | Caveat |
|---|---|---|
| **Success Rate** | `compute_funnel` → `conversion_from_previous` / `conversion_from_first` | Matches the Fullstory UI's "Funnel conversion rate" exactly |
| **Time on Task** | Not available via MCP. Open the `funnel_url` that `build_funnel`/`compute_funnel` returns — the Fullstory UI shows "Median time to convert" next to the conversion rate | Confirmed by live testing: `compute_funnel`'s response only contains step counts and conversion rates, no duration field |
| **Error Rate** | No built-in Fullstory KPI. Default: `discover_groups` (zero setup, org-wide rage/dead-click/reload signals). Precise: a custom Watched Element/Event (see "Defining Error Rate signals" below) | Custom signals need DOM verification before use |

### 1. Funnel Analysis (primary Porsche use case — this is how we measure a "User Journey")

Maps a configurator, checkout, or lead-gen flow to a Fullstory funnel.

1. `build_funnel` — describe the flow in plain language, e.g. *"Model page view → Configurator start → Configuration complete → Dealer request submitted"*. Always let `time_range` default or set it explicitly (e.g. `last_30_days`) — do not use `start_date`/`end_date` for a funnel meant for ongoing tracking (see stale-funnel note below).
2. `compute_funnel` — get step-by-step conversion (= Success Rate). For Time on Task, open the returned `funnel_url` in the browser.
3. `get_funnel_sessions` with `did_not_complete=true` — pull real sessions at the worst drop-off step
4. `get_session_events` (or `session_open` + `session_screenshot`) on 3–5 of those sessions — find the *why*

**Example prompt:**
> "Use Fullstory MCP only. Build a funnel: Panamera configurator start → color selection → wheel selection → summary → dealer request. Show me conversion per step and the sessions that dropped off between wheel selection and summary."

> **Stale funnel gotcha (verified live):** a saved funnel built with an absolute `start_date`/`end_date` freezes to that window forever. Once the window is in the past, `compute_funnel` fails with "failed to compute funnel" — even though the funnel still exists. Always use the relative `time_range` option (e.g. `last_30_days`) for any funnel meant to track a KPI on an ongoing basis; only use absolute dates for a one-off historical analysis.

### 2. Frustration & Opportunity Discovery

Surfaces rage clicks, dead clicks, errors, and crashes without a hypothesis first.

1. `discover_groups` scoped to a `page_id` or `segment_id` — optionally `compare_to_previous=true` to catch regressions after a release
2. `get_opportunity_stats` on the top signal — quantify affected users
3. `classify_opportunity` — confirm it's a real signal, not noise
4. If StoryAI Premium is available: `get_opportunities` / `get_sessions_for_opportunity` for pre-ranked results

**Example prompt:**
> "Use Fullstory MCP only. What are the top frustration signals on the configurator pages this week, compared to last week?"

### 3. Ad-hoc Behavioural Metric

Answers a specific quantitative question without building a full funnel.

1. `build_segment` first if the question needs a specific user group (e.g. mobile only)
2. `build_metric` — e.g. *"Unique users who used the model comparison tool in the last 30 days"*
3. `compute_metric` — optionally scoped to that segment

**Example prompt:**
> "Use Fullstory MCP only. How many unique users rage-clicked on the finance calculator in the last 7 days, mobile only?"

### 4. Session Deep-Dive (root cause / bug validation)

Used after a metric/segment/funnel step flagged something — the "let AI watch the sessions for you" pattern.

1. `get_sessions` (by `metric_id` or `segment_id`)
2. `get_session_events` for the full transcript
3. If visual confirmation is needed: `session_open` → `session_screenshot` / `session_get_a11y_tree` → `session_diff` → **`session_close`**

**Example prompt:**
> "Use Fullstory MCP only. Show me 3 sessions where the configuration summary showed an error, and tell me what happened right before the error using session_diff."

## Defining Error Rate signals

Fullstory has no built-in "Error Rate" KPI — it must be defined per journey. Two approaches, in order of effort:

### Option A — Default: automatic frustration signals (no setup)

`discover_groups` already computes rage clicks, dead clicks, and page reloads automatically — org-wide or scoped to a page/segment/funnel — with zero configuration. Start here for every journey before building anything custom.

### Option B — Precise: a custom Watched Element / Event

Only needed when Option A isn't specific enough (e.g. "loading spinner visible > 5 seconds" as an explicit error signal). Before defining one, verify it live — don't copy a selector from this document as a fact:

1. **Check it's actually in the DOM, not just a JS property.** Open the real page in the browser, trigger the state (e.g. a form validation error), and inspect the element in DevTools. Confirm the attribute (e.g. `state="error"`) literally appears in the rendered HTML — some frameworks only set it as a JavaScript property, which is invisible to any CSS-based tool.
2. **Check Shadow DOM visibility.** Fullstory's Watched Elements use standard CSS selectors, which cannot select inside a component's Shadow DOM. A PDS component's *host* element (e.g. `<p-text-field-wrapper state="error">`) is selectable; content rendered *inside* its shadow root (e.g. the error message text/icon) generally is not.
3. **Check for team-specific prefixing.** Porsche teams can prefix PDS component tag names (e.g. `p-spinner` → `phn-p-spinner`). CSS has no wildcard for tag names, so a selector must be captured live per app (via Fullstory's element picker) — a generic `p-spinner` selector from documentation will not match a prefixed instance.

Once verified, create the element/event in Fullstory (Settings → Data Management → Elements), then build a metric on it via `build_metric` (e.g. "count of unique users where the loading spinner was visible for at least 5 seconds").

## Prompt conventions

- Always start with **"Use Fullstory MCP only."** to prevent tool ambiguity when multiple MCPs are configured.
- Give a concrete time range (e.g. "last 7 days") — open-ended questions produce open-ended, harder-to-verify answers.
- Ask for the Fullstory UI link that `build_funnel` / `build_metric` / `build_segment` return, and share it — data should be verifiable in the Fullstory UI, not just trusted blindly.

## Known limitations (as of this writing)

- Fullstory MCP is in **private beta** — requires org waitlist signup.
- Opportunity *Lookup* tools require **StoryAI Premium SKU**; Opportunity *Discovery* tools do not.
- Every `session_open` **must** be paired with `session_close`, or later `session_open` calls may be blocked.

## Data privacy note

- Fullstory session data can contain PII (form inputs, user identifiers) even with masking. Do not paste raw session transcripts or screenshots into public channels, presentations, or the GitHub repo.
- Do not use Fullstory MCP tools to modify privacy settings (`element_block` scopes) unless explicitly asked to do so by a Fullstory org admin.
- *(This section will be expanded with Porsche-specific data protection and org setup guidance.)*
