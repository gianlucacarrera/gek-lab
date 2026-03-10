export interface BiomarkerResult {
  id: string;
  name: string;
  value: number;
  unit: string;
  category: BiomarkerCategory;
}

export type BiomarkerCategory =
  | "lipids"
  | "metabolic"
  | "blood_count"
  | "liver"
  | "kidney"
  | "thyroid"
  | "vitamins"
  | "minerals"
  | "inflammation"
  | "hormones";

export type RangeStatus = "low" | "optimal" | "borderline" | "high";

export interface BiomarkerRange {
  low: number;
  optimalLow: number;
  optimalHigh: number;
  high: number;
  unit: string;
  category: BiomarkerCategory;
  description: string;
}

export interface BiomarkerWithStatus extends BiomarkerResult {
  status: RangeStatus;
  range: BiomarkerRange;
}

export interface LabReport {
  id: string;
  date: string;
  biomarkers: BiomarkerResult[];
}

export interface NutritionRecommendation {
  biomarker: string;
  status: RangeStatus;
  foods: string[];
  supplements: string[];
  advice: string;
}

export interface Recipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  targetBiomarkers: string[];
}
