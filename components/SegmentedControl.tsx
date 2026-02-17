
import React from 'react';

interface SegmentedControlOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface SegmentedControlProps {
  options: SegmentedControlOption[];
  selected: string;
  onChange: (value: string) => void;
  className?: string;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  selected,
  onChange,
  className = ''
}) => {
  return (
    <div className={`bg-white/5 border border-white/10 rounded-2xl p-1 inline-flex gap-1 ${className}`}>
      {options.map((option) => {
        const isSelected = option.value === selected;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300
              flex items-center gap-2
              ${isSelected
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'text-white/40 hover:text-white/60'
              }
            `}
          >
            {option.icon && <span className="inline-flex">{option.icon}</span>}
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
