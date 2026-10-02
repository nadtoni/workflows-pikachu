---
name: porsche-ux-data-analysis
description: "Analyse UX survey and feedback datasets and create dashboards with actionable recommendations. Use when: analysing training feedback, survey results, NPS/CES/CSAT data, Likert-scale responses, or any structured UX research data."
---

# UX Data Analysis & Dashboard

Use this skill to analyse structured UX data (surveys, feedback, training evaluations) and produce a visual dashboard with actionable recommendations.

## Goal

Turn raw survey/feedback data into a clear, evidence-based dashboard that highlights key metrics, trends, sentiment patterns, and prioritised recommendations.

## Supported Data Formats

- CSV (comma, semicolon, or tab delimited)
- TSV
- Markdown tables
- Pasted tabular text

If the format is ambiguous, ask the user to confirm the delimiter.

## Workflow

1. **Ingest** — Read and parse the dataset. Identify columns, scales, date ranges, and response count.
2. **Clean** — Remove empty rows, normalise Likert values to numeric (e.g. "5 - stimme voll und ganz zu" → 5), parse dates, handle "weiß nicht / k.A." as missing.
3. **Analyse** — Compute all metrics listed below.
4. **Synthesise open text** — Group qualitative feedback into themes using affinity clustering.
5. **Build dashboard** — Output a structured Markdown dashboard (see Markdown Output Format) AND a visual HTML dashboard (see HTML Output Format).
6. **Recommend** — Derive prioritised, actionable recommendations from the data.
7. **Save** — Store both files in `UX Designer (Agent)/guides/`:
   - Markdown: `dashboard-[dataset-slug].md`
   - HTML: `dashboard-[dataset-slug].html`
8. **Open** — After saving, open the HTML dashboard in the browser so the user can see it immediately.

## Metrics to Compute

### Quantitative

| Metric | How to compute |
|--------|---------------|
| **Response rate** | Valid responses / total rows (excl. empty rows) |
| **NPS** | % Promoters (9-10) − % Detractors (0-6). Also show counts per group. |
| **CES distribution** | Count and % for each CES answer category (exceeded, met, not met) |
| **Likert averages** | Mean and distribution for each Likert-scale question (1-5) |
| **Overall satisfaction index** | Weighted average across all Likert items (equal weight unless specified) |
| **Time frame fit** | Distribution of "zu kurz" / "genau richtig" / "zu lang" |
| **Trend over time** | If data spans multiple cohorts/dates, show metrics per cohort and trend direction |

### Qualitative

| Analysis | Method |
|----------|--------|
| **Positive themes** | Cluster CES positive comments and general feedback into recurring themes with frequency counts |
| **Negative themes** | Cluster CES negative comments and critical feedback into themes |
| **Improvement suggestions** | Extract concrete suggestions from open text, group and count |
| **Notable quotes** | Select 3-5 impactful verbatim quotes (positive and critical) |

## Output Format — Dashboard

Structure the dashboard Markdown file as follows:

```
# [Dataset Name] — Dashboard

> Generated: [date] | Responses: [n valid] / [n total] | Period: [first date] – [last date]

## Executive Summary
2-3 sentences: overall health of the metrics, biggest strength, biggest risk.

## Key Metrics at a Glance
| Metric | Value | Trend |
|--------|-------|-------|
| NPS | … | ↑/↓/→ |
| CES (expectations met+exceeded) | …% | |
| Overall Satisfaction (Ø Likert) | …/5 | |
| Time frame fit ("genau richtig") | …% | |

## NPS Breakdown
- Promoters (9-10): n (x%)
- Passives (7-8): n (x%)
- Detractors (0-6): n (x%)
- **NPS Score: X**

## CES — Expectation Fulfilment
| Category | Count | % |
|----------|-------|---|
| Exceeded | | |
| Met | | |
| Not met | | |

## Likert-Scale Ratings (1-5)
Table with each question, mean, and a simple bar visualisation using Unicode blocks.

## Time Frame Assessment
Distribution chart.

## Trend Over Time (if applicable)
Per-cohort NPS, satisfaction, and CES trend.

## Qualitative Themes

### What participants loved (Top themes)
Ranked list with frequency count and example quotes.

### What needs improvement (Top themes)
Ranked list with frequency count and example quotes.

### Concrete suggestions from participants
Numbered list extracted from open text.

## Notable Quotes
3-5 selected verbatim quotes that best represent the overall sentiment.

## Recommendations
Prioritised list (P1 = high impact + easy to act on, P2 = high impact + more effort, P3 = nice to have):

| Priority | Recommendation | Evidence |
|----------|---------------|----------|
| P1 | … | Based on … |
| P2 | … | Based on … |
| P3 | … | Based on … |

## Methodology Notes
Brief note on sample size, limitations, and confidence level.
```

## Visualisation Guidelines — Markdown

For the Markdown file, use these techniques for visual clarity:

- **Unicode bar charts**: `████░░░░░░ 4.2/5` for Likert means
- **Emoji indicators**: 🟢 (strong), 🟡 (moderate), 🔴 (weak) for metric health
- **Trend arrows**: ↑ improving, → stable, ↓ declining
- **Percentage bars**: `[██████████░░░░░░░░░░] 52%`
- **Tables** for all structured data

## HTML Output Format

In addition to the Markdown dashboard, always generate a standalone HTML file with interactive charts.

### HTML Requirements

- **Self-contained**: Single `.html` file with all CSS and JS inline (no external dependencies to load).
- **Chart library**: Use [Chart.js](https://cdn.jsdelivr.net/npm/chart.js) loaded from CDN. This is the only allowed external resource.
- **Responsive**: Dashboard must look good on screens from 1024px to 1920px wide.
- **Porsche-inspired styling**: Use a clean, modern design with these colours:
  - Primary: `#010205` (Porsche black)
  - Accent: `#D5001C` (Porsche red)
  - Secondary accents: `#C4A35A` (gold), `#4A90D9` (blue), `#2D8C3C` (green)
  - Background: `#FFFFFF`, cards: `#F7F7F7`, borders: `#E0E0E0`
  - Text: `#010205` primary, `#585858` secondary
  - Font: `system-ui, -apple-system, 'Segoe UI', sans-serif`

### HTML Dashboard Sections

The HTML dashboard must include these sections, each as a visual card:

1. **Header** — Dataset name, generation date, response count, time period
2. **Executive Summary** — Key takeaway text box
3. **KPI Cards Row** — Large-number cards for NPS, CES %, Overall Satisfaction, Time Frame Fit
4. **NPS Donut Chart** — Promoters / Passives / Detractors with NPS score in the center
5. **CES Bar Chart** — Horizontal bars for Exceeded / Met / Not Met
6. **Likert Ratings Chart** — Horizontal bar chart showing mean per question item with 1-5 scale
7. **Time Frame Assessment** — Pie or donut chart
8. **Trend Over Time** — Line chart showing NPS and satisfaction trend per cohort (if multiple dates)
9. **Qualitative Themes** — Two-column layout: "What participants loved" (green accent) and "What needs improvement" (red accent), each as a ranked list with counts
10. **Concrete Suggestions** — Numbered list card
11. **Notable Quotes** — Quote cards with verbatim text
12. **Recommendations Table** — Colour-coded priority table (P1 red, P2 gold, P3 grey)
13. **Methodology Footer** — Sample size, limitations, confidence notes

### HTML Template Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Dataset Name] — Dashboard</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    /* Porsche-inspired design system */
    :root {
      --black: #010205;
      --red: #D5001C;
      --gold: #C4A35A;
      --blue: #4A90D9;
      --green: #2D8C3C;
      --bg: #FFFFFF;
      --card-bg: #F7F7F7;
      --border: #E0E0E0;
      --text: #010205;
      --text-secondary: #585858;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; }
    .dashboard { max-width: 1200px; margin: 0 auto; padding: 2rem; }
    .header { text-align: center; margin-bottom: 2rem; border-bottom: 3px solid var(--red); padding-bottom: 1.5rem; }
    .header h1 { font-size: 1.8rem; font-weight: 700; }
    .header .meta { color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.5rem; }
    .kpi-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .kpi-card { background: var(--card-bg); border-radius: 8px; padding: 1.5rem; text-align: center; border-left: 4px solid var(--red); }
    .kpi-card .value { font-size: 2.5rem; font-weight: 700; }
    .kpi-card .label { color: var(--text-secondary); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .card { background: var(--card-bg); border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; }
    .card h2 { font-size: 1.2rem; margin-bottom: 1rem; border-bottom: 2px solid var(--border); padding-bottom: 0.5rem; }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .chart-container { position: relative; width: 100%; max-height: 400px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 0.6rem 0.8rem; text-align: left; border-bottom: 1px solid var(--border); }
    th { font-weight: 600; font-size: 0.85rem; text-transform: uppercase; color: var(--text-secondary); }
    .priority-p1 { color: var(--red); font-weight: 700; }
    .priority-p2 { color: var(--gold); font-weight: 700; }
    .priority-p3 { color: var(--text-secondary); font-weight: 700; }
    .quote { border-left: 3px solid var(--gold); padding: 0.8rem 1rem; margin: 0.8rem 0; font-style: italic; background: white; border-radius: 0 4px 4px 0; }
    .theme-positive { border-left-color: var(--green); }
    .theme-negative { border-left-color: var(--red); }
    .footer { text-align: center; color: var(--text-secondary); font-size: 0.8rem; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--border); }
    @media (max-width: 768px) { .two-col { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <div class="dashboard">
    <!-- Fill sections with actual data -->
  </div>
  <script>
    // Chart.js chart initialisations go here
  </script>
</body>
</html>
```

### Chart.js Configuration Rules

- Use `doughnut` for NPS breakdown and time frame fit
- Use `bar` (horizontal) for Likert ratings and CES
- Use `line` for trend over time
- Always include `plugins.legend` and `plugins.tooltip`
- Use the Porsche colour palette defined in CSS variables
- Set `responsive: true` and `maintainAspectRatio: false` on all charts
- Wrap each canvas in a `<div class="chart-container">` with a fixed height

## Data Handling Rules

- **Language**: Respond in the language of the data/user (German or English). If mixed, default to German.
- **Empty rows**: Skip rows where all data columns (except date) are empty.
- **Likert parsing**: Strip text prefixes/suffixes (e.g. "5 - stimme voll und ganz zu" → 5, "1 - stimme gar nicht zu" → 1). Treat "weiß nicht / k.A." as missing, do not include in averages.
- **NPS grouping**: 9-10 = Promoter, 7-8 = Passive, 0-6 = Detractor. NPS = %Promoters − %Detractors.
- **Dates**: Parse flexibly (DD.MM.YY, DD.MM.YYYY, ISO). Group into cohorts by month or by training session date.
- **Outliers**: Flag extreme deviations (e.g. NPS 1 with positive moderation feedback) but do not remove them.
- **Small samples**: If n < 10 for a cohort, note limited statistical reliability.
- **HTML entities**: Decode HTML entities in text (e.g. `&gt;` → `>`, `&lt;` → `<`).

## Quality Checklist

- [ ] All empty rows excluded from analysis
- [ ] Likert values correctly parsed to numeric
- [ ] NPS calculated correctly (% Promoters − % Detractors, not average score)
- [ ] Open text themes backed by actual quotes
- [ ] Recommendations are specific and actionable (not generic "improve X")
- [ ] Dashboard is self-contained and understandable without the raw data
- [ ] Trend analysis included if data spans multiple sessions
- [ ] Sample size and limitations noted

## Red Flags (call out explicitly)

- NPS below 0
- Any Likert average below 3.0
- CES "not met" exceeding 15%
- Contradictory feedback patterns (high NPS but many negative comments)
- Declining trend across cohorts
- Very low response rate for a cohort
