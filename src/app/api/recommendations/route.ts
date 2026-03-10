import { NextRequest, NextResponse } from "next/server";
import { getRecommendations } from "@/lib/claude";
import { BiomarkerWithStatus } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { biomarkers } = (await request.json()) as { biomarkers: BiomarkerWithStatus[] };

    if (!biomarkers || biomarkers.length === 0) {
      return NextResponse.json({ error: "No biomarkers provided" }, { status: 400 });
    }

    const recommendations = await getRecommendations(biomarkers);
    return NextResponse.json({ recommendations });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate recommendations";
    console.error("Recommendations error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
