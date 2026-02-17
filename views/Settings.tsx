
import React, { useState } from 'react';
import { UserProfile, ThemeMode, AnimationIntensity } from '../types';
import { 
  LucideChevronLeft, LucideUser, LucideEye, LucideDatabase, 
  LucideBell, LucideShieldCheck, LucideGlobe, LucideDownload,
  LucideZap, LucidePalette, LucideAccessibility, LucideKey,
  LucideSmartphone, LucideHelpCircle, LucideChevronRight
} from 'lucide-react';
import { ACCENT_COLORS, ALLERGENS, DIETARY_PREFS } from '../constants';
import { Toggle, Card, Badge } from '../components';

interface SettingsProps {
  user: UserProfile;
  updateProfile: (p: UserProfile) => void;
  onBack: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, updateProfile, onBack }) => {
  const [showExportConfirm, setShowExportConfirm] = useState(false);

  const exportData = (format: 'json' | 'csv') => {
    // Placeholder for export functionality
    console.log(`Exporting data as ${format}`);
    setShowExportConfirm(true);
    setTimeout(() => setShowExportConfirm(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar relative">
      {/* Header */}
      <div className="p-6 sticky top-0 z-20 bg-inherit/95 backdrop-blur-xl border-b border-white/5 flex items-center gap-4">
        <button 
          onClick={onBack} 
          className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-all hover:scale-110 active:scale-95"
        >
          <LucideChevronLeft />
        </button>
        <h2 className="text-xl font-bold">Settings & Preferences</h2>
      </div>

      <div className="p-6 space-y-8 pb-20">
        {/* Health Profile */}
        <section className="space-y-4 animate-fade-in-up">
          <div className="flex items-center gap-2 opacity-40">
            <LucideUser size={16} />
            <h3 className="text-[10px] font-bold uppercase tracking-widest">Health Profile</h3>
          </div>
          
          <Card variant="default" padding="lg">
            <div className="space-y-6">
              {/* Allergens */}
              <div>
                <p className="text-sm font-bold mb-4">Tracked Allergens</p>
                <div className="flex flex-wrap gap-2">
                  {ALLERGENS.map(a => (
                    <button 
                      key={a}
                      onClick={() => {
                        const next = user.allergens.includes(a) 
                          ? user.allergens.filter(x => x !== a) 
                          : [...user.allergens, a];
                        updateProfile({ ...user, allergens: next });
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                        user.allergens.includes(a) 
                          ? 'bg-red-500/20 border-2 border-red-500 text-red-400' 
                          : 'bg-white/5 border-2 border-transparent hover:border-white/20'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dietary Restrictions */}
              <div>
                <p className="text-sm font-bold mb-4">Dietary Preferences</p>
                <div className="flex flex-wrap gap-2">
                  {DIETARY_PREFS.map(pref => (
                    <button 
                      key={pref}
                      onClick={() => {
                        const next = user.dietaryRestrictions.includes(pref)
                          ? user.dietaryRestrictions.filter(x => x !== pref)
                          : [...user.dietaryRestrictions, pref];
                        updateProfile({ ...user, dietaryRestrictions: next });
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                        user.dietaryRestrictions.includes(pref)
                          ? 'bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400'
                          : 'bg-white/5 border-2 border-transparent hover:border-white/20'
                      }`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>

              {/* Expert Mode */}
              <div className="pt-4 border-t border-white/5">
                <Toggle
                  checked={user.expertMode}
                  onChange={(checked) => updateProfile({ ...user, expertMode: checked })}
                  label="Expert Mode"
                  description="Show detailed scientific data and advanced metrics"
                />
              </div>
            </div>
          </Card>
        </section>

        {/* Appearance & Theme */}
        <section className="space-y-4 animate-fade-in-up stagger-1">
          <div className="flex items-center gap-2 opacity-40">
            <LucidePalette size={16} />
            <h3 className="text-[10px] font-bold uppercase tracking-widest">Appearance & Theme</h3>
          </div>
          
          <Card variant="default" padding="lg">
            <div className="space-y-6">
              {/* Accent Color */}
              <div>
                <p className="text-sm font-bold mb-4">Accent Color</p>
                <div className="flex justify-between">
                  {ACCENT_COLORS.map(c => (
                    <button 
                      key={c.value}
                      onClick={() => updateProfile({ ...user, theme: { ...user.theme, accentColor: c.value }})}
                      className={`relative transition-all hover:scale-110 ${
                        user.theme.accentColor === c.value ? 'scale-110' : ''
                      }`}
                    >
                      <div 
                        className={`w-12 h-12 rounded-full border-4 transition-all ${
                          user.theme.accentColor === c.value ? 'border-white shadow-lg' : 'border-transparent'
                        }`}
                        style={{ 
                          backgroundColor: c.value,
                          boxShadow: user.theme.accentColor === c.value ? `0 0 20px ${c.value}60` : 'none'
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Mode */}
              <div>
                <Toggle
                  checked={user.theme.mode === ThemeMode.DARK}
                  onChange={(checked) => updateProfile({ 
                    ...user, 
                    theme: { ...user.theme, mode: checked ? ThemeMode.DARK : ThemeMode.LIGHT }
                  })}
                  label="Dark Mode"
                  description="Use dark theme for reduced eye strain"
                />
              </div>

              {/* Animation Intensity */}
              <div>
                <p className="text-sm font-bold mb-4">Animation Intensity</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: AnimationIntensity.MINIMAL, label: 'Minimal', icon: '—' },
                    { value: AnimationIntensity.MODERATE, label: 'Moderate', icon: '~' },
                    { value: AnimationIntensity.FULL, label: 'Full', icon: '✨' }
                  ].map((option) => (
                    <button 
                      key={option.value}
                      onClick={() => updateProfile({ ...user, theme: { ...user.theme, animationIntensity: option.value }})}
                      className={`p-4 rounded-2xl border-2 text-xs font-bold transition-all ${
                        user.theme.animationIntensity === option.value
                          ? 'bg-blue-600 border-blue-600 text-white scale-105' 
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-lg mb-1">{option.icon}</div>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-bold">Font Size</p>
                  <Badge variant="neutral" size="sm">{user.theme.fontSize}px</Badge>
                </div>
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
              </div>
            </div>
          </Card>
        </section>

        {/* Accessibility */}
        <section className="space-y-4 animate-fade-in-up stagger-2">
          <div className="flex items-center gap-2 opacity-40">
            <LucideAccessibility size={16} />
            <h3 className="text-[10px] font-bold uppercase tracking-widest">Accessibility</h3>
          </div>
          
          <Card variant="default" padding="lg">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-bold">High Contrast Mode</p>
                  <p className="text-xs opacity-50 mt-1">Increase visual contrast for better readability</p>
                </div>
                <div className="w-12 h-6 bg-white/10 rounded-full"></div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-bold">Reduce Motion</p>
                  <p className="text-xs opacity-50 mt-1">Minimize animations for accessibility</p>
                </div>
                <Badge variant={user.theme.animationIntensity === AnimationIntensity.MINIMAL ? 'success' : 'neutral'} size="sm">
                  {user.theme.animationIntensity === AnimationIntensity.MINIMAL ? 'Active' : 'Off'}
                </Badge>
              </div>
            </div>
          </Card>
        </section>

        {/* Notifications */}
        <section className="space-y-4 animate-fade-in-up stagger-3">
          <div className="flex items-center gap-2 opacity-40">
            <LucideBell size={16} />
            <h3 className="text-[10px] font-bold uppercase tracking-widest">Notifications</h3>
          </div>
          
          <Card variant="default" padding="lg">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-bold">Product Reformulations</p>
                  <p className="text-xs opacity-50 mt-1">Get notified when tracked products change</p>
                </div>
                <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                  <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-bold">Price Changes</p>
                  <p className="text-xs opacity-50 mt-1">Alerts for price drops on favorites</p>
                </div>
                <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                  <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-bold">Allergen Warnings</p>
                  <p className="text-xs opacity-50 mt-1">Critical alerts for allergen detection</p>
                </div>
                <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                  <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Data & Privacy */}
        <section className="space-y-4 animate-fade-in-up stagger-4">
          <div className="flex items-center gap-2 opacity-40">
            <LucideShieldCheck size={16} />
            <h3 className="text-[10px] font-bold uppercase tracking-widest">Data & Privacy</h3>
          </div>
          
          <Card variant="default" padding="lg">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-bold">Cloud Backup</p>
                  <p className="text-xs opacity-50 mt-1">Sync data across all your devices</p>
                </div>
                <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                  <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-bold">Data Encryption</p>
                  <p className="text-xs opacity-50 mt-1">End-to-end encryption enabled</p>
                </div>
                <Badge variant="success" size="sm" icon="🔒">Protected</Badge>
              </div>
            </div>
          </Card>
        </section>

        {/* Export Data */}
        <section className="space-y-4 animate-fade-in-up stagger-5">
          <div className="flex items-center gap-2 opacity-40">
            <LucideDownload size={16} />
            <h3 className="text-[10px] font-bold uppercase tracking-widest">Data Export</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => exportData('json')}
              className="p-5 bg-white/5 border border-white/5 rounded-2xl text-left hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <LucideDownload size={20} className="mb-3 opacity-60" />
              <p className="text-sm font-bold">Export JSON</p>
              <p className="text-[10px] opacity-40 mt-1">Complete data backup</p>
            </button>
            <button 
              onClick={() => exportData('csv')}
              className="p-5 bg-white/5 border border-white/5 rounded-2xl text-left hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <LucideDownload size={20} className="mb-3 opacity-60" />
              <p className="text-sm font-bold">Export CSV</p>
              <p className="text-[10px] opacity-40 mt-1">Spreadsheet format</p>
            </button>
          </div>
        </section>

        {/* Account Management */}
        <section className="space-y-4 animate-fade-in-up stagger-6">
          <div className="flex items-center gap-2 opacity-40">
            <LucideKey size={16} />
            <h3 className="text-[10px] font-bold uppercase tracking-widest">Account Management</h3>
          </div>
          
          <div className="space-y-3">
            <button className="w-full p-5 bg-white/5 border border-white/5 rounded-2xl text-left text-sm font-bold flex items-center justify-between group hover:bg-white/10 transition-all">
              <div className="flex items-center gap-3">
                <LucideKey size={18} className="opacity-60" />
                <span>Change Password</span>
              </div>
              <LucideChevronRight size={16} className="opacity-40 group-hover:opacity-100" />
            </button>

            <button className="w-full p-5 bg-white/5 border border-white/5 rounded-2xl text-left text-sm font-bold flex items-center justify-between group hover:bg-white/10 transition-all">
              <div className="flex items-center gap-3">
                <LucideShieldCheck size={18} className="opacity-60" />
                <span>Two-Factor Authentication</span>
              </div>
              <Badge variant="warning" size="sm">Recommended</Badge>
            </button>

            <button className="w-full p-5 bg-white/5 border border-white/5 rounded-2xl text-left text-sm font-bold flex items-center justify-between group hover:bg-white/10 transition-all">
              <div className="flex items-center gap-3">
                <LucideSmartphone size={18} className="opacity-60" />
                <span>Linked Devices</span>
              </div>
              <Badge variant="neutral" size="sm">2 Active</Badge>
            </button>
          </div>
        </section>

        {/* Language & Region */}
        <section className="space-y-4 animate-fade-in-up stagger-7">
          <div className="flex items-center gap-2 opacity-40">
            <LucideGlobe size={16} />
            <h3 className="text-[10px] font-bold uppercase tracking-widest">Language & Region</h3>
          </div>
          
          <button className="w-full p-5 bg-white/5 border border-white/5 rounded-2xl text-left text-sm font-bold flex items-center justify-between group hover:bg-white/10 transition-all">
            <div className="flex items-center gap-3">
              <span>Language</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs opacity-60">English (US)</span>
              <LucideChevronRight size={16} className="opacity-40 group-hover:opacity-100" />
            </div>
          </button>
        </section>

        {/* Support */}
        <section className="space-y-4 animate-fade-in-up stagger-8">
          <div className="flex items-center gap-2 opacity-40">
            <LucideHelpCircle size={16} />
            <h3 className="text-[10px] font-bold uppercase tracking-widest">Help & Support</h3>
          </div>
          
          <div className="space-y-3">
            <button className="w-full p-5 bg-white/5 border border-white/5 rounded-2xl text-left text-sm font-bold flex items-center justify-between group hover:bg-white/10 transition-all">
              Help Center
              <LucideChevronRight size={16} className="opacity-40 group-hover:opacity-100" />
            </button>
            <button className="w-full p-5 bg-white/5 border border-white/5 rounded-2xl text-left text-sm font-bold flex items-center justify-between group hover:bg-white/10 transition-all">
              Send Feedback
              <LucideChevronRight size={16} className="opacity-40 group-hover:opacity-100" />
            </button>
            <button className="w-full p-5 bg-white/5 border border-white/5 rounded-2xl text-left text-sm font-bold flex items-center justify-between group hover:bg-white/10 transition-all">
              Privacy Policy
              <LucideChevronRight size={16} className="opacity-40 group-hover:opacity-100" />
            </button>
            <button className="w-full p-5 bg-white/5 border border-white/5 rounded-2xl text-left text-sm font-bold flex items-center justify-between group hover:bg-white/10 transition-all">
              Terms of Service
              <LucideChevronRight size={16} className="opacity-40 group-hover:opacity-100" />
            </button>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="space-y-4 animate-fade-in-up stagger-9">
          <div className="flex items-center gap-2 opacity-40">
            <LucideDatabase size={16} />
            <h3 className="text-[10px] font-bold uppercase tracking-widest">Danger Zone</h3>
          </div>
          
          <div className="space-y-3">
            <button className="w-full p-5 bg-amber-500/5 border border-amber-500/20 rounded-2xl text-left text-sm font-bold flex items-center justify-between hover:bg-amber-500/10 transition-all text-amber-400">
              <span>Clear Scan History</span>
              <LucideChevronRight size={16} className="opacity-60" />
            </button>
            <button className="w-full p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-left text-sm font-bold flex items-center justify-between hover:bg-red-500/20 transition-all text-red-400">
              <span>Delete Account</span>
              <LucideChevronRight size={16} className="opacity-60" />
            </button>
          </div>
        </section>

        {/* App Version */}
        <div className="text-center opacity-30 text-xs pt-8">
          <p>AuraScan AI v1.0.0</p>
          <p className="mt-1">© 2024 AuraScan. All rights reserved.</p>
        </div>
      </div>

      {/* Export Success Toast */}
      {showExportConfirm && (
        <div className="fixed bottom-6 left-6 right-6 z-50 animate-slide-in-left">
          <div className="bg-emerald-500/90 backdrop-blur-md border border-emerald-400/20 rounded-2xl p-4 flex items-center gap-3 shadow-xl">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              ✓
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">Export Complete</p>
              <p className="text-xs text-white/80">Your data has been exported successfully</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
