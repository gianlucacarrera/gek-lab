# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GekLab is a blood analysis interactive dashboard built with Next.js. Users upload lab results (PDF) or enter biomarker values manually. The app displays biomarkers with color-coded ranges (low/optimal/borderline/high), provides AI-powered nutritional recommendations, and generates compliant meal recipes via the Claude API.

## Commands

- `npm run dev` — start dev server (http://localhost:3000)
- `npm run build` — production build
- `npm run lint` — run ESLint

## Architecture

**Stack:** Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + Recharts + Claude API (Anthropic SDK)

### Key directories

- `src/app/` — Next.js App Router pages and API routes
- `src/components/` — React client components (Dashboard, BiomarkerCard, LabResultForm, PdfUpload, Recommendations, RecipeGenerator)
- `src/lib/` — Core logic: `biomarkers.ts` (reference ranges, status calculation, constants), `claude.ts` (Anthropic SDK calls)
- `src/types/` — TypeScript type definitions

### Data flow

1. **Input:** User uploads a PDF → `POST /api/parse-pdf` extracts text with `pdf-parse`, then Claude AI identifies biomarker values from the raw text. Alternatively, user enters values manually via `LabResultForm`.
2. **Enrichment:** Raw `BiomarkerResult[]` are enriched via `enrichBiomarkers()` in `biomarkers.ts`, which applies reference ranges and assigns a `RangeStatus` (low/optimal/borderline/high).
3. **Display:** `Dashboard` component shows `BiomarkerCard` grid with color-coded range bars. Cards include a visual indicator showing where the value falls relative to optimal/low/high zones.
4. **AI features:** `Recommendations` and `RecipeGenerator` components call `/api/recommendations` and `/api/recipes` respectively, which use the Claude API (`src/lib/claude.ts`) to generate personalized advice.

### Biomarker system

`BIOMARKER_RANGES` in `src/lib/biomarkers.ts` is the central reference for all supported biomarkers (30+). Each entry defines `low`, `optimalLow`, `optimalHigh`, `high` thresholds, unit, and category. Categories: lipids, metabolic, blood_count, liver, kidney, thyroid, vitamins, minerals, inflammation, hormones.

To add a new biomarker: add an entry to `BIOMARKER_RANGES` — everything else (form inputs, status calculation, PDF parsing prompts) derives from this map automatically.

### API routes

All in `src/app/api/`:
- `parse-pdf/route.ts` — accepts multipart PDF upload, extracts text, uses Claude to identify biomarker values
- `recommendations/route.ts` — accepts enriched biomarkers, returns AI nutritional advice
- `recipes/route.ts` — accepts enriched biomarkers + dietary preferences, returns AI-generated recipe

## Environment

Requires `ANTHROPIC_API_KEY` in `.env.local` for AI features (PDF parsing, recommendations, recipes). See `.env.local.example`.
