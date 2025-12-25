
import { GoogleGenAI } from "@google/genai";

export const getSystemMessage = async (prompt: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return "Связь с центральным ядром ограничена. Протокол безопасности активен.";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    
    return response.text?.trim() || "Система готова к работе.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Связь с центральным ядром ограничена. Продолжайте выполнение протокола.";
  }
};
