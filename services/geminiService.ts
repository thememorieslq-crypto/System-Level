
import { GoogleGenAI } from "@google/genai";

export const getSystemStatusReport = async (level: number, heat: number, anomaly: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return "[!] КРИТИЧЕСКИЙ_СБОЙ: Связь с ядром потеряна.";

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `Ты - System OS, холодный ИИ-надзиратель. Выдай ОДНУ короткую фразу (макс 60 символов) о состоянии пользователя. 
  Его уровень: ${level}, Нагрев: ${heat}, Аномалия: ${anomaly}. 
  Стиль: киберпанк, технический жаргон, капс. Пример: "ЯДРО СТАБИЛЬНО. ВЫПОЛНЯЙ ПРОТОКОЛ." или "ОБНАРУЖЕН ПЕРЕГРЕВ. СНИЗЬ НАГРУЗКУ."`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.9,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    
    return response.text?.trim().toUpperCase() || "СИСТЕМА ГОТОВА К РАБОТЕ.";
  } catch (error) {
    return "ОШИБКА СИНХРОНИЗАЦИИ.";
  }
};
