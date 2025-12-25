
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { UserState, ExerciseType, Quest, Archetype, ExerciseCategory, AnomalyType } from './types.ts';
import { generateQuestsForDay, getXpRequired } from './utils/calculations.ts';
import { Dashboard } from './components/Dashboard.tsx';
import { QuestScreen } from './components/QuestScreen.tsx';
import { Profile } from './components/Profile.tsx';
import { SplashScreen } from './components/SplashScreen.tsx';
import { LevelUpOverlay } from './components/LevelUpOverlay.tsx';
import { DayCompleteOverlay } from './components/DayCompleteOverlay.tsx';
import { Layout } from './components/Layout.tsx';
import { Onboarding } from './components/Onboarding.tsx';
import { ClassSelectionOverlay } from './components/ClassSelectionOverlay.tsx';
import { ARCHETYPE_MAP } from './constants.tsx';

const STORAGE_KEY = 'system_level_up_v9_final';

const ANOMALIES: AnomalyType[] = ['NEURAL_SURGE', 'GRAVITY_LEAK', 'STABLE_CORE', 'NONE'];

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'system' | 'profile'>('system');
  const [currentQuest, setCurrentQuest] = useState<Quest | null>(null);
  
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showDayComplete, setShowDayComplete] = useState(false);
  const [pendingDayComplete, setPendingDayComplete] = useState(false);
  const [lastBonus, setLastBonus] = useState(0);
  
  const [user, setUser] = useState<UserState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return {
      level: 1,
      xp: 0,
      totalXp: 0,
      streak: 0,
      calendarDay: 1,
      lastActiveDate: null,
      quests: [],
      hasInitialized: false,
      debtQuests: [],
      penaltyActive: false,
      showLevelUp: false,
      consecutiveMisses: 0,
      currentCycleDay: 1,
      history: [],
      hardcoreActive: false,
      heatLevel: 0,
      dailyAnomaly: 'NONE',
      neuralSync: 100,
      coreFragments: 0
    };
  });

  const themeColor = useMemo(() => {
    if (user.archetype === 'TITAN') return '#5B8CFF';
    if (user.archetype === 'STRIKER') return '#EF4444';
    if (user.archetype === 'SPECTRE') return '#10B981';
    return '#5B8CFF';
  }, [user.archetype]);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', themeColor);
  }, [themeColor]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  const checkDailyRefresh = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    if (user.lastActiveDate === today) return;

    setUser(prev => {
        const newHistoryEntry = {
            day: prev.calendarDay,
            date: prev.lastActiveDate || today,
            totalXp: prev.totalXp,
            level: prev.level
        };

        const randomAnomaly = ANOMALIES[Math.floor(Math.random() * ANOMALIES.length)];
        const loadModifier = prev.penaltyActive ? 1.15 : 1.0;
        const cooledHeat = Math.max(0, prev.heatLevel - 1);

        return {
            ...prev,
            calendarDay: prev.calendarDay + 1,
            lastActiveDate: today,
            heatLevel: cooledHeat, 
            dailyAnomaly: randomAnomaly,
            quests: generateQuestsForDay(prev.level, prev.streak, loadModifier, prev.currentCycleDay - 1, prev.hardcoreActive, cooledHeat, 1, 1, randomAnomaly),
            history: [...prev.history, newHistoryEntry].slice(-30)
        };
    });
  }, [user.lastActiveDate]);

  useEffect(() => {
    const checkInterval = setInterval(() => {
        if (user.hasInitialized) checkDailyRefresh();
    }, 60000);
    
    const initialTimer = setTimeout(() => {
      setLoading(false);
      if (user.hasInitialized) checkDailyRefresh();
    }, 1500);

    return () => {
        clearInterval(checkInterval);
        clearTimeout(initialTimer);
    };
  }, [user.hasInitialized, checkDailyRefresh]);

  const handleInitialize = () => {
    const today = new Date().toISOString().split('T')[0];
    setUser(prev => ({ 
      ...prev, 
      hasInitialized: true, 
      lastActiveDate: today, 
      calendarDay: 1,
      currentCycleDay: 1,
      dailyAnomaly: 'NONE',
      quests: generateQuestsForDay(1, 0, 1, 0, false, 0),
      neuralSync: 100,
      coreFragments: 0
    }));
  };

  const handleOverrideLock = (mode: 'RECOVERY' | 'STABLE' | 'OVERLOAD' | 'FORCE' | 'SAFE') => {
    setUser(prev => {
        const nextCycle = prev.currentCycleDay + 1;
        let heatAdd = 1;
        let syncPenalty = 0;
        let xpMod = 1;
        let targetMod = 1;

        if (mode === 'RECOVERY') { heatAdd = 0.5; targetMod = 0.7; xpMod = 0.5; }
        if (mode === 'OVERLOAD') { heatAdd = 2; targetMod = 1.3; xpMod = 1.5; }
        if (mode === 'FORCE') { heatAdd = 2; syncPenalty = 5; }
        if (mode === 'SAFE') { heatAdd = 0; syncPenalty = 10; targetMod = 0.6; xpMod = 0.3; }

        if (prev.dailyAnomaly === 'STABLE_CORE') heatAdd *= 0.5;

        const newHeat = prev.heatLevel + heatAdd;
        
        return {
            ...prev,
            currentCycleDay: nextCycle,
            heatLevel: newHeat,
            neuralSync: Math.max(0, prev.neuralSync - syncPenalty),
            quests: generateQuestsForDay(prev.level, prev.streak, 1, nextCycle - 1, prev.hardcoreActive, newHeat, xpMod, targetMod, prev.dailyAnomaly)
        };
    });
  };

  const handleCompleteQuest = (questId: string) => {
    setUser(prev => {
      const quest = prev.quests.find(q => q.id === questId);
      if (!quest) return prev;

      const updatedQuests = prev.quests.map(q => q.id === questId ? { ...q, completed: true } : q);
      const dailyDoneAfter = updatedQuests.every(q => q.completed);
      const dailyDoneBefore = prev.quests.every(q => q.completed);

      // Шанс выпадения фрагмента
      const foundFragment = Math.random() < 0.15;
      
      const streakBonusMultiplier = 1 + (prev.streak * 0.05);
      let earnedXp = Math.round(quest.xp * streakBonusMultiplier);

      if (!dailyDoneBefore && dailyDoneAfter) {
        const bonus = Math.round((prev.level * 30 + (prev.currentCycleDay * 10)) * (prev.hardcoreActive ? 2 : 1));
        earnedXp += bonus;
        setLastBonus(bonus);
        setPendingDayComplete(true);
      }

      let newXp = prev.xp + earnedXp;
      let newLevel = prev.level;
      let reqXp = getXpRequired(newLevel);
      let levelUpDetected = false;

      while (newXp >= reqXp) {
        newXp -= reqXp;
        newLevel += 1;
        reqXp = getXpRequired(newLevel);
        levelUpDetected = true;
      }

      if (levelUpDetected) setShowLevelUp(true);
      else if (!dailyDoneBefore && dailyDoneAfter) setShowDayComplete(true);

      return {
        ...prev,
        xp: newXp,
        totalXp: prev.totalXp + earnedXp,
        level: newLevel,
        quests: updatedQuests,
        coreFragments: prev.coreFragments + (foundFragment ? 1 : 0) + (levelUpDetected ? 2 : 0),
        neuralSync: Math.min(100, prev.neuralSync + (dailyDoneAfter ? 2 : 0.5)),
        showLevelUp: levelUpDetected || prev.showLevelUp
      };
    });
    setCurrentQuest(null);
  };

  const handleCloseLevelUp = () => {
    setShowLevelUp(false);
    setUser(prev => ({ ...prev, showLevelUp: false }));
    if (pendingDayComplete) {
      setTimeout(() => {
          setShowDayComplete(true);
          setPendingDayComplete(false);
      }, 400);
    }
  };

  if (loading) return <SplashScreen />;
  if (!user.hasInitialized) return <Onboarding onStart={handleInitialize} />;

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} isNavHidden={!!currentQuest} archetype={user.archetype}>
      {activeTab === 'system' ? (
        <Dashboard 
          user={user} 
          onSelectQuest={setCurrentQuest} 
          onOverride={handleOverrideLock}
          onToggleHardcore={() => setUser(p => ({...p, hardcoreActive: !p.hardcoreActive}))}
        />
      ) : (
        <Profile user={user} onReset={() => { localStorage.clear(); window.location.reload(); }} />
      )}

      {currentQuest && (
        <QuestScreen 
          quest={currentQuest} 
          onComplete={() => handleCompleteQuest(currentQuest.id)} 
          onCancel={() => setCurrentQuest(null)} 
        />
      )}

      {showLevelUp && (
        <LevelUpOverlay 
          level={user.level} 
          onClose={handleCloseLevelUp} 
        />
      )}

      {showDayComplete && (
        <DayCompleteOverlay 
          streak={user.streak}
          bonusXp={lastBonus}
          onClose={() => setShowDayComplete(false)}
        />
      )}
    </Layout>
  );
};

export default App;
