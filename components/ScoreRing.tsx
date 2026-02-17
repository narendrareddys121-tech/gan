
import React, { useEffect, useState } from 'react';

interface ScoreRingProps {
  score: number; // 0-100
  size?: number;
  strokeWidth?: number;
  animationDelay?: number;
  label?: string;
  className?: string;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 120,
  strokeWidth = 8,
  animationDelay = 0,
  label,
  className = ''
}) => {
  const [displayScore, setDisplayScore] = useState(0);
  
  // Determine color based on score
  const getColor = (s: number) => {
    if (s >= 80) return '#10B981'; // green
    if (s >= 60) return '#F59E0B'; // amber
    return '#EF4444'; // red
  };

  const color = getColor(score);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayScore / 100) * circumference;

  // Animate count-up
  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const duration = 800;
      const increment = score / (duration / 16);
      
      const counter = setInterval(() => {
        start += increment;
        if (start >= score) {
          setDisplayScore(score);
          clearInterval(counter);
        } else {
          setDisplayScore(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(counter);
    }, animationDelay);

    return () => clearTimeout(timer);
  }, [score, animationDelay]);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: 'stroke-dashoffset 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
              filter: `drop-shadow(0 0 8px ${color}80)`
            }}
          />
        </svg>
        
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div 
            className="text-4xl font-black count-up"
            style={{ color }}
          >
            {displayScore}
          </div>
          {label && (
            <div className="text-xs text-white/60 mt-1 font-medium">
              {label}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
