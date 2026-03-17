# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PerMè is an interactive health dashboard that transforms a GEKLab blood analysis report into a layered, mobile-first web app. Built for an Italian audience with a warm, non-clinical tone. All patient data is hardcoded from one specific report (Gianluca Carrera, 27/02/2026).

The app is organized around 3 conceptual pillars:
- **Esami** → "understand your body" (lab results, genetics, sugar tracker)
- **Alimenti** → "know your rules" (food lists, rotation calendar, meal ideas)
- **Alimentazione** → "live it daily" (morning signal, evening recap with AI scoring, weekly strip)

## Commands

- `npm run dev` — start dev server (http://localhost:3000)
- `npm run build` — production build
- `npm run lint` — run ESLint

## Architecture

**Stack:** Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + Claude API (Anthropic SDK)

### Navigation

3-tab bottom nav. Each tab is a self-contained view. A floating "Come stai?" button provides access to the Weekly Check-In modal from any tab.

### Key directories

- `src/app/` — Next.js App Router pages and API routes
- `src/components/` — React client components (views + shared utilities)
- `src/components/alimentazione/` — Alimentazione sub-components (MorningSignal, EveningRecap, FoodGrid, etc.)
- `src/data/` — Hardcoded patient data (`constants.ts`) and food rules (`foodRules.ts`)
- `src/lib/` — Core logic: `dayTypes.ts`, `scoringEngine.ts`, `storage.ts`
- `src/types/` — TypeScript type definitions

### View components

- `EsamiView` — Lab markers (BAFF, Albumina Glicata, MGO) with 3-depth progressive disclosure (compact → gauge → science accordion), Sugar Tracker (circular counter + day dots + bottom sheet), genetic profile (4 genes with expandable detail), supplements, retest recommendations
- `AlimentiView` — Rotation calendar with phase indicator, food groups in rotation (with articles), always-allowed food list (searchable), restricted food list, menu ideas (Colazione/Pranzo/Cena)
- `AlimentazioneView` — Daily engagement engine: morning signal (day type + avoid list), evening food recap with FoodGrid + AI scoring via Claude, score result with stars + AI comment, weekly strip with 7-day dots + streak + pattern observation
- `SugarTracker` — Circular SVG counter (weekly total / 15 max), 7 day dots, bottom sheet with 4 tabbed food categories (Dolci, Bevande, Dolcificanti, Frutta secca)
- `WeeklyCheckIn` — Modal with 3 sequential emoji-scale questions (energy, digestion, adherence), sparkline trend, encouragement response

### Data flow

1. **Patient data** in `src/data/constants.ts`: lab markers, genetic results, food groups, sugar units, menu ideas, L3 educational content, supplements
2. **Day type logic** in `src/lib/dayTypes.ts`: determines controlled/partial/free days based on rotation phase
3. **Scoring** in `src/lib/scoringEngine.ts`: pure function scoring meal adherence (base 5, penalties for excluded/limited foods)
4. **AI feedback** via `POST /api/alimentazione`: Claude Sonnet generates 2-line Italian meal feedback based on score
5. **Storage** in `src/lib/storage.ts`: localStorage for daily logs, streak, weekly notes, sugar tracker, check-ins

### API routes

- `api/alimentazione/route.ts` — accepts day type + selected foods + score, returns AI nutritional coach comment (Claude Sonnet, 150 tokens, temperature 0.3)

## Environment

Requires `ANTHROPIC_API_KEY` in `.env.local` for the Alimentazione AI feedback feature.

## Content rules (Italian)

- Always "tu" (never "lei", never "voi")
- Never "problema" — use "aspetto", "segnale", "caratteristica"
- Never "devi" alone — use "ti conviene", "vale la pena"
- PNPLA3 is never alarming — "informazione preziosa", "mappa"
- Supplement mentions always end with: "Parlane con il tuo medico o nutrizionista."
- "Infiammazione" is always qualified: "lieve infiammazione", not standalone
