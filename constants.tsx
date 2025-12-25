
import { ExerciseType, ExerciseCategory } from './types';

export const EXERCISE_DATA = {
  [ExerciseType.PushUps]: { base: 5, coeff: 1, xp: 20, category: ExerciseCategory.PUSH },
  [ExerciseType.DiamondPushUps]: { base: 3, coeff: 1.2, xp: 25, category: ExerciseCategory.PUSH },
  [ExerciseType.Squats]: { base: 10, coeff: 2, xp: 20, category: ExerciseCategory.LEGS },
  [ExerciseType.Lunges]: { base: 8, coeff: 1.5, xp: 22, category: ExerciseCategory.LEGS },
  [ExerciseType.Plank]: { base: 15, coeff: 5, xp: 25, category: ExerciseCategory.CORE },
  [ExerciseType.Crunches]: { base: 12, coeff: 2.5, xp: 22, category: ExerciseCategory.CORE },
};

export const BASE_XP = {
  [ExerciseType.PushUps]: 20,
  [ExerciseType.DiamondPushUps]: 25,
  [ExerciseType.Squats]: 20,
  [ExerciseType.Lunges]: 22,
  [ExerciseType.Plank]: 25,
  [ExerciseType.Crunches]: 22,
};

export const BASE_LOAD = {
  [ExerciseType.PushUps]: 5,
  [ExerciseType.DiamondPushUps]: 3,
  [ExerciseType.Squats]: 10,
  [ExerciseType.Lunges]: 8,
  [ExerciseType.Plank]: 15,
  [ExerciseType.Crunches]: 12,
};

export const LEVEL_COEFFICIENTS = {
  [ExerciseType.PushUps]: 1,
  [ExerciseType.DiamondPushUps]: 1.2,
  [ExerciseType.Squats]: 2,
  [ExerciseType.Lunges]: 1.5,
  [ExerciseType.Plank]: 5,
  [ExerciseType.Crunches]: 2.5,
};

export const ARCHETYPE_MAP = {
  TITAN: ExerciseCategory.LEGS,
  STRIKER: ExerciseCategory.PUSH,
  SPECTRE: ExerciseCategory.CORE
};

export const COLORS = {
  primary: '#0E1015',
  secondary: '#141824',
  card: '#1A1F2E',
  accent: '#5B8CFF',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  muted: '#6B7280',
};

export const SYSTEM_VOICE_MODES = {
  GREETING: "SYSTEM_OS: Идентификация завершена. Дневной цикл активен. Жду действий.",
  CONGRATS: "ЦЕЛЬ_ДОСТИГНУТА: Награда зачислена в реестр.",
  PENALTY: "ВНИМАНИЕ: Зафиксировано отклонение от протокола. Долговые обязательства обновлены.",
  PARTIAL: "ВНИМАНИЕ: Выполнение ниже оптимального. Система сохраняет статус-кво.",
};
