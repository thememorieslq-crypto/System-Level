
export enum ExerciseType {
  PushUps = 'Отжимания',
  Squats = 'Приседания',
  Plank = 'Планка'
}

export interface Quest {
  id: string;
  type: ExerciseType;
  target: number; 
  xp: number;
  completed: boolean;
  isDebt?: boolean;
  cycleOffset?: number;
}

export interface UserState {
  level: number;
  xp: number;
  totalXp: number;
  streak: number;
  calendarDay: number; // Реальный счетчик дней, не зависящий от стрика
  lastActiveDate: string | null;
  quests: Quest[];
  hasInitialized: boolean;
  debtQuests: Quest[];
  penaltyActive: boolean;
  showLevelUp: boolean;
  consecutiveMisses: number;
  currentCycleDay: number;
}
