
import React from 'react';
import { UserProfile, ThemeMode, AnimationIntensity } from '../types';
import { LucideChevronLeft, LucideUser, LucideEye, LucideActivity, LucideShieldCheck, LucideDatabase } from 'lucide-react';
import { ACCENT_COLORS, ALLERGENS } from '../constants';

interface SettingsProps {
  user: UserProfile;
  updateProfile: (p: UserProfile) => void;
  onBack: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, updateProfile, onBack }) => {
  return (
    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
      <div className="p-6 sticky top-0 z-20 bg-inherit/80 backdrop-blur-md flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/5"><LucideChevronLeft /></button>
        <h2 className="text-xl font-bold">Settings</h2>
      </div>

      <div className="p-6 space-y-8">
        {/* Profile */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 opacity-40">
            <LucideUser size={16} />
            <h3 className="text-[10px] font-bold uppercase tracking-widest">Health Profile</h3>
          </div>
          <div className="bg-white/5 rounded-3xl p-6 space-y-6">
            <div>
              <p className="text-sm font-bold mb-4">Tracked Allergens</p>
              <div className="flex flex-wrap gap-2">
                {ALLERGENS.map(a => (
                  <button 
                    key={a}
                    onClick={() => {
                      const next = user.allergens.includes(a) ? user.allergens.filter(x => x !== a) : [...user.allergens, a];
                      updateProfile({ ...user, allergens: next });
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${user.allergens.includes(a) ? 'bg-blue-600 text-white' : 'bg-white/5'}`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">Expert Mode</p>
                <p className="text-xs opacity-50">Show detailed chemical data</p>
              </div>
              <button 
                onClick={() => updateProfile({ ...user, expertMode: !user.expertMode })}
                className={`w-12 h-6 rounded-full transition-all relative ${user.expertMode ? 'bg-blue-600' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${user.expertMode ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 opacity-40">
            <LucideEye size={16} />
            <h3 className="text-[10px] font-bold uppercase tracking-widest">Appearance</h3>
          </div>
          <div className="bg-white/5 rounded-3xl p-6 space-y-6">
            <div>
              <p className="text-sm font-bold mb-4">Accent Color</p>
              <div className="flex justify-between">
                {ACCENT_COLORS.map(c => (
                  <button 
                    key={c.value}
                    onClick={() => updateProfile({ ...user, theme: { ...user.theme, accentColor: c.value }})}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${user.theme.accentColor === c.value ? 'border-white scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold">Dark Mode</p>
              <button 
                onClick={() => updateProfile({ ...user, theme: { ...user.theme, mode: user.theme.mode === ThemeMode.DARK ? ThemeMode.LIGHT : ThemeMode.DARK }})}
                className={`w-12 h-6 rounded-full transition-all relative ${user.theme.mode === ThemeMode.DARK ? 'bg-blue-600' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${user.theme.mode === ThemeMode.DARK ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </div>

        {/* Data */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 opacity-40">
            <LucideDatabase size={16} />
            <h3 className="text-[10px] font-bold uppercase tracking-widest">Data Management</h3>
          </div>
          <button className="w-full p-4 bg-white/5 rounded-2xl text-left text-sm font-bold flex items-center justify-between group">
            Clear Scan History
            <LucideChevronLeft size={16} className="rotate-180 opacity-40 group-hover:opacity-100" />
          </button>
          <button className="w-full p-4 bg-red-600/10 text-red-400 rounded-2xl text-left text-sm font-bold flex items-center justify-between">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};
