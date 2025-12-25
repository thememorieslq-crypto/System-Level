
import React from 'react';
import { CheckCircle, Zap, TrendingUp, Shield } from 'lucide-react';

interface DayCompleteOverlayProps {
  streak: number;
  bonusXp: number;
  onClose: () => void;
}

export const DayCompleteOverlay: React.FC<DayCompleteOverlayProps> = ({ streak, bonusXp, onClose }) => {
  return (
    <div className="fixed inset-0 bg-[#0E1015]/70 backdrop-blur-xl z-[200] flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
      {/* Декоративные сканирующие углы */}
      <div className="absolute top-10 left-10 w-16 h-16 border-t-2 border-l-2 border-[#5B8CFF]/20 pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 border-b-2 border-r-2 border-[#5B8CFF]/20 pointer-events-none"></div>

      <div className="relative w-full max-w-xs flex flex-col items-center gap-8 text-center animate-in zoom-in duration-300">
        <div className="relative">
          <div className="w-16 h-16 tech-border bg-[#5B8CFF]/10 flex items-center justify-center shadow-[0_0_50px_rgba(91,140,255,0.15)] relative z-10">
              <CheckCircle size={32} className="text-[#5B8CFF]" />
          </div>
          <div className="absolute inset-0 bg-[#5B8CFF] animate-ping opacity-20 blur-xl"></div>
        </div>

        <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tighter uppercase text-white glow-text leading-tight">CYCLE_COMPLETE</h2>
            <div className="flex items-center justify-center gap-2">
               <div className="h-[1px] w-4 bg-[#5B8CFF]/40"></div>
               <p className="mono text-[8px] text-[#5B8CFF] font-bold tracking-[0.4em] uppercase italic">ALL_TARGETS_ACQUIRED</p>
               <div className="h-[1px] w-4 bg-[#5B8CFF]/40"></div>
            </div>
        </div>

        <div className="w-full flex flex-col gap-3">
            <div className="bg-[#141824] border border-[#5B8CFF]/10 p-4 flex justify-between items-center tech-border relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[#5B8CFF]/5 animate-pulse pointer-events-none"></div>
                <div className="flex items-center gap-2 relative z-10">
                    <TrendingUp size={14} className="text-[#5B8CFF]" />
                    <span className="mono text-[9px] font-bold uppercase tracking-widest text-gray-500">EFFICIENCY_REWARD</span>
                </div>
                <span className="mono text-[11px] font-bold text-[#5B8CFF] relative z-10">+{bonusXp} XP</span>
            </div>
            
            <div className="bg-[#141824] border border-white/5 p-4 flex justify-between items-center tech-border">
                <div className="flex items-center gap-2">
                    <Shield size={14} className="text-orange-500" />
                    <span className="mono text-[9px] font-bold uppercase tracking-widest text-gray-500">STABILITY_LINK</span>
                </div>
                <span className="mono text-[11px] font-bold text-orange-500">{streak}D</span>
            </div>
        </div>

        <div className="w-full mt-4 flex flex-col gap-3">
          <button 
              onClick={onClose}
              className="w-full py-5 bg-[#5B8CFF] text-black font-bold text-[10px] uppercase tracking-[0.5em] shadow-[0_0_40px_rgba(91,140,255,0.3)] active:scale-95 transition-all hover:brightness-110"
          >
              CONFIRM_SYNOPSIS
          </button>
          <p className="mono text-[7px] text-gray-700 uppercase tracking-[0.6em]">SYSTEM_CORE_V.1.2.0 // AUTO_SYNC_ENABLED</p>
        </div>
      </div>
    </div>
  );
};
