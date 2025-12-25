
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
    <div className="flex flex-col h-[100dvh] w-full max-w-md mx-auto relative bg-[#0E1015] overflow-hidden shadow-2xl">
      {/* Scrollable Content Zone */}
      <main className="flex-1 overflow-y-auto hide-scrollbar z-10 relative scroll-smooth overscroll-contain">
        {children}
      </main>
      
      {/* Bottom Navigation Panel */}
      {!isNavHidden && (
        <nav className="bg-[#12151E] border-t border-white/5 flex items-stretch justify-around z-50 shrink-0" 
             style={{ 
               paddingBottom: 'env(safe-area-inset-bottom, 20px)',
               minHeight: 'calc(70px + env(safe-area-inset-bottom, 0px))' 
             }}>
          
          <button 
            onClick={() => onTabChange('system')}
            className={`relative flex flex-col items-center justify-center gap-1.5 transition-all flex-1 pt-4 pb-2 active:scale-95 ${activeTab === 'system' ? 'text-[#5B8CFF]' : 'text-gray-500'}`}
          >
            {activeTab === 'system' && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-[3px] bg-[#5B8CFF] shadow-[0_0_12px_rgba(91,140,255,1)] rounded-b-full"></div>
            )}
            <LayoutGrid size={24} strokeWidth={activeTab === 'system' ? 2.5 : 2} className={activeTab === 'system' ? 'drop-shadow-[0_0_8px_rgba(91,140,255,0.4)]' : ''} />
            <span className="mono text-[9px] font-black tracking-[0.15em] uppercase">SYS_CORE</span>
          </button>

          <button 
            onClick={() => onTabChange('profile')}
            className={`relative flex flex-col items-center justify-center gap-1.5 transition-all flex-1 pt-4 pb-2 active:scale-95 ${activeTab === 'profile' ? 'text-[#5B8CFF]' : 'text-gray-500'}`}
          >
            {activeTab === 'profile' && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-[3px] bg-[#5B8CFF] shadow-[0_0_12px_rgba(91,140,255,1)] rounded-b-full"></div>
            )}
            <UserCircle2 size={24} strokeWidth={activeTab === 'profile' ? 2.5 : 2} className={activeTab === 'profile' ? 'drop-shadow-[0_0_8px_rgba(91,140,255,0.4)]' : ''} />
            <span className="mono text-[9px] font-black tracking-[0.15em] uppercase">USR_DATA</span>
          </button>
        </nav>
      )}
    </div>
  );
};
