# Alimentazione — Rebuild Spec

**Version:** 1.0  
**Date:** March 2026  
**Status:** Ready for implementation

***

## Context

This spec replaces the existing Alimentazione section entirely. The old implementation contained a sugar tracker, static meal suggestions, and a disconnected day view. None of that survives.

The new Alimentazione is the **daily engagement engine** of the app. Its single job: turn the exam data into a lightweight daily habit loop that teaches the user nutrition rules through lived experience, not instruction.

Design philosophy: **learn while you do it**. No meal plans. No instructions to follow. Only reflection on what the user actually ate, scored against today's prescription.

***

## Data dependencies

Alimentazione reads from exam-derived data only. It writes nothing back.

```ts
DayEntry {
  date: string                  // ISO format YYYY-MM-DD
  dayType: string               // references DayTypeDefinition.id
}

DayTypeDefinition {
  id: string
  label: string                 // Italian label e.g. "Giorno di Scarico"
  avoidList: string[]           // 2–4 short noun phrases to avoid today
  contextSentence: string       // one line explaining why today matters
  severityWeight: number        // 0.5–1.5 multiplier for scoring
}

FoodRule {
  food: string
  status: 'allowed' | 'limited' | 'excluded'
  category: 'proteine' | 'carboidrati' | 'verdure' | 'grassi' | 'altro'
  note?: string                 // optional clinical note
}
```

These types must be defined in `src/lib/types.ts` and populated from `src/data/` (sourced from the exam PDF at onboarding). They are the **single source of truth** for all Alimentazione logic.

***

## Section structure — 3 views, one tab

The tab shows one view at a time. View is determined by time of day and user action. No sub-navigation visible.

***

### View 1 — Morning Signal

**Trigger:** Default view when tab opens before 14:00 and no evening recap has been submitted today.

**Content blocks:**

-   Day type label — single line, large type (e.g. *"Giorno di Scarico"*)
-   Avoid list — 2–3 short noun phrases, no explanations (e.g. *"Zuccheri, Latticini, Frumento"*)
-   Context sentence — one line, warm tone, derived from `dayType.contextSentence`

**Rules:**

-   No food suggestions. Avoidances only.
-   Max 15 seconds to read. No scrolling required.
-   After 14:00, this view is replaced by the Evening Recap prompt automatically.
-   If the user has already submitted an evening recap today, skip directly to score result.

***

### View 2 — Evening Recap

**Trigger:** After 14:00, or user taps *"Registra i pasti"* at any time.

**Step 1 — Food selection:**

-   Visual grid of foods, organized by category: Proteine / Carboidrati / Verdure / Grassi / Altro
-   Foods in grid are drawn from `foodRules` (allowed + limited + excluded — show all, color-code status)
-   Tap to select, tap again to deselect
-   Excluded foods are shown in the grid but visually dimmed — selecting them is allowed (the user ate it; that's the point)
-   Optional: single free-text note field at the bottom, one line max

**Step 2 — Scoring (on tap of "Valuta"):**

Scoring logic lives in `src/lib/scoringEngine.ts` as a pure function. No API call.

```
base score = 5
for each selected food:
  if status === 'excluded': base score -= 1.5 × dayType.severityWeight
  if status === 'limited': base score -= 0.5 × dayType.severityWeight
score = clamp(base score, 1, 5)
rounded to nearest 0.5
```

**Step 3 — Claude API call (after score is calculated):**

One API call per evening session, triggered by "Valuta". Not on food selection. Not on tab load.

```
Model: claude-sonnet-4-20250514
Max tokens: 150
Temperature: 0.3

System prompt:
  Sei un coach nutrizionale gentile. Rispondi sempre in italiano.
  Il tono è caldo, diretto, mai giudicante. Mai usare il termine 'punti'.

User prompt:
  Giorno: {dayType.label} (peso severità: {severityWeight})
  Alimenti consumati: {selectedFoods with status}
  Punteggio: {score}/5
  
  Se punteggio < 3: scrivi 2 righe che spiegano cosa ha influenzato il punteggio
  (cita l'alimento specifico) e una frase che inizia con "Domani prova a…"
  Se punteggio ≥ 4: scrivi 2 righe di rinforzo positivo, nessun consiglio.
  Se punteggio 3–3.5: 2 righe neutre, un piccolo suggerimento per domani.
```

**Score display:**

-   1–5 stars (half-star increments)
-   2-line Italian explanation from API
-   Forward suggestion if score \< 3
-   Positive note if score ≥ 4

**Tone rules:**

-   Coach, not teacher
-   Never punitive
-   No calorie counting, no macros
-   The explanation must name the specific food that most impacted the score

***

### View 3 — Weekly Recap

**Trigger:** Sunday after 18:00 as default. Accessible any day via a subtle *"Settimana"* toggle at top of tab.

**Content:**

-   7-day score strip — one dot per day, color by score range
    -   Score ≥ 4 → green
    -   Score 2.5–3.5 → amber
    -   Score ≤ 2 → soft red
    -   No log submitted → grey
-   Streak counter: *"X giorni ✦"* — consecutive days with score ≥ 3
-   One pattern observation — derived from the week's scores and most-flagged foods (no API call; rule-based)
-   Sunday-only prompt: *"Come ti sei sentita questa settimana?"* — open text input, stored locally, never scored, never sent to API

**Rules:**

-   No external API call for weekly view
-   All data derived from locally stored daily scores
-   The weekly question is private; it exists to build self-awareness, not to feed the system

***

## Habit mechanic

```
Streak = consecutive days where a log was submitted AND score ≥ 3
Display: "3 giorni ✦"  — minimal, not gamified, no animations
Placement: top-right of the Alimentazione tab header
Reset: any day with no log OR score < 3 resets streak to 0
Storage: localStorage (no backend required in v1)
```

***

## File structure

```
src/
  components/
    alimentazione/
      MorningSignal.tsx       ← View 1
      EveningRecap.tsx        ← View 2 container
      FoodGrid.tsx            ← food selection grid
      ScoreResult.tsx         ← score + API response display
      WeeklyStrip.tsx         ← View 3
  lib/
    scoringEngine.ts          ← pure function, no side effects
    alimentazioneApi.ts       ← single Claude API call, typed I/O
    types.ts                  ← DayEntry, DayTypeDefinition, FoodRule
```

***

## What to delete from existing Alimentazione

-   Sugar tracker UI — sugar data belongs in Esami
-   Static hardcoded meal suggestions
-   Any AI call that runs on page load or tab switch
-   Any reference to the old 5-section navigation structure (Home, Infiammazione, Zuccheri, Alimentazione, DNA)
-   Any meal planning or generation logic

***

## What this section does NOT do

-   Does not generate meal plans
-   Does not track calories or macros
-   Does not connect to external food databases
-   Does not push notifications (v1)
-   Does not require user account or backend (v1)
-   Does not let the user edit the food rules or calendar

***

## Open questions for v2 (not in scope now)

-   Weekly AI-generated pattern summary (replace rule-based observation)
-   Photo input for food logging (replace grid tap)
-   Push notification for evening recap reminder
-   Backend sync for multi-device streak persistence
