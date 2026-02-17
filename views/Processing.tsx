
import React, { useState, useEffect } from 'react';

export const Processing: React.FC = () => {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const stages = [
    { label: 'Detecting packaging...', duration: 2000 },
    { label: 'Extracting ingredients...', duration: 2500 },
    { label: 'Analyzing quality metrics...', duration: 2000 },
    { label: 'Generating intelligence report...', duration: 1500 }
  ];

  const totalDuration = stages.reduce((sum, s) => sum + s.duration, 0);
  const estimatedSeconds = Math.ceil(totalDuration / 1000);

  useEffect(() => {
    let currentTime = 0;
    const interval = setInterval(() => {
      currentTime += 100;
      const newProgress = Math.min((currentTime / totalDuration) * 100, 100);
      setProgress(newProgress);
      
      // Calculate which stage we're in
      let accumulatedTime = 0;
      for (let i = 0; i < stages.length; i++) {
        accumulatedTime += stages[i].duration;
        if (currentTime < accumulatedTime) {
          setStage(i);
          break;
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-12 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      <div className="relative z-10 space-y-12">
        {/* Neural Network Animation */}
        <div className="relative w-48 h-48 mx-auto">
          {/* Central Hub */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>
            <div className="absolute w-12 h-12 rounded-full bg-blue-600 shadow-lg shadow-blue-500/50 animate-pulse"></div>
          </div>
          
          {/* Orbital Nodes */}
          {[...Array(8)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-3 h-3 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 45}deg) translate(60px) rotate(-${i * 45}deg)`,
                animation: `pulse 1.5s ease-in-out infinite ${i * 0.15}s`
              }}
            ></div>
          ))}
          
          {/* Rippling Waves */}
          <div className="absolute inset-0 border-2 border-blue-500/10 rounded-full animate-ping"></div>
          <div 
            className="absolute inset-4 border-2 border-blue-500/20 rounded-full animate-ping" 
            style={{ animationDelay: '0.5s', animationDuration: '2s' }}
          ></div>
          <div 
            className="absolute inset-8 border border-blue-500/30 rounded-full animate-ping" 
            style={{ animationDelay: '1s', animationDuration: '2s' }}
          ></div>
        </div>

        {/* Status Text */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight animate-pulse">Analyzing Intelligence...</h2>
          
          {/* Current Stage */}
          <div className="h-8 overflow-hidden">
            <p className="text-sm opacity-60 transition-all duration-500 ease-out transform animate-fade-in-up">
              {stages[stage].label}
            </p>
          </div>

          {/* Stage Indicators */}
          <div className="flex justify-center gap-2 pt-2">
            {stages.map((_, i) => (
              <div 
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i < stage ? 'w-8 bg-blue-500' : 
                  i === stage ? 'w-12 bg-blue-500 animate-pulse' : 
                  'w-6 bg-white/10'
                }`}
              ></div>
            ))}
          </div>

          {/* Estimated Time */}
          <div className="text-xs opacity-40 font-mono">
            Estimated time: ~{Math.max(1, estimatedSeconds - Math.floor((progress / 100) * estimatedSeconds))}s
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-[240px] mx-auto space-y-2">
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300 ease-linear relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer Effect */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                style={{
                  animation: 'shimmer 2s linear infinite',
                  backgroundSize: '200% 100%'
                }}
              ></div>
            </div>
          </div>
          <div className="text-xs opacity-40 text-center">{Math.round(progress)}%</div>
        </div>

        {/* Optional: Cancel button (could be added) */}
        <button className="text-xs opacity-40 hover:opacity-100 transition-opacity underline">
          Cancel
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: rotate(var(--rot, 0deg)) translate(60px) rotate(calc(-1 * var(--rot, 0deg))) scale(1); }
          50% { opacity: 1; transform: rotate(var(--rot, 0deg)) translate(70px) rotate(calc(-1 * var(--rot, 0deg))) scale(1.3); }
        }
      `}</style>
    </div>
  );
};
