
import React, { useState, useEffect, useCallback } from 'react';
import { UserState, ExerciseType, Quest } from './types.ts';
import { generateQuestsForDay, getXpRequired, checkDateDiff } from './utils/calculations.ts';
import { getSystemMessage } from './services/geminiService.ts';
import { Dashboard } from './components/Dashboard.tsx';
import { QuestScreen } from './components/QuestScreen.tsx';
import { Profile } from './components/Profile.tsx';
import { SplashScreen } from './components/SplashScreen.tsx';
import { LevelUpOverlay } from './components/LevelUpOverlay.tsx';
import { DayCompleteOverlay } from './components/DayCompleteOverlay.tsx';
import { Layout } from './components/Layout.tsx';
import { Onboarding } from './components/Onboarding.tsx';

const STORAGE_KEY = 'system_level_up_v5_final';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'system' | 'profile'>('system');
  const [currentQuest, setCurrentQuest] = useState<Quest | null>(null);
  const [systemMsg, setSystemMsg] = useState<string>("Инициализация...");
  const [showDayComplete, setShowDayComplete] = useState(false);
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
      currentCycleDay: 1
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }, [user]);

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
  }, [user.hasInitialized]);

  const checkDailyRefresh = useCallback(async () => {
    const today = new Date().toISOString().split('T')[0];
    if (user.lastActiveDate === today) return;

    setUser(prev => {
        const loadModifier = prev.penaltyActive ? 1.15 : 1.0;
        return {
            ...prev,
            calendarDay: prev.calendarDay + 1,
            currentCycleDay: 1,
            lastActiveDate: today,
            quests: generateQuestsForDay(prev.level, prev.streak, loadModifier, 0)
        };
    });
    
    setSystemMsg(await getSystemMessage("СИСТЕМА: Обнаружена смена календарного цикла. Глобальная синхронизация завершена. Календарный день обновлен."));
  }, [user.lastActiveDate]);

  const handleInitialize = () => {
    const today = new Date().toISOString().split('T')[0];
    setUser(prev => ({ 
      ...prev, 
      hasInitialized: true, 
      lastActiveDate: today, 
      calendarDay: 1,
      quests: generateQuestsForDay(1, 0, 1, 0),
      currentCycleDay: 1
    }));
    setSystemMsg("СИСТЕМА: Протокол D_01 активирован. Добро пожаловать, Агент.");
  };

  const handleOverrideLock = async () => {
    setUser(prev => {
        const nextCycle = prev.currentCycleDay + 1;
        const loadModifier = (prev.penaltyActive ? 1.15 : 1.0);
        return {
            ...prev,
            currentCycleDay: nextCycle,
            quests: generateQuestsForDay(prev.level, prev.streak, loadModifier, nextCycle - 1)
        };
    });
    setSystemMsg(await getSystemMessage("СИСТЕМА: Инициирован принудительный прорыв. Текущий календарный день сохранен. Загрузка фазы повышенной нагрузки..."));
  };

  const handleCompleteQuest = (questId: string) => {
    setUser(prev => {
      const isDebt = prev.debtQuests.some(q => q.id === questId);
      const quest = prev.quests.find(q => q.id === questId) || prev.debtQuests.find(q => q.id === questId);
      if (!quest) return prev;

      const updatedQuests = prev.quests.map(q => q.id === questId ? { ...q, completed: true } : q);
      const updatedDebt = prev.debtQuests.filter(q => q.id !== questId);
      
      const streakBonusMultiplier = 1 + (prev.streak * 0.05);
      let earnedXp = Math.round(quest.xp * streakBonusMultiplier);
      
      let dayBonus = 0;
      const dailyDoneAfter = updatedQuests.every(q => q.completed);
      const dailyDoneBefore = prev.quests.every(q => q.completed);

      if (!dailyDoneBefore && dailyDoneAfter && !isDebt) {
        dayBonus = Math.round(prev.level * 30 + (prev.currentCycleDay * 10));
        earnedXp += dayBonus;
        setLastBonus(dayBonus);
        setTimeout(() => setShowDayComplete(true), 400);
      }

      let newXp = prev.xp + earnedXp;
      let newLevel = prev.level;
      let reqXp = getXpRequired(newLevel);
      let showLevelUp = false;

      while (newXp >= reqXp) {
        newXp -= reqXp;
        newLevel += 1;
        reqXp = getXpRequired(newLevel);
        showLevelUp = true;
      }

      return {
        ...prev,
        xp: newXp,
        totalXp: prev.totalXp + earnedXp,
        level: newLevel,
        quests: updatedQuests,
        debtQuests: updatedDebt,
        streak: !dailyDoneBefore && dailyDoneAfter && !isDebt && prev.currentCycleDay === 1 ? prev.streak + 1 : prev.streak,
        showLevelUp: showLevelUp || prev.showLevelUp,
        penaltyActive: updatedDebt.length > 0
      };
    });
    setCurrentQuest(null);
  };

  if (loading) return <SplashScreen />;
  if (!user.hasInitialized) return <Onboarding onStart={handleInitialize} />;

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} isNavHidden={!!currentQuest}>
      {activeTab === 'system' ? (
        <Dashboard 
          user={user} 
          systemMsg={systemMsg} 
          onSelectQuest={setCurrentQuest} 
          onOverride={handleOverrideLock}
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

      {user.showLevelUp && (
        <LevelUpOverlay 
          level={user.level} 
          onClose={() => setUser(prev => ({ ...prev, showLevelUp: false }))} 
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
