"use client";

import { useState } from "react";
import { BiomarkerResult, BiomarkerWithStatus, BiomarkerCategory } from "@/types";
import { enrichBiomarkers, CATEGORY_LABELS, STATUS_COLORS } from "@/lib/biomarkers";
import BiomarkerCard from "./BiomarkerCard";
import LabResultForm from "./LabResultForm";
import PdfUpload from "./PdfUpload";
import Recommendations from "./Recommendations";
import RecipeGenerator from "./RecipeGenerator";

type Tab = "input" | "dashboard" | "recommendations" | "recipes";

export default function Dashboard() {
  const [rawResults, setRawResults] = useState<BiomarkerResult[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("input");
  const [categoryFilter, setCategoryFilter] = useState<BiomarkerCategory | "all">("all");

  const enriched = enrichBiomarkers(rawResults);

  function handleResults(results: BiomarkerResult[]) {
    setRawResults(results);
    if (results.length > 0) setActiveTab("dashboard");
  }

  function handlePdfResults(results: BiomarkerResult[]) {
    setRawResults((prev) => {
      const existingNames = new Set(results.map((r) => r.name));
      const kept = prev.filter((r) => !existingNames.has(r.name));
      return [...kept, ...results];
    });
    if (results.length > 0) setActiveTab("dashboard");
  }

  const filtered =
    categoryFilter === "all"
      ? enriched
      : enriched.filter((b) => b.category === categoryFilter);

  const categories = [...new Set(enriched.map((b) => b.category))];

  const statusCounts = {
    optimal: enriched.filter((b) => b.status === "optimal").length,
    borderline: enriched.filter((b) => b.status === "borderline").length,
    low: enriched.filter((b) => b.status === "low").length,
    high: enriched.filter((b) => b.status === "high").length,
  };

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "input", label: "Lab Input" },
    { id: "dashboard", label: "Dashboard", count: enriched.length },
    { id: "recommendations", label: "Nutrition AI" },
    { id: "recipes", label: "Recipe AI" },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">GekLab</h1>
                <p className="text-xs text-gray-500">Blood Analysis Dashboard</p>
              </div>
            </div>
            {enriched.length > 0 && (
              <div className="flex gap-3">
                {(Object.entries(statusCounts) as [string, number][])
                  .filter(([, count]) => count > 0)
                  .map(([status, count]) => {
                    const colors = STATUS_COLORS[status as keyof typeof STATUS_COLORS];
                    return (
                      <div key={status} className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                        {count} {status}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Tabs */}
          <nav className="flex gap-1 mt-4 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-indigo-600 text-indigo-600 bg-indigo-50/50"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === "input" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Upload Lab Report (PDF)</h2>
              <PdfUpload onResults={handlePdfResults} />
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Manual Entry</h2>
              <LabResultForm onSubmit={handleResults} existingResults={rawResults} />
            </div>
          </div>
        )}

        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {enriched.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <p className="text-lg">No biomarkers entered yet</p>
                <p className="text-sm mt-1">Go to Lab Input to add your results</p>
              </div>
            ) : (
              <>
                {/* Category filter */}
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setCategoryFilter("all")}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      categoryFilter === "all"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    All ({enriched.length})
                  </button>
                  {categories.map((cat) => {
                    const count = enriched.filter((b) => b.category === cat).length;
                    return (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                          categoryFilter === cat
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {CATEGORY_LABELS[cat]} ({count})
                      </button>
                    );
                  })}
                </div>

                {/* Biomarker cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.map((biomarker) => (
                    <BiomarkerCard key={biomarker.name} biomarker={biomarker} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "recommendations" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {enriched.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>Enter your lab results first to get recommendations</p>
              </div>
            ) : (
              <Recommendations biomarkers={enriched} />
            )}
          </div>
        )}

        {activeTab === "recipes" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {enriched.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>Enter your lab results first to generate recipes</p>
              </div>
            ) : (
              <RecipeGenerator biomarkers={enriched} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
