# PerMè Health Dashboard — Technical Specifications for Claude Code

**Document version:** 2.0  
**Date:** March 2026  
**Patient context:** Gianluca Carrera, 52 years, GEKLab PerMè report dated 27/02/2026  
**Target user persona:** Italian woman, 40–65 years old, medium-to-high education, health-conscious  
**Language of the interface:** Italian throughout. Tone: warm, second-person "tu", never alarmist.

---

## 1. Project Overview

A single-page React web app (mobile-first, responsive) that transforms a GEKLab PerMè blood analysis report into an interactive, layered health dashboard. The app presents no raw medical data upfront — all information is progressively revealed as the user chooses to go deeper. No backend. All state lives in memory for the session.

The app is structured around four thematic pillars:
1. **Infiammazione** (BAFF marker)
2. **Zuccheri** (Glycation — Albumina Glicata + Metilgliossale)
3. **Profilo Alimentare** (Food IgG profile + rotation diet)
4. **DNA** (Genetic variants)

---

## 2. Navigation & State Model

This section is the source of truth for how the app flows. Read it before building anything.

### 2.1 Screen Hierarchy

```
Home
├── Pillar: Infiammazione
│   ├── Level 1 — Status + visual gauge
│   ├── Level 2 — Plain-language explanation (swipeable cards)
│   └── Level 3 — Scientific detail (accordion)
├── Pillar: Zuccheri
│   ├── Level 1 — Two gauges + sugar unit tracker
│   ├── Level 2 — Full sugar unit table + PNPLA3 callout
│   └── Level 3 — Glycation science (accordion)
├── Pillar: Profilo Alimentare
│   ├── Level 1 — Today's status + three group badges
│   ├── Level 2 — Food lists (two tabs) + rotation calendar + menu ideas
│   └── Level 3 — Per-group detail article (one per group, reached from Level 2)
└── Pillar: DNA
    ├── Level 1 — Four gene circles
    ├── Level 2 — Gene explanations (swipeable steps per gene)
    └── Level 3 — Full genetic science (accordion)
```

Cross-pillar link: the PNPLA3 callout in Zuccheri Level 2 navigates to DNA Level 2, landing directly on the PNPLA3 gene explanation. The back button from there returns to Zuccheri Level 2, not to DNA Level 1.

### 2.2 Navigation Rules

- Entry to any pillar always starts at Level 1.
- The user descends by tapping a CTA ("Voglio capire →", "Approfondisci →").
- The back arrow in the header moves up exactly one level. At Level 1, back goes to Home.
- The bottom navigation bar is always visible. Tapping a pillar icon navigates to that pillar's Level 1, resetting any depth state for that pillar.
- No URL routing. No browser history manipulation.

### 2.3 Global State Shape

All state lives in a single top-level component. The shape is:

```
navigation: {
  currentScreen: 'home' | 'infiammazione' | 'zuccheri' | 'alimentare' | 'dna'
  currentLevel: 1 | 2 | 3
  previousScreen: string | null   // for cross-pillar back navigation
  previousLevel: number | null
}

sugarTracker: {
  weekStartDate: string (ISO date)
  dailyTotals: { [dayIndex 0–6]: number }
}

weeklyCheckIn: {
  responses: array of { week: string, energy: 1–5, digestion: 1–5, adherence: 1–5 }
}

ui: {
  expandedAccordionSection: string | null
  openGroupSheet: 'wheat' | 'yeasts' | 'nickel' | null
  tooltipContent: string | null
}
```

No localStorage, no sessionStorage. State resets on page reload. This is intentional.

---

## 3. Data Constants

All patient data is hardcoded as constants at the top of the file, outside any component. No data fetching.

### 3.1 Lab Markers

| Marker | Value | Reference | Status |
|---|---|---|---|
| BAFF | 0.208 ng/mL | < 0.20 normal / > 0.50 high | Mildly elevated |
| Albumina Glicata | 7.14% | < 7.44% | Normal |
| Metilgliossale | 0.154 µg/mL | < 0.200 | Normal |
| IgG Totali | 27.83 U/mL | individual | Elevated groups: wheat, yeasts, nickel |

### 3.2 Genetic Results

| Gene | Variant tested | Result | Meaning |
|---|---|---|---|
| TCF7L2 | SNP rs7903146 | Normal / Normal | No predisposition to type 2 diabetes |
| FTO | SNP rs9939609 | Normal / Normal | No predisposition to overweight |
| TNFSF13B | BAFF-var | Normal / Normal | No genetic predisposition to elevated BAFF |
| PNPLA3 | I148M rs738409 | **Variant / Variant (homozygous)** | Genetic predisposition to liver fat metabolism sensitivity |

### 3.3 Active Food Groups
Three groups are flagged for rotation: WHEAT_GLUTEN, YEASTS_FERMENTED, NICKEL_SULFATE.

### 3.4 Always-Allowed Foods
~90 items sourced from report pages 21–22. Each item has: name, category (for grouping). These are always safe to eat regardless of meal type.

Selected items include: riso, grano saraceno, quinoa, miglio, sorgo, teff, amaranto, legumi, patate, carne avicola/bovina/suina/ovina, pesce e crostacei, uova, frutta e verdura (see report for complete list), olio extravergine d'oliva, latte delattosato, panna, burro, caffè, tè verde, tisane senza zucchero, gallette di cereali consentiti, pasta di cereali consentiti, farine di riso/grano saraceno/legumi, fecola di patate, castagne, noce di cocco.

### 3.5 Foods to Avoid in Controlled Meals
~100 items sourced from report pages 23–24. Each item has: name, category. Categories: cereals, dairy/fermented, vegetables, fruit, sweets, condiments, beverages, canned/processed.

Key avoidances: tutto il frumento e glutine (pane, pasta, pizza, farro, kamut, orzo, segale), tutti i lievitati e fermentati (formaggi, yogurt, miele, funghi, vino, birra, aceto, miso, tofu, tempeh, frutta essiccata), alimenti ad alto contenuto di nichel (spinaci, pomodoro, asparagi, cioccolato, lenticchie, avena, mais, ostriche, aringhe, cibi in scatola, pera, kiwi, uva passa, prugne).

### 3.6 Sugar Unit Table
~35 items sourced from report pages 26–27. Each item has: name, portion description, unit count (integer), category (SWEETS / DRINKS / SWEETENERS / DRIED_FRUIT).

Maximum weekly allowance: **15 units**, distributed across a maximum of 2 meals. These meals must be free meals from the rotation schedule.

Selected values: torta 1 porzione = 5 UZ, gelato 2 gusti = 3 UZ, cioccolato fondente 30g = 2 UZ, cioccolato >85% 30g = 1 UZ, biscotti 30g = 2 UZ, vino 125ml = 2 UZ, birra media 400ml = 3 UZ, succo di frutta 200ml = 2 UZ, bibite confezionate 330ml = 3 UZ, caffè al ginseng = 1 UZ, marmellata 1 cucchiaino = 1 UZ, zucchero 1 cucchiaino = 1 UZ, yogurt zuccherato 125g = 3 UZ, frutto essiccato piccolo 7–8 pezzi = 1 UZ (see report for complete list).

### 3.7 Rotation Schedule Logic

The rotation schedule is calculated relative to start date **27/02/2026**.

**Phase 1 (weeks 1–8):** Controlled every day except: Wednesday (all meals free), Saturday dinner (free), Sunday (all meals free).

**Phase 2 (weeks 9–16):** Less restrictive — controlled meals on Monday, Tuesday, Thursday, Friday only. Wednesday, Saturday, Sunday all free.

**Maintenance (week 17+):** Only Monday and Thursday are controlled. All other days are free.

A function `getMealType(date)` returns `'controlled'` or `'free'` based on this logic and the current phase. Phase is determined by the number of weeks elapsed since 27/02/2026.

### 3.8 Menu Ideas
9 items sourced from report page 28. Three per meal type: BREAKFAST, LUNCH, DINNER. Each has a short description (shown on card) and a full description (shown in detail view).

Breakfast ideas: (1) bevanda di soia con cannella + gallette di riso rosso con prosciutto crudo e crema di avocado; (2) frullato con latte + frutto di stagione + quinoa soffiata + gallette di grano saraceno con uova strapazzate; (3) bevanda di soia con spirulina + crêpes con farina di fagioli neri e patate dolci.

Lunch/dinner ideas: (1) petto di pollo alla piastra + fagiolini e patate al vapore; (2) carpaccio di pesce spada + patate al vapore + insalata di lattuga e rucola; (3) frittata con piselli + verdure miste al vapore + gallette di grano saraceno; (4) passato di verdura con piselli + tacchino alla piastra con erbe aromatiche; (5) pasta di grano saraceno con verdure saltate + legumi; (6) zuppa di legumi con riso integrale + verdure al forno.

### 3.9 Supplement Suggestions
5 items sourced from report pages 29–33. Each has: name, one-sentence benefit relevant to this patient, and a dosage summary. Displayed only in Level 3 views, always with the disclaimer: *"Parlane con il tuo medico o nutrizionista."*

Items: Cromo (regola la resistenza insulinica, ~70 mcg/giorno), Cannella (regola il metabolismo degli zuccheri, estratto secco in capsule), Rhodiola Rosea (contrasta stanchezza e fame nervosa, 1–3 capsule da 500mg/giorno), Ribes Nero (azione antinfiammatoria omega-6, 1–2 perle da 1000mg/giorno), Acido Lipoico (antiossidante per il metabolismo glicemico — dosage from report).

---

## 4. Screen Specifications

### 4.1 Home Screen

**Header:** App name "PerMè" with a small nature/leaf icon. Below it, a warm one-sentence greeting using the patient's first name and the report date. No medical terminology.

Example: *"Ciao, Gianluca! Il tuo referto del 27 febbraio è pronto. Ecco cosa c'è da sapere."*

**Four Pillar Cards** (stacked on mobile, 2×2 grid on tablet+). Each card is fully tappable and navigates to that pillar's Level 1. Each card shows:
- An expressive icon (not clinical): flame for inflammation, sugar crystal for zuccheri, fork+plate for food, DNA helix for genetics
- A title in plain Italian
- One sentence status (see values below)
- A visual-only gradient bar from warm green → amber → terracotta. Position is hardcoded per pillar.

Card content:
- Infiammazione: "Leggermente attiva. Si calma con qualche piccola modifica." Bar at 60%.
- Zuccheri: "Nella norma. Vale la pena tenerla d'occhio." Bar at 45%.
- Profilo Alimentare: "3 gruppi chiedono attenzione questa stagione." Bar at 55%.
- DNA: "3 geni nella norma. Uno merita una nota sul fegato." Bar at 40%.

**Weekly Actions section** (below cards). Title: "Cosa puoi fare questa settimana." Three tappable checkbox items, hardcoded, state not persisted:
1. "Sostituisci la pasta di frumento con riso o grano saraceno almeno 3 volte"
2. "Tieni il conto delle tue unità zuccherine: massimo 15 questa settimana"
3. "Evita alcol e fritti nei pasti controllati — il tuo fegato lo apprezzerà"

**Next test countdown** (below actions). A progress bar with label: *"Prossimo test consigliato tra X giorni"* — counting down to 8 months from 27/02/2026 (target: ~27/10/2026).

**Bottom navigation bar** (sticky). Five destinations: Home, Infiammazione, Zuccheri, Alimentazione, DNA. Active destination highlighted. Always visible.

---

### 4.2 Pillar Views — Shared Header

Every pillar view has a header with: back arrow (left), pillar title (center), level indicator dots (right, e.g. ●●○ for Level 2 of 3). The back arrow navigates up one level or to Home.

---

### 4.3 Pillar: Infiammazione

**Level 1 — Status with visual context**

A gauge showing three labeled zones: "Tranquilla" / "Attenzione leggera" / "Attenzione alta". The patient's value is shown as a marker positioned in "Attenzione leggera". The actual numeric value (0.208 ng/mL) appears as a small secondary label only — it is not the primary communication.

Two text blocks below the gauge:
1. *"Il tuo sistema immunitario sta lavorando un po' di più del solito. Non è un allarme — è un segnale su cui puoi intervenire con l'alimentazione."*
2. Positive callout card: *"Il tuo gene TNFSF13B è nella norma. La causa è ambientale, non genetica — e puoi agire."*

CTA: "Voglio capire perché →" → Level 2.

**Level 2 — Three swipeable explanation cards**

Card 1 — "Il BAFF è una sentinella del tuo sistema immunitario": BAFF is produced by immune cells and rises when certain foods are consumed repeatedly or in excess.

Card 2 — "La causa probabile è alimentare, non genetica": Repeated consumption of foods in the wheat, yeast, and nickel groups maintains elevated BAFF. Connects to the dietary rotation.

Card 3 — "Con la rotazione alimentare, scende": A personalized rotation diet reduces BAFF levels in 6–8 weeks. Positive, not a guarantee.

CTA at bottom: "La scienza dietro al BAFF →" → Level 3.

**Level 3 — Scientific accordion**

Collapsed sections (one open at a time):
- "Cos'è il BAFF e perché misurarlo"
- "BAFF e malattie autoimmuni"
- "Come l'alimentazione influenza il BAFF"
- "Il gene TNFSF13B: il risultato positivo"

Footer note: *"Vuoi approfondire ancora? Sul sito GEKLab trovi tutti i riferimenti scientifici citati nel referto."*

---

### 4.4 Pillar: Zuccheri

**Level 1 — Two gauges + sugar tracker**

Two circular arc gauges side by side. Each shows its value filling an arc, color-coded green (within range) or amber (above range). Each has a plain-language label and a tappable info icon that opens a tooltip with a one-sentence explanation.

- Left: Albumina Glicata — 7.14% (normal, optimal boundary at 7.44%). Tooltip: *"Indica quanto zucchero ha 'caramellato' le tue proteine nelle ultime 3 settimane."*
- Right: Metilgliossale — 0.154 µg/mL (normal, optimal boundary at 0.200). Tooltip: *"Cresce con i picchi di glucosio e fruttosio nel sangue."*

Both are green. Status text below each: "Nella norma ✓".

**Sugar Unit Tracker** (primary engagement feature):

A large circular counter showing current weekly total vs. 15 (e.g., "7 / 15"). Color transitions: green (0–10), amber (11–14), terracotta (15+). Below it, a strip of 7 day dots (L M M G V S D) that fill as units are logged. Today's dot is highlighted.

A prominent button "＋ Aggiungi quello che hai mangiato" opens a bottom sheet with the full sugar unit table organized into four tabs: Dolci, Bevande, Dolcificanti, Frutta secca. Tapping an item adds its units to today's total. A "Svuota oggi" option appears once any item has been added. A "Nuova settimana" button appears when 7 days have elapsed since the tracker was first used in the session, or when the user taps it manually — it resets all daily totals.

CTA: "Cosa sono le Unità Zuccherine? →" → Level 2.

**Level 2 — Full table + PNPLA3 callout**

A searchable, categorized list of all ~35 sugar unit items. Items show name, portion, and unit count as filled dot icons (e.g., ●●○ for 2 units).

Below the list, an amber-tinted callout card:
Title: "Una nota per te sul fegato"
Body: *"Il tuo gene PNPLA3 indica una sensibilità ereditaria del fegato agli zuccheri e all'alcol. Non è una malattia — è informazione preziosa. Per te tenere la glicazione bassa conta un po' di più che per altri."*
CTA: "Cosa significa PNPLA3 →" → navigates to DNA Level 2, PNPLA3 section. Back from there returns here.

**Level 3 — Glycation science accordion**

Collapsed sections:
- "Cos'è la glicazione e perché ci interessa"
- "Albumina glicata vs. emoglobina glicata"
- "Il Metilgliossale"
- "Fruttosio, alcol e dolcificanti: tutti contano"
- "Consigli pratici per ridurre i picchi glicemici"

---

### 4.5 Pillar: Profilo Alimentare

**Level 1 — Today's status + three group badges**

A banner at the top that reads differently based on `getMealType(today)`:

Controlled day: soft green banner — "Oggi: pasto controllato 🥗" — "Segui la lista degli alimenti consentiti" — button "Vedi cosa mangiare →" (goes to Level 2, always-allowed tab).

Free day: warm amber banner — "Oggi: pasto libero 🎉" — "Puoi reintrodurre i tuoi soliti alimenti" — button "Torna alla lista domani".

Three group badges in a row: Frumento & Glutine / Lieviti & Fermentati / Nichel Solfato, each showing "In rotazione" status. Tapping a badge opens a bottom sheet for that group containing: a list of what foods are in that group, a plain-language explanation of why it is in rotation for this patient, and a short list of suggested substitutes.

**Level 2 — Food lists + calendar + menu ideas**

Two-tab interface:

Tab "Sempre consentiti": alphabetically grouped, searchable list of all ~90 always-allowed foods.

Tab "Da evitare nei pasti controllati": categorized list of all ~100 restricted foods.

Below the tabs:

**Menu Ideas**: Three horizontally swipeable card groups — Colazione, Pranzo, Cena. Three cards per group. Each card shows a short description. Tapping a card expands it to show the full description.

**Rotation Calendar link**: "Il Calendario di Rotazione →" opens a dedicated calendar view (within Level 2). Monthly grid, days color-coded: neutral for controlled, soft green for free. Phase indicator shows current phase (1, 2, or maintenance) based on weeks elapsed since 27/02/2026. Tapping a day shows a small popover: meal type for that day.

**Level 3 — Group detail articles**

One long-form article per group. Reached by tapping "Approfondisci" in each group's bottom sheet. Not accordion — clean long-form prose with section headers, formatted for reading. Content sourced from report pages 11–17.

Groups: Frumento & Glutine (pages 11–12), Lieviti & Fermentati (pages 13–14), Nichel Solfato (pages 15–17). The nickel article includes the smoking warning from the report, formatted as a callout.

---

### 4.6 Pillar: DNA

**Level 1 — Four gene circles**

Four large circles in a 2×2 grid. Three are green (normal), one (PNPLA3) is amber. Each circle shows the gene's plain-language label and a one-word status. Tapping a circle expands an inline detail card beneath it with: what the gene does (1 sentence), what this result means for this patient (1–2 sentences), and a CTA "Voglio capire meglio →" that goes to Level 2.

A warm framing paragraph below the grid: *"Su 4 geni analizzati, 3 sono nella norma. Solo il PNPLA3 porta con sé una nota di attenzione — non una diagnosi, ma una mappa preziosa per fare scelte più consapevoli."*

**Level 2 — Per-gene swipeable explanations**

For PNPLA3 (the critical one): 4 swipeable step cards.
1. "Il gene PNPLA3" — what it normally does in the liver.
2. "La variante I148M omozigote" — having two copies means the liver processes fats and sugars with less tolerance than average.
3. "Nella pratica quotidiana" — limit alcohol during controlled days, prefer whole carbohydrates, avoid glycemic spikes.
4. "La buona notizia" — lifestyle intervention is highly effective; this is a map, not a sentence.

For each of the three normal genes: a single card confirming the result with a brief positive explanation. No need for 4 steps.

Bottom callout: *"La genetica non è il destino. È uno strumento per personalizzare le tue scelte."*

CTA: "Tutta la scienza genetica →" → Level 3.

**Level 3 — Genetic science accordion**

Collapsed sections:
- "Come funziona l'analisi genetica: i polimorfismi"
- "Il gene TNFSF13B e il BAFF"
- "TCF7L2 e il diabete tipo 2"
- "FTO e il sovrappeso"
- "PNPLA3 e la sensibilità epatica" (most detailed — includes MASLD/MASH context from report, odds ratios explained in plain language)
- "Odds ratio: cosa significa in pratica"

In Level 3, medical terms rendered in the brand color with a dotted underline are tappable and show a tooltip with a plain-language definition.

---

### 4.7 Weekly Check-In

A "Come stai?" floating button in the bottom-right corner of the Home screen opens a modal. Three questions answered on a 5-point emoji scale:
1. "Come ti è sembrata l'energia questa settimana?"
2. "Com'è stata la digestione?"
3. "Hai seguito la rotazione più spesso del solito?"

Questions appear one at a time; the next appears automatically on selection. After all three, a short template-based encouraging response is shown (no AI needed — just a few response templates based on score combinations). Responses are stored in session state. If the user has checked in more than once in the session, a small sparkline chart shows the trend across check-ins.

---

## 5. Components Needed

The following components are needed. Implementation details are left to Claude Code's judgment.

- **GradientBar** — displays a patient marker value on a color-scaled horizontal bar with labeled zones
- **CircularGauge** — displays a lab value as a filled SVG arc gauge with an info tooltip
- **PillarCard** — home screen card combining icon, title, status text, and a GradientBar; fully tappable
- **LayeredView** — wrapper that manages level depth for a pillar, renders the back header and level indicator, and shows the appropriate level content
- **SwipeCards** — horizontally swipeable card deck with dot navigation; touch and click support
- **Accordion** — expandable sections with only one open at a time
- **FoodList** — searchable, grouped list of food items
- **SugarLogger** — bottom sheet with tabbed food categories for logging sugar units
- **RotationCalendar** — monthly calendar grid with controlled/free day coloring, phase indicator, and day popover
- **GeneCircle** — tappable gene status circle that expands an inline detail card
- **Tooltip** — floating plain-language definition card, dismissed by tapping outside
- **BottomNav** — sticky five-destination navigation bar
- **CheckInModal** — sequential emoji-scale questionnaire with a response screen and session history

---

## 6. Visual Design Direction

**Palette intent:** Warm, Mediterranean, not clinical. The feeling should be a health-conscious Italian magazine, not a hospital app. Use warm cream backgrounds, terracotta as the primary brand and action color, sage green for positive/safe states, and amber for attention states. Never use pure red. Terracotta is the maximum alert color, and it always appears with explanatory text — never alone.

**Typography:** Rounded sans-serif. Nunito or DM Sans are the preferred choices; fall back gracefully to system UI fonts. Body text line-height should be generous (around 1.6) for comfortable mobile reading.

**Motion:** Transitions should feel gentle and considered — not instant, not sluggish. Swipe snapping and accordion transitions should feel smooth. No layout shifts.

**Tone through design:** Warmth is communicated not just through copy but through the visual choices — soft shadows, rounded corners, icons that feel hand-crafted rather than generic. The app should feel like something made for this person, not a generic health tool.

---

## 7. Responsive Behavior

Primary target: 390px wide mobile screen. All layouts default to single-column. At tablet width (768px+), pillar cards on the home screen switch to a 2×2 grid, and food lists gain more horizontal space. At desktop width (1024px+), the calendar and its associated content can appear side by side. The bottom nav is always visible on mobile; on wide screens it may transition to a sidebar or top nav.

---

## 8. Accessibility

All interactive elements have a minimum tap target of 44×44px. Color is never the only indicator of state — all gauges have text labels alongside their visual. Icons have aria-labels in Italian. Modals trap focus and restore it on close. The app should be keyboard-navigable on desktop.

---

## 9. Content and Copy — Binding Rules

These rules apply to every string in the app, including any generated during development.

- **Always "tu"** — never "lei", never "voi"
- **Never "problema"** — use "aspetto", "segnale", "caratteristica"
- **Never "devi" alone** — use "ti conviene", "vale la pena", "il tuo corpo lo apprezzerà"
- **PNPLA3 is never alarming** — always "informazione preziosa", "mappa", "attenzione in più"
- **Supplement mentions always end with** the exact phrase: *"Parlane con il tuo medico o nutrizionista."*
- **"Infiammazione" is always qualified** — "lieve infiammazione", "infiammazione di basso grado" — never standalone
- **Level 3 content is framed as optional reading** — *"Se vuoi saperne di più, ecco la spiegazione completa..."*

---

## 10. Out of Scope

- Authentication, login, or user accounts
- Backend or data persistence across sessions
- Push notifications
- Wearable or external data integration
- Sharing, exporting, or printing the report
- Multi-patient support
- AI-generated personalized advice (all content is hardcoded from the report)
- Comparison with previous test results
