# Fullstory Basics — Building Blocks Explained Simply

No dev background needed. If you understand these 6 words, you can read and build any Fullstory analysis. Every word is explained with a concrete example — nothing is assumed.

## The building blocks, one at a time

### Page
A **Page** is a rule that says "this URL/screen counts as one specific page." Someone (usually a developer) already defines these once for a website/app.

*Example: `product_details`, `cart_page`, `order_confirmation` are already defined pages in the Porsche shop.*

### Element
An **Element** is one specific thing on a page — a button, a link, an icon, a spinner. You "create" one by clicking on it live on the running website (Fullstory highlights it for you); from then on Fullstory remembers exactly that thing.

*Example: the "Add to Cart" button is an Element.*

### Event
An **Event** = an Element (or a Page) + something that happened to it.

*Examples: "clicked the Add to Cart button", "the loading spinner was visible for more than 5 seconds", "visited the cart page".*

### Metric
A **Metric** counts how often an Event happens — for how many people, or how many times.

*Example: "How many unique users clicked Add to Cart in the last 7 days?" → that's a Metric.*

### Funnel
A **Funnel** is a Metric with steps, in a fixed order. It shows how many people made it through each step (conversion), and where they dropped off.

*Example: "Visited product page → clicked Add to Cart → visited cart page → visited order confirmation." A Funnel shows the conversion percentage between each of these steps.*

### Heatmap
A **Heatmap** shows visually WHERE on one Page people clicked, scrolled, or moved their mouse — as colors instead of numbers. No steps, no order — just one page, one picture.

### Segment
A **Segment** is a saved definition of a specific group of people/sessions, instead of "everyone." It's built from two kinds of filters combined:

- **User filter** = who they are (e.g. "signed-up users", "mobile users", "new this week")
- **Event filter** = what they did (e.g. "rage-clicked recently", "visited /macan")

*Example: "Mobile users who rage-clicked in the last 7 days" combines a user filter (mobile) with an event filter (rage-clicked).*

## How they fit together (the one picture to remember)

```
Page (where)
  → Element (what's on it)
    → Event (element + action/condition)
      → Metric (count of an event)  or  Funnel (an ordered chain of events)
        → Segment (optional filter layer — attach to any Metric, Funnel, or Heatmap
                    to narrow "everyone" down to a specific group)
```

**Worked example (Porsche configurator):**
- Page: `product_details`
- Element: "Color Selector"
- Event: "clicked Color Selector"
- Metric: "How many unique users clicked Color Selector in the last 30 days"
- Funnel: "visited `product_details` → clicked Color Selector → visited `cart_page`"
- Segment: "Mobile users" — attach it to the Funnel above to see just mobile behaviour
- Heatmap: on the `product_details` page, see visually where clicks concentrate

## Which one do I need? (quick decision helper)

| I want to know… | Use |
|---|---|
| How many / how often something happens | **Metric** |
| Whether my flow works end-to-end, and where people drop off | **Funnel** |
| Visually where people click/scroll on one page | **Heatmap** |
| Narrow any of the above to a specific group of users | **Segment** |
| What one real person actually did, step by step | **Session Replay** |

## "Journey" — one word, two different things

- **User Journey** (the term we use in `porsche-ux-measurement`) = an action sequence through pages/screens, e.g. "the booking process." We measure this using a **Funnel** — see above.
- **Journeys** (a Fullstory product feature, same word) = a separate Fullstory tool that visualizes open-ended, unexpected navigation paths (exploratory, not ordered). This skill does **not** use that feature.

When someone says "let's analyze this journey" in this skill, it means **"let's build a Funnel"** — not "open Fullstory's Journeys view."

## How you build these in Fullstory

- **Element:** click it live on the running page, or find it in Fullstory under Settings → Data Management → Elements (Data Studio)
- **Event:** usually defined together with the Element (e.g. "clicked", or a condition like "visible for 5+ seconds")
- **Metric / Funnel / Segment:** built either directly in the Fullstory UI, or — for this skill — via the Fullstory MCP tools (`build_metric`, `build_funnel`, `build_segment`) using plain language prompts. See `fullstory-mcp.md` for the exact tool workflows and prompts.
