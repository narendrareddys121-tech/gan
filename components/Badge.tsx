
import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';
export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  dismissible = false,
  onDismiss,
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center gap-1.5 font-bold uppercase tracking-widest rounded-lg transition-all';
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[8px]',
    md: 'px-2.5 py-1 text-[9px]',
    lg: 'px-3 py-1.5 text-[10px]'
  };

  const variantClasses = {
    success: 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400',
    warning: 'bg-amber-500/10 border border-amber-500/20 text-amber-400',
    danger: 'bg-red-500/10 border border-red-500/20 text-red-400',
    info: 'bg-blue-500/10 border border-blue-500/20 text-blue-400',
    neutral: 'bg-white/5 border border-white/10'
  };

  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      {icon && <span className="inline-flex">{icon}</span>}
      {children}
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-1 hover:opacity-70 transition-opacity"
          aria-label="Dismiss"
        >
          ✕
        </button>
      )}
    </span>
  );
};
