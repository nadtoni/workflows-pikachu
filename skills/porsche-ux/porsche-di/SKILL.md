---
name: porsche-di
description: Porsche Digital Interaction (DI) brand guidance skill. Use whenever a task involves digital product design, UX decisions, UI copy, visual direction, interaction patterns, layout decisions, or any output that will represent the Porsche brand digitally — across web, app, or in-car. Triggers include: "does this feel Porsche?", "is this on-brand?", "how should this interaction work?", "what tone should we use?", "ist das on-brand?", "fühlt sich das nach Porsche an?", "welche Tonalität?", "Markencheck", "Designreview", design reviews, copy writing, component decisions, and visual direction questions. Always consult this skill before generating any Porsche-facing output.
---

# Porsche Digital Interaction — Brand Skill

## Building Blocks

Porsche DI goes beyond colors and icons — it's our digital design DNA that shapes every touchpoint, experience and the tools we use to create them. It consists of **three building blocks**, which grow step by step:

1. **Brand Promise** — *"The fastest way into Porsche."* The why behind every decision.
2. **Design Codes** — Five principles: Stage the Legend · Tell a Story · Boost Interaction · Keep the Focus · Tailor Moments.
3. **Resources** — The applied layer: Porsche Design System(s) and Visual Attributes (plus Voice & Tone guidance).

Each block maps to a reference file below.

## References

This skill is backed by four reference files. Read the relevant one before producing output:

| File | Read it when you need… |
|---|---|
| `references/brand-promise.md` | The full brand promise and its evaluation questions |
| `references/design-codes.md` | The five design codes in depth (concept, flow, UI, content) |
| `references/visual-attributes.md` | Layout, color, typography, materials, imagery rules |
| `references/voice-and-tone.md` | Writing principles for any UI copy, headline or message |

## How to Apply This Skill

This skill works in two modes. Identify which one the request calls for:

**Review mode** — "is this on-brand?", "does this feel Porsche?", design/copy reviews
- Name the specific element that's off (not a vague verdict)
- Cite the design code or voice principle it violates
- Give a concrete, actionable fix — ideally a before/after
- Lead with what already works, then what to change

**Generate mode** — "design this", "write this copy", "how should this interaction work?"
- Apply the *Critical defaults* silently — don't explain them unless asked
- Surface only genuine trade-offs or decisions that need the user's input
- When producing copy, run it through the Voice principles before returning it

In both modes, run the [Decision Workflow](#decision-workflow) before finalizing.

## Brand Promise
**"The fastest way into Porsche"**

Two dimensions, always in balance:

- **The fastest way → Performance**: Interactions are quick, simple, focused, effortless. No gimmicks. Intuitive interfaces are non-negotiable. Beautiful details matter.
- **Into Porsche → Community**: Welcoming, personal, joyful. Easy access points. Simple, friendly, open communication. Digital is often the first brand contact for fans.

Use this promise as the primary evaluation criterion: *Does what we're creating offer users the fastest, clearest and most emotionally engaging path into the Porsche brand?*

Read `references/brand-promise.md` for the full promise, its two dimensions, and the evaluator questions to apply before shipping.

---

## Design Codes

Five codes. Not rigid rules — interpreted principles. Use them to evaluate and direct decisions.

Read `references/design-codes.md` for the full descriptions and key points.

**Quick reference:**

| Code | Core question |
|---|---|
| Stage the Legend | Is the hero (car, person, brand) clearly the protagonist? |
| Tell a Story | Does the flow guide from overview to depth, rewarding curiosity? |
| Boost Interaction | Does it feel vivid, responsive, precise — like driving? |
| Keep the Focus | Is every element intentional? Is there rhythm between density and calm? |
| Tailor Moments | Is there room for personal, contextual, or surprising moments? |

---

## Visual Direction

Read `references/visual-attributes.md` for layout, color, typography, materials, and imagery rules.

**Critical defaults:**
- Typeface: **Porsche Next only**, no exceptions
- Theme: **Neutral (light/dark) as standard** — color themes only for special purposes (launches, customization)
- Materials: **Solid surfaces** — no glass/metal imitation. Transparency only when overlaying complex imagery
- Layout: **Full-bleed hero stages + mosaic grid** — not one or the other, both in rhythm

---

## Voice & Tone

Read `references/voice-and-tone.md` for the full writing guidance with before/after examples.

**Four principles** — three are *Fundamentals* (apply to all copy), one is *Extra* (special moments only):

| Principle | Core | Level |
|---|---|---|
| **Concise** | Write to be understood. Show confidence in clarity. | Fundamental |
| **Authentic** | Speak like a person, not a corporation. On eye level. | Fundamental |
| **Refined** | Choose words with care. Articulate an unmistakable attitude. | Fundamental |
| **Inspiring** | Paint pictures in people's minds. Make dreams real. | Extra |

**Critical defaults:**
- Active voice, "we/you", one idea per sentence
- Avoid the words **"iconic"** and **"luxurious"** — convince through quality, let customers decide
- **Inspiring** is reserved for brand communication, emotional headlines and editorial — never forced onto functional UI

---

## Decision Workflow

The single checklist for evaluating or generating any digital output. It spans all four lenses — Promise, Codes, Visual, Voice. Use the reference files for depth on any failing check.

1. **Promise check** — Does it deliver the fastest path *and* a welcoming way into the Porsche world? *(brand-promise.md)*
2. **Hero check** — Is there a clear protagonist, everything else subordinate to it? *(Stage the Legend)*
3. **Rhythm check** — Balance between immersive/calm, dense/spacious? *(Keep the Focus, visual-attributes.md)*
4. **Noise check** — Remove anything that doesn't contribute to the message. *(Keep the Focus)*
5. **Voice check** — Copy concise, authentic, refined? Active voice, no "iconic/luxurious"? Inspiring only where it belongs? *(voice-and-tone.md)*
6. **Moment check** — One detail, surprise, or personal touch that makes it memorable? *(Tailor Moments)*

---

## What Porsche DI is NOT

- Not just visual — it applies to UX behavior, copy, interaction patterns, content strategy
- Not optional for non-designers — product owners, PMs, developers and content specialists all work within these codes
- Not a rigid system — interpretation is expected, uniformity is not the goal
- Not imitative of physical materials in UI (no glassmorphism as default)
- Not colorful by default — grey scale sets the stage, color is reserved for impact

---

## Related Skills

- For HTML/visual output → use `porsche-pds-html-presentation` skill
- For reviewing a concrete design against the rules → use `porsche-ux-design-review` skill
- For component-level decisions → consult the Porsche Design System ([designsystem.porsche.com/v4](https://designsystem.porsche.com/v4/))
- For a runnable React prototype → use `porsche-ux-prototype` skill
- For the overall UX process & which skill to use → use `porsche-ux-workflow` skill

---

## Cost Transparency

At the end of every completed task using this skill, append the cost estimate block.
Formula and format live in `porsche-ux-workflow/SKILL.md` (section **Cost Transparency**):

```
---
💰 ≈X,XXX In / ≈X,XXX Out Tokens · ≈X.XX Credits · **≈$X.XX** _(Claude Sonnet 4.6, inkl. 30% Puffer)_
```
