
import React, { useMemo, useEffect } from 'react';
import { ThemeMode, AnimationIntensity, UserProfile } from '../types';

interface ThemeWrapperProps {
  user: UserProfile;
  children: React.ReactNode;
}

export const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ user, children }) => {
  const isDark = user.theme.mode === ThemeMode.DARK;
  
  const themeStyles = useMemo(() => ({
    '--color-primary': user.theme.accentColor,
    '--color-secondary': '#7C3AED',
    '--color-background': isDark ? 'var(--color-background-dark)' : 'var(--color-background-light)',
    '--color-surface': isDark ? 'var(--color-surface-dark)' : 'var(--color-surface-light)',
    '--color-text': isDark ? 'var(--color-text-dark)' : 'var(--color-text-light)',
    '--color-text-dim': isDark ? 'var(--color-text-dim-dark)' : 'var(--color-text-dim-light)',
    '--font-size-base': `${user.theme.fontSize}px`,
  } as React.CSSProperties), [user, isDark]);

  // Set data-theme attribute on document element for CSS token support
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', user.theme.mode);
    
    // Handle reduced motion preference
    if (user.theme.animationIntensity === AnimationIntensity.MINIMAL) {
      document.documentElement.style.setProperty('--animation-duration-normal', '50ms');
      document.documentElement.style.setProperty('--animation-duration-slow', '100ms');
    } else if (user.theme.animationIntensity === AnimationIntensity.MODERATE) {
      document.documentElement.style.setProperty('--animation-duration-normal', '200ms');
      document.documentElement.style.setProperty('--animation-duration-slow', '400ms');
    } else {
      document.documentElement.style.setProperty('--animation-duration-normal', '300ms');
      document.documentElement.style.setProperty('--animation-duration-slow', '600ms');
    }
  }, [user.theme.mode, user.theme.animationIntensity]);

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
