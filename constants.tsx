
import { ExerciseType } from './types';

export const BASE_XP = {
  [ExerciseType.PushUps]: 20,
  [ExerciseType.Squats]: 20,
  [ExerciseType.Plank]: 25,
};

export const BASE_LOAD = {
  [ExerciseType.PushUps]: 5,
  [ExerciseType.Squats]: 10,
  [ExerciseType.Plank]: 15,
};

export const LEVEL_COEFFICIENTS = {
  [ExerciseType.PushUps]: 1,
  [ExerciseType.Squats]: 2,
  [ExerciseType.Plank]: 5,
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
