
import React, { useEffect, useState } from 'react';
import { Terminal, Zap, Cpu } from 'lucide-react';

interface LevelUpOverlayProps {
  level: number;
  onClose: () => void;
}

export const LevelUpOverlay: React.FC<LevelUpOverlayProps> = ({ level, onClose }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    const closeTimer = setTimeout(onClose, 4500);
    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-[#0E1015] z-[110] flex flex-col items-center justify-center p-10 overflow-hidden" onClick={onClose}>
      {/* Background glitch effect elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#5B8CFF] animate-[scan_2s_linear_infinite]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--accent)_0%,_transparent_70%)] opacity-20"></div>
      </div>

      <div className={`relative flex flex-col items-center gap-6 transition-all duration-1000 ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            <div className="flex items-center gap-3">
                <div className="h-[1px] w-8 bg-[#5B8CFF]/40"></div>
                <h2 className="text-[#5B8CFF] text-sm font-bold tracking-[0.8em] uppercase glow-text">SYSTEM_UPGRADED</h2>
                <div className="h-[1px] w-8 bg-[#5B8CFF]/40"></div>
            </div>

            <div className="relative">
                <div className="text-[160px] font-black tracking-tighter text-white leading-none drop-shadow-[0_0_40px_rgba(91,140,255,0.4)] relative z-10">
                  {level}
                </div>
                <div className="absolute inset-0 flex items-center justify-center -z-10 blur-2xl opacity-50">
                    <div className="w-40 h-40 bg-[#5B8CFF] rounded-full animate-ping"></div>
                </div>
            </div>

            <div className="flex flex-col items-center gap-3">
                <div className="px-6 py-2 border border-[#5B8CFF]/30 bg-[#5B8CFF]/5 flex items-center gap-3">
                    <Zap size={14} className="text-[#5B8CFF] animate-bounce" />
                    <p className="mono text-[9px] text-white font-bold tracking-[0.4em] uppercase italic">
                        ФИЗИЧЕСКИЙ_ЛИМИТ_РАСШИРЕН
                    </p>
                </div>
                
                <div className="flex gap-4 mt-2">
                    <div className="flex flex-col items-center">
                        <span className="mono text-[7px] text-gray-600 font-bold uppercase">DIFFICULTY</span>
                        <span className="mono text-[9px] text-[#5B8CFF] font-bold">+15%</span>
                    </div>
                    <div className="w-[1px] h-6 bg-white/10"></div>
                    <div className="flex flex-col items-center">
                        <span className="mono text-[7px] text-gray-600 font-bold uppercase">SYNC_RATE</span>
                        <span className="mono text-[9px] text-[#5B8CFF] font-bold">STABLE</span>
                    </div>
                </div>
            </div>
      </div>
      
      {/* Dynamic Terminal Text */}
      <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-2 opacity-40">
        <div className="flex items-center gap-2">
            <Terminal size={10} className="text-[#5B8CFF]" />
            <p className="mono text-[8px] text-[#5B8CFF] font-bold uppercase tracking-[0.5em] animate-pulse">
                RE-CALIBRATING_NEURAL_PATHWAYS...
            </p>
        </div>
        <p className="mono text-[7px] text-gray-700 font-bold uppercase tracking-widest">TAP_TO_DISMISS_STATUS</p>
      </div>

      {/* Grid burst effect */}
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-[#5B8CFF]/5 rounded-full animate-[ping_4s_linear_infinite]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#5B8CFF]/10 rounded-full animate-[ping_3s_linear_infinite]"></div>
      </div>
    </div>
  );
};
