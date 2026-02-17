
import React, { useState } from 'react';
import { Screen } from '../App';
import { UserProfile } from '../types';
import { LucideCamera, LucideHistory, LucideSettings, LucideGrid, LucideStar, LucideZap, LucideUser } from 'lucide-react';

interface HomeProps {
  navigate: (screen: Screen) => void;
  user: UserProfile;
  recentHistory: any[];
}

export const Home: React.FC<HomeProps> = ({ navigate, user, recentHistory }) => {
  const accentColor = user.theme.accentColor;
  const [showMenu, setShowMenu] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar relative">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle Gradient Orbs */}
        <div 
          className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full opacity-30 blur-[120px] animate-pulse"
          style={{ 
            background: `radial-gradient(circle, ${accentColor}15 0%, transparent 70%)`,
            animationDuration: '8s'
          }}
        ></div>
        <div 
          className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-20 blur-[100px] animate-pulse"
          style={{ 
            background: 'radial-gradient(circle, #7C3AED15 0%, transparent 70%)',
            animationDuration: '10s',
            animationDelay: '2s'
          }}
        ></div>
        
        {/* Floating Particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/5 rounded-full animate-float"
            style={{
              left: `${15 + Math.random() * 70}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 flex-1 flex flex-col p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-10 animate-fade-in-down">
          <div>
            <p className="text-sm opacity-50 mb-1">{getGreeting()}</p>
            <h1 className="text-2xl font-bold tracking-tight">AuraScan</h1>
            <p className="text-xs opacity-40 mt-1">Intelligence for your wellness</p>
          </div>
          <div className="flex gap-3">
            {user.expertMode && (
              <div className="px-3 py-1.5 bg-violet-600/20 border border-violet-500/30 rounded-full flex items-center gap-1.5">
                <LucideZap size={12} className="text-violet-400" />
                <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">Expert</span>
              </div>
            )}
            <button 
              onClick={() => navigate('settings')} 
              className="p-2.5 rounded-full hover:bg-white/10 transition-all hover:scale-110 active:scale-95"
            >
              <LucideSettings size={20} />
            </button>
            <button 
              onClick={() => setShowMenu(!showMenu)} 
              className="p-2.5 rounded-full hover:bg-white/10 transition-all hover:scale-110 active:scale-95"
            >
              <LucideUser size={20} />
            </button>
          </div>
        </div>

        {/* Hero Section with Main Scan Button */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-fade-in-up">
          <div className="relative">
            {/* Animated Pulsing Rings */}
            <div 
              className="absolute inset-0 rounded-full border-2 opacity-20 animate-ping"
              style={{ 
                borderColor: accentColor,
                animationDuration: '3s' 
              }}
            ></div>
            <div 
              className="absolute -inset-4 rounded-full border opacity-10 animate-pulse"
              style={{ borderColor: accentColor }}
            ></div>
            
            <button 
              onClick={() => navigate('scan')}
              className="relative w-44 h-44 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-2xl animate-scale-in"
              style={{ 
                backgroundColor: accentColor,
                boxShadow: `0 20px 60px ${accentColor}40, 0 0 40px ${accentColor}30`
              }}
            >
              <div className="flex flex-col items-center text-white">
                <LucideCamera size={52} className="mb-3 drop-shadow-lg" />
                <span className="font-black text-xl tracking-wide">SCAN</span>
              </div>
            </button>
          </div>

          <div className="text-center max-w-xs space-y-2">
            <p className="text-lg font-semibold">Ready to analyze</p>
            <p className="text-sm opacity-50 leading-relaxed">Point your camera at a product label for instant AI-powered intelligence</p>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-4 gap-4 mb-8 animate-fade-in-up stagger-2">
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
              <div 
                className="p-3 rounded-2xl bg-white/5 group-hover:bg-white/10 group-active:scale-90 transition-all border border-white/5"
                style={{ 
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' 
                }}
              >
                <item.icon size={20} className="opacity-70 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-[10px] uppercase tracking-widest opacity-40 font-bold">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Recent Activity */}
        {recentHistory.length > 0 && (
          <div className="space-y-4 animate-fade-in-up stagger-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-widest opacity-40">Recent Activity</h3>
              <button 
                onClick={() => navigate('history')}
                className="text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
                style={{ color: accentColor }}
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {recentHistory.map((item, idx) => (
                <div 
                  key={item.id} 
                  className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all animate-fade-in-up"
                  style={{ animationDelay: `${idx * 100}ms` }}
                  onClick={() => navigate('history')}
                >
                  <div>
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-xs opacity-50">{item.brand}</p>
                  </div>
                  <div className="text-[10px] opacity-30 text-right">
                    <div>{new Date(item.timestamp).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Slide-in Menu (if triggered) */}
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
            onClick={() => setShowMenu(false)}
          ></div>
          <div className="fixed right-0 top-0 bottom-0 w-72 bg-[#1A1F2E] border-l border-white/10 z-50 p-6 animate-slide-in-right overflow-y-auto">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Menu</h3>
                <button 
                  onClick={() => setShowMenu(false)}
                  className="p-2 rounded-full hover:bg-white/10 transition-all"
                >
                  ✕
                </button>
              </div>
              
              <nav className="space-y-2">
                {[
                  { label: 'Home', screen: 'home' as Screen },
                  { label: 'Scan Product', screen: 'scan' as Screen },
                  { label: 'Advanced Tools', screen: 'tools' as Screen },
                  { label: 'History & Favorites', screen: 'history' as Screen },
                  { label: 'Settings', screen: 'settings' as Screen },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => { navigate(item.screen); setShowMenu(false); }}
                    className="w-full text-left p-3 rounded-xl hover:bg-white/10 transition-all font-semibold text-sm"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
