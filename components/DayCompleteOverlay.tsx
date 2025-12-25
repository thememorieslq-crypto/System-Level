
import React from 'react';
import { CheckCircle, Zap, TrendingUp, Shield, CheckCircle2 } from 'lucide-react';

interface DayCompleteOverlayProps {
  streak: number;
  bonusXp: number;
  onClose: () => void;
  isFirstDaySuccess?: boolean;
}

export const DayCompleteOverlay: React.FC<DayCompleteOverlayProps> = ({ streak, bonusXp, onClose, isFirstDaySuccess }) => {
  return (
    <div className="fixed inset-0 bg-[#0E1015] z-[300] flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in duration-300">
      <div className="relative w-full max-w-xs flex flex-col items-center gap-8 text-center">
        
        <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-[#5B8CFF]/30"></div>
            <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-[#5B8CFF]"></div>
            <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-[#5B8CFF]"></div>
            <CheckCircle2 size={48} className="text-[#5B8CFF] glow-text animate-pulse" />
        </div>

        <div className="flex flex-col gap-2">
            <h2 className="text-4xl font-black tracking-tighter uppercase text-white glow-text leading-none italic">CYCLE_COMPLETE</h2>
            <div className="flex items-center justify-center gap-3">
               <div className="h-[1px] w-6 bg-[#5B8CFF]/20"></div>
               <p className="mono text-[10px] text-[#5B8CFF] font-black tracking-[0.4em] uppercase italic">ALL_TARGETS_ACQUIRED</p>
               <div className="h-[1px] w-6 bg-[#5B8CFF]/20"></div>
            </div>
        </div>

        <div className="w-full flex flex-col gap-4 mt-4">
            <div className="bg-[#141824] border border-[#5B8CFF]/20 p-5 flex justify-between items-center relative overflow-hidden tech-border shadow-[0_0_30px_rgba(91,140,255,0.05)]">
                <div className="flex items-center gap-3 relative z-10">
                    <TrendingUp size={18} className="text-[#5B8CFF]" />
                    <span className="mono text-[11px] font-black uppercase tracking-widest text-gray-500">EFFICIENCY_REWARD</span>
                </div>
                <span className="mono text-[14px] font-black text-[#5B8CFF] relative z-10 italic">+{bonusXp} XP</span>
            </div>
            
            <div className="bg-[#141824] border border-white/5 p-5 flex justify-between items-center relative overflow-hidden tech-border">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500/30"></div>
                
                <div className="flex items-center gap-3">
                    <Shield size={18} className="text-orange-500" />
                    <div className="flex flex-col items-start">
                      <span className="mono text-[11px] font-black uppercase tracking-widest text-gray-500">STABILITY_LINK</span>
                      <span className="mono text-[7px] text-orange-500 font-bold tracking-tighter">PENDING_SYNC_MIDNIGHT</span>
                    </div>
                </div>
                <span className="mono text-[14px] font-black text-orange-500 italic">{streak}D</span>
            </div>
        </div>

        <div className="w-full mt-6 flex flex-col gap-4">
          <button 
              onClick={onClose}
              className="w-full py-5 bg-[#5B8CFF] text-black font-black text-[12px] uppercase tracking-[0.4em] shadow-[0_0_40px_rgba(91,140,255,0.3)] active:scale-95 transition-all hover:brightness-110 italic"
          >
              CONFIRM_SYNOPSIS
          </button>
          <div className="flex flex-col gap-1 opacity-30">
            <p className="mono text-[8px] text-gray-500 uppercase tracking-[0.3em]">SYSTEM_CORE_V.2.8.0 //</p>
            <p className="mono text-[8px] text-gray-500 uppercase tracking-[0.3em]">STABILITY_PROTECTION_ENABLED</p>
          </div>
        </div>
      </div>
    </div>
  );
};
