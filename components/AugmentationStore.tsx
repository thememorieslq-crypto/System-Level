
import React from 'react';
import { UserState, Augmentation } from '../types';
import { X, Hexagon, Zap, ThermometerSnowflake, Target, Box } from 'lucide-react';

interface StoreProps {
  user: UserState;
  onClose: () => void;
  onBuy: (aug: Augmentation) => void;
}

const ITEMS: Augmentation[] = [
  {
    id: 'heatsink',
    name: 'HEATSINK_MK1',
    desc: 'Мгновенно сбрасывает 2 деления Heat.',
    cost: 5,
    type: 'UTILITY',
    value: 2
  },
  {
    id: 'booster',
    name: 'NEURAL_BOOSTER',
    desc: 'XP +50% на текущий цикл.',
    cost: 8,
    type: 'BUFF',
    value: 1.5
  },
  {
    id: 'siphon',
    name: 'TARGET_SIPHON',
    desc: 'Уменьшает цели квестов на 20%.',
    cost: 10,
    type: 'BUFF',
    value: 0.8
  }
];

export const AugmentationStore: React.FC<StoreProps> = ({ user, onClose, onBuy }) => {
  return (
    <div className="fixed inset-0 bg-black/95 z-[400] flex flex-col p-6 animate-in slide-in-from-bottom duration-500">
      <div className="flex justify-between items-start border-b border-white/5 pb-6 mb-6">
        <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
                <Box size={10} className="text-[#5B8CFF]" />
                <span className="mono text-[8px] text-[#5B8CFF] font-black uppercase tracking-widest">BLACK_MARKET_NODE</span>
            </div>
            <h2 className="text-3xl font-black tracking-tighter uppercase italic">CORE_MODULES</h2>
            <div className="flex items-center gap-2 mt-2">
                <Hexagon size={12} className="text-[#5B8CFF] fill-[#5B8CFF]/20" />
                <span className="mono text-[10px] font-bold text-white">{user.coreFragments} FRAGS_AVAILABLE</span>
            </div>
        </div>
        <button onClick={onClose} className="p-2 text-gray-700 active:scale-90 transition-all">
            <X size={24} />
        </button>
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto hide-scrollbar">
        {ITEMS.map((item) => {
          const canAfford = user.coreFragments >= item.cost;
          return (
            <button 
                key={item.id}
                onClick={() => canAfford && onBuy(item)}
                disabled={!canAfford}
                className={`flex flex-col gap-2 p-4 tech-border transition-all relative overflow-hidden ${canAfford ? 'bg-[#141824] border-[#5B8CFF]/20 active:scale-[0.98]' : 'bg-transparent border-white/5 opacity-40'}`}
            >
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="p-2 tech-border border-inherit">
                            {item.id === 'heatsink' && <ThermometerSnowflake size={18} className="text-[#5B8CFF]" />}
                            {item.id === 'booster' && <Zap size={18} className="text-amber-400" />}
                            {item.id === 'siphon' && <Target size={18} className="text-emerald-400" />}
                        </div>
                        <div className="flex flex-col items-start">
                            <h3 className="text-sm font-black tracking-tight text-white uppercase">{item.name}</h3>
                            <span className="mono text-[6px] font-bold text-gray-500 uppercase">{item.type}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-black/40 tech-border border-white/5">
                        <Hexagon size={8} className="text-[#5B8CFF]" />
                        <span className="mono text-[9px] font-black text-white">{item.cost}</span>
                    </div>
                </div>
                <p className="text-left mono text-[8px] text-gray-400 uppercase tracking-tight leading-snug">
                    {item.desc}
                </p>
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-6 text-center">
        <p className="mono text-[7px] text-gray-800 uppercase tracking-[0.5em]">SYSTEM_VERSION_SUPPLY_CHAIN_V4</p>
      </div>
    </div>
  );
};
