
import React, { useState, useEffect } from 'react';
import { Quest, ExerciseType } from '../types';
import { X, Play, Pause, RotateCcw, Crosshair } from 'lucide-react';

interface QuestScreenProps {
  quest: Quest;
  onComplete: () => void;
  onCancel: () => void;
}

export const QuestScreen: React.FC<QuestScreenProps> = ({ quest, onComplete, onCancel }) => {
  const isTimer = quest.type === ExerciseType.Plank;
  const [timeLeft, setTimeLeft] = useState(quest.target);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && isTimer && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isTimer, timeLeft]);

  return (
    <div className="fixed inset-0 bg-[#0E1015] z-[100] flex flex-col p-7 animate-in zoom-in duration-300 overflow-hidden">
      {/* Tactical Header */}
      <div className="flex justify-between items-center h-12 border-b border-[#5B8CFF]/10 mb-7">
        <div className="flex items-center gap-2.5">
          <Crosshair size={16} className="text-[#5B8CFF] animate-spin-slow" />
          <span className="mono text-[10px] font-bold text-[#5B8CFF] tracking-[0.2em] uppercase">OP_REC_ACTIVE</span>
        </div>
        <button onClick={onCancel} className="p-2 text-gray-700 hover:text-[#EF4444] transition-all active:scale-90">
          <X size={24} />
        </button>
      </div>

      {/* Main Focus Zone */}
      <div className="flex-1 flex flex-col items-center justify-center mt-[-20px] gap-10">
        <div className="text-center">
          <h2 className="text-5xl font-extrabold tracking-tighter uppercase mb-2 glow-text leading-none">{quest.type}</h2>
          <div className="flex items-center justify-center gap-3">
              <div className="h-[1px] w-5 bg-[#5B8CFF]/10"></div>
              <p className="mono text-[10px] text-gray-500 font-bold uppercase tracking-widest">OBJ: {quest.target} {isTimer ? 'SEC' : 'REP'}</p>
              <div className="h-[1px] w-5 bg-[#5B8CFF]/10"></div>
          </div>
        </div>

        {isTimer ? (
          <div className="relative w-72 h-72 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90 p-4" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" stroke="rgba(91,140,255,0.03)" strokeWidth="1" fill="transparent" strokeDasharray="3 3" />
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke="#5B8CFF"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 90}
                strokeDashoffset={2 * Math.PI * 90 * (1 - timeLeft / quest.target)}
                className="transition-all duration-1000 ease-linear shadow-[0_0_15px_#5B8CFF]"
              />
            </svg>
            <div className="flex flex-col items-center justify-center relative">
              <span className="text-[100px] font-bold tabular-nums leading-none tracking-tighter text-white">
                {timeLeft}
              </span>
              <span className="mono text-[10px] font-bold text-[#5B8CFF] tracking-[0.5em] uppercase mt-[-5px]">SECONDS</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center relative py-12 px-10">
            <div className="absolute top-0 left-0 w-7 h-7 border-t-2 border-l-2 border-[#5B8CFF]/10"></div>
            <div className="absolute bottom-0 right-0 w-7 h-7 border-b-2 border-r-2 border-[#5B8CFF]/10"></div>
            <div className="text-[130px] font-bold tracking-tighter text-white leading-none drop-shadow-[0_0_20px_rgba(91,140,255,0.15)]">
              {quest.target}
            </div>
            <p className="mono text-[9px] font-bold text-gray-700 uppercase tracking-[0.4em] mt-3">EXEC_PROMPT</p>
          </div>
        )}

        {/* Tactical Controls */}
        {isTimer && (
          <div className="flex gap-7 mt-3">
            <button 
              onClick={() => setIsActive(!isActive)} 
              className={`w-16 h-16 tech-border flex items-center justify-center transition-all ${isActive ? 'bg-[#5B8CFF]/5 text-white' : 'bg-[#5B8CFF] text-black shadow-[0_0_15px_rgba(91,140,255,0.3)]'}`}
            >
              {isActive ? <Pause size={28} /> : <Play size={28} fill="currentColor" className="ml-1" />}
            </button>
            <button 
              onClick={() => { setTimeLeft(quest.target); setIsActive(false); }} 
              className="w-16 h-16 border border-[#5B8CFF]/10 flex items-center justify-center text-gray-600 hover:text-white transition-all active:bg-white/5"
            >
              <RotateCcw size={24} />
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Block */}
      <div className="mt-auto flex flex-col gap-5 mb-5">
        <div className="flex justify-between items-center mono text-[10px] font-bold text-gray-700 px-1 uppercase tracking-widest">
          <span>XP_VALUE</span>
          <span className="text-[#5B8CFF]">+{quest.xp}XP</span>
        </div>
        <button 
          onClick={onComplete}
          disabled={isTimer && timeLeft > 0}
          className={`w-full py-5 tech-border font-bold text-[12px] uppercase tracking-[0.3em] transition-all ${
            isTimer && timeLeft > 0 
            ? 'bg-transparent border-[#5B8CFF]/5 text-gray-800 opacity-20 cursor-not-allowed' 
            : 'bg-[#141824] text-[#5B8CFF] border-[#5B8CFF] hover:bg-[#5B8CFF] hover:text-black active:scale-[0.98]'
          }`}
        >
          CONFIRM_EXEC
        </button>
      </div>
    </div>
  );
};
