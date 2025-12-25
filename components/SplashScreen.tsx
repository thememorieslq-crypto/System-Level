
import React from 'react';

export const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-[#0E1015] flex flex-col items-center justify-center z-[100]">
      <div className="relative">
        {/* Анимированный сканер */}
        <div className="w-24 h-24 border border-[#5B8CFF]/20 relative flex items-center justify-center">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#5B8CFF]"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#5B8CFF]"></div>
            <div className="w-12 h-12 bg-[#5B8CFF]/5 animate-pulse flex items-center justify-center">
                <div className="w-2 h-2 bg-[#5B8CFF] animate-ping"></div>
            </div>
        </div>
      </div>
      <div className="mt-16 text-center">
        <p className="mono text-[#5B8CFF] text-[10px] font-bold tracking-[0.8em] uppercase italic animate-pulse">
          BOOTING_SYSTEM_OS...
        </p>
        <div className="mt-10 flex gap-1 justify-center opacity-30">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-1 h-3 bg-[#5B8CFF] animate-bounce" style={{ animationDelay: `${i * 0.05}s` }}></div>
          ))}
        </div>
      </div>
    </div>
  );
};
