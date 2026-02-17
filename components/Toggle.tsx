
import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false
}) => {
  return (
    <div className="flex items-center justify-between">
      {(label || description) && (
        <div className="flex-1">
          {label && <p className="text-sm font-bold">{label}</p>}
          {description && <p className="text-xs opacity-50 mt-1">{description}</p>}
        </div>
      )}
      <button
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`
          w-12 h-6 rounded-full transition-all relative
          ${checked ? 'bg-blue-600' : 'bg-white/10'}
          ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <div
          className={`
            absolute top-1 w-4 h-4 bg-white rounded-full transition-all
            ${checked ? 'left-7' : 'left-1'}
          `}
        ></div>
      </button>
    </div>
  );
};
