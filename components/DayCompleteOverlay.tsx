
import React from 'react';
import { CheckCircle, Zap, TrendingUp, Shield, CheckCircle2 } from 'lucide-react';

interface DayCompleteOverlayProps {
  streak: number;
  bonusXp: number;
  onClose: () => void;
}

export const DayCompleteOverlay: React.FC<DayCompleteOverlayProps> = ({ streak, bonusXp, onClose }) => {
  return (
    <div className="fixed inset-0 bg-[#0E1015]/90 backdrop-blur-md z-[200] flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
      <div className="relative w-full max-w-xs flex flex-col items-center gap-8 text-center animate-in zoom-in duration-300">
        
        <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 border border-[#5B8CFF]/20"></div>
            <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-[#5B8CFF]"></div>
            <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-[#5B8CFF]"></div>
            <CheckCircle2 size={40} className="text-[#5B8CFF] glow-text" />
        </div>

        <div className="flex flex-col gap-2">
            <h2 className="text-4xl font-black tracking-tighter uppercase text-white glow-text leading-none italic">CYCLE_COMPLETE</h2>
            <div className="flex items-center justify-center gap-2">
               <div className="h-[1px] w-4 bg-[#5B8CFF]/20"></div>
               <p className="mono text-[8px] text-[#5B8CFF] font-bold tracking-[0.4em] uppercase italic">ALL_TARGETS_ACQUIRED</p>
               <div className="h-[1px] w-4 bg-[#5B8CFF]/20"></div>
            </div>
        </div>

        <div className="w-full flex flex-col gap-4 mt-4">
            <div className="bg-[#141824]/50 border border-[#5B8CFF]/10 p-5 flex justify-between items-center relative overflow-hidden">
                <div className="flex items-center gap-3 relative z-10">
                    <TrendingUp size={16} className="text-[#5B8CFF]" />
                    <span className="mono text-[10px] font-black uppercase tracking-widest text-gray-500">EFFICIENCY_REWARD</span>
                </div>
                <span className="mono text-[12px] font-black text-[#5B8CFF] relative z-10">+{bonusXp} XP</span>
            </div>
            
            <div className="bg-[#141824]/50 border border-white/5 p-5 flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-orange-500/20"></div>
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-orange-500/40"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-orange-500/40"></div>
                
                <div className="flex items-center gap-3">
                    <Shield size={16} className="text-orange-500" />
                    <span className="mono text-[10px] font-black uppercase tracking-widest text-gray-500">STABILITY_LINK</span>
                </div>
                <span className="mono text-[12px] font-black text-orange-500">{streak}D</span>
            </div>
        </div>

        <div className="w-full mt-6 flex flex-col gap-4">
          <button 
              onClick={onClose}
              className="w-full py-6 bg-[#5B8CFF] text-black font-black text-[11px] uppercase tracking-[0.5em] shadow-[0_0_50px_rgba(91,140,255,0.2)] active:scale-95 transition-all hover:brightness-110 italic"
          >
              CONFIRM_SYNOPSIS
          </button>
          <div className="flex flex-col gap-1 opacity-30">
            <p className="mono text-[7px] text-gray-400 uppercase tracking-[0.5em]">SYSTEM_CORE_V.1.2.0 //</p>
            <p className="mono text-[7px] text-gray-400 uppercase tracking-[0.5em]">AUTO_SYNC_ENABLED</p>
          </div>
        </div>
      </div>
    </div>
  );
};
