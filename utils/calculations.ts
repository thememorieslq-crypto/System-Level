
import { ExerciseType, ExerciseCategory, Quest, AnomalyType } from '../types';
import { EXERCISE_DATA } from '../constants';

export const getXpRequired = (level: number) => Math.floor(100 * level * Math.pow(1.2, level));

export const calculateLoad = (
    type: ExerciseType, 
    level: number, 
    streak: number = 0, 
    penaltyFactor: number = 1, 
    cycleOffset: number = 0, 
    isHardcore: boolean = false, 
    targetModifier: number = 1,
    anomaly?: AnomalyType
) => {
  const data = EXERCISE_DATA[type];
  const base = data.base;
  const coeff = data.coeff;
  
  let anomalyMod = 1.0;
  if (anomaly === 'GRAVITY_LEAK') anomalyMod = 1.15;

  const baseDifficulty = base + (level * coeff);
  const streakBonus = 1 + Math.min(streak * 0.02, 0.5);
  const cycleBonus = 1 + (cycleOffset * 0.1);
  const hardcoreBonus = isHardcore ? 1.25 : 1.0;
  
  const calculated = baseDifficulty * streakBonus * penaltyFactor * cycleBonus * hardcoreBonus * targetModifier * anomalyMod;
  return Math.round(calculated);
};

export const generateQuestsForDay = (
  level: number, 
  streak: number = 0, 
  penaltyFactor: number = 1, 
  cycleOffset: number = 0, 
  isHardcore: boolean = false, 
  heatLevel: number = 0,
  xpModifier: number = 1,
  targetModifier: number = 1,
  anomaly: AnomalyType = 'NONE'
): Quest[] => {
  const categories = [ExerciseCategory.PUSH, ExerciseCategory.LEGS, ExerciseCategory.CORE];
  const allExercises = Object.entries(EXERCISE_DATA);

  return categories.map((cat) => {
    const candidates = allExercises.filter(([_, data]) => data.category === cat);
    const [typeStr, data] = candidates[Math.floor(Math.random() * candidates.length)];
    const type = typeStr as ExerciseType;

    const target = calculateLoad(type, level, streak, penaltyFactor, cycleOffset, isHardcore, targetModifier, anomaly);
    let xpBase = data.xp + Math.floor(streak / 2) + (cycleOffset * 5);
    
    if (isHardcore) xpBase = Math.round(xpBase * 1.5);
    if (anomaly === 'NEURAL_SURGE') xpBase = Math.round(xpBase * 1.2);

    xpBase = Math.round(xpBase * xpModifier);

    const heatPenalty = Math.max(0.1, 1 - (Math.max(0, heatLevel - 1) * 0.15));
    xpBase = Math.round(xpBase * heatPenalty);

    return {
      id: Math.random().toString(36).substr(2, 9),
      type,
      category: cat,
      target,
      xp: xpBase,
      completed: false,
      cycleOffset: cycleOffset
    };
  });
};
