
import React from 'react';
import { Screen } from '../App';
import { UserProfile } from '../types';
import { LucideCamera, LucideHistory, LucideSettings, LucideGrid, LucideStar } from 'lucide-react';

interface HomeProps {
  navigate: (screen: Screen) => void;
  user: UserProfile;
  recentHistory: any[];
}

export const Home: React.FC<HomeProps> = ({ navigate, user, recentHistory }) => {
  const accentColor = user.theme.accentColor;

  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AuraScan</h1>
          <p className="text-sm opacity-60">Intelligence for your wellness</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => navigate('settings')} className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <LucideSettings size={22} />
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        <div className="relative">
          {/* Animated rings */}
          <div className="absolute inset-0 rounded-full border border-white/5 animate-ping opacity-20" style={{ animationDuration: '3s' }}></div>
          <div className="absolute -inset-4 rounded-full border border-white/10 animate-pulse opacity-10"></div>
          
          <button 
            onClick={() => navigate('scan')}
            className="relative w-40 h-40 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-2xl"
            style={{ backgroundColor: accentColor }}
          >
            <div className="flex flex-col items-center text-white">
              <LucideCamera size={48} className="mb-2" />
              <span className="font-bold text-lg">SCAN</span>
            </div>
          </button>
        </div>

        <div className="text-center max-w-xs">
          <p className="text-lg font-medium">Ready to analyze</p>
          <p className="text-sm opacity-50">Point your camera at a product label for instant intelligence</p>
        </div>
      </div>

      {/* Navigation Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { icon: LucideHistory, label: 'History', screen: 'history' as Screen },
          { icon: LucideStar, label: 'Favorites', screen: 'history' as Screen },
          { icon: LucideGrid, label: 'Tools', screen: 'tools' as Screen },
          { icon: LucideSettings, label: 'Settings', screen: 'settings' as Screen },
        ].map((item, idx) => (
          <button 
            key={idx}
            onClick={() => navigate(item.screen)}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="p-3 rounded-2xl bg-white/5 group-active:scale-90 transition-all">
              <item.icon size={20} className="opacity-70 group-hover:opacity-100" />
            </div>
            <span className="text-[10px] uppercase tracking-widest opacity-40 font-bold">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Recent Activity */}
      {recentHistory.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest opacity-40">Recent Activity</h3>
          <div className="space-y-3">
            {recentHistory.map((item) => (
              <div 
                key={item.id} 
                className="p-4 rounded-2xl bg-white/5 flex items-center justify-between group cursor-pointer"
                onClick={() => navigate('history')}
              >
                <div>
                  <p className="font-semibold text-sm">{item.name}</p>
                  <p className="text-xs opacity-50">{item.brand}</p>
                </div>
                <div className="text-[10px] opacity-30">
                  {new Date(item.timestamp).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
