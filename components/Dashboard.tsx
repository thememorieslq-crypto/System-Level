
import React, { useState, useEffect, useRef } from 'react';
import { UserState, Quest, ExerciseType, Archetype, ExerciseCategory } from '../types.ts';
import { getXpRequired } from '../utils/calculations.ts';
import { ARCHETYPE_MAP } from '../constants.tsx';
import { ChevronRight, Lock, CalendarDays, CheckCircle2, ShieldAlert, Sparkles, FastForward, Hexagon, ShoppingCart, Zap, Flame, AlertTriangle } from 'lucide-react';

interface DashboardProps {
  user: UserState;
  onSelectQuest: (quest: Quest) => void;
  onOverride: (mode: 'RECOVERY' | 'STABLE' | 'OVERLOAD' | 'FORCE' | 'SAFE') => void;
  onToggleHardcore: () => void;
  onOpenStore: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onSelectQuest, onOverride, onToggleHardcore, onOpenStore }) => {
  const reqXp = getXpRequired(user.level);
  const xpPercent = Math.min((user.xp / reqXp) * 100, 100);
  const completedCount = user.quests.filter(q => q.completed).length;
  const allCompleted = user.quests.length > 0 && completedCount === user.quests.length;
  
  const isHardcoreLocked = user.quests.some(q => q.completed);
  
  const roadmapRef = useRef<HTMLDivElement>(null);
  const [timeToNextDay, setTimeToNextDay] = useState('');

  const isPrestige = user.currentCycleDay > 30;
  const displayPhase = isPrestige ? `OC_MK_${user.currentCycleDay - 30}` : `PHASE_${user.currentCycleDay.toString().padStart(2, '0')}`;

  // Расчет штрафа опыта на основе HeatLevel
  const xpPenaltyPercent = Math.round(Math.max(0.1, 1 - (Math.max(0, user.heatLevel - 1) * 0.15)) * 100);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();
      const h = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
      const m = Math.floor((diff / (1000 * 60)) % 60).toString().padStart(2, '0');
      const s = Math.floor(diff / 1000 % 60).toString().padStart(2, '0');
      setTimeToNextDay(`${h}:${m}:${s}`);
    };
    const timer = setInterval(updateTimer, 1000);
    updateTimer();
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (roadmapRef.current) {
        const children = roadmapRef.current.children;
        const activeIndex = user.currentCycleDay - 1;
        if (children[activeIndex]) {
          children[activeIndex].scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest'
          });
        }
    }
  }, [user.currentCycleDay]);

  const handleHardcoreClick = () => {
    onToggleHardcore();
  };

  return (
    <div className={`p-4 pt-6 flex flex-col gap-4 animate-in fade-in duration-700 h-full overflow-hidden relative ${user.heatLevel >= 4 ? 'system-glitch' : ''}`}>
      
      {/* HUD INDICATORS GRID */}
      <div className="grid grid-cols-2 gap-2 shrink-0">
          
          {/* SYSTEM HEAT (Масштаб немного уменьшен) */}
          <div className="flex flex-col p-2 danger-corner bg-[#141824]/80 border border-white/5 col-span-2">
              <div className="flex justify-between items-center mb-1.5">
                  <div className="flex flex-col">
                      <span className="mono text-[7px] font-black text-gray-500 uppercase tracking-widest">SYSTEM_HEAT</span>
                      <span className={`mono text-[9px] font-black leading-none mt-0.5 ${user.heatLevel >= 4 ? 'text-red-500 animate-pulse' : 'text-orange-400'}`}>
                          {user.heatLevel >= 4 ? 'CRITICAL' : user.heatLevel > 0 ? 'ACTIVE_LOAD' : 'STABLE'}
                      </span>
                  </div>
                  <div className="flex flex-col items-end">
                      <span className="mono text-[7px] font-black text-gray-500 uppercase">EFFICIENCY</span>
                      <span className={`mono text-[11px] font-black leading-none mt-0.5 ${xpPenaltyPercent < 100 ? 'text-orange-500' : 'text-emerald-400'}`}>
                          {xpPenaltyPercent}%
                      </span>
                  </div>
              </div>
              <div className="flex gap-1 items-end h-3.5">
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 h-full transition-all duration-700 border border-white/5 ${
                      user.heatLevel > i 
                      ? (i < 3 ? 'bg-orange-500 shadow-[0_0_6px_rgba(249,161,22,0.3)]' : 'bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]') 
                      : 'bg-white/5'
                    }`}
                  />
                ))}
              </div>
              <div className="mt-1.5 flex items-center gap-1.5 opacity-60">
                  <AlertTriangle size={7} className={user.heatLevel >= 3 ? 'text-orange-500' : 'text-gray-700'} />
                  <span className="mono text-[6px] text-gray-500 font-bold uppercase tracking-tighter italic">
                      SYSTEM_LOAD_AFFECTS_XP_OUTPUT
                  </span>
              </div>
          </div>

          {/* STORAGE & FRAGMENTS */}
          <button onClick={onOpenStore} className="flex items-center justify-between p-3 tech-border bg-[#5B8CFF]/5 border-[#5B8CFF]/20 active:scale-95 transition-all">
              <div className="flex flex-col items-start">
                  <span className="mono text-[6px] font-black text-[#5B8CFF] uppercase tracking-tighter">BLACK_MARKET</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <ShoppingCart size={10} className="text-[#5B8CFF]" />
                    <span className="mono text-[10px] font-black text-white uppercase tracking-tighter">STORE</span>
                  </div>
              </div>
          </button>

          <div className="flex items-center justify-between p-3 tech-border bg-white/5 border-white/10">
              <div className="flex flex-col items-start">
                  <span className="mono text-[6px] font-black text-gray-500 uppercase tracking-tighter">CORE_FRAGS</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Hexagon size={10} className="text-[#5B8CFF] fill-[#5B8CFF]/20" />
                    <span className="mono text-[10px] font-black text-white">{user.coreFragments}</span>
                  </div>
              </div>
          </div>
      </div>

      {/* HEADER */}
      <div className="flex flex-col gap-3 shrink-0">
        <div className="flex justify-between items-start border-b border-[#5B8CFF]/10 pb-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-0.5">
               <CalendarDays size={10} className="text-gray-600" />
               <span className="mono text-[8px] text-gray-600 font-bold uppercase tracking-widest italic">UPTIME: {user.calendarDay}D</span>
            </div>
            <h1 className="text-3xl font-black tracking-tighter leading-none glow-text uppercase italic text-white">CORE_INIT</h1>
            <div className="flex items-center gap-3 mt-1">
                <span className="mono text-[8px] text-white/50 uppercase tracking-widest font-black">LVL_{user.level}</span>
                <div className="flex items-center gap-1.5">
                   <ShieldAlert size={10} className="text-orange-500" />
                   <span className="mono text-[8px] font-bold text-orange-500 uppercase tracking-tighter">STABILITY: {user.streak}D</span>
                </div>
            </div>
          </div>
          <div className="flex flex-col items-end text-right gap-2">
             <button 
                onClick={handleHardcoreClick}
                className={`flex items-center gap-2 px-3 py-1.5 border mono text-[8px] font-black uppercase transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)] active:scale-95 ${
                    user.hardcoreActive 
                    ? 'bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]' 
                    : isHardcoreLocked 
                        ? 'bg-gray-900 border-gray-800 text-gray-600 opacity-50'
                        : 'bg-[#1A1F2E] border-[#5B8CFF]/30 text-[#5B8CFF] hover:border-[#5B8CFF]'
                }`}
             >
                {isHardcoreLocked ? <Lock size={10} /> : <Flame size={12} className={user.hardcoreActive ? 'animate-pulse fill-white' : ''} />}
                {user.hardcoreActive ? 'HARDCORE_ON' : isHardcoreLocked ? 'LOCKED' : 'HARDCORE_OFF'}
             </button>
             <div className="flex flex-col items-end">
                <span className={`text-xl font-black leading-none tracking-widest ${isPrestige ? 'text-amber-400' : 'text-[#5B8CFF]'}`}>{displayPhase}</span>
             </div>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between mono text-[7px] uppercase font-black tracking-[0.2em] text-[#5B8CFF]/60">
            <span>NEURAL_LOAD</span>
            <span className="tabular-nums text-white">{Math.floor(user.xp)} / {reqXp} XP</span>
          </div>
          <div className="h-2.5 tech-border p-[1px] bg-black/40 relative">
            <div 
                className={`h-full transition-all duration-1000 ease-out ${isPrestige ? 'bg-gradient-to-r from-amber-600 to-amber-400' : 'bg-gradient-to-r from-[#5B8CFF]/80 to-[#5B8CFF]'}`}
                style={{ width: `${xpPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* ROADMAP */}
      <div className="flex flex-col gap-2 shrink-0">
        <div ref={roadmapRef} className="flex gap-2 overflow-x-auto hide-scrollbar py-2 px-1 snap-x touch-pan-x scroll-smooth">
           {[...Array(user.currentCycleDay + 4)].map((_, i) => {
              const c = i + 1;
              const isActive = user.currentCycleDay === c;
              const isPast = user.currentCycleDay > c;
              const isElite = c > 30;
              return (
                <div 
                    key={c}
                    className={`min-w-[55px] aspect-square flex flex-col items-center justify-center tech-border relative transition-all duration-500 snap-center ${
                        isActive 
                        ? (isElite ? 'bg-amber-400/10 border-amber-400 scale-105' : 'bg-[#5B8CFF]/15 border-[#5B8CFF] scale-105') 
                        : isPast 
                          ? (isElite ? 'bg-amber-400/5 border-amber-400/20' : 'bg-[#5B8CFF]/5 border-[#5B8CFF]/20') 
                          : 'bg-[#141824]/30 border-white/5 opacity-40'
                    }`}
                >
                    <span className={`mono text-[6px] font-black mb-1 ${isActive ? (isElite ? 'text-amber-400' : 'text-[#5B8CFF]') : 'text-gray-500'}`}>{c <= 30 ? `PH_${c}` : `OC_${c-30}`}</span>
                    {isPast ? <CheckCircle2 size={12} className={isElite ? "text-amber-500/40" : "text-[#5B8CFF]/40"} /> : isActive ? <Zap size={14} className={isElite ? "text-amber-400 animate-pulse" : "text-[#5B8CFF] animate-pulse"} /> : <Lock size={10} className="text-gray-800" />}
                </div>
              );
           })}
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto hide-scrollbar pb-8">
        {allCompleted ? (
            <div className="p-6 tech-border bg-[#141824] flex flex-col items-center gap-6 text-center animate-in zoom-in duration-300 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
               <div className="flex flex-col gap-1 items-center">
                  <CheckCircle2 size={32} className="text-[#5B8CFF] animate-bounce" />
                  <h3 className="text-lg font-black uppercase tracking-widest text-white leading-tight italic">PHASE_SECURED</h3>
                  <p className="mono text-[8px] text-gray-500 uppercase">MIDNIGHT_SYNC: {timeToNextDay}</p>
               </div>
               
               <div className="w-full flex flex-col gap-2">
                  <button onClick={() => onOverride('STABLE')} className="group flex items-center justify-between p-3 tech-border border-[#5B8CFF]/20 bg-[#5B8CFF]/5 active:scale-95 transition-all">
                      <div className="flex flex-col items-start text-left">
                          <span className="mono text-[8px] font-black uppercase text-[#5B8CFF]">OVERRIDE_NEXT_PHASE</span>
                          <span className="mono text-[6px] text-gray-500 uppercase italic">Force New Quests Now</span>
                      </div>
                      <FastForward size={14} className="text-[#5B8CFF]" />
                  </button>
               </div>
            </div>
        ) : (
            <div className="flex flex-col gap-2">
              {user.quests.map(q => (
                <QuestEntry 
                  key={q.id} 
                  quest={q} 
                  onClick={() => onSelectQuest(q)} 
                  isArchetypeBonus={user.archetype && ARCHETYPE_MAP[user.archetype] === q.category}
                />
              ))}
            </div>
        )}
      </div>
    </div>
  );
};

const QuestEntry: React.FC<{ quest: Quest; onClick: () => void; isArchetypeBonus?: boolean }> = ({ quest, onClick, isArchetypeBonus }) => {
  const isTimer = quest.type === ExerciseType.Plank;
  return (
    <button 
      disabled={quest.completed} 
      onClick={onClick}
      className={`w-full group relative flex items-center justify-between p-3.5 border-l-[2px] transition-all duration-300 ${
          quest.completed 
            ? 'border-gray-800 bg-transparent opacity-20' 
            : 'border-[#5B8CFF] bg-[#141824] active:scale-[0.98] shadow-lg'
      }`}
    >
      <div className="flex flex-col text-left">
          <div className="flex items-center gap-2 mb-1">
              <h4 className={`text-[13px] font-black uppercase leading-tight tracking-tight italic ${quest.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
                {quest.type}
              </h4>
              {isArchetypeBonus && !quest.completed && (
                  <Sparkles size={10} className="text-[#5B8CFF] animate-pulse" />
              )}
          </div>
          <span className="mono text-[9px] text-gray-600 font-bold uppercase tracking-widest">
            OBJ: {quest.target} {isTimer ? 'SEC' : 'REP'}
          </span>
      </div>
      <div className="flex items-center gap-4">
          <span className={`mono text-[10px] font-black ${quest.completed ? 'text-gray-600' : 'text-[#5B8CFF] glow-text'}`}>
            +{quest.xp}XP
          </span>
          {!quest.completed && <ChevronRight size={14} className="text-[#5B8CFF]/40 group-hover:text-[#5B8CFF] transition-all" />}
          {quest.completed && <CheckCircle2 size={14} className="text-emerald-500/50" />}
      </div>
    </button>
  );
};
