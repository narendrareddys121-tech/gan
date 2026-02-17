
import React, { useState } from 'react';
import { UserProfile, ThemeMode, AnimationIntensity } from '../types';
import { ALLERGENS, DIETARY_PREFS, ACCENT_COLORS } from '../constants';
import { LucideChevronRight, LucideCheck } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
  updateProfile: (p: UserProfile) => void;
  user: UserProfile;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, updateProfile, user }) => {
  const [step, setStep] = useState(0);

  const toggleAllergen = (a: string) => {
    const next = user.allergens.includes(a) 
      ? user.allergens.filter(x => x !== a)
      : [...user.allergens, a];
    updateProfile({ ...user, allergens: next });
  };

  const steps = [
    {
      title: "Welcome to AuraScan",
      subtitle: "Intelligent product analysis that fits your lifestyle.",
      content: (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-32 h-32 rounded-full bg-blue-600/20 flex items-center justify-center animate-pulse">
            <div className="w-20 h-20 rounded-full bg-blue-600 shadow-2xl flex items-center justify-center">
              <LucideCheck className="text-white" size={40} />
            </div>
          </div>
          <p className="opacity-60 text-sm px-8">We use advanced AI vision to decode ingredient labels and help you make safer, healthier choices instantly.</p>
        </div>
      )
    },
    {
      title: "Your Health Profile",
      subtitle: "Select any allergens or sensitivities we should watch for.",
      content: (
        <div className="flex-1 overflow-y-auto pt-4 pb-8 no-scrollbar">
          <div className="grid grid-cols-2 gap-3 px-2">
            {ALLERGENS.map(a => (
              <button 
                key={a}
                onClick={() => toggleAllergen(a)}
                className={`p-4 rounded-2xl border transition-all text-sm font-semibold flex items-center justify-between ${user.allergens.includes(a) ? 'bg-blue-600 border-blue-600 text-white' : 'border-white/10 bg-white/5'}`}
              >
                {a}
                {user.allergens.includes(a) && <LucideCheck size={14} />}
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Visual Identity",
      subtitle: "Choose how AuraScan looks and feels on your device.",
      content: (
        <div className="space-y-8 pt-4">
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest opacity-40">Accent Color</h4>
            <div className="flex justify-between">
              {ACCENT_COLORS.map(c => (
                <button 
                  key={c.value}
                  onClick={() => updateProfile({ ...user, theme: { ...user.theme, accentColor: c.value }})}
                  className={`w-14 h-14 rounded-full border-4 transition-all ${user.theme.accentColor === c.value ? 'border-white' : 'border-transparent'}`}
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest opacity-40">Theme Mode</h4>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => updateProfile({ ...user, theme: { ...user.theme, mode: ThemeMode.DARK }})}
                className={`p-4 rounded-2xl border text-sm font-bold ${user.theme.mode === ThemeMode.DARK ? 'bg-white text-black' : 'border-white/10'}`}
              >
                Dark
              </button>
              <button 
                onClick={() => updateProfile({ ...user, theme: { ...user.theme, mode: ThemeMode.LIGHT }})}
                className={`p-4 rounded-2xl border text-sm font-bold ${user.theme.mode === ThemeMode.LIGHT ? 'bg-black text-white' : 'border-white/10'}`}
              >
                Light
              </button>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (step === steps.length - 1) {
      onComplete();
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-8">
      <div className="flex-1 flex flex-col">
        <div className="mb-10">
          <div className="flex gap-2 mb-4">
            {steps.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-blue-600' : 'w-4 bg-white/10'}`}></div>
            ))}
          </div>
          <h2 className="text-3xl font-black tracking-tight mb-2">{steps[step].title}</h2>
          <p className="opacity-50 text-sm leading-relaxed">{steps[step].subtitle}</p>
        </div>
        
        {steps[step].content}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button onClick={() => setStep(s => Math.max(0, s - 1))} className={`text-sm font-bold opacity-40 hover:opacity-100 ${step === 0 ? 'invisible' : ''}`}>Back</button>
        <button 
          onClick={nextStep}
          className="px-8 py-4 bg-blue-600 rounded-full text-white font-bold flex items-center gap-2 hover:scale-105 transition-transform"
        >
          {step === steps.length - 1 ? 'Get Started' : 'Next'}
          <LucideChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
