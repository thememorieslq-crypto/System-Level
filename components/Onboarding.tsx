
import React, { useState } from 'react';
import { ShieldCheck, ChevronRight, Terminal } from 'lucide-react';

interface OnboardingProps {
  onStart: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onStart }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: <Terminal className="text-[#5B8CFF]" size={32} />,
      title: "ИНИЦИАЛИЗАЦИЯ_ALPHA",
      desc: "Система выбрала тебя для оптимизации. Твоя реальность теперь — это управляемый интерфейс развития."
    },
    {
      icon: <ShieldCheck className="text-[#5B8CFF]" size={32} />,
      title: "МЕХАНИКА_РОСТА",
      desc: "Выполняй ежедневные задачи для получения XP. С каждым уровнем сложность будет расти автоматически."
    },
    {
      icon: <div className="text-[#EF4444] font-bold text-4xl mono scale-x-125">!</div>,
      title: "ПРОТОКОЛ_ДОЛГА",
      desc: "Пропуск целей ведет к штрафам. Невыполненные задания становятся 'Долгом Системе' с повышенной нагрузкой."
    }
  ];

  return (
    <div className="fixed inset-0 bg-[#0E1015] z-[90] flex flex-col p-8 justify-between overflow-hidden">
      <div className="mt-20 flex flex-col items-center text-center gap-10 relative z-10">
        <div className="w-20 h-20 tech-border flex items-center justify-center bg-[#141824] shadow-[0_0_30px_rgba(91,140,255,0.05)]">
          {steps[step].icon}
        </div>
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold uppercase tracking-tighter leading-tight text-white glow-text">
                {steps[step].title}
            </h1>
            <p className="text-gray-500 leading-relaxed font-medium text-[11px] px-4 mono uppercase tracking-tight">
                {steps[step].desc}
            </p>
        </div>
      </div>

      <div className="flex flex-col gap-6 relative z-10">
        <div className="flex justify-center gap-2 mb-4">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 transition-all duration-500 ${i === step ? 'w-8 bg-[#5B8CFF] shadow-[0_0_10px_#5B8CFF]' : 'w-2 bg-white/5'}`} />
          ))}
        </div>
        
        <button 
          onClick={() => step < steps.length - 1 ? setStep(step + 1) : onStart()}
          className="w-full bg-transparent border border-[#5B8CFF] text-[#5B8CFF] py-5 flex items-center justify-center gap-3 font-bold uppercase tracking-[0.3em] text-[10px] shadow-[0_0_20px_rgba(91,140,255,0.1)] active:scale-[0.98] transition-all group"
        >
          {step === steps.length - 1 ? 'АКТИВИРОВАТЬ СИСТЕМУ' : 'ДАЛЕЕ_'}
          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
