
import React, { useState } from 'react';
import { UserProfile, ThemeMode, AnimationIntensity } from '../types';
import { ALLERGENS, DIETARY_PREFS, ACCENT_COLORS } from '../constants';
import { LucideChevronRight, LucideCheck, LucideShield, LucideZap, LucidePalette, LucideSparkles } from 'lucide-react';

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

  const toggleDietaryPref = (pref: string) => {
    const next = user.dietaryRestrictions.includes(pref)
      ? user.dietaryRestrictions.filter(x => x !== pref)
      : [...user.dietaryRestrictions, pref];
    updateProfile({ ...user, dietaryRestrictions: next });
  };

  const steps = [
    {
      title: "Welcome to AuraScan",
      subtitle: "Intelligent product analysis that fits your lifestyle",
      icon: LucideShield,
      content: (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 animate-fade-in-up">
          <div className="w-32 h-32 rounded-full bg-blue-600/20 flex items-center justify-center animate-pulse relative">
            <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full animate-ping"></div>
            <div className="w-20 h-20 rounded-full bg-blue-600 shadow-2xl shadow-blue-500/50 flex items-center justify-center">
              <LucideCheck className="text-white" size={40} />
            </div>
          </div>
          
          <div className="space-y-4 px-4">
            <h3 className="text-xl font-bold">Your AI-Powered Wellness Companion</h3>
            <p className="opacity-60 text-sm leading-relaxed max-w-sm">
              We use advanced AI vision to decode ingredient labels and help you make safer, healthier choices instantly.
            </p>
          </div>

          {/* Key Benefits */}
          <div className="w-full space-y-3 px-4">
            {[
              { icon: LucideZap, text: 'Instant product analysis' },
              { icon: LucideShield, text: 'Personalized safety alerts' },
              { icon: LucideSparkles, text: 'Smart recommendations' }
            ].map((benefit, i) => (
              <div 
                key={i}
                className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="p-2 bg-blue-600/20 rounded-xl">
                  <benefit.icon size={18} className="text-blue-400" />
                </div>
                <p className="text-sm font-medium">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Your Health Profile",
      subtitle: "Help us keep you safe by selecting allergens and sensitivities",
      icon: LucideShield,
      content: (
        <div className="flex-1 overflow-y-auto pt-4 pb-8 no-scrollbar space-y-6">
          {/* Allergens */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest opacity-40 px-2">Allergens & Sensitivities</h4>
            <div className="grid grid-cols-2 gap-3 px-2">
              {ALLERGENS.map((a, i) => (
                <button 
                  key={a}
                  onClick={() => toggleAllergen(a)}
                  className={`p-4 rounded-2xl border-2 transition-all text-sm font-semibold flex items-center justify-between animate-fade-in-up ${
                    user.allergens.includes(a) 
                      ? 'bg-red-500/10 border-red-500 text-red-400' 
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {a}
                  {user.allergens.includes(a) && <LucideCheck size={16} />}
                </button>
              ))}
            </div>
          </div>

          {/* Dietary Preferences */}
          <div className="space-y-4 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-widest opacity-40 px-2">Dietary Preferences</h4>
            <div className="grid grid-cols-2 gap-3 px-2">
              {DIETARY_PREFS.map((pref, i) => (
                <button 
                  key={pref}
                  onClick={() => toggleDietaryPref(pref)}
                  className={`p-4 rounded-2xl border-2 transition-all text-sm font-semibold flex items-center justify-between animate-fade-in-up ${
                    user.dietaryRestrictions.includes(pref)
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                  style={{ animationDelay: `${(ALLERGENS.length + i) * 50}ms` }}
                >
                  {pref}
                  {user.dietaryRestrictions.includes(pref) && <LucideCheck size={16} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Visual Identity",
      subtitle: "Customize how AuraScan looks and feels on your device",
      icon: LucidePalette,
      content: (
        <div className="flex-1 pt-4 space-y-8 overflow-y-auto no-scrollbar">
          {/* Accent Color */}
          <div className="space-y-4 animate-fade-in-up">
            <h4 className="text-xs font-bold uppercase tracking-widest opacity-40">Accent Color</h4>
            <div className="flex justify-between px-2">
              {ACCENT_COLORS.map((c, i) => (
                <button 
                  key={c.value}
                  onClick={() => updateProfile({ ...user, theme: { ...user.theme, accentColor: c.value }})}
                  className={`relative transition-all hover:scale-110 ${
                    user.theme.accentColor === c.value ? 'scale-110' : ''
                  }`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div 
                    className={`w-16 h-16 rounded-full border-4 transition-all ${
                      user.theme.accentColor === c.value ? 'border-white shadow-lg' : 'border-transparent'
                    }`}
                    style={{ 
                      backgroundColor: c.value,
                      boxShadow: user.theme.accentColor === c.value ? `0 0 30px ${c.value}60` : 'none'
                    }}
                  />
                  <p className="text-[10px] mt-2 opacity-50 font-medium">{c.name.split(' ')[0]}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Mode */}
          <div className="space-y-4 animate-fade-in-up stagger-1">
            <h4 className="text-xs font-bold uppercase tracking-widest opacity-40">Theme Mode</h4>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => updateProfile({ ...user, theme: { ...user.theme, mode: ThemeMode.DARK }})}
                className={`p-6 rounded-2xl border-2 text-sm font-bold transition-all ${
                  user.theme.mode === ThemeMode.DARK 
                    ? 'bg-white/10 border-white text-white shadow-lg' 
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="mb-3 w-full h-16 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-white/10"></div>
                Dark Mode
              </button>
              <button 
                onClick={() => updateProfile({ ...user, theme: { ...user.theme, mode: ThemeMode.LIGHT }})}
                className={`p-6 rounded-2xl border-2 text-sm font-bold transition-all ${
                  user.theme.mode === ThemeMode.LIGHT 
                    ? 'bg-black/10 border-black shadow-lg' 
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="mb-3 w-full h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl border border-gray-300"></div>
                Light Mode
              </button>
            </div>
          </div>

          {/* Animation Intensity */}
          <div className="space-y-4 animate-fade-in-up stagger-2">
            <h4 className="text-xs font-bold uppercase tracking-widest opacity-40">Animation Intensity</h4>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: AnimationIntensity.MINIMAL, label: 'Minimal' },
                { value: AnimationIntensity.MODERATE, label: 'Moderate' },
                { value: AnimationIntensity.FULL, label: 'Full' }
              ].map((option) => (
                <button 
                  key={option.value}
                  onClick={() => updateProfile({ ...user, theme: { ...user.theme, animationIntensity: option.value }})}
                  className={`p-4 rounded-2xl border-2 text-xs font-bold transition-all ${
                    user.theme.animationIntensity === option.value
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <p className="text-[10px] opacity-40 text-center">Adjust motion for accessibility and preference</p>
          </div>

          {/* Font Size */}
          <div className="space-y-4 animate-fade-in-up stagger-3 pb-4">
            <h4 className="text-xs font-bold uppercase tracking-widest opacity-40">Font Size</h4>
            <div className="flex items-center gap-4">
              <span className="text-xs opacity-50">A</span>
              <input 
                type="range"
                min="14"
                max="20"
                value={user.theme.fontSize}
                onChange={(e) => updateProfile({ ...user, theme: { ...user.theme, fontSize: parseInt(e.target.value) }})}
                className="flex-1 accent-blue-600"
              />
              <span className="text-lg opacity-50">A</span>
            </div>
            <p className="text-[10px] opacity-40 text-center">Current: {user.theme.fontSize}px</p>
          </div>
        </div>
      )
    },
    {
      title: "Feature Tour",
      subtitle: "Discover what makes AuraScan powerful",
      icon: LucideSparkles,
      content: (
        <div className="flex-1 overflow-y-auto pt-4 pb-8 no-scrollbar space-y-6">
          {[
            {
              icon: '📸',
              title: 'Instant Scanning',
              description: 'Point your camera at any product label for immediate AI analysis',
              color: 'from-blue-600 to-blue-700'
            },
            {
              icon: '🧬',
              title: 'Ingredient Intelligence',
              description: 'Deep dive into every ingredient with scientific explanations and safety profiles',
              color: 'from-violet-600 to-purple-700'
            },
            {
              icon: '⚖️',
              title: 'Product Comparison',
              description: 'Compare multiple products side-by-side to make the best choice',
              color: 'from-cyan-600 to-blue-700'
            },
            {
              icon: '📊',
              title: 'Personal Analytics',
              description: 'Track your consumption patterns and get personalized recommendations',
              color: 'from-emerald-600 to-teal-700'
            }
          ].map((feature, i) => (
            <div 
              key={i}
              className={`p-6 rounded-3xl bg-gradient-to-br ${feature.color} text-white shadow-xl animate-fade-in-up`}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h4 className="font-bold text-lg mb-2">{feature.title}</h4>
              <p className="text-sm opacity-90 leading-relaxed">{feature.description}</p>
            </div>
          ))}

          {/* Advanced Tools Preview */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-3 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
            <div className="flex items-center gap-2">
              <LucideZap size={18} className="text-yellow-400" />
              <h4 className="font-bold text-sm">Advanced Tools Available</h4>
            </div>
            <p className="text-xs opacity-60 leading-relaxed">
              Access powerful features like Batch Scanning, Allergen Search, Sustainability Scoring, and Export capabilities in the Advanced Tools Hub.
            </p>
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
    <div className="flex-1 flex flex-col p-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-violet-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="flex-1 flex flex-col relative z-10">
        {/* Progress Indicators */}
        <div className="mb-8 animate-fade-in-down">
          <div className="flex gap-2 mb-6">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === step ? 'w-12 bg-blue-600' : 
                  i < step ? 'w-8 bg-blue-600/50' : 
                  'w-6 bg-white/10'
                }`}
              ></div>
            ))}
          </div>
          
          {/* Step Icon & Title */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-600/20 rounded-2xl">
              {React.createElement(steps[step].icon, { size: 24, className: 'text-blue-400' })}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-black tracking-tight mb-2">{steps[step].title}</h2>
              <p className="opacity-50 text-sm leading-relaxed">{steps[step].subtitle}</p>
            </div>
          </div>
        </div>
        
        {/* Step Content */}
        <div className="flex-1 overflow-hidden">
          {steps[step].content}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between items-center relative z-10">
        <button 
          onClick={() => setStep(s => Math.max(0, s - 1))} 
          className={`text-sm font-bold opacity-40 hover:opacity-100 transition-opacity ${step === 0 ? 'invisible' : ''}`}
        >
          Back
        </button>
        
        {step > 0 && step < steps.length - 1 && (
          <button 
            onClick={() => { setStep(steps.length - 1); }}
            className="text-sm font-bold opacity-40 hover:opacity-100 transition-opacity"
          >
            Skip
          </button>
        )}
        
        <button 
          onClick={nextStep}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-500/30"
        >
          {step === steps.length - 1 ? 'Get Started' : 'Next'}
          <LucideChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
