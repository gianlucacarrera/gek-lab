import { BiomarkerRange, BiomarkerResult, BiomarkerWithStatus, RangeStatus } from "@/types";

export const BIOMARKER_RANGES: Record<string, BiomarkerRange> = {
  // Lipids
  "Total Cholesterol": {
    low: 0, optimalLow: 125, optimalHigh: 200, high: 240,
    unit: "mg/dL", category: "lipids",
    description: "Total amount of cholesterol in blood",
  },
  "LDL Cholesterol": {
    low: 0, optimalLow: 0, optimalHigh: 100, high: 160,
    unit: "mg/dL", category: "lipids",
    description: "Low-density lipoprotein, often called 'bad' cholesterol",
  },
  "HDL Cholesterol": {
    low: 40, optimalLow: 50, optimalHigh: 90, high: 999,
    unit: "mg/dL", category: "lipids",
    description: "High-density lipoprotein, often called 'good' cholesterol",
  },
  "Triglycerides": {
    low: 0, optimalLow: 0, optimalHigh: 150, high: 200,
    unit: "mg/dL", category: "lipids",
    description: "Type of fat found in blood",
  },

  // Metabolic
  "Glucose (Fasting)": {
    low: 60, optimalLow: 70, optimalHigh: 100, high: 126,
    unit: "mg/dL", category: "metabolic",
    description: "Blood sugar level after fasting",
  },
  "HbA1c": {
    low: 0, optimalLow: 4.0, optimalHigh: 5.7, high: 6.5,
    unit: "%", category: "metabolic",
    description: "Average blood sugar over 2-3 months",
  },
  "Insulin (Fasting)": {
    low: 0, optimalLow: 2.0, optimalHigh: 19.6, high: 25,
    unit: "µIU/mL", category: "metabolic",
    description: "Hormone that regulates blood sugar",
  },

  // Blood Count
  "Hemoglobin": {
    low: 11.5, optimalLow: 12.0, optimalHigh: 17.5, high: 20,
    unit: "g/dL", category: "blood_count",
    description: "Protein in red blood cells that carries oxygen",
  },
  "White Blood Cells": {
    low: 3.5, optimalLow: 4.5, optimalHigh: 11.0, high: 15,
    unit: "K/µL", category: "blood_count",
    description: "Cells that fight infection",
  },
  "Platelets": {
    low: 100, optimalLow: 150, optimalHigh: 400, high: 500,
    unit: "K/µL", category: "blood_count",
    description: "Cells involved in blood clotting",
  },
  "Red Blood Cells": {
    low: 3.5, optimalLow: 4.0, optimalHigh: 5.5, high: 6.5,
    unit: "M/µL", category: "blood_count",
    description: "Cells that carry oxygen throughout the body",
  },

  // Liver
  "ALT": {
    low: 0, optimalLow: 7, optimalHigh: 35, high: 56,
    unit: "U/L", category: "liver",
    description: "Alanine aminotransferase, liver enzyme",
  },
  "AST": {
    low: 0, optimalLow: 10, optimalHigh: 35, high: 50,
    unit: "U/L", category: "liver",
    description: "Aspartate aminotransferase, liver enzyme",
  },
  "Bilirubin": {
    low: 0, optimalLow: 0.1, optimalHigh: 1.2, high: 2.0,
    unit: "mg/dL", category: "liver",
    description: "Waste product from red blood cell breakdown",
  },

  // Kidney
  "Creatinine": {
    low: 0.4, optimalLow: 0.6, optimalHigh: 1.2, high: 1.5,
    unit: "mg/dL", category: "kidney",
    description: "Waste product from muscle metabolism",
  },
  "BUN": {
    low: 5, optimalLow: 7, optimalHigh: 20, high: 25,
    unit: "mg/dL", category: "kidney",
    description: "Blood urea nitrogen, kidney function marker",
  },
  "eGFR": {
    low: 60, optimalLow: 90, optimalHigh: 120, high: 999,
    unit: "mL/min", category: "kidney",
    description: "Estimated glomerular filtration rate",
  },

  // Thyroid
  "TSH": {
    low: 0.3, optimalLow: 0.4, optimalHigh: 4.0, high: 5.5,
    unit: "mIU/L", category: "thyroid",
    description: "Thyroid stimulating hormone",
  },
  "Free T4": {
    low: 0.7, optimalLow: 0.8, optimalHigh: 1.8, high: 2.5,
    unit: "ng/dL", category: "thyroid",
    description: "Active thyroid hormone",
  },
  "Free T3": {
    low: 1.8, optimalLow: 2.3, optimalHigh: 4.2, high: 5.0,
    unit: "pg/mL", category: "thyroid",
    description: "Most active thyroid hormone",
  },

  // Vitamins
  "Vitamin D": {
    low: 20, optimalLow: 30, optimalHigh: 80, high: 100,
    unit: "ng/mL", category: "vitamins",
    description: "Essential for bone health and immune function",
  },
  "Vitamin B12": {
    low: 200, optimalLow: 300, optimalHigh: 900, high: 1500,
    unit: "pg/mL", category: "vitamins",
    description: "Essential for nerve function and blood cell formation",
  },
  "Folate": {
    low: 2, optimalLow: 3, optimalHigh: 20, high: 30,
    unit: "ng/mL", category: "vitamins",
    description: "B vitamin important for cell growth",
  },

  // Minerals
  "Iron": {
    low: 30, optimalLow: 60, optimalHigh: 170, high: 200,
    unit: "µg/dL", category: "minerals",
    description: "Essential mineral for blood oxygen transport",
  },
  "Ferritin": {
    low: 12, optimalLow: 30, optimalHigh: 300, high: 500,
    unit: "ng/mL", category: "minerals",
    description: "Stored iron levels",
  },
  "Magnesium": {
    low: 1.3, optimalLow: 1.7, optimalHigh: 2.2, high: 2.6,
    unit: "mg/dL", category: "minerals",
    description: "Essential for muscle and nerve function",
  },
  "Calcium": {
    low: 8.0, optimalLow: 8.5, optimalHigh: 10.5, high: 11.5,
    unit: "mg/dL", category: "minerals",
    description: "Essential for bones, muscles, and nerve function",
  },

  // Inflammation
  "CRP (hs)": {
    low: 0, optimalLow: 0, optimalHigh: 1.0, high: 3.0,
    unit: "mg/L", category: "inflammation",
    description: "High-sensitivity C-reactive protein, inflammation marker",
  },
  "ESR": {
    low: 0, optimalLow: 0, optimalHigh: 20, high: 40,
    unit: "mm/hr", category: "inflammation",
    description: "Erythrocyte sedimentation rate, inflammation marker",
  },

  // Hormones
  "Testosterone": {
    low: 200, optimalLow: 300, optimalHigh: 1000, high: 1200,
    unit: "ng/dL", category: "hormones",
    description: "Primary male sex hormone",
  },
  "Cortisol": {
    low: 3, optimalLow: 6, optimalHigh: 18, high: 25,
    unit: "µg/dL", category: "hormones",
    description: "Stress hormone produced by adrenal glands",
  },
};

export function getStatus(value: number, range: BiomarkerRange): RangeStatus {
  if (value < range.low) return "low";
  if (value < range.optimalLow) return "borderline";
  if (value <= range.optimalHigh) return "optimal";
  if (value <= range.high) return "borderline";
  return "high";
}

export function enrichBiomarkers(biomarkers: BiomarkerResult[]): BiomarkerWithStatus[] {
  return biomarkers
    .filter((b) => BIOMARKER_RANGES[b.name])
    .map((b) => {
      const range = BIOMARKER_RANGES[b.name];
      return {
        ...b,
        status: getStatus(b.value, range),
        range,
      };
    });
}

export const CATEGORY_LABELS: Record<string, string> = {
  lipids: "Lipid Panel",
  metabolic: "Metabolic Panel",
  blood_count: "Blood Count (CBC)",
  liver: "Liver Function",
  kidney: "Kidney Function",
  thyroid: "Thyroid Panel",
  vitamins: "Vitamins",
  minerals: "Minerals",
  inflammation: "Inflammation Markers",
  hormones: "Hormones",
};

export const STATUS_COLORS: Record<RangeStatus, { bg: string; text: string; bar: string }> = {
  low: { bg: "bg-blue-100", text: "text-blue-800", bar: "bg-blue-500" },
  optimal: { bg: "bg-green-100", text: "text-green-800", bar: "bg-green-500" },
  borderline: { bg: "bg-yellow-100", text: "text-yellow-800", bar: "bg-yellow-500" },
  high: { bg: "bg-red-100", text: "text-red-800", bar: "bg-red-500" },
};

export const ALL_BIOMARKER_NAMES = Object.keys(BIOMARKER_RANGES);
