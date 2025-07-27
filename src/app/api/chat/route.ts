import { NextRequest, NextResponse } from 'next/server';
import { BigQuery } from '@google-cloud/bigquery';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { readFileSync } from "fs";
import { join } from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load Gemini API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

// Load service account
const serviceAccountPath = join(process.cwd(), "service-account-dev.json");
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));

// Initialize Firebase Admin
const app = getApps().length === 0
  ? initializeApp({ credential: cert(serviceAccount as any) })
  : getApp();
const db = getFirestore(app);
const bigquery = new BigQuery();

// Allowed Gemini models
const VALID_GEMINI_MODELS = [
  "models/gemini-1.5-pro",
  "models/gemini-1.5-pro-002",
  "models/gemini-1.5-flash",
  "models/gemini-1.5-flash-002",
  "models/gemini-1.5-flash-8b",
  "models/gemini-1.5-flash-8b-001",
  "models/gemini-2.5-pro",
  "models/gemini-2.5-flash",
  "models/gemini-2.0-flash",
  "models/gemini-2.0-flash-001",
  "models/gemini-2.0-flash-lite",
  "models/gemini-2.0-flash-lite-001",
];

export async function POST(req: NextRequest) {
  console.log("📩 /api/chat POST handler hit");

  try {
    const { client_id, message } = await req.json();

    if (!client_id || !message) {
      return NextResponse.json({ error: "Missing client_id or message" }, { status: 400 });
    }

    const doc = await db.collection("clients").doc(client_id).get();
    if (!doc.exists) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const config = doc.data();
    if (!config) {
      return NextResponse.json({ error: "Invalid client config" }, { status: 500 });
    }

    // Run BigQuery or mock
    let rows;
    if (config.bigquery_project === "fake_project") {
      rows = [
        { name: "Mock Data A", value: 1 },
        { name: "Mock Data B", value: 2 },
      ];
    } else {
      const [realRows] = await bigquery.query(
        `SELECT * FROM \`${config.bigquery_project}.${config.dataset}.${config.table}\` LIMIT 5`
      );
      rows = realRows;
    }

    // Build prompt
    const preview = JSON.stringify(rows);
    const prompt = config.prompt_template
      .replace("{data}", preview)
      .replace("{question}", message);

    // Pick valid Gemini model
    const selectedModel = VALID_GEMINI_MODELS.includes(config.llm_model)
      ? config.llm_model
      : "models/gemini-1.5-pro"; // or "models/gemini-2.5-pro" if you prefer

    // Call Gemini
    const model = genAI.getGenerativeModel({ model: selectedModel });
    const result = await model.generateContent(prompt);
    const geminiResponse = result.response;
    const text = geminiResponse.text();

    return NextResponse.json({ response: text });
  } catch (err: any) {
    console.error("❌ API /chat error:", err?.stack || err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
