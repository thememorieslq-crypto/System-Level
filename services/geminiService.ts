
import { GoogleGenAI } from "@google/genai";

export const getSystemMessage = async (prompt: string): Promise<string> => {
  // Creating instance right before call as per performance and key-selection rules.
  // Using the exact pattern required by instructions.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    
    // response.text is a property, not a method.
    return response.text?.trim() || "Система готова к работе.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Связь с центральным ядром ограничена. Продолжайте выполнение протокола.";
  }
};
