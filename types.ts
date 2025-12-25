
export enum ExerciseType {
  PushUps = 'Отжимания',
  DiamondPushUps = 'Алмазные отжимания',
  Squats = 'Приседания',
  Lunges = 'Выпады',
  Plank = 'Планка',
  Crunches = 'Скручивания'
}

export enum ExerciseCategory {
  PUSH = 'PUSH',
  LEGS = 'LEGS',
  CORE = 'CORE'
}

export type Archetype = 'TITAN' | 'STRIKER' | 'SPECTRE';
export type AnomalyType = 'NEURAL_SURGE' | 'GRAVITY_LEAK' | 'STABLE_CORE' | 'NONE';

export interface Augmentation {
  id: string;
  name: string;
  desc: string;
  cost: number;
  type: 'BUFF' | 'UTILITY';
  value: number;
}

export interface HistoryEntry {
  day: number;
  date: string;
  totalXp: number;
  level: number;
}

export interface Quest {
  id: string;
  type: ExerciseType;
  category: ExerciseCategory;
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
  calendarDay: number;
  lastActiveDate: string | null;
  quests: Quest[];
  hasInitialized: boolean;
  debtQuests: Quest[];
  penaltyActive: boolean;
  showLevelUp: boolean;
  consecutiveMisses: number;
  currentCycleDay: number;
  archetype?: Archetype;
  history: HistoryEntry[];
  hardcoreActive: boolean;
  heatLevel: number;
  dailyAnomaly?: AnomalyType;
  neuralSync: number;
  coreFragments: number;
  activeAugmentations: {
    xpMultiplier: number;
    targetMultiplier: number;
  };
}
