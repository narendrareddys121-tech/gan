
import React from 'react';

interface ChipSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  columns?: number;
  className?: string;
}

export const ChipSelect: React.FC<ChipSelectProps> = ({
  options,
  selected,
  onChange,
  columns = 3,
  className = ''
}) => {
  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(o => o !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div
      className={`grid gap-2 ${className}`}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <button
            key={option}
            onClick={() => toggleOption(option)}
            className={`
              px-4 py-3 rounded-xl text-sm font-medium
              transition-all duration-300
              active:scale-95
              ${isSelected
                ? 'bg-blue-600/20 border border-blue-600/40 text-blue-400'
                : 'border border-white/10 bg-white/5 text-white/80 hover:bg-white/10'
              }
            `}
            style={{
              boxShadow: isSelected ? '0 0 16px rgba(0, 102, 255, 0.3)' : 'none'
            }}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
};
