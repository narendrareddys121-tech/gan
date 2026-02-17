
import React from 'react';
import { LucideCheck } from 'lucide-react';

interface Step {
  label: string;
  icon?: React.ReactNode;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({
  steps,
  currentStep,
  className = ''
}) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isUpcoming = index > currentStep;

        return (
          <React.Fragment key={index}>
            {/* Step Circle */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  transition-all duration-500 relative
                  ${isCompleted
                    ? 'bg-emerald-500 text-white'
                    : isCurrent
                    ? 'bg-blue-600 text-white scale-110'
                    : 'bg-white/5 text-white/40'
                  }
                `}
                style={{
                  boxShadow: isCurrent ? '0 0 20px rgba(0, 102, 255, 0.5)' : 'none'
                }}
              >
                {isCompleted ? (
                  <LucideCheck size={24} strokeWidth={3} />
                ) : step.icon ? (
                  step.icon
                ) : (
                  <span className="text-sm font-bold">{index + 1}</span>
                )}
              </div>
              <span
                className={`
                  text-xs font-medium text-center max-w-[80px]
                  transition-all duration-500
                  ${isCurrent ? 'text-white' : 'text-white/60'}
                `}
              >
                {step.label}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 relative">
                <div className="absolute inset-0 bg-white/10" />
                <div
                  className={`
                    absolute inset-0 transition-all duration-500
                    ${isCompleted ? 'bg-emerald-500' : 'bg-transparent'}
                  `}
                  style={{
                    width: isCompleted ? '100%' : '0%'
                  }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
