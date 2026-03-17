import type { LabMarker, GeneResult, FoodItem, SugarUnitItem, MenuIdea, Supplement, MealType, RotationPhase } from '@/types/app';

// ─── Patient ───────────────────────────────────────────────────────
export const PATIENT = {
  firstName: 'Gianluca',
  lastName: 'Carrera',
  age: 52,
  reportDate: '2026-02-27',
  reportDateFormatted: '27 febbraio 2026',
  nextTestTarget: '2026-10-27',
};

// ─── Lab Markers ───────────────────────────────────────────────────
export const LAB_MARKERS: Record<string, LabMarker> = {
  BAFF: {
    name: 'BAFF',
    value: 0.20,
    unit: 'ng/mL',
    refLow: 0.20,
    refHigh: 0.50,
    status: 'mildly_elevated',
  },
  ALBUMINA_GLICATA: {
    name: 'Albumina glicata',
    value: 7.14,
    unit: '%',
    refLow: 1.15,
    refHigh: 2.95,
    status: 'high',
  },
  METILGLIOSSALE: {
    name: 'Metilgliossale (MGO)',
    value: 0.154,
    unit: 'µg/mL',
    refHigh: 0.200,
    status: 'normal',
  },
  IGG_TOTALI: {
    name: 'Total Specific IgG',
    value: 27.83,
    unit: 'UI/mL',
    status: 'elevated',
  },
};

// ─── IgG Detail ────────────────────────────────────────────────────
export const IGG_DETAIL = [
  { name: 'Fungal ribotoxin, Metallopeptidase', value: 2.52 },
  { name: 'Globulin 12s', value: 3.8 },
  { name: 'Gliadin, Alpha amylase-trypsin inhibitor', value: 3.29 },
  { name: 'Thaumatin-like protein, Chitinase', value: 4.01 },
  { name: 'Lactoferrin, Casein', value: 3.78 },
  { name: 'Vicillin', value: 1.63 },
  { name: 'Patatin', value: 1.56 },
  { name: 'Sus casein', value: 2.97 },
  { name: 'Starch synthase', value: 1.62 },
  { name: 'Peptidase papain-like', value: 1.44 },
  { name: 'Ovomucoid, Livetin', value: 1.21 },
];

// ─── Genetic Results ───────────────────────────────────────────────
export const GENETIC_RESULTS: GeneResult[] = [
  {
    gene: 'TCF7L2',
    snp: 'rs7903146',
    result: 'Normale / Normale',
    isVariant: false,
    plainLabel: 'Diabete tipo 2',
    meaning: 'Nessuna predisposizione genetica allo sviluppo di diabete di tipo 2',
  },
  {
    gene: 'FTO',
    snp: 'rs9939609',
    result: 'Normale / Normale',
    isVariant: false,
    plainLabel: 'Sovrappeso',
    meaning: 'Nessuna predisposizione genetica allo sviluppo di sovrappeso e obesità',
  },
  {
    gene: 'TNFSF13B',
    snp: 'BAFF-var',
    result: 'Normale / Normale',
    isVariant: false,
    plainLabel: 'Livelli di BAFF',
    meaning: 'Nessuna predisposizione genetica allo sviluppo di più alti livelli di BAFF',
  },
  {
    gene: 'PNPLA3',
    snp: 'I148M rs738409',
    result: 'Variante / Variante (omozigote)',
    isVariant: true,
    plainLabel: 'Sensibilità epatica',
    meaning: 'Predisposizione genetica alla sensibilità del fegato nel metabolismo dei grassi e degli zuccheri',
  },
];

// ─── Active Food Groups ────────────────────────────────────────────
export const ACTIVE_FOOD_GROUPS = [
  {
    id: 'wheat' as const,
    name: 'Frumento e Glutine',
    icon: '🌾',
    foods: [
      'Frumento (tutti i tipi)', 'Pane (bianco, integrale)', 'Pasta di frumento', 'Pizza',
      'Farro', 'Kamut', 'Orzo', 'Segale', 'Spelta', 'Enkir / Freekeh',
      'Grissini', 'Fette biscottate', 'Biscotti di frumento', 'Dolci e torte con farina di frumento',
      'Brioche e pasticceria', 'Crusca', 'Semolino', 'Bulgur', 'Cous cous',
      'Seitan', 'Impanature', 'Caffè d\'orzo', 'Whisky',
    ],
    description: 'Le IgG alimento-specifiche per il gruppo Frumento e Glutine indicano un consumo eccessivo o ripetuto nel tempo degli alimenti che appartengono a questo gruppo. In nessun caso il test può rivelare una celiachia o una allergia IgE mediata al frumento.',
    substitutes: ['Riso', 'Grano saraceno', 'Quinoa', 'Miglio', 'Sorgo', 'Teff', 'Amaranto', 'Gallette di cereali consentiti', 'Farine di riso o legumi'],
  },
  {
    id: 'yeasts' as const,
    name: 'Lieviti e Fermentati',
    icon: '🧀',
    foods: [
      'Prodotti lievitati da forno', 'Formaggi stagionati', 'Formaggi freschi (ricotta, mozzarella)',
      'Parmigiano', 'Yogurt', 'Tofu', 'Tempeh', 'Miso', 'Salsa di soia',
      'Funghi', 'Miele', 'Aceto', 'Vino', 'Birra', 'Frutta essiccata',
      'Conserve sott\'olio e sott\'aceto', 'Maionese industriale', 'Dadi da brodo',
      'Pane azzimo (incluso)', 'Acido citrico (E330)', 'Tè fermentati',
    ],
    description: 'La dieta va applicata non solo agli alimenti che contengono lieviti, ma a tutti i prodotti che hanno subìto qualche forma di fermentazione, anche se non è stato aggiunto lievito.',
    substitutes: ['Gallette senza lievito', 'Latte delattosato', 'Panna fresca', 'Burro', 'Olio extravergine d\'oliva'],
  },
  {
    id: 'nickel' as const,
    name: 'Nichel Solfato',
    icon: '🔬',
    foods: [
      'Spinaci', 'Pomodoro', 'Asparagi', 'Rabarbaro',
      'Cioccolato (tutti i tipi)', 'Cacao', 'Lenticchie', 'Avena', 'Mais',
      'Kiwi', 'Pera', 'Uva passa', 'Prugne',
      'Ostriche', 'Aringhe', 'Cibi in scatola',
      'Mandorle tostate', 'Nocciole tostate', 'Arachidi',
      'Semi di girasole', 'Semi di lino', 'Margarine e grassi vegetali',
      'Funghi', 'Prugne umeboshi', 'Pistacchi', 'Pinoli', 'Noci', 'Sesamo', 'Cocco essiccato',
    ],
    description: 'La risposta agli alimenti contenenti nichel è individuale e non dipende solo dallo specifico contenuto in nichel. Negli ultimi anni, allergie e infiammazioni dovute al nichel stanno aumentando di frequenza.',
    substitutes: ['Frutta di stagione (esclusi kiwi, pera)', 'Verdure a foglia verde (esclusi spinaci)', 'Riso', 'Carni fresche', 'Pesce fresco'],
  },
];

// ─── Always-Allowed Foods ──────────────────────────────────────────
export const ALWAYS_ALLOWED_FOODS: FoodItem[] = [
  { name: 'Riso (tutti i tipi)', category: 'Cereali' },
  { name: 'Grano saraceno', category: 'Cereali' },
  { name: 'Quinoa', category: 'Cereali' },
  { name: 'Miglio', category: 'Cereali' },
  { name: 'Sorgo', category: 'Cereali' },
  { name: 'Teff', category: 'Cereali' },
  { name: 'Amaranto', category: 'Cereali' },
  { name: 'Pasta di cereali consentiti', category: 'Cereali' },
  { name: 'Gallette di riso', category: 'Cereali' },
  { name: 'Gallette di grano saraceno', category: 'Cereali' },
  { name: 'Farina di riso', category: 'Cereali' },
  { name: 'Farina di grano saraceno', category: 'Cereali' },
  { name: 'Farina di legumi', category: 'Cereali' },
  { name: 'Fecola di patate', category: 'Cereali' },
  { name: 'Pollo', category: 'Carne e pesce' },
  { name: 'Tacchino', category: 'Carne e pesce' },
  { name: 'Manzo', category: 'Carne e pesce' },
  { name: 'Vitello', category: 'Carne e pesce' },
  { name: 'Maiale', category: 'Carne e pesce' },
  { name: 'Agnello', category: 'Carne e pesce' },
  { name: 'Coniglio', category: 'Carne e pesce' },
  { name: 'Prosciutto crudo', category: 'Carne e pesce' },
  { name: 'Bresaola', category: 'Carne e pesce' },
  { name: 'Pesce fresco (tutti i tipi)', category: 'Carne e pesce' },
  { name: 'Crostacei', category: 'Carne e pesce' },
  { name: 'Pesce spada', category: 'Carne e pesce' },
  { name: 'Salmone', category: 'Carne e pesce' },
  { name: 'Tonno fresco', category: 'Carne e pesce' },
  { name: 'Uova', category: 'Uova e latticini' },
  { name: 'Latte delattosato', category: 'Uova e latticini' },
  { name: 'Panna fresca', category: 'Uova e latticini' },
  { name: 'Burro', category: 'Uova e latticini' },
  { name: 'Fagioli', category: 'Legumi' },
  { name: 'Ceci', category: 'Legumi' },
  { name: 'Piselli', category: 'Legumi' },
  { name: 'Fave', category: 'Legumi' },
  { name: 'Zucchine', category: 'Verdura' },
  { name: 'Carote', category: 'Verdura' },
  { name: 'Fagiolini', category: 'Verdura' },
  { name: 'Lattuga', category: 'Verdura' },
  { name: 'Rucola', category: 'Verdura' },
  { name: 'Finocchio', category: 'Verdura' },
  { name: 'Cetriolo', category: 'Verdura' },
  { name: 'Sedano', category: 'Verdura' },
  { name: 'Radicchio', category: 'Verdura' },
  { name: 'Cicoria', category: 'Verdura' },
  { name: 'Indivia', category: 'Verdura' },
  { name: 'Cavolo cappuccio', category: 'Verdura' },
  { name: 'Cavolfiore', category: 'Verdura' },
  { name: 'Broccoli', category: 'Verdura' },
  { name: 'Verza', category: 'Verdura' },
  { name: 'Peperoni', category: 'Verdura' },
  { name: 'Melanzane', category: 'Verdura' },
  { name: 'Cipolla (piccole quantità)', category: 'Verdura' },
  { name: 'Scalogno', category: 'Verdura' },
  { name: 'Porro', category: 'Verdura' },
  { name: 'Patate', category: 'Verdura' },
  { name: 'Patate dolci', category: 'Verdura' },
  { name: 'Zucca', category: 'Verdura' },
  { name: 'Barbabietola', category: 'Verdura' },
  { name: 'Carciofi', category: 'Verdura' },
  { name: 'Mela', category: 'Frutta' },
  { name: 'Banana', category: 'Frutta' },
  { name: 'Arancia', category: 'Frutta' },
  { name: 'Mandarino', category: 'Frutta' },
  { name: 'Limone', category: 'Frutta' },
  { name: 'Pompelmo', category: 'Frutta' },
  { name: 'Fragole', category: 'Frutta' },
  { name: 'Mirtilli', category: 'Frutta' },
  { name: 'Lamponi', category: 'Frutta' },
  { name: 'Ciliegie', category: 'Frutta' },
  { name: 'Pesca', category: 'Frutta' },
  { name: 'Albicocca', category: 'Frutta' },
  { name: 'Melone', category: 'Frutta' },
  { name: 'Anguria', category: 'Frutta' },
  { name: 'Ananas', category: 'Frutta' },
  { name: 'Fico fresco', category: 'Frutta' },
  { name: 'Olio extravergine d\'oliva', category: 'Condimenti' },
  { name: 'Sale', category: 'Condimenti' },
  { name: 'Erbe aromatiche', category: 'Condimenti' },
  { name: 'Spezie', category: 'Condimenti' },
  { name: 'Succo di limone', category: 'Condimenti' },
  { name: 'Avocado', category: 'Condimenti' },
  { name: 'Castagne', category: 'Condimenti' },
  { name: 'Noce di cocco', category: 'Condimenti' },
  { name: 'Caffè', category: 'Bevande' },
  { name: 'Tè verde', category: 'Bevande' },
  { name: 'Tisane senza zucchero', category: 'Bevande' },
  { name: 'Acqua', category: 'Bevande' },
  { name: 'Bevanda di soia', category: 'Bevande' },
];

// ─── Foods to Avoid (Controlled Meals) ─────────────────────────────
export const RESTRICTED_FOODS: FoodItem[] = [
  { name: 'Frumento (tutti i tipi)', category: 'Cereali e glutine' },
  { name: 'Pane (bianco, integrale)', category: 'Cereali e glutine' },
  { name: 'Pasta di frumento', category: 'Cereali e glutine' },
  { name: 'Pizza', category: 'Cereali e glutine' },
  { name: 'Farro', category: 'Cereali e glutine' },
  { name: 'Kamut', category: 'Cereali e glutine' },
  { name: 'Orzo', category: 'Cereali e glutine' },
  { name: 'Segale', category: 'Cereali e glutine' },
  { name: 'Spelta', category: 'Cereali e glutine' },
  { name: 'Enkir / Freekeh', category: 'Cereali e glutine' },
  { name: 'Grissini', category: 'Cereali e glutine' },
  { name: 'Fette biscottate', category: 'Cereali e glutine' },
  { name: 'Biscotti di frumento', category: 'Cereali e glutine' },
  { name: 'Dolci e torte con farina di frumento', category: 'Cereali e glutine' },
  { name: 'Brioche e pasticceria', category: 'Cereali e glutine' },
  { name: 'Crusca', category: 'Cereali e glutine' },
  { name: 'Semolino', category: 'Cereali e glutine' },
  { name: 'Bulgur', category: 'Cereali e glutine' },
  { name: 'Cous cous', category: 'Cereali e glutine' },
  { name: 'Seitan', category: 'Cereali e glutine' },
  { name: 'Impanature', category: 'Cereali e glutine' },
  { name: 'Caffè d\'orzo', category: 'Cereali e glutine' },
  { name: 'Whisky', category: 'Cereali e glutine' },
  { name: 'Formaggi stagionati', category: 'Lieviti e fermentati' },
  { name: 'Formaggi freschi (ricotta, mozzarella)', category: 'Lieviti e fermentati' },
  { name: 'Parmigiano', category: 'Lieviti e fermentati' },
  { name: 'Yogurt', category: 'Lieviti e fermentati' },
  { name: 'Tofu', category: 'Lieviti e fermentati' },
  { name: 'Tempeh', category: 'Lieviti e fermentati' },
  { name: 'Miso', category: 'Lieviti e fermentati' },
  { name: 'Salsa di soia', category: 'Lieviti e fermentati' },
  { name: 'Funghi', category: 'Lieviti e fermentati' },
  { name: 'Miele', category: 'Lieviti e fermentati' },
  { name: 'Aceto', category: 'Lieviti e fermentati' },
  { name: 'Vino', category: 'Lieviti e fermentati' },
  { name: 'Birra', category: 'Lieviti e fermentati' },
  { name: 'Frutta essiccata', category: 'Lieviti e fermentati' },
  { name: 'Prodotti lievitati da forno', category: 'Lieviti e fermentati' },
  { name: 'Pane azzimo (incluso)', category: 'Lieviti e fermentati' },
  { name: 'Conserve sott\'olio e sott\'aceto', category: 'Lieviti e fermentati' },
  { name: 'Maionese industriale', category: 'Lieviti e fermentati' },
  { name: 'Dadi da brodo', category: 'Lieviti e fermentati' },
  { name: 'Spinaci', category: 'Nichel' },
  { name: 'Pomodoro', category: 'Nichel' },
  { name: 'Asparagi', category: 'Nichel' },
  { name: 'Rabarbaro', category: 'Nichel' },
  { name: 'Cioccolato (tutti i tipi)', category: 'Nichel' },
  { name: 'Cacao', category: 'Nichel' },
  { name: 'Lenticchie', category: 'Nichel' },
  { name: 'Avena', category: 'Nichel' },
  { name: 'Mais', category: 'Nichel' },
  { name: 'Kiwi', category: 'Nichel' },
  { name: 'Pera', category: 'Nichel' },
  { name: 'Uva passa', category: 'Nichel' },
  { name: 'Prugne', category: 'Nichel' },
  { name: 'Ostriche', category: 'Nichel' },
  { name: 'Aringhe', category: 'Nichel' },
  { name: 'Cibi in scatola', category: 'Nichel' },
  { name: 'Mandorle tostate', category: 'Nichel' },
  { name: 'Nocciole tostate', category: 'Nichel' },
  { name: 'Arachidi', category: 'Nichel' },
  { name: 'Semi di girasole', category: 'Nichel' },
  { name: 'Semi di lino', category: 'Nichel' },
  { name: 'Margarine e grassi vegetali', category: 'Nichel' },
  { name: 'Funghi', category: 'Nichel' },
  { name: 'Prugne umeboshi', category: 'Nichel' },
  { name: 'Pistacchi', category: 'Nichel' },
  { name: 'Pinoli', category: 'Nichel' },
  { name: 'Noci', category: 'Nichel' },
  { name: 'Sesamo', category: 'Nichel' },
  { name: 'Cocco essiccato', category: 'Nichel' },
  { name: 'Acido citrico (E330)', category: 'Lieviti e fermentati' },
  { name: 'Tè fermentati', category: 'Lieviti e fermentati' },
  { name: 'Besciamella industriale', category: 'Preparazioni industriali' },
  { name: 'Salse pronte', category: 'Preparazioni industriali' },
  { name: 'Gelati industriali', category: 'Preparazioni industriali' },
  { name: 'Budini industriali', category: 'Preparazioni industriali' },
  { name: 'Merendine confezionate', category: 'Preparazioni industriali' },
  { name: 'Crackers', category: 'Preparazioni industriali' },
  { name: 'Fast food e cibi fritti industriali', category: 'Preparazioni industriali' },
];

// ─── Sugar Unit Items ──────────────────────────────────────────────
export const SUGAR_UNIT_ITEMS: SugarUnitItem[] = [
  { name: 'Torta (1 porzione)', portion: '1 fetta', units: 5, category: 'SWEETS' },
  { name: 'Gelato (2 gusti)', portion: '2 palline', units: 3, category: 'SWEETS' },
  { name: 'Cioccolato fondente', portion: '30 g', units: 2, category: 'SWEETS' },
  { name: 'Cioccolato >85%', portion: '30 g', units: 1, category: 'SWEETS' },
  { name: 'Biscotti', portion: '30 g', units: 2, category: 'SWEETS' },
  { name: 'Brioche / cornetto', portion: '1 pezzo', units: 4, category: 'SWEETS' },
  { name: 'Crostata di frutta', portion: '1 fetta', units: 4, category: 'SWEETS' },
  { name: 'Tiramisù', portion: '1 porzione', units: 5, category: 'SWEETS' },
  { name: 'Panna cotta', portion: '1 porzione', units: 3, category: 'SWEETS' },
  { name: 'Budino', portion: '1 porzione', units: 3, category: 'SWEETS' },
  { name: 'Caramelle', portion: '30 g', units: 2, category: 'SWEETS' },
  { name: 'Cioccolatino', portion: '1 pezzo', units: 1, category: 'SWEETS' },
  { name: 'Merendina confezionata', portion: '1 pezzo', units: 3, category: 'SWEETS' },
  { name: 'Yogurt zuccherato', portion: '125 g', units: 3, category: 'SWEETS' },
  { name: 'Vino', portion: '125 ml', units: 2, category: 'DRINKS' },
  { name: 'Birra media', portion: '400 ml', units: 3, category: 'DRINKS' },
  { name: 'Birra piccola', portion: '200 ml', units: 2, category: 'DRINKS' },
  { name: 'Succo di frutta', portion: '200 ml', units: 2, category: 'DRINKS' },
  { name: 'Bibita confezionata', portion: '330 ml', units: 3, category: 'DRINKS' },
  { name: 'Caffè al ginseng', portion: '1 tazza', units: 1, category: 'DRINKS' },
  { name: 'Cocktail alcolico', portion: '1 bicchiere', units: 3, category: 'DRINKS' },
  { name: 'Spritz', portion: '1 bicchiere', units: 2, category: 'DRINKS' },
  { name: 'Liquore dolce', portion: '1 bicchierino', units: 2, category: 'DRINKS' },
  { name: 'Tè freddo zuccherato', portion: '330 ml', units: 2, category: 'DRINKS' },
  { name: 'Zucchero', portion: '1 cucchiaino', units: 1, category: 'SWEETENERS' },
  { name: 'Marmellata', portion: '1 cucchiaino', units: 1, category: 'SWEETENERS' },
  { name: 'Miele', portion: '1 cucchiaino', units: 1, category: 'SWEETENERS' },
  { name: 'Sciroppo d\'acero', portion: '1 cucchiaino', units: 1, category: 'SWEETENERS' },
  { name: 'Crema di nocciole', portion: '1 cucchiaino', units: 2, category: 'SWEETENERS' },
  { name: 'Datteri', portion: '2 pezzi', units: 1, category: 'DRIED_FRUIT' },
  { name: 'Fichi secchi', portion: '2 pezzi', units: 1, category: 'DRIED_FRUIT' },
  { name: 'Albicocche secche', portion: '3 pezzi', units: 1, category: 'DRIED_FRUIT' },
  { name: 'Uva passa', portion: '1 cucchiaio', units: 1, category: 'DRIED_FRUIT' },
  { name: 'Prugne secche', portion: '2 pezzi', units: 1, category: 'DRIED_FRUIT' },
  { name: 'Frutto essiccato piccolo', portion: '7-8 pezzi', units: 1, category: 'DRIED_FRUIT' },
];

export const MAX_WEEKLY_SUGAR_UNITS = 15;

// ─── Menu Ideas ────────────────────────────────────────────────────
export const MENU_IDEAS: MenuIdea[] = [
  {
    mealType: 'BREAKFAST',
    shortDescription: 'Bevanda di soia con cannella + gallette di riso rosso con prosciutto crudo e crema di avocado',
    fullDescription: 'Scalda una tazza di bevanda di soia e aggiungi un pizzico di cannella. Accompagna con gallette di riso rosso spalmate con crema di avocado fresco e una fetta di prosciutto crudo. Un inizio proteico e saziante.',
  },
  {
    mealType: 'BREAKFAST',
    shortDescription: 'Frullato con latte e frutto di stagione + quinoa soffiata + gallette con uova strapazzate',
    fullDescription: 'Prepara un frullato con latte delattosato e un frutto di stagione a scelta. Aggiungi quinoa soffiata per croccantezza. A parte, gallette di grano saraceno con uova strapazzate cotte nel burro.',
  },
  {
    mealType: 'BREAKFAST',
    shortDescription: 'Bevanda di soia con spirulina + crêpes con farina di fagioli neri e patate dolci',
    fullDescription: 'Bevanda di soia con un cucchiaino di spirulina in polvere. Prepara crêpes con farina di fagioli neri, farcite con patate dolci al vapore schiacciate. Un\'alternativa ricca di proteine vegetali.',
  },
  {
    mealType: 'LUNCH',
    shortDescription: 'Petto di pollo alla piastra + fagiolini e patate al vapore',
    fullDescription: 'Cuoci un petto di pollo alla piastra con erbe aromatiche. Accompagna con fagiolini freschi e patate al vapore condite con olio extravergine d\'oliva e un pizzico di sale.',
  },
  {
    mealType: 'LUNCH',
    shortDescription: 'Carpaccio di pesce spada + patate al vapore + insalata di lattuga e rucola',
    fullDescription: 'Carpaccio di pesce spada fresco condito con olio extravergine, limone e pepe rosa. Patate al vapore a cubetti e un\'insalata mista di lattuga e rucola.',
  },
  {
    mealType: 'LUNCH',
    shortDescription: 'Frittata con piselli + verdure miste al vapore + gallette di grano saraceno',
    fullDescription: 'Prepara una frittata con uova e piselli freschi. Accompagna con verdure miste al vapore (zucchine, carote, fagiolini) e gallette di grano saraceno.',
  },
  {
    mealType: 'DINNER',
    shortDescription: 'Passato di verdura con piselli + tacchino alla piastra con erbe aromatiche',
    fullDescription: 'Un passato leggero di verdure di stagione arricchito con piselli per le proteine. A parte, fettine di tacchino alla piastra con rosmarino e salvia.',
  },
  {
    mealType: 'DINNER',
    shortDescription: 'Pasta di grano saraceno con verdure saltate + legumi',
    fullDescription: 'Pasta di grano saraceno (pizzoccheri o formato corto) condita con verdure saltate in olio extravergine. Aggiungi una porzione di legumi a scelta per completezza proteica.',
  },
  {
    mealType: 'DINNER',
    shortDescription: 'Zuppa di legumi con riso integrale + verdure al forno',
    fullDescription: 'Zuppa calda con fagioli, ceci e riso integrale. Accompagna con verdure al forno (zucchine, peperoni, melanzane) condite con olio extravergine e erbe aromatiche.',
  },
];

// ─── Supplements ───────────────────────────────────────────────────
export const SUPPLEMENTS: Supplement[] = [
  {
    name: 'Cromo',
    benefit: 'Aiuta a regolare la resistenza insulinica e il metabolismo degli zuccheri',
    dosage: '~70 mcg al giorno',
  },
  {
    name: 'Cannella',
    benefit: 'Contribuisce a regolare il metabolismo degli zuccheri nel sangue',
    dosage: 'Estratto secco in capsule, secondo indicazione',
  },
  {
    name: 'Rhodiola Rosea',
    benefit: 'Contrasta la stanchezza e aiuta a gestire la fame nervosa',
    dosage: '1-3 capsule da 500 mg al giorno',
  },
  {
    name: 'Ribes Nero',
    benefit: 'Azione antinfiammatoria grazie agli acidi grassi omega-6',
    dosage: '1-2 perle da 1000 mg al giorno',
  },
  {
    name: 'Acido Lipoico',
    benefit: 'Antiossidante che supporta il metabolismo glicemico',
    dosage: 'Secondo indicazione medica',
  },
];

// ─── Rotation Schedule Logic ───────────────────────────────────────
const ROTATION_START = new Date('2026-02-27');

export function getRotationPhase(date: Date): RotationPhase {
  const diffMs = date.getTime() - ROTATION_START.getTime();
  const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
  if (diffWeeks < 8) return 1;
  if (diffWeeks < 16) return 2;
  return 'maintenance';
}

export function getMealType(date: Date): MealType {
  const phase = getRotationPhase(date);
  const day = date.getDay();

  if (phase === 1) {
    if (day === 0 || day === 3) return 'free'; // Sunday, Wednesday: all free
    if (day === 6) return 'partial'; // Saturday: controlled except dinner
    return 'controlled';
  }

  if (phase === 2) {
    if (day === 1 || day === 2 || day === 4 || day === 5) return 'controlled';
    return 'free';
  }

  if (day === 1 || day === 4) return 'controlled';
  return 'free';
}

export function getDaysUntilNextTest(): number {
  const target = new Date(PATIENT.nextTestTarget);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

// ─── Pillar Home Card Data ─────────────────────────────────────────
export const PILLAR_CARDS = [
  {
    id: 'infiammazione' as const,
    title: 'Infiammazione',
    icon: '🔥',
    status: 'Leggermente attiva. Si calma con qualche piccola modifica.',
    barPosition: 60,
  },
  {
    id: 'zuccheri' as const,
    title: 'Zuccheri',
    icon: '🍬',
    status: 'Nella norma. Vale la pena tenerla d\'occhio.',
    barPosition: 45,
  },
  {
    id: 'alimentare' as const,
    title: 'Profilo Alimentare',
    icon: '🍽️',
    status: '3 gruppi chiedono attenzione questa stagione.',
    barPosition: 55,
  },
  {
    id: 'dna' as const,
    title: 'DNA',
    icon: '🧬',
    status: '3 geni nella norma. Uno merita una nota sul fegato.',
    barPosition: 40,
  },
];

export const WEEKLY_ACTIONS = [
  'Sostituisci la pasta di frumento con riso o grano saraceno almeno 3 volte',
  'Tieni il conto delle tue unità zuccherine: massimo 15 questa settimana',
  'Evita alcol e fritti nei pasti controllati — il tuo fegato lo apprezzerà',
];

// ─── Level 3 Content ───────────────────────────────────────────────
export const INFIAMMAZIONE_L3 = [
  {
    title: 'Cos\'è il BAFF e perché misurarlo',
    content: 'Il BAFF (B-Cell Activating Factor) è una citochina prodotta principalmente dalle cellule del sistema immunitario. È coinvolta nella regolazione delle cellule B e in numerosi processi, nella regolazione delle cellule B e in diversi aspetti infiammatori, anche dovuti al cibo.\n\nLa produzione di BAFF dipende dalla risposta immunologica a stimoli esterni come a stimoli endogeni. Tra questi, l\'alimentazione ha un ruolo primario e il contatto ripetuto con gli stessi alimenti contribuisce a mantenere alto il suo livello.\n\nIl BAFF è coinvolto in gran parte dei processi difensivi dell\'organismo ed è fortemente implicato nella regolazione della produzione di anticorpi. Controllare l\'innalzamento del BAFF è uno strumento di forte significato clinico.',
  },
  {
    title: 'BAFF e malattie autoimmuni',
    content: 'Un aumento ingiustificato di BAFF può portare ad esempio alla produzione di autoanticorpi in eccesso favorendo lo sviluppo di malattie autoimmuni.\n\nIl BAFF stesso può avere un ruolo in molte delle malattie e dei disturbi oggi più diffusi e frequenti, coinvolgendo pelle, articolazioni, muscoli, sistema endocrino e metabolismo.\n\nPer una corretta e efficace prevenzione di queste malattie, controllare l\'innalzamento del BAFF è uno strumento di forte significato clinico.',
  },
  {
    title: 'Come l\'alimentazione influenza il BAFF',
    content: 'I livelli di BAFF misurati e attualmente presenti nel tuo organismo dipendono in larga misura da fattori ambientali e anche il modo in cui ci si nutre ha un ruolo determinante.\n\nIl BAFF, infatti, si innalza quando un alimento o dei gruppi di alimenti immunologicamente simili vengono consumati in eccesso o in modo ripetuto nel tempo.\n\nUna impostazione nutrizionale individualizzata, basata sulla valutazione del profilo alimentare personale, riduce i sintomi dovuti allo stato infiammatorio e contribuisce alla modulazione dei valori di questa citochina e al controllo dei suoi molteplici effetti clinici.',
  },
  {
    title: 'Il gene TNFSF13B: il risultato positivo',
    content: 'L\'analisi del tuo DNA non ha rilevato la presenza della variante genica specifica nel gene che codifica per BAFF. Questo è un dato sicuramente positivo e indica, qualora siano stati identificati livelli elevati di questa citochina, che il controllo dello stile di vita (alimentazione, attività fisica e integrazione personalizzata) possa modulare efficacemente questi livelli.\n\nIl gene TNFSF13B è un frammento di DNA che serve per costruire la proteina BAFF. La presenza di una specifica variante (BAFF-var) in questo gene è correlata con una maggior suscettibilità genetica alla produzione di più alti livelli di BAFF. Nel tuo caso, questa variante non è presente.',
  },
];

export const ZUCCHERI_L3 = [
  {
    title: 'Cos\'è la glicazione e perché ci interessa',
    content: 'La glicazione è un processo in cui gli zuccheri si legano alle proteine presenti in circolo, alterandone il corretto funzionamento. Come se gli zuccheri "caramellassero" le proteine circolanti.\n\nQuesto processo è alla base di molti danni a lungo termine e rappresenta un indicatore importante del rapporto tra la nostra alimentazione e la salute metabolica.',
  },
  {
    title: 'Albumina glicata vs. emoglobina glicata',
    content: 'L\'albumina glicata rappresenta un indice di controllo glicemico nel breve-medio periodo, essendo particolarmente sensibile a variazioni della glicemia media che riguardano le ultime 3 settimane. A differenza dell\'emoglobina glicata, i suoi valori considerano anche i picchi di fruttosio o di glucosio che si determinano dopo il pasto o dopo una assunzione di sostanze dolci o di amidi e veloce assorbimento.\n\nRappresenta quindi anche un "indice di picco" dei diversi zuccheri circolanti e la misura dell\'effettiva glicazione delle proteine, cioè la lettura del danno provocato dai differenti tipi di zuccheri che vanno a legarsi a proteine presenti in circolo.',
  },
  {
    title: 'Il Metilgliossale',
    content: 'Il metilgliossale fa parte delle sostanze ossidative e infiammatorie che provocano anche accumulo di radicali liberi nell\'organismo. Il suo valore cresce in modo proporzionale all\'andamento della glicemia e dei suoi picchi in relazione alle oscillazioni ematiche di concentrazione di glucosio e di fruttosio.\n\nDeterminati livelli di metilgliossale indicano anche un suo possibile accumulo nel corso del tempo e segnalano una importante alterazione della sensibilità agli zuccheri che impone una dieta controllata (in genere su dolci, vino, fruttosio, alcol) per favorire il ritorno a livelli basali. Oltre alle azioni pro-infiammatorie, il metilgliossale determina un aumento della resistenza insulinica.',
  },
  {
    title: 'Fruttosio, alcol e dolcificanti: tutti contano',
    content: 'Non sono solo i dolci a contribuire alla glicazione. Il fruttosio contenuto nelle bevande, l\'alcol e i dolcificanti aggiunti contribuiscono tutti ai picchi glicemici.\n\nPer questo il sistema delle Unità Zuccherine ti aiuta a tenere sotto controllo il totale settimanale, includendo tutte le fonti di zuccheri nella tua alimentazione.',
  },
  {
    title: 'Consigli pratici per ridurre i picchi glicemici',
    content: 'I consigli che ne derivano non riguardano solo il controllo degli eccessi zuccherini, ma anche il controllo infiammatorio e l\'impostazione di una sana attività fisica, il controllo del peso in eccesso e un controllo medico sanitario più ravvicinato.\n\nAlcuni accorgimenti pratici: preferisci i carboidrati integrali, associa sempre una fonte proteica ai pasti, evita gli zuccheri a stomaco vuoto, e distribuisci le Unità Zuccherine nell\'arco della settimana senza concentrarle in un solo giorno.',
  },
];

export const DNA_L3 = [
  {
    title: 'Come funziona l\'analisi genetica: i polimorfismi',
    content: 'All\'interno delle nostre cellule è presente il DNA (Acido DesossiriboNucleico), la molecola che contiene tutte le informazioni necessarie per il corretto funzionamento dell\'intero organismo.\n\nProprio come in un libro, all\'interno del DNA della cellula sono presenti le "parole" ossia i geni, in grado di "dare gli ordini" per produrre le proteine necessarie per il corretto funzionamento dell\'intera cellula.\n\nOgni singolo cambiamento nella sequenza del DNA costituisce una variante e può causare una alterazione nella composizione della proteina stessa o nella regolazione della sua espressione. Poiché il DNA è "doppio" (disposto in due cromosomi omologhi), le parole presenti all\'interno sono anch\'esse presenti in due copie e non sempre le copie sono uguali.',
  },
  {
    title: 'Il gene TNFSF13B e il BAFF',
    content: 'Il gene TNFSF13B è un frammento di DNA che serve per costruire la proteina BAFF. BAFF è una citochina che viene primariamente prodotta dalle cellule del sistema immunitario ed è coinvolta in numerosi processi, nella regolazione delle cellule B e in diversi aspetti infiammatori, anche dovuti al cibo.\n\nGrazie agli studi di Gonzalez e Steri, è stata identificata una specifica variante nel gene TNFSF13B (BAFF-var). La presenza di questa specifica variante genica è correlata con una maggior suscettibilità genetica alla produzione di più alti livelli di BAFF.\n\nNel tuo caso il gene corrisponde a quello più rappresentato nella popolazione generale (BAFF-wt), un dato positivo.',
  },
  {
    title: 'TCF7L2 e il diabete tipo 2',
    content: 'Il gene TCF7L2 è uno dei geni più studiati in relazione alla predisposizione al diabete di tipo 2. La variante rs7903146 è associata a un rischio aumentato.\n\nNel tuo caso, entrambe le copie del gene sono nella forma più comune nella popolazione (wild-type). Questo significa che non c\'è una predisposizione genetica aggiuntiva allo sviluppo del diabete di tipo 2, anche se uno stile di vita sano resta importante per tutti.',
  },
  {
    title: 'FTO e il sovrappeso',
    content: 'Il gene FTO (Fat mass and Obesity-associated) è uno dei geni più studiati in relazione al rischio di sovrappeso e obesità. La variante rs9939609 è stata associata a una maggiore tendenza all\'accumulo di peso.\n\nNel tuo caso, il risultato è normale per entrambe le copie. Un lavoro pubblicato sul BMJ nel 2018 ha mostrato che chi ha una predisposizione genetica al sovrappeso è anche chi trae maggiori vantaggi da un intervento dietetico personalizzato. La predisposizione genetica può quindi rappresentare sia una condizione sfavorevole sia un vantaggio, in relazione a come si gestiscono le abitudini alimentari.',
  },
  {
    title: 'PNPLA3 e la sensibilità epatica',
    content: 'Il gene PNPLA3 codifica per un enzima coinvolto nel metabolismo dei grassi nel fegato. La variante I148M (rs738409) in forma omozigote (come nel tuo caso) è associata a una maggiore sensibilità del fegato nell\'elaborazione di grassi e zuccheri.\n\nQuesto non significa avere una malattia epatica, ma indica che il tuo fegato potrebbe essere più sensibile rispetto alla media. In termini pratici: il tuo organismo beneficia particolarmente di un controllo attento della glicazione, di una limitazione dell\'alcol nei giorni di dieta controllata, e della preferenza per carboidrati integrali.\n\nLa condizione oggi indicata come MASLD (steatosi epatica metabolica) e la sua forma più avanzata MASH sono condizioni che possono essere prevenute e gestite efficacemente con lo stile di vita. Avere questa informazione genetica è una mappa preziosa, non una sentenza.',
  },
  {
    title: 'Odds ratio: cosa significa in pratica',
    content: 'Le tre varianti geniche (SNP) o polimorfismi genetici studiati nel test sono correlati anche alla gestione degli zuccheri. Questi polimorfismi non indicano mai lo sviluppo di una malattia, ma segnalano il rapporto di probabilità (odds ratio), per alcuni soggetti, di sviluppare quella malattia e la necessità di una maggiore attenzione dietetica o nutrizionale.\n\nIl quadro genetico che è stato analizzato ha quindi il semplice valore di un "avviso di cautela", che può essere gestito in modo adeguato, a volte anche con semplici modifiche di alcune abitudini alimentari individualmente scorrette.',
  },
];

export const GROUP_ARTICLES = {
  wheat: {
    title: 'Frumento e Glutine',
    sections: [
      {
        title: 'Il gruppo',
        content: 'Per una corretta impostazione dietetica bisogna prendere in considerazione sia il grano tenero che il grano duro, anche la sola crusca e inoltre tutti i cereali che contengono glutine, come orzo, farro, Kamut, segale, enkir. Al contrario, riteniamo che l\'avena sia uno dei cereali indicati per la sostituzione insieme a riso, miglio, grano saraceno, mais, quinoa, amaranto, sorgo, teff e soia.',
      },
      {
        title: 'Cosa significa la presenza di IgG',
        content: 'La presenza di IgG alimento-specifiche per il gruppo Frumento e Glutine indica un consumo eccessivo o ripetuto nel tempo degli alimenti che appartengono a questo gruppo. In nessun caso il test può rivelare una celiachia o una allergia IgE mediata al frumento (diagnosticabile solo attraverso altri esami di approfondimento).',
      },
      {
        title: 'Alimenti compresi nel gruppo',
        content: 'Tutti gli alimenti contenenti grano duro, grano tenero, farro, Kamut, segale, orzo, enkir, spelta, freekeh. Pane e prodotti da forno (bianco, integrale, grissini, fette biscottate, biscotti, dolci, torte, brioche, pasticceria fresca e secca, pizze, tartine). Paste alimentari di ogni tipo. Crusca e preparazioni integrali miste. Semolino, bulgur, cous cous. Impanature. Caffè d\'orzo. Birra, whisky e alcuni tipi di malto.',
      },
      {
        title: 'Il suggerimento',
        content: 'Il suggerimento è quello di consumare il più possibile i semplici cereali alternativi o le loro farine, prodotti fatti in casa o prodotti di estrusione come gallette o estrusi di cereali consentiti. Controllare con molta attenzione le etichette dei vari prodotti e gli ingredienti in essi contenuti.',
      },
      {
        title: 'Avena e Celiachia',
        content: 'In presenza di una diagnosi di celiachia le evidenze sperimentali indicano che l\'avena sia ben tollerata dalla maggior parte dei celiaci, tuttavia persistono ancora delle perplessità e alcune minoranze mostrano una risposta immune. Per tale ragione si suggerisce ai celiaci di consultare le linee guida riportate nel proprio paese di residenza e di consumare solo eventualmente i prodotti di cui si garantisce l\'idoneità dell\'avena impiegata. La decisione di includere qualsiasi tipo di glutine di un paziente celiaco deve essere discussa con il proprio medico.',
      },
    ],
  },
  yeasts: {
    title: 'Lieviti e Prodotti Fermentati',
    sections: [
      {
        title: 'Il gruppo',
        content: 'Il contenuto di questa scheda è il frutto di aggiustamenti e verifiche che, nel corso degli anni, ci hanno portato a considerare in modo più esteso la gamma degli alimenti da controllare quando esiste una infiammazione da cibo dovuta a lieviti e prodotti fermentati.',
      },
      {
        title: 'Oltre i lieviti: la fermentazione',
        content: 'La dieta va applicata non solo agli alimenti che contengono effettivamente lieviti, ma a tutti i prodotti che hanno subìto qualche forma di fermentazione, anche se a queste preparazioni non è stato aggiunto lievito di birra né lievito chimico né pasta madre.\n\nÈ importante leggere attentamente questa scheda perché i lieviti, a differenza del latte o del frumento, non sono sempre rilevabili dall\'etichetta del prodotto e perché vengono considerati parte di questo Gruppo tutti gli alimenti fermentati oltre che quelli con presenza effettiva di lievito.',
      },
      {
        title: 'Alimenti compresi nel gruppo',
        content: 'Tutti i prodotti lievitati da forno. Funghi. Tutti i formaggi (sia freschi che stagionati). Yogurt (sia di latte animale sia di soia). Miele. Frutta essiccata o disidratata. Conserve sott\'olio, sott\'aceto e in salamoia. Condimenti come aceto, dadi da brodo, maionese industriale, salse macrobiotiche. Bevande fermentate come birra, vino, alcolici, tè fermentati. Acido citrico (E330).',
      },
      {
        title: 'Attenzione alla masticazione',
        content: 'Masticare il più possibile i cibi prima di deglutirli, perché i pezzi di cibo ingeriti e non sminuzzati a sufficienza rimangono inevitabilmente nello stomaco più a lungo, dando luogo a un inizio di processo di fermentazione. Non mangiare pane per evitare i cibi fermentati ha la stessa importanza del non lasciare che un cibo fermenti dentro lo stomaco a causa della mancata masticazione.',
      },
    ],
  },
  nickel: {
    title: 'Nichel Solfato',
    sections: [
      {
        title: 'Il nichel nell\'alimentazione',
        content: 'Il nichel è un metallo presente in molti oggetti di uso comune e per questo è difficile evitarne il contatto nella vita quotidiana. Negli ultimi anni, allergie e infiammazioni dovute al nichel stanno aumentando di frequenza.\n\nUna delle cause che ha portato a un sovraccarico di solfato di nichel nell\'alimentazione è l\'uso massiccio da parte dell\'industria alimentare di grassi vegetali idrogenati e non. La lavorazione dei grassi vegetali lascia abbondanti residui di solfato di nichel nei prodotti finiti.',
      },
      {
        title: 'La risposta individuale',
        content: 'La risposta agli alimenti contenenti nichel è, quindi, sempre individuale e non dipende solo dallo specifico contenuto in nichel. In base alle risposte cliniche del singolo è possibile che a distanza di alcuni giorni si riconosca la validità di una dieta che controlli anche cereali a contenuto di nichel più basso (come riso o frumento) o, all\'opposto, che consenta il più ampio utilizzo del mais.',
      },
      {
        title: 'Alimenti compresi nel gruppo',
        content: 'Spinaci, funghi, pomodoro, asparagi e rabarbaro. Pera, kiwi, uva passa, prugne e prugne umeboshi. Cacao e tutti i tipi di cioccolato. Lenticchie. Mais, Avena. Aringhe, Ostriche. Cibi in scatola o di latta di qualunque genere. Frutta secca e semi oleosi (mandorle, nocciole, pistacchi, pinoli, arachidi, noci, sesamo, semi di lino, di zucca, di girasole) quando tostati. Margarine e grassi vegetali.',
      },
      {
        title: 'Attenzione al fumo',
        content: 'Il fumo di tabacco porta il nichel non solo a contatto con bocca e occhi, ma anche nella profondità dei polmoni, e soprattutto lo fa entrare nel circolo sanguigno immediatamente, per cui la concentrazione di nichel nell\'organismo cresce in modo evidente. Dalla combustione delle foglie di tabacco a soli 43°C si sviluppa la produzione di nichel-carbonile che viene inalato o passato nel sangue attraverso il contatto con la mucosa.\n\nRidurre l\'apporto alimentare di nichel è perciò fondamentale, ma non si potrà trovare un vero equilibrio se si continuerà a introdurne con il fumo.',
      },
    ],
  },
};

// ─── Marker Interpretations (Depth-1 Clinical Text) ─────────────
export const MARKER_INTERPRETATIONS = {
  BAFF: {
    depth1Summary: 'Il tuo BAFF è al limite della soglia di normalità (0.20 ng/mL). Si evidenzia la presenza di una condizione infiammatoria di media entità, che potrebbe essere legata all\'alimentazione. Il tuo sistema immunitario sta reagendo probabilmente per cause alimentari.',
    tnfsf13bCallout: 'Il tuo gene TNFSF13B è nella norma. Il gene corrisponde a quello più rappresentato nella popolazione generale (BAFF-wt). La causa dell\'innalzamento è ambientale, non genetica — e puoi agire con la dieta a rotazione.',
    scienceIntro: 'La scienza dietro al BAFF:',
  },
  ALBUMINA_GLICATA: {
    depth1Summary: 'L\'albumina glicata misura quanto zucchero si è legato alle proteine del sangue nelle ultime 3 settimane. Il tuo valore è significativamente elevato (7.14% contro un massimo di 2.95%) — un segnale importante che indica un eccesso di glicazione su cui è necessario intervenire con l\'alimentazione.',
    combinationNote: 'Se da un lato il valore di metilgliossale basso può indicare l\'assenza di recenti eccessi di assunzione zuccherina, il valore elevato di albumina glicata indica che nel corso delle ultime 3 settimane il tuo organismo rileva dei "segnali di allarme" determinati da frequenti picchi di zuccheri (in particolare glucosio e fruttosio) successivi alla assunzione di cibo, anche se emoglobina glicata e glicemia a digiuno possono essere normali.',
    actionNote: 'Sono da mettere in atto tutte le misure preventive possibili per ridurre la resistenza insulinica perché gli zuccheri e il loro eccesso possono diventare un problema. I consigli non riguardano solo il controllo degli eccessi zuccherini, ma anche il controllo infiammatorio e l\'impostazione di una sana attività fisica, il controllo del peso in eccesso e un controllo medico sanitario più ravvicinato.',
    scienceIntro: 'La scienza della glicazione:',
  },
  METILGLIOSSALE: {
    depth1Summary: 'Il metilgliossale è un marcatore di stress ossidativo legato ai picchi glicemici. Il tuo valore è nella norma (0.154 µg/mL contro un massimo di 0.200 µg/mL) — il tuo organismo non mostra segni di recenti eccessi acuti di assunzione zuccherina.',
    scienceIntro: 'La scienza del metilgliossale:',
  },
};

// ─── Clinical Summary (Overall Narrative) ────────────────────────
export const CLINICAL_SUMMARY = {
  title: 'Il quadro generale',
  paragraphs: [
    'Il tuo referto evidenzia due aree su cui intervenire. L\'albumina glicata è significativamente elevata (7.14% contro un massimo di 2.95%): il tuo organismo sta subendo un eccesso di glicazione, con troppi zuccheri che si legano alle proteine del sangue. Il metilgliossale, invece, è nella norma — un buon segnale.',
    'Il BAFF è al limite della soglia (0.20 ng/mL): il tuo sistema immunitario sta reagendo probabilmente per cause alimentari. La buona notizia? Il tuo gene TNFSF13B è nella norma, quindi puoi intervenire efficacemente con la dieta a rotazione.',
    'Sul fronte genetico, l\'unica variante rilevata è nel gene PNPLA3 (sensibilità epatica): non una diagnosi, ma un invito a fare scelte più consapevoli su grassi, zuccheri e alcol. Gli altri 3 geni analizzati sono tutti nella norma.',
  ],
};

// ─── Retest Recommendations ─────────────────────────────────────
export const RETEST_RECOMMENDATIONS = {
  intermediate: {
    markers: ['Albumina glicata', 'Metilgliossale'],
    timeframe: '2 mesi',
    description: 'Si consiglia di ripetere la misurazione dei valori di albumina glicata e metilgliossale tra 2 mesi.',
  },
  full: {
    timeframe: '6-8 mesi fino a 18 mesi',
    description: 'Suggeriamo la ripetizione del test a distanza di un periodo che va da almeno 6-8 mesi fino ai 18 mesi per rivalutare il livello di infiammazione correlato al cibo e il proprio Profilo Alimentare Personale.',
  },
};

// ─── Non-Reactive Food Groups ────────────────────────────────────
export const NON_REACTIVE_FOOD_GROUPS = [
  { name: 'Latte e Carne bovina', icon: '🥛', reactive: false },
  { name: 'Oli cotti', icon: '🫒', reactive: false },
];

// ─── IgE Disclaimer ─────────────────────────────────────────────
export const IGE_DISCLAIMER = 'Gli anticorpi valutati da questo test sono Immunoglobuline G il cui livello può talvolta calare fino quasi a zero quando da tempo non si assuma un alimento. Chi abbia documentate allergie IgE ad alcuni alimenti o abbia avuto reazioni anafilattiche dopo avere ingerito alcuni cibi NON deve reintrodurli nel piano dietetico (anche se qui eventualmente indicati) se non sotto diretto controllo medico.';

// ─── Gene Interpretations (Depth-1 Clinical Text) ───────────────
export const GENE_INTERPRETATIONS: Record<string, { depth1Extra?: string }> = {
  PNPLA3: {
    depth1Extra: 'La variante I148M in forma omozigote indica che il tuo fegato è più sensibile nell\'elaborazione di grassi e zuccheri. Non è una malattia, ma una mappa preziosa per fare scelte più consapevoli.',
  },
};

// ─── Medical Disclaimer ─────────────────────────────────────────
export const MEDICAL_DISCLAIMER = 'Si precisa che qualsiasi indicazione qui riportata non sostituisce la indispensabile visita di un medico o il suo parere diretto necessario soprattutto in presenza di sintomi durevoli. Si ricorda che nessun tipo di integratore può sostituire gli effetti di una dieta equilibrata e sana e la pratica di attività fisica.';

// ─── Supplements Note ───────────────────────────────────────────
export const SUPPLEMENTS_NOTE = 'I nutraceutici relativi ai disturbi su cui ha chiesto un approfondimento, sono proposti come suggerimenti eventualmente utili al suo medico, al suo farmacista o al suo nutrizionista perché possano darle un possibile ulteriore supporto quando lo ritengano adeguato.';
