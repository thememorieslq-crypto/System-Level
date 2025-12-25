
import React from 'react';
import { Archetype } from '../types';
import { Shield, Zap, Target, Binary } from 'lucide-react';

interface ClassSelectionOverlayProps {
  onSelect: (archetype: Archetype) => void;
}

export const ClassSelectionOverlay: React.FC<ClassSelectionOverlayProps> = ({ onSelect }) => {
  const options = [
    {
      id: 'TITAN' as Archetype,
      icon: <Shield size={20} />,
      title: 'TITAN // TANK',
      desc: 'ПРИСЕДАНИЯ. +20% XP.',
      color: 'border-[#5B8CFF] text-[#5B8CFF]'
    },
    {
      id: 'STRIKER' as Archetype,
      icon: <Target size={20} />,
      title: 'STRIKER // SPEED',
      desc: 'ОТЖИМАНИЯ. +20% XP.',
      color: 'border-[#EF4444] text-[#EF4444]'
    },
    {
      id: 'SPECTRE' as Archetype,
      icon: <Zap size={20} />,
      title: 'SPECTRE // CORE',
      desc: 'ПЛАНКА. +20% XP.',
      color: 'border-[#10B981] text-[#10B981]'
    }
  ];

  return (
    <div className="fixed inset-0 bg-[#0E1015] z-[300] flex flex-col p-4 overflow-hidden">
      <div className="mt-6 flex flex-col gap-0.5 mb-4">
        <div className="flex items-center gap-2">
            <Binary size={10} className="text-[#5B8CFF]" />
            <span className="mono text-[8px] text-[#5B8CFF] font-bold tracking-[0.3em] uppercase">SYSTEM_EVOLUTION</span>
        </div>
        <h1 className="text-2xl font-black tracking-tighter uppercase text-white glow-text">CHOOSE_PATH</h1>
        <p className="mono text-[7px] text-gray-500 uppercase tracking-widest leading-tight">
            Выберите архетип. Выбор необратим.
        </p>
      </div>

      <div className="flex flex-col gap-3 flex-1 overflow-y-auto hide-scrollbar">
        {options.map((opt) => (
          <button 
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={`flex flex-col gap-1.5 p-3 tech-border bg-[#141824] transition-all active:scale-[0.98] ${opt.color} bg-opacity-5 border-opacity-30 hover:border-opacity-100 group`}
          >
            <div className="flex items-center gap-3">
                <div className="p-1.5 tech-border border-inherit">
                    {opt.icon}
                </div>
                <h3 className="text-lg font-black tracking-tighter uppercase text-white group-hover:text-inherit transition-colors leading-none">
                    {opt.title}
                </h3>
            </div>
            <p className="text-left mono text-[8px] text-gray-400 font-medium uppercase tracking-tight leading-snug">
                {opt.desc}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
