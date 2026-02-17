
import React, { useState, useEffect } from 'react';
import { LucideX } from 'lucide-react';

interface ProcessingProps {
  onCancel?: () => void;
}

export const Processing: React.FC<ProcessingProps> = ({ onCancel }) => {
  const [stage, setStage] = useState(0);
  const stages = [
    'Detecting packaging...',
    'Extracting ingredients...',
    'Analyzing quality metrics...',
    'Generating intelligence report...'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStage(s => (s + 1) % stages.length);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-12 relative">
      {/* Cancel button */}
      {onCancel && (
        <button 
          onClick={onCancel}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <LucideX size={20} />
        </button>
      )}
      
      <div className="relative w-48 h-48">
        {/* Brain/Neural Network Simulation Animation */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-2 h-2 bg-blue-500 rounded-full"
              style={{
                transform: `rotate(${i * 60}deg) translate(40px)`,
                animation: `neural-pulse 1.5s ease-in-out infinite ${i * 0.2}s`
              }}
            ></div>
          ))}
          <div className="w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>
        </div>
        
        {/* Rippling Waves */}
        <div className="absolute inset-0 border border-blue-500/10 rounded-full animate-ping"></div>
        <div className="absolute inset-4 border border-blue-500/20 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight">Analyzing Intelligence...</h2>
        <div className="h-6 overflow-hidden">
          <p className="text-sm opacity-50 transition-all duration-500 ease-out transform">
            {stages[stage]}
          </p>
        </div>
      </div>

      <div className="w-full max-w-[200px] h-1 bg-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all duration-[6000ms] ease-linear"
          style={{ width: '100%' }}
        ></div>
      </div>

      <style>{`
        @keyframes neural-pulse {
          0%, 100% { 
            opacity: 0.3; 
            transform: rotate(${0}deg) translate(40px) scale(1); 
          }
          50% { 
            opacity: 1; 
            transform: rotate(${0}deg) translate(60px) scale(1.5); 
          }
        }
      `}</style>
    </div>
  );
};
