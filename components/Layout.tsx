
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
    <div className="flex flex-col h-screen w-full max-w-md mx-auto relative bg-[#0E1015] overflow-hidden border-x border-white/5 shadow-2xl">
      <main className="flex-1 overflow-y-auto hide-scrollbar z-10 relative">
        {children}
      </main>
      
      {!isNavHidden && (
        <nav className="h-16 bg-[#141824] border-t border-[#5B8CFF]/10 flex items-center justify-around z-50 px-6 shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          <button 
            onClick={() => onTabChange('system')}
            className={`relative flex flex-col items-center justify-center gap-1 transition-all flex-1 h-full active:scale-90 ${activeTab === 'system' ? 'text-[#5B8CFF]' : 'text-gray-700'}`}
          >
            <LayoutGrid size={22} strokeWidth={activeTab === 'system' ? 2.5 : 1.5} className={activeTab === 'system' ? 'glow-text' : ''} />
            <span className="mono text-[8px] font-black tracking-[0.2em] uppercase">SYS_CORE</span>
            {activeTab === 'system' && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[#5B8CFF] shadow-[0_0_10px_#5B8CFF]"></div>
            )}
          </button>

          <button 
            onClick={() => onTabChange('profile')}
            className={`relative flex flex-col items-center justify-center gap-1 transition-all flex-1 h-full active:scale-90 ${activeTab === 'profile' ? 'text-[#5B8CFF]' : 'text-gray-700'}`}
          >
            <UserCircle2 size={22} strokeWidth={activeTab === 'profile' ? 2.5 : 1.5} className={activeTab === 'profile' ? 'glow-text' : ''} />
            <span className="mono text-[8px] font-black tracking-[0.2em] uppercase">USR_DATA</span>
            {activeTab === 'profile' && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[#5B8CFF] shadow-[0_0_10px_#5B8CFF]"></div>
            )}
          </button>
        </nav>
      )}
    </div>
  );
};
