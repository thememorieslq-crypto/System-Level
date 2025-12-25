
import React, { useState, useEffect, useRef } from 'react';
import { UserState, Quest, ExerciseType } from '../types';
import { getXpRequired } from '../utils/calculations';
import { ChevronRight, Lock, Terminal, Radio, Cpu, Zap, Workflow, Fingerprint, CalendarDays, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

interface DashboardProps {
  user: UserState;
  systemMsg: string;
  onSelectQuest: (quest: Quest) => void;
  onOverride: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, systemMsg, onSelectQuest, onOverride }) => {
  const reqXp = getXpRequired(user.level);
  const xpPercent = Math.min((user.xp / reqXp) * 100, 100);
  const allCompleted = user.quests.length > 0 && user.quests.every(q => q.completed);
  
  const [viewingCycle, setViewingCycle] = useState(user.currentCycleDay);
  const roadmapRef = useRef<HTMLDivElement>(null);
  const [timeToNextDay, setTimeToNextDay] = useState('');
  const [isTerminalMinimized, setIsTerminalMinimized] = useState(false);

  // Календарный день из состояния
  const calendarDayStr = `D_${user.calendarDay.toString().padStart(2, '0')}`;

  const cleanSystemText = (text: string) => {
    return text.replace(/\*\*|###|\*|__/g, '').trim();
  };

  // Авто-разворачивание при новом сообщении
  useEffect(() => {
    if (systemMsg) {
      setIsTerminalMinimized(false);
    }
  }, [systemMsg]);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();
      const h = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
      const m = Math.floor((diff / (1000 * 60)) % 60).toString().padStart(2, '0');
      const s = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');
      setTimeToNextDay(`${h}:${m}:${s}`);
    };
    const timer = setInterval(updateTimer, 1000);
    updateTimer();
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const center = () => {
      if (roadmapRef.current) {
        const activeElement = roadmapRef.current.children[user.currentCycleDay - 1] as HTMLElement;
        if (activeElement) {
          activeElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      }
    };
    const t = setTimeout(center, 150);
    setViewingCycle(user.currentCycleDay);
    return () => clearTimeout(t);
  }, [user.currentCycleDay]);

  return (
    <div className="p-4 pt-6 flex flex-col gap-4 animate-in fade-in duration-700 h-full overflow-hidden relative">
      {/* HEADER */}
      <div className="flex flex-col gap-3 shrink-0">
        <div className="flex justify-between items-start border-b border-[#5B8CFF]/10 pb-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-1">
                <CalendarDays size={10} className="text-[#5B8CFF]" />
                <span className="mono text-[8px] text-[#5B8CFF] tracking-widest uppercase font-bold">SYSTEM_CALENDAR</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tighter leading-none glow-text">{calendarDayStr}</h1>
            <span className="mono text-[8px] text-gray-600 mt-1 uppercase tracking-widest">SYNC_LVL: {user.level}</span>
          </div>
          <div className="flex flex-col items-end text-right">
             <div className="flex items-center gap-1.5 mb-1">
                <span className="mono text-[8px] text-gray-500 tracking-widest uppercase font-bold">CYCLE_LOAD</span>
                <Radio size={8} className="text-[#5B8CFF] animate-pulse" />
             </div>
             <div className="flex flex-col items-end">
                <span className="text-xl font-black leading-none tracking-widest text-[#5B8CFF]">PHASE_{user.currentCycleDay}</span>
                <span className="mono text-[7px] text-gray-700 font-bold uppercase mt-1">
                    {allCompleted ? 'STB_MODE' : 'EXEC_MODE'}
                </span>
             </div>
          </div>
        </div>

        {/* PROGRESS BAR - FIXED HEIGHT AND STYLING */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between mono text-[7px] uppercase font-bold tracking-[0.1em] text-[#5B8CFF]">
            <span>NEURAL_SYNC</span>
            <span className="tabular-nums">{Math.floor(user.xp)} / {reqXp} XP</span>
          </div>
          <div className="h-3 tech-border p-[1.5px] bg-black/40 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #5B8CFF 0, #5B8CFF 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }}></div>
            
            {/* The actual progress fill */}
            <div 
                className="h-full bg-gradient-to-r from-[#5B8CFF]/80 to-[#5B8CFF] transition-all duration-1000 ease-out relative"
                style={{ width: `${xpPercent}%` }}
            >
                {/* Gloss effect */}
                <div className="absolute top-0 left-0 w-full h-[50%] bg-white/10"></div>
                {/* Glow effect */}
                <div className="absolute top-0 right-0 h-full w-4 bg-[#5B8CFF] blur-sm opacity-50"></div>
            </div>
          </div>
        </div>
      </div>

      {/* ROADMAP */}
      <div className="flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
                <Workflow size={9} className="text-gray-600" />
                <span className="mono text-[7px] text-gray-600 font-bold tracking-[0.2em] uppercase">NEURAL_ROADMAP</span>
            </div>
        </div>

        <div ref={roadmapRef} className="flex gap-2 overflow-x-auto hide-scrollbar py-2 px-1 snap-x touch-pan-x">
           {[...Array(30)].map((_, i) => {
              const c = i + 1;
              const isActive = user.currentCycleDay === c;
              const isPast = user.currentCycleDay > c;
              const isSelected = viewingCycle === c;
              return (
                <button 
                    key={c}
                    onClick={() => setViewingCycle(c)}
                    className={`min-w-[75px] aspect-square flex flex-col items-center justify-center tech-border relative transition-all snap-center ${
                        isActive ? 'bg-[#5B8CFF]/15 border-[#5B8CFF]' : isSelected ? 'bg-white/5 border-white/20' : 'bg-[#141824]/30 border-white/5 opacity-40'
                    }`}
                >
                    <span className={`mono text-[8px] font-bold mb-1 ${isActive ? 'text-[#5B8CFF]' : 'text-gray-500'}`}>PH_{c.toString().padStart(2, '0')}</span>
                    {isPast ? <Fingerprint size={14} className="text-gray-700" /> : c > user.currentCycleDay ? <Lock size={12} className="text-gray-800" /> : <Zap size={16} className="text-[#5B8CFF] animate-pulse" />}
                    {isActive && <div className="absolute -bottom-1 w-full h-1 bg-[#5B8CFF] shadow-[0_0_12px_#5B8CFF]"></div>}
                </button>
              );
           })}
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex flex-col gap-3 flex-1 overflow-y-auto hide-scrollbar pb-24">
        <div className="flex items-center gap-2 sticky top-0 bg-[#0E1015] z-10 py-1">
          <Cpu size={9} className="text-gray-600" />
          <span className="mono text-[7px] text-gray-600 font-bold tracking-[0.2em] uppercase">
            {viewingCycle === user.currentCycleDay ? (allCompleted ? 'SYS: STATUS_CLEAR' : 'SYS: TARGETS') : viewingCycle < user.currentCycleDay ? 'SYS: ARCHIVE' : `EXP: PHASE_${viewingCycle}`}
          </span>
          <div className="h-[0.5px] flex-1 bg-[#5B8CFF]/10"></div>
        </div>

        <div className="flex flex-col gap-2">
          {viewingCycle === user.currentCycleDay ? (
            allCompleted ? (
              <div className="p-8 tech-border bg-[#141824] flex flex-col items-center gap-6 text-center animate-in fade-in duration-500">
                 <div className="flex flex-col items-center gap-2">
                    <CheckCircle2 size={32} className="text-[#5B8CFF] opacity-80" />
                    <h3 className="text-lg font-black uppercase tracking-widest text-white leading-tight">ALL OBJECTIVES CLEARED</h3>
                    <p className="mono text-[8px] text-[#5B8CFF] font-bold uppercase tracking-[0.2em] italic">Current phase fully synchronized</p>
                 </div>
                 <div className="h-[1px] w-full bg-white/5"></div>
                 <div className="flex flex-col gap-2">
                    <span className="mono text-[8px] text-gray-500 uppercase">Next system sync in</span>
                    <span className="text-4xl font-black tabular-nums text-white tracking-tighter glow-text">{timeToNextDay}</span>
                 </div>
                 <button 
                    onClick={onOverride}
                    className="w-full py-4 bg-[#5B8CFF] text-black mono text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(91,140,255,0.2)] active:scale-95 transition-all z-20"
                 >
                    OVERRIDE_LOCK: PH_{user.currentCycleDay + 1}
                 </button>
              </div>
            ) : (
              user.quests.map(q => <QuestEntry key={q.id} quest={q} onClick={() => onSelectQuest(q)} />)
            )
          ) : viewingCycle < user.currentCycleDay ? (
            <div className="p-10 text-center flex flex-col items-center gap-4 border border-dashed border-white/5 bg-white/[0.01]">
                <Fingerprint size={40} className="text-gray-800" />
                <div className="flex flex-col gap-1">
                    <span className="mono text-[9px] font-bold uppercase tracking-[0.3em] text-gray-600">PHASE ARCHIVED</span>
                    <p className="mono text-[7px] text-gray-800 uppercase italic">Successfully committed to core database</p>
                </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 opacity-40">
                {[ExerciseType.PushUps, ExerciseType.Squats, ExerciseType.Plank].map((type, idx) => (
                    <div key={idx} className="p-4 tech-border border-white/5 bg-[#141824]/20 flex justify-between items-center blur-[0.5px]">
                        <span className="text-xs font-bold uppercase text-gray-400">{type}</span>
                        <Lock size={12} className="text-gray-800" />
                    </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* FOOTER TERMINAL */}
      <div className={`absolute bottom-0 left-0 right-0 z-[40] transition-all duration-500 ease-in-out px-4 pb-4 ${isTerminalMinimized ? 'translate-y-[calc(100%-32px)]' : 'translate-y-0'}`}>
          <div className="tech-border bg-[#141824]/95 backdrop-blur-md border-t border-[#5B8CFF]/20 shadow-[0_-10px_40px_rgba(0,0,0,0.6)] overflow-hidden">
              <div className="flex items-center justify-between p-2 border-b border-white/5 bg-white/[0.02]">
                 <div className="flex items-center gap-1.5">
                    <Terminal size={9} className="text-[#5B8CFF]" />
                    <span className="mono text-[7px] text-[#5B8CFF] font-black tracking-[0.2em] uppercase">SYSTEM_LOG</span>
                 </div>
                 <button 
                    onClick={() => setIsTerminalMinimized(!isTerminalMinimized)}
                    className="p-1 hover:bg-white/10 transition-colors"
                 >
                    {isTerminalMinimized ? <ChevronUp size={12} className="text-[#5B8CFF]" /> : <ChevronDown size={12} className="text-gray-600" />}
                 </button>
              </div>
              <div className="p-2.5 h-20 overflow-y-auto hide-scrollbar">
                <p className="mono text-[9px] leading-relaxed text-white/80 font-medium border-l border-[#5B8CFF] pl-2 italic">
                    {cleanSystemText(systemMsg)}
                </p>
              </div>
          </div>
      </div>
    </div>
  );
};

const QuestEntry: React.FC<{ quest: Quest; onClick: () => void; isDebt?: boolean }> = ({ quest, onClick, isDebt }) => (
  <button 
    disabled={quest.completed} 
    onClick={onClick}
    className={`w-full group relative flex items-center justify-between p-4 border-l transition-all ${
        quest.completed ? 'border-gray-800 bg-transparent opacity-10' : isDebt ? 'border-[#EF4444] bg-[#EF4444]/5' : 'border-[#5B8CFF] bg-[#1A1F2E] active:scale-[0.98]'
    }`}
  >
    <div className="flex flex-col text-left">
        <span className="text-sm font-black uppercase tracking-tight leading-none mb-1">{quest.type}</span>
        <span className="mono text-[8px] text-gray-500 font-bold uppercase tracking-widest">TARGET: {quest.target} UNITS</span>
    </div>
    <div className="flex items-center gap-3">
        <span className={`mono text-[9px] font-black ${isDebt ? 'text-[#EF4444]' : 'text-[#5B8CFF]'}`}>+{quest.xp}XP</span>
        {!quest.completed && <ChevronRight size={14} className="text-[#5B8CFF]/40" />}
    </div>
  </button>
);
