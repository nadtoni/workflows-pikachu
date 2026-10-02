# Idee: ux-ideation (Phase 2)

## Ziel

AI-gestützte Unterstützung für die Ideationsphase — von Research-Insights zu konkreten Lösungskonzepten.

## Geplante Funktionen

### 1. HMW-Fragen generieren
- Input: Research-Insights (aus `porsche-ux-interview` oder `porsche-ux-data-analysis`)
- Output: Strukturierte "How Might We"-Fragen nach Themenbereich
- Format: Markdown + optional HTML-Übersicht

### 2. Ideen clustern
- Input: Freie Ideen-Liste (Bullet Points, Sticky-Note-Exporte)
- Output: Thematisch geclusterte Übersicht mit Häufigkeit und Stärke
- Methode: Affinity Mapping / KJ-Methode

### 3. Crazy-8s strukturieren (textbasiert)
- Input: HMW-Frage
- Output: 8 strukturierte Ideen-Skizzen (textbasiert) in 5-Minuten-Blöcken
- Keine Bildgenerierung — fokussiert auf Konzeptbeschreibungen

### 4. Ideen bewerten (optional)
- Input: Ideen-Liste + Bewertungskriterien (Impact / Feasibility / Novelty)
- Output: Priorisierungsmatrix mit Empfehlung

## Tools (TBD)
- Figma MCP (FigJam) — für spätere visuelle Ausgabe (aktuell zurückgestellt)

## Abhängigkeiten
- Baut auf Outputs von `porsche-ux-interview` und `porsche-ux-data-analysis` auf
- Outputs fließen in `porsche-ux-prototype` ein (Konzept → Prototyp)

## Offene Fragen
- Soll die Ausgabe direkt als FigJam-Board exportiert werden?
- Welches Format für die Ideen-Bewertung ist am nützlichsten?

---

# Skill Draft (gespeichert aus SKILL.md)

---
name: porsche-ux-ideation
description: "Ideation support for UX designers. Use when the user wants to generate HMW questions, cluster ideas, structure brainstorming, or develop solution concepts from research insights."
---

# UX Ideation *(Stub)*

> **Status:** This skill is a placeholder. See [idea.md](./idea.md) for the planned scope.

This skill is part of **Phase 2 — Ideation** in the Porsche UX Workflow.

## Planned scope

See [idea.md](./idea.md).

## Use porsche-ux-workflow for orientation

Not sure which phase you're in? Ask the `porsche-ux-workflow` skill for guidance.
