---
name: porsche-ux-interview
description: "User interview support across the full lifecycle: preparation (discussion guide, screener), execution (live note-taking, probing support), and analysis (transcript coding, insight reports). Use when: planning a user interview study, writing a discussion guide, creating a screener, taking structured notes during a session, processing interview transcripts, identifying user needs, discovering pain points, clustering themes across multiple interviews, or generating insight reports for UX designers and product managers."
---

# User Interviews

Covers the full interview lifecycle: **preparation → execution → analysis**.

> **Not sure which phase you need?**
> - "I'm planning an interview study" → see [Preparation](#preparation) below
> - "I'm currently running interviews" → see [Execution](#execution) below
> - "I have transcripts to analyse" → see [Analysis](#analysis) below

---

## Preparation

### Screener

Generate a participant screener questionnaire:
- Input: Research goal + target user profile
- Output: 6–8 screener questions with answer options and knock-out criteria
- Includes: demographic filters, experience/behaviour filters, availability check

Command: "Create a screener for [target group]"

### Discussion Guide

Generate a semi-structured interview guide:
- Input: Research questions or hypothesis to explore
- Output: Structured guide with:
  - Introduction + consent declaration
  - Warm-up (context, role, daily routine)
  - Core topics with open questions (3–5 thematic areas)
  - Probing hints per topic (follow-up starters)
  - Closing + next steps
- Duration target: 45 min / 60 min / 90 min (specify which)
- Language: match the language of the research context; English by default

Command: "Create a discussion guide for [topic]"

### Study plan (optional)

Generate a research study overview:
- Research questions + hypotheses
- Participant count + profile
- Timeline and session structure
- Output format and stakeholder audience

---

## Execution

### Live note-taking template

Generate a structured template for note-taking during sessions:
- Column per participant (P1, P2, …)
- Row per discussion guide topic
- Fields: key statements, observations, notable quotes, tone/emotion

Command: "Create a note-taking template for [n] interviews on [guide topic]"

### Real-time probing support

During an interview, get suggested follow-up questions:
- Input: Participant's last statement (paste into chat)
- Output: 3 follow-up probing options (open, non-leading)

Command: "The participant just said: '[statement]' — which follow-up questions fit?"

---

## Analysis

Transform raw interview transcripts into structured, evidence-based insights.

## Supported Input Formats

- Plain text transcripts (pasted or file)
- Markdown-formatted transcripts
- Timestamped transcripts (e.g. from Otter.ai, Rev, Dovetail, Teams, Zoom)
- Multiple transcripts at once (batch analysis)
- Interview notes (less structured, best-effort analysis)

If speaker labels are missing, ask the user to clarify who is the interviewer and who is the participant.

## Workflow

1. **Ingest** — Read transcript(s). Identify number of interviews, speaker roles, and approximate duration/length.
2. **Segment** — Break transcript into meaningful units (statements, stories, reactions). Tag each unit with the speaker.
3. **Code** — Apply thematic codes to each unit (see Coding Framework below).
4. **Cluster** — Group coded units into themes using affinity mapping logic. Identify patterns across interviews.
5. **Quantify** — Count frequency of themes, pain points, and needs across participants. Note which themes appear in how many interviews.
6. **Synthesise** — Build the insight report (see Output Format).
7. **Save** — Store the report in `UX Designer (Agent)/guides/`:
   - Markdown: `interview-insights-[project-slug].md`
   - HTML: `interview-insights-[project-slug].html`
8. **Open** — Open the HTML report in the browser.

## Coding Framework

Apply these code categories to transcript segments. A segment can have multiple codes.

| Code Category | Description | Examples |
|---------------|-------------|----------|
| **Need** | Something the user wants or requires | "I need to find X quickly", "I wish I could..." |
| **Pain Point** | Frustration, difficulty, or obstacle | "This is confusing", "I always struggle with..." |
| **Behaviour** | How the user currently does something | "Usually I go to...", "My workaround is..." |
| **Goal** | What the user is trying to achieve | "I want to accomplish...", "My main objective is..." |
| **Expectation** | What the user expected to happen | "I thought it would...", "I assumed..." |
| **Emotion** | Expressed feeling or emotional reaction | Frustration, delight, surprise, anxiety, confidence |
| **Mental Model** | How the user thinks something works | "I figured this button would...", "I expected this to be under..." |
| **Workaround** | User-created solution to a problem | "So what I do instead is...", "I use a spreadsheet to track..." |
| **Feature Request** | Explicit request or wish for functionality | "It would be great if...", "Can you add..." |
| **Positive Moment** | Something that works well or delights | "I love this", "This is really easy" |
| **Context** | Background about the user's environment | Role, tools used, team size, frequency of use |
| **Quote** | Particularly insightful or impactful verbatim statement | Strong language, vivid descriptions, surprising reveals |

## Analysis Techniques

### Single Interview
- **Journey extraction**: Map the user's described journey or workflow step by step
- **Emotion mapping**: Track emotional highs and lows throughout the conversation
- **Need hierarchy**: Distinguish between stated needs (what they say) and latent needs (what they actually need)
- **Contradiction detection**: Flag where user says one thing but describes doing another

### Multiple Interviews (Cross-Analysis)
- **Theme frequency matrix**: Which themes appear across how many participants
- **Convergence/divergence**: Where participants agree vs. disagree
- **Persona signals**: Cluster participants by behaviour patterns into proto-personas
- **Opportunity scoring**: Rate opportunities by frequency × impact (how many people mentioned it × how painful/important)

## Output Format — Insight Report

### Markdown Structure

```
# [Project Name] — Interview Insights

> Generated: [date] | Interviews analysed: [n] | Total participants: [n]
> Method: [moderated/unmoderated] | Duration: [range] | Context: [product/feature]

## Executive Summary
3-5 sentences: key narrative, most important finding, biggest opportunity, biggest risk.

## Participants Overview
| # | Role / Profile | Context | Key characteristic |
|---|---------------|---------|-------------------|
| P1 | ... | ... | ... |
| P2 | ... | ... | ... |

## Top Insights (ranked by impact × frequency)

### Insight 1: [Title]
- **Type**: Need / Pain Point / Opportunity
- **Frequency**: Mentioned by X of Y participants
- **Impact**: High / Medium / Low
- **Evidence**: 2-3 supporting quotes with participant labels
- **Implication**: What this means for product/design decisions

### Insight 2: [Title]
...

## Theme Map

### Needs (what users want)
Ranked list with frequency and example quotes.

### Pain Points (what frustrates users)
Ranked list with frequency and example quotes.

### Behaviours & Workarounds (what users do today)
Ranked list with frequency and example quotes.

### Positive Moments (what works well — protect these)
Ranked list with frequency and example quotes.

## User Journey (if applicable)
Step-by-step journey with pain points and opportunities mapped to each step.

## Opportunity Matrix
| Opportunity | Frequency (n/total) | Impact | Effort | Priority |
|-------------|---------------------|--------|--------|----------|
| ... | ... | H/M/L | H/M/L | P1/P2/P3 |

## Jobs to Be Done (if extractable)
| When... | I want to... | So that... |
|---------|-------------|------------|
| ... | ... | ... |

## Notable Quotes
5-8 selected verbatim quotes that best capture user sentiment. Include participant label and context.

## Recommendations
| Priority | Recommendation | Evidence | For whom |
|----------|---------------|----------|----------|
| P1 | ... | Based on ... | UX / Product / Dev |
| P2 | ... | Based on ... | ... |
| P3 | ... | Based on ... | ... |

## Open Questions
Questions that emerged from the interviews but couldn't be answered — input for follow-up research.

## Methodology Notes
Sample size, recruitment, potential biases, confidence level.
```

### HTML Report

In addition to Markdown, generate a standalone HTML file with the same Porsche-inspired design system used in `ux-data-analysis`:

- **Self-contained**: Single `.html` file, Chart.js from CDN for any charts.
- **Colour palette**: `--black: #010205`, `--red: #D5001C`, `--gold: #C4A35A`, `--blue: #4A90D9`, `--green: #2D8C3C`
- **Sections as cards**: Each insight, theme, and recommendation in its own card.
- **Insight cards**: Highlight type (need/pain/opportunity) with colour-coded left border (green=need, red=pain, gold=opportunity).
- **Quote blocks**: Styled with left border, italic, attribution.
- **Opportunity matrix**: Colour-coded priority table (P1 red, P2 gold, P3 grey).
- **Theme frequency chart**: Horizontal bar chart showing how many participants mentioned each theme.
- **Optional**: If emotion data is rich enough, include an emotion journey line chart.

## Analysis Rules

- **Language**: Respond in the language of the transcript(s). If mixed, default to English.
- **Speaker labels**: Preserve original participant identifiers. If names are present, anonymise to P1, P2, P3 etc. unless the user explicitly states names can be used.
- **Verbatim quotes**: Always use exact wording from transcripts. Mark any edits with [...]. Never paraphrase a quote.
- **Evidence threshold**: Only elevate a finding to "Insight" if it appears in ≥2 interviews (for multi-interview analysis) or has strong supporting evidence (for single interviews).
- **Stated vs. latent**: Distinguish between what users say they want (stated) and what the evidence suggests they actually need (latent). Flag latent needs explicitly.
- **Bias awareness**: Note interviewer leading questions, acquiescence bias, or social desirability bias if detected in the transcript.
- **Contradictions**: Call out when a user's stated preference contradicts their described behaviour.
- **Don't over-interpret**: If evidence is thin, say so. Use "suggests" rather than "proves". Note confidence level.
- **Privacy**: Never include personally identifiable information in outputs unless explicitly approved by the user.

## Quality Checklist

- [ ] All participants anonymised (unless user approved names)
- [ ] Insights ranked by frequency × impact
- [ ] Every insight backed by verbatim quotes
- [ ] Stated vs. latent needs distinguished
- [ ] Contradictions flagged
- [ ] Interviewer bias noted if detected
- [ ] Open questions listed for follow-up research
- [ ] Recommendations are specific, actionable, and assigned to a role
- [ ] Report is self-contained and understandable without reading transcripts
- [ ] Sample size and confidence limitations noted

## Red Flags (call out explicitly)

- Interviewer using leading questions throughout
- All participants from same demographic/role (limited perspective)
- Very short interviews (< 10 min) with shallow depth
- Contradictions between what users say and do
- Single-participant insight elevated to high priority without caveat
- Missing context about participant recruitment or selection
