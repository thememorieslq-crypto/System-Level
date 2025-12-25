
import React from 'react';
import { UserState } from '../types';
import { getXpRequired } from '../utils/calculations';
import { LogOut, Award, Flame, Database, Cpu, Milestone, Binary, TrendingUp, Zap, Hexagon, Shield, ListTodo } from 'lucide-react';

export const Profile: React.FC<{ user: UserState; onReset: () => void }> = ({ user, onReset }) => {
  const reqXp = getXpRequired(user.level);
  const xpPercent = Math.min((user.xp / reqXp) * 100, 100);

  return (
    <div className="p-6 pt-10 flex flex-col gap-8 animate-in fade-in duration-500 pb-10">
      {/* User Header with Progress Ring */}
      <div className="flex items-center justify-between border-b border-[#5B8CFF]/10 pb-8">
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#5B8CFF] glow-text"></div>
                <span className="mono text-[8px] text-[#5B8CFF] font-bold tracking-widest uppercase">AGENT_STATUS: ACTIVE</span>
            </div>
            <h2 className="text-4xl font-black tracking-tighter uppercase leading-none italic">CORE_AGENT</h2>
            <div className="flex items-center gap-4">
                <span className="mono text-[10px] text-white font-bold bg-[#5B8CFF]/20 px-2 py-1">LVL_{user.level}</span>
                <span className="mono text-[8px] text-[#5B8CFF] font-bold uppercase tracking-widest">
                    {user.archetype ? user.archetype : 'UNASSIGNED'}
                </span>
            </div>
        </div>

        {/* Energy Hub Visual */}
        <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" stroke="rgba(91,140,255,0.05)" strokeWidth="2" fill="transparent" />
                <circle 
                    cx="50" cy="50" r="45" 
                    stroke="#5B8CFF" strokeWidth="4" fill="transparent"
                    strokeDasharray={2 * Math.PI * 45}
                    strokeDashoffset={2 * Math.PI * 45 * (1 - xpPercent / 100)}
                    className="transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                />
            </svg>
            <div className="relative flex flex-col items-center justify-center bg-[#0F0F0F] w-18 h-18 rounded-full tech-border">
                <Cpu size={24} className="text-[#5B8CFF] animate-pulse" />
                <span className="mono text-[8px] text-[#5B8CFF] mt-1 font-bold">{Math.round(xpPercent)}%</span>
            </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-2 gap-4">
        <div className="tech-border bg-[#0A0A0A] p-4 flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-1">
                <Flame size={12} className="text-orange-500" />
                <span className="mono text-[8px] text-gray-500 font-bold uppercase">STABILITY</span>
            </div>
            <span className="text-2xl font-black text-white">{user.streak}D</span>
            <div className="h-1 bg-white/5 w-full mt-1">
                <div className="h-full bg-orange-500" style={{ width: `${Math.min(100, user.streak * 10)}%` }}></div>
            </div>
        </div>
        <div className="tech-border bg-[#0A0A0A] p-4 flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-1">
                <Zap size={12} className="text-[#5B8CFF]" />
                <span className="mono text-[8px] text-gray-500 font-bold uppercase">POWER_XP</span>
            </div>
            <span className="text-2xl font-black text-white">{user.totalXp}</span>
            <div className="h-1 bg-white/5 w-full mt-1">
                <div className="h-full bg-[#5B8CFF]" style={{ width: '100%' }}></div>
            </div>
        </div>
      </div>

      {/* NEURAL HISTORY - NEW FEATURE */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-1">
            <ListTodo size={12} className="text-[#5B8CFF]" />
            <span className="mono text-[8px] text-[#5B8CFF] font-bold uppercase tracking-widest">NEURAL_HISTORY_LOG</span>
        </div>
        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto hide-scrollbar border border-white/5 bg-[#0A0A0A] p-2">
            {user.history.length > 0 ? (
                user.history.slice().reverse().map((entry, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 border-l-2 border-[#5B8CFF]/30 bg-white/[0.02]">
                        <div className="flex flex-col">
                            <span className="mono text-[9px] text-white font-black italic">DAY_{entry.day}</span>
                            <span className="mono text-[6px] text-gray-600 uppercase tracking-tighter">{entry.date}</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="mono text-[9px] text-[#5B8CFF] font-bold">LVL_{entry.level}</span>
                            <span className="mono text-[7px] text-gray-700 uppercase tracking-widest">{entry.totalXp} TOTAL_XP</span>
                        </div>
                    </div>
                ))
            ) : (
                <div className="p-8 text-center mono text-[7px] text-gray-700 uppercase italic">
                    NO_DATA_ARCHIVED_YET
                </div>
            )}
        </div>
      </div>

      {/* Service Record */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
            <Milestone size={10} className="text-gray-700" />
            <span className="mono text-[8px] text-gray-700 font-bold uppercase tracking-widest">ДОСТИЖЕНИЯ_ПРОГРЕССА</span>
        </div>
        <div className="flex flex-col gap-2">
           <RecordRow label="MAX_STREAK_RECORD" value={`${user.streak} ДНЕЙ`} />
           <RecordRow label="CORE_EFFICIENCY" value={`${Math.min(100, 85 + user.level)}%`} highlight />
           <RecordRow label="TOTAL_SYNC_TIME" value={`${user.level * 12}H`} />
        </div>
      </div>

      {/* Terminate Session */}
      <div className="mt-8 mb-8 flex flex-col items-center gap-6">
        <button 
            onClick={() => { if(window.confirm("ПОЛНАЯ ОЧИСТКА ДАННЫХ?")) onReset(); }} 
            className="mono text-[9px] font-bold text-gray-800 hover:text-[#EF4444] transition-all uppercase tracking-[0.4em] flex items-center gap-3 border border-transparent hover:border-[#EF4444]/20 p-4"
        >
          <LogOut size={12} /> TERMINATE_SESSION_OS
        </button>
        <p className="mono text-[7px] text-gray-900 tracking-[0.8em] uppercase">SYSTEM_CORE_V.2.5.0</p>
      </div>
    </div>
  );
};

const RecordRow: React.FC<{ label: string, value: string, highlight?: boolean }> = ({ label, value, highlight }) => (
    <div className={`flex justify-between items-center p-3 border-l-2 transition-all ${highlight ? 'border-[#5B8CFF] bg-[#5B8CFF]/5' : 'border-white/5 bg-white/[0.02]'}`}>
        <span className="mono text-[8px] font-bold text-gray-500 uppercase tracking-widest">{label}</span>
        <span className={`mono text-[10px] font-bold ${highlight ? 'text-[#5B8CFF]' : 'text-white'}`}>{value}</span>
    </div>
);
