import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getGeminiResponse(prompt: string, systemInstruction?: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || "You are a helpful assistant that explains psychology, neuroscience, and mindfulness in Sinhala. Use clear, simple Sinhala language.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "කණගාටුයි, පිළිතුර ලබා ගැනීමේදී දෝෂයක් ඇති විය. කරුණාකර නැවත උත්සාහ කරන්න.";
  }
}
