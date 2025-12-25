
import { ExerciseType, Quest } from '../types';
import { BASE_LOAD, LEVEL_COEFFICIENTS, BASE_XP } from '../constants';

// Формула для соответствия скриншоту: 100 * level * (1.2 ^ level)
// Уровень 1: 100 * 1 * 1.2 = 120
// Уровень 2: 100 * 2 * 1.44 = 288
export const getXpRequired = (level: number) => Math.floor(100 * level * Math.pow(1.2, level));

export const calculateLoad = (type: ExerciseType, level: number, streak: number = 0, penaltyFactor: number = 1, cycleOffset: number = 0) => {
  const base = BASE_LOAD[type];
  const coeff = LEVEL_COEFFICIENTS[type];
  
  // Базовая сложность от уровня
  const baseDifficulty = base + (level * coeff);
  
  // Прогрессивное усложнение: +2% за каждый день стрика
  const streakBonus = 1 + Math.min(streak * 0.02, 0.5);
  
  // Дополнительная сложность за каждый день "взлома" вперед (+10% за каждый следующий день)
  const cycleBonus = 1 + (cycleOffset * 0.1);
  
  const calculated = baseDifficulty * streakBonus * penaltyFactor * cycleBonus;
  return Math.round(calculated);
};

export const generateQuestsForDay = (level: number, streak: number = 0, penaltyFactor: number = 1, cycleOffset: number = 0): Quest[] => {
  const types = Object.values(ExerciseType);
  return types.map((type) => ({
    id: Math.random().toString(36).substr(2, 9),
    type,
    target: calculateLoad(type, level, streak, penaltyFactor, cycleOffset),
    xp: BASE_XP[type] + Math.floor(streak / 2) + (cycleOffset * 5), // Больше XP за будущие дни
    completed: false,
    cycleOffset: cycleOffset
  }));
};

export const checkDateDiff = (date1: string, date2: string) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
