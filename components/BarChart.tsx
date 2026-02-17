
import React, { useEffect, useState } from 'react';

interface BarChartItem {
  label: string;
  value: number;
  maxValue?: number;
  color?: string;
}

interface BarChartProps {
  items: BarChartItem[];
  height?: number;
  animationDelay?: number;
  className?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  items,
  height = 40,
  animationDelay = 0,
  className = ''
}) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimated(true);
    }, animationDelay);

    return () => clearTimeout(timer);
  }, [animationDelay]);

  const maxValue = Math.max(...items.map(item => item.maxValue || item.value));

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item, index) => {
        const percentage = (item.value / maxValue) * 100;
        const color = item.color || '#0066FF';

        return (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/80 font-medium">{item.label}</span>
              <span className="text-white font-bold">{item.value}</span>
            </div>
            
            <div 
              className="w-full bg-white/5 rounded-full overflow-hidden"
              style={{ height: `${height}px` }}
            >
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: animated ? `${percentage}%` : '0%',
                  backgroundColor: color,
                  boxShadow: `0 0 12px ${color}80`,
                  transitionDelay: `${index * 100}ms`
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
