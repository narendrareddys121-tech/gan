
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs font-bold uppercase tracking-widest opacity-40">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full bg-white/5 border border-white/10 rounded-2xl py-4 text-sm
            focus:outline-none focus:border-blue-500/50 focus:bg-white/10
            transition-all
            ${icon && iconPosition === 'left' ? 'pl-12 pr-4' : icon && iconPosition === 'right' ? 'pl-4 pr-12' : 'px-4'}
            ${error ? 'border-red-500/50' : ''}
            ${className}
          `}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40">
            {icon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-400 ml-2">{error}</p>
      )}
    </div>
  );
};
