import { NextRequest, NextResponse } from "next/server";
import { generateRecipe } from "@/lib/claude";
import { BiomarkerWithStatus } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { biomarkers, preferences } = (await request.json()) as {
      biomarkers: BiomarkerWithStatus[];
      preferences: string;
    };

    if (!biomarkers || biomarkers.length === 0) {
      return NextResponse.json({ error: "No biomarkers provided" }, { status: 400 });
    }

    const recipe = await generateRecipe(biomarkers, preferences);
    return NextResponse.json({ recipe });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate recipe";
    console.error("Recipe error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
