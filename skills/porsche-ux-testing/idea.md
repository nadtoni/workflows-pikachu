# Idee: ux-testing (Phase 4 — Test)

## Ziel

AI-gestützte Unterstützung für die gesamte Usability-Testing-Praxis — von der Planung bis zur Auswertung.

## Geplante Funktionen

### 1. Testplan generieren
- Input: Design-URL (Figma) oder Feature-Beschreibung + Forschungsfrage
- Output: Strukturierter Testplan mit:
  - Zielsetzung und Fragestellung
  - Zielgruppe und Screener-Kriterien
  - Methode (moderiert/unmoderiert, remote/lab)
  - Aufgabenstellungen (5–7 Tasks mit realistischem Szenario)
  - Metriken: Task Completion Rate, Time on Task, Error Rate, SUS

### 2. Moderationsleitfaden
- Input: Testplan / Aufgabenliste
- Output: Vollständiges Moderationsscript mit:
  - Einleitung und Einverständniserklärung
  - Warm-up-Fragen
  - Aufgaben mit Think-Aloud-Anweisung
  - Probing-Fragen pro Task
  - Abschlussfragen (SUS, offene Fragen)

### 3. Beobachtungsvorlage
- Input: Aufgabenliste
- Output: Tabelle für Live-Notizen (Teilnehmer × Aufgabe × Fehler/Auffälligkeiten)

### 4. Testauswertung
- Input: Rohe Session-Notizen oder Transkripte
- Output: Auswertungsbericht mit:
  - Task Completion Rates
  - Häufigste Fehlerpfade
  - Quotes und Verhaltensbeobachtungen (→ übergibt an `porsche-ux-interview`)
  - Empfehlungen für nächste Design-Iteration

### 5. Design-Test vs. interaktiver Prototypen-Test
- Figma-Prototype (Click-Through): Testplan-Vorlage für Click-Tests mit Maze/UserTesting
- React-Prototyp (Code): Testplan-Vorlage für interaktive Sitzungen

## Tools (TBD)
- Figma MCP — Stimulusmaterial aus Figma lesen
- Maze / UserTesting API — (optional) direkte Integration

## Abhängigkeiten
- Baut auf `porsche-ux-design` oder `porsche-ux-prototype` auf (Design muss vorliegen)
- Testauswertung übergibt an `porsche-ux-interview`
- KPI-Ergebnisse (Completion Rate) fließen in `porsche-ux-measurement` ein

## Offene Fragen
- Soll der Skill auch Remote-Tests mit Aufnahme-Transkripten verarbeiten?
- Integration mit Maze oder Lookback für unmoderierte Tests?

---

# Skill Draft (gespeichert aus SKILL.md)

---
name: porsche-ux-testing
description: "Usability testing support: test plans, moderation scripts, and test evaluation. Use when the user wants to plan a usability test, write a moderator guide, document test findings, or evaluate whether a design solves user tasks. Triggers on: 'Usability Test', 'Nutzertest', 'Testplan', 'Moderation', 'Testauswertung', 'Stimulusmaterial', 'Aufgabenstellungen'."
---

# UX Testing *(Stub)*

> **Status:** This skill is a placeholder. See [idea.md](./idea.md) for the planned scope.

This skill covers **Phase 4 — Test** in the Porsche UX Workflow:

- Usability test plans (moderated, unmoderated)
- Moderator scripts and task descriptions
- Live test support (note-taking templates, observation frameworks)
- Post-test analysis → pass findings to `porsche-ux-interview` for coding

## Planned scope

See [idea.md](./idea.md).

## In the meantime

For evaluating an existing usability test guide, use the `ux-usability-testing-evaluation` skill (available separately in `~/.copilot/skills/`).

For analysing test session notes or recordings, use `porsche-ux-interview`.
