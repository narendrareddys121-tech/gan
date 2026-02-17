
import React, { useState } from 'react';
import { LucideCheck } from 'lucide-react';

interface ColorPickerProps {
  selected: string;
  onChange: (color: string) => void;
  className?: string;
}

const PRESET_COLORS = [
  { name: 'Blue', value: '#0066FF' },
  { name: 'Violet', value: '#7C3AED' },
  { name: 'Cyan', value: '#00D9FF' },
  { name: 'Orange', value: '#FF9500' },
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  selected,
  onChange,
  className = ''
}) => {
  const [showCustom, setShowCustom] = useState(false);
  const [customColor, setCustomColor] = useState(selected);

  const isCustomColor = !PRESET_COLORS.some(c => c.value === selected);

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomColor(value);
    
    // Validate hex format
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      onChange(value);
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {PRESET_COLORS.map((color) => {
        const isSelected = selected === color.value;
        return (
          <button
            key={color.value}
            onClick={() => onChange(color.value)}
            className={`
              w-10 h-10 rounded-full transition-all duration-300
              flex items-center justify-center
              ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110' : ''}
            `}
            style={{ 
              backgroundColor: color.value,
              boxShadow: isSelected ? `0 0 20px ${color.value}80` : 'none'
            }}
            title={color.name}
          >
            {isSelected && (
              <LucideCheck size={20} className="text-white" strokeWidth={3} />
            )}
          </button>
        );
      })}

      {/* Custom Color Option */}
      <button
        onClick={() => setShowCustom(!showCustom)}
        className={`
          w-10 h-10 rounded-full transition-all duration-300
          flex items-center justify-center
          border-2 border-dashed
          ${isCustomColor && !showCustom ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110' : ''}
        `}
        style={{
          borderColor: isCustomColor ? selected : '#ffffff40',
          backgroundColor: isCustomColor ? selected : 'transparent',
          boxShadow: isCustomColor ? `0 0 20px ${selected}80` : 'none'
        }}
        title="Custom Color"
      >
        {isCustomColor && !showCustom ? (
          <LucideCheck size={20} className="text-white" strokeWidth={3} />
        ) : (
          <span className="text-white/60 text-xs font-bold">+</span>
        )}
      </button>

      {/* Custom Color Input */}
      {showCustom && (
        <div className="flex items-center gap-2 ml-2">
          <div 
            className="w-8 h-8 rounded-full border border-white/20"
            style={{ backgroundColor: customColor }}
          />
          <input
            type="text"
            value={customColor}
            onChange={handleCustomColorChange}
            placeholder="#0066FF"
            maxLength={7}
            className="
              px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg
              text-sm text-white placeholder-white/40
              focus:outline-none focus:ring-2 focus:ring-blue-500
              font-mono uppercase
              w-24
            "
          />
        </div>
      )}
    </div>
  );
};
