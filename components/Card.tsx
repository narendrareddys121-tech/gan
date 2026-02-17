
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'glass' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  hover = false,
  onClick
}) => {
  const baseClasses = 'rounded-[32px] transition-all';
  
  const variantClasses = {
    default: 'bg-white/5 border border-white/5',
    elevated: 'bg-white/5 border border-white/5 shadow-lg',
    glass: 'bg-white/5 backdrop-blur-md border border-white/10',
    gradient: 'bg-gradient-to-br from-white/10 to-white/5 border border-white/10'
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const hoverClasses = hover ? 'hover:bg-white/10 hover:scale-[1.02] cursor-pointer' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
