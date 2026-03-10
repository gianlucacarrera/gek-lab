import { NextRequest, NextResponse } from "next/server";
import pdf from "pdf-parse";
import { parsePdfWithAI } from "@/lib/claude";
import { BIOMARKER_RANGES } from "@/lib/biomarkers";
import { BiomarkerResult } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const data = await pdf(buffer);
    const text = data.text;

    if (!text.trim()) {
      return NextResponse.json({ error: "Could not extract text from PDF" }, { status: 400 });
    }

    const jsonStr = await parsePdfWithAI(text);

    let parsed: Array<{ name: string; value: number; unit: string }>;
    try {
      const cleaned = jsonStr.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: "Failed to parse biomarker data from PDF" }, { status: 422 });
    }

    const biomarkers: BiomarkerResult[] = parsed
      .filter((item) => BIOMARKER_RANGES[item.name] && typeof item.value === "number")
      .map((item, i) => ({
        id: `pdf-${i}`,
        name: item.name,
        value: item.value,
        unit: item.unit || BIOMARKER_RANGES[item.name].unit,
        category: BIOMARKER_RANGES[item.name].category,
      }));

    return NextResponse.json({ biomarkers, rawText: text.substring(0, 500) });
  } catch (error) {
    console.error("PDF parsing error:", error);
    return NextResponse.json(
      { error: "Failed to process PDF file" },
      { status: 500 }
    );
  }
}
