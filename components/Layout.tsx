
import React from 'react';
import { LayoutGrid, UserCircle2 } from 'lucide-react';
import { Archetype } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'system' | 'profile';
  onTabChange: (tab: 'system' | 'profile') => void;
  isNavHidden?: boolean;
  archetype?: Archetype;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, isNavHidden, archetype }) => {
  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto relative bg-[#0E1015] overflow-hidden border-x border-white/5 shadow-2xl">
      <main className="flex-1 overflow-y-auto hide-scrollbar z-10 relative">
        {children}
      </main>
      
      {!isNavHidden && (
        <nav className="bg-[#141824] border-t border-[#5B8CFF]/10 flex items-stretch justify-around z-50 shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]" 
             style={{ 
               paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)',
               minHeight: 'calc(70px + env(safe-area-inset-bottom, 0px))' 
             }}>
          <button 
            onClick={() => onTabChange('system')}
            className={`relative flex flex-col items-center justify-center gap-1 transition-all flex-1 py-3 active:scale-95 ${activeTab === 'system' ? 'text-[#5B8CFF]' : 'text-gray-700'}`}
          >
            <LayoutGrid size={24} strokeWidth={activeTab === 'system' ? 2.5 : 1.5} className={activeTab === 'system' ? 'glow-text' : ''} />
            <span className="mono text-[9px] font-black tracking-[0.2em] uppercase">SYS_CORE</span>
            {activeTab === 'system' && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-[3px] bg-[#5B8CFF] shadow-[0_0_15px_#5B8CFF]"></div>
            )}
          </button>

          <button 
            onClick={() => onTabChange('profile')}
            className={`relative flex flex-col items-center justify-center gap-1 transition-all flex-1 py-3 active:scale-95 ${activeTab === 'profile' ? 'text-[#5B8CFF]' : 'text-gray-700'}`}
          >
            <UserCircle2 size={24} strokeWidth={activeTab === 'profile' ? 2.5 : 1.5} className={activeTab === 'profile' ? 'glow-text' : ''} />
            <span className="mono text-[9px] font-black tracking-[0.2em] uppercase">USR_DATA</span>
            {activeTab === 'profile' && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-[3px] bg-[#5B8CFF] shadow-[0_0_15px_#5B8CFF]"></div>
            )}
          </button>
        </nav>
      )}
    </div>
  );
};
