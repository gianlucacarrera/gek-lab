"use client";

import { useState } from "react";
import { BiomarkerResult, BiomarkerCategory } from "@/types";
import { BIOMARKER_RANGES, CATEGORY_LABELS, ALL_BIOMARKER_NAMES } from "@/lib/biomarkers";

interface Props {
  onSubmit: (results: BiomarkerResult[]) => void;
  existingResults: BiomarkerResult[];
}

export default function LabResultForm({ onSubmit, existingResults }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<BiomarkerCategory>("lipids");
  const [results, setResults] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    existingResults.forEach((r) => {
      initial[r.name] = String(r.value);
    });
    return initial;
  });

  const categories = [...new Set(Object.values(BIOMARKER_RANGES).map((r) => r.category))];
  const filteredBiomarkers = ALL_BIOMARKER_NAMES.filter(
    (name) => BIOMARKER_RANGES[name].category === selectedCategory
  );

  function handleChange(name: string, value: string) {
    setResults((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const biomarkers: BiomarkerResult[] = Object.entries(results)
      .filter(([, val]) => val !== "" && !isNaN(Number(val)))
      .map(([name, val], i) => ({
        id: `manual-${i}`,
        name,
        value: parseFloat(val),
        unit: BIOMARKER_RANGES[name].unit,
        category: BIOMARKER_RANGES[name].category,
      }));
    onSubmit(biomarkers);
  }

  const filledCount = Object.values(results).filter((v) => v !== "" && !isNaN(Number(v))).length;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-1.5">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              selectedCategory === cat
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Biomarker inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredBiomarkers.map((name) => {
          const range = BIOMARKER_RANGES[name];
          return (
            <div key={name} className="flex items-center gap-2">
              <label className="flex-1 min-w-0">
                <span className="text-sm font-medium text-gray-700 truncate block">{name}</span>
                <div className="flex items-center gap-1 mt-1">
                  <input
                    type="number"
                    step="any"
                    placeholder={`${range.optimalLow} - ${range.optimalHigh}`}
                    value={results[name] || ""}
                    onChange={(e) => handleChange(name, e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                  <span className="text-xs text-gray-400 w-16 text-right shrink-0">{range.unit}</span>
                </div>
              </label>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-2">
        <span className="text-sm text-gray-500">{filledCount} biomarkers entered</span>
        <button
          type="submit"
          disabled={filledCount === 0}
          className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Analyze Results
        </button>
      </div>
    </form>
  );
}
