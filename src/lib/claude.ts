import Anthropic from "@anthropic-ai/sdk";
import { BiomarkerWithStatus } from "@/types";

function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY environment variable is not set");
  }
  return new Anthropic({ apiKey });
}

export async function getRecommendations(biomarkers: BiomarkerWithStatus[]): Promise<string> {
  const client = getClient();

  const abnormal = biomarkers.filter((b) => b.status !== "optimal");
  if (abnormal.length === 0) {
    return "All your biomarkers are within optimal range. Keep up your current healthy lifestyle!";
  }

  const summary = abnormal
    .map((b) => `- ${b.name}: ${b.value} ${b.unit} (${b.status}, optimal: ${b.range.optimalLow}-${b.range.optimalHigh} ${b.unit})`)
    .join("\n");

  const message = await client.messages.create({
    model: "claude-sonnet-4-5-20250514",
    max_tokens: 1500,
    messages: [
      {
        role: "user",
        content: `You are a nutritional health advisor. Based on the following blood test results that are outside optimal range, provide personalized nutritional recommendations.

For each biomarker, suggest:
1. Specific foods to eat more of (or avoid)
2. Any supplements worth considering
3. Lifestyle changes

Blood results outside optimal range:
${summary}

Format your response in clear sections with markdown. Be specific with food recommendations. Include a disclaimer that this is not medical advice.`,
      },
    ],
  });

  const block = message.content[0];
  return block.type === "text" ? block.text : "Unable to generate recommendations.";
}

export async function generateRecipe(
  biomarkers: BiomarkerWithStatus[],
  preferences: string
): Promise<string> {
  const client = getClient();

  const abnormal = biomarkers.filter((b) => b.status !== "optimal");
  const summary = abnormal
    .map((b) => `- ${b.name}: ${b.value} ${b.unit} (${b.status})`)
    .join("\n");

  const message = await client.messages.create({
    model: "claude-sonnet-4-5-20250514",
    max_tokens: 1500,
    messages: [
      {
        role: "user",
        content: `You are a nutritional chef who creates meals optimized for specific health goals.

Based on these blood test results that need improvement:
${summary || "All biomarkers are optimal - create a generally healthy recipe."}

User preferences/dietary restrictions: ${preferences || "None specified"}

Create a detailed recipe that targets improving these biomarkers. Include:
1. Recipe title
2. Why this recipe helps (which biomarkers it targets)
3. Full ingredient list with amounts
4. Step-by-step cooking instructions
5. Nutritional highlights

Format with markdown.`,
      },
    ],
  });

  const block = message.content[0];
  return block.type === "text" ? block.text : "Unable to generate recipe.";
}

export async function parsePdfWithAI(text: string): Promise<string> {
  const client = getClient();

  const message = await client.messages.create({
    model: "claude-sonnet-4-5-20250514",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `Extract blood test biomarker results from this lab report text. Return a JSON array where each item has:
- "name": the biomarker name (use standard names like "Total Cholesterol", "LDL Cholesterol", "HDL Cholesterol", "Triglycerides", "Glucose (Fasting)", "HbA1c", "Hemoglobin", "White Blood Cells", "Platelets", "Red Blood Cells", "ALT", "AST", "Bilirubin", "Creatinine", "BUN", "eGFR", "TSH", "Free T4", "Free T3", "Vitamin D", "Vitamin B12", "Folate", "Iron", "Ferritin", "Magnesium", "Calcium", "CRP (hs)", "ESR", "Testosterone", "Cortisol", "Insulin (Fasting)")
- "value": the numeric value
- "unit": the unit of measurement

Only include biomarkers you can confidently identify. Return ONLY the JSON array, no other text.

Lab report text:
${text}`,
      },
    ],
  });

  const block = message.content[0];
  return block.type === "text" ? block.text : "[]";
}
