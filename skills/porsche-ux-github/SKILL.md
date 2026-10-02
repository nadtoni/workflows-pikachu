---
name: porsche-ux-github
description: >
  Interact with the porsche-ux GitHub repo from chat via GitHub CLI (`gh`). Currently
  supports filing bug reports & feature requests as issues. Triggers on "report a bug",
  "I found a bug", "Bug melden", "Fehler melden", "/bug", "feature request",
  "request a feature", "Feature anfragen", "Feature Request", "/feature",
  "create an issue", "open an issue", "Issue erstellen", "Ticket erstellen",
  "bug report workflow", "bug ticket via workflow", "als Issue/Ticket",
  "nicht im Skill-Ordner". Route bug/feature "workflow" requests straight to
  issue creation, never to local skill-folder edits.
---

# GitHub Skill

Use this skill to interact with the
[porsche-ux](https://github.com/porsche-code/porsche-ux) skills repo from chat.
Today it files **Bug Reports** and **Feature Requests** as GitHub issues; more
GitHub-related actions can be added here over time.

Created issues are automatically added to the
[community project board](https://github.com/orgs/porsche-code/projects/162/views/1)
via the project's built-in automation.

**Requires:** GitHub CLI (`gh`) authenticated for the current machine/session.

---

## When to activate

| Trigger phrase | Type |
|---|---|
| "report a bug", "I found a bug", `/bug` | Bug Report |
| "bug report workflow", "bug ticket via workflow", "file a bug via the workflow" | Bug Report |
| "feature request", "request a feature", `/feature` | Feature Request |
| "create an issue", "open an issue", "als Issue/Ticket", "nicht im Skill-Ordner" | Ask which type |

> **Route directly here — do not start with local file edits.** When the user
> asks to file a bug/feature "via the workflow", "as an issue", "als Issue", or
> says it should "nicht im Skill-Ordner" / not be local changes, go straight to
> the issue-creation flow below. Editing files under `skills/` is a *different*
> task (fixing a skill). If it is genuinely unclear whether the user wants a
> GitHub issue or a local fix, ask **one** short clarification question first —
> never begin local edits by default.

---

## Workflow

### Step 1 — Determine type

Ask: **Bug or feature request?** (if not already clear from the trigger).

### Step 2 — Collect a short description

Ask the user for a one-line **title** and a **description**. Keep it light — a single
free-text answer is enough. The description should ideally cover:

- **Bug:** which skill, what you did/asked, what happened vs. what you expected
- **Feature:** which skill (or "new skill"), the problem/goal, and how it should work

If the user already gave enough detail in their message, skip straight to Step 3.
Don't interrogate — fill gaps only if the description is empty.

---

### Step 3 — Create the issue via GitHub CLI (`gh`)

| Type | Title prefix |
|------|-------------|
| Bug | `[Bug] {short title}` |
| Feature | `[Feature] {short title}` |

**Body:** follow the issue template sections — Summary, Context, Details, and Expected behavior (bug) or Desired outcome (feature). Only include what the user provided; do not fabricate.

Keep titles ≤ 60 chars after the prefix.

Create the issue with:

```bash
gh issue create \
  --repo porsche-code/porsche-ux \
  --title "[Bug] <short title>" \
  --body "<markdown body>"
```

For feature requests, use `[Feature]` in the title.

---

### Step 4 — Confirm

After the tool call succeeds, reply with:

> Issue created: **{title}** → {url}
>
> It will appear on the [project board](https://github.com/orgs/porsche-code/projects/162/views/1) automatically.

---

## Notes

- Do not fabricate information — only include what the user provided.
- Keep titles concise (≤ 60 characters after the prefix).
- If `gh` is not authenticated, instruct the user to run `gh auth login` and retry.
