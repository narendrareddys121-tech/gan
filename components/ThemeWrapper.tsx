
import React, { useMemo } from 'react';
import { ThemeMode, UserProfile } from '../types';

interface ThemeWrapperProps {
  user: UserProfile;
  children: React.ReactNode;
}

export const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ user, children }) => {
  const isDark = user.theme.mode === ThemeMode.DARK;
  
  const themeStyles = useMemo(() => ({
    '--color-primary': user.theme.accentColor,
    '--color-secondary': '#7C3AED',
    '--color-background': isDark ? '#0F1419' : '#F8F9FA',
    '--color-surface': isDark ? '#1A1F2E' : '#FFFFFF',
    '--color-text': isDark ? '#FFFFFF' : '#0F1419',
    '--color-text-dim': isDark ? '#9CA3AF' : '#6B7280',
    '--spacing-base': '8px',
    '--font-size': `${user.theme.fontSize}px`,
  } as React.CSSProperties), [user, isDark]);

  return (
    <div 
      style={themeStyles} 
      className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0F1419] text-white' : 'bg-[#F8F9FA] text-[#0F1419]'}`}
    >
      <div className="max-w-md mx-auto min-h-screen flex flex-col relative overflow-hidden">
        {children}
      </div>
    </div>
  );
};
