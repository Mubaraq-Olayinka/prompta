// app/api/list-models/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing GOOGLE_GEMINI_API_KEY" }, { status: 500 });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
    );
    const data = await response.json();

    if (data.error) {
      console.error("❌ Gemini API Error:", data.error);
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    return NextResponse.json({
      models: data.models?.map((model: any) => ({
        name: model.name,
        description: model.description,
        generationMethods: model.supportedGenerationMethods,
      })) || [],
    });
  } catch (error: any) {
    console.error("❌ Fetch error:", error?.message || error);
    return NextResponse.json({ error: "Failed to fetch models" }, { status: 500 });
  }
}
