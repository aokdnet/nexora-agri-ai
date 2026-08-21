import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { supabase } from "@/lib/supabase";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, plotId, userId } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // 1. Call Google Gemini
    // Clean up base64 string (remove data:image/jpeg;base64,)
    const base64Data = imageBase64.split(",")[1] || imageBase64;
    
    const prompt = `
      คุณคือผู้เชี่ยวชาญด้านโรคพืชและการเกษตร (AI Plant Doctor)
      กรุณาวิเคราะห์ภาพพืชนี้ว่ามีโรคหรือแมลงศัตรูพืชหรือไม่ 
      หากไม่พบความผิดปกติ ให้บอกว่า "สุขภาพดี"
      หากพบ ให้ระบุชื่อโรค และคำแนะนำในการรักษา
      
      ตอบกลับมาในรูปแบบ JSON เท่านั้น โดยมีโครงสร้างดังนี้:
      {
        "disease_name": "ชื่อโรค (หรือ 'สุขภาพดี')",
        "confidence": 95, // ตัวเลขความมั่นใจ 0-100
        "recommendation": "คำแนะนำสั้นๆ ในการรักษาหรือดูแล"
      }
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: 'image/jpeg',
                }
            }
        ],
        config: {
            responseMimeType: "application/json",
        }
    });

    const aiResultText = response.text || "{}";
    let aiResult;
    try {
        aiResult = JSON.parse(aiResultText);
    } catch (e) {
        aiResult = { disease_name: "ไม่สามารถระบุได้", confidence: 0, recommendation: "ระบบขัดข้อง กรุณาลองใหม่" };
    }

    // 2. Save to Supabase (if authenticated and plotId provided)
    // We skip image upload for speed in MVP, just save the result.
    if (userId) {
        await supabase.from("scans").insert({
            user_id: userId,
            plot_id: plotId || null,
            image_url: "base64_omitted", // We didn't upload to storage to save time
            ai_result: aiResultText,
            disease_name: aiResult.disease_name,
            confidence: aiResult.confidence
        });
    }

    return NextResponse.json(aiResult);

  } catch (err: any) {
    console.error("AI Scan Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to analyze image" },
      { status: 500 }
    );
  }
}
